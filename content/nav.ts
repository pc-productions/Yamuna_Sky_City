import { sectionVisibility } from "@/content/site";

export type NavLink = {
  label: string;
  href: string;
  /** Section switch this link depends on (content/site.ts). */
  requires?: keyof typeof sectionVisibility;
};

/**
 * Primary navigation. Hrefs are in-page anchors that match each section's
 * `id` (see components/sections/*). Reorder/add/remove here only. Links
 * that target a section hidden via `sectionVisibility` are dropped
 * automatically so the nav never points at something that isn't there.
 */
const allNavLinks: NavLink[] = [
  { label: "Project", href: "/#project" },
  { label: "Location", href: "/#location" },
  { label: "3D Experience", href: "/#explore-3d" },
  { label: "Legacy", href: "/#legacy", requires: "legacy" },
  { label: "Contact", href: "/#contact" },
];

export const navLinks: NavLink[] = allNavLinks.filter(
  (link) => !link.requires || sectionVisibility[link.requires],
);
