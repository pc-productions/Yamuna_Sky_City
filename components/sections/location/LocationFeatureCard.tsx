import { locationHighlights } from "@/content/location";
import { highlightIcons } from "@/components/sections/location/icons";

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
 * The translucent feature card — premium glass (soft white, backdrop
 * blur, hairline white border). It sits in the editorial column's
 * flow, directly below the supporting copy with clear breathing room,
 * so it always tracks the text however the copy wraps.
 */
export function LocationFeatureCard() {
  return (
    <div data-loc-card="" className="mt-10 2xl:mt-12">
      <HighlightRows className="w-[clamp(16rem,19vw,20rem)] rounded-[20px] border border-white/35 bg-white/55 px-5 py-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.10)] backdrop-blur-[12px]" />
    </div>
  );
}
