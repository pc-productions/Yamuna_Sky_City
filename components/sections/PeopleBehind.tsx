import { contributors, peopleSection } from "@/content/people";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

function Initials({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return (
    <div className="flex size-16 shrink-0 items-center justify-center border border-line font-display text-lg text-ink-muted">
      {initials || "—"}
    </div>
  );
}

/**
 * Two rendering states, both driven by content/people.ts:
 * - Content-light (current): a single oversized editorial statement
 *   with a hairline above and air around it — intentional, not empty.
 *   No fake names, no placeholder rows.
 * - Full: adds the contributor rows automatically once verified entries
 *   exist in the data source.
 */
export function PeopleBehind() {
  const hasContributors = contributors.length > 0;

  return (
    <section className="bg-paper">
      <Container>
        <div className="border-t border-line" />
      </Container>
      <Container
        className={`flex flex-col gap-16 sm:gap-24 ${
          hasContributors ? "section-top section-bottom" : "min-h-[62svh] justify-center py-24 sm:py-32"
        }`}
      >
        <SectionHeading
          eyebrow={peopleSection.eyebrow}
          heading={peopleSection.heading}
          headingLines={["Designed and engineered", "by specialists."]}
          size="lg"
        />

        {hasContributors && (
          <Reveal variant="stagger">
            <div className="flex flex-col divide-y divide-line border-y border-line">
              {contributors.map((person, i) => (
                <div
                  key={`${person.role}-${i}`}
                  data-reveal-item=""
                  className="flex flex-col gap-6 py-10 sm:flex-row sm:items-start sm:gap-10"
                >
                  <Initials name={person.name} />
                  <div className="flex flex-col gap-1.5">
                    <span className="eyebrow text-brand">{person.role}</span>
                    <h3 className="font-display text-2xl text-ink">{person.name}</h3>
                    <p className="text-sm text-ink-muted">{person.organization}</p>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-faint">
                      {person.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
