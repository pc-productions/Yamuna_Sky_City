# Yamuna Sky City — CRM Integration Handoff

**Audience:** the CRM agency and the website developers.
**Status:** the website's enquiry pipeline is production-ready and
integration-ready. It is waiting on the CRM API specification. Nothing
about the CRM has been assumed or stubbed — every item below is blank
until the agency supplies it.

## How the website side works today

```
Browser                              Server (Next.js, Vercel)
───────────────────────────────      ─────────────────────────────────────────
EnquiryForm (modal / contact)
  → useEnquiryForm (validation,
    double-submit guard,
    first-touch attribution)
  → submitEnquiry()  ── "use server" ─▶ re-validates, builds LeadRecord
                                        → lib/integrations/crm.ts
                                          deliverLead(): ONE attempt,
                                          10s timeout, no auto-retry
                                        ◀ normalized DeliveryOutcome
  ◀ normalized SubmitResult
  success UI + brochure access
  (ONLY on confirmed delivery)
```

* **Single integration point:** `lib/integrations/crm.ts` (server-only).
  When the spec arrives, only its three mapping functions
  (`toCrmRequest`, `fromCrmResponse`, `buildHeaders`) and environment
  variables change. No UI, hook, validation or success-state code changes.
* **Current destination:** the generic `ENQUIRY_WEBHOOK_URL`
  (server-side env var). The website POSTs the *website lead record*
  below as JSON; any **2xx** response is treated as an acknowledged lead.
  Unset → the site shows an honest "not available yet" state and never
  fakes success.
* **Honesty rule:** the thank-you / brochure state is shown only after
  the destination acknowledges the lead. Any failure keeps the form,
  its values, and offers retry.
* **No automatic retries** — a retry after a lost response could create a
  duplicate lead. Retries are manual (the user resubmits).

## The website lead record (what the website can provide)

This is the website's own structure, **not** the CRM's contract. The
adapter will map it onto whatever field names the CRM requires.

```json
{
  "lead": {
    "name":   "string (required, ≤200 chars)",
    "email":  "string (required, validated format)",
    "mobile": "string as typed, e.g. \"+91 98765 43210\" (required, 7–15 digits)",
    "city":   "string (optional)"
  },
  "consent": {
    "agreed": true,
    "text": "I agree to be contacted by Yamuna Sky City regarding this enquiry.",
    "recordedAt": "ISO-8601 timestamp"
  },
  "source": {
    "ui": "modal | contact-section",
    "utm_source": "optional", "utm_medium": "optional", "utm_campaign": "optional",
    "utm_term": "optional", "utm_content": "optional",
    "referrer": "optional external referrer URL",
    "landing_page": "optional path + query of the first page in the session"
  },
  "meta": { "submittedAt": "ISO-8601 timestamp", "site": "yamuna-sky-city-website" }
}
```

Notes: the mobile number is delivered as typed (validated to 7–15
digits with optional +/00 and formatting characters). If the CRM
requires E.164 or a split country code, say so and the adapter will
normalise it. `source.ui` is the on-site origin; the `utm_*` /
`referrer` / `landing_page` fields are marketing attribution — the two
are kept distinct so the CRM can use either or both.

## What the CRM agency needs to provide

A fuller, agency-facing questionnaire covering the same ground in more
detail lives in `docs/CRM_AGENCY_REQUIREMENTS.md` — send that file to
the agency; the summary table below is the developer checklist.

Please fill in every item. Blank items block integration.

| # | Item | Value |
|---|------|-------|
| 1 | API endpoint (lead creation) | |
| 2 | HTTP method | |
| 3 | Authentication method (header/token/HMAC/OAuth…) and how credentials are issued | |
| 4 | Staging endpoint | |
| 5 | Production endpoint | |
| 6 | Required fields | |
| 7 | Optional fields | |
| 8 | Exact field names (JSON keys) | |
| 9 | Expected field formats (phone format, country code, encoding, max lengths) | |
| 10 | Success response (status + body; where is the lead identifier?) | |
| 11 | Error response (status + body; validation errors vs system errors) | |
| 12 | HTTP status codes used | |
| 13 | Duplicate lead behaviour (same email/phone resubmitted — reject? merge? new lead?) | |
| 14 | Retry expectations (is the endpoint idempotent? idempotency key supported?) | |
| 15 | Rate limits | |
| 16 | CORS requirements (N/A if server-to-server — the website calls from its server, not the browser; confirm) | |
| 17 | Lead source values (accepted values / enum for on-site origin) | |
| 18 | UTM / attribution fields (which of the above you accept, and their names) | |
| 19 | Consent fields (how consent + consent text + timestamp should be sent) | |
| 20 | Brochure delivery mechanism (website-hosted file / CRM sends it / CRM returns a URL) | |
| 21 | Brochure URL / response behaviour (if the CRM returns a URL: field name, expiry, auth) | |
| 22 | Timeout expectations (typical + max response time; the website waits 10 s) | |

Also helpful: a sample successful request/response pair and a sample
rejected one; an IP allow-list requirement, if any (Vercel egress IPs
are not fixed); and a test lead convention so QA submissions can be
filtered out.

## Security model (do not change)

* Credentials and the endpoint live only in **server-side environment
  variables** (`ENQUIRY_WEBHOOK_URL` today; CRM auth vars later). Never
  `NEXT_PUBLIC_*`, never in source control, never in the browser.
* The browser never talks to the CRM; the Next.js server does.
* User-facing errors are generic. Destination status codes are logged
  server-side only; response bodies are never logged.

## Brochure

No approved brochure asset exists in the repository yet. Access is
resolved in `lib/brochure.ts` only from a confirmed successful
submission, with this precedence: CRM-returned URL (if the agency
provides one) → website-hosted file (`brochure.href` in
`content/site.ts`). While neither is configured, the success state
shows an honest "we will share the brochure shortly" line instead of a
dead link.

## Exact next steps once the specification arrives

1. Add the CRM's environment variables to `.env.example` (names only)
   and to the Vercel project (values), server-side only.
2. In `lib/integrations/crm.ts`: implement `buildHeaders()` (auth),
   `toCrmRequest()` (field mapping) and `fromCrmResponse()` (lead id /
   brochure URL). Point delivery at the CRM endpoint variable.
3. If the brochure is website-hosted, drop the approved PDF under
   `public/media/brochure/` and set `brochure.href` in `content/site.ts`.
4. Submit a test lead against the staging endpoint; confirm the lead
   appears in the CRM and the success/brochure state renders.
5. Repeat against production, then remove any test leads.
