import type { Metadata } from "next";
import { isSiteUrlConfigured } from "@/content/site";
import { getActiveCategories, getFeaturedArticle, getPublishedArticles } from "@/lib/blog/articles";
import { buildJournalMetadata, buildJournalStructuredData } from "@/lib/blog/seo";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { JournalHero } from "@/components/journal/JournalHero";
import { FeaturedArticle } from "@/components/journal/FeaturedArticle";
import { CategoryNav } from "@/components/journal/CategoryNav";
import { ArticleCard } from "@/components/journal/ArticleCard";
import { JournalCTA } from "@/components/journal/JournalCTA";

/**
 * /blog — the Journal front. Statically generated from the Markdown in
 * content/blog/articles; rebuilds when an article is added (no runtime
 * data fetching, no client-side state). Structure: hero → featured
 * article → category strip → article grid → project CTA. The grid shows
 * every published article; paginate here once the archive outgrows a
 * single page (see docs/JOURNAL.md).
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
      <section className="bg-paper pt-32 pb-16 sm:pt-40 sm:pb-20">
        <Container>
          <JournalHero />
        </Container>
      </section>

      {featured && (
        <section aria-label="Featured article" className="bg-paper pb-20 sm:pb-28">
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
          {rest.length > 0 ? (
            <Reveal variant="stagger" className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-16">
              {rest.map((a, i) => (
                <ArticleCard key={a.slug} article={a} priority={i < 3} />
              ))}
            </Reveal>
          ) : (
            <p className="mt-14 text-ink-muted">More articles are on their way.</p>
          )}
        </Container>
      </section>

      <JournalCTA placement="journal-index" />
    </>
  );
}
