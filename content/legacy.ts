export type LegacyStat = {
  value: string;
  label: string;
};

/**
 * Yamuna's Legacy section content.
 *
 * NOT YET SUPPLIED — no verified legacy narrative, history, or figures
 * have been confirmed. `body` is empty and `legacyStats` is an empty
 * array; the Legacy section renders nothing while both are empty, so no
 * invented years/project-counts/square-footage ever reach visitors.
 * Populate with verified content only; the section appears automatically
 * once data exists.
 */
export const legacyContent = {
  eyebrow: "Yamuna's Legacy",
  heading: "A Legacy Built Over Time.",
  body: "",
} as const;

export const legacyStats: LegacyStat[] = [
  // e.g. { value: "…", label: "Years of Experience" } — verified figures only.
];

/** True once any real legacy content exists — drives section visibility. */
export function hasLegacyContent(): boolean {
  return legacyContent.body.length > 0 || legacyStats.length > 0;
}
