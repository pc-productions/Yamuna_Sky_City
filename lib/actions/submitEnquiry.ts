"use server";

/**
 * Vendor-agnostic lead submission layer.
 *
 * No CRM/email/API backend is wired up yet. When one is chosen, set
 * ENQUIRY_WEBHOOK_URL (and any auth headers it needs) as server-only
 * environment variables — never expose them to the client — and this
 * function is the only place that needs to change; the UI layer (the
 * Contact section form and the Enquiry modal) is unaffected.
 */

export type EnquiryPayload = {
  fields: Record<string, string>;
  consent: boolean;
  source: string;
};

export type SubmitResult = { ok: true } | { ok: false; error: string };

export async function submitEnquiry(
  payload: EnquiryPayload,
): Promise<SubmitResult> {
  const endpoint = process.env.ENQUIRY_WEBHOOK_URL;

  if (!endpoint) {
    console.log("[enquiry] submission received (no backend configured yet):", payload);
    return { ok: true };
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      return { ok: false, error: "Submission failed. Please try again." };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}
