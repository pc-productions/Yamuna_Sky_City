export type NavLink = {
  label: string;
  href: string;
};

/**
 * Primary navigation. Hrefs are in-page anchors that match each section's
 * `id` (see components/sections/*). Reorder/add/remove here only.
 */
export const navLinks: NavLink[] = [
  { label: "Project", href: "#project" },
  { label: "Location", href: "#location" },
  { label: "3D Experience", href: "#explore-3d" },
  { label: "Legacy", href: "#legacy" },
  { label: "Contact", href: "#contact" },
];
