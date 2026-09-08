# Google Sheets Lead Ledger — setup

Every valid website enquiry is sent to **two independent destinations**,
one after the other: the CRM webhook first, then a Google Sheet owned by
the business, whose row records what the CRM answered.
The sheet is the business's own record of every lead, so the data stays
with Yamuna Sky City whatever happens to the CRM provider or relationship.

The website side is finished (`lib/integrations/sheets.ts`). What remains
is a one-time setup in the business's Google account, about 10 minutes.

## 1. Create the sheet

1. In the Google account that should own the data, create a new Google
   Sheet, e.g. **"Yamuna Sky City — Website Leads"**.
2. Leave it empty. The script creates a tab called **Leads** with a bold,
   frozen header row on the first lead.

## 2. Add the script

1. In the sheet: **Extensions → Apps Script**.
2. Delete the placeholder code and paste the contents of
   `integrations/google-sheets/Code.gs` from this repository.
3. At the top of the script, replace `REPLACE-WITH-A-LONG-RANDOM-SECRET`
   with a long random value (30+ characters). Keep it — it is needed in
   step 4.
4. Save (Ctrl/Cmd + S).

## 3. Deploy it as a web app

1. **Deploy → New deployment**.
2. Type: **Web app**.
3. Execute as: **Me**. Who has access: **Anyone**.
   ("Anyone" only means the URL accepts requests; the secret inside the
   request is what authorises them. Nobody can read the sheet through it.)
4. Click **Deploy**, approve the permissions for this account, and copy
   the **Web app URL** (ends in `/exec`).

Re-deploying after editing the script: **Deploy → Manage deployments →
Edit (pencil) → Version: New version → Deploy**. The URL stays the same.

## 4. Connect the website

In Vercel → Project → Settings → Environment Variables (Production, and
Preview if test leads on previews are wanted), add:

| Variable | Value |
|---|---|
| `LEADS_SHEET_WEBHOOK_URL` | the Web app URL from step 3 |
| `LEADS_SHEET_WEBHOOK_SECRET` | the secret from step 2 |

Redeploy. Both are server-only; nothing reaches the browser.

## 5. Test

Submit one enquiry from the site with the name `TEST - website`. A row
should appear in the **Leads** tab within a few seconds. Delete it
afterwards.

## What lands in the sheet

One row per lead:

| Column | Meaning |
|---|---|
| `received_at` | stamped by the sheet when the row arrives |
| `lead_id` | **website-issued reference**, e.g. `YSC-20260908-7K3Q9F2M` — unique per lead, also sent to the CRM and shown to the visitor on the thank-you screen |
| `submitted_at`, `name`, `email`, `mobile`, `city` | the enquiry |
| `source_ui` | `modal` or `contact-section` |
| `noted_in_crm` | **TRUE/FALSE** — TRUE only when the CRM acknowledged the lead; FALSE when it rejected it, did not respond in time, could not be reached, or is not configured. FALSE cells are highlighted red by the script so they cannot be missed |
| `crm_note` | the reason whenever `noted_in_crm` is FALSE (`CRM rejected the lead`, `CRM did not respond in time`, `Could not reach the CRM`, `CRM not configured`) |
| `crm_lead_id` | the CRM's own identifier, when the CRM returns one |
| `crm_checked_at` | when the CRM verdict was recorded |
| `attempt` | how many times the visitor submitted this lead (`1` normally; `2` when they were asked to submit again after a CRM failure) |
| `utm_source` … `utm_content`, `referrer`, `landing_page` | marketing attribution |
| `consent_text`, `consent_at`, `site` | consent record |

If the website ever sends an extra column, the script adds it to the
header automatically.

**One row per lead, keyed by `lead_id`.** When a visitor is asked to
submit again (see below), the website sends the same `lead_id`; the
script finds that row and updates it in place — `noted_in_crm`,
`crm_note`, `attempt` and `crm_checked_at` then reflect the latest
attempt, and `received_at` keeps the first arrival. Rows are never
duplicated by a retry.

## Confidential

The CRM developer is not to know this sheet exists. Do not mention it
in anything sent to them (see `docs/CRM_INTEGRATION.md`); the webhook
payload carries nothing about it.

## How the two destinations interact

- The website calls the **CRM first**, then writes the sheet row **with
  the CRM's verdict**. The sheet row is written whatever the CRM did — a
  CRM failure or timeout never prevents it.
- The visitor sees the thank-you screen (with their `lead_id` as a
  reference and the brochure) as soon as the **CRM** accepts the lead.
  If the CRM fails, the visitor is asked to submit **once more**; if it
  fails again and the lead is in the sheet, they get the thank-you and
  brochure on the strength of the sheet alone — the business genuinely
  holds the lead, and a CRM outage must not cost a client. Full policy:
  `docs/CRM_INTEGRATION.md`.
- **Filter the sheet on `noted_in_crm` = FALSE** to find leads that
  still need to be entered in the CRM by hand; use `lead_id` when
  referring to them. The platform logs carry the same information
  (`[enquiry]` / `[ledger]` in Vercel → Logs).
- One attempt per destination per submission, no automatic retries. A
  visitor's manual resubmit reuses the lead's `lead_id`, so it updates
  the existing sheet row rather than adding one.

## Many visitors at once

Each submission runs in its own serverless invocation with no shared
state, so simultaneous visitors never interfere on the website side.
Lead IDs come from a cryptographic random source (8 characters, about a
trillion combinations per day). In the sheet, the Apps Script takes a
script-wide lock for each write, so concurrent rows are written one
after another and the header can never be created twice. Google allows
30 simultaneous executions per script, far above a marketing site's
peak; a submission that could not get the lock within 12 s is reported
as a sheet failure (the CRM still has it, and the platform logs say so).

## Keeping the sheet safe

- Share the sheet only with people who need lead data; it contains
  personal data covered by the privacy policy.
- Do not put the secret anywhere public. To rotate it: change it in the
  script, deploy a new version, update the Vercel variable.
- The sheet is not a CRM: no de-duplication, no status tracking. It is
  the ledger of record.
