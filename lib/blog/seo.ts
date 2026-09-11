import type { Metadata } from "next";
import { authors } from "@/content/blog/authors";
import { getCategory, categoryHref, type Category } from "@/content/blog/categories";
import { brand, seo } from "@/content/site";
import type { Article, ArticleSummary } from "@/lib/blog/types";

/**
 * Journal SEO — metadata and JSON-LD built from the article model, so
 * every article gets a unique <title>, description, self-canonical URL,
 * Open Graph and Twitter card without per-page boilerplate.
 *
 * URL rules: canonical = `${seo.siteUrl}/blog/<slug>` exactly (no query
 * string, no trailing slash). Tracking parameters on the way in never
 * change the canonical. The root layout's `metadataBase` resolves the
 * relative paths below to absolute URLs.
 *
 * Per-article social images come from app/blog/[slug]/opengraph-image.tsx
 * (featured photograph + title + brand mark); Next attaches them to
 * openGraph.images / twitter.images automatically.
 */

export const journalCopy = {
  eyebrow: "Yamuna Journal",
  headlineLines: ["Ideas, Insights &", "Coastal Living."],
  supportingLine: "Explore perspectives on life, property and the evolving landscape of Mangalore.",
  /** <title> / description for /blog. */
  seoTitle: "Journal — Mangalore Real Estate, Coastal Living & Project News",
  seoDescription:
    "News from Yamuna Sky City and perspectives on Mangalore real estate, sea-facing living, neighbourhoods and property investment from Yamuna Homes and Design, Kulai, New Mangalore.",
  breadcrumbHome: "Home",
  breadcrumbJournal: "Journal",
} as const;

export const journalPath = "/blog";

export function articlePath(slug: string): string {
  return `${journalPath}/${slug}`;
}

export function absoluteUrl(pathname: string): string {
  return `${seo.siteUrl}${pathname}`;
}

/**
 * The site's brand social image (app/opengraph-image.tsx). Next only
 * attaches file-based images to the segment that declares them, so
 * listing pages reference the root image explicitly; articles get
 * their own from app/blog/[slug]/opengraph-image.tsx.
 */
const brandSocialImage = { url: "/opengraph-image", width: 1200, height: 630, alt: brand.name };

export function buildJournalMetadata(): Metadata {
  return {
    title: journalCopy.seoTitle,
    description: journalCopy.seoDescription,
    alternates: { canonical: journalPath },
    openGraph: {
      type: "website",
      title: `${journalCopy.seoTitle} | ${brand.name}`,
      description: journalCopy.seoDescription,
      url: journalPath,
      images: [brandSocialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${journalCopy.seoTitle} | ${brand.name}`,
      description: journalCopy.seoDescription,
      images: [brandSocialImage.url],
    },
  };
}

export function buildCategoryMetadata(category: Category): Metadata {
  const title = `${category.label} — Journal`;
  return {
    title,
    description: category.description,
    alternates: { canonical: categoryHref(category.slug) },
    openGraph: {
      type: "website",
      title: `${title} | ${brand.name}`,
      description: category.description,
      url: categoryHref(category.slug),
      images: [brandSocialImage],
    },
    twitter: { card: "summary_large_image", title: `${title} | ${brand.name}`, description: category.description, images: [brandSocialImage.url] },
  };
}

export function buildArticleMetadata(article: Article): Metadata {
  const title = article.seoTitle ?? article.title;
  const description = article.seoDescription ?? article.excerpt;
  const url = articlePath(article.slug);
  const author = authors[article.author];
  return {
    title,
    description,
    alternates: { canonical: url },
    authors: [{ name: author.name, ...(author.url ? { url: author.url } : {}) }],
    openGraph: {
      type: "article",
      title: `${title} | ${brand.name}`,
      description,
      url,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [author.name],
      section: getCategory(article.category)?.label,
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${brand.name}`,
      description,
    },
  };
}

/* ---------------------------------------------------------------- JSON-LD */

function breadcrumbList(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function articleBreadcrumbs(article: Pick<Article, "title" | "slug" | "category">) {
  const category = getCategory(article.category);
  return [
    { name: journalCopy.breadcrumbHome, path: "/" },
    { name: journalCopy.breadcrumbJournal, path: journalPath },
    ...(category ? [{ name: category.label, path: categoryHref(category.slug) }] : []),
    { name: article.title, path: articlePath(article.slug) },
  ];
}

export function buildArticleStructuredData(article: Article) {
  const author = authors[article.author];
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${absoluteUrl(articlePath(article.slug))}#article`,
        mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(articlePath(article.slug)) },
        headline: article.title,
        description: article.seoDescription ?? article.excerpt,
        image: [absoluteUrl(article.featuredImage)],
        datePublished: article.publishedAt,
        dateModified: article.updatedAt,
        author: { "@type": author.type, name: author.name, ...(author.url ? { url: author.url } : {}) },
        publisher: { "@id": `${seo.siteUrl}/#organization` },
        articleSection: getCategory(article.category)?.label,
        keywords: article.tags?.join(", "),
        wordCount: article.wordCount,
        inLanguage: "en",
      },
      breadcrumbList(articleBreadcrumbs(article)),
    ],
  };
}

export function buildJournalStructuredData(articles: ArticleSummary[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": absoluteUrl(journalPath),
        name: `${brand.name} Journal`,
        description: journalCopy.seoDescription,
        url: absoluteUrl(journalPath),
        isPartOf: { "@id": `${seo.siteUrl}/#website` },
        hasPart: articles.slice(0, 20).map((a) => ({
          "@type": "Article",
          headline: a.title,
          url: absoluteUrl(articlePath(a.slug)),
          datePublished: a.publishedAt,
        })),
      },
      breadcrumbList([
        { name: journalCopy.breadcrumbHome, path: "/" },
        { name: journalCopy.breadcrumbJournal, path: journalPath },
      ]),
    ],
  };
}

export function buildCategoryStructuredData(category: Category) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbList([
        { name: journalCopy.breadcrumbHome, path: "/" },
        { name: journalCopy.breadcrumbJournal, path: journalPath },
        { name: category.label, path: categoryHref(category.slug) },
      ]),
    ],
  };
}

/* ---------------------------------------------------------------- dates */

export function formatDateShort(iso: string): string {
  // "08 Sep 2026" — cards and meta lines
  const d = new Date(iso);
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = d.toLocaleString("en-GB", { month: "short", timeZone: "UTC" });
  return `${day} ${month} ${d.getUTCFullYear()}`;
}

export function formatDateLong(iso: string): string {
  // "8 September 2026" — article header
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}
