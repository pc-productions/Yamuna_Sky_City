import Link from "next/link";

/**
 * "Home / Journal / Category" — the visible counterpart of the
 * BreadcrumbList JSON-LD. The current page (the article) is not
 * repeated here; its H1 follows immediately below.
 */
export function Breadcrumb({ items }: { items: { name: string; path: string }[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-ink-faint">
        {items.map((item, i) => (
          <li key={item.path} className="flex items-center gap-3">
            {i > 0 && <span aria-hidden="true" className="text-ink-faint/60">/</span>}
            <Link href={item.path} className="transition-colors duration-[var(--motion-fast)] hover:text-brand">
              {item.name}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
