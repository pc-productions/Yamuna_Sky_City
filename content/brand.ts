/**
 * Official brand assets — extracted from the Yamuna Sky City Brand
 * Guidelines PDF (the single source of truth for identity).
 *
 * Each asset ships in the four approved colour applications:
 *   primary  — SkyCity Ember artwork, for Pearl Ivory / light surfaces
 *   reversed — Pearl Ivory artwork, for Ember / coloured surfaces
 *   dark     — White artwork, for premium low-light / black surfaces
 *   mono     — Black artwork, for single-colour reproduction only
 *
 * Intrinsic pixel sizes preserve the approved aspect ratios — never
 * distort, rotate, recolour arbitrarily, or recreate the logo with text.
 * The wordmark is 1.5× the width of the primary mark by definition in
 * the lockup artwork, which ships pre-composed.
 */

export type LogoType = "mark" | "wordmark" | "lockup";
export type LogoVariant = "primary" | "reversed" | "dark" | "mono";

export const logoAssets: Record<LogoType, { width: number; height: number }> = {
  mark: { width: 1666, height: 1360 },
  wordmark: { width: 1936, height: 576 },
  lockup: { width: 2106, height: 750 },
};

export function logoSrc(type: LogoType, variant: LogoVariant): string {
  return `/media/brand/${type}-${variant}.png`;
}

/** Official tagline — Poppins Semibold, sits directly beneath the lockup. */
export const tagline = "The Pinnacle of South India";
