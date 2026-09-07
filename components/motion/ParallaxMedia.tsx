"use client";

import { useRef, type ReactNode } from "react";
import { useParallax } from "@/lib/hooks/useParallax";

/**
 * Wrapper that drifts its children a few percent while scrolling
 * through the viewport (lib/hooks/useParallax). Size the wrapper taller
 * than its clipped parent (e.g. -inset-y-[6%]) so the drift never
 * exposes an edge.
 */
export function ParallaxMedia({
  children,
  percent = 6,
  className = "",
}: {
  children: ReactNode;
  percent?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  useParallax(ref, { percent });
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
