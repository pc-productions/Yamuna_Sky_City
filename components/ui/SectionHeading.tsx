export function SectionHeading({
  eyebrow,
  heading,
  supportingLine,
  align = "left",
  tone = "light",
}: {
  eyebrow?: string;
  heading: string;
  supportingLine?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
}) {
  const alignClass = align === "center" ? "items-center text-center mx-auto" : "items-start text-left";
  const eyebrowTone = tone === "dark" ? "text-mist-muted" : "text-brand";
  const headingTone = tone === "dark" ? "text-mist" : "text-ink";
  const supportingTone = tone === "dark" ? "text-mist-muted" : "text-ink-muted";

  return (
    <div className={`flex max-w-2xl flex-col gap-4 ${alignClass}`}>
      {eyebrow && (
        <span
          className={`text-xs font-semibold uppercase tracking-[0.2em] ${eyebrowTone}`}
        >
          {eyebrow}
        </span>
      )}
      <h2 className={`text-4xl font-medium leading-[1.1] sm:text-5xl ${headingTone}`}>
        {heading}
      </h2>
      {supportingLine && (
        <p className={`text-lg leading-relaxed ${supportingTone}`}>{supportingLine}</p>
      )}
    </div>
  );
}
