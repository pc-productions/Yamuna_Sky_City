"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isCoarsePointer, prefersReducedMotion } from "@/lib/motion";

/**
 * Global scroll enhancement (Lenis), deliberately narrow in scope:
 *
 *  - wheel/trackpad input only — touch devices keep native scrolling,
 *    so mobile feels exactly like the platform;
 *  - disabled entirely under prefers-reduced-motion;
 *  - drives GSAP ScrollTrigger from the same clock (one rAF loop);
 *  - takes over same-page anchor links (/#section, #section) so they
 *    glide instead of jumping, with the fixed header as the offset, and
 *    moves keyboard focus to the target so the skip link still works;
 *  - `paused` stops it while the enquiry modal owns the viewport;
 *    [data-lenis-prevent] containers keep their own native scrolling.
 *
 * No scroll hijacking: the window really scrolls; the browser back/
 * forward, find-in-page and native keyboard scrolling all keep working.
 */
export function SmoothScroll({ paused = false }: { paused?: boolean }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    // Phones resize the viewport every time the browser toolbar slides in
    // or out. Without this, ScrollTrigger refreshes (and re-measures the
    // whole page) on each of those resizes, right as the finger lifts —
    // felt as a stutter or a small jump. Real orientation changes still
    // refresh.
    ScrollTrigger.config({ ignoreMobileResize: true });
    if (prefersReducedMotion() || isCoarsePointer()) return;

    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 1,
      smoothWheel: true,
      syncTouch: false,
      anchors: false,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Lenis already honours the target's scroll-margin-top (the sections
    // set one equal to the header height); only top up the difference.
    const headerOffset = (target: Element) => {
      const header = document.querySelector("header")?.offsetHeight ?? 0;
      const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
      return -Math.max(0, header - margin);
    };
    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      const match = href.match(/^(\/)?#(.*)$/);
      if (!match) return;
      // "/#section" from an inner page must navigate for real.
      if (match[1] && window.location.pathname !== "/") return;
      const id = decodeURIComponent(match[2]);
      const target = id ? document.getElementById(id) : document.body;
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target, { offset: headerOffset(target), duration: 1.5, easing: easeOutQuart });
      window.history.pushState(null, "", match[1] ? href : window.location.pathname + href);
      if (target.hasAttribute("tabindex")) target.focus({ preventScroll: true });
    };
    document.addEventListener("click", onClick);

    // Deep link on load: land on the section with the header cleared.
    if (window.location.hash) {
      const target = document.getElementById(window.location.hash.slice(1));
      if (target) {
        requestAnimationFrame(() =>
          lenis.scrollTo(target, { offset: headerOffset(target), immediate: true }),
        );
      }
    }

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (paused) lenis.stop();
    else lenis.start();
  }, [paused]);

  return null;
}
