"use server";

import { consentField, enquiryFields } from "@/content/form";
import { validateForm } from "@/lib/validation";
import { deliverLead } from "@/lib/integrations/crm";
import type { Attribution } from "@/lib/attribution";

/**
 * Server-side enquiry submission — the single call the UI makes.
 *
 *   EnquiryForm → useEnquiryForm → submitEnquiry() → lib/integrations/crm
 *
 * This action owns what the website vouches for: it re-validates the
 * submission, assembles the normalized LeadRecord (fields + consent +
 * UI source + marketing attribution + timestamp), hands it to the CRM
 * boundary, and returns a normalized SubmitResult the UI can render
 * without knowing anything about the destination.
 *
 * HONESTY RULE: `ok: true` is returned ONLY when the destination
 * acknowledged the lead. No backend → `not_configured`, never success.
 */

export type EnquiryPayload = {
  fields: Record<string, string>;
  consent: boolean;
  /** UI origin of the submission, e.g. "modal" | "contact-section". */
  source: string;
  /** Marketing attribution captured client-side (may be empty). */
  attribution?: Attribution;
};

/** The website's own lead record — what the integration boundary receives. */
export type LeadRecord = {
  lead: Record<string, string>;
  consent: { agreed: true; text: string; recordedAt: string };
  source: { ui: string } & Attribution;
  meta: { submittedAt: string; site: "yamuna-sky-city-website" };
};

export type SubmitResult =
  | { ok: true; leadId?: string; brochureUrl?: string }
  | {
      ok: false;
      reason: "invalid" | "not_configured" | "failed";
      /** Safe, user-facing text only — never destination internals. */
      error: string;
    };

const MAX_FIELD_LENGTH = 200;

export async function submitEnquiry(payload: EnquiryPayload): Promise<SubmitResult> {
  // Defense in depth: never trust the browser's validation alone.
  const values = Object.fromEntries(
    enquiryFields.map((f) => [f.id, String(payload.fields?.[f.id] ?? "").trim().slice(0, MAX_FIELD_LENGTH)]),
  );
  const errors = validateForm(enquiryFields, { ...values, consent: payload.consent === true }, true);
  if (Object.keys(errors).length > 0 || payload.consent !== true) {
    return { ok: false, reason: "invalid", error: "Please check the highlighted fields." };
  }

  const now = new Date().toISOString();
  const record: LeadRecord = {
    lead: values,
    consent: { agreed: true, text: consentField.label, recordedAt: now },
    source: { ui: String(payload.source ?? "unknown").slice(0, 64), ...sanitizeAttribution(payload.attribution) },
    meta: { submittedAt: now, site: "yamuna-sky-city-website" },
  };

  const outcome = await deliverLead(record);

  if (outcome.delivered) {
    return {
      ok: true,
      ...(outcome.leadId ? { leadId: outcome.leadId } : {}),
      ...(outcome.brochureUrl ? { brochureUrl: outcome.brochureUrl } : {}),
    };
  }

  if (outcome.cause === "not_configured") {
    // Development visibility only — this is NOT lead delivery.
    console.warn("[enquiry] No lead backend configured (ENQUIRY_WEBHOOK_URL unset). Enquiry NOT delivered.");
    return { ok: false, reason: "not_configured", error: "Enquiry submissions are not available yet." };
  }

  return {
    ok: false,
    reason: "failed",
    error:
      outcome.cause === "timeout"
        ? "That took too long. Please try again."
        : "Something went wrong. Please try again.",
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
