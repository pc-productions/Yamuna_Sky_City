import { legal, seo } from "@/content/site";

/**
 * Journal authors. Articles reference an author by `id`. Only the
 * organisation exists today (no named writers have been supplied — do
 * NOT invent people); add a person here when the business provides a
 * real name, and articles can switch to it one by one.
 */
export type AuthorId = "yamuna-homes";

export type Author = {
  id: AuthorId;
  name: string;
  /** schema.org type for JSON-LD. */
  type: "Organization" | "Person";
  url?: string;
};

export const authors: Record<AuthorId, Author> = {
  "yamuna-homes": {
    id: "yamuna-homes",
    name: legal.entityName,
    type: "Organization",
    url: seo.siteUrl,
  },
};

export const defaultAuthorId: AuthorId = "yamuna-homes";
