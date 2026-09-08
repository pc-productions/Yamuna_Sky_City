import { legacyContent, legacyStats } from "@/content/legacy";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stat } from "@/components/ui/Stat";
import { Reveal } from "@/components/ui/Reveal";
import { ParallaxMedia } from "@/components/motion/ParallaxMedia";

/**
 * Two rendering states, both driven by content/legacy.ts:
 * - Content-light (current): a dark title card — one oversized line of
 *   type drifting very slowly with the scroll, and negative space.
 *   Nothing invented, no placeholder figures.
 * - Full: adds the narrative body and verified stat rows automatically
 *   once they exist in the data source.
 */
export function Legacy() {
  const hasStats = legacyStats.length > 0;

  return (
    <section
      id="legacy"
      data-header-tone="dark"
      className="dark-surface flex min-h-[72svh] scroll-mt-16 items-center overflow-hidden bg-night text-mist xl:scroll-mt-18"
    >
      <Container className="flex flex-col gap-16 py-24 sm:gap-24 sm:py-32">
        <ParallaxMedia percent={4}>
          <SectionHeading
            eyebrow={legacyContent.eyebrow}
            heading={legacyContent.heading}
            headingLines={["A Legacy Built", "Over Time."]}
            supportingLine={legacyContent.body || undefined}
            tone="dark"
            size="lg"
          />
        </ParallaxMedia>

        {hasStats && (
          <Reveal variant="stagger">
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 border-t border-line-dark pt-14 sm:grid-cols-3">
              {legacyStats.map((stat) => (
                <div key={stat.label} data-reveal-item="">
                  <Stat value={stat.value} label={stat.label} tone="dark" />
                </div>
              ))}
            </div>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
