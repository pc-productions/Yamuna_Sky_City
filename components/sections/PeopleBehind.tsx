import { contributors } from "@/content/people";
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
 * Editorial credibility section, driven entirely by content/people.ts —
 * add/remove/reorder contributors there without touching this component.
 * Renders nothing until verified contributor data is supplied, so no
 * placeholder rows ever reach visitors.
 */
export function PeopleBehind() {
  if (contributors.length === 0) return null;

  return (
    <section className="section-pad bg-paper">
      <Container className="flex flex-col gap-16 sm:gap-24">
        <Reveal>
          <SectionHeading
            eyebrow="People Behind the Project"
            heading="Built by a Team of Specialists."
          />
        </Reveal>

        <div className="flex flex-col divide-y divide-line border-y border-line">
          {contributors.map((person, i) => (
            <Reveal key={`${person.role}-${i}`} delayMs={i * 60}>
              <div className="flex flex-col gap-6 py-10 sm:flex-row sm:items-start sm:gap-10">
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
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
