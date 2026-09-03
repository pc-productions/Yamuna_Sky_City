"use client";

import type { ReactNode } from "react";
import { connectivity, connectivityMap, type ConnectivityId } from "@/content/location";
import { useReveal } from "@/lib/hooks/useReveal";

/**
 * Programmatic connectivity overlay for the Location section.
 *
 * Everything renders on the shared normalized coordinate system defined
 * in content/location.ts (`connectivityMap.viewBox`, which mirrors the
 * aerial image's aspect): the SVG layer stretches to the image box with
 * preserveAspectRatio="none", and the HTML markers use the same
 * coordinates as percentages — so rings, lines and labels stay attached
 * to the photograph at every viewport width.
 *
 * Reveal choreography (driven by one IntersectionObserver, pure CSS
 * transitions): rings scale in around the tower → connection lines draw
 * outward from the centre (stroke-dash, staggered) → nodes and labels
 * fade in per destination. The global prefers-reduced-motion kill-switch
 * collapses every transition, so reduced-motion visitors see the
 * finished overlay immediately.
 */

const { viewBox, center, rings, nodes } = connectivityMap;

/** Gap (in viewBox units) between a line's end and its marker chip. */
const LINE_TRIM = 34;
/** Radius around the centre where lines start, clearing the tower. */
const CENTER_TRIM = 20;

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

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 hidden sm:block">
      {/* Rings + connection lines — decorative; the same information is
          real DOM text in the markers below and the mobile list. */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 z-[6] h-full w-full"
        viewBox={`0 0 ${viewBox.w} ${viewBox.h}`}
        preserveAspectRatio="none"
      >
        {/* Concentric rings around the tower */}
        <g
          className="origin-center transition-all duration-1000 ease-out"
          style={{
            transformOrigin: `${center.x}px ${center.y}px`,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "scale(1)" : "scale(0.92)",
            transitionDelay: "150ms",
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
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>

        {/* Connection lines drawing outward from the tower, staggered.
            Each visible line is dotted (matching the approved artwork);
            the draw effect comes from a solid line inside a mask whose
            dash offset transitions, sweeping the dots into view from the
            centre outward. */}
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
                  className="transition-[stroke-dashoffset] duration-700 ease-out"
                  style={{
                    strokeDasharray: 1,
                    strokeDashoffset: isVisible ? 0 : 1,
                    transitionDelay: `${350 + i * 90}ms`,
                  }}
                />
              </mask>
            );
          })}
        </defs>
        {nodes.map((node, i) => {
          const l = trimmedLine(node.x, node.y);
          return (
            <g key={node.id}>
              <line
                {...l}
                mask={`url(#conn-mask-${i})`}
                stroke="rgba(255,255,255,0.9)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="0.5 8"
                vectorEffect="non-scaling-stroke"
              />
              {/* Ember accent dot where the line meets the destination */}
              <circle
                cx={l.x2}
                cy={l.y2}
                r="3.2"
                fill="#DA2B1D"
                className="transition-opacity duration-500"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transitionDelay: `${900 + i * 90}ms`,
                }}
              />
            </g>
          );
        })}
      </svg>

      {/* Destination markers — real text, positioned on the same
          normalized coordinates as the SVG. */}
      <div className="absolute inset-0 z-[7]">
        {nodes.map((node, i) => {
          const item = byId[node.id];
          if (!item) return null;
          return (
            <div
              key={node.id}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center transition-all duration-700 ease-out"
              style={{
                left: `${(node.x / viewBox.w) * 100}%`,
                top: `${(node.y / viewBox.h) * 100}%`,
                opacity: isVisible ? 1 : 0,
                transform: isVisible
                  ? "translate(-50%,-50%) scale(1)"
                  : "translate(-50%,-50%) scale(0.85)",
                transitionDelay: `${650 + i * 90}ms`,
              }}
            >
              {/* Soft white glow behind the whole marker cluster keeps
                  the ink label readable on any part of the photograph —
                  the same device the approved artwork used. */}
              <span
                aria-hidden="true"
                className="absolute top-1/2 left-1/2 -z-10 h-[130%] w-[150%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/55 blur-xl"
              />
              <span className="flex aspect-square w-[clamp(2rem,4.4vw,4.25rem)] items-center justify-center rounded-full bg-white/95 text-ink shadow-[0_2px_14px_rgba(0,0,0,0.15)]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="w-[55%]"
                >
                  {icons[node.id]}
                </svg>
              </span>
              <span className="mt-[0.5vw] max-w-[11vw] text-center text-[clamp(0.5rem,0.75vw,0.75rem)] font-semibold tracking-[0.08em] whitespace-normal text-ink/90 uppercase">
                {item.label}
              </span>
              <span className="font-display text-[clamp(0.6875rem,1.05vw,1.0625rem)] font-semibold text-[#DA2B1D]">
                {item.minutes} min
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
