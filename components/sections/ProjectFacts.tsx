import { projectFacts, projectIntro } from "@/content/facts";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Editorial "specification sheet" composition — a large architectural
 * title, then each fact as a full-width hairline row: oversized numeral
 * left, understated label right. Deliberately not a statistics-card grid.
 * All facts come from content/facts.ts.
 */
export function ProjectFacts() {
  return (
    <section id="project" className="section-pad scroll-mt-14 xl:scroll-mt-16 bg-paper">
      <Container>
        <Reveal>
          <span className="eyebrow text-brand">{projectIntro.eyebrow}</span>
          <h2 className="text-display-xl mt-8 text-ink">
            Yamuna
            <br />
            Sky City
          </h2>
          {projectIntro.supportingLine && (
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-muted">
              {projectIntro.supportingLine}
            </p>
          )}
        </Reveal>

        <div className="mt-20 sm:mt-28">
          {projectFacts.map((fact, i) => (
            <Reveal key={fact.label} delayMs={i * 60}>
              <div className="flex flex-col gap-2 border-t border-line py-8 sm:flex-row sm:items-baseline sm:justify-between sm:py-10">
                <span className="text-stat-lg font-display text-ink">{fact.value}</span>
                <span className="eyebrow text-ink-faint">{fact.label}</span>
              </div>
            </Reveal>
          ))}
          <div className="border-t border-line" />
        </div>
      </Container>
    </section>
  );
}
