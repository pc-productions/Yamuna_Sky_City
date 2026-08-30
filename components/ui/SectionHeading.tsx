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
  const alignClass =
    align === "center" ? "items-center text-center mx-auto" : "items-start text-left";
  const eyebrowTone = tone === "dark" ? "text-mist-muted" : "text-brand";
  const headingTone = tone === "dark" ? "text-mist" : "text-ink";
  const supportingTone = tone === "dark" ? "text-mist-muted" : "text-ink-muted";

  return (
    <div className={`flex max-w-3xl flex-col ${alignClass}`}>
      {eyebrow && <span className={`eyebrow mb-6 ${eyebrowTone}`}>{eyebrow}</span>}
      <h2 className={`text-display-lg ${headingTone}`}>{heading}</h2>
      {supportingLine && (
        <p className={`mt-6 max-w-xl text-lg leading-relaxed ${supportingTone}`}>
          {supportingLine}
        </p>
      )}
    </div>
  );
}
