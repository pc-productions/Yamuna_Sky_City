import { projectFacts, projectIntro } from "@/content/facts";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Editorial Overview composition matching official design:
 * - Gold accent rule and uppercase eyebrow
 * - Serif display heading with italic "Sea View" highlight
 * - Two-column narrative copy with center geometric accent
 * - Warm rounded stats card with 4-column metric grid
 */
export function ProjectFacts() {
  return (
    <section id="project" className="section-pad scroll-mt-14 xl:scroll-mt-16 bg-paper">
      <Container>
        <Reveal>
          {/* Top accent rule */}
          <div className="h-[2px] w-12 bg-[#C59A3F]" />
          <span className="eyebrow mt-6 block font-medium tracking-[0.24em] text-[#C59A3F]">
            {projectIntro.eyebrow}
          </span>

          {/* Editorial Display Heading */}
          <h2 className="mt-8 font-serif text-[2.75rem] font-normal leading-[1.08] tracking-tight text-ink sm:text-[4rem] lg:text-[5rem] normal-case">
            {projectIntro.headingMain}{" "}
            <span className="font-serif italic font-normal text-ink">
              {projectIntro.headingItalic}
            </span>
            <br />
            {projectIntro.headingSuffix}
          </h2>
        </Reveal>

        {/* Narrative columns with central circular accent */}
        <Reveal delayMs={80} className="mt-14 sm:mt-18">
          <div className="grid grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-14">
            <div className="flex flex-col gap-3">
              <span className="size-1.5 rounded-full bg-[#C59A3F]" />
              <p className="text-base leading-relaxed text-ink-muted sm:text-lg">
                {projectIntro.descriptionLeft}
              </p>
            </div>

            <div className="hidden items-center justify-center lg:flex">
              <div className="size-8 rounded-full border border-[#C59A3F]/50" />
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-base leading-relaxed text-ink-muted sm:text-lg lg:pt-4">
                {projectIntro.descriptionRight}
              </p>
            </div>
          </div>
        </Reveal>

        {/* Rounded warm-tinted facts card */}
        <Reveal delayMs={140} className="mt-16 sm:mt-24">
          <div className="rounded-3xl border border-[#EADBCE]/80 bg-[#F5EFEB] p-6 sm:p-10 lg:p-12">
            <div className="grid grid-cols-1 gap-y-8 divide-y divide-[#E5DDD4] sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10 sm:divide-y-0 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-y-0">
              {projectFacts.map((fact, i) => (
                <div
                  key={fact.label}
                  className={`flex flex-col items-center justify-center text-center ${
                    i > 0 ? "pt-8 sm:pt-0 lg:px-6" : "lg:pr-6"
                  }`}
                >
                  <span className="font-serif text-4xl font-normal tracking-tight text-ink sm:text-5xl lg:text-[3.75rem]">
                    {fact.value}
                  </span>
                  <span className="mt-3 text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-ink-faint">
                    {fact.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
