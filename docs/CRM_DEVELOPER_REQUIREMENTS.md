# Yamuna Sky City Website — CRM Integration: Confirmations Required from the CRM Developer

**Purpose:** confirm the details the website team still needs so that
website enquiries land in the CRM reliably and completely.
**Who fills this in:** the CRM developer.
**Who receives it:** the website team (pc-productions).

**Where things stand:** the CRM developer has shared the webhook and the
four fields it needs (lead name, email, phone number, inquired project
name). The website already sends exactly that. What remains is a short
list of confirmations so nothing is guessed. Please answer every item;
where one does not apply, write "N/A" with a one-line reason.

---

## 1. What is agreed and already implemented

| Item | Value |
|---|---|
| Endpoint | `https://n8n.thesparksocial.in/webhook/yamuna-google-ads` |
| Method | `POST` |
| Content type | `application/json` |
| Sent from | the website's own server, never the visitor's browser |
| Success | any HTTP `2xx` response |
| Attempts | one per submission, 10-second wait, **no automatic retry** (a retry after a lost response could create a duplicate lead; the visitor can resubmit manually) |
| Visitor experience | the thank-you screen is shown **only after** the webhook answers 2xx; on any failure the form stays filled and asks the visitor to try again |

### Exact body the website sends

```json
{
  "name":    "Visitor name",
  "email":   "visitor@example.com",
  "phone":   "+91 98765 43210",
  "project": "Yamuna Sky City",
  "details": {
    "city": "Mangalore",
    "source": {
      "ui": "modal",
      "utm_source": "google",
      "utm_medium": "cpc",
      "utm_campaign": "launch",
      "utm_term": "",
      "utm_content": "",
      "referrer": "https://www.google.com/",
      "landing_page": "/?utm_source=google&utm_medium=cpc&utm_campaign=launch"
    },
    "consent": {
      "agreed": true,
      "text": "I agree to be contacted by Yamuna Sky City regarding this enquiry.",
      "recordedAt": "2026-09-07T09:48:01.212Z"
    },
    "submittedAt": "2026-09-07T09:48:01.212Z",
    "site": "yamuna-sky-city-website"
  }
}
```

| Key | Notes |
|---|---|
| `name` | required; up to 200 characters |
| `email` | required; validated format |
| `phone` | required; **as typed by the visitor** (7–15 digits, optional `+`/`00`, spaces, dashes, brackets allowed) |
| `project` | always `"Yamuna Sky City"` |
| `details.city` | optional free text, may be empty |
| `details.source.ui` | `"modal"` or `"contact-section"` — where on the site the form was used |
| `details.source.utm_*`, `referrer`, `landing_page` | first-touch marketing attribution for the session; keys are omitted when not captured |
| `details.consent` | consent flag, the exact wording agreed to, and when |
| `details.submittedAt` | server time, ISO-8601 |

The `details` object can be ignored by the workflow if not needed; it is
included so attribution and consent are not lost.

---

## 2. Please confirm

### A. Field names

| # | Question | Your answer |
|---|---|---|
| A1 | Do the top-level keys `name`, `email`, `phone`, `project` match what the n8n workflow reads? If not, give the exact keys | |
| A2 | Should `name` be split into first and last name? | |
| A3 | Phone format — as typed is fine, or do you need E.164 (`+919876543210`), digits only, or a separate country code? | |
| A4 | Is any field **required** that the website does not send (budget, unit type, message, etc.)? Adding one is a visible form change and needs client approval | |
| A5 | Any fixed values you need on every lead (campaign ID, source ID, owner, pipeline/stage)? Give the exact values | |
| A6 | The endpoint is named `google-ads`. Does the workflow expect the **Google Ads lead-form webhook schema** (`user_column_data`, `lead_id`, `google_key`, …) rather than the flat body above? If yes, please share a sample payload it accepts | |

### B. Security

| # | Question | Your answer |
|---|---|---|
| B1 | Is the webhook meant to be **unauthenticated**? If a token or secret should be sent, give the header name and how the value is issued (via a secure channel — not email or chat) | |
| B2 | Should requests carry any other identifying header (e.g. `X-Source: website`)? | |
| B3 | Any IP allow-list? The website runs on Vercel, whose outbound IPs are not fixed — please say if this is a requirement | |

### C. Response and errors

| # | Question | Your answer |
|---|---|---|
| C1 | What does the webhook return on success (status + sample body)? Is there a lead / record ID we should keep? | |
| C2 | Can it return `200` with an error inside the body? If so, how do we detect it? (We treat any 2xx as accepted) | |
| C3 | Status code and body on validation failure (e.g. bad phone) and on system failure | |
| C4 | Is lead creation **synchronous** (created when we get 2xx) or **queued**? | |
| C5 | Typical and maximum response time? Is our 10-second wait acceptable? | |

### D. Duplicates

| # | Question | Your answer |
|---|---|---|
| D1 | If the same email or phone is submitted again — new lead, merged, or rejected? Which field decides? | |
| D2 | Is a duplicate reported as success or as an error (status + body)? | |
| D3 | Do you support an idempotency key header so a safe retry never creates a duplicate? Header name | |
| D4 | If our request times out on our side but you received it, is the lead still created? | |

### E. Environments and testing

| # | Question | Your answer |
|---|---|---|
| E1 | Is this single URL production? Is there a separate **test/staging** URL? | |
| E2 | May we send **test leads** to it? Agree a marker so they can be found and deleted — proposed: `name` starting with `TEST -` | |
| E3 | How do we verify a test lead arrived (CRM access for the website team, or a confirmation from you)? | |
| E4 | Rate limits, if any, and the response when exceeded | |
| E5 | How will you notify us before the URL, fields or workflow change? | |
| E6 | Support contact for integration issues after launch | |

### F. Brochure

The website shows a brochure download only after the lead is accepted.

| # | Question | Your answer |
|---|---|---|
| F1 | Who delivers the brochure? (a) website hosts the PDF and shows a download; (b) CRM/workflow emails or WhatsApps it; (c) the webhook returns a URL in its response; (d) combination | |
| F2 | If (c): field name of the URL, whether it expires, whether it needs authentication | |
| F3 | If (b): expected delay before the visitor receives it, so our on-screen message is accurate | |
| F4 | If (a): who supplies the approved brochure PDF | |

---

## 3. What happens next

1. The website team sets the webhook URL in the hosting environment
   (server-side only) and redeploys.
2. One clearly marked test enquiry is submitted from the live site; the
   CRM developer confirms it arrived with all four fields populated and
   deletes it.
3. Any key-name or format difference from section A is a one-function
   change on the website side, no form changes.
4. The brochure flow is switched on according to section F.
