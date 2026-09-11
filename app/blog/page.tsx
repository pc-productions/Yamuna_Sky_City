import type { Metadata } from "next";
import { isSiteUrlConfigured } from "@/content/site";
import { getActiveCategories, getFeaturedArticle, getPublishedArticles } from "@/lib/blog/articles";
import { buildJournalMetadata, buildJournalStructuredData } from "@/lib/blog/seo";
import { Container } from "@/components/ui/Container";
import { JournalHero } from "@/components/journal/JournalHero";
import { FeaturedArticle } from "@/components/journal/FeaturedArticle";
import { CategoryNav } from "@/components/journal/CategoryNav";
import { ArticleGrid } from "@/components/journal/ArticleGrid";
import { JournalCTA } from "@/components/journal/JournalCTA";

/**
 * /blog — the Journal front. Statically generated from the Markdown in
 * content/blog/articles; rebuilds when an article is added (no runtime
 * data fetching, no client-side state). Structure: hero → featured
 * article → category strip → article grid → project CTA. The grid shows
 * four (phones) or six cards, the rest behind "Load more" (ArticleGrid).
 */
export const metadata: Metadata = buildJournalMetadata();

export default function JournalPage() {
  const articles = getPublishedArticles();
  const featured = getFeaturedArticle(articles);
  const rest = articles.filter((a) => a.slug !== featured?.slug);
  const activeCategories = getActiveCategories();

  return (
    <>
      {isSiteUrlConfigured && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJournalStructuredData(articles)) }}
        />
      )}
      <section className="bg-paper pt-20 pb-12 sm:pt-24 sm:pb-14">
        <Container>
          <JournalHero />
        </Container>
      </section>

      {featured && (
        <section aria-label="Featured article" className="bg-paper pb-16 sm:pb-24">
          <Container>
            <FeaturedArticle article={featured} />
          </Container>
        </section>
      )}

      <section aria-labelledby="latest-heading" className="bg-paper pb-24 sm:pb-32">
        <Container>
          <CategoryNav categories={activeCategories} />
          <h2 id="latest-heading" className="sr-only">
            Latest articles
          </h2>
          <ArticleGrid articles={rest} />
        </Container>
      </section>

      <JournalCTA placement="journal-index" />
    </>
  );
}
