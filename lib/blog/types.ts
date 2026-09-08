import type { AuthorId } from "@/content/blog/authors";
import type { CategorySlug } from "@/content/blog/categories";

/**
 * Article frontmatter as written in content/blog/articles/*.md.
 * Everything a search engine or a card needs lives here; the Markdown
 * body below the frontmatter is the article itself.
 */
export type ArticleFrontmatter = {
  title: string;
  excerpt: string;
  category: CategorySlug;
  /** Defaults to content/blog/authors.ts → defaultAuthorId. */
  author?: AuthorId;
  /** ISO date, e.g. "2026-09-08". Articles dated in the future stay unpublished. */
  publishedAt: string;
  /** ISO date; defaults to publishedAt. */
  updatedAt?: string;
  /** Path under /public, e.g. "/media/location/tower-aerial.jpg". */
  featuredImage: string;
  featuredImageAlt: string;
  /** Optional caption shown under the featured image. */
  featuredImageCaption?: string;
  tags?: string[];
  /** <title> — defaults to the article title. */
  seoTitle?: string;
  /** Meta description — defaults to the excerpt. */
  seoDescription?: string;
  /** Pinned to the top of the Journal; otherwise the newest article is featured. */
  featured?: boolean;
  /** true → not listed, not in the sitemap, 404 in production. */
  draft?: boolean;
};

export type Article = ArticleFrontmatter & {
  slug: string;
  author: AuthorId;
  updatedAt: string;
  /** Minutes, rounded up, from the body's word count. */
  readingTime: number;
  /** Rendered HTML of the Markdown body. */
  html: string;
  /** Plain-text word count (for reading time and audits). */
  wordCount: number;
};

export type ArticleSummary = Omit<Article, "html">;
