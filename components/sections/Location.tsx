import Image from "next/image";
import { locationImage } from "@/content/media";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Location is presented as a designed static image asset (not a live/
 * interactive map). Swap `locationImage.src` in content/media.ts to
 * replace it — no component changes needed.
 */
export function Location() {
  return (
    <section id="location" className="scroll-mt-18 bg-paper-muted py-24 sm:py-32">
      <Container className="flex flex-col gap-14">
        <Reveal>
          <SectionHeading
            eyebrow="Location"
            heading="Positioned at the Center of Everything."
            supportingLine="Yamuna Sky City sits within easy reach of the city's essential landmarks and infrastructure."
          />
        </Reveal>

        <Reveal delayMs={100}>
          <div className="relative mx-auto aspect-square w-full max-w-3xl overflow-hidden border border-line bg-paper">
            <Image
              src={locationImage.src}
              alt={locationImage.alt}
              fill
              sizes="(min-width: 1024px) 768px, 100vw"
              className="object-contain"
              loading="lazy"
            />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
