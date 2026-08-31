import Image from "next/image";
import { logoAssets, logoSrc, tagline, type LogoType, type LogoVariant } from "@/content/brand";

/**
 * The only way brand marks are rendered on the site — always the actual
 * approved artwork (see content/brand.ts), never text or CSS recreations,
 * never CSS-filtered colour changes: each variant is its own approved
 * asset.
 *
 * `height` sets the rendered height in pixels; width follows from the
 * approved aspect ratio so the artwork can never be distorted.
 * `withTagline` places "The Pinnacle of South India" directly beneath
 * the artwork in Poppins Semibold, per the tagline lockup rules (use
 * only with the lockup, and only where space allows).
 *
 * Clearance: the guidelines require breathing room around the logo (the
 * "Y" height as reference). The component doesn't force margins — the
 * surrounding layout is responsible for keeping other elements clear.
 */
export function Logo({
  type = "lockup",
  variant = "primary",
  height = 40,
  withTagline = false,
  className = "",
  priority = false,
}: {
  type?: LogoType;
  variant?: LogoVariant;
  height?: number;
  withTagline?: boolean;
  className?: string;
  priority?: boolean;
}) {
  const { width: iw, height: ih } = logoAssets[type];
  const width = Math.round((iw / ih) * height);

  const taglineTone =
    variant === "primary" ? "text-brand" : variant === "mono" ? "text-ink" : "text-paper";

  const image = (
    <Image
      src={logoSrc(type, variant)}
      alt="Yamuna Sky City"
      width={width}
      height={height}
      priority={priority}
      className="h-auto w-auto"
      style={{ height, width }}
    />
  );

  if (!withTagline) {
    return <span className={`inline-flex ${className}`}>{image}</span>;
  }

  return (
    <span className={`inline-flex flex-col ${className}`} style={{ width }}>
      {image}
      <span
        className={`font-display mt-2 block text-center font-semibold ${taglineTone}`}
        style={{ fontSize: Math.max(10, Math.round(height * 0.2)) }}
      >
        {tagline}
      </span>
    </span>
  );
}
