import Image from "next/image";
import { locationImage } from "@/content/media";
import { connectivity, locationContent } from "@/content/location";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Location is presented as a designed static image asset (not a live/
 * interactive map) — the approved "Perfectly Connected" connectivity
 * artwork is the centerpiece; the surrounding typography stays quiet.
 * Copy lives in content/location.ts; swap `locationImage.src` in
 * content/media.ts to drop in the final export. The fixed aspect-ratio
 * frame keeps loading stable and distortion-free.
 */
export function Location() {
  return (
    <section id="location" className="scroll-mt-16 bg-paper-muted pt-8 pb-0 sm:pt-0 xl:scroll-mt-18">
      {/* The artwork carries the header and supporting text itself on larger screens;
          the HTML text renders only on mobile, where the artwork's baked-in text is too small. */}
      <Container className="sm:hidden">
        <Reveal>
          <SectionHeading eyebrow={locationContent.eyebrow} heading={locationContent.heading} />
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
            {locationContent.supportingLine}
          </p>
        </Reveal>
      </Container>

      {/* Full-bleed edge-to-edge artwork flush with the next section */}
      <Reveal delayMs={100} className="mt-12 block w-full sm:mt-0">
        <div
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: locationImage.aspect }}
        >
          <Image
            src={locationImage.src}
            alt={locationImage.alt}
            fill
            sizes="100vw"
            className="w-full object-cover"
            loading="lazy"
          />
        </div>
      </Reveal>

      {/* The artwork's labels are too small to read on phones, so the
          same verified travel times (content/location.ts) render as a
          quiet list on mobile only. */}
      <Container className="py-10 sm:hidden">
        <Reveal delayMs={150}>
          <ul>
            {connectivity.map((item) => (
              <li
                key={item.label}
                className="flex items-baseline justify-between gap-6 border-t border-line py-4 last:border-b"
              >
                <span className="text-sm text-ink-muted">{item.label}</span>
                <span className="font-display text-xl whitespace-nowrap text-ink">
                  {item.minutes} min
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
