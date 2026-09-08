/**
 * Journal dataLayer events — pushed to the existing GTM dataLayer (the
 * container is installed once in app/layout.tsx; nothing here initialises
 * anything). Configure tags/triggers for these names inside GTM.
 *
 *   blog_article_view           article page opened      { slug, category }
 *   blog_brochure_click         "Request brochure" CTA   { slug?, placement }
 *   blog_project_click          link into the main site  { slug?, href, placement }
 *   blog_related_article_click  related-article card     { slug, to }
 */
export type JournalEvent =
  | { event: "blog_article_view"; slug: string; category: string }
  | { event: "blog_brochure_click"; slug?: string; placement: string }
  | { event: "blog_project_click"; slug?: string; href: string; placement: string }
  | { event: "blog_related_article_click"; slug: string; to: string };

export function trackJournal(payload: JournalEvent) {
  const w = window as Window & { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push(payload);
}
