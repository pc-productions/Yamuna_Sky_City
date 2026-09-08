import { contributors, peopleSection } from "@/content/people";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The project team. Driven entirely by content/people.ts (verified from
 * the official brochure): an oversized editorial statement, then the
 * roster of consultants and contractors as a typographic grid — role,
 * firm, city — on hairlines. No portraits, no cards, no logos we do not
 * hold. If the roster is ever emptied the section falls back to the
 * statement alone.
 */
export function PeopleBehind() {
  const hasContributors = contributors.length > 0;

  return (
    <section id="team" className="scroll-mt-16 bg-paper xl:scroll-mt-18">
      <Container>
        <div className="border-t border-line" />
      </Container>
      <Container
        className={`flex flex-col ${
          hasContributors
            ? "section-top section-bottom gap-16 sm:gap-20 lg:gap-24"
            : "min-h-[62svh] justify-center py-24 sm:py-32"
        }`}
      >
        <SectionHeading
          eyebrow={peopleSection.eyebrow}
          heading={peopleSection.heading}
          headingLines={[...peopleSection.headingLines]}
          supportingLine={hasContributors ? peopleSection.supportingLine : undefined}
          size="lg"
        />

        {hasContributors && (
          <Reveal variant="stagger">
            <dl className="grid grid-cols-1 gap-x-10 border-t border-line sm:grid-cols-2 lg:grid-cols-3">
              {contributors.map((c) => (
                <div
                  key={`${c.role}-${c.name}`}
                  data-reveal-item=""
                  className="flex flex-col gap-2 border-b border-line py-7 pr-4 lg:py-8"
                >
                  <dt className="eyebrow text-brand">{c.role}</dt>
                  <dd className="font-display text-[1.0625rem] font-medium leading-snug text-ink sm:text-lg">
                    {c.name}
                    {c.location && (
                      <span className="mt-1 block text-sm font-normal text-ink-faint">{c.location}</span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
