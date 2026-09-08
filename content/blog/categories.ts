/**
 * Journal categories — the ONLY place category names live. Components
 * and articles refer to categories by `slug`; the label, description
 * and URL come from here. Add a category by adding a line.
 *
 * Each category is one topical cluster (see docs/JOURNAL.md): articles
 * inside it should deepen the same subject rather than repeat it.
 */
export type CategorySlug =
  | "mangalore-real-estate"
  | "property-investment"
  | "lifestyle"
  | "buying-guides"
  | "nri-property"
  | "yamuna-sky-city";

export type Category = {
  slug: CategorySlug;
  label: string;
  /** One line under the category name on its archive page (also its meta description). */
  description: string;
};

export const categories: readonly Category[] = [
  {
    slug: "mangalore-real-estate",
    label: "Mangalore Real Estate",
    description: "Perspectives on the evolving property landscape of Mangalore and its coastal neighbourhoods.",
  },
  {
    slug: "property-investment",
    label: "Property Investment",
    description: "Considered thinking on what makes a home a sound long-term holding.",
  },
  {
    slug: "lifestyle",
    label: "Lifestyle",
    description: "Coastal living, sea views and the quieter rhythms of life by the Arabian Sea.",
  },
  {
    slug: "buying-guides",
    label: "Buying Guides",
    description: "Practical, unhurried guidance for choosing and buying a luxury apartment.",
  },
  {
    slug: "nri-property",
    label: "NRI Property",
    description: "Guidance for non-resident Indians buying a home in Mangalore.",
  },
  {
    slug: "yamuna-sky-city",
    label: "Yamuna Sky City",
    description: "Notes from the project itself: the tower, the site and the thinking behind them.",
  },
] as const;

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function categoryHref(slug: CategorySlug): string {
  return `/blog/category/${slug}`;
}
