"use client";

import { useState, type ReactNode } from "react";
import { connectivity, connectivityMap, type ConnectivityId } from "@/content/location";
import { useReveal } from "@/lib/hooks/useReveal";

/**
 * Quiet connectivity annotation over the aerial photograph. The tower
 * and landscape stay dominant; the overlay is a restrained annotation
 * layer: small white icon markers, ink names with Ember travel times,
 * hairline connection lines running toward the tower, and two or three
 * barely-there rings for structure. No cards, no endpoint dots, no
 * network-topology styling.
 *
 * Geometry lives in content/location.ts on a normalized coordinate
 * system mirroring the image's aspect; the SVG stretches to the image
 * box and the HTML markers use the same coordinates as percentages, so
 * the annotation stays glued to the photograph at every width.
 *
 * Reveal on scroll (one IntersectionObserver, CSS only): rings fade in
 * → hairlines draw outward from the centre → markers and labels appear
 * with a light stagger. Once settled, nothing moves. Reduced motion
 * shows the finished composition instantly.
 */

const { viewBox, center, rings, chipRadius, lineEndRadius, nodes } = connectivityMap;

const byId = Object.fromEntries(connectivity.map((c) => [c.id, c]));

/** Unit vector from a marker centre toward the ring centre. */
function towardCenter(x: number, y: number) {
  const dx = center.x - x;
  const dy = center.y - y;
  const len = Math.hypot(dx, dy);
  return { ux: dx / len, uy: dy / len, len };
}

/** Hairline from just outside the tower to the marker's edge. */
function connectionLine(x: number, y: number) {
  const { ux, uy, len } = towardCenter(x, y);
  const endLen = Math.max(len - lineEndRadius, chipRadius + 6);
  return {
    // x1/y1 = inner end (near the tower) so the draw starts there.
    x1: x + ux * endLen,
    y1: y + uy * endLen,
    x2: x + ux * chipRadius,
    y2: y + uy * chipRadius,
  };
}

/* Minimal line icons matching the approved artwork's motifs. */
const icons: Record<ConnectivityId, ReactNode> = {
  beach: (
    <>
      <circle cx="12" cy="7.5" r="2.5" />
      <path d="M12 2.5v1.5M7 4l1 1M17 4l-1 1M4.5 7.5H6M18 7.5h1.5" />
      <path d="M3 14.5c1.5-1.4 3-1.4 4.5 0s3 1.4 4.5 0 3-1.4 4.5 0 3 1.4 4.5 0" />
      <path d="M3 19c1.5-1.4 3-1.4 4.5 0s3 1.4 4.5 0 3-1.4 4.5 0 3 1.4 4.5 0" />
    </>
  ),
  nh66: (
    <>
      <path d="M8 4 5 20M16 4l3 16" />
      <path d="M12 5v3M12 11v3M12 17v3" />
    </>
  ),
  school: (
    <>
      <path d="m12 5-9 4 9 4 9-4-9-4Z" />
      <path d="M6.5 11v4.5c0 1 2.5 2.5 5.5 2.5s5.5-1.5 5.5-2.5V11" />
    </>
  ),
  hospital: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M12 8.5v7M8.5 12h7" />
    </>
  ),
  mall: (
    <>
      <path d="M5 8h14l-1 12H6L5 8Z" />
      <path d="M9 10V6.5a3 3 0 0 1 6 0V10" />
    </>
  ),
  cityCentre: (
    <>
      <path d="M4 20V9h6v11M14 20V4h6v16" />
      <path d="M6.5 12h1M6.5 15h1M16.5 8h1M16.5 12h1M16.5 16h1M2.5 20h19" />
    </>
  ),
  airport: (
    <>
      <path d="M10.5 20.5 12 15l4.5-4.5c1.5-1.5 3-4 2.5-5.5-1.5-.5-4 1-5.5 2.5L9 12l-5.5 1.5L5 15l4-1 1.5 1.5-1 4 1 1Z" />
    </>
  ),
};

