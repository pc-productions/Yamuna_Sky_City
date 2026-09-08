"use client";

import { useEffect } from "react";
import { trackJournal } from "@/lib/blog/analytics";

/**
 * Article-page analytics, in one tiny client island:
 *  - `blog_article_view` once per page view;
 *  - delegated click reporting for links inside the article body that
 *    the Markdown renderer marked `data-track="project"` (links into
 *    the main site) — no per-link client components needed.
 */
export function ArticleTracking({ slug, category, bodyId }: { slug: string; category: string; bodyId: string }) {
  useEffect(() => {
    trackJournal({ event: "blog_article_view", slug, category });
  }, [slug, category]);

  useEffect(() => {
    const body = document.getElementById(bodyId);
    if (!body) return;
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[data-track='project']");
      if (!link) return;
      trackJournal({ event: "blog_project_click", slug, href: link.getAttribute("href") ?? "", placement: "article-body" });
    };
    body.addEventListener("click", onClick);
    return () => body.removeEventListener("click", onClick);
  }, [slug, bodyId]);

  return null;
}
