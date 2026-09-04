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
      /* Sized to always cover the section container while preserving the exact
         1672/941 geometry and keeping the tower perfectly centered. */
      className={`absolute top-1/2 left-1/2 w-full max-w-none -translate-x-1/2 -translate-y-1/2 ${className}`}
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
