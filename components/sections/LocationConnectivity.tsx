"use client";

import { useState, type ReactNode } from "react";
import {
  connectivity,
  connectivityMap,
  locationHighlights,
  type ConnectivityId,
} from "@/content/location";
import { useReveal } from "@/lib/hooks/useReveal";

/**
 * Programmatic recreation of the approved "Perfectly Connected"
 * composition over the clean aerial render: white circular icon chips
 * with a red connector dot on their tower-facing edge, dotted white
 * lines running inward, large circular rings around the tower, ink
 * landmark names with red travel times, and the frosted highlight
 * panel at the lower left. Nothing is baked into the image.
 *
 * Geometry lives in content/location.ts on a normalized coordinate
 * system mirroring the image's aspect; the SVG stretches to the image
 * box and the HTML chips use the same coordinates as percentages, so
 * the composition stays glued to the photograph at every width.
 *
 * Choreography on scroll (one IntersectionObserver, CSS only): the
 * photograph settles from a gentle zoom → rings breathe in → dotted
 * lines draw inward from each chip (masked dash sweep) with a streak
 * of light travelling each once → chips pop in with their labels,
 * staggered → the highlight panel rises last. Hovering a chip lifts it
 * and brightens its line. Reduced motion shows the finished
 * composition instantly.
 */

const { viewBox, center, rings, chipRadius, lineEndRadius, nodes } = connectivityMap;

const byId = Object.fromEntries(connectivity.map((c) => [c.id, c]));

/** Unit vector from a chip centre toward the ring centre. */
function towardCenter(x: number, y: number) {
  const dx = center.x - x;
  const dy = center.y - y;
  const len = Math.hypot(dx, dy);
  return { ux: dx / len, uy: dy / len, len };
}

/** Red connector dot on the chip's tower-facing edge. */
function edgePoint(x: number, y: number) {
  const { ux, uy } = towardCenter(x, y);
  return { x: x + ux * chipRadius, y: y + uy * chipRadius };
}

