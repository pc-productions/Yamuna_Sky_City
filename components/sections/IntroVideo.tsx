"use client";

import { useEffect, useRef, useState } from "react";
import { introVideo, introFallbackDurationMs } from "@/content/media";
import { brand, ctaLabels } from "@/content/site";
import { VideoBackground } from "@/components/ui/VideoBackground";

/**
 * Full-viewport cinematic intro overlay. Sits above the Hero (already
 * mounted underneath) and calls `onComplete` when the video finishes,
 * autoplay fails, or the visitor skips — the visitor is never trapped.
 */
export function IntroVideo({ onComplete }: { onComplete: () => void }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const finish = () => {
    setIsExiting(true);
    // Let the exit transition play before unmounting via the parent.
    window.setTimeout(onComplete, 500);
  };

  useEffect(() => {
    const video = videoRef.current;

    if (!introVideo.src || !video) {
      // No real footage yet — drive the progress bar on a fixed timer so
      // the experience is fully wired for when the asset is supplied.
      const start = Date.now();
      const interval = window.setInterval(() => {
        const pct = Math.min(1, (Date.now() - start) / introFallbackDurationMs);
        setProgress(pct);
        if (pct >= 1) {
          window.clearInterval(interval);
          finish();
        }
      }, 100);
      return () => window.clearInterval(interval);
    }

    const handleTimeUpdate = () => {
      if (video.duration) setProgress(video.currentTime / video.duration);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);

    video.play().catch(() => {
      // Autoplay blocked — never trap the visitor behind a frozen overlay.
      window.setTimeout(finish, 1200);
    });

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end bg-night transition-opacity duration-500 ${
        isExiting ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      role="dialog"
      aria-label="Yamuna Sky City cinematic introduction"
    >
      <div className="absolute inset-0">
        <VideoBackground
          media={introVideo}
          priority
          loop={false}
          onEnded={finish}
          videoRef={videoRef}
        />
      </div>

      {/* Quiet wordmark — the film stays the dominant experience. */}
      <span className="absolute left-8 top-8 z-10 font-display text-base tracking-tight text-white/85 sm:left-12 sm:top-10">
        {brand.name}
      </span>

      {/* Discreet skip control, bottom-right. */}
      <button
        type="button"
        onClick={finish}
        className="absolute bottom-10 right-8 z-10 border-b border-white/30 pb-1 text-[0.6875rem] font-semibold uppercase tracking-[0.24em] text-white/75 transition-colors duration-300 hover:border-white hover:text-white sm:bottom-12 sm:right-12"
      >
        {ctaLabels.skipIntro}
      </button>

      {/* Hairline progress along the very bottom edge. */}
      <div
        className="absolute inset-x-0 bottom-0 z-10 h-px bg-white/15"
        role="progressbar"
        aria-label="Intro progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
      >
        <div
          className="h-full bg-white/80 transition-[width] duration-100 ease-linear"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
