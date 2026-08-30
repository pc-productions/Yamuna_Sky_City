"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Minimal scroll-reveal primitive. Returns a ref to attach and whether the
 * element has entered the viewport. No animation library — pair with a CSS
 * transition (see components/ui/Reveal.tsx). Respects prefers-reduced-motion
 * by simply not mattering: reduced motion is handled globally in CSS.
 */
export function useReveal<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      // No IntersectionObserver support: reveal immediately. Deferred via
      // rAF rather than called synchronously in the effect body.
      const frame = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}
