/**
 * One way to open the site's enquiry modal from anywhere — server-rendered
 * pages included — without threading React state through the tree.
 * SiteChrome owns the modal and listens for this event (the same pattern
 * the cookie bar uses in lib/consent.ts → CONSENT_OPEN_EVENT).
 *
 * The modal is the existing EnquiryForm → submitEnquiry → CRM + sheet
 * pipeline; "Request brochure" on the Journal reuses it unchanged.
 */
export const ENQUIRY_OPEN_EVENT = "ysc:open-enquiry";

export function openEnquiry() {
  window.dispatchEvent(new CustomEvent(ENQUIRY_OPEN_EVENT));
}
