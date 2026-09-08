"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { enquiryFields } from "@/content/form";
import { submitEnquiry, type SubmitResult } from "@/lib/actions/submitEnquiry";
import { getAttribution } from "@/lib/attribution";
import { validateField, validateForm, type FormErrors, type FormValues } from "@/lib/validation";

export type SubmitStatus =
  | "idle"
  | "submitting"
  | "success"
  | "error"
  /** Lead is safe but the CRM did not take it yet: form kept, one more submit requested. */
  | "retry"
  | "not_configured";

/**
 * Shared enquiry-form state/logic used by both the Contact section form
 * and the Enquiry modal. Presentation is left entirely to the caller.
 *
 * The hook knows nothing about the lead destination: it calls
 * submitEnquiry() and maps the normalized SubmitResult onto UI status.
 * On success it also exposes the result so the caller can resolve
 * brochure access (lib/brochure.ts) — and only then.
 *
 * A failed attempt may return a retry token; it is sent back with the
 * next submit so the server treats it as the same lead (same reference,
 * same sheet row) and counts the attempts. The policy that decides when
 * a retry turns into a success lives server-side.
 */
export function useEnquiryForm(source: string) {
  const [values, setValues] = useState<FormValues>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [result, setResult] = useState<SubmitResult | null>(null);
  // Synchronous in-flight guard: React state updates are async, so a
  // second submit event in the same tick (double click, Enter + click)
  // could otherwise start a second request before `status` flips.
  const inFlight = useRef(false);
  // Time-to-submit: humans need a few seconds; bots often post instantly.
  const mountedAt = useRef(0);
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);
  // Opaque, server-signed; present only after an unsuccessful attempt.
  const retryToken = useRef<string | undefined>(undefined);

  const setField = useCallback((id: string, value: string | boolean) => {
    setValues((prev) => ({ ...prev, [id]: value }));
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
    setResult(null);
    retryToken.current = undefined;
  }, []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (inFlight.current) return;

      const validationErrors = validateForm(enquiryFields, values, true);
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length > 0) return;

      inFlight.current = true;
      setStatus("submitting");
      setErrorMessage(undefined);

      const fields = Object.fromEntries(
        enquiryFields.map((f) => [f.id, String(values[f.id] ?? "")]),
      );

      let outcome: SubmitResult;
      try {
        outcome = await submitEnquiry({
          fields,
          consent: Boolean(values.consent),
          source,
          attribution: getAttribution(),
          honeypot: String(values._gotcha ?? ""),
          elapsedMs: Date.now() - mountedAt.current,
          retryToken: retryToken.current,
        });
      } catch {
        // The server action itself failed to run (offline, deploy in
        // progress). Treat as a retryable failure — values are kept.
        outcome = { ok: false, reason: "failed", error: "Something went wrong. Please try again." };
      } finally {
        inFlight.current = false;
      }

      if (outcome.ok) {
        retryToken.current = undefined;
        setResult(outcome);
        setStatus("success");
        return;
      }
      // Keep whichever token the server issued so the next submit is
      // recognised as the same lead (a token-less failure keeps the old one).
      if (outcome.retryToken) retryToken.current = outcome.retryToken;
      if (outcome.reason === "retry") {
        setStatus("retry");
        setErrorMessage(outcome.error);
      } else if (outcome.reason === "not_configured") {
        // No lead backend exists yet — never show a false "submitted" state.
        setStatus("not_configured");
      } else if (outcome.reason === "invalid") {
        // Server-side validation disagreed — surface as field-level retry.
        setStatus("error");
        setErrorMessage(outcome.error);
      } else {
        setStatus("error");
        setErrorMessage(outcome.error);
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
    result,
    setField,
    blurField,
    handleSubmit,
    reset,
  };
}
