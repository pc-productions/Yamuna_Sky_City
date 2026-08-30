"use client";

import { formCopy } from "@/content/form";
import { useDialog } from "@/lib/hooks/useDialog";
import { EnquiryForm } from "@/components/forms/EnquiryForm";

export function EnquiryModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { containerRef } = useDialog(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-night/70 backdrop-blur-sm"
      />

      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="enquiry-modal-heading"
        className="relative flex max-h-[90vh] w-full flex-col overflow-y-auto bg-paper p-8 sm:max-w-md sm:rounded-sm sm:p-10"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close enquiry form"
          className="absolute right-6 top-6 text-2xl leading-none text-ink-muted transition-colors hover:text-brand"
        >
          &times;
        </button>

        <h2 id="enquiry-modal-heading" className="font-display pr-8 text-3xl font-medium text-ink">
          {formCopy.heading}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">{formCopy.supportingLine}</p>

        <div className="mt-8">
          <EnquiryForm source="modal" tone="light" />
        </div>
      </div>
    </div>
  );
}
