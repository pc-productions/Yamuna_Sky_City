/**
 * Yamuna Sky City — website lead ledger (Google Apps Script)
 *
 * Bound to the Google Sheet that keeps the business's own copy of every
 * website enquiry. Deployed as a Web App (Execute as: Me; Who has
 * access: Anyone) so the website's server can POST to it. Protected by a
 * shared secret that must match the LEADS_SHEET_WEBHOOK_SECRET set on
 * the website's hosting platform. Setup: docs/GOOGLE_SHEETS_LEADS.md.
 *
 * Request body (JSON):  { "secret": "...", "row": { column: value, ... } }
 * Response (JSON):      { "ok": true, "lead_id": "...", "updated": false }
 *                     | { "ok": false, "error": "..." }
 *
 * Rows are keyed by `lead_id`. A row that already exists for the lead_id
 * is UPDATED in place (the website re-sends the same lead when a visitor
 * is asked to submit again after a CRM failure); otherwise a new row is
 * appended. So each lead is exactly one row, whose noted_in_crm cell
 * reflects the LATEST attempt.
 */

// Change this to a long random value, then use the SAME value on the website.
var SHARED_SECRET = "REPLACE-WITH-A-LONG-RANDOM-SECRET";
// Name of the tab that receives leads (created if missing).
var SHEET_NAME = "Leads";
// Column order. Any extra keys the website sends are appended after these.
var COLUMNS = [
  "lead_id", "submitted_at", "name", "email", "mobile", "city", "source_ui",
  "noted_in_crm", "crm_note", "crm_lead_id", "crm_checked_at", "attempt",
  "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
  "referrer", "landing_page", "consent_text", "consent_at", "site",
];

function doPost(e) {
  // Concurrent submissions are serialised here so two leads can never
  // write the same row or race the header; each write takes well under
  // a second, so a queue of simultaneous visitors clears quickly. The
  // website waits up to 15 s for this call.
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(12000);
    var payload = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    if (!payload.secret || payload.secret !== SHARED_SECRET) {
      return respond({ ok: false, error: "unauthorized" });
    }
    var row = payload.row || {};
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    // Header row on first use; "received_at" is stamped by the sheet itself.
    var headers = ["received_at"].concat(COLUMNS);
    Object.keys(row).forEach(function (k) { if (headers.indexOf(k) === -1) headers.push(k); });
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
      sheet.setFrozenRows(1);
    } else {
      // Extend the header if the website starts sending new columns.
      var existing = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      headers = existing.filter(String);
      Object.keys(row).forEach(function (k) {
        if (headers.indexOf(k) === -1) { headers.push(k); sheet.getRange(1, headers.length).setValue(k).setFontWeight("bold"); }
      });
    }

    // Same lead again (retry after a CRM failure)? Find its row.
    var targetRow = 0;
    var idCol = headers.indexOf("lead_id") + 1;
    var lastRow = sheet.getLastRow();
    if (idCol > 0 && row.lead_id && lastRow > 1) {
      var ids = sheet.getRange(2, idCol, lastRow - 1, 1).getValues();
      for (var i = 0; i < ids.length; i++) {
        if (String(ids[i][0]) === String(row.lead_id)) { targetRow = i + 2; break; }
      }
    }

    var values = headers.map(function (h) {
      if (h === "received_at") return new Date();
      var v = row[h];
      if (v === undefined || v === null) return "";
      // keep TRUE/FALSE and numbers real so filters and formulas work
      return typeof v === "boolean" || typeof v === "number" ? v : String(v);
    });

    var updated = targetRow > 0;
    if (updated) {
      // Update in place; keep the first-received timestamp.
      values[0] = sheet.getRange(targetRow, 1).getValue() || values[0];
      sheet.getRange(targetRow, 1, 1, values.length).setValues([values]);
    } else {
      sheet.appendRow(values);
      targetRow = sheet.getLastRow();
    }

    // Make leads the CRM did NOT accept impossible to miss.
    var statusCol = headers.indexOf("noted_in_crm") + 1;
    if (statusCol > 0) {
      var cell = sheet.getRange(targetRow, statusCol);
      if (row.noted_in_crm === true) cell.setBackground("#e3f4e6").setFontWeight("normal");
      else cell.setBackground("#fde2dd").setFontWeight("bold");
    }
    return respond({ ok: true, lead_id: row.lead_id || "", updated: updated });
  } catch (err) {
    return respond({ ok: false, error: String(err && err.message ? err.message : err) });
  } finally {
    try { lock.releaseLock(); } catch (ignore) {}
  }
}

// Visiting the URL in a browser should not reveal anything.
function doGet() {
  return respond({ ok: false, error: "POST only" });
}

function respond(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
