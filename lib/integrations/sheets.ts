/**
 * GOOGLE SHEETS LEAD LEDGER — server-side only.
 *
 * Second, INDEPENDENT destination for every valid enquiry: a Google
 * Sheet owned by the business, written through a Google Apps Script web
 * app bound to that sheet (see integrations/google-sheets/Code.gs and
 * docs/GOOGLE_SHEETS_LEADS.md). The website POSTs one JSON body per
 * lead; the script appends a row and answers { ok: true }.
 *
 * Independence rules:
 *  - written for EVERY valid lead, whatever the CRM did — a CRM failure
 *    never blocks it. The row carries the CRM verdict (noted_in_crm
 *    TRUE/FALSE + crm_note), so the sheet itself shows which leads
 *    still need a manual CRM push;
 *  - a shared secret (server-only env var) travels in the body because
 *    Apps Script cannot read request headers;
 *  - one attempt per submission, bounded wait, no automatic retry;
 *  - keyed by `lead_id`: when the visitor is asked to submit again
 *    (CRM failure), the retry carries the SAME lead ID and the script
 *    UPDATES that row instead of appending — so a lead the CRM accepts
 *    on the second go flips from FALSE to TRUE in place, and the
 *    `attempt` column shows how many submissions it took.
 */

import type { LeadRecord } from "@/lib/actions/submitEnquiry";
import type { DeliveryOutcome } from "@/lib/integrations/crm";

/** Apps Script cold starts can take a few seconds; allow a bit longer than the CRM. */
const LEDGER_TIMEOUT_MS = 15_000;

export type LedgerOutcome =
  | { recorded: true }
  | { recorded: false; cause: "not_configured" | "rejected" | "timeout" | "network" };

/**
 * CRM verdict for the sheet: a real TRUE/FALSE in `noted_in_crm` (TRUE
 * only when the CRM acknowledged the lead) plus a short reason in
 * `crm_note` whenever it is FALSE.
 */
export function describeCrmOutcome(crm: DeliveryOutcome): { notedInCrm: boolean; note: string } {
  if (crm.delivered) return { notedInCrm: true, note: "" };
  if (crm.cause === "not_configured") return { notedInCrm: false, note: "CRM not configured" };
  const note =
    crm.cause === "rejected"
      ? `CRM rejected the lead${crm.status ? ` (HTTP ${crm.status})` : ""}`
      : crm.cause === "timeout"
        ? "CRM did not respond in time"
        : "Could not reach the CRM";
  return { notedInCrm: false, note };
}

/** Flat, column-friendly row. Keys become the sheet's header row. */
export function toLedgerRow(lead: LeadRecord, crm: DeliveryOutcome) {
  return {
    lead_id: lead.meta.leadId,
    submitted_at: lead.meta.submittedAt,
    name: lead.lead.name ?? "",
    email: lead.lead.email ?? "",
    mobile: lead.lead.mobile ?? "",
    city: lead.lead.city ?? "",
    source_ui: lead.source.ui,
    attempt: lead.meta.attempt,
    utm_source: lead.source.utm_source ?? "",
    utm_medium: lead.source.utm_medium ?? "",
    utm_campaign: lead.source.utm_campaign ?? "",
    utm_term: lead.source.utm_term ?? "",
    utm_content: lead.source.utm_content ?? "",
    referrer: lead.source.referrer ?? "",
    landing_page: lead.source.landing_page ?? "",
    consent_text: lead.consent.text,
    consent_at: lead.consent.recordedAt,
    site: lead.meta.site,
    noted_in_crm: describeCrmOutcome(crm).notedInCrm,
    crm_note: describeCrmOutcome(crm).note,
    crm_lead_id: crm.delivered && crm.leadId ? crm.leadId : "",
    crm_checked_at: new Date().toISOString(),
  };
}

export async function recordLeadInLedger(lead: LeadRecord, crm: DeliveryOutcome): Promise<LedgerOutcome> {
  const endpoint = process.env.LEADS_SHEET_WEBHOOK_URL;
  const secret = process.env.LEADS_SHEET_WEBHOOK_SECRET;
  if (!endpoint || !secret) return { recorded: false, cause: "not_configured" };

  let res: Response;
  try {
    res = await fetch(endpoint, {
      method: "POST",
      // text/plain avoids a CORS preflight that Apps Script cannot answer;
      // the script parses the body as JSON regardless of the header.
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ secret, row: toLedgerRow(lead, crm) }),
      signal: AbortSignal.timeout(LEDGER_TIMEOUT_MS),
      redirect: "follow", // Apps Script answers POSTs with a 302 to the result
      cache: "no-store",
    });
  } catch (err) {
    const timedOut = err instanceof Error && err.name === "TimeoutError";
    const detail = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    console.error(`[ledger] sheet write ${timedOut ? "timed out" : "failed (network)"}: ${detail}`);
    return { recorded: false, cause: timedOut ? "timeout" : "network" };
  }

  // Apps Script returns 200 even for script-level errors, so the body's
  // own { ok } flag is the real verdict.
  let body: { ok?: boolean; error?: string } | undefined;
  try {
    body = JSON.parse(await res.text());
  } catch {
    body = undefined;
  }
  if (!res.ok || !body?.ok) {
    console.error(
      `[ledger] sheet rejected the row (HTTP ${res.status})${body?.error ? `: ${String(body.error).slice(0, 200)}` : ""}`,
    );
    return { recorded: false, cause: "rejected" };
  }
  return { recorded: true };
}
