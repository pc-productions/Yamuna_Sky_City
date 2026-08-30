/**
 * Location section content.
 *
 * Copy and connectivity data below are taken from the client-supplied
 * "Perfectly Connected" location artwork — do not add landmarks or
 * distances that are not in that approved asset.
 */
export const locationContent = {
  eyebrow: "Location",
  heading: "Perfectly Connected.",
  supportingLine:
    "Yamuna Sky City places you right where life happens. Be it the beach, the city, the highway or the best schools — everything is just minutes away.",
} as const;

/**
 * Landmark travel times from the approved artwork (which renders them
 * itself on larger screens); this is the verified source of truth and
 * drives the mobile-only list where the artwork's labels are too small.
 */
export const connectivity = [
  { label: "Beach", minutes: 2 },
  { label: "National Highway 66", minutes: 5 },
  { label: "International School", minutes: 6 },
  { label: "A. J. Hospital", minutes: 7 },
  { label: "City Mall", minutes: 8 },
  { label: "City Centre", minutes: 15 },
  { label: "Mangalore International Airport", minutes: 20 },
] as const;
