import { ctaLabels } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Major conversion checkpoint between Location and the 3D experience —
 * a strong flat SkyCity Ember block per the brand guidelines' colour
 * blocking: Poppins heading in Pearl Ivory, one dominant CTA, no card,
 * no form, no decoration. (When a real project render is approved this
 * can become an image-backed section again via content/media.ts.)
 */
export function PrivateViewingCTA() {
  return (
    <section
      data-header-tone="dark"
      className="dark-surface relative flex min-h-[70svh] items-center overflow-hidden bg-brand sm:min-h-[80svh]"
    >
      <Container className="section-pad relative z-10">
        <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-10 text-center">
          <h2 className="text-display-lg text-paper">The view is only the beginning.</h2>
          <p className="text-lg text-paper/80">Experience Yamuna Sky City in person.</p>
          <Button href="#contact" variant="outline-light" size="large" className="mt-2">
            {ctaLabels.scheduleViewing}
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
