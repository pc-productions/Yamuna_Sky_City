"use client";

import { useState, type ReactNode } from "react";
import { connectivity, connectivityMap, type ConnectivityId } from "@/content/location";
import { useReveal } from "@/lib/hooks/useReveal";

/**
 * Programmatic connectivity overlay for the Location section, in the
 * site's own design language: hairline geometry, dark frosted-glass
 * tags, tracked uppercase micro-labels, disciplined Ember accents.
 *
 * Everything renders on the shared normalized coordinate system from
 * content/location.ts (`connectivityMap.viewBox`, mirroring the aerial
 * image's aspect): the SVG stretches to the image box, and the HTML
 * tags use the same coordinates as percentages — so lines and labels
 * stay attached to the photograph at every viewport width.
 *
 * Choreography on scroll (one IntersectionObserver, CSS only):
 *   1. the photograph settles from a gentle zoom (globals.css, via the
 *      `.location-figure` wrapper watching [data-visible]),
 *   2. concentric rings breathe in around the tower,
 *   3. hairlines draw outward from the beacon (masked dash sweep),
 *   4. a streak of light travels each line once — the same gesture as
 *      the hero scroll cue,
 *   5. anchor dots and glass tags rise in, staggered per destination.
 * The tower beacon keeps a slow expanding-ring pulse afterwards — the
 * one continuously living element. Hovering a tag brightens it and its
 * line together. The global prefers-reduced-motion kill-switch
 * collapses everything to the finished state.
 */

const { viewBox, center, rings, nodes } = connectivityMap;

/** Gap (viewBox units) between a line's end and its anchor dot. */
const LINE_TRIM = 14;
/** Radius around the beacon where lines start, clearing the tower. */
const CENTER_TRIM = 18;

const byId = Object.fromEntries(connectivity.map((c) => [c.id, c]));

function trimmedLine(x: number, y: number) {
  const dx = x - center.x;
  const dy = y - center.y;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  return {
    x1: center.x + ux * CENTER_TRIM,
    y1: center.y + uy * CENTER_TRIM,
    x2: x - ux * LINE_TRIM,
    y2: y - uy * LINE_TRIM,
  };
}

