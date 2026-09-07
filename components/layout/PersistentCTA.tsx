import Link from "next/link";
import { ctaLabels } from "@/content/site";

/**
 * Mobile-only persistent action bar. Desktop persistent CTAs live in the
 * sticky Header. Brand treatment: black supporting segment, SkyCity
 * Ember primary segment, Poppins labels, safe-area aware.
 */
export function PersistentCTA({ onEnquire }: { onEnquire: () => void }) {
  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-white/10 bg-night/85 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <button
        type="button"
        onClick={onEnquire}
        className="font-display flex-1 border-r border-white/10 py-4 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-paper/90 transition-colors duration-[var(--motion-fast)] hover:text-paper"
      >
        {ctaLabels.mobileEnquire}
      </button>
      <Link
        href="/#contact"
        className="font-display flex flex-1 items-center justify-center bg-brand py-4 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-paper transition-colors duration-[var(--motion-fast)] hover:bg-brand-dark"
      >
        {ctaLabels.mobileSchedule}
      </Link>
    </nav>
  );
}
