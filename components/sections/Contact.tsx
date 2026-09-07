import { formCopy } from "@/content/form";
import { contactSection } from "@/content/sections";
import { Container } from "@/components/ui/Container";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { Reveal } from "@/components/ui/Reveal";
import { RevealLines } from "@/components/ui/RevealLines";

/**
 * The conclusion. After the dark legacy card the page returns to light
 * and to the visitor: a bridge line, the invitation, and the form —
 * the same shared form and CRM boundary as the modal, only the
 * surrounding composition differs.
 */
export function Contact() {
  return (
    <section id="contact" className="section-top section-bottom scroll-mt-16 bg-paper-muted xl:scroll-mt-18">
      <Container>
        <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
          <div className="lg:pt-2">
            <Reveal>
              <span className="eyebrow block text-brand">{contactSection.eyebrow}</span>
              <p className="mt-7 max-w-sm text-base leading-relaxed text-ink-faint">
                {contactSection.lead}
              </p>
            </Reveal>
            <RevealLines
              as="h2"
              lines={[formCopy.heading]}
              delayMs={160}
              className="text-display-lg mt-6 text-ink"
            />
            <Reveal delayMs={340}>
              <p className="mt-7 max-w-md text-lg leading-relaxed text-ink-muted">
                {formCopy.supportingLine}
              </p>
            </Reveal>
          </div>

          <Reveal delayMs={260} className="lg:pt-2">
            <EnquiryForm source="contact-section" tone="light" />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
