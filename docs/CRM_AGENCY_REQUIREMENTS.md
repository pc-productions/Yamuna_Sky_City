# Yamuna Sky City Website — Information Required from the CRM Agency

**Purpose:** everything the website team needs from the CRM agency to
connect the website enquiry form to the CRM.
**Who fills this in:** the CRM agency.
**Who receives it:** the website team (pc-productions).
**Status:** the website side is complete and tested. Integration is
blocked only on the answers below. Nothing about the CRM has been
assumed — every field is blank on purpose.

Please answer every item. Where an item does not apply, write "N/A"
and a one-line reason rather than leaving it blank.

---

## 0. What the website will send you (for context)

The website submits one lead per form submission, server-to-server
(from the website's own server, never from the visitor's browser),
as a JSON POST. This is the website's internal record; we will map it
to whatever your API requires once you tell us the field names.

| Website field | Type | Notes |
|---|---|---|
| `lead.name` | string, required | up to 200 characters |
| `lead.email` | string, required | validated email format |
| `lead.mobile` | string, required | as typed by the visitor, e.g. `+91 98765 43210`; 7–15 digits, optional `+`/`00`, spaces, dashes, brackets |
| `lead.city` | string, optional | free text |
| `consent.agreed` | boolean, always `true` | the form cannot be submitted without consent |
| `consent.text` | string | exact consent wording the visitor agreed to |
| `consent.recordedAt` | ISO-8601 timestamp | when consent was given |
| `source.ui` | `"modal"` or `"contact-section"` | where on the site the form was submitted |
| `source.utm_source` … `source.utm_content` | string, optional | first-touch UTM parameters for the session |
| `source.referrer` | string, optional | external referrer URL |
| `source.landing_page` | string, optional | first page path (+query) of the session |
| `meta.submittedAt` | ISO-8601 timestamp | server time of submission |
| `meta.site` | `"yamuna-sky-city-website"` | constant identifier |

Behaviour you should know:

- **One attempt per submission, 10-second wait, no automatic retry.**
  A retry after a lost response could create a duplicate lead, so
  retries are only ever manual (the visitor resubmits).
- **Any 2xx response is treated as "lead accepted".** Only then does the
  visitor see the thank-you / brochure state. Any other outcome keeps
  the form and asks the visitor to try again.
- **Credentials never reach the browser.** They live only in the
  website's server environment.

---

## 1. Endpoints and environments

| # | Question | Your answer |
|---|---|---|
| 1.1 | Lead-creation endpoint URL — **staging** | |
| 1.2 | Lead-creation endpoint URL — **production** | |
| 1.3 | HTTP method (POST / PUT / other) | |
| 1.4 | Content type expected (`application/json` / form-encoded / other) | |
| 1.5 | Is there any other endpoint we must call (e.g. token refresh, lookup) before creating a lead? | |
| 1.6 | Do staging and production use different credentials? | |
| 1.7 | Can staging leads be created freely without affecting real sales data? | |

## 2. Authentication and access

| # | Question | Your answer |
|---|---|---|
| 2.1 | Authentication scheme (API key header / Bearer token / HMAC signature / OAuth2 client-credentials / Basic / none) | |
| 2.2 | Exact header name(s) and value format (e.g. `Authorization: Bearer <token>`, `X-API-Key: <key>`) | |
| 2.3 | How credentials are issued to us, and through which secure channel (please **do not** email or paste them into chat) | |
| 2.4 | Do tokens expire? If so: lifetime, and how to refresh | |
| 2.5 | Do you require an **IP allow-list**? (Note: the website runs on Vercel, whose outbound IPs are not fixed. If an allow-list is mandatory, tell us so we can plan a static-egress solution.) | |
| 2.6 | Is TLS 1.2+ with a publicly trusted certificate used on all endpoints? | |
| 2.7 | Who is our technical contact for credential rotation or revocation? | |

## 3. Request schema

| # | Question | Your answer |
|---|---|---|
| 3.1 | Full list of **required** fields, with exact JSON key names | |
| 3.2 | Full list of **optional** fields, with exact JSON key names | |
| 3.3 | Field for the visitor's **name** — single field, or split first/last? | |
| 3.4 | Field for **email** | |
| 3.5 | Field for **mobile**; required format (E.164 `+919876543210`, digits only, separate country-code field, other) | |
| 3.6 | Field for **city** (or nearest equivalent) | |
| 3.7 | Maximum lengths / character restrictions for any field | |
| 3.8 | Is the request body **flat** or **nested**? Please attach one complete sample request | |
| 3.9 | Any fields you require that the website **does not currently collect** (e.g. budget, unit type, message)? List them — adding them is a form change and needs client approval | |
| 3.10 | Any fixed/constant values we must always send (project ID, campaign ID, source ID, owner ID, pipeline/stage ID)? Please give the exact values for staging and production | |

