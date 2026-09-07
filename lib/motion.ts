/**
 * GLOBAL MOTION SYSTEM — the one vocabulary every animated element on
 * the site speaks. Values are deliberately few; consistency is the point.
 *
 *   duration  fast      UI feedback (hover, focus, header tone)
 *             standard  small reveals
 *             slow      editorial reveals (text lines, stats)
 *             cinematic image/atmosphere reveals, hero hand-off
 *   ease      one "editorial" curve for entrances (long, settling tail),
 *             one "soft" curve for scrubbed / continuous motion
 *   distance  reveal travel — small: things settle, they do not fly
 *   parallax  percentage of element height; single digits only
 *
 * Mobile uses the same curves with shorter travel (see `travel()`), and
 * prefers-reduced-motion disables everything except opacity where a
 * reveal would otherwise hide content (see components/ui/Reveal.tsx).
 */
export const motion = {
  duration: { fast: 0.45, standard: 0.9, slow: 1.35, cinematic: 2.0 },
  ease: {
    editorial: "power4.out",
    soft: "power2.out",
    inOut: "power2.inOut",
    /** CSS equivalent of `editorial` (expo-out) for transitions. */
    cssEditorial: "cubic-bezier(0.16, 1, 0.3, 1)",
  },
  distance: { text: 28, block: 40, line: 110 /* % of line height */ },
  stagger: { lines: 0.09, items: 0.11 },
  image: { scaleFrom: 1.08, breathe: 1.04 },
  parallax: { subtle: 3, standard: 6 },
  trigger: { start: "top 88%", startLate: "top 75%" },
} as const;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Touch / no-hover devices get native scrolling and lighter motion. */
export const isCoarsePointer = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: none), (pointer: coarse)").matches;

export const isNarrowViewport = () =>
  typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches;

/** Reveal travel distance, shortened on small screens. */
export function travel(px: number) {
  return isNarrowViewport() ? Math.round(px * 0.55) : px;
}
