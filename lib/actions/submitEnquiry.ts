"use server";

import { consentField, enquiryFields } from "@/content/form";
import { validateForm } from "@/lib/validation";
import { deliverLead } from "@/lib/integrations/crm";
import { recordLeadInLedger } from "@/lib/integrations/sheets";
import { generateLeadId, issueRetryToken, verifyRetryToken } from "@/lib/leadReference";
import type { Attribution } from "@/lib/attribution";

/**
 * Server-side enquiry submission — the single call the UI makes.
 *
 *   EnquiryForm → useEnquiryForm → submitEnquiry() → lib/integrations/crm
 *
 * This action owns what the website vouches for: it re-validates the
 * submission, assembles the normalized LeadRecord (fields + consent +
 * UI source + marketing attribution + timestamp), hands it to both lead
 * destinations in sequence (CRM, then the sheet with the CRM verdict),
 * and returns a normalized SubmitResult the UI can render without
 * knowing anything about either.
 *
 * Every lead gets a website-issued ID (YSC-YYYYMMDD-XXXXXXXX) that travels
 * to both destinations, is shown to the visitor as a reference, and is
 * the key for reconciling the two.
 *
 * Two independent destinations (lib/integrations/*):
 *   1. the CRM webhook (crm.ts) — the sales pipeline;
 *   2. the Google Sheets ledger (sheets.ts) — the business's own backup
 *      of every lead, so the data survives any change of CRM provider.
 * The CRM is called first; the ledger row is then written WITH the
 * CRM's verdict (saved / not saved + reason), so the sheet itself shows
 * which leads still need to be pushed into the CRM by hand. The ledger
 * is written whatever the CRM did — a CRM failure never blocks it.
 *
 * HONESTY RULE: `ok: true` is returned ONLY when at least one configured
 * destination acknowledged the lead — i.e. the business really holds it.
 * Neither configured → `not_configured`, never success. A destination
 * that failed while the other succeeded is logged server-side
 * ("[enquiry]" / "[ledger]" in the platform logs) for reconciliation.
 *
 * BROCHURE POLICY (business rule, enforced here, not in the browser):
 *   - CRM accepted the lead            → thank-you + brochure at once.
 *   - CRM failed, sheet has the lead   → 1st time: keep the form and ask
 *     the visitor to submit again (`reason: "retry"`). The retry carries
 *     a signed token so it reuses the SAME lead ID and the server knows
 *     it is attempt 2. If the CRM fails AGAIN and the sheet has the lead,
 *     the visitor gets the thank-you + brochure anyway: the business
 *     holds the lead in its own ledger (marked NOT saved in CRM, to be
 *     pushed by hand) and a CRM outage must not cost a client.
 *   - CRM failed, sheet failed too     → error, retry (no limit).
 *   - CRM not configured, sheet ok     → there is nothing to retry
 *     against; the ledger alone confirms the lead (brochure at once).
 */

export type EnquiryPayload = {
  fields: Record<string, string>;
  consent: boolean;
  /** UI origin of the submission, e.g. "modal" | "contact-section". */
  source: string;
  /** Marketing attribution captured client-side (may be empty). */
  attribution?: Attribution;
  /** Spam signals: hidden honeypot value and ms between mount and submit. */
  honeypot?: string;
  elapsedMs?: number;
  /** Returned by a previous unsuccessful attempt; ties the retry to the same lead. */
  retryToken?: string;
};

/** The website's own lead record — what the integration boundary receives. */
export type LeadRecord = {
  lead: Record<string, string>;
  consent: { agreed: true; text: string; recordedAt: string };
  source: { ui: string } & Attribution;
  meta: { leadId: string; submittedAt: string; attempt: number; site: "yamuna-sky-city-website" };
};

export type SubmitResult =
  | {
      ok: true;
      /** Website-issued reference (always present on success). */
      leadId: string;
      /** Which destination vouches for the lead: the CRM, or the sheet ledger after the CRM failed repeatedly. */
      capturedBy: "crm" | "ledger";
      /** The CRM's own identifier, when it returned one. */
      crmLeadId?: string;
      brochureUrl?: string;
    }
  | {
      ok: false;
      /**
       * "retry": the lead is safe in the ledger but the CRM did not take
       * it yet — the UI keeps the form and asks for one more submit.
       */
      reason: "invalid" | "not_configured" | "failed" | "retry";
      /** Safe, user-facing text only — never destination internals. */
      error: string;
      /** Send back on the next submit so it counts as the same lead. */
      retryToken?: string;
    };

const MAX_FIELD_LENGTH = 200;
/**
 * How many times the CRM may fail for one lead before the brochure is
 * released on the strength of the sheet ledger alone.
 */
const CRM_ATTEMPTS_BEFORE_LEDGER_FALLBACK = 2;
/**
 * Visitor-facing wording. Deliberately generic: the visitor must never
 * learn WHICH backend failed or why (no "CRM", no "sheet", no reasons) —
 * those details go to the server logs only.
 */
const RETRY_MESSAGE = "A temporary server issue interrupted your submission. Please click Submit Again.";
const FAILED_MESSAGE = "A temporary server issue interrupted your submission. Please try again.";
/** Submissions faster than this after the form mounted are treated as bots. */
const MIN_SUBMIT_MS = 1_500;

