"use client";

import { useState } from "react";
import type { ArticleSummary } from "@/lib/blog/types";
import { ArticleCard } from "@/components/journal/ArticleCard";
import { Reveal } from "@/components/ui/Reveal";

/** Cards shown before "Load more": four on phones, six from the sm breakpoint. */
const INITIAL_PHONE = 4;
const INITIAL_WIDE = 6;

/**
 * The Journal grid with a "Load more" control. Every card is in the
 * HTML (crawlers and no-JS readers see the whole archive); the ones past
 * the initial count are hidden with CSS until the visitor asks for
 * them, so the page opens on a short, tidy list and there is no
 * hydration mismatch between phone and desktop.
 */
export function ArticleGrid({ articles }: { articles: ArticleSummary[] }) {
  const [expanded, setExpanded] = useState(false);
  const total = articles.length;
  const hidden = total - INITIAL_PHONE;
  if (total === 0) return <p className="mt-14 text-ink-muted">More articles are on their way.</p>;

  return (
    <>
      <Reveal variant="stagger" className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-16">
        {articles.map((a, i) => {
          const visibility = expanded
            ? ""
            : i >= INITIAL_WIDE
              ? "hidden"
              : i >= INITIAL_PHONE
                ? "hidden sm:block"
                : "";
          return (
            <div key={a.slug} className={visibility}>
              <ArticleCard article={a} priority={i < 3} />
            </div>
          );
        })}
      </Reveal>
      {!expanded && hidden > 0 && (
        <div className={`mt-14 flex justify-center ${total > INITIAL_WIDE ? "" : "sm:hidden"}`}>
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="inline-flex items-center gap-3 border border-ink px-8 py-4 text-[0.8125rem] font-semibold uppercase tracking-[0.2em] text-ink transition-colors duration-[var(--motion-fast)] hover:bg-ink hover:text-paper"
          >
            Load more
          </button>
        </div>
      )}
    </>
  );
}
