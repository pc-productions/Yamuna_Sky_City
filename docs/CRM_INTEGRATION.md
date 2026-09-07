# Yamuna Sky City — CRM Integration Handoff

**Audience:** the CRM developer and the website developers.
**Status (2026-09-05):** the CRM developer has supplied a webhook and the four
fields it wants. The website maps leads onto that shape (see "Agreed
contract" below). Remaining open items are listed in the table further
down — nothing beyond what the CRM developer stated has been assumed.

## Agreed contract (from the CRM developer, 2026-09-05)

- **Endpoint:** `https://n8n.thesparksocial.in/webhook/yamuna-google-ads`
  (n8n). Set it as `ENQUIRY_WEBHOOK_URL` in the Vercel project — server
  side only; it is not committed anywhere in code.
- **Method / body:** `POST`, `application/json`.
- **Fields requested:** lead name, email, phone number, inquired project
  name. The website sends them flat at the top level, plus its own
  context under `details`:

```json
{
  "name":    "Visitor name",
  "email":   "visitor@example.com",
  "phone":   "+91 98765 43210",
  "project": "Yamuna Sky City",
  "details": {
    "city": "",
    "source": { "ui": "modal", "utm_source": "…", "referrer": "…", "landing_page": "…" },
    "consent": { "agreed": true, "text": "…", "recordedAt": "ISO-8601" },
    "submittedAt": "ISO-8601",
    "site": "yamuna-sky-city-website"
  }
}
```

- **Success:** any `2xx` response. Nothing is read from the body.

**To confirm with the CRM developer before go-live**

1. The key names `name` / `email` / `phone` / `project` are the website's
   proposal — the CRM developer did not specify names. If their n8n workflow
   expects different keys (or the Google Ads lead-form webhook schema,
   given the endpoint's name), change `toCrmRequest()` in
   `lib/integrations/crm.ts` only.
2. No authentication was given. The webhook is treated as unauthenticated;
   if they add a token, it goes in `buildHeaders()` from a server-only env var.
3. Phone is delivered as typed; say if E.164 is required.
4. What the webhook returns, how duplicates are handled, and brochure
   delivery (website-hosted `brochure.href` is assumed meanwhile).
5. A single URL was given — confirm whether test leads are acceptable on
   it, and agree a test-lead marker (e.g. name prefixed `TEST -`).

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
* **Current destination:** the CRM developer's webhook via `ENQUIRY_WEBHOOK_URL`
  (server-side env var). The website POSTs the mapped body shown above;
  any **2xx** response is treated as an acknowledged lead. Unset → the
  site shows an honest "not available yet" state and never fakes success.
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
* User-facing errors are generic. Destination status codes are logged
  server-side only; response bodies are never logged.

## Brochure

No approved brochure asset exists in the repository yet. Access is
resolved in `lib/brochure.ts` only from a confirmed successful
submission, with this precedence: CRM-returned URL (if the CRM developer
provides one) → website-hosted file (`brochure.href` in
`content/site.ts`). While neither is configured, the success state
shows an honest "we will share the brochure shortly" line instead of a
dead link.

## Exact next steps

1. In Vercel → Project → Settings → Environment Variables, add
   `ENQUIRY_WEBHOOK_URL` = the webhook URL above (Production, and Preview
   if test leads are acceptable). Redeploy.
2. Submit one clearly marked test enquiry (name `TEST - website`) from
   the live site; ask the CRM developer to confirm the lead arrived with all
   four fields populated, and delete it.
3. If any key name differs from what their workflow reads, adjust
   `toCrmRequest()` and redeploy — no other file changes.
4. When the approved brochure PDF exists, place it under
   `public/media/brochure/` and set `brochure.href` in `content/site.ts`.
