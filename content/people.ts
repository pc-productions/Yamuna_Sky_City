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
 * PLACEHOLDER DATA — no contributor names/organizations have been supplied
 * yet. Replace each entry below with confirmed details before launch.
 * Do not publish invented names, credentials, or organizations.
 */
export const contributors: Contributor[] = [
  {
    name: "To be confirmed",
    role: "Developer / Promoter",
    organization: "To be confirmed",
    description:
      "Placeholder — confirmed developer details to be added before launch.",
  },
  {
    name: "To be confirmed",
    role: "Architect",
    organization: "To be confirmed",
    description:
      "Placeholder — confirmed architecture partner details to be added before launch.",
  },
  {
    name: "To be confirmed",
    role: "Structural Consultant",
    organization: "To be confirmed",
    description:
      "Placeholder — confirmed structural consultant details to be added before launch.",
  },
  {
    name: "To be confirmed",
    role: "Engineering Partner",
    organization: "To be confirmed",
    description:
      "Placeholder — confirmed engineering partner details to be added before launch.",
  },
];
