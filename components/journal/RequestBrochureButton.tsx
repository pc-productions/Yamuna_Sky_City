"use client";

import { Button } from "@/components/ui/Button";
import { openEnquiry } from "@/lib/enquiryTrigger";
import { trackJournal } from "@/lib/blog/analytics";

/**
 * "Request brochure" on the Journal. Opens the site's ONE enquiry modal
 * (lib/enquiryTrigger.ts → SiteChrome); the brochure itself is released
 * by the existing flow only after the enquiry is confirmed. No second
 * form, no second endpoint.
 */
export function RequestBrochureButton({
  slug,
  placement,
  variant = "outline-light",
  className = "",
  children,
}: {
  slug?: string;
  placement: string;
  variant?: "primary" | "outline-light" | "outline-dark";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant={variant}
      className={className}
      onClick={() => {
        trackJournal({ event: "blog_brochure_click", slug, placement });
        openEnquiry();
      }}
    >
      {children}
    </Button>
  );
}
