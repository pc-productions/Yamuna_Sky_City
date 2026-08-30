import { projectFacts, projectIntro } from "@/content/facts";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stat } from "@/components/ui/Stat";
import { Reveal } from "@/components/ui/Reveal";

export function ProjectFacts() {
  return (
    <section id="project" className="scroll-mt-18 bg-paper py-24 sm:py-32">
      <Container className="flex flex-col gap-16">
        <Reveal>
          <SectionHeading
            eyebrow={projectIntro.eyebrow}
            heading="Yamuna Sky City"
            supportingLine={projectIntro.supportingLine}
          />
        </Reveal>

        <div className="grid grid-cols-2 gap-x-8 gap-y-14 border-t border-line pt-14 sm:grid-cols-3 lg:grid-cols-5">
          {projectFacts.map((fact, i) => (
            <Reveal key={fact.label} delayMs={i * 80}>
              <Stat value={fact.value} label={fact.label} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
