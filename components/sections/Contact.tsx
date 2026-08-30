import { formCopy } from "@/content/form";
import { Container } from "@/components/ui/Container";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Main conversion hub. Shares its form logic/validation with the Enquiry
 * modal via components/forms/EnquiryForm — only the surrounding
 * presentation differs.
 */
export function Contact() {
  return (
    <section id="contact" className="scroll-mt-18 bg-paper-muted py-24 sm:py-32">
      <Container className="mx-auto flex max-w-xl flex-col gap-10">
        <Reveal className="flex flex-col gap-4 text-center">
          <h2 className="font-display text-4xl font-medium text-ink sm:text-5xl">
            {formCopy.heading}
          </h2>
          <p className="text-lg text-ink-muted">{formCopy.supportingLine}</p>
        </Reveal>

        <Reveal delayMs={100}>
          <EnquiryForm source="contact-section" tone="light" />
        </Reveal>
      </Container>
    </section>
  );
}
