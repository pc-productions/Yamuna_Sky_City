import type { FormFieldConfig } from "@/content/form";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/**
 * Mobile numbers — validated on the DIGITS, not the typed characters, so
 * legitimate formatting never causes a rejection: "98765 43210",
 * "+91-98765-43210", "(0) 98765 43210" and "0098765..." all normalise
 * cleanly. Rules: optional leading + / 00, formatting characters
 * (spaces, dashes, dots, parentheses) allowed, and 7–15 digits in total
 * (the ITU E.164 range — covers a 10-digit Indian mobile with or without
 * the +91 country code, and NRI/international callers). Deliberately
 * not stricter: rejecting a real buyer costs more than an odd number.
 */
const PHONE_ALLOWED_RE = /^(\+|00)?[0-9\s().-]+$/;
const PHONE_DIGITS_MIN = 7;
const PHONE_DIGITS_MAX = 15;

function isValidPhone(value: string): boolean {
  if (!PHONE_ALLOWED_RE.test(value)) return false;
  const digits = value.replace(/\D/g, "").length;
  return digits >= PHONE_DIGITS_MIN && digits <= PHONE_DIGITS_MAX;
}

/** Field values keyed by field id; the consent checkbox is a boolean. */
export type FormValues = Record<string, string | boolean | undefined>;
export type FormErrors = Record<string, string>;

export function validateField(
  field: FormFieldConfig,
  value: string,
): string | undefined {
  const trimmed = value.trim();

  if (field.required && trimmed.length === 0) {
    return `${field.label} is required.`;
  }
  if (trimmed.length === 0) return undefined;

  if (field.type === "email" && !EMAIL_RE.test(trimmed)) {
    return "Enter a valid email address.";
  }
  if (field.type === "tel" && !isValidPhone(trimmed)) {
    return "Enter a valid mobile number.";
  }
  return undefined;
}

export function validateForm(
  fields: FormFieldConfig[],
  values: FormValues,
  requireConsent: boolean,
): FormErrors {
  const errors: FormErrors = {};

  for (const field of fields) {
    const error = validateField(field, String(values[field.id] ?? ""));
    if (error) errors[field.id] = error;
  }

  if (requireConsent && !values.consent) {
    errors.consent = "Please provide your consent to continue.";
  }

  return errors;
}