/* Minimal 24×24 line icons, consistent 1.5 stroke — no icon library. */
const icons: Record<ConnectivityId, ReactNode> = {
  beach: (
    <>
      <circle cx="12" cy="8" r="3" />
      <path d="M3 15c1.5-1.4 3-1.4 4.5 0s3 1.4 4.5 0 3-1.4 4.5 0 3 1.4 4.5 0" />
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
      {/* Rings, beacon and connection lines — decorative; the same
          information is real DOM text in the tags below and in the
          mobile travel-time list. */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 z-[6] h-full w-full"
        viewBox={`0 0 ${viewBox.w} ${viewBox.h}`}
        preserveAspectRatio="none"
      >
        {/* Concentric rings breathing in around the tower */}
        <g
          className="transition-all duration-[1400ms] ease-out"
          style={{
            transformOrigin: `${center.x}px ${center.y}px`,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "scale(1)" : "scale(0.9)",
            transitionDelay: "100ms",
          }}
        >
          {rings.map((r) => (
            <ellipse
              key={r}
              cx={center.x}
              cy={center.y}
              rx={r}
              ry={r * 0.78}
              fill="none"
              stroke="rgba(255,255,255,0.38)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>

        {/* Tower beacon: ember core, hairline halo, slow expanding pulse */}
        <g
          className="transition-opacity duration-700"
          style={{ opacity: isVisible ? 1 : 0, transitionDelay: "250ms" }}
        >
          {isVisible && (
            <>
              <circle
                cx={center.x}
                cy={center.y}
                r="7"
                fill="none"
                stroke="rgba(255,255,255,0.55)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                className="animate-beacon-ping"
              />
              <circle
                cx={center.x}
                cy={center.y}
                r="7"
                fill="none"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                className="animate-beacon-ping"
                style={{ animationDelay: "2.1s" }}
              />
            </>
          )}
          <circle cx={center.x} cy={center.y} r="10" fill="rgba(255,255,255,0.85)" />
          <circle cx={center.x} cy={center.y} r="5.5" fill="#B42810" />
        </g>

        {/* Hairlines drawing outward, then a streak of light travelling
            each one once — the hero cue's gesture, mapped outward. */}
        <defs>
          {nodes.map((node, i) => {
            const l = trimmedLine(node.x, node.y);
            return (
              <mask key={node.id} id={`conn-mask-${i}`} maskUnits="userSpaceOnUse">
                <line
                  {...l}
                  pathLength={1}
                  stroke="#fff"
                  strokeWidth="8"
                  className="transition-[stroke-dashoffset] duration-[900ms] ease-out"
                  style={{
                    strokeDasharray: 1,
                    strokeDashoffset: isVisible ? 0 : 1,
                    transitionDelay: `${450 + i * 110}ms`,
                  }}
                />
              </mask>
            );
          })}
        </defs>
        {nodes.map((node, i) => {
          const l = trimmedLine(node.x, node.y);
          const isHovered = hovered === node.id;
          return (
            <g key={node.id}>
              <line
                {...l}
                mask={`url(#conn-mask-${i})`}
                stroke={isHovered ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.55)"}
                strokeWidth={isHovered ? 1.5 : 1}
                vectorEffect="non-scaling-stroke"
                className="transition-[stroke,stroke-width] duration-300"
              />
              {isVisible && (
                <line
                  {...l}
                  pathLength={1}
                  stroke="rgba(255,255,255,0.9)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  className="animate-conn-streak"
                  style={
                    {
                      strokeDasharray: "0.18 1",
                      "--streak-delay": `${1350 + i * 110}ms`,
                    } as React.CSSProperties
                  }
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Anchor dots + frosted glass tags — real text, positioned on the
          same normalized coordinates as the SVG. */}
      <div className="absolute inset-0 z-[7]">
        {nodes.map((node, i) => {
          const item = byId[node.id];
          if (!item) return null;
          const tagBelow = node.labelSide === "bottom";
          return (
            <div
              key={node.id}
              className={`absolute flex -translate-x-1/2 -translate-y-1/2 items-center transition-all duration-700 ease-out ${
                tagBelow ? "flex-col" : "flex-col-reverse"
              }`}
              style={{
                left: `${(node.x / viewBox.w) * 100}%`,
                top: `${(node.y / viewBox.h) * 100}%`,
                opacity: isVisible ? 1 : 0,
                transform: isVisible
                  ? "translate(-50%,-50%) translateY(0)"
                  : `translate(-50%,-50%) translateY(${tagBelow ? "10px" : "-10px"})`,
                transitionDelay: `${1050 + i * 110}ms`,
              }}
            >
              {/* Anchor dot pinned to the exact location */}
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-brand shadow-[0_0_0_3px_rgba(255,255,255,0.85),0_1px_6px_rgba(0,0,0,0.35)]"
              />
              {/* Frosted glass tag */}
              <div
                onMouseEnter={() => setHovered(node.id)}
                onMouseLeave={() => setHovered(null)}
                className={`pointer-events-auto flex items-center gap-2.5 border border-white/20 bg-night/55 px-3 py-2 whitespace-nowrap backdrop-blur-md transition-all duration-300 hover:border-white/45 hover:bg-night/75 ${
                  tagBelow ? "mt-2.5" : "mb-2.5"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="h-[clamp(0.75rem,1vw,1rem)] w-[clamp(0.75rem,1vw,1rem)] shrink-0 text-white/85"
                >
                  {icons[node.id]}
                </svg>
                <span className="text-[clamp(0.5625rem,0.72vw,0.71875rem)] font-medium tracking-[0.14em] text-white/90 uppercase">
                  {item.label}
                </span>
                <span aria-hidden="true" className="h-3 w-px bg-white/25" />
                <span className="font-display text-[clamp(0.6875rem,0.9vw,0.9375rem)] font-semibold text-white">
                  {item.minutes}
                  <span className="pl-0.5 text-[0.75em] font-medium text-white/70">min</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
