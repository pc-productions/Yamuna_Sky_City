import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategory } from "@/content/blog/categories";
import { isSiteUrlConfigured } from "@/content/site";
import { getActiveCategories, getArticlesByCategory } from "@/lib/blog/articles";
import { buildCategoryMetadata, buildCategoryStructuredData, journalCopy, journalPath } from "@/lib/blog/seo";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Breadcrumb } from "@/components/journal/Breadcrumb";
import { JournalHero } from "@/components/journal/JournalHero";
import { CategoryNav } from "@/components/journal/CategoryNav";
import { ArticleGrid } from "@/components/journal/ArticleGrid";
import { JournalCTA } from "@/components/journal/JournalCTA";

/**
 * /blog/category/<slug> — one topical cluster. Same grid as the front,
 * filtered; a real, indexable page per category so each cluster has a
 * hub URL. Unknown categories, and categories with no published
 * article, are 404s.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return getActiveCategories().map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/category/[category]">): Promise<Metadata> {
  const { category } = await params;
  const c = getCategory(category);
  return c ? buildCategoryMetadata(c) : {};
}

export default async function CategoryPage({ params }: PageProps<"/blog/category/[category]">) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  const articles = getArticlesByCategory(category.slug);
  if (articles.length === 0) notFound();

  return (
    <>
      {isSiteUrlConfigured && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildCategoryStructuredData(category)) }}
        />
      )}
      <section className="bg-paper pt-24 pb-12 sm:pb-14 xl:pt-28">
        <Container>
          <Reveal>
            <Breadcrumb items={[{ name: journalCopy.breadcrumbHome, path: "/" }, { name: journalCopy.breadcrumbJournal, path: journalPath }]} />
          </Reveal>
          <div className="mt-8">
            <JournalHero eyebrow={journalCopy.eyebrow} lines={[category.label]} supportingLine={category.description} />
          </div>
        </Container>
      </section>

      <section aria-labelledby="category-articles-heading" className="bg-paper pb-24 sm:pb-32">
        <Container>
          <CategoryNav categories={getActiveCategories()} current={category.slug} />
          <h2 id="category-articles-heading" className="sr-only">
            {category.label} articles
          </h2>
          <ArticleGrid articles={articles} />
        </Container>
      </section>

      <JournalCTA placement={`journal-category-${category.slug}`} />
    </>
  );
}
