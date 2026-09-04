import { locationHighlights } from "@/content/location";
import { highlightIcons } from "@/components/sections/location/icons";
import { Container } from "@/components/ui/Container";

/**
 * The three approved highlight rows — shared by the desktop glass card
 * and the mobile flow block below the composition.
 */
export function HighlightRows({ className = "" }: { className?: string }) {
  return (
    <ul className={className}>
      {locationHighlights.map((h, i) => (
        <li
          key={h.id}
          className={`flex items-center gap-3.5 py-3 ${i > 0 ? "border-t border-[#0B1B33]/10" : ""}`}
        >
          <span className="h-5 w-5 shrink-0 text-brand">{highlightIcons[h.id]}</span>
          <span className="text-[0.85rem] font-medium text-[#0B1B33]">{h.label}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Layer 6 — the bottom-left translucent feature card: premium glass
 * (soft white, backdrop blur, hairline white border), positioned at the
 * bottom-left with the standard sitewide container padding.
 */
export function LocationFeatureCard() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] hidden lg:block">
      <Container className="pb-8 sm:pb-10 lg:pb-10 xl:pb-12">
        <div data-loc-card="" className="pointer-events-auto mb-10 w-[clamp(16rem,19vw,20.5rem)]">
          <HighlightRows className="rounded-[20px] border border-white/35 bg-white/60 px-5 py-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.10)] backdrop-blur-[12px]" />
        </div>
      </Container>
    </div>
  );
}
