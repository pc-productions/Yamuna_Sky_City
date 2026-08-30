import { ctaLabels } from "@/content/site";

/**
 * Mobile-only persistent action bar. Desktop persistent CTAs live in the
 * sticky Header. Kept as a separate component so mobile/desktop CTA
 * placement can be changed independently. Slim, sharp, safe-area aware.
 */
export function PersistentCTA({ onEnquire }: { onEnquire: () => void }) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-white/10 bg-night/95 backdrop-blur-sm lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <button
        type="button"
        onClick={onEnquire}
        className="flex-1 border-r border-white/10 py-4 text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-mist transition-colors hover:text-white"
      >
        {ctaLabels.mobileEnquire}
      </button>
      <a
        href="#contact"
        className="flex flex-1 items-center justify-center bg-brand py-4 text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-brand-dark"
      >
        {ctaLabels.mobileSchedule}
      </a>
    </div>
  );
}
