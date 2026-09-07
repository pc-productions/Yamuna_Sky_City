import type { ElementType, ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Editorial line reveal. Renders each line inside a clipped wrapper so
 * the words rise into place (Reveal variant "lines"). Pass the lines
 * explicitly — headline line breaks are art-directed, never automatic.
 * The heading element is real semantic markup (h1/h2/p), and the text
 * is fully present for crawlers and reduced-motion visitors.
 */
export function RevealLines({
  as: Tag = "h2",
  lines,
  className = "",
  lineClassName = "",
  delayMs = 0,
  id,
}: {
  as?: ElementType;
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delayMs?: number;
  id?: string;
}) {
  return (
    <Reveal variant="lines" delayMs={delayMs}>
      <Tag id={id} className={className}>
        {lines.map((line, i) => (
          // A hair of extra bottom room keeps descenders inside the clip.
          <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
            <span data-line="" className={`block ${lineClassName}`}>
              {line}
            </span>
          </span>
        ))}
      </Tag>
    </Reveal>
  );
}
