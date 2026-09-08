import type { MetadataRoute } from "next";
import { categoryHref } from "@/content/blog/categories";
import { seo } from "@/content/site";
import { getActiveCategories, getPublishedArticles } from "@/lib/blog/articles";
import { articlePath, journalPath } from "@/lib/blog/seo";

/**
 * Static pages plus every PUBLISHED Journal article and category — read
 * from the Markdown source at build time, so a new article appears here
 * the moment it is published (drafts and future-dated articles never
 * do). Nothing is maintained by hand.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getPublishedArticles();
  const newestArticle = articles[0]?.updatedAt;

  return [
    { url: seo.siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    {
      url: `${seo.siteUrl}${journalPath}`,
      lastModified: newestArticle ? new Date(newestArticle) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...getActiveCategories().map((c) => {
      const latest = articles.find((a) => a.category === c.slug)?.updatedAt;
      return {
        url: `${seo.siteUrl}${categoryHref(c.slug)}`,
        lastModified: latest ? new Date(latest) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.5,
      };
    }),
    ...articles.map((a) => ({
      url: `${seo.siteUrl}${articlePath(a.slug)}`,
      lastModified: new Date(a.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: `${seo.siteUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${seo.siteUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];
}
