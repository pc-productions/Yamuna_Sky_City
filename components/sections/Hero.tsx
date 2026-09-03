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
          priority={active}
          videoRef={videoRef}
        />
      </div>

      {/* Scroll cue — one choreographed gesture: letter shimmer → glowing
          streak descending the track → chevrons blooming as it lands.
          Entry fades in top-down (label, track draws itself, chevrons);
          exit fades out bottom-up in reverse. The animation classes are
          only attached while visible, so every entrance restarts the
          shared cycle from zero — the first streak always begins cleanly
          at the top of the track. */}
      <a
        href="#project"
        aria-label="Scroll to Project Overview"
        className={`group absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2.5 transition-transform duration-1000 ease-out sm:bottom-8 ${
          cueVisible ? "translate-y-0" : "pointer-events-none translate-y-2"
        }`}
      >
        {/* Label — each letter carries a phase-shifted shimmer so a wave
            of light reads across the word once per cycle. */}
        <span
          aria-hidden="true"
          className={`flex pl-[0.3em] text-[0.5625rem] font-medium uppercase text-white/70 transition-[opacity,color] duration-700 ease-out group-hover:text-white ${
            cueVisible ? "opacity-100 delay-100" : "opacity-0 delay-300"
          }`}
        >
          {["S", "C", "R", "O", "L", "L"].map((ch, i) => (
            <span
              key={i}
              className="animate-cue-letter inline-block tracking-[0.3em]"
              style={{ animationDelay: `${i * 110}ms` }}
            >
              {ch}
            </span>
          ))}
        </span>

        {/* Hairline track: draws itself downward on entrance, folds back
            up on exit; a glowing streak and a fainter echo descend
            through it. */}
        <span
          className={`relative block h-12 w-px origin-top overflow-hidden bg-white/15 transition-[scale,opacity,background-color] duration-700 ease-out group-hover:bg-white/30 sm:h-14 ${
            cueVisible
              ? "scale-y-100 opacity-100 delay-300"
              : "scale-y-0 opacity-0 delay-150"
          }`}
        >
          {/* Base opacity-0 so the streaks only ever exist as animated
              light — never a static bar before their delayed cycle
              starts or after the classes detach on exit. */}
          <span
            className={`absolute inset-x-0 h-1/2 bg-gradient-to-b from-transparent via-white to-white opacity-0 shadow-[0_0_10px_rgba(255,255,255,0.7)] ${cueVisible ? "animate-cue-streak" : ""}`}
          />
          <span
            className={`absolute inset-x-0 h-1/2 bg-gradient-to-b from-transparent via-white/40 to-transparent opacity-0 ${cueVisible ? "animate-cue-streak-2" : ""}`}
          />
        </span>

        {/* Twin chevrons — bloom in sequence exactly as the streak lands,
            then exit downward, handing the motion off the screen. First
            to fade on exit, last to arrive on entry. */}
        <span
          className={`flex flex-col items-center -space-y-[3px] text-white/70 transition-[opacity,color] duration-700 ease-out group-hover:text-white ${
            cueVisible ? "opacity-100 delay-500" : "opacity-0 delay-0"
          }`}
        >
          {["animate-cue-chevron", "animate-cue-chevron-2"].map((anim) => (
            <svg
              key={anim}
              width="10"
              height="6"
              viewBox="0 0 10 6"
              fill="none"
              aria-hidden="true"
              className={`opacity-0 ${cueVisible ? anim : ""}`}
            >
              <path
                d="M1 1l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ))}
        </span>
      </a>
    </section>
  );
}
