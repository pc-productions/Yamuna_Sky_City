export type LegacyStat = {
  value: string;
  label: string;
};

export const legacyContent = {
  eyebrow: "Yamuna's Legacy",
  heading: "A Legacy Built Over Time.",
  // PLACEHOLDER — replace with verified narrative copy before launch.
  body: "Placeholder narrative — confirmed legacy, history and milestone copy to be supplied before launch.",
} as const;

/**
 * PLACEHOLDER DATA — no verified legacy figures have been supplied yet.
 * Do not invent years-of-experience, project counts, or scale claims.
 * Replace with confirmed figures before launch.
 */
export const legacyStats: LegacyStat[] = [
  { value: "—", label: "Years of Experience" },
  { value: "—", label: "Projects Delivered" },
  { value: "—", label: "Sq. Ft. Developed" },
];
