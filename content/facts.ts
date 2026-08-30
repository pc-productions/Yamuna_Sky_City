export type ProjectFact = {
  value: string;
  label: string;
};

export const projectIntro = {
  eyebrow: "Yamuna Sky City",
  supportingLine:
    "A landmark residence rising from the Yamuna riverfront — engineered at scale, designed for a life above the city.",
} as const;

/**
 * Hard facts only. Sourced from project specifications — update here,
 * not in the component. Do not add unverified figures.
 */
export const projectFacts: ProjectFact[] = [
  { value: "60", label: "Levels" },
  { value: "296", label: "Residences" },
  { value: "2, 3, 4 & 5", label: "BHK Configurations" },
  { value: "898,965", label: "Sq. Ft. Saleable Area" },
  { value: "459", label: "Parking Spaces" },
];
