import { legacyContent, legacyStats } from "@/content/legacy";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stat } from "@/components/ui/Stat";
import { Reveal } from "@/components/ui/Reveal";

export function Legacy() {
  return (
    <section id="legacy" className="dark-surface scroll-mt-18 bg-night py-24 text-mist sm:py-32">
      <Container className="flex flex-col gap-16">
        <Reveal>
          <SectionHeading
            eyebrow={legacyContent.eyebrow}
            heading={legacyContent.heading}
            supportingLine={legacyContent.body}
            tone="dark"
          />
        </Reveal>

        <div className="grid grid-cols-1 gap-x-8 gap-y-12 border-t border-line-dark pt-14 sm:grid-cols-3">
          {legacyStats.map((stat, i) => (
            <Reveal key={stat.label} delayMs={i * 80}>
              <Stat value={stat.value} label={stat.label} tone="dark" />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
