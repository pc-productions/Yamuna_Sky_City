"use client";

import { useEffect, useRef, useState } from "react";
import { preconnect } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { heroVideo } from "@/content/media";
import { isNarrowViewport, prefersReducedMotion } from "@/lib/motion";
import { VideoBackground } from "@/components/ui/VideoBackground";

/**
 * Opening shot. The hero is a sticky backdrop: it stays put while the
 * project story slides up over it (see the `main > section` rule in
 * globals.css), so the visitor is handed from film to page rather than
 * cut between two slabs. While that hand-off happens the film eases in
 * (scale) and dims — scroll-linked, transform/opacity only — and it is
 * paused once fully covered so it costs nothing offscreen.
 *
 * No text overlay: the film carries its own typography. The only UI is
 * the scroll cue, which appears after the first loop and retreats once
 * the visitor moves.
 */
/** Origin of the film's CDN, if it is served from one (content/media.ts). */
const heroMediaOrigin = (() => {
  try {
    return heroVideo.src && /^https?:\/\//.test(heroVideo.src) ? new URL(heroVideo.src).origin : null;
  } catch {
    return null;
  }
})();

export function Hero({ active }: { active: boolean }) {
  // Open the CDN connection (DNS + TLS) while the page is still parsing,
  // so the film's first bytes are not delayed by a cold handshake.
  // Rendered into <head> by React; a no-op for a same-origin file.
  if (heroMediaOrigin) preconnect(heroMediaOrigin);

  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showCue, setShowCue] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const prevTimeRef = useRef(0);
  const cueVisible = showCue && !scrolled;

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 60));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Scroll hand-off into the next section + offscreen pause.
  useEffect(() => {
    const root = sectionRef.current;
    const next = document.getElementById("project");
    if (!root || !next) return;
    gsap.registerPlugin(ScrollTrigger);
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      const video = () => videoRef.current;
      const st = {
        trigger: next,
        start: "top bottom",
        end: "top top",
        onLeave: () => video()?.pause(),
        onEnterBack: () => {
          video()
            ?.play()
            .catch(() => {});
        },
      };
      if (reduced) {
        ScrollTrigger.create(st);
        return;
      }
      gsap.to("[data-hero-media]", {
        scale: isNarrowViewport() ? 1.04 : 1.08,
        ease: "none",
        scrollTrigger: { ...st, scrub: 0.5 },
      });
      gsap.to("[data-hero-dim]", {
        opacity: 0.55,
        ease: "none",
        scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: 0.5 },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!active) return;
    const video = videoRef.current;
    if (!heroVideo.src || !video) {
      const t = window.setTimeout(() => setShowCue(true), 4000);
      return () => window.clearTimeout(t);
    }
    // First loop → cue. Detected by currentTime jumping backwards.
    const handleTimeUpdate = () => {
      const current = video.currentTime;
      if (prevTimeRef.current - current > 1) {
        setShowCue(true);
        video.removeEventListener("timeupdate", handleTimeUpdate);
      }
      prevTimeRef.current = current;
    };
    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, [active]);

  return (
    <section
      ref={sectionRef}
      data-hero=""
      aria-label="Yamuna Sky City"
      data-header-tone="video"
      className="sticky top-0 z-0 h-dvh w-full overflow-hidden bg-paper"
    >
      {/* Film. It begins exactly at the header's lower edge (top-16 /
          xl:top-18 = header height), never underneath it: the film is
          top-anchored so the crown of the tower is always in frame and
          only the bottom crops with the viewport ratio. When the intro
          hands over, the picture settles from a slight zoom to rest. */}
      <div
        data-hero-media=""
        className="absolute inset-x-0 top-16 bottom-0 transition-transform duration-[var(--motion-cinematic)] ease-[var(--ease-editorial)] motion-reduce:transition-none xl:top-18"
        style={{ transform: active ? "scale(1)" : "scale(1.06)" }}
      >
        <VideoBackground
          media={active ? heroVideo : { ...heroVideo, src: undefined }}
          priority
          videoRef={videoRef}
        />
      </div>
      {/* Dims as the story slides over the film. */}
      <div
        data-hero-dim=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-16 bottom-0 bg-night opacity-0 xl:top-18"
      />

      {/* Scroll cue — compact mouse pill with the Ember dot. */}
      <a
        href="#project"
        aria-label="Scroll to Project Overview"
        className={`group absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 transition-all duration-1000 ease-out sm:bottom-8 ${
          cueVisible ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-3"
        }`}
      >
        <span className="text-[0.625rem] font-medium uppercase tracking-[0.28em] text-white/70 transition-colors duration-300 group-hover:text-white animate-cue-label-fade">
          Scroll
        </span>
        <div className="relative flex h-8 w-5 justify-center rounded-full border border-white/30 p-1 backdrop-blur-md transition-colors duration-300 group-hover:border-white/70 animate-cue-ring-pulse">
          <span className="h-1.5 w-1 rounded-full bg-brand shadow-[0_0_8px_var(--color-brand)] animate-cue-wheel-dot" />
        </div>
      </a>
    </section>
  );
}
