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
        className="absolute inset-0 bg-night/75 backdrop-blur-sm"
      />

      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="enquiry-modal-heading"
        className="relative flex max-h-[92vh] w-full flex-col overflow-y-auto bg-paper px-8 py-10 sm:max-w-md sm:px-12 sm:py-14"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close enquiry form"
          className="absolute right-6 top-6 flex size-9 items-center justify-center text-xl leading-none text-ink-faint transition-colors duration-300 hover:text-ink"
        >
          &times;
        </button>

        <span className="eyebrow text-brand">Private Viewing</span>
        <h2 id="enquiry-modal-heading" className="text-display-md mt-6 pr-6 text-ink">
          {formCopy.heading}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-ink-muted">{formCopy.supportingLine}</p>

        <div className="mt-10">
          <EnquiryForm source="modal" tone="light" />
        </div>
      </div>
    </div>
  );
}
