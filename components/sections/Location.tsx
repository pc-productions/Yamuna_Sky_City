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
    <section id="location" className="section-pad scroll-mt-14 xl:scroll-mt-16 bg-paper-muted">
      <Container>
        <Reveal>
          <SectionHeading eyebrow={locationContent.eyebrow} heading={locationContent.heading} />
          {/* The artwork carries this copy itself on larger screens; the
              HTML version renders only on mobile, where the artwork's
              baked-in text is too small to read. */}
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted sm:hidden">
            {locationContent.supportingLine}
          </p>
        </Reveal>

        <Reveal delayMs={100} className="mt-16 sm:mt-24">
          <div
            className="relative w-full overflow-hidden"
            style={{ aspectRatio: locationImage.aspect }}
          >
            <Image
              src={locationImage.src}
              alt={locationImage.alt}
              fill
              sizes="(min-width: 1280px) 1152px, 100vw"
              className="object-cover"
              loading="lazy"
            />
          </div>
        </Reveal>

        {/* The artwork's labels are too small to read on phones, so the
            same verified travel times (content/location.ts) render as a
            quiet list on mobile only — the image stays the sole carrier
            of this data on larger screens. */}
        <Reveal delayMs={150} className="mt-12 sm:hidden">
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
