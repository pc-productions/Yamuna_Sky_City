import { locationContent } from "@/content/location";

/**
 * Layer 5 — the editorial column in the white atmospheric region:
 * - Brand section eyebrow "Location" matching the sitewide design system
 * - Red uppercase heading with decorative sparkle
 * - Thin accent divider line
 * - Approved supporting copy in dark navy
 * Staggered during the GSAP entrance sequence.
 */
export function LocationEditorial() {
  return (
    /* Positioned top-left under the header wash, clear of orbital nodes */
    <div className="absolute top-[8%] left-[4vw] z-[5] max-w-[16.5rem] lg:top-[7.5%] xl:top-[8.5%] xl:max-w-[19rem] 2xl:left-[5vw] 2xl:max-w-[22rem]">
      {/* Sitewide Section Eyebrow */}
      <span
        data-loc-eyebrow=""
        className="eyebrow block text-brand tracking-[0.22em]"
      >
        {locationContent.eyebrow}
      </span>

      {/* Main Section Heading */}
      <h2
        data-loc-heading=""
        className="mt-3 font-display text-[clamp(1.2rem,1.45vw,1.625rem)] font-semibold tracking-[0.06em] text-[#DA2B1D] uppercase leading-tight"
      >
        {locationContent.heading}
        <span aria-hidden="true" className="pl-[0.4em] text-[0.8em]">
          ✦
        </span>
      </h2>

      {/* Brand Accent Divider */}
      <div data-loc-divider="" className="mt-3 h-[2px] w-12 bg-[#DA2B1D]" />

      {/* Supporting Copy */}
      <p
        data-loc-body=""
        className="mt-4 text-[clamp(0.875rem,1.05vw,1.0625rem)] leading-[1.7] text-[#0B1B33]/90 font-normal"
      >
        {locationContent.supportingLine}
      </p>
    </div>
  );
}
