import { journalCopy } from "@/lib/blog/seo";
import { Reveal } from "@/components/ui/Reveal";
import { RevealLines } from "@/components/ui/RevealLines";

/**
 * Journal front opener — typography only, no photograph above the
 * fold: eyebrow, the two-line statement, one supporting sentence.
 * Category pages reuse it with their own lines.
 */
export function JournalHero({
  eyebrow = journalCopy.eyebrow,
  lines = [...journalCopy.headlineLines],
  supportingLine = journalCopy.supportingLine,
}: {
  eyebrow?: string;
  lines?: string[];
  supportingLine?: string;
}) {
  return (
    <div className="max-w-4xl">
      <Reveal>
        <span className="eyebrow block text-brand">{eyebrow}</span>
      </Reveal>
      {/* A trailing space on every line but the last keeps the H1's text
          content readable as one sentence for crawlers and screen
          readers; the spans are blocks, so nothing shows. */}
      <RevealLines
        as="h1"
        lines={lines.map((line, i) => (i < lines.length - 1 ? `${line} ` : line))}
        delayMs={80}
        className="mt-7 text-display-lg text-ink"
      />
      <Reveal delayMs={300}>
        <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-muted">{supportingLine}</p>
      </Reveal>
    </div>
  );
}
