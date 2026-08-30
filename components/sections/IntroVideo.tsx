"use client";

import { useEffect, useRef, useState } from "react";
import { introVideo, introFallbackDurationMs } from "@/content/media";
import { ctaLabels } from "@/content/site";
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

      <div className="relative z-10 flex w-full flex-col gap-6 p-8 sm:p-12">
        <div className="h-px w-full max-w-xs bg-white/20">
          <div
            className="h-full bg-white/80 transition-[width] duration-100 ease-linear"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        <button
          type="button"
          onClick={finish}
          className="self-start text-xs font-semibold uppercase tracking-[0.2em] text-white/80 transition-colors hover:text-white"
        >
          {ctaLabels.skipIntro} &rarr;
        </button>
      </div>
    </div>
  );
}
