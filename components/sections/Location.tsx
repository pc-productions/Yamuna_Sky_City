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
          {/* Section label + heading over the artwork (sm+ only — mobile
              has its own HTML heading above). Anchored to the artwork's
              own text column (3% inset, where its baked title sits) and
              styled to match the artwork's title treatment — compact
              uppercase red (sampled from the artwork), sparkle, hairline
              underline — with the font scaling with the image so it can
              never collide with the baked badges at any viewport width.
              The top offset keeps the same navbar rhythm as every other
              section. */}
          <div className="absolute top-0 left-[3%] z-10 hidden pt-8 sm:block sm:pt-10">
            <span className="eyebrow block text-brand">{locationContent.eyebrow}</span>
            <div className="mt-6 inline-block">
              <h2 className="font-display text-[clamp(0.8125rem,1.44vw,1.725rem)] font-semibold uppercase tracking-[0.04em] text-[#DA2B1D]">
                {locationContent.heading}
                <span aria-hidden="true" className="pl-[0.5em] text-[0.8em]">
                  ✦
                </span>
              </h2>
              <div className="mt-2.5 h-[2px] w-full bg-[#DA2B1D]" />
            </div>
          </div>
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
