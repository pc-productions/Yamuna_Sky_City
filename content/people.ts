export type Contributor = {
  name: string;
  role: string;
  organization: string;
  description: string;
  /** Path under /public/media/people, or undefined to show a monogram. */
  image?: string;
};

/**
 * People and organizations behind the project.
 *
 * NOT YET SUPPLIED — no contributor names or organizations have been
 * confirmed for this project. The array is intentionally empty: the
 * PeopleBehind section renders nothing while it is empty, so no invented
 * or "to be confirmed" rows ever reach visitors. Populate with verified
 * entries only; the section appears automatically once data exists.
 *
 * Example shape:
 * { name: "…", role: "Architect", organization: "…", description: "…" }
 */
export const contributors: Contributor[] = [];
