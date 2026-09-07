import Image from "next/image";
import type { ReactNode } from "react";
import { explore3dPreview } from "@/content/media";
import { externalLinks } from "@/content/site";
import { explore3dSection } from "@/content/sections";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ParallaxMedia } from "@/components/motion/ParallaxMedia";

/**
 * Invitation into the external 3D experience. The photograph opens
 * through a soft mask while it settles from a slight zoom, then drifts
 * a few percent as the visitor scrolls past; on desktop, hover eases it
 * a touch closer. The call to action is typographic — a line of text
 * with a hairline, not a button — because the whole image is the link.
 *
 * Destination URL lives in content/site.ts (`externalLinks.explore3d`).
 * Unconfigured → no outbound link and an honest "Coming Soon".
 */
export function Explore3D() {
  const url = externalLinks.explore3d;
  const isConfigured = url.length > 0;

  const overlay = (
    <div
      className={`absolute inset-0 flex items-end bg-gradient-to-t from-night/70 via-night/15 to-transparent transition-opacity duration-[var(--motion-slow)] ${
        isConfigured ? "group-hover:opacity-90" : ""
      }`}
    >
      <div className="flex w-full flex-col gap-2 p-6 sm:flex-row sm:items-end sm:justify-between sm:p-10">
        <span className="font-display text-[0.8125rem] font-semibold uppercase tracking-[0.16em] text-paper sm:text-sm">
          {isConfigured ? (
            <span className="inline-flex items-center gap-3 border-b border-paper/60 pb-2 transition-[border-color] duration-[var(--motion-fast)] group-hover:border-paper">
              {explore3dSection.invitation}
              <span aria-hidden="true" className="inline-block transition-transform duration-[var(--motion-fast)] group-hover:translate-x-1">
                &#8599;
              </span>
              <span className="sr-only">({explore3dSection.externalNote})</span>
            </span>
          ) : (
            <span className="border-b border-paper/40 pb-2 text-paper/80">Coming Soon</span>
          )}
        </span>
        {isConfigured && (
          <span className="eyebrow text-[0.625rem] text-paper/65">{explore3dSection.externalNote}</span>
        )}
      </div>
    </div>
  );

  const preview = (
    <>
      <ParallaxMedia percent={5} className="absolute -inset-y-[5%] inset-x-0">
        <Image
          data-reveal-media=""
          src={explore3dPreview.src}
          alt={explore3dPreview.alt}
          fill
          sizes="(min-width: 1280px) 1152px, 100vw"
          className={`object-cover ${
            isConfigured ? "transition-[scale] duration-[var(--motion-cinematic)] ease-[var(--ease-editorial)] group-hover:scale-[1.025]" : ""
          }`}
          loading="lazy"
        />
      </ParallaxMedia>
      {overlay}
    </>
  );

  const frameClass = "group relative block aspect-[16/9] w-full overflow-hidden bg-night";

  let framed: ReactNode;
  if (isConfigured) {
    framed = (
      <a href={url} target="_blank" rel="noopener noreferrer" className={frameClass}>
        {preview}
      </a>
    );
  } else {
    framed = <div className={frameClass}>{preview}</div>;
  }

  return (
    <section id="explore-3d" className="section-top section-bottom scroll-mt-16 bg-paper xl:scroll-mt-18">
      <Container>
        <SectionHeading
          eyebrow={explore3dSection.eyebrow}
          heading={explore3dSection.heading}
          supportingLine={explore3dSection.supportingLine}
        />
        <Reveal variant="image" className="mt-16 sm:mt-20 lg:mt-24">
          {framed}
        </Reveal>
      </Container>
    </section>
  );
}
