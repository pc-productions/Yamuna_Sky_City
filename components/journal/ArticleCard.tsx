import Image from "next/image";
import Link from "next/link";
import { getCategory } from "@/content/blog/categories";
import { articlePath, formatDateShort } from "@/lib/blog/seo";
import type { ArticleSummary } from "@/lib/blog/types";
import { JournalLink } from "@/components/journal/JournalLink";

/**
 * Journal card: photograph, category, title, excerpt, date · reading
 * time. Rectangular, no shadow, no border — hierarchy comes from the
 * type. Hover: the photograph eases closer and the title takes the
 * brand colour, on the site's standard durations. The whole card is
 * one link (title text is the accessible name).
 */
export function ArticleCard({
  article,
  priority = false,
  fromSlug,
  sizes = "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw",
}: {
  article: ArticleSummary;
  /** Above-the-fold cards may load eagerly. */
  priority?: boolean;
  /** Set on "related" cards so the click is reported with its origin. */
  fromSlug?: string;
  sizes?: string;
}) {
  const category = getCategory(article.category);
  const href = articlePath(article.slug);
  const inner = (
    <>
      <div className="relative aspect-[4/3] overflow-hidden bg-paper-muted">
          <Image
            src={article.featuredImage}
            alt={article.featuredImageAlt}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover transition-transform duration-[var(--motion-slow)] ease-[var(--ease-editorial)] group-hover:scale-[1.04]"
          />
        </div>
        <div className="flex flex-col pt-6">
          {category && <span className="eyebrow text-brand">{category.label}</span>}
          <h3 className="mt-3 font-display text-[1.25rem] font-semibold normal-case leading-[1.3] tracking-[-0.015em] text-ink transition-colors duration-[var(--motion-fast)] group-hover:text-brand sm:text-[1.375rem]">
            {article.title}
          </h3>
          <p className="mt-3 line-clamp-3 text-[0.9375rem] leading-relaxed text-ink-muted">{article.excerpt}</p>
          <p className="mt-5 text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-ink-faint">
            <time dateTime={article.publishedAt}>{formatDateShort(article.publishedAt)}</time>
            <span aria-hidden="true"> · </span>
            {article.readingTime} min read
          </p>
        </div>
    </>
  );
  const linkClass = "flex flex-col outline-offset-4";

  return (
    <article data-reveal-item="" className="group flex flex-col">
      {fromSlug ? (
        <JournalLink
          href={href}
          className={linkClass}
          track={{ event: "blog_related_article_click", slug: fromSlug, to: article.slug }}
        >
          {inner}
        </JournalLink>
      ) : (
        <Link href={href} className={linkClass}>
          {inner}
        </Link>
      )}
    </article>
  );
}
