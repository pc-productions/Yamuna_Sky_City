import { ctaLabels } from "@/content/site";
import { Button } from "@/components/ui/Button";

/**
 * Mobile-only persistent action bar. Desktop persistent CTAs live in the
 * sticky Header. Kept as a separate component so mobile/desktop CTA
 * placement can be changed independently.
 */
export function PersistentCTA({ onEnquire }: { onEnquire: () => void }) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 flex gap-px border-t border-line-dark bg-night lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <Button
        variant="ghost-dark"
        onClick={onEnquire}
        className="flex-1 rounded-none border-r border-line-dark py-4"
      >
        {ctaLabels.mobileEnquire}
      </Button>
      <Button href="#contact" variant="primary" className="flex-1 rounded-none py-4">
        {ctaLabels.mobileSchedule}
      </Button>
    </div>
  );
}
