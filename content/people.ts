export type Contributor = {
  name: string;
  role: string;
  organization: string;
  description: string;
  /** Path under /public/media/people, or undefined to show a monogram. */
  image?: string;
};

/** Section framing — neutral copy only; no names, claims, or history. */
export const peopleSection = {
  eyebrow: "The People Behind the Project",
  heading: "Designed and engineered by specialists.",
} as const;

/**
 * People and organizations behind the project.
 *
 * NOT YET SUPPLIED — no contributor names or organizations have been
 * confirmed for this project. While this array is empty the section
 * renders as a minimal editorial statement (framing above) with no rows,
 * so nothing invented or unfinished-looking reaches visitors. Populate
 * with verified entries only; the full presentation appears automatically.
 *
 * Example shape:
 * { name: "…", role: "Architect", organization: "…", description: "…" }
 */
export const contributors: Contributor[] = [];
