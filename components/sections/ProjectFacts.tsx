import { projectFacts, projectIntro } from "@/content/facts";
import { brand } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { RevealLines } from "@/components/ui/RevealLines";

/**
 * Project Overview — the first editorial spread after the film.
 *
 * It slides up over the sticky hero (curtain) with its title block
 * right at the leading edge, so the eyebrow and headline rise into
 * view as the curtain climbs; the breathing room sits BELOW the facts
 * (section-bottom), where it separates this spread from the location
 * photograph rather than lifting the content off the top. Eyebrow and
 * project name settle, the headline rises line by line, the copy
 * follows, and the four facts arrive one after another on hairline
 * dividers. No cards, no counters, no decoration. All content and
 * facts come from the content layer.
 */
export function ProjectFacts() {
  return (
    <section
      id="project"
      className="section-top section-bottom scroll-mt-16 bg-white xl:scroll-mt-18"
    >
      <Container>
        <Reveal>
          <div className="h-[2px] w-12 bg-brand" />
          <p className="mt-5 text-[0.6875rem] font-medium uppercase tracking-[0.3em] text-brand">
            {projectIntro.eyebrow}
          </p>
        </Reveal>

        {/* Project name — the textual identifier after the text-free
            film. Smaller than the headline; never a logo recreation. */}
        <Reveal delayMs={90}>
          <p className="mt-5 font-display text-[clamp(1.125rem,1.7vw,1.5rem)] font-semibold uppercase leading-none tracking-[0.14em] text-brand sm:mt-6">
            {brand.name}
          </p>
          <p className="mt-3 text-[0.8125rem] uppercase tracking-[0.2em] text-ink/55">
            {projectIntro.positioning}
            <span aria-hidden="true" className="mx-3 text-line">
              |
            </span>
            {projectIntro.unitMix}
          </p>
        </Reveal>

        <RevealLines
          as="h1"
          lines={[...projectIntro.headlineLines]}
          delayMs={140}
          className="mt-5 max-w-6xl text-[clamp(2.5rem,5vw,4.375rem)] leading-[1.06] text-ink sm:mt-6"
        />

        <Reveal delayMs={320} className="mt-10 sm:mt-12 lg:mt-14">
          <div className="grid max-w-5xl grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-0">
            <p className="text-[1.0625rem] leading-[1.75] text-ink/80 lg:pr-14">
              {projectIntro.descriptionLeft}
            </p>
            <p className="text-[1.0625rem] leading-[1.75] text-ink/80 lg:border-l lg:border-mist-grey lg:pl-14">
              {projectIntro.descriptionRight}
            </p>
          </div>
        </Reveal>

        <Reveal
          variant="stagger"
          delayMs={200}
          className="mt-14 sm:mt-16 lg:mt-24"
        >
          {/* Symmetric grid: equal columns, a hairline exactly between
              neighbours with the same breathing room on both sides of
              it, outer edges flush with the container. Mobile is 2×2
              with the same rule per row. */}
          <div className="grid grid-cols-2 gap-y-14 lg:grid-cols-4 lg:gap-y-0">
            {projectFacts.map((fact, i) => {
              const mobile =
                i % 2 === 0 ? "pr-6" : "border-l border-mist-grey pl-6";
              const desktop =
                i === 0
                  ? "lg:border-l-0 lg:pl-0 lg:pr-10"
                  : i === projectFacts.length - 1
                    ? "lg:border-l lg:border-mist-grey lg:pl-10 lg:pr-0"
                    : "lg:border-l lg:border-mist-grey lg:px-10";
              return (
                <div
                  key={fact.label}
                  data-reveal-item=""
                  className={`flex flex-col gap-3 ${mobile} ${desktop}`}
                >
                  <span className="font-display text-[clamp(2.5rem,4.5vw,4rem)] font-semibold leading-none tracking-[-0.02em] text-ink">
                    {fact.value}
                  </span>
                  <span className="text-xs font-medium uppercase tracking-[0.14em] text-ink/60">
                    {fact.label}
                  </span>
                </div>
              );
            })}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
