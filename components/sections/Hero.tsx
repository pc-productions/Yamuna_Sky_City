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

      {/* Premium subtle scroll indicator */}
      <a
        href="#project"
        aria-label="Scroll to Project Overview"
        className="group absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-white/70 transition-colors duration-300 hover:text-white sm:bottom-8"
      >
        <span className="text-[0.625rem] font-medium uppercase tracking-[0.28em] text-white/75 drop-shadow-sm transition-colors group-hover:text-white">
          Scroll
        </span>
        <div className="flex h-8 w-4.5 items-start justify-center rounded-full border border-white/30 p-1 backdrop-blur-[2px] transition-colors group-hover:border-white/80">
          <span className="h-1.5 w-1 rounded-full bg-white/90 animate-scroll-pulse" />
        </div>
      </a>
    </section>
  );
}
