import Image from "next/image";
import { locationImage } from "@/content/media";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Location is presented as a designed static image asset (not a live/
 * interactive map) — the custom connectivity diagram is the centerpiece
 * and the surrounding typography deliberately stays quiet. Swap
 * `locationImage.src` in content/media.ts to replace the artwork; the
 * aspect-ratio box keeps loading stable and distortion-free.
 */
export function Location() {
  return (
    <section id="location" className="section-pad scroll-mt-18 bg-paper">
      <Container>
        <Reveal>
          <SectionHeading eyebrow="Location" heading="The Location." />
        </Reveal>

        <Reveal delayMs={100} className="mt-16 sm:mt-24">
          <div className="relative mx-auto aspect-square w-full max-w-4xl">
            <Image
              src={locationImage.src}
              alt={locationImage.alt}
              fill
              sizes="(min-width: 1024px) 896px, 100vw"
              className="object-contain"
              loading="lazy"
            />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