export async function submitEnquiry(payload: EnquiryPayload): Promise<SubmitResult> {
  // Defense in depth: never trust the browser's validation alone.
  const values = Object.fromEntries(
    enquiryFields.map((f) => [f.id, String(payload.fields?.[f.id] ?? "").trim().slice(0, MAX_FIELD_LENGTH)]),
  );
  const errors = validateForm(enquiryFields, { ...values, consent: payload.consent === true }, true);
  if (Object.keys(errors).length > 0 || payload.consent !== true) {
    return { ok: false, reason: "invalid", error: "Please check the highlighted fields." };
  }

  // Spam protection (no third-party service): a filled honeypot or an
  // impossibly fast submission is dropped before it reaches the CRM.
  // A real visitor who somehow trips this can simply submit again.
  const honeypotFilled = typeof payload.honeypot === "string" && payload.honeypot.trim() !== "";
  const tooFast = typeof payload.elapsedMs === "number" && payload.elapsedMs >= 0 && payload.elapsedMs < MIN_SUBMIT_MS;
  if (honeypotFilled || tooFast) {
    console.warn(`[enquiry] blocked as spam (${honeypotFilled ? "honeypot" : "too fast"})`);
    return { ok: false, reason: "invalid", error: "Please try again." };
  }

  const now = new Date().toISOString();
  // A valid retry token means "same lead, next attempt"; anything else
  // (absent, tampered, from another deployment) starts a fresh lead.
  const retry = verifyRetryToken(payload.retryToken);
  const leadId = retry?.leadId ?? generateLeadId(now);
  const attempt = retry ? retry.attempt + 1 : 1;
  const record: LeadRecord = {
    lead: values,
    consent: { agreed: true, text: consentField.label, recordedAt: now },
    source: { ui: String(payload.source ?? "unknown").slice(0, 64), ...sanitizeAttribution(payload.attribution) },
    meta: { leadId, submittedAt: now, attempt, site: "yamuna-sky-city-website" },
  };

  // CRM first, then the ledger row carrying the CRM verdict. The ledger
  // is written regardless of what the CRM returned.
  const outcome = await deliverLead(record);
  const ledger = await recordLeadInLedger(record, outcome);

  const crmConfigured = !(outcome.delivered === false && outcome.cause === "not_configured");
  const ledgerConfigured = !(ledger.recorded === false && ledger.cause === "not_configured");

  if (!crmConfigured && !ledgerConfigured) {
    // Development visibility only — this is NOT lead delivery.
    console.warn(
      "[enquiry] No lead destination configured (ENQUIRY_WEBHOOK_URL and LEADS_SHEET_WEBHOOK_URL unset). Enquiry NOT delivered.",
    );
    return { ok: false, reason: "not_configured", error: "Enquiry submissions are not available yet." };
  }

  // Reconciliation trail: a configured destination that did not accept
  // the lead while the other did is the case the ledger exists for.
  if (ledgerConfigured && !ledger.recorded && outcome.delivered) {
    console.error(`[ledger] ${leadId}: sheet write failed (${ledger.cause}); lead IS in the CRM${outcome.leadId ? ` (CRM id ${outcome.leadId})` : ""}.`);
  }

  if (outcome.delivered) {
    return {
      ok: true,
      leadId,
      capturedBy: "crm",
      ...(outcome.leadId ? { crmLeadId: outcome.leadId } : {}),
      ...(outcome.brochureUrl ? { brochureUrl: outcome.brochureUrl } : {}),
    };
  }

  const retryToken = issueRetryToken({ leadId, attempt });

  if (ledger.recorded) {
    if (!crmConfigured) {
      // No CRM to wait for: the ledger is the only destination.
      return { ok: true, leadId, capturedBy: "ledger" };
    }
    if (attempt >= CRM_ATTEMPTS_BEFORE_LEDGER_FALLBACK) {
      console.error(
        `[enquiry] ${leadId}: CRM failed ${attempt} times (${outcome.cause}); lead IS in the sheet ledger (marked NOT saved) — brochure released on the ledger. Re-push to CRM manually.`,
      );
      return { ok: true, leadId, capturedBy: "ledger" };
    }
    console.warn(
      `[enquiry] ${leadId}: attempt ${attempt} — CRM did not accept the lead (${outcome.cause}); it IS in the sheet ledger (marked NOT saved); visitor asked to submit again.`,
    );
    return {
      ok: false,
      reason: "retry",
      error: RETRY_MESSAGE,
      ...(retryToken ? { retryToken } : {}),
    };
  }

  const timedOut =
    (outcome.delivered === false && outcome.cause === "timeout") ||
    (ledger.recorded === false && ledger.cause === "timeout");
  return {
    ok: false,
    reason: "failed",
    error: timedOut ? "The server took too long to respond. Please try again." : FAILED_MESSAGE,
    ...(retryToken ? { retryToken } : {}),
  };
}

/** Attribution comes from the browser: whitelist keys and cap lengths. */
function sanitizeAttribution(a?: Attribution): Attribution {
  if (!a) return {};
  const keys: (keyof Attribution)[] = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "referrer",
    "landing_page",
  ];
  const out: Attribution = {};
  for (const k of keys) {
    const v = a[k];
    if (typeof v === "string" && v.trim()) out[k] = v.trim().slice(0, 500);
  }
  return out;
}
