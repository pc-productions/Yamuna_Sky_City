"use server";

/**
 * Vendor-agnostic lead submission layer — the single integration boundary
 * for whichever lead destination is chosen later (CRM, API endpoint,
 * email service, Google Sheets, …).
 *
 * To connect a backend: set ENQUIRY_WEBHOOK_URL (server-only environment
 * variable — never expose integration secrets to the client) and this
 * function POSTs the payload as JSON. Nothing in the UI layer changes.
 *
 * IMPORTANT: while no backend is configured this function reports
 * `not_configured` — it must NOT pretend the enquiry was received. The UI
 * surfaces an honest "submissions not yet available" state instead of a
 * false confirmation.
 */

export type EnquiryPayload = {
  fields: Record<string, string>;
  consent: boolean;
  source: string;
};

export type SubmitResult =
  | { ok: true }
  | { ok: false; reason: "not_configured" | "failed"; error: string };

export async function submitEnquiry(
  payload: EnquiryPayload,
): Promise<SubmitResult> {
  const endpoint = process.env.ENQUIRY_WEBHOOK_URL;

  if (!endpoint) {
    // Log for development visibility only — this is not lead delivery.
    console.warn(
      "[enquiry] No submission backend configured (ENQUIRY_WEBHOOK_URL unset). Enquiry NOT delivered:",
      payload,
    );
    return {
      ok: false,
      reason: "not_configured",
      error: "Enquiry submissions are not available yet.",
    };
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      return {
        ok: false,
        reason: "failed",
        error: "Submission failed. Please try again.",
      };
    }
    return { ok: true };
  } catch {
    return {
      ok: false,
      reason: "failed",
      error: "Network error. Please try again.",
    };
  }
}
