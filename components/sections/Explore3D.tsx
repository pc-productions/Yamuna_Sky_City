import Image from "next/image";
import type { ReactNode } from "react";
import { explore3dPreview } from "@/content/media";
import { ctaLabels, externalLinks } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

/**
 * External 3D mapping experience. The destination URL is centralized in
 * content/site.ts (`externalLinks.explore3d`) — never hardcode it
 * elsewhere. While the URL is unconfigured (empty), the preview renders
 * without an outbound link and the CTA reads "Coming Soon", so visitors
 * are never sent to a placeholder destination; setting the URL makes the
 * section fully functional with no component changes (new tab,
 * rel="noopener noreferrer").
 */
export function Explore3D() {
  const url = externalLinks.explore3d;
  const isConfigured = url.length > 0;

  const overlay = (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center gap-4 bg-night/25 transition-colors duration-500 ${
        isConfigured ? "group-hover:bg-night/40" : ""
      }`}
    >
      <span
        className={`border px-10 py-[1.125rem] text-xs font-semibold uppercase tracking-[0.24em] text-white transition-colors duration-300 ${
          isConfigured
            ? "border-white/60 group-hover:border-white group-hover:bg-white group-hover:text-night"
            : "border-white/40 text-white/80"
        }`}
      >
        {isConfigured ? (
          <>
            {ctaLabels.exploreIn3d}
            {/* Outward arrow signals an external destination. */}
            <span aria-hidden="true" className="ml-3 inline-block">
              &#8599;
            </span>
            <span className="sr-only">(opens in a new tab)</span>
          </>
        ) : (
          "Coming Soon"
        )}
      </span>
      {isConfigured && (
        <span className="text-[0.625rem] font-medium uppercase tracking-[0.2em] text-white/60">
          External experience
        </span>
      )}
    </div>
  );

  const preview = (
    <>
      <Image
        src={explore3dPreview.src}
        alt={explore3dPreview.alt}
        fill
        sizes="(min-width: 1280px) 1152px, 100vw"
        className={`object-cover ${
          isConfigured
            ? "transition-transform duration-[1.2s] ease-out group-hover:scale-[1.02]"
            : ""
        }`}
        loading="lazy"
      />
      {overlay}
    </>
  );

  const frameClass = "relative block aspect-[16/9] w-full overflow-hidden bg-night";

  let framed: ReactNode;
  if (isConfigured) {
    framed = (
      <a href={url} target="_blank" rel="noopener noreferrer" className={`group ${frameClass}`}>
        {preview}
      </a>
    );
  } else {
    framed = <div className={frameClass}>{preview}</div>;
  }

  return (
    <section id="explore-3d" className="section-pad scroll-mt-18 bg-paper">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="3D Experience"
            heading="See Where Yamuna Sky City Rises."
            supportingLine="Explore the project and its surroundings through an immersive 3D location experience."
          />
        </Reveal>

        <Reveal delayMs={100} className="mt-16 sm:mt-24">
          {framed}
        </Reveal>
      </Container>
    </section>
  );
}
