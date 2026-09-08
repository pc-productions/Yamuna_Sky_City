# Yamuna Sky City — CRM Integration Handoff

**Audience:** the CRM developer and the website developers.
**Status (2026-09-05):** the CRM developer has supplied a webhook and the four
fields it wants. The website maps leads onto that shape (see "Agreed
contract" below). Remaining open items are listed in the table further
down — nothing beyond what the CRM developer stated has been assumed.

## Agreed contract (confirmed by the CRM developer, SparkOs, 8 Sep 2026)

The CRM developer returned the requirements document with every item
answered. The contract below is what the website implements; the filled
document is the source (kept by the website team, not in the repo).

| Item | Value |
|---|---|
| Endpoint | the n8n production webhook in `ENQUIRY_WEBHOOK_URL` (server-only env var; the URL is not committed) — one URL for test and production |
| Method / type | `POST`, `application/json`, from the website's server only |
| Authentication | shared secret in the **`X-Webhook-Secret`** header, from `ENQUIRY_WEBHOOK_SECRET` (server-only). No other header, no IP allow-list |
| Success | any `2xx` (they answer `200` with a success body at once and process the lead **asynchronously** in the workflow; no lead ID or brochure URL is returned) |
| Errors | `400` validation, `401` bad/missing secret, `500` system — never an error inside a `200` |
| Response time | acknowledgement expected within 5 s; the website waits up to 10 s |
| Duplicates | matched on email/phone and **updated** (2xx), so a visitor's manual resubmit is safe. They asked us not to resubmit blindly; the website never retries automatically |
| Test leads | allowed on the production URL; the name must start with **`Google-TEST-`** (their marker). Verified through n8n's execution history and a confirmation from SparkOs |
| Rate limits | none imposed; genuine submissions only |
| Brochure | website-hosted PDF (the current `brochure.href` flow); nothing comes from the CRM |
| Changes / support | SparkOs will notify the website team before the URL, fields or workflow change; SparkOs integration support after launch |

**Body the website sends** (their sample payload, plus `lead_id` and
`details`):

```json
{
  "lead_id":      "YSC-20260908-7K3Q9F2M",
  "name":         "Visitor name",
  "email":        "visitor@example.com",
  "phone":        "+919876543210",
  "project":      "Yamuna Sky City",
  "utm_source":   "google ads",
  "utm_medium":   "cpc",
  "utm_campaign": "launch",
  "details": {
    "lead_id": "YSC-20260908-7K3Q9F2M",
    "phone_as_typed": "98765 43210",
    "city": "",
    "source": { "ui": "modal", "utm_source": "…", "referrer": "…", "landing_page": "…" },
    "consent": { "agreed": true, "text": "…", "recordedAt": "ISO-8601" },
    "submittedAt": "ISO-8601",
    "attempt": 1,
    "site": "yamuna-sky-city-website"
  }
}
```

- `phone` carries a country code (their requirement): the number as typed
  is normalised in `lib/phone.ts` — spaces/dashes/brackets removed, `00`
  → `+`, and a bare 10-digit number treated as Indian (`+91`). **This last
  rule is an assumption** made because the form does not ask for a country
  code; the number exactly as typed always travels in
  `details.phone_as_typed`. If the client would rather the form ask for
  the country code explicitly, that is a visible form change to approve.
- `utm_term` / `utm_content` are added at the top level only when captured.
- `details` may be ignored by the workflow; `details.attempt` > 1 means the
  visitor resubmitted after a failure (same `lead_id`, same email/phone,
  which their workflow treats as an update).

**Still open with SparkOs**

1. They want fixed **campaign ID** and **owner** values on every lead but
   did not supply the values. Best set inside the n8n workflow (they are
   constants); if they want them in the body, they must send the exact
   keys and values and `toCrmRequest()` gains two lines.
2. The shared secret was sent inside the Word document rather than over a
   secure channel. It works, but the business may want SparkOs to rotate
   it once and hand the new value over privately; rotating is a one-field
   change in Vercel.
3. They mentioned that more than the four fields would "help qualify the
   lead faster". Any additional form field is a visible change that needs
   the client's approval first.

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

* **Second destination, in sequence:** every lead is also written to
  the business's own Google Sheet (`lib/integrations/sheets.ts`, see
  `docs/GOOGLE_SHEETS_LEADS.md`) immediately after the CRM call, with
  the CRM's verdict in the row. The two are independent in outcome, not
  in timing: a CRM failure never prevents the sheet row, and a sheet
  failure never changes what the CRM received. The CRM contract below
  is unaffected.
* **Confidential from the CRM developer.** The CRM developer is not to
  know the sheet exists. Nothing in the webhook payload, in
  `docs/CRM_DEVELOPER_REQUIREMENTS.md` / `.docx`, or in any message to
  them may mention the sheet, a ledger, a backup, or the retry-to-
  brochure fallback. From their side the behaviour is simply: the
  website posts a lead, and a visitor may resubmit after a failure
  (same `lead_id`, `details.attempt` incremented).
