import { projectFacts } from "@/content/facts";
import { contact, ctaLabels } from "@/content/site";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { RevealLines } from "@/components/ui/RevealLines";
import { JournalLink } from "@/components/journal/JournalLink";
import { RequestBrochureButton } from "@/components/journal/RequestBrochureButton";

/**
 * The Journal's one conversion moment: the brand's Ember field, a
 * statement, two actions — the same visual grammar as the homepage's
 * Private Viewing checkpoint, compact enough not to compete with the
 * article. Copy is built only from verified facts (content/facts.ts,
 * content/site.ts). "Request brochure" opens the existing enquiry modal.
 */
export const journalCtaCopy = {
  eyebrow: "Discover Yamuna Sky City",
  headlineLines: ["The sea, the city,", "and a tower between them."],
  explore: "Explore Sky City",
  brochure: "Request Brochure",
} as const;

export function JournalCTA({ slug, placement = "journal-cta" }: { slug?: string; placement?: string }) {
  const apartments = projectFacts.find((f) => f.label === "LUXURY APARTMENTS")?.value;
  const supporting = `Explore ${apartments ? `${apartments} ` : ""}sea-facing residences on ${contact.projectSiteLine}.`;

  return (
    <section data-header-tone="dark" className="dark-surface bg-brand text-paper">
      <Container className="py-20 sm:py-28">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Reveal>
            <span className="eyebrow block text-paper/90">{journalCtaCopy.eyebrow}</span>
          </Reveal>
          <RevealLines
            as="h2"
            lines={[...journalCtaCopy.headlineLines]}
            delayMs={120}
            className="mt-7 text-[clamp(1.75rem,3.6vw,3rem)] leading-[1.1] text-paper"
          />
          <Reveal delayMs={360}>
            <p className="mt-6 text-base text-paper/80 sm:text-lg">{supporting}</p>
          </Reveal>
          <Reveal delayMs={520} className="mt-10 flex flex-col gap-4 sm:flex-row">
            <JournalLink
              href="/#project"
              track={{ event: "blog_project_click", slug, href: "/#project", placement }}
              className="font-display inline-flex items-center justify-center whitespace-nowrap bg-paper px-7 py-3.5 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-ink transition-colors duration-300 hover:bg-pearl-ivory"
            >
              {journalCtaCopy.explore}
            </JournalLink>
            <RequestBrochureButton slug={slug} placement={placement} variant="outline-light">
              {journalCtaCopy.brochure}
            </RequestBrochureButton>
          </Reveal>
          <Reveal delayMs={640}>
            <p className="mt-6 text-xs text-paper/85">
              Or {ctaLabels.scheduleViewing.toLowerCase()}:{" "}
              <Link href="/#contact" className="underline underline-offset-2 hover:text-paper">
                contact the sales team
              </Link>
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
