import Image from "next/image";
import { locationImage } from "@/content/media";
import { connectivity, locationContent } from "@/content/location";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { LocationConnectivity } from "@/components/sections/LocationConnectivity";

/**
 * Location — the clean aerial render is the immutable base layer; every
 * piece of connectivity information (rings, connection lines, markers,
 * travel times, heading, copy) is programmatic overlay, so content edits
 * never require touching the image. Layering: image → readability
 * scrims → SVG rings/lines → markers → heading/copy. Data lives in
 * content/location.ts (values + normalized overlay geometry); the image
 * path/aspect in content/media.ts. Mobile swaps the marker overlay for
 * the structured travel-time list below the image.
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
          className="location-figure relative w-full overflow-hidden"
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
          {/* Soft veil at the top of the artwork (sm+ only, where the
              image sits flush against the overview section): a white fade
              plus a gently masked blur so the sections melt together
              instead of meeting at a hard edge. On mobile the image is a
              framed figure between text blocks, so it stays untouched. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 z-[5] hidden h-28 bg-gradient-to-b from-white via-white/45 to-transparent sm:block"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 z-[5] hidden h-28 backdrop-blur-[3px] sm:block"
            style={{
              maskImage: "linear-gradient(to bottom, black, transparent)",
              WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
            }}
          />
          {/* Localized readability wash behind the heading/copy only —
              soft enough that the landscape stays visible through it. */}
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-0 z-[2] hidden w-[30%] bg-gradient-to-r from-white/65 via-white/25 to-transparent sm:block"
          />

          {/* Rings, connection lines and destination markers — all
              programmatic, sharing one normalized coordinate system. */}
          <LocationConnectivity />

          {/* Section label, heading and supporting copy over the image
              (sm+ only — mobile has its own HTML heading above). Anchored
              to the image's left column; type scales with the image so
              the block clears the overlay markers at every width. The
              top offset keeps the same navbar rhythm as other sections. */}
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
            {/* Supporting copy joins from lg up — at tablet widths the
                left column is too tight to share with the glass tags. */}
            <p className="mt-[2vw] hidden max-w-[23vw] text-[clamp(0.6875rem,1vw,1.0625rem)] leading-[1.65] text-ink/85 lg:block">
              {locationContent.supportingLine}
            </p>
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
