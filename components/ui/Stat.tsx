export function Stat({
  value,
  label,
  tone = "light",
  size = "md",
}: {
  value: string;
  label: string;
  tone?: "light" | "dark";
  size?: "md" | "lg";
}) {
  const valueTone = tone === "dark" ? "text-mist" : "text-ink";
  const labelTone = tone === "dark" ? "text-mist-muted" : "text-ink-faint";
  const sizeClass = size === "lg" ? "text-stat-lg" : "text-stat-md";

  return (
    <div className="flex flex-col gap-3">
      <span className={`font-display ${sizeClass} ${valueTone}`}>{value}</span>
      <span className={`eyebrow ${labelTone}`}>{label}</span>
    </div>
  );
}
