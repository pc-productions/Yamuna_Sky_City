/**
 * CRM INTEGRATION BOUNDARY — server-side only.
 *
 * This module is the ONLY place that knows how leads leave the website.
 * It is imported exclusively by the "use server" action in
 * lib/actions/submitEnquiry.ts, so nothing here (endpoint, credentials,
 * request shape, response shape) can reach the browser bundle.
 *
 * STATUS: the CRM developer has supplied an n8n webhook (set as
 * ENQUIRY_WEBHOOK_URL in the deploy environment — never committed) and
 * asked for: lead name, email, phone number, inquired project name.
 * `toCrmRequest()` sends exactly those four as flat top-level keys,
 * plus the website's context (source, attribution, consent, timestamp)
 * under `details` so nothing already captured is lost. Any 2xx counts
 * as an acknowledged lead.
 *
 * STILL UNCONFIRMED by the CRM developer (see docs/CRM_INTEGRATION.md):
 *   - the exact JSON key names their workflow reads (the ones below are
 *     the website's proposal — adjust here if they differ);
 *   - authentication (none was given; the webhook is treated as
 *     unauthenticated — add it in `buildHeaders()` from server-only env
 *     vars, never NEXT_PUBLIC_*);
 *   - the response body (nothing is read from it yet), duplicate
 *     handling, and brochure delivery.
 * The form UI, hook, validation and success UI need no changes for any
 * of those.
 */

import type { LeadRecord } from "@/lib/actions/submitEnquiry";

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
  | { delivered: false; cause: "not_configured" | "rejected" | "timeout" | "network" };

/**
 * Request mapping — the website LeadRecord → the CRM developer's webhook body.
 *
 * Top level = the four fields the CRM developer asked for, flat, so an n8n
 * workflow can read them directly — plus `lead_id`, the website-issued
 * reference (YSC-…) that also appears in the sheet ledger and on the
 * visitor's thank-you screen, so the two systems can be reconciled. `phone` is sent as typed (the CRM developer
 * has not asked for E.164). `project` is the inquired project name.
 * `details` carries everything else the website records; the workflow
 * can ignore it. CONFIDENTIALITY: nothing sent here may reveal that the
 * business also keeps its own lead ledger (the Google Sheet) — no sheet
 * status, no ledger IDs, no hints in key names. `details.attempt` > 1 means the visitor was asked to
 * submit again after a failed attempt: the SAME lead_id is sent again,
 * so a workflow that stores lead_id can treat it as a duplicate.
 */
export function toCrmRequest(lead: LeadRecord) {
  return {
    lead_id: lead.meta.leadId,
    name: lead.lead.name,
    email: lead.lead.email,
    phone: lead.lead.mobile,
    project: PROJECT_NAME,
    details: {
      lead_id: lead.meta.leadId,
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
 * Nothing is read from the body: the CRM developer has not described what the
 * webhook returns, so a 2xx status alone means "acknowledged".
 * TODO(CRM): extract a lead identifier / brochure URL if the CRM developer's
 * workflow returns them.
 */
function fromCrmResponse(body: unknown): { leadId?: string; brochureUrl?: string } {
  void body; // intentionally unread until the CRM response contract exists
  return {};
}

/**
 * Authentication headers. None — the CRM developer supplied no auth scheme for
 * the webhook. TODO(CRM): add one here from server-only env vars if they
 * introduce a token/secret.
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
