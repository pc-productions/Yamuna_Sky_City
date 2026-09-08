import Image from "next/image";
import Link from "next/link";
import { getCategory } from "@/content/blog/categories";
import { articlePath, formatDateShort } from "@/lib/blog/seo";
import type { ArticleSummary } from "@/lib/blog/types";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The lead story on the Journal front: a wide photograph with the
 * title carried large beside it. The photograph is the page's largest
 * contentful paint, so it renders immediately (no scripted entrance —
 * a reveal here costs seconds of LCP on phones); the text column
 * settles in on the site's usual beat.
 */
export function FeaturedArticle({ article }: { article: ArticleSummary }) {
  const category = getCategory(article.category);
  const href = articlePath(article.slug);

  return (
    <article className="group grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:items-end lg:gap-16">
      <Link href={href} className="block outline-offset-4" aria-label={article.title}>
        <div className="relative aspect-[16/10] overflow-hidden bg-paper-muted">
          <Image
            src={article.featuredImage}
            alt={article.featuredImageAlt}
            fill
            priority
            quality={65}
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover transition-transform duration-[var(--motion-slow)] ease-[var(--ease-editorial)] group-hover:scale-[1.03]"
          />
        </div>
      </Link>
      <Reveal delayMs={200} className="flex flex-col lg:pb-2">
        <span className="eyebrow text-brand">{category?.label}</span>
        <h2 className="mt-5 font-display text-[clamp(1.625rem,2.6vw,2.375rem)] font-semibold normal-case leading-[1.18] tracking-[-0.02em] text-ink">
          <Link href={href} className="transition-colors duration-[var(--motion-fast)] group-hover:text-brand hover:text-brand">
            {article.title}
          </Link>
        </h2>
        <p className="mt-5 max-w-lg text-[1.0625rem] leading-relaxed text-ink-muted">{article.excerpt}</p>
        <p className="mt-6 text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-ink-faint">
          <time dateTime={article.publishedAt}>{formatDateShort(article.publishedAt)}</time>
          <span aria-hidden="true"> · </span>
          {article.readingTime} min read
        </p>
        <Link
          href={href}
          className="font-display mt-8 inline-flex w-fit items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-ink transition-colors duration-[var(--motion-fast)] hover:text-brand"
        >
          Read the article
          <span aria-hidden="true" className="transition-transform duration-[var(--motion-fast)] group-hover:translate-x-0.5">&rarr;</span>
        </Link>
      </Reveal>
    </article>
  );
}