/** Dotted line from the chip edge inward, ending near the tower. */
function connectionLine(x: number, y: number) {
  const { ux, uy, len } = towardCenter(x, y);
  const start = edgePoint(x, y);
  const endLen = Math.max(len - lineEndRadius, chipRadius + 8);
  return { x1: start.x, y1: start.y, x2: x + ux * endLen, y2: y + uy * endLen };
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

/* Legend icons for the highlight panel (waves / pin / sparkle). */
const highlightIcons: Record<(typeof locationHighlights)[number]["id"], ReactNode> = {
  seaside: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true" className="h-full w-full">
      <path d="M3 7.5c1.5-1.4 3-1.4 4.5 0s3 1.4 4.5 0 3-1.4 4.5 0 3 1.4 4.5 0" />
      <path d="M3 12c1.5-1.4 3-1.4 4.5 0s3 1.4 4.5 0 3-1.4 4.5 0 3 1.4 4.5 0" />
      <path d="M3 16.5c1.5-1.4 3-1.4 4.5 0s3 1.4 4.5 0 3-1.4 4.5 0 3 1.4 4.5 0" />
    </svg>
  ),
  connectivity: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-full w-full">
      <path d="M12 21s-6.5-5.4-6.5-10.2A6.5 6.5 0 0 1 12 4.5a6.5 6.5 0 0 1 6.5 6.3C18.5 15.6 12 21 12 21Z" />
      <circle cx="12" cy="10.8" r="2.2" />
    </svg>
  ),
  reach: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-full w-full">
      <path d="M12 2.5 13.9 9 20.5 11l-6.6 2L12 19.5 10.1 13 3.5 11l6.6-2L12 2.5Z" />
      <circle cx="18.7" cy="4.6" r="1.1" />
    </svg>
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
      {/* Rings + dotted connection lines — decorative; the information
          is real DOM text in the chips and the mobile list. */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 z-[6] h-full w-full"
        viewBox={`0 0 ${viewBox.w} ${viewBox.h}`}
        preserveAspectRatio="none"
      >
        {/* Large circular rings around the tower */}
        <g
          className="transition-all duration-[1500ms] ease-out"
          style={{
            transformOrigin: `${center.x}px ${center.y}px`,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "scale(1)" : "scale(0.92)",
            transitionDelay: "100ms",
          }}
        >
          {rings.map((r, i) => (
            <circle
              key={r}
              cx={center.x}
              cy={center.y}
              r={r}
              fill="none"
              stroke={`rgba(255,255,255,${[0.7, 0.5, 0.35][i] ?? 0.35})`}
              strokeWidth={i === 0 ? 1.5 : 1}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>

        {/* Dotted lines drawing inward from each chip, with a one-time
            travelling streak (the hero cue's gesture). */}
        <defs>
          {nodes.map((node, i) => {
            const l = connectionLine(node.x, node.y);
            return (
              <mask key={node.id} id={`conn-mask-${i}`} maskUnits="userSpaceOnUse">
                <line
                  {...l}
                  pathLength={1}
                  stroke="#fff"
                  strokeWidth="8"
                  className="transition-[stroke-dashoffset] duration-[800ms] ease-out"
                  style={{
                    strokeDasharray: 1,
                    strokeDashoffset: isVisible ? 0 : 1,
                    transitionDelay: `${400 + i * 90}ms`,
                  }}
                />
              </mask>
            );
          })}
        </defs>
        {nodes.map((node, i) => {
          const l = connectionLine(node.x, node.y);
          const isHovered = hovered === node.id;
          return (
            <g key={node.id}>
              <line
                {...l}
                mask={`url(#conn-mask-${i})`}
                stroke={isHovered ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.85)"}
                strokeWidth={isHovered ? 2.5 : 2}
                strokeLinecap="round"
                strokeDasharray="0.5 7"
                vectorEffect="non-scaling-stroke"
                className="transition-[stroke,stroke-width] duration-300"
              />
              {isVisible && (
                <line
                  {...l}
                  pathLength={1}
                  stroke="rgba(255,255,255,0.95)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  className="animate-conn-streak"
                  style={
                    {
                      strokeDasharray: "0.2 1",
                      "--streak-delay": `${1150 + i * 90}ms`,
                    } as React.CSSProperties
                  }
                />
              )}
              {/* Red connector dot on the chip's tower-facing edge */}
              {(() => {
                const p = edgePoint(node.x, node.y);
                return (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="5"
                    fill="#DA2B1D"
                    stroke="rgba(255,255,255,0.95)"
                    strokeWidth="1.5"
                    className="transition-opacity duration-500"
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transitionDelay: `${750 + i * 90}ms`,
                    }}
                  />
                );
              })()}
            </g>
          );
        })}
      </svg>

      {/* White icon chips + labels — real text on the same coordinates */}
      <div className="absolute inset-0 z-[7]">
        {nodes.map((node, i) => {
          const item = byId[node.id];
          if (!item) return null;
          return (
            <div
              key={node.id}
              /* Top-anchored so the CHIP's centre (not the stack's) sits
                 exactly on the node point the SVG geometry uses. */
              className="absolute flex -translate-x-1/2 flex-col items-center transition-all duration-700 ease-out"
              style={{
                left: `${(node.x / viewBox.w) * 100}%`,
                top: `${((node.y - chipRadius) / viewBox.h) * 100}%`,
                opacity: isVisible ? 1 : 0,
                transform: isVisible
                  ? "translateX(-50%) scale(1)"
                  : "translateX(-50%) scale(0.8)",
                transitionDelay: `${700 + i * 90}ms`,
              }}
            >
              <div
                onMouseEnter={() => setHovered(node.id)}
                onMouseLeave={() => setHovered(null)}
                className="pointer-events-auto flex aspect-square w-[5.2vw] items-center justify-center rounded-full bg-white text-ink shadow-[0_10px_30px_rgba(0,0,0,0.2)] transition-transform duration-300 hover:-translate-y-0.5 hover:scale-[1.04]"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="w-[46%]"
                >
                  {icons[node.id]}
                </svg>
              </div>
              <span
                className={`mt-[0.55vw] text-center text-[clamp(0.625rem,0.9vw,0.9375rem)] leading-tight font-semibold tracking-[0.06em] text-ink uppercase [text-shadow:0_0_6px_rgba(255,255,255,0.95),0_0_16px_rgba(255,255,255,0.8),0_1px_2px_rgba(255,255,255,0.9)] ${
                  item.label.length > 22 ? "max-w-[14vw]" : "whitespace-nowrap"
                }`}
              >
                {item.label}
              </span>
              <span className="font-display text-[clamp(0.6875rem,1vw,1.0625rem)] font-semibold tracking-[0.04em] text-[#DA2B1D] [text-shadow:0_0_6px_rgba(255,255,255,0.95),0_0_16px_rgba(255,255,255,0.75)]">
                {item.minutes} MIN
              </span>
            </div>
          );
        })}
      </div>

      {/* Frosted highlight panel, lower left — programmatic, never
          baked. From lg up: tablet widths are too tight to share the
          lower-left corner with the hospital chip. */}
      <div
        className="absolute bottom-[7%] left-[3%] z-[8] hidden transition-all duration-1000 ease-out lg:block"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(14px)",
          transitionDelay: "900ms",
        }}
      >
        <ul className="w-[clamp(13rem,20vw,22rem)] rounded-2xl border border-white/50 bg-white/70 px-[1.4vw] py-[0.6vw] shadow-[0_12px_40px_rgba(0,0,0,0.18)] backdrop-blur-md">
          {locationHighlights.map((h, i) => (
            <li
              key={h.id}
              className={`flex items-center gap-[0.9vw] py-[0.75vw] ${
                i > 0 ? "border-t border-ink/10" : ""
              }`}
            >
              <span className="h-[clamp(1rem,1.5vw,1.625rem)] w-[clamp(1rem,1.5vw,1.625rem)] shrink-0 text-[#DA2B1D]">
                {highlightIcons[h.id]}
              </span>
              <span className="text-[clamp(0.6875rem,1vw,1.0625rem)] font-medium text-ink/90">
                {h.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
