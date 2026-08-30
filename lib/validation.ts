import type { FormFieldConfig } from "@/content/form";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Accepts an optional leading +, then 7–15 digits (with optional spaces/dashes).
const PHONE_RE = /^\+?[0-9\s-]{7,15}$/;

export type FormValues = Record<string, string> & { consent?: boolean };
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
  if (field.type === "tel" && !PHONE_RE.test(trimmed)) {
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
    const error = validateField(field, values[field.id] ?? "");
    if (error) errors[field.id] = error;
  }

  if (requireConsent && !values.consent) {
    errors.consent = "Please provide your consent to continue.";
  }

  return errors;
}