* **Single CRM integration point:** `lib/integrations/crm.ts` (server-only).
  When the spec arrives, only its three mapping functions
  (`toCrmRequest`, `fromCrmResponse`, `buildHeaders`) and environment
  variables change. No UI, hook, validation or success-state code changes.
* **Current destination:** the CRM developer's webhook via `ENQUIRY_WEBHOOK_URL`
  (server-side env var). The website POSTs the mapped body shown above;
  any **2xx** response is treated as an acknowledged lead. Unset → the
  site shows an honest "not available yet" state and never fakes success.
* **Honesty rule:** the thank-you / brochure state is shown only after
  a destination acknowledges the lead. Any failure keeps the form, its
  values, and offers retry.
* **Brochure policy** (`lib/actions/submitEnquiry.ts`, server-side):
  1. CRM accepts the lead → thank-you + brochure immediately.
  2. CRM fails but the sheet ledger has the lead → the visitor is asked
     to submit **once more** (form kept, button reads "Submit again").
     The retry carries a server-signed token, so it reuses the **same
     `lead_id`** and the server knows it is attempt 2.
  3. CRM fails **again** and the sheet has the lead → thank-you +
     brochure anyway. The business holds the lead (sheet row marked
     `noted_in_crm` = FALSE, `attempt` = 2) and a CRM outage must not
     cost a client. Logged as `[enquiry] … brochure released on the
     ledger`.
  4. CRM and sheet both fail → error, retry without limit, no brochure.
  5. CRM not configured, sheet ok → nothing to retry against; the sheet
     alone confirms the lead.
  The visitor-facing text is generic in every case ("A temporary server
  issue interrupted your submission…"): it never names the CRM, the
  sheet, or the reason. Reasons go to the server logs only.
* **No automatic retries** — a retry after a lost response could create a
  duplicate lead. Retries are manual (the visitor resubmits); a resubmit
  sends the same `lead_id` with `details.attempt` incremented, so a CRM
  that stores `lead_id` can recognise the duplicate.

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
    "text": "I agree to be contacted regarding this enquiry.",
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

## What the CRM developer needs to provide

A fuller, developer-facing questionnaire covering the same ground in more
detail lives in `docs/CRM_DEVELOPER_REQUIREMENTS.md` — send that file to
the CRM developer; the summary table below is the developer checklist.

Please fill in every item. Blank items block integration.

| # | Item | Value |
|---|------|-------|
| 1 | API endpoint (lead creation) | Supplied: `https://n8n.thesparksocial.in/webhook/yamuna-google-ads` |
| 2 | HTTP method | POST (assumed for an n8n webhook; confirm) |
| 3 | Authentication method (header/token/HMAC/OAuth…) and how credentials are issued | |
| 4 | Staging endpoint | Not given — single URL only |
| 5 | Production endpoint | Assumed to be the URL in item 1 — confirm |
| 6 | Required fields | Supplied: lead name, email, phone number, inquired project name |
| 7 | Optional fields | |
| 8 | Exact field names (JSON keys) | Not given — website sends `name`, `email`, `phone`, `project`; confirm |
| 9 | Expected field formats (phone format, country code, encoding, max lengths) | |
| 10 | Success response (status + body; where is the lead identifier?) | |
| 11 | Error response (status + body; validation errors vs system errors) | |
| 12 | HTTP status codes used | |
| 13 | Duplicate lead behaviour (same email/phone resubmitted — reject? merge? new lead?) | |
| 14 | Retry expectations (is the endpoint idempotent? idempotency key supported?) | |
| 15 | Rate limits | |
| 16 | CORS requirements | N/A — server-to-server |
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
* User-facing errors are generic. On failure the destination's status
  code and a 300-character excerpt of its error body are logged
  server-side only (Vercel → Logs, filter `[enquiry]`); successful
  response bodies are never logged.

## Brochure

The approved brochure ships at `public/media/brochure/` and is offered
through `brochure.href` in `content/site.ts`; the CRM developer confirmed
(8 Sep 2026) that the website hosts and delivers it and nothing comes
from the CRM. Access is resolved in `lib/brochure.ts` only from a
confirmed submission (see the brochure policy above).

## Exact next steps

1. In Vercel → Project → Settings → Environment Variables (Production, and
   Preview if test leads are acceptable), make sure both are set:
   `ENQUIRY_WEBHOOK_URL` (already set) and `ENQUIRY_WEBHOOK_SECRET` (the
   value from SparkOs). Redeploy.
2. Confirm with SparkOs that the workflow is **active** (the website's
   test on 8 Sep still received n8n's "not registered" 404).
3. Submit one test enquiry named `Google-TEST-website` from the live site;
   ask SparkOs to confirm it arrived with all fields, and delete it. The
   Google Sheet row should show `noted_in_crm` = TRUE for the same
   `lead_id`.
4. Settle the open items above (campaign ID / owner values, secret
   rotation).