## 4. Lead source and attribution

| # | Question | Your answer |
|---|---|---|
| 4.1 | Field name for **lead source**, and the accepted values (is it free text or a fixed list?) | |
| 4.2 | What value should identify "website — enquiry modal" vs "website — contact section"? (or a single "Website" value) | |
| 4.3 | Do you accept UTM parameters? Field names for `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content` | |
| 4.4 | Do you accept the **referrer URL** and **landing page**? Field names | |
| 4.5 | If you do not accept some attribution fields, may we put them into a notes/description field? Which one? | |

## 5. Consent and compliance

| # | Question | Your answer |
|---|---|---|
| 5.1 | Field(s) for **consent given** (boolean) | |
| 5.2 | Field for the **consent text** the visitor agreed to (or confirm it is not stored) | |
| 5.3 | Field for the **consent timestamp** | |
| 5.4 | Any data-residency or retention requirements the website must respect | |
| 5.5 | Is there a **do-not-contact / opt-out** state we should be aware of when re-submitting an existing contact? | |

## 6. Responses

| # | Question | Your answer |
|---|---|---|
| 6.1 | **Success** response: HTTP status code and complete sample body | |
| 6.2 | Where in the success body is the **lead / record ID**? (JSON path) | |
| 6.3 | **Validation error** response: status code and sample body (e.g. missing field, bad phone) | |
| 6.4 | **Auth error** response: status code and sample body | |
| 6.5 | **System / server error** response: status code and sample body | |
| 6.6 | Complete list of HTTP status codes the endpoint can return | |
| 6.7 | Can the endpoint return **200 with an error inside the body**? If yes, how do we detect it? (This matters: we treat 2xx as accepted.) | |
| 6.8 | Is the response **synchronous** (lead is created when we get 2xx) or **queued** (2xx means "received, will process later")? | |

## 7. Duplicates, retries and idempotency

| # | Question | Your answer |
|---|---|---|
| 7.1 | What happens when the **same email or phone** is submitted again — new lead, merged into existing, rejected? Which field decides? | |
| 7.2 | Is a duplicate reported as success or as an error? Status code and body | |
| 7.3 | Do you support an **idempotency key** header so a safe retry never creates a duplicate? Header name | |
| 7.4 | If our request **times out** on our side (10 s) but you received it, is the lead still created? | |

## 8. Limits and performance

| # | Question | Your answer |
|---|---|---|
| 8.1 | **Rate limits** (requests per second/minute/day) and the response when exceeded | |
| 8.2 | **Typical** and **maximum** response time for lead creation | |
| 8.3 | Is the 10-second timeout the website uses acceptable? If you need longer, state the value | |
| 8.4 | Maximum request body size | |
| 8.5 | Planned maintenance windows or known downtime patterns | |

## 9. Brochure delivery

The website shows a brochure download only after the CRM has accepted
the lead. It supports three models — please tell us which applies.

| # | Question | Your answer |
|---|---|---|
| 9.1 | Who delivers the brochure? (a) website hosts the PDF and shows a download; (b) CRM emails/WhatsApps it to the lead; (c) CRM returns a URL in the response; (d) combination | |
| 9.2 | If (c): field name of the URL in the response, whether it expires, and whether it needs authentication to open | |
| 9.3 | If (b): expected delay before the visitor receives it, so our on-screen message is accurate | |
| 9.4 | If (a): who supplies the approved brochure PDF, and is there one version or several (per unit type / language)? | |
| 9.5 | Should the CRM be told that the visitor was **offered / downloaded** the brochure? If so, how | |

## 10. Testing and go-live

| # | Question | Your answer |
|---|---|---|
| 10.1 | Test credentials for staging (delivered via the secure channel from 2.3) | |
| 10.2 | A **test-lead convention** (e.g. a specific name prefix, email domain, or flag) so QA submissions can be identified and deleted | |
| 10.3 | How we can **verify** a test lead landed (CRM login for the website team, or a screenshot/confirmation from you) | |
| 10.4 | One complete **sample request + success response** pair, and one **sample rejected** pair | |
| 10.5 | Any Postman collection / OpenAPI spec / API documentation link | |
| 10.6 | Change-notification process: how will you tell us before the API, fields or credentials change? | |
| 10.7 | Support contact and escalation path for integration issues after launch | |

---

## What happens once we receive this

1. Credentials are added to the website's server environment only.
2. The website's single integration module is mapped to your schema.
3. Test leads are submitted against staging and verified with you.
4. The same is repeated against production, test leads are removed.
5. The brochure flow is switched on according to section 9.

No changes to the visible form are needed unless section 3.9 lists
fields we do not currently collect.
