import Image from "next/image";
import { privateViewingBackground } from "@/content/media";
import { ctaLabels } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Standalone visual conversion checkpoint between Location and the 3D
 * experience — a deliberate pause, not a form. One dominant CTA that
 * scrolls to the main Contact section.
 */
export function PrivateViewingCTA() {
  return (
    <section className="dark-surface relative flex min-h-[70vh] items-center overflow-hidden bg-night py-28">
      <Image
        src={privateViewingBackground.src}
        alt={privateViewingBackground.alt}
        fill
        sizes="100vw"
        className="object-cover opacity-70"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-night via-night/60 to-night/20" />

      <Container className="relative z-10">
        <Reveal className="mx-auto flex max-w-xl flex-col items-center gap-8 text-center">
          <h2 className="font-display text-4xl font-medium leading-[1.15] text-white sm:text-5xl">
            The view is only the beginning.
          </h2>
          <p className="text-lg text-mist-muted">
            Experience Yamuna Sky City in person.
          </p>
          <Button href="#contact" variant="primary" size="large">
            {ctaLabels.scheduleViewing}
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
