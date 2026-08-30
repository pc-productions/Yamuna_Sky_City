import Image from "next/image";
import { privateViewingBackground } from "@/content/media";
import { ctaLabels } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Full-bleed cinematic pause between Location and the 3D experience —
 * one large visual, minimal copy, one dominant CTA scrolling to Contact.
 * No card, no form, no competing elements.
 */
export function PrivateViewingCTA() {
  return (
    <section
      data-header-tone="dark"
      className="dark-surface relative flex min-h-[85svh] items-center overflow-hidden bg-night"
    >
      <Image
        src={privateViewingBackground.src}
        alt={privateViewingBackground.alt}
        fill
        sizes="100vw"
        className="object-cover opacity-70"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-night via-night/50 to-night/10" />

      <Container className="section-pad relative z-10">
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-10 text-center">
          <h2 className="text-display-lg text-white">The view is only the beginning.</h2>
          <p className="text-lg text-mist-muted">Experience Yamuna Sky City in person.</p>
          <Button href="#contact" variant="outline-light" size="large" className="mt-2">
            {ctaLabels.scheduleViewing}
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
