"use client";

import Image from "next/image";
import { useId, type RefObject } from "react";
import type { VideoSource } from "@/content/media";

/**
 * Full-bleed background video with graceful degradation:
 * - No `src` yet (real footage not supplied)? Renders the poster only —
 *   no broken network request, no layout shift.
 * - `src` present but autoplay/playback fails? The <video>'s `poster`
 *   attribute is shown natively; nothing traps the user.
 *
 * Responsive framing (so on-screen text/subjects in the source video are
 * never cropped) is configured per breakpoint via `media.objectPosition`
 * in content/media.ts and applied through a small scoped <style> block —
 * no animation/positioning library required.
 */
export function VideoBackground({
  media,
  className = "",
  priority = false,
  loop = true,
  onEnded,
  videoRef,
}: {
  media: VideoSource;
  className?: string;
  priority?: boolean;
  loop?: boolean;
  onEnded?: () => void;
  videoRef?: RefObject<HTMLVideoElement | null>;
}) {
  const reactId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const positionClass = `video-pos-${reactId}`;
  const { mobile, tablet, desktop } = media.objectPosition ?? {};
  const hasCustomPosition = Boolean(mobile || tablet || desktop);

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      {hasCustomPosition && (
        <style>{`
          .${positionClass} { object-position: ${desktop ?? "center"}; }
          ${tablet ? `@media (max-width: 1024px) { .${positionClass} { object-position: ${tablet}; } }` : ""}
          ${mobile ? `@media (max-width: 640px) { .${positionClass} { object-position: ${mobile}; } }` : ""}
        `}</style>
      )}

      {media.src ? (
        <video
          ref={videoRef}
          className={`h-full w-full object-cover ${hasCustomPosition ? positionClass : ""}`}
          src={media.src}
          poster={media.poster}
          autoPlay
          muted
          loop={loop}
          playsInline
          preload={priority ? "auto" : "metadata"}
          onEnded={onEnded}
        />
      ) : (
        <Image
          src={media.poster}
          alt=""
          fill
          priority={priority}
          className={`object-cover ${hasCustomPosition ? positionClass : ""}`}
        />
      )}
    </div>
  );
}
