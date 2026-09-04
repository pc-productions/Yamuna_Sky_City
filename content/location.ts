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
 * Highlight legend shown in the frosted panel over the artwork —
 * client-approved copy from the "Perfectly Connected" composition.
 */
export const locationHighlights: ReadonlyArray<{
  id: "seaside" | "connectivity" | "reach";
  label: string;
}> = [
  { id: "seaside", label: "Unmatched Seaside Living" },
  { id: "connectivity", label: "Seamless City Connectivity" },
  { id: "reach", label: "Everything Within Reach" },
] as const;

/**
 * PRESENTATION GEOMETRY for the desktop connectivity overlay.
 *
 * All coordinates are normalized to the aerial image via `viewBox`
 * (1000 wide; height follows the image's 1672×941 ratio). The SVG layer
 * and the HTML chips share this system, so everything stays attached to
 * the same spot on the photograph at every viewport width. The viewBox
 * height matches the image aspect, so <circle> elements render as true
 * circles on screen.
 *
 * nodes: chip centres, mirroring the approved artwork's arrangement.
 * rings: large circles centred on the tower.
 * Move a chip by editing x/y; its connection line follows.
 */
export const connectivityMap = {
  viewBox: { w: 1000, h: 563 },
  /** Ring centre — the tower's visual centre in the aerial image. */
  center: { x: 533, y: 252 },
  /** Circle ring radii, in viewBox units. */
  rings: [148, 188, 228],
  /** Connection lines end this far from the ring centre, keeping the
      tower itself clear of graphics. Bubble sizing lives with the rest
      of the presentation config in components/sections/location/config.ts. */
  lineEndRadius: 150,
  nodes: [
    { id: "beach", x: 379, y: 106 },
    { id: "nh66", x: 776, y: 108 },
    { id: "mall", x: 319, y: 248 },
    { id: "school", x: 834, y: 245 },
    { id: "hospital", x: 358, y: 405 },
    { id: "airport", x: 555, y: 452 },
    { id: "cityCentre", x: 755, y: 428 },
  ] as ReadonlyArray<{ id: ConnectivityId; x: number; y: number }>,
} as const;
