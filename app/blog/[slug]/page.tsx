import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { authors } from "@/content/blog/authors";
import { categoryHref, getCategory } from "@/content/blog/categories";
import { isSiteUrlConfigured } from "@/content/site";
import { getArticle, getPublishedArticles, getRelatedArticles } from "@/lib/blog/articles";
import { articleBreadcrumbs, buildArticleMetadata, buildArticleStructuredData, formatDateLong } from "@/lib/blog/seo";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Breadcrumb } from "@/components/journal/Breadcrumb";
import { ArticleTracking } from "@/components/journal/ArticleTracking";
import { RelatedArticles } from "@/components/journal/RelatedArticles";
import { JournalCTA } from "@/components/journal/JournalCTA";
import Link from "next/link";

/**
 * /blog/<slug> — one article, statically generated. The page owns the
 * single H1 (the title); Markdown headings start at H2. Unknown or
 * unpublished slugs are 404s (`dynamicParams = false` → no on-demand
 * rendering of arbitrary paths).
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  return article ? buildArticleMetadata(article) : {};
}

const BODY_ID = "article-body";

export default async function ArticlePage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const category = getCategory(article.category);
  const author = authors[article.author];
  const related = getRelatedArticles(article);
  const crumbs = articleBreadcrumbs(article).slice(0, -1); // the H1 is the last crumb

  return (
    <>
      {isSiteUrlConfigured && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildArticleStructuredData(article)) }}
        />
      )}
      <ArticleTracking slug={article.slug} category={article.category} bodyId={BODY_ID} />

      <article className="bg-paper">
        <header className="pt-32 sm:pt-40">
          <Container>
            <div className="mx-auto max-w-4xl">
              <Reveal>
                <Breadcrumb items={crumbs} />
              </Reveal>
              {category && (
                <Reveal delayMs={80}>
                  <Link href={categoryHref(category.slug)} className="eyebrow mt-10 inline-block text-brand hover:text-brand-dark">
                    {category.label}
                  </Link>
                </Reveal>
              )}
              <Reveal delayMs={140}>
                <h1 className="mt-5 font-display text-[clamp(1.875rem,4vw,3.25rem)] font-semibold normal-case leading-[1.12] tracking-[-0.02em] text-ink">
                  {article.title}
                </h1>
              </Reveal>
              <Reveal delayMs={260}>
                <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink-muted sm:text-xl">{article.excerpt}</p>
              </Reveal>
              <Reveal delayMs={340}>
                <p className="mt-8 text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-ink-faint">
                  <time dateTime={article.publishedAt}>{formatDateLong(article.publishedAt)}</time>
                  <span aria-hidden="true"> · </span>
                  {article.readingTime} min read
                  <span aria-hidden="true"> · </span>
                  <span>{author.name}</span>
                </p>
              </Reveal>
            </div>
          </Container>

          <Container className="mt-12 sm:mt-16">
            {/* The featured photograph is the LCP element: painted at once,
                no scripted entrance (which would delay first paint by the
                length of the animation on phones). */}
            <figure className="mx-auto max-w-5xl">
              <div className="relative aspect-[16/9] overflow-hidden bg-paper-muted">
                <Image
                  src={article.featuredImage}
                  alt={article.featuredImageAlt}
                  fill
                  priority
                  quality={65}
                  sizes="(min-width: 1100px) 1024px, 100vw"
                  className="object-cover"
                />
              </div>
              {article.featuredImageCaption && (
                <figcaption className="mt-4 text-[0.8125rem] leading-relaxed text-ink-faint">{article.featuredImageCaption}</figcaption>
              )}
            </figure>
          </Container>
        </header>

        <Container className="pt-14 pb-24 sm:pt-20 sm:pb-32">
          <div id={BODY_ID} className="journal-prose mx-auto" dangerouslySetInnerHTML={{ __html: article.html }} />

          {article.updatedAt !== article.publishedAt && (
            <p className="mx-auto mt-14 max-w-[46rem] text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-ink-faint">
              Updated <time dateTime={article.updatedAt}>{formatDateLong(article.updatedAt)}</time>
            </p>
          )}
        </Container>
      </article>

      <JournalCTA slug={article.slug} placement="article-end" />
      <RelatedArticles articles={related} fromSlug={article.slug} />
    </>
  );
}
