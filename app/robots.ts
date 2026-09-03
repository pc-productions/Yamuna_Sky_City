import type { MetadataRoute } from "next";
import { isSiteUrlConfigured, seo } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  // Until the confirmed production domain is configured via
  // NEXT_PUBLIC_SITE_URL, refuse indexing entirely — a deploy with
  // placeholder canonical/sitemap URLs must never enter search indexes.
  if (!isSiteUrlConfigured) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${seo.siteUrl}/sitemap.xml`,
  };
}
