import { ctaLabels } from "@/content/site";
import { privateViewingSection } from "@/content/sections";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { RevealLines } from "@/components/ui/RevealLines";

/**
 * The pause after the location reveal. A flat SkyCity Ember field (the
 * brand's colour blocking), nothing on it but a statement and one
 * confident CTA — arriving in sequence: eyebrow, headline lines, the
 * single supporting line, then the button. Generous height so the
 * moment has silence around it; centred so it reads as a title card,
 * not an advertisement.
 */
export function PrivateViewingCTA() {
  return (
    <section
      data-header-tone="dark"
      className="dark-surface flex min-h-[82svh] items-center overflow-hidden bg-brand sm:min-h-[88svh]"
    >
      <Container className="py-24 sm:py-32">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <Reveal>
            <span className="eyebrow block text-paper/90">{privateViewingSection.eyebrow}</span>
          </Reveal>
          <RevealLines
            as="h2"
            lines={[...privateViewingSection.headlineLines]}
            delayMs={120}
            className="mt-8 text-[clamp(2.25rem,4.8vw,4.5rem)] leading-[1.06] text-paper"
          />
          <Reveal delayMs={420}>
            <p className="mt-8 text-lg text-paper/80 sm:text-xl">
              {privateViewingSection.supportingLine}
            </p>
          </Reveal>
          <Reveal delayMs={600}>
            <Button href="#contact" variant="outline-light" size="large" className="mt-12">
              {ctaLabels.scheduleViewing}
            </Button>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
