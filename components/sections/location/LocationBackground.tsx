import Image from "next/image";
import { locationImage } from "@/content/media";
import { CoverFrame } from "@/components/sections/location/CoverFrame";

/**
 * Layer 0 — the aerial photograph. The building and environment come
 * exclusively from the supplied render (content/media.ts); nothing is
 * recreated in code. GSAP fades/settles this frame in on entrance.
 */
export function LocationBackground() {
  return (
    <CoverFrame className="z-0" data-loc-bg="">
      <Image
        src={locationImage.src}
        alt={locationImage.alt}
        fill
        sizes="100vw"
        className="object-cover"
        loading="lazy"
      />
    </CoverFrame>
  );
}
