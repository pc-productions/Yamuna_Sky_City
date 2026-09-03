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

export type ConnectivityId =
  | "beach"
  | "nh66"
  | "school"
  | "hospital"
  | "mall"
  | "cityCentre"
  | "airport";

/**
 * Landmark travel times from the approved artwork — the verified source
 * of truth. Drives both the desktop connectivity overlay and the mobile
 * list. Do not change labels or minutes without client approval.
 */
export const connectivity: ReadonlyArray<{
  id: ConnectivityId;
  label: string;
  minutes: number;
}> = [
  { id: "beach", label: "Beach", minutes: 2 },
  { id: "nh66", label: "National Highway 66", minutes: 5 },
  { id: "school", label: "International School", minutes: 6 },
  { id: "hospital", label: "A. J. Hospital", minutes: 7 },
  { id: "mall", label: "City Mall", minutes: 8 },
  { id: "cityCentre", label: "City Centre", minutes: 15 },
  { id: "airport", label: "Mangalore International Airport", minutes: 20 },
] as const;

/**
 * PRESENTATION GEOMETRY for the desktop connectivity overlay.
 *
 * All coordinates are normalized to the aerial image via `viewBox`
 * (1000 wide; height follows the image's 1672×941 ratio). The SVG layer
 * and the HTML markers share this system, so everything stays attached
 * to the same spot on the photograph at every viewport width.
 *
 * To move a marker, change its x/y here. To drop one from the overlay,
 * remove its node (the travel-time list still shows every entry). The
 * node order below is the reveal-animation order.
 */
export const connectivityMap = {
  viewBox: { w: 1000, h: 563 },
  /** Ring centre — the tower's visual centre in the aerial image. */
  center: { x: 530, y: 250 },
  /** Concentric ring radii, in viewBox units. */
  rings: [130, 215, 300],
  /** labelSide: where the glass tag floats relative to its anchor dot. */
  nodes: [
    { id: "beach", x: 380, y: 96, labelSide: "bottom" },
    { id: "nh66", x: 778, y: 100, labelSide: "bottom" },
    { id: "school", x: 835, y: 262, labelSide: "bottom" },
    { id: "hospital", x: 360, y: 420, labelSide: "top" },
    { id: "mall", x: 340, y: 306, labelSide: "bottom" },
    { id: "airport", x: 556, y: 474, labelSide: "top" },
    { id: "cityCentre", x: 756, y: 438, labelSide: "top" },
  ] as ReadonlyArray<{
    id: ConnectivityId;
    x: number;
    y: number;
    labelSide: "top" | "bottom";
  }>,
} as const;
