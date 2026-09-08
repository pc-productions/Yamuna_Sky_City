import { cache } from "react";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { authors, defaultAuthorId } from "@/content/blog/authors";
import { categories, type CategorySlug } from "@/content/blog/categories";
import { countWords, renderMarkdown } from "@/lib/blog/markdown";
import type { Article, ArticleFrontmatter, ArticleSummary } from "@/lib/blog/types";

/**
 * Journal content source — file-based, read at build time.
 *
 *   content/blog/articles/<slug>.md   (frontmatter + Markdown body)
 *
 * The file name IS the URL slug (/blog/<slug>), so URLs are lowercase
 * kebab-case by construction. Everything here runs on the server only
 * (node:fs); pages are statically generated, so visitors download HTML,
 * not a Markdown parser.
 *
 * Publishing rules (no database, no admin):
 *  - `draft: true`                → unpublished
 *  - `publishedAt` in the future  → unpublished (schedule by date)
 * Unpublished articles are absent from every listing, the sitemap and
 * the static build; in development they still render so they can be
 * previewed at their URL.
 *
 * Migrating to a headless CMS later = replacing `readAll()` with an API
 * call that returns the same Article shape. Nothing else changes.
 */

const ARTICLES_DIR = path.join(process.cwd(), "content", "blog", "articles");
const WORDS_PER_MINUTE = 220;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isPublished(a: Pick<Article, "draft" | "publishedAt">): boolean {
  if (a.draft) return false;
  return new Date(a.publishedAt).getTime() <= Date.now();
}

function validate(slug: string, fm: Partial<ArticleFrontmatter>): asserts fm is ArticleFrontmatter {
  const missing = (["title", "excerpt", "category", "publishedAt", "featuredImage", "featuredImageAlt"] as const).filter(
    (k) => !fm[k],
  );
  if (missing.length) throw new Error(`[journal] ${slug}.md is missing frontmatter: ${missing.join(", ")}`);
  if (!SLUG_PATTERN.test(slug)) throw new Error(`[journal] "${slug}" is not a lowercase kebab-case slug`);
  if (!categories.some((c) => c.slug === fm.category)) {
    throw new Error(`[journal] ${slug}.md: unknown category "${fm.category}" (see content/blog/categories.ts)`);
  }
  if (fm.author && !(fm.author in authors)) {
    throw new Error(`[journal] ${slug}.md: unknown author "${fm.author}" (see content/blog/authors.ts)`);
  }
  if (Number.isNaN(new Date(fm.publishedAt!).getTime())) {
    throw new Error(`[journal] ${slug}.md: publishedAt must be an ISO date`);
  }
}

const readAll = cache((): Article[] => {
  const files = readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".md"));
  const articles = files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const raw = readFileSync(path.join(ARTICLES_DIR, file), "utf8");
    const { data, content } = matter(raw);
    const fm = data as Partial<ArticleFrontmatter>;
    validate(slug, fm);
    const wordCount = countWords(content);
    const toIso = (d: unknown) => (d instanceof Date ? d.toISOString().slice(0, 10) : String(d));
    return {
      ...fm,
      slug,
      publishedAt: toIso(fm.publishedAt),
      updatedAt: toIso(fm.updatedAt ?? fm.publishedAt),
      author: fm.author ?? defaultAuthorId,
      tags: fm.tags ?? [],
      wordCount,
      readingTime: Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE)),
      html: renderMarkdown(content),
    } satisfies Article;
  });
  // Newest first; ties broken by title for a stable order.
  return articles.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime() || a.title.localeCompare(b.title),
  );
});

const summarize = (article: Article): ArticleSummary => {
  const { html, ...rest } = article;
  void html;
  return rest;
};

/** Published articles, newest first (listing, sitemap, static params). */
export const getPublishedArticles = cache((): ArticleSummary[] => readAll().filter(isPublished).map(summarize));

export const getArticlesByCategory = cache((category: CategorySlug): ArticleSummary[] =>
  getPublishedArticles().filter((a) => a.category === category),
);

/**
 * One article by slug. Unpublished articles resolve only outside
 * production (local preview); the page turns `undefined` into a 404.
 */
export const getArticle = cache((slug: string): Article | undefined => {
  const article = readAll().find((a) => a.slug === slug);
  if (!article) return undefined;
  if (!isPublished(article) && process.env.NODE_ENV === "production") return undefined;
  return article;
});

/** The pinned article if any, else the newest. */
export function getFeaturedArticle(list: ArticleSummary[]): ArticleSummary | undefined {
  return list.find((a) => a.featured) ?? list[0];
}

/**
 * Related articles: same category first, then shared tags, then newest —
 * never the article itself.
 */
export function getRelatedArticles(article: Pick<Article, "slug" | "category" | "tags">, limit = 3): ArticleSummary[] {
  const tags = new Set(article.tags ?? []);
  return getPublishedArticles()
    .filter((a) => a.slug !== article.slug)
    .map((a) => ({
      a,
      score: (a.category === article.category ? 2 : 0) + (a.tags ?? []).filter((t) => tags.has(t)).length,
    }))
    .sort((x, y) => y.score - x.score)
    .slice(0, limit)
    .map(({ a }) => a);
}

/** Published categories in configured order (only those with at least one article). */
export function getActiveCategories() {
  const published = getPublishedArticles();
  return categories.filter((c) => published.some((a) => a.category === c.slug));
}
