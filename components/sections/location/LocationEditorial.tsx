import { locationContent } from "@/content/location";
import { Container } from "@/components/ui/Container";
import { LogoStar } from "@/components/sections/location/icons";

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
 * identical height and left inset sitewide — up to 1920px. Beyond that
 * the centred Container keeps moving inward while the photograph (and
 * its bubbles) stay anchored to the section width, so from 2xl the inset
 * is min(Container's own inset, 19.3% of the width): identical to the
 * Container up to 1920px (where the two are equal), then a share of the
 * width that keeps tracking the photograph. The column is wide enough
 * for its heading at the largest type size and still clears the Beach
 * bubble at every width.
 */
export function LocationEditorial() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-[5]">
      <Container className="pt-8 sm:pt-10 2xl:max-w-none 2xl:px-[min(calc((100%_-_80rem)_/_2_+_51px),19.3%)]">
        <div className="pointer-events-auto flex max-w-[14.5rem] flex-col lg:max-w-[14.75rem] xl:max-w-[16.5rem] 2xl:max-w-[20.5rem]">
          {/* Sitewide Section Eyebrow */}
          <span data-loc-eyebrow="" className="eyebrow block text-brand tracking-[0.22em]">
            {locationContent.eyebrow}
          </span>

          {/* Main Section Heading */}
          <h2
            data-loc-heading=""
            className="mt-3 font-display text-[clamp(1.75rem,2.35vw,2.65rem)] leading-[1.1] font-semibold tracking-[0.04em] text-[#b42810] uppercase"
          >
            {/* The logomark star is bound to the last word so it can
                never wrap onto a line of its own. */}
            {locationContent.heading.split(" ").slice(0, -1).join(" ")}{" "}
            <span className="whitespace-nowrap">
              {locationContent.heading.split(" ").at(-1)}
              <LogoStar className="ml-[0.3em] inline-block h-[0.55em] w-[0.55em] -translate-y-[0.04em]" />
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
