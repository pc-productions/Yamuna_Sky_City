import Image from "next/image";
import { locationImage } from "@/content/media";

/**
 * Layer 0 — the aerial photograph, rendered INSIDE the shared
 * CoverFrame (LocationSection mounts one frame that carries the image
 * and every overlay layer, so the orbit's centre and the tower can
 * never drift apart). The building and environment come exclusively
 * from the supplied render (content/media.ts); nothing is recreated in
 * code. GSAP fades/settles this wrapper on entrance — the wrapper, not
 * the frame, so the settle zoom never moves the overlay.
 */
export function LocationBackground() {
  return (
    <div data-loc-bg="" className="absolute inset-0 z-0">
      <Image
        src={locationImage.src}
        alt={locationImage.alt}
        fill
        sizes="100vw"
        className="object-cover"
        loading="lazy"
      />
    </div>
  );
}
