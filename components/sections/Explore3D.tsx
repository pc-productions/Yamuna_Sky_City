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
 */
export function Explore3D() {
  return (
    <section id="explore-3d" className="scroll-mt-18 bg-paper py-24 sm:py-32">
      <Container className="flex flex-col gap-14">
        <Reveal>
          <SectionHeading
            eyebrow="3D Experience"
            heading="See Where Yamuna Sky City Rises."
            supportingLine="Explore the project and its surroundings through an immersive 3D location experience."
          />
        </Reveal>

        <Reveal delayMs={100}>
          <a
            href={externalLinks.explore3d}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block aspect-video w-full overflow-hidden bg-night"
          >
            <Image
              src={explore3dPreview.src}
              alt={explore3dPreview.alt}
              fill
              sizes="100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-night/30 transition-colors group-hover:bg-night/40">
              <span className="border border-white/70 px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                {ctaLabels.exploreIn3d}
              </span>
            </div>
          </a>
        </Reveal>
      </Container>
    </section>
  );
}
