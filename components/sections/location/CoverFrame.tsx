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
      /* Below xl the section itself follows the image aspect, so the
         frame is simply full-width (no crop — every annotation stays
         on screen at tablet widths). From xl up the section is a full
         100vh screen and the frame reproduces the cover crop. */
      className={`absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 xl:w-[max(100%,calc(100vh*1.7768))] ${className}`}
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
