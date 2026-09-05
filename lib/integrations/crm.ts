/**
 * CRM INTEGRATION BOUNDARY — server-side only.
 *
 * This module is the ONLY place that knows how leads leave the website.
 * It is imported exclusively by the "use server" action in
 * lib/actions/submitEnquiry.ts, so nothing here (endpoint, credentials,
 * request shape, response shape) can reach the browser bundle.
 *
 * STATUS: the external CRM agency has not yet supplied its API contract
 * (see docs/CRM_INTEGRATION.md for the full list of what is awaited).
 * Until then the delivery target is the generic ENQUIRY_WEBHOOK_URL:
 * the website lead record below is POSTed as JSON and any 2xx counts as
 * an acknowledged lead. NOTHING about the future CRM is assumed here.
 *
 * WHEN THE CRM SPEC ARRIVES, change only:
 *   1. `toCrmRequest()` — map the LeadRecord onto the CRM's field names.
 *   2. `fromCrmResponse()` — read leadId / brochureUrl from its response.
 *   3. `buildHeaders()` — the CRM's authentication (server-side secrets
 *      via environment variables, never NEXT_PUBLIC_*).
 *   4. Environment variables in .env.example / the deploy platform.
 * The form UI, hook, validation and success UI need no changes.
 */

import type { LeadRecord } from "@/lib/actions/submitEnquiry";

/** How long the website waits for the lead destination to acknowledge. */
const DELIVERY_TIMEOUT_MS = 10_000;

/**
 * Normalized outcome of a delivery attempt. The website never sees raw
 * responses — only this. `leadId` / `brochureUrl` are optional because
 * the CRM may not return either; the UI must not depend on them.
 */
export type DeliveryOutcome =
  | { delivered: true; leadId?: string; brochureUrl?: string }
  | { delivered: false; cause: "not_configured" | "rejected" | "timeout" | "network" };

/**
 * Request mapping — the website LeadRecord → the destination's body.
 * Today: the lead record itself (generic webhook, no CRM assumptions).
 * TODO(CRM): map onto the CRM's exact field names once specified.
 */
function toCrmRequest(lead: LeadRecord): unknown {
  return lead;
}

/**
 * Response mapping — the destination's body → optional lead metadata.
 * Today: nothing is read from the body, because no response contract
 * exists yet; a 2xx status alone means "acknowledged".
 * TODO(CRM): extract the CRM's lead identifier and, if the CRM delivers
 * the brochure (approach B), its brochure URL.
 */
function fromCrmResponse(body: unknown): { leadId?: string; brochureUrl?: string } {
  void body; // intentionally unread until the CRM response contract exists
  return {};
}

/**
 * Authentication headers. None today — the generic webhook is unauthenticated.
 * TODO(CRM): add the CRM's auth scheme from server-only env vars.
 */
function buildHeaders(): Record<string, string> {
  return { "Content-Type": "application/json", Accept: "application/json" };
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
    console.error(`[enquiry] delivery ${timedOut ? "timed out" : "failed (network)"}`);
    return { delivered: false, cause: timedOut ? "timeout" : "network" };
  }

  if (!res.ok) {
    // Log status only — never the body, which may echo the payload.
    console.error(`[enquiry] destination rejected the lead (HTTP ${res.status})`);
    return { delivered: false, cause: "rejected" };
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
