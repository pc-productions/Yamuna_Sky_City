export function Stat({
  value,
  label,
  tone = "light",
}: {
  value: string;
  label: string;
  tone?: "light" | "dark";
}) {
  const valueTone = tone === "dark" ? "text-mist" : "text-ink";
  const labelTone = tone === "dark" ? "text-mist-muted" : "text-ink-muted";

  return (
    <div className="flex flex-col gap-2">
      <span
        className={`font-display text-5xl font-medium leading-none sm:text-6xl ${valueTone}`}
      >
        {value}
      </span>
      <span
        className={`text-xs font-semibold uppercase tracking-[0.15em] ${labelTone}`}
      >
        {label}
      </span>
    </div>
  );
}
