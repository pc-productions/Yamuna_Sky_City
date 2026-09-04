import { locationContent } from "@/content/location";
import { Container } from "@/components/ui/Container";

/**
 * Layer 5 — the editorial column in the white atmospheric region:
 * - Brand section eyebrow "Location" matching the sitewide design system
 * - Red uppercase heading with decorative sparkle
 * - Thin accent divider line
 * - Approved supporting copy in dark navy
 * - The glass feature card (passed as children) below the copy
 * Staggered during the GSAP entrance sequence.
 *
 * Positioned with the SAME Container + top padding as every other
 * section (pt-8 sm:pt-10), so the section's content starts at the
 * identical height and left inset sitewide. The column is capped at
 * 17.5rem so it stays clear of the Beach bubble at wide viewports.
 */
export function LocationEditorial() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-[5]">
      <Container className="pt-8 sm:pt-10">
        <div className="pointer-events-auto flex max-w-[14.5rem] flex-col lg:max-w-[14.75rem] xl:max-w-[16.5rem] 2xl:max-w-[18.5rem]">
          {/* Sitewide Section Eyebrow */}
          <span data-loc-eyebrow="" className="eyebrow block text-brand tracking-[0.22em]">
            {locationContent.eyebrow}
          </span>

          {/* Main Section Heading */}
          <h2
            data-loc-heading=""
            className="mt-3 font-display text-[clamp(1.75rem,2.35vw,2.65rem)] leading-[1.1] font-semibold tracking-[0.04em] text-[#b42810] uppercase"
          >
            {locationContent.heading}
            <span aria-hidden="true" className="pl-[0.35em] text-[0.8em]">
              ✦
            </span>
          </h2>

          {/* Brand Accent Divider */}
          <div data-loc-divider="" className="mt-3.5 h-[2px] w-14 bg-[#b42810]" />

          {/* Supporting Copy */}
          <p
            data-loc-body=""
            className="mt-4 text-justify text-[clamp(0.875rem,1.05vw,1.0625rem)] leading-[1.7] font-normal text-[#0B1B33]/90"
          >
            {locationContent.supportingLine}
          </p>
        </div>
      </Container>
    </div>
  );
}
