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
    <div
      data-loc-bg=""
      className="absolute inset-0 z-0 overflow-hidden"
      /* Every edge of the photograph is feathered by a static mask, so
         the image dissolves into the surrounding white instead of
         ending in a hard line — at rest AND mid-animation (the entrance
         zoom scales the img INSIDE this masked window, so the feathered
         edge itself never moves). The right feather sits past the
         viewport (the frame is shifted 5vw right) and is simply never
         seen. */
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0px, black 56px, black calc(100% - 56px), transparent 100%), linear-gradient(to bottom, transparent 0px, black 44px, black calc(100% - 28px), transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0px, black 56px, black calc(100% - 56px), transparent 100%), linear-gradient(to bottom, transparent 0px, black 44px, black calc(100% - 28px), transparent 100%)",
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
      }}
    >
      {/* The image box extends 5px above the frame so the photo's top
          5px are cropped away by the wrapper's overflow. */}
      <Image
        src={locationImage.src}
        alt={locationImage.alt}
        fill
        sizes="100vw"
        className="object-cover"
        style={{ top: "-5px", height: "calc(100% + 5px)" }}
        loading="lazy"
      />
    </div>
  );
}
