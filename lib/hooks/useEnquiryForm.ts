"use client";

import { useCallback, useState } from "react";
import { enquiryFields } from "@/content/form";
import { submitEnquiry } from "@/lib/actions/submitEnquiry";
import { validateField, validateForm, type FormErrors, type FormValues } from "@/lib/validation";

export type SubmitStatus =
  | "idle"
  | "submitting"
  | "success"
  | "error"
  | "not_configured";

/**
 * Shared enquiry-form state/logic used by both the Contact section form
 * and the Enquiry modal. Presentation is left entirely to the caller.
 */
export function useEnquiryForm(source: string) {
  const [values, setValues] = useState<FormValues>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const setField = useCallback((id: string, value: string | boolean) => {
    setValues((prev) => ({ ...prev, [id]: value as never }));
  }, []);

  const blurField = useCallback((id: string) => {
    const field = enquiryFields.find((f) => f.id === id);
    if (!field) return;
    setErrors((prev) => {
      const next = { ...prev };
      const message = validateField(field, String(values[id] ?? ""));
      if (message) next[id] = message;
      else delete next[id];
      return next;
    });
  }, [values]);

  const reset = useCallback(() => {
    setValues({});
    setErrors({});
    setStatus("idle");
    setErrorMessage(undefined);
  }, []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      const validationErrors = validateForm(enquiryFields, values, true);
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length > 0) return;

      setStatus("submitting");
      setErrorMessage(undefined);

      const fields = Object.fromEntries(
        enquiryFields.map((f) => [f.id, String(values[f.id] ?? "")]),
      );

      const result = await submitEnquiry({
        fields,
        consent: Boolean(values.consent),
        source,
      });

      if (result.ok) {
        setStatus("success");
      } else if (result.reason === "not_configured") {
        // No lead backend exists yet — never show a false "submitted" state.
        setStatus("not_configured");
      } else {
        setStatus("error");
        setErrorMessage(result.error);
      }
    },
    [values, source],
  );

  return {
    fields: enquiryFields,
    values,
    errors,
    status,
    errorMessage,
    setField,
    blurField,
    handleSubmit,
    reset,
  };
}
