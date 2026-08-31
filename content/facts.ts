export type ProjectFact = {
  value: string;
  label: string;
};

export const projectIntro = {
  eyebrow: "PROJECT OVERVIEW",
  headingMain: "South India's Tallest",
  headingItalic: "Sea View",
  headingSuffix: "Tower",
  descriptionLeft:
    "A landmark residential development on the NH-66 corridor of New Mangalore — combining scale, architectural precision, and uninterrupted sea views into a single iconic address. Yamuna Sky City is not just a building. It is a new definition of coastal luxury.",
  descriptionRight:
    "Developed by Yamuna Homes and Design Pvt. Ltd. — a trusted name in Karnataka real estate for over 30 years. GF+60 floors. 296 all-sea-facing units. One tower. No compromises.",
} as const;

export const projectFacts: ProjectFact[] = [
  { value: "296", label: "LUXURY APARTMENTS" },
  { value: "GF+60", label: "FLOORS ABOVE GROUND" },
  { value: "3+", label: "ACRES OF GREENERY" },
  { value: "300m", label: "FROM THE ARABIAN SEA" },
];
