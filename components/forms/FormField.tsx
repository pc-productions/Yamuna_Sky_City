import type { FormFieldConfig } from "@/content/form";

export function FormField({
  field,
  value,
  error,
  onChange,
  onBlur,
  tone = "light",
}: {
  field: FormFieldConfig;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  tone?: "light" | "dark";
}) {
  const inputId = `field-${field.id}`;
  const errorId = `${inputId}-error`;

  const baseInput =
    tone === "dark"
      ? "border-line-dark bg-transparent text-mist placeholder:text-mist-muted/60 focus:border-mist"
      : "border-line bg-transparent text-ink placeholder:text-ink-faint focus:border-brand";

  const labelTone = tone === "dark" ? "text-mist-muted" : "text-ink-muted";

  return (
    <div className="flex flex-col gap-2.5">
      <label
        htmlFor={inputId}
        className={`text-[0.6875rem] font-semibold uppercase tracking-[0.16em] ${labelTone}`}
      >
        {field.label}
        {field.required && <span aria-hidden="true"> *</span>}
      </label>
      <input
        id={inputId}
        name={field.id}
        type={field.type}
        autoComplete={field.autoComplete}
        required={field.required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`border-b py-2.5 text-base outline-none transition-colors ${baseInput}`}
      />
      {error && (
        <p id={errorId} role="alert" className="text-xs text-brand">
          {error}
        </p>
      )}
    </div>
  );
}
