import { legacyContent, legacyStats } from "@/content/legacy";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stat } from "@/components/ui/Stat";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Two rendering states, both driven by content/legacy.ts:
 * - Content-light (current): a minimal dark editorial statement —
 *   eyebrow + heading only. Nothing invented, no placeholder figures.
 * - Full: adds the narrative body and verified stat rows automatically
 *   once they exist in the data source.
 */
export function Legacy() {
  const hasStats = legacyStats.length > 0;

  return (
    <section
      id="legacy"
      data-header-tone="dark"
      className="dark-surface section-pad scroll-mt-14 xl:scroll-mt-16 bg-night text-mist"
    >
      <Container className="flex flex-col gap-16 sm:gap-24">
        <Reveal>
          <SectionHeading
            eyebrow={legacyContent.eyebrow}
            heading={legacyContent.heading}
            supportingLine={legacyContent.body || undefined}
            tone="dark"
          />
        </Reveal>

        {hasStats && (
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