export function LocationConnectivity() {
  const { ref, isVisible } = useReveal<HTMLDivElement>(0.35);
  const [hovered, setHovered] = useState<ConnectivityId | null>(null);

  return (
    <div
      ref={ref}
      data-visible={isVisible}
      className="pointer-events-none absolute inset-0 hidden sm:block"
    >
      {/* Rings + connection hairlines — decorative; the information is
          real DOM text in the markers and the mobile list. */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 z-[6] h-full w-full"
        viewBox={`0 0 ${viewBox.w} ${viewBox.h}`}
        preserveAspectRatio="none"
      >
        {/* Barely-there structural rings */}
        <g
          className="transition-opacity duration-[1500ms] ease-out"
          style={{ opacity: isVisible ? 1 : 0, transitionDelay: "150ms" }}
        >
          {rings.slice(0, 3).map((r, i) => (
            <circle
              key={r}
              cx={center.x}
              cy={center.y}
              r={r}
              fill="none"
              stroke={`rgba(255,255,255,${[0.28, 0.2, 0.13][i] ?? 0.13})`}
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>

        {/* Hairlines drawing outward from the tower toward each marker */}
        <defs>
          {nodes.map((node, i) => {
            const l = connectionLine(node.x, node.y);
            return (
              <mask key={node.id} id={`conn-mask-${i}`} maskUnits="userSpaceOnUse">
                <line
                  {...l}
                  pathLength={1}
                  stroke="#fff"
                  strokeWidth="6"
                  className="transition-[stroke-dashoffset] duration-[800ms] ease-out"
                  style={{
                    strokeDasharray: 1,
                    strokeDashoffset: isVisible ? 0 : 1,
                    transitionDelay: `${400 + i * 80}ms`,
                  }}
                />
              </mask>
            );
          })}
        </defs>
        {nodes.map((node, i) => {
          const l = connectionLine(node.x, node.y);
          return (
            <line
              key={node.id}
              {...l}
              mask={`url(#conn-mask-${i})`}
              stroke={
                hovered === node.id ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.42)"
              }
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              className="transition-[stroke] duration-300"
            />
          );
        })}
      </svg>

      {/* Small white icon markers + quiet labels — real text on the
          same normalized coordinates as the SVG. */}
      <div className="absolute inset-0 z-[7]">
        {nodes.map((node, i) => {
          const item = byId[node.id];
          if (!item) return null;
          return (
            <div
              key={node.id}
              /* Top-anchored so the MARKER's centre (not the stack's)
                 sits exactly on the node point the SVG geometry uses. */
              className="absolute flex -translate-x-1/2 flex-col items-center transition-all duration-700 ease-out"
              style={{
                left: `${(node.x / viewBox.w) * 100}%`,
                top: `${((node.y - chipRadius) / viewBox.h) * 100}%`,
                opacity: isVisible ? 1 : 0,
                transform: isVisible
                  ? "translateX(-50%) translateY(0)"
                  : "translateX(-50%) translateY(6px)",
                transitionDelay: `${750 + i * 80}ms`,
              }}
            >
              <div
                onMouseEnter={() => setHovered(node.id)}
                onMouseLeave={() => setHovered(null)}
                className="pointer-events-auto flex aspect-square w-[3.4vw] items-center justify-center rounded-full bg-white/95 text-ink shadow-[0_4px_16px_rgba(0,0,0,0.18)] transition-transform duration-300 hover:scale-105"
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
                  {icons[node.id]}
                </svg>
              </div>
              <span
                className={`mt-[0.45vw] text-center text-[clamp(0.5625rem,0.78vw,0.8125rem)] leading-tight font-semibold tracking-[0.04em] text-ink uppercase [text-shadow:0_0_6px_rgba(255,255,255,0.95),0_0_14px_rgba(255,255,255,0.8),0_1px_2px_rgba(255,255,255,0.9)] ${
                  item.label.length > 22 ? "max-w-[12vw]" : "whitespace-nowrap"
                }`}
              >
                {item.label}
              </span>
              <span className="font-display text-[clamp(0.625rem,0.85vw,0.875rem)] font-semibold text-brand [text-shadow:0_0_6px_rgba(255,255,255,0.95),0_0_12px_rgba(255,255,255,0.8)]">
                {item.minutes} MIN
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
