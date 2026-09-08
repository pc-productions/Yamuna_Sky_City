/**
 * Lead reference + retry token — server-side only (node:crypto).
 * Imported by the "use server" action in lib/actions/submitEnquiry.ts.
 *
 * LEAD ID  `YSC-YYYYMMDD-XXXXXXXX`: date for humans, 8 random characters
 * from an unambiguous 32-letter alphabet (2^40 ≈ a trillion combinations
 * per day) so concurrent submissions across independent serverless
 * instances cannot collide in practice. Issued server-side from a
 * cryptographic source, never by the browser.
 *
 * RETRY TOKEN  When a submission could not be confirmed by the CRM the
 * visitor is asked to submit again. The server hands the browser an
 * opaque, HMAC-signed token carrying { leadId, attempt } so the retry
 *   - reuses the SAME lead ID (one row in the sheet, one reference on
 *     the thank-you screen, one `lead_id` for the CRM to dedupe on), and
 *   - lets the server, not the browser, count how many times the CRM
 *     has failed for this lead (the count decides when the brochure is
 *     released on the strength of the sheet alone).
 * The browser cannot forge or bump a token: the signature is keyed by a
 * server-only secret. Anything that fails verification is ignored and
 * the submission is treated as a fresh first attempt.
 */

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const LEAD_ID_PATTERN = /^YSC-\d{8}-[A-Z2-9]{8}$/;

export function generateLeadId(isoNow: string): string {
  const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I
  const bytes = randomBytes(8);
  let suffix = "";
  for (let i = 0; i < 8; i++) suffix += ALPHABET[bytes[i] % ALPHABET.length];
  return `YSC-${isoNow.slice(0, 10).replace(/-/g, "")}-${suffix}`;
}

export type RetryClaim = { leadId: string; attempt: number };

const MAX_ATTEMPT = 99;

/**
 * Signing key: the ledger's shared secret (always set when the sheet is
 * configured), else the CRM webhook URL (server-only, unguessable). With
 * neither there is no lead destination at all, so no token is needed.
 */
function signingKey(): string | undefined {
  return process.env.LEADS_SHEET_WEBHOOK_SECRET || process.env.ENQUIRY_WEBHOOK_URL || undefined;
}

function sign(body: string, key: string): string {
  return createHmac("sha256", key).update(body).digest("base64url");
}

export function issueRetryToken(claim: RetryClaim): string | undefined {
  const key = signingKey();
  if (!key) return undefined;
  const body = `${claim.leadId}.${claim.attempt}`;
  return `${body}.${sign(body, key)}`;
}

export function verifyRetryToken(token: unknown): RetryClaim | undefined {
  if (typeof token !== "string" || token.length > 200) return undefined;
  const key = signingKey();
  if (!key) return undefined;
  const parts = token.split(".");
  if (parts.length !== 3) return undefined;
  const [leadId, attemptText, signature] = parts;
  if (!LEAD_ID_PATTERN.test(leadId)) return undefined;
  const attempt = Number(attemptText);
  if (!Number.isInteger(attempt) || attempt < 1 || attempt > MAX_ATTEMPT) return undefined;
  const expected = sign(`${leadId}.${attempt}`, key);
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return undefined;
  return { leadId, attempt };
}
