import { Reveal } from "@/components/ui/Reveal";
import { RevealLines } from "@/components/ui/RevealLines";

/**
 * Editorial section opener: eyebrow → headline → supporting line, each
 * arriving on its own beat (eyebrow settles, headline rises line by
 * line, copy follows). `headingLines` art-directs the line breaks;
 * otherwise the heading is one line. `size="lg"` is the oversized
 * statement used where a section is carried by typography alone.
 */
export function SectionHeading({
  eyebrow,
  heading,
  headingLines,
  supportingLine,
  align = "left",
  tone = "light",
  size = "md",
}: {
  eyebrow?: string;
  heading: string;
  headingLines?: string[];
  supportingLine?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  size?: "md" | "lg";
}) {
  const alignClass =
    align === "center" ? "items-center text-center mx-auto" : "items-start text-left";
  const eyebrowTone = tone === "dark" ? "text-mist-muted" : "text-brand";
  const headingTone = tone === "dark" ? "text-mist" : "text-ink";
  const supportingTone = tone === "dark" ? "text-mist-muted" : "text-ink-muted";
  const headingSize = size === "lg" ? "text-display-xl" : "text-display-lg";
  const width = size === "lg" ? "max-w-5xl" : "max-w-3xl";

  return (
    <div className={`flex ${width} flex-col ${alignClass}`}>
      {eyebrow && (
        <Reveal>
          <span className={`eyebrow mb-7 block ${eyebrowTone}`}>{eyebrow}</span>
        </Reveal>
      )}
      <RevealLines
        as="h2"
        lines={headingLines ?? [heading]}
        className={`${headingSize} ${headingTone}`}
        delayMs={eyebrow ? 80 : 0}
      />
      {supportingLine && (
        <Reveal delayMs={260}>
          <p className={`mt-7 max-w-xl text-lg leading-relaxed ${supportingTone}`}>
            {supportingLine}
          </p>
        </Reveal>
      )}
    </div>
  );
}
