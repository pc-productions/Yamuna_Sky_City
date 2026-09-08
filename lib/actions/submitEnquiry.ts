"use server";

import { consentField, enquiryFields } from "@/content/form";
import { validateForm } from "@/lib/validation";
import { deliverLead } from "@/lib/integrations/crm";
import { recordLeadInLedger } from "@/lib/integrations/sheets";
import { randomBytes } from "node:crypto";
import type { Attribution } from "@/lib/attribution";

/**
 * Server-side enquiry submission — the single call the UI makes.
 *
 *   EnquiryForm → useEnquiryForm → submitEnquiry() → lib/integrations/crm
 *
 * This action owns what the website vouches for: it re-validates the
 * submission, assembles the normalized LeadRecord (fields + consent +
 * UI source + marketing attribution + timestamp), hands it to BOTH lead
 * destinations at once, and returns a normalized SubmitResult the UI
 * can render without knowing anything about either.
 *
 * Every lead gets a website-issued ID (YSC-YYYYMMDD-XXXXXX) that travels
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
};

/** The website's own lead record — what the integration boundary receives. */
export type LeadRecord = {
  lead: Record<string, string>;
  consent: { agreed: true; text: string; recordedAt: string };
  source: { ui: string } & Attribution;
  meta: { leadId: string; submittedAt: string; site: "yamuna-sky-city-website" };
};

export type SubmitResult =
  | {
      ok: true;
      /** Website-issued reference (always present on success). */
      leadId: string;
      /** The CRM's own identifier, when it returned one. */
      crmLeadId?: string;
      brochureUrl?: string;
    }
  | {
      ok: false;
      reason: "invalid" | "not_configured" | "failed";
      /** Safe, user-facing text only — never destination internals. */
      error: string;
    };

const MAX_FIELD_LENGTH = 200;
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
  const leadId = generateLeadId(now);
  const record: LeadRecord = {
    lead: values,
    consent: { agreed: true, text: consentField.label, recordedAt: now },
    source: { ui: String(payload.source ?? "unknown").slice(0, 64), ...sanitizeAttribution(payload.attribution) },
    meta: { leadId, submittedAt: now, site: "yamuna-sky-city-website" },
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
  if (crmConfigured && !outcome.delivered && ledger.recorded) {
    console.error(`[enquiry] ${leadId}: CRM did not accept the lead (${outcome.cause}); it IS in the sheet ledger (marked NOT saved) — re-push to CRM manually.`);
  }
  if (ledgerConfigured && !ledger.recorded && outcome.delivered) {
    console.error(`[ledger] ${leadId}: sheet write failed (${ledger.cause}); lead IS in the CRM${outcome.leadId ? ` (CRM id ${outcome.leadId})` : ""}.`);
  }

  if (outcome.delivered || ledger.recorded) {
    return {
      ok: true,
      leadId,
      ...(outcome.delivered && outcome.leadId ? { crmLeadId: outcome.leadId } : {}),
      ...(outcome.delivered && outcome.brochureUrl ? { brochureUrl: outcome.brochureUrl } : {}),
    };
  }

  const timedOut =
    (outcome.delivered === false && outcome.cause === "timeout") ||
    (ledger.recorded === false && ledger.cause === "timeout");
  return {
    ok: false,
    reason: "failed",
    error: timedOut ? "That took too long. Please try again." : "Something went wrong. Please try again.",
  };
}

/**
 * Website-issued lead reference: YSC-YYYYMMDD-XXXXXX. Date for humans,
 * 6 random characters (unambiguous alphabet, ~1 billion per day) for
 * uniqueness. Issued server-side, never by the browser.
 */
function generateLeadId(isoNow: string): string {
  const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I
  const bytes = randomBytes(6);
  let suffix = "";
  for (let i = 0; i < 6; i++) suffix += ALPHABET[bytes[i] % ALPHABET.length];
  return `YSC-${isoNow.slice(0, 10).replace(/-/g, "")}-${suffix}`;
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
