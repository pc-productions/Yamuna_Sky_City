/**
 * CRM INTEGRATION BOUNDARY — server-side only.
 *
 * This module is the ONLY place that knows how leads leave the website.
 * It is imported exclusively by the "use server" action in
 * lib/actions/submitEnquiry.ts, so nothing here (endpoint, credentials,
 * request shape, response shape) can reach the browser bundle.
 *
 * STATUS (confirmed by the CRM developer, SparkOs, 8 Sep 2026 — see
 * docs/CRM_INTEGRATION.md for the full contract):
 *   - endpoint: n8n webhook in ENQUIRY_WEBHOOK_URL (server-only, never
 *     committed); POST application/json; any 2xx = accepted (they
 *     acknowledge at once and process asynchronously);
 *   - auth: shared secret in the `X-Webhook-Secret` header, from
 *     ENQUIRY_WEBHOOK_SECRET (server-only);
 *   - body: flat top-level keys `name, email, phone, project,
 *     utm_source, utm_medium, utm_campaign` (their sample payload) —
 *     phone normalised to carry a country code (lib/phone.ts) — plus
 *     `lead_id` and a `details` object with everything else the website
 *     records (city, attribution, consent, timestamps, attempt);
 *   - errors: 400 validation, 401 auth, 500 system, all non-2xx;
 *   - duplicates: matched on email/phone and updated, so a visitor's
 *     manual resubmit is safe;
 *   - no lead ID or brochure URL comes back; `fromCrmResponse` stays empty.
 *
 * OPEN: they asked for fixed `campaign ID` and `owner` values on every
 * lead but did not supply the values. Add them to `toCrmRequest` once
 * given (or they set them inside the workflow — the better place for a
 * constant).
 */

import type { LeadRecord } from "@/lib/actions/submitEnquiry";
import { normalisePhone } from "@/lib/phone";

/** How long the website waits for the lead destination to acknowledge. */
const DELIVERY_TIMEOUT_MS = 10_000;

/** "Inquired project name" — the one project this website markets. */
const PROJECT_NAME = "Yamuna Sky City";

/**
 * Normalized outcome of a delivery attempt. The website never sees raw
 * responses — only this. `leadId` / `brochureUrl` are optional because
 * the CRM may not return either; the UI must not depend on them.
 */
export type DeliveryOutcome =
  | { delivered: true; leadId?: string; brochureUrl?: string }
  | { delivered: false; cause: "not_configured" | "rejected" | "timeout" | "network"; status?: number };

/**
 * Request mapping — the website LeadRecord → the CRM developer's webhook body.
 *
 * Top level matches the sample payload SparkOs supplied: the four lead
 * fields plus the three UTM keys, flat, so the n8n workflow reads them
 * directly. `phone` is normalised to carry a country code (their A3
 * answer); the number exactly as typed is kept in `details`. `lead_id`
 * is the website-issued reference (also on the visitor's thank-you
 * screen). `details` carries everything else the website records; the
 * workflow can ignore it. `details.attempt` > 1 means the visitor was
 * asked to submit again after a failed attempt: the SAME lead_id and
 * the same email/phone are sent again, which their workflow treats as
 * an update, not a new lead.
 *
 * CONFIDENTIALITY: nothing sent here may reveal that the business also
 * keeps its own lead ledger (the Google Sheet) — no sheet status, no
 * ledger IDs, no hints in key names.
 */
export function toCrmRequest(lead: LeadRecord) {
  const src = lead.source;
  return {
    lead_id: lead.meta.leadId,
    name: lead.lead.name,
    email: lead.lead.email,
    phone: normalisePhone(lead.lead.mobile),
    project: PROJECT_NAME,
    utm_source: src.utm_source ?? "",
    utm_medium: src.utm_medium ?? "",
    utm_campaign: src.utm_campaign ?? "",
    ...(src.utm_term ? { utm_term: src.utm_term } : {}),
    ...(src.utm_content ? { utm_content: src.utm_content } : {}),
    details: {
      lead_id: lead.meta.leadId,
      phone_as_typed: lead.lead.mobile,
      city: lead.lead.city ?? "",
      source: lead.source,
      consent: lead.consent,
      submittedAt: lead.meta.submittedAt,
      attempt: lead.meta.attempt,
      site: lead.meta.site,
    },
  };
}

/**
 * Response mapping — the destination's body → optional lead metadata.
 * Confirmed 8 Sep 2026: the webhook answers 200 with a success body and
 * returns no lead/record ID and no brochure URL, so nothing is read from
 * it; a 2xx status alone means "acknowledged".
 */
function fromCrmResponse(body: unknown): { leadId?: string; brochureUrl?: string } {
  void body; // intentionally unread until the CRM response contract exists
  return {};
}

/**
 * Authentication: the shared secret SparkOs issued, sent as
 * `X-Webhook-Secret` (their B1 answer). The value lives ONLY in the
 * server-side env var ENQUIRY_WEBHOOK_SECRET — never in the repo, never
 * NEXT_PUBLIC_*. While unset the request goes out without the header
 * and the CRM answers 401, which the logs show as a rejection.
 */
function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json", Accept: "application/json" };
  const secret = process.env.ENQUIRY_WEBHOOK_SECRET;
  if (secret) headers["X-Webhook-Secret"] = secret;
  else console.warn("[enquiry] ENQUIRY_WEBHOOK_SECRET is not set — the CRM will reject the lead with 401.");
  return headers;
}

/**
 * Deliver one lead. Exactly ONE attempt, no automatic retries: a retry
 * after a lost response could create a duplicate lead in the CRM. The
 * user can retry manually from the (preserved) form if this fails.
 */
export async function deliverLead(lead: LeadRecord): Promise<DeliveryOutcome> {
  const endpoint = process.env.ENQUIRY_WEBHOOK_URL;
  if (!endpoint) return { delivered: false, cause: "not_configured" };

  let res: Response;
  try {
    res = await fetch(endpoint, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(toCrmRequest(lead)),
      signal: AbortSignal.timeout(DELIVERY_TIMEOUT_MS),
      cache: "no-store",
    });
  } catch (err) {
    const timedOut = err instanceof Error && err.name === "TimeoutError";
    // Network failures carry a cause (DNS, TLS, refused) worth logging.
    const detail =
      err instanceof Error
        ? [err.name, err.message, (err as { cause?: { message?: string } }).cause?.message]
            .filter(Boolean)
            .join(" / ")
        : String(err);
    console.error(
      `[enquiry] delivery ${timedOut ? "timed out" : "failed (network)"}: ${detail}`,
    );
    return { delivered: false, cause: timedOut ? "timeout" : "network" };
  }

  if (!res.ok) {
    // Server-side diagnostics only: status plus a short excerpt of the
    // error body (n8n, for example, explains a 404 as "workflow not
    // active"). Error bodies describe the failure rather than echoing
    // the lead, and the excerpt is capped so logs stay small.
    let excerpt = "";
    try {
      excerpt = (await res.text()).replace(/\s+/g, " ").slice(0, 300);
    } catch {
      excerpt = "";
    }
    console.error(
      `[enquiry] destination rejected the lead (HTTP ${res.status})${excerpt ? `: ${excerpt}` : ""}`,
    );
    return { delivered: false, cause: "rejected", status: res.status };
  }

  // A malformed or empty body on a 2xx is still an acknowledged lead.
  let body: unknown = undefined;
  try {
    const text = await res.text();
    body = text ? JSON.parse(text) : undefined;
  } catch {
    body = undefined;
  }

  return { delivered: true, ...fromCrmResponse(body) };
}
