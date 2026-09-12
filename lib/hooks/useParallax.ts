"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isCoarsePointer, isNarrowViewport, prefersReducedMotion } from "@/lib/motion";

/**
 * Scroll-linked drift for media: the element travels `percent` of its
 * own height (from -percent/2 to +percent/2) while its trigger crosses
 * the viewport. Transform only, scrubbed with a short lag so it feels
 * physical rather than mechanical. Off on small screens, on touch
 * devices and under reduced motion — those visitors see the element at rest.
 */
export function useParallax(
  ref: RefObject<HTMLElement | null>,
  { percent = 6, trigger }: { percent?: number; trigger?: RefObject<HTMLElement | null> } = {},
) {
  useEffect(() => {
    const el = ref.current;
    // Off on touch devices as well as small screens: on tablets the
    // scrubbed drift kept moving after the finger lifted and cost frames.
    if (!el || prefersReducedMotion() || isNarrowViewport() || isCoarsePointer()) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: -percent / 2 },
        {
          yPercent: percent / 2,
          ease: "none",
          scrollTrigger: {
            trigger: trigger?.current ?? el,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        },
      );
    });
    return () => ctx.revert();
  }, [ref, percent, trigger]);
}
