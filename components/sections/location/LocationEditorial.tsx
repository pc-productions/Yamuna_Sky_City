import { locationContent } from "@/content/location";

/**
 * Layer 5 — the editorial column in the white atmospheric region:
 * red uppercase heading with the decorative sparkle, a thin divider
 * that draws from the left, and the approved supporting copy in dark
 * navy. GSAP staggers these in during the entrance sequence.
 */
export function LocationEditorial() {
  return (
    /* Width steps with the crop: tablet fit-mode keeps the column clear
       of the City Mall bubble; wide screens relax it. */
    <div className="absolute top-[22%] left-[4vw] z-[5] max-w-[16rem] xl:top-[24%] xl:max-w-[18rem] 2xl:left-[5vw] 2xl:max-w-[21rem]">
      <h2
        data-loc-heading=""
        className="font-display text-[clamp(1.125rem,1.3vw,1.45rem)] font-semibold tracking-[0.06em] text-[#DA2B1D] uppercase"
      >
        {locationContent.heading}
        <span aria-hidden="true" className="pl-[0.45em] text-[0.8em]">
          ✦
        </span>
      </h2>
      <div data-loc-divider="" className="mt-3 h-[2px] w-14 bg-[#DA2B1D]" />
      <p
        data-loc-body=""
        className="mt-5 text-[clamp(0.875rem,1.05vw,1.125rem)] leading-[1.75] text-[#0B1B33]/90"
      >
        {locationContent.supportingLine}
      </p>
    </div>
  );
}
