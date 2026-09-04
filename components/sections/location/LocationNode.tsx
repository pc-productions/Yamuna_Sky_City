import type { CSSProperties } from "react";
import type { ConnectivityId } from "@/content/location";
import { nodeIcons } from "@/components/sections/location/icons";
import { WRAP_LABEL_LENGTH } from "@/components/sections/location/config";

export type LocationNodeItem = {
  id: ConnectivityId;
  label: string;
  minutes: number;
};

/**
 * Layer 4 — one floating location bubble: circular white icon chip,
 * uppercase name, emphasized red travel time. The information is real
 * DOM text (not SVG), keyboard reachable, with the destination as the
 * group's accessible name.
 *
 * Structure = three nested boxes so transforms never fight:
 *   outer  — positioned anchor; GSAP pops it in (opacity/scale/y)
 *   float  — CSS vertical float, paused until the section settles
 *   bubble — restrained hover lift (scale + shadow)
 *
 * The nodes stay spatially FIXED — no orbiting, no rotation; only the
 * subtle vertical float.
 */
export function LocationNode({
  item,
  position,
  float,
}: {
  item: LocationNodeItem;
  /** left/top of the anchor, as CSS values (already in % of the stage). */
  position: { left: string; top: string };
  float: { duration: number; delay: number };
}) {
  const wrap = item.label.length > WRAP_LABEL_LENGTH;
  return (
    <div
      data-loc-node=""
      className="absolute -translate-x-1/2"
      style={{ left: position.left, top: position.top }}
    >
      <div
        className="loc-float"
        style={
          {
            "--float-duration": `${float.duration}s`,
            "--float-delay": `${float.delay}s`,
          } as CSSProperties
        }
      >
        <div
          role="group"
          tabIndex={0}
          aria-label={`${item.label} — ${item.minutes} minutes away`}
          className="group flex flex-col items-center outline-offset-4"
        >
          <div
            className="flex aspect-square w-[5.4cqw] items-center justify-center rounded-full bg-white/95 text-[#0B1B33] shadow-[0_8px_30px_rgba(0,0,0,0.10)] backdrop-blur-[6px] transition-[scale,box-shadow] duration-300 ease-out group-hover:scale-[1.04] group-hover:shadow-[0_12px_36px_rgba(0,0,0,0.16)] group-focus-visible:scale-[1.04]"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="w-1/2"
            >
              {nodeIcons[item.id]}
            </svg>
          </div>
          <span
            className={`mt-[0.55cqw] text-center text-[1.02cqw] leading-[1.25] font-bold tracking-[0.03em] text-[#0B1B33] uppercase [text-shadow:0_1px_5px_rgba(255,255,255,0.85),0_0_16px_rgba(255,255,255,0.55)] ${
              wrap ? "max-w-[15.5cqw]" : "whitespace-nowrap"
            }`}
          >
            {item.label}
          </span>
          <span className="mt-[0.2cqw] font-display text-[1.2cqw] font-bold text-[#DA2B1D] [text-shadow:0_1px_5px_rgba(255,255,255,0.8)]">
            {item.minutes} MIN
          </span>
        </div>
      </div>
    </div>
  );
}
