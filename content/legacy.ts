export type LegacyStat = {
  value: string;
  label: string;
};

/**
 * Yamuna's Legacy section content.
 *
 * NOT YET SUPPLIED — no verified legacy narrative, history, or figures
 * have been confirmed. While `body` is empty and `legacyStats` has no
 * entries, the section renders as a minimal dark editorial statement
 * (eyebrow + heading only) — no invented years/project-counts/square-
 * footage, no placeholder dashes. Populate with verified content only;
 * the full presentation appears automatically.
 */
export const legacyContent = {
  eyebrow: "Yamuna's Legacy",
  heading: "A Legacy Built Over Time.",
  body: "",
} as const;

export const legacyStats: LegacyStat[] = [
  // e.g. { value: "…", label: "Years of Experience" } — verified figures only.
];
