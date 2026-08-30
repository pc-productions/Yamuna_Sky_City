import { heroVideo } from "@/content/media";
import { VideoBackground } from "@/components/ui/VideoBackground";

/**
 * Full-screen looping hero video. The video already contains its own
 * on-screen text — deliberately no HTML heading/paragraph/CTA is placed
 * over it (see project brief). Responsive framing lives in
 * content/media.ts (`heroVideo.objectPosition`).
 */
export function Hero({ active = true }: { active?: boolean }) {
  return (
    <section aria-label="Yamuna Sky City" className="relative h-dvh w-full bg-night">
      <VideoBackground
        media={active ? heroVideo : { ...heroVideo, src: undefined }}
        priority
      />
    </section>
  );
}
