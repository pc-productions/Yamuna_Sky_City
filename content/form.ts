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
  successMessage: "Thank you. Our team will reach out to you shortly.",
  errorMessageFallback: "Something went wrong. Please try again.",
} as const;
