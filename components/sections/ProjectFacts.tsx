import { projectFacts, projectIntro } from "@/content/facts";
import { brand } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Project Overview — editorial architectural introduction on a Pearl
 * Ivory canvas (the warm brand surface, deliberately not white).
 *
 * Hierarchy: Ember accent rule + Inter eyebrow → Ember project name
 * (textual identifier only — the header carries the actual logo) →
 * Poppins Semibold uppercase headline with deliberate line breaks →
 * two-column factual copy separated by a hairline Mist Grey divider →
 * four oversized black facts sitting directly on the canvas with
 * hairline dividers. No cards, no decorative circles, no gold, no
 * serif — sophistication comes from typography, proportion and
 * whitespace. All content and facts come from the content layer.
 */
export function ProjectFacts() {
  return (
    <section id="project" className="scroll-mt-16 bg-pearl-ivory xl:scroll-mt-18">
      <Container className="pt-20 pb-24 sm:pt-28 sm:pb-32 lg:pb-40">
        {/* Section identifier */}
        <Reveal>
          <div className="h-[2px] w-12 bg-brand" />
          <p className="mt-5 text-[0.6875rem] font-medium uppercase tracking-[0.3em] text-brand">
            {projectIntro.eyebrow}
          </p>
        </Reveal>

        {/* Project name — textual identifier establishing the project
            after the text-free hero video. Deliberately smaller than the
            headline; never a logo recreation. */}
        <Reveal delayMs={50}>
          <p className="mt-6 font-display text-[clamp(1.125rem,1.7vw,1.5rem)] font-semibold uppercase leading-none tracking-[0.14em] text-brand sm:mt-7">
            {brand.name}
          </p>
        </Reveal>

        {/* Main headline — the page's primary heading. Poppins Semibold,
            uppercase and tight tracking come from the base h1 styles. */}
        <Reveal delayMs={100}>
          <h1 className="mt-6 max-w-6xl text-[clamp(2.5rem,5vw,4.375rem)] leading-[1.06] text-ink sm:mt-7">
            {projectIntro.headlineLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
        </Reveal>

        {/* Supporting factual copy — two columns with a hairline divider */}
        <Reveal delayMs={160} className="mt-12 sm:mt-16">
          <div className="grid max-w-5xl grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-0">
            <p className="text-[1.0625rem] leading-[1.7] text-ink/80 lg:pr-14">
              {projectIntro.descriptionLeft}
            </p>
            <p className="text-[1.0625rem] leading-[1.7] text-ink/80 lg:border-l lg:border-mist-grey lg:pl-14">
              {projectIntro.descriptionRight}
            </p>
          </div>
        </Reveal>

        {/* Facts — directly on the canvas, hairline dividers only,
            one unified black system. Mobile: 2×2. Desktop: one row. */}
        <Reveal delayMs={220} className="mt-16 sm:mt-20 lg:mt-24">
          <div className="grid grid-cols-2 gap-y-14 lg:grid-cols-4 lg:gap-y-0">
            {projectFacts.map((fact, i) => (
              <div
                key={fact.label}
                className={`flex flex-col gap-3 pr-4 ${
                  i % 2 === 1 ? "border-l border-mist-grey pl-6 sm:pl-10" : ""
                } ${i === 2 ? "lg:border-l lg:border-mist-grey lg:pl-10" : ""}`}
              >
                <span className="font-display text-[clamp(2.5rem,4.5vw,4rem)] font-semibold leading-none tracking-[-0.02em] text-ink">
                  {fact.value}
                </span>
                <span className="text-xs font-medium uppercase tracking-[0.14em] text-ink/60">
                  {fact.label}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
