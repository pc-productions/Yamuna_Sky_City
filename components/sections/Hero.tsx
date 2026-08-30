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
    <section aria-label="Yamuna Sky City" className="relative h-dvh w-full bg-night">
      <VideoBackground
        media={active ? heroVideo : { ...heroVideo, src: undefined }}
        priority={active}
      />
    </section>
  );
}
