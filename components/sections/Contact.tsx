import { formCopy } from "@/content/form";
import { Container } from "@/components/ui/Container";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Main conversion hub — editorial two-column composition on desktop:
 * heading and supporting copy hold the left column, the form the right.
 * Shares its form logic/validation with the Enquiry modal via
 * components/forms/EnquiryForm — only the surrounding presentation differs.
 */
export function Contact() {
  return (
    <section id="contact" className="section-pad scroll-mt-16 xl:scroll-mt-18 bg-paper-muted">
      <Container>
        <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
          <Reveal>
            <span className="eyebrow text-brand">Private Viewing</span>
            <h2 className="text-display-lg mt-8 text-ink">{formCopy.heading}</h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-muted">
              {formCopy.supportingLine}
            </p>
          </Reveal>

          <Reveal delayMs={100} className="lg:pt-2">
            <EnquiryForm source="contact-section" tone="light" />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
