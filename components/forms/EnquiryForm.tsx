"use client";

import { useEffect } from "react";
import { consentField, formCopy } from "@/content/form";
import { contact, ctaLabels, getWhatsAppUrl } from "@/content/site";
import { useEnquiryForm } from "@/lib/hooks/useEnquiryForm";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/forms/FormField";

/**
 * Shared enquiry form UI. Used by the Contact section and the Enquiry
 * modal — same fields, validation, and submission logic; only spacing/
 * tone differ via props so each context can look native to its surface.
 */
export function EnquiryForm({
  source,
  tone = "light",
  onSuccess,
}: {
  source: string;
  tone?: "light" | "dark";
  onSuccess?: () => void;
}) {
  const { fields, values, errors, status, errorMessage, setField, blurField, handleSubmit } =
    useEnquiryForm(source);

  const isSubmitting = status === "submitting";
  const labelTone = tone === "dark" ? "text-mist-muted" : "text-ink-muted";

  useEffect(() => {
    if (status === "success") onSuccess?.();
  }, [status, onSuccess]);

  if (status === "success") {
    return (
      <div className="flex flex-col gap-4 py-6" role="status">
        <p className={`text-lg ${tone === "dark" ? "text-mist" : "text-ink"}`}>
          {formCopy.successMessage}
        </p>
        <Button
          href={getWhatsAppUrl()}
          variant={tone === "dark" ? "outline-light" : "outline-dark"}
        >
          {ctaLabels.chatWhatsApp}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {fields.map((field) => (
        <FormField
          key={field.id}
          field={field}
          value={values[field.id] ?? ""}
          error={errors[field.id]}
          onChange={(v) => setField(field.id, v)}
          onBlur={() => blurField(field.id)}
          tone={tone}
        />
      ))}

      <div className="flex items-start gap-3">
        <input
          id="field-consent"
          type="checkbox"
          checked={Boolean(values.consent)}
          onChange={(e) => setField("consent", e.target.checked)}
          aria-invalid={Boolean(errors.consent)}
          aria-describedby={errors.consent ? "consent-error" : undefined}
          className="mt-1 size-4 shrink-0 accent-[var(--color-brand)]"
        />
        <label htmlFor="field-consent" className={`text-sm leading-snug ${labelTone}`}>
          {consentField.label}
        </label>
      </div>
      {errors.consent && (
        <p id="consent-error" role="alert" className="-mt-4 text-xs text-red-600">
          {errors.consent}
        </p>
      )}

      {status === "error" && (
        <p role="alert" className="text-sm text-red-600">
          {errorMessage ?? formCopy.errorMessageFallback}
        </p>
      )}

      <div className="flex flex-col gap-4 pt-2 sm:flex-row">
        <Button type="submit" variant="primary" disabled={isSubmitting} className="sm:flex-1">
          {isSubmitting ? formCopy.submittingLabel : formCopy.submitLabel}
        </Button>
        <Button
          href={getWhatsAppUrl()}
          variant={tone === "dark" ? "outline-light" : "outline-dark"}
          className="sm:flex-1"
        >
          {ctaLabels.chatWhatsApp}
        </Button>
      </div>
      <p className={`text-xs ${labelTone}`}>
        Or call us at{" "}
        <a href={contact.phoneHref} className="underline underline-offset-2">
          {contact.phoneDisplay}
        </a>
      </p>
    </form>
  );
}
