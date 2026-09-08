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
 * Response (JSON):      { "ok": true } | { "ok": false, "error": "..." }
 */

// Change this to a long random value, then use the SAME value on the website.
var SHARED_SECRET = "REPLACE-WITH-A-LONG-RANDOM-SECRET";
// Name of the tab that receives leads (created if missing).
var SHEET_NAME = "Leads";
// Column order. Any extra keys the website sends are appended after these.
var COLUMNS = [
  "lead_id", "submitted_at", "name", "email", "mobile", "city", "source_ui",
  "noted_in_crm", "crm_note", "crm_lead_id", "crm_checked_at",
  "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
  "referrer", "landing_page", "consent_text", "consent_at", "site",
];

function doPost(e) {
  // Concurrent submissions are serialised here so two leads can never
  // write the same row or race the header; each append takes well under
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

    var values = headers.map(function (h) {
      if (h === "received_at") return new Date();
      var v = row[h];
      if (v === undefined || v === null) return "";
      return typeof v === "boolean" ? v : String(v); // keep TRUE/FALSE real booleans
    });
    sheet.appendRow(values);

    // Make leads the CRM did NOT accept impossible to miss.
    var statusCol = headers.indexOf("noted_in_crm") + 1;
    if (statusCol > 0) {
      var last = sheet.getLastRow();
      var cell = sheet.getRange(last, statusCol);
      if (row.noted_in_crm === true) cell.setBackground("#e3f4e6");
      else cell.setBackground("#fde2dd").setFontWeight("bold");
    }
    return respond({ ok: true, lead_id: row.lead_id || "" });
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
