"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, prefersReducedMotion, travel } from "@/lib/motion";

/**
 * Scroll reveal — the site's single entrance primitive, with a small
 * vocabulary instead of one generic fade for everything:
 *
 *   "fade"    quiet blocks of copy: opacity + a short settle upward
 *   "lines"   editorial headlines: each [data-line] rises out of a
 *             clipped wrapper (see RevealLines) — the masked reveal
 *   "image"   photography: a soft inset mask opens while the media
 *             ([data-reveal-media]) breathes from a slight zoom to rest
 *   "stagger" facts / rows: [data-reveal-item] children settle one by
 *             one on a fixed stagger
 *
 * Markup is authored in its FINISHED state; the hidden "from" state is
 * applied by GSAP only when it runs. Reduced motion, no-JS and crawlers
 * therefore see the completed layout. Each instance plays once.
 */
export type RevealVariant = "fade" | "lines" | "image" | "stagger";

export function Reveal({
  children,
  className = "",
  delayMs = 0,
  variant = "fade",
}: {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  variant?: RevealVariant;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const delay = delayMs / 1000;
      const scrollTrigger = { trigger: el, start: motion.trigger.start, once: true };

      if (variant === "lines") {
        const lines = el.querySelectorAll<HTMLElement>("[data-line]");
        if (lines.length > 0) {
          gsap.set(lines, { yPercent: motion.distance.line });
          gsap.to(lines, {
            yPercent: 0,
            duration: motion.duration.slow,
            ease: motion.ease.editorial,
            stagger: motion.stagger.lines,
            delay,
            scrollTrigger,
          });
          return;
        }
      }

      if (variant === "image") {
        const media = el.querySelector<HTMLElement>("[data-reveal-media]") ?? el;
        gsap.set(el, { clipPath: "inset(10% 3% 10% 3%)" });
        gsap.set(media, { scale: motion.image.scaleFrom });
        gsap.to(el, {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: motion.duration.cinematic,
          ease: motion.ease.editorial,
          delay,
          scrollTrigger,
        });
        gsap.to(media, {
          scale: 1,
          duration: motion.duration.cinematic * 1.2,
          ease: motion.ease.soft,
          delay,
          scrollTrigger,
        });
        return;
      }

      if (variant === "stagger") {
        const items = el.querySelectorAll<HTMLElement>("[data-reveal-item]");
        if (items.length > 0) {
          gsap.set(items, { opacity: 0, y: travel(motion.distance.text) });
          gsap.to(items, {
            opacity: 1,
            y: 0,
            duration: motion.duration.slow,
            ease: motion.ease.editorial,
            stagger: motion.stagger.items,
            delay,
            scrollTrigger,
          });
          return;
        }
      }

      // "fade" (and the fallback for variants whose markers are absent)
      gsap.set(el, { opacity: 0, y: travel(motion.distance.text) });
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: motion.duration.slow,
        ease: motion.ease.editorial,
        delay,
        scrollTrigger,
      });
    }, el);

    return () => ctx.revert();
  }, [delayMs, variant]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
