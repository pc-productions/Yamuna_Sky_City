import Image from "next/image";
import type { ReactNode } from "react";
import { explore3dPreview } from "@/content/media";
import { ctaLabels, externalLinks } from "@/content/site";
import { explore3dSection } from "@/content/sections";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ParallaxMedia } from "@/components/motion/ParallaxMedia";

/**
 * Invitation into the external 3D experience. The photograph opens
 * through a soft mask while it settles from a slight zoom, then drifts
 * a few percent as the visitor scrolls past. It sits softly blurred
 * under a quiet dim with the site's primary CTA box centred on it, so
 * the frame unmistakably reads as one thing to click; on desktop, hover
 * sharpens the picture and eases it closer. The whole image is the link.
 *
 * Destination URL lives in content/site.ts (`externalLinks.explore3d`).
 * Unconfigured → no outbound link and an honest "Coming Soon".
 */
export function Explore3D() {
  const url = externalLinks.explore3d;
  const isConfigured = url.length > 0;

  // The whole frame is the link, so the "button" is a non-interactive
  // box styled exactly like the site's primary CTA (components/ui/Button,
  // variant primary, size large) — nested anchors are not allowed.
  const ctaBox =
    "font-display inline-flex items-center justify-center gap-3 whitespace-nowrap bg-brand px-8 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-paper shadow-[0_18px_50px_-20px_rgba(0,0,0,0.6)] transition-[background-color,transform] duration-[var(--motion-fast)] sm:px-11 sm:py-[1.125rem]";

  const overlay = (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center gap-5 bg-night/45 px-6 text-center transition-[background-color] duration-[var(--motion-slow)] ${
        isConfigured ? "group-hover:bg-night/35" : ""
      }`}
    >
      {isConfigured ? (
        <>
          <span className={`${ctaBox} group-hover:bg-brand-dark group-hover:-translate-y-0.5`}>
            {ctaLabels.exploreIn3d}
            <span aria-hidden="true" className="inline-block transition-transform duration-[var(--motion-fast)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              &#8599;
            </span>
            <span className="sr-only">({explore3dSection.externalNote})</span>
          </span>
          <span className="flex flex-col items-center gap-1.5">
            <span className="text-sm text-paper/90 sm:text-base">{explore3dSection.invitation}</span>
            <span className="eyebrow text-[0.625rem] text-paper/60">{explore3dSection.externalNote}</span>
          </span>
        </>
      ) : (
        <span className={`${ctaBox} bg-night/60 text-paper/80`}>Coming Soon</span>
      )}
    </div>
  );

  const preview = (
    <>
      <ParallaxMedia percent={5} className="absolute -inset-y-[5%] -inset-x-[1%]">
        {/* Softly blurred at rest — the photograph is a doorway, not the
            destination — and sharpening as the visitor reaches for it. */}
        <Image
          data-reveal-media=""
          src={explore3dPreview.src}
          alt={explore3dPreview.alt}
          fill
          sizes="(min-width: 1280px) 1152px, 100vw"
          className={`object-cover blur-[3px] ${
            isConfigured
              ? "transition-[scale,filter] duration-[var(--motion-cinematic)] ease-[var(--ease-editorial)] group-hover:scale-[1.03] group-hover:blur-[1px]"
              : ""
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
