/**
 * Phone normalisation for the CRM (their requirement, 8 Sep 2026: the
 * number must carry a country code, e.g. +919876543210).
 *
 * The form accepts numbers as people type them (lib/validation.ts:
 * 7–15 digits, optional + or 00, spaces/dashes/brackets). This turns
 * that into one E.164-style string:
 *
 *   "+91 98765 43210"   → "+919876543210"
 *   "0091 98765 43210"  → "+919876543210"   (00 → +)
 *   "98765 43210"       → "+919876543210"   (10 digits, no code → India)
 *   "09876543210"       → "+919876543210"   (trunk 0 + 10 digits → India)
 *   "919876543210"      → "+919876543210"   (12 digits starting 91 → India)
 *   "+44 20 7946 0000"  → "+442079460000"
 *   "44 20 7946 0000"   → "+442079460000"   (any other → assume the
 *                                            digits already include a code)
 *
 * ASSUMPTION (flagged in docs/CRM_INTEGRATION.md): a bare 10-digit
 * number is treated as Indian. The site markets a Mangalore project to
 * Indian and NRI buyers; a visitor abroad who omits their country code
 * is the one case this gets wrong, and the number as typed travels in
 * `details.phone_as_typed` so nothing is lost.
 */
const DEFAULT_COUNTRY_CODE = "91";

export function normalisePhone(raw: string): string {
  const trimmed = raw.trim();
  const hasPlus = trimmed.startsWith("+") || trimmed.startsWith("00");
  let digits = trimmed.replace(/\D/g, "");
  if (trimmed.startsWith("00")) digits = digits.slice(2);
  if (!digits) return trimmed;

  if (hasPlus) return `+${digits}`;
  if (digits.length === 10) return `+${DEFAULT_COUNTRY_CODE}${digits}`;
  if (digits.length === 11 && digits.startsWith("0")) return `+${DEFAULT_COUNTRY_CODE}${digits.slice(1)}`;
  if (digits.length === 12 && digits.startsWith(DEFAULT_COUNTRY_CODE)) return `+${digits}`;
  return `+${digits}`;
}
