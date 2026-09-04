import type { CSSProperties, ReactNode } from "react";
import { viewBox } from "@/components/sections/location/config";

/**
 * Reproduces `object-fit: cover` geometry as a positioned box: a div
 * with the image's exact aspect ratio, sized to fully cover the
 * section and centered on it. The background image AND every overlay
 * layer (rings, lines, bubbles) render inside identical frames, so all
 * of them share one coordinate space — percentages of the frame equal
 * percentages of the photograph, and the overlay stays glued to the
 * tower no matter how the viewport crops the image.
 *
 * The frame is a container-query root: children size themselves in
 * `cqw` (1% of frame width = 10 viewBox units), which keeps bubbles
 * and type proportional to the photograph, not the viewport.
 */
export function CoverFrame({
  className = "",
  style,
  children,
  ...rest
}: {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
} & Record<`data-${string}`, string>) {
  return (
    <div
      {...rest}
      /* Full-width at the exact 1672/941 geometry, vertically centred,
         and shifted 5vw to the RIGHT: the tower moves off-centre (as in
         the approved artwork) to clear breathing room on the left for
         the editorial column and the City Mall node. The 5vw of image
         that leaves the right edge is cropped by the section; the
         exposed band on the left is painted white by LocationSection
         and dissolves into the atmospheric fade. */
      className={`absolute top-1/2 left-[5vw] w-full max-w-none -translate-y-1/2 ${className}`}
      style={{
        aspectRatio: `${viewBox.w} / ${viewBox.h}`,
        containerType: "inline-size",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
