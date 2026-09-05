export type FieldType = "text" | "email" | "tel";

export type FormFieldConfig = {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  autoComplete?: string;
  placeholder?: string;
};

/**
 * Enquiry form field definitions — shared by the Contact section form and
 * the Enquiry modal. Add/remove/reorder fields or change labels/required
 * state here; both forms pick up the change automatically.
 */
export const enquiryFields: FormFieldConfig[] = [
  {
    id: "name",
    label: "Full Name",
    type: "text",
    required: true,
    autoComplete: "name",
  },
  {
    id: "email",
    label: "Email Address",
    type: "email",
    required: true,
    autoComplete: "email",
  },
  {
    id: "mobile",
    label: "Mobile Number",
    type: "tel",
    required: true,
    autoComplete: "tel",
  },
  {
    id: "city",
    label: "City",
    type: "text",
    required: false,
    autoComplete: "address-level2",
  },
];

export const consentField = {
  id: "consent",
  label:
    "I agree to be contacted by Yamuna Sky City regarding this enquiry.",
  required: true,
} as const;

export const formCopy = {
  heading: "Experience Yamuna Sky City.",
  supportingLine:
    "Share your details and our team will be in touch to arrange your private viewing.",
  submitLabel: "SUBMIT ENQUIRY",
  submittingLabel: "Submitting…",
  /* Success state — shown ONLY after the lead destination has confirmed
     the lead. The brochure lines are used by lib/brochure.ts's
     resolution: "ready" when a brochure is available, "pending" (an
     honest interim) while no brochure mechanism is configured. */
  successHeading: "Thank you",
  successMessage: "Your enquiry has been received.",
  brochureReadyMessage: "Your Yamuna Sky City brochure is ready.",
  brochureButtonLabel: "Download Brochure",
  brochurePendingMessage: "Our team will share the Yamuna Sky City brochure with you shortly.",
  errorMessageFallback: "Something went wrong. Please try again.",
  // Shown while no lead backend is configured — an honest state, never a
  // false "submitted" confirmation.
  notConfiguredMessage:
    "Online enquiries are not available just yet. Please check back soon.",
} as const;
