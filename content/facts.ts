export type ProjectFact = {
  value: string;
  label: string;
};

export const projectIntro = {
  eyebrow: "The Project",
  // Left empty until approved editorial copy is supplied — the section
  // renders without a supporting line while this is "".
  // Do not add location or positioning claims here without confirmation.
  supportingLine: "",
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
