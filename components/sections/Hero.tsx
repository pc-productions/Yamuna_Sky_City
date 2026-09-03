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
  const prevTimeRef = useRef(0);

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

      {/* Compact scroll cue — fades in after first video loop */}
      <a
        href="#project"
        aria-label="Scroll to Project Overview"
        className={`group absolute bottom-6 left-1/2 z-20 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-1000 sm:bottom-8 ${
          showCue ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        {/* Tiny tracked label */}
        <span className="text-[0.5625rem] font-medium uppercase tracking-[0.3em] text-white/55 transition-colors duration-300 group-hover:text-white/90">
          Scroll
        </span>

        {/* Short hairline track + dual streaks */}
        <span className="relative block h-10 w-px overflow-hidden bg-white/15 transition-colors duration-300 group-hover:bg-white/30">
          <span className="absolute inset-x-0 h-full bg-gradient-to-b from-transparent via-white to-transparent animate-scroll-descend" />
          <span className="absolute inset-x-0 h-full bg-gradient-to-b from-transparent via-white/40 to-transparent animate-scroll-descend-2" />
        </span>

        {/* Chevron */}
        <span className="animate-chevron-pulse">
          <svg
            width="8"
            height="5"
            viewBox="0 0 8 5"
            fill="none"
            aria-hidden="true"
            className="text-white/55 transition-colors duration-300 group-hover:text-white/90"
          >
            <path
              d="M1 1l3 3 3-3"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </a>
    </section>
  );
}
