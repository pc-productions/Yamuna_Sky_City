import Link from "next/link";
import { categoryHref, type Category } from "@/content/blog/categories";
import { journalPath } from "@/lib/blog/seo";

/**
 * Category strip under the Journal hero — one hairline row of labels,
 * "All" first, the current one underlined in Ember. Scrolls
 * horizontally on narrow screens instead of wrapping into a pile.
 * Categories are real pages (/blog/category/<slug>), so the strip is
 * navigation, not a client-side filter.
 */
export function CategoryNav({ categories, current }: { categories: readonly Category[]; current?: Category["slug"] }) {
  const item = (href: string, label: string, active: boolean) => (
    <Link
      key={href}
      href={href}
      aria-current={active ? "page" : undefined}
      className={`relative shrink-0 whitespace-nowrap py-4 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] transition-colors duration-[var(--motion-fast)] after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-brand after:transition-opacity after:duration-[var(--motion-fast)] ${
        active ? "text-ink after:opacity-100" : "text-ink-faint after:opacity-0 hover:text-ink"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav aria-label="Journal categories" className="border-y border-line">
      <div className="-mx-[11px] flex gap-8 overflow-x-auto px-[11px] sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {item(journalPath, "All", !current)}
        {categories.map((c) => item(categoryHref(c.slug), c.label, c.slug === current))}
      </div>
    </nav>
  );
}
