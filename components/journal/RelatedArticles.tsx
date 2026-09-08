import { ArticleCard } from "@/components/journal/ArticleCard";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import type { ArticleSummary } from "@/lib/blog/types";

export function RelatedArticles({ articles, fromSlug }: { articles: ArticleSummary[]; fromSlug: string }) {
  if (articles.length === 0) return null;
  return (
    <section aria-labelledby="related-heading" className="border-t border-line bg-paper-muted">
      <Container className="py-20 sm:py-24">
        <Reveal>
          <span className="eyebrow block text-brand">Continue reading</span>
          <h2 id="related-heading" className="mt-4 text-display-md text-ink">
            Related articles
          </h2>
        </Reveal>
        <Reveal variant="stagger" delayMs={160} className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <ArticleCard key={a.slug} article={a} fromSlug={fromSlug} />
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
