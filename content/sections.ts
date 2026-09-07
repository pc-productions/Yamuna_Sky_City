/**
 * Section-level UI copy that is not project data: framing lines for the
 * conversion checkpoint, the 3D invitation and the contact conclusion.
 * Editorial phrasing only — no claims, figures or locations.
 */
export const privateViewingSection = {
  eyebrow: "Private Viewing",
  headlineLines: ["The view is only", "the beginning."],
  supportingLine: "Experience Yamuna Sky City in person.",
} as const;

export const explore3dSection = {
  eyebrow: "3D Experience",
  heading: "See Where Yamuna Sky City Rises.",
  supportingLine:
    "Explore the project and its surroundings through an immersive 3D location experience.",
  invitation: "Enter the experience",
  externalNote: "Opens in a new tab",
} as const;

export const contactSection = {
  eyebrow: "Private Viewing",
  /** Bridge line above the heading — the journey's conclusion. */
  lead: "You have seen the tower, the sea and the city around it.",
} as const;
