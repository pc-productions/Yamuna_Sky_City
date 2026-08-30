import Image from "next/image";
import { explore3dPreview } from "@/content/media";
import { ctaLabels, externalLinks } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Links out to an external 3D mapping experience. The destination URL is
 * centralized in content/site.ts (`externalLinks.explore3d`) — never
 * hardcode it elsewhere. Opens in a new tab with rel="noopener noreferrer".
 * The preview image is the main visual; the CTA sits over it as a quiet
 * hairline-framed label that fills on hover.
 */
export function Explore3D() {
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
          <a
            href={externalLinks.explore3d}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block aspect-[16/9] w-full overflow-hidden bg-night"
          >
            <Image
              src={explore3dPreview.src}
              alt={explore3dPreview.alt}
              fill
              sizes="(min-width: 1280px) 1152px, 100vw"
              className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.02]"
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-night/25 transition-colors duration-500 group-hover:bg-night/40">
              <span className="border border-white/60 px-10 py-[1.125rem] text-xs font-semibold uppercase tracking-[0.24em] text-white transition-colors duration-300 group-hover:border-white group-hover:bg-white group-hover:text-night">
                {ctaLabels.exploreIn3d}
              </span>
            </div>
          </a>
        </Reveal>
      </Container>
    </section>
  );
}
