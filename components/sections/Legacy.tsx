import { hasLegacyContent, legacyContent, legacyStats } from "@/content/legacy";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stat } from "@/components/ui/Stat";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Renders nothing until verified legacy content exists in
 * content/legacy.ts — no invented figures or placeholder rows are ever
 * shown to visitors. Populate the data and the section appears.
 */
export function Legacy() {
  if (!hasLegacyContent()) return null;

  return (
    <section id="legacy" className="dark-surface scroll-mt-18 bg-night py-24 text-mist sm:py-32">
      <Container className="flex flex-col gap-16">
        <Reveal>
          <SectionHeading
            eyebrow={legacyContent.eyebrow}
            heading={legacyContent.heading}
            supportingLine={legacyContent.body || undefined}
            tone="dark"
          />
        </Reveal>

        {legacyStats.length > 0 && (
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 border-t border-line-dark pt-14 sm:grid-cols-3">
            {legacyStats.map((stat, i) => (
              <Reveal key={stat.label} delayMs={i * 80}>
                <Stat value={stat.value} label={stat.label} tone="dark" />
              </Reveal>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
