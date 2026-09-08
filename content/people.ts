export type Contributor = {
  /** Discipline / responsibility on the project. */
  role: string;
  /** Firm name exactly as printed in the brochure. */
  name: string;
  /** City / country as printed in the brochure. */
  location: string;
};

/** Section framing — neutral copy only; no claims or history. */
export const peopleSection = {
  eyebrow: "The People Behind the Project",
  heading: "Designed and engineered by specialists.",
  headingLines: ["Designed and engineered", "by specialists."],
  supportingLine:
    "The consultants and contractors delivering Yamuna Sky City, as published in the project brochure.",
} as const;

/**
 * Project team — VERIFIED from the official Yamuna Sky City brochure
 * (final edition, "Highlights" page). Names, roles and locations are
 * reproduced exactly; nothing is added or inferred. Update only from an
 * approved source.
 */
export const contributors: Contributor[] = [
  { role: "Architect", name: "Archi Technics", location: "Mangalore" },
  { role: "Structural Consultant", name: "Shanghvi & Associates Consultants Private Limited", location: "Mumbai" },
  { role: "Wind Engineering Consultants", name: "CPP Wind Engineering Consultants", location: "Australia" },
  { role: "Geotechnical Consultants", name: "Geocon International Pvt. Ltd.", location: "Mumbai" },
  { role: "MEP Consultant", name: "Prashanti MEP Consultants", location: "Mumbai" },
  { role: "PMC", name: "SS Engineers & Consultants", location: "Mangalore" },
  { role: "Landscape Architect", name: "Studio Naadi", location: "Bangalore" },
  { role: "Test Pile Load Test Agency", name: "Rudra Infra", location: "Mumbai" },
  { role: "Piling Works", name: "Chaudhary Constructions", location: "Mangalore" },
  { role: "Pile Testing Agency (Pile Integrity and Dynamic Load)", name: "Geo Dynamics", location: "Vadodara" },
  { role: "Main Civil Works", name: "MFAR Constructions Pvt. Ltd.", location: "" },
  { role: "Aluminium Formwork", name: "MFE Formwork (Mivan)", location: "Malaysia" },
];
