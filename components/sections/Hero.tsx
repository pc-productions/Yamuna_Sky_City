"use client";

import { useEffect, useRef, useState } from "react";
import { heroVideo } from "@/content/media";
import { VideoBackground } from "@/components/ui/VideoBackground";

/**
 * Full-screen looping hero video with a compact scroll cue that appears
 * only after the first video loop completes (or after a fixed delay when
 * no video is available). The cue fades in smoothly and consumes minimal
 * vertical space.
 */
export function Hero({ active }: { active: boolean }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showCue, setShowCue] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const prevTimeRef = useRef(0);
  const cueVisible = showCue && !scrolled;

  // The cue's job is done once the visitor starts moving: retreat as soon
  // as they scroll, return if they come back to the very top.
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

  useEffect(() => {
    if (!active) return;

    const video = videoRef.current;

    if (!heroVideo.src || !video) {
      // No real footage — show cue after a reasonable fallback delay.
      const t = window.setTimeout(() => setShowCue(true), 4000);
      return () => window.clearTimeout(t);
    }

    // Detect the first loop by watching for currentTime jumping backwards.
    const handleTimeUpdate = () => {
      const current = video.currentTime;
      // If time dropped by more than 1 s from the previous frame, the video looped.
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
      aria-label="Yamuna Sky City"
      data-header-tone="video"
      className="relative flex h-dvh w-full flex-col overflow-hidden bg-night pt-16 xl:pt-18"
    >
      <div className="relative flex-1 w-full overflow-hidden">
        <VideoBackground
          media={active ? heroVideo : { ...heroVideo, src: undefined }}
          priority
          videoRef={videoRef}
        />
      </div>

      {/* Scroll cue — premium ultra-compact luxury mouse pill with brand Ember dot */}
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
          <span className="h-1.5 w-1 rounded-full bg-[#B42810] shadow-[0_0_8px_#B42810] animate-cue-wheel-dot" />
        </div>
      </a>
    </section>
  );
}
