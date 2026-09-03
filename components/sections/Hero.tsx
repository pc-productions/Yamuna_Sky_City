import { heroVideo } from "@/content/media";
import { VideoBackground } from "@/components/ui/VideoBackground";

/**
 * Full-screen looping hero video. The video already contains its own
 * on-screen text — deliberately no HTML heading/paragraph/CTA is placed
 * over it (see project brief). Responsive framing lives in
 * content/media.ts (`heroVideo.objectPosition`).
 *
 * `active` is required and intentionally has no default: the entry-flow
 * state machine (IntroExperience) decides when the hero video may load
 * and play. While inactive, only the poster renders — the video element
 * is not mounted, so it cannot compete with the intro for bandwidth.
 */
export function Hero({ active }: { active: boolean }) {
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
        />
      </div>

      {/* Scroll cue — editorial treatment matching the brand's rectangular
          geometry: tracked-out label over a hairline track with a light
          streak descending through it. */}
      <a
        href="#project"
        aria-label="Scroll to Project Overview"
        className="group absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-3 sm:bottom-9"
      >
        <span className="pl-[0.32em] text-[0.625rem] font-medium uppercase tracking-[0.32em] text-white/70 drop-shadow-sm transition-colors duration-500 group-hover:text-white">
          Scroll
        </span>
        <span className="relative block h-12 w-px overflow-hidden bg-white/20 transition-colors duration-500 group-hover:bg-white/35 sm:h-14">
          <span className="absolute inset-0 animate-scroll-descend bg-gradient-to-b from-transparent via-white/80 to-white" />
        </span>
      </a>
    </section>
  );
}
