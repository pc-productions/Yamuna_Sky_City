"use client";

import { useState } from "react";
import { connectivity, connectivityMap, type ConnectivityId } from "@/content/location";
import { useReveal } from "@/lib/hooks/useReveal";

/**
 * Radial proximity overlay for the Location section — a quiet radar
 * diagram laid over the aerial photograph. Every destination's dot sits
 * on its own concentric ground-plane ring around the tower; ring radius
 * grows with travel time, so nearness is legible at a glance. Nodes are
 * ember dots with a two-line label (name, tracked travel time) — no
 * boxes, no icons, no clutter.
 *
 * Geometry lives in content/location.ts on a normalized coordinate
 * system mirroring the image's aspect; the SVG stretches to the image
 * box and HTML labels use the same coordinates as percentages, so the
 * diagram stays glued to the photograph at every width.
 *
 * Choreography on scroll (one IntersectionObserver, CSS only): the
 * photograph settles from a gentle zoom (globals.css watches
 * [data-visible]) → the rings breathe in → hairlines draw outward from
 * the tower's centre ring → a streak of light travels each line once
 * (the hero cue's gesture) → dots and labels rise in, nearest first.
 * The tower beacon keeps a slow expanding pulse — the one continuously
 * living element. Hovering a label brightens its line and rings a halo
 * around its dot. Reduced motion collapses everything to the finished
 * state instantly.
 */

const { viewBox, center, ringSquash, centerRing, nodes } = connectivityMap;

const byId = Object.fromEntries(connectivity.map((c) => [c.id, c]));

/** Ring radius on which a node sits (ellipse squashed by ringSquash). */
function nodeRadius(x: number, y: number) {
  const dx = x - center.x;
  const dy = (y - center.y) / ringSquash;
  return Math.hypot(dx, dy);
}

/** Line from the centre ring's edge to just short of the node's dot. */
function connectionLine(x: number, y: number) {
  const dx = x - center.x;
  const dy = y - center.y;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  // Start on the centre ring (squashed), end just before the dot.
  const startLen = Math.hypot(centerRing * ux, centerRing * ringSquash * uy);
  return {
    x1: center.x + ux * startLen,
    y1: center.y + uy * startLen,
    x2: x - ux * 12,
    y2: y - uy * 12,
  };
}

/* Nodes sorted nearest-first so the reveal ripples outward. */
const orderedNodes = [...nodes].sort(
  (a, b) => nodeRadius(a.x, a.y) - nodeRadius(b.x, b.y),
);

export function LocationConnectivity() {
  const { ref, isVisible } = useReveal<HTMLDivElement>(0.35);
  const [hovered, setHovered] = useState<ConnectivityId | null>(null);

  return (
    <div
      ref={ref}
      data-visible={isVisible}
      className="pointer-events-none absolute inset-0 hidden sm:block"
    >
      {/* Soft radial dusk over the diagram area so the hairline rings
          and white labels lift off the photograph — the quiet dark
          ground the radial layout needs, without flattening the image. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[5] transition-opacity duration-[1400ms]"
        style={{
          opacity: isVisible ? 1 : 0,
          background:
            "radial-gradient(ellipse 62% 80% at 53% 44%, rgba(2,8,18,0.5) 0%, rgba(2,8,18,0.26) 48%, rgba(2,8,18,0) 74%)",
        }}
      />

      {/* Rings, beacon and connection lines — decorative; the same
          information is real DOM text in the labels below and in the
          mobile travel-time list. */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 z-[6] h-full w-full"
        viewBox={`0 0 ${viewBox.w} ${viewBox.h}`}
        preserveAspectRatio="none"
      >
        {/* One ground-plane ring per destination, radius = its distance */}
        <g
          className="transition-all duration-[1600ms] ease-out"
          style={{
            transformOrigin: `${center.x}px ${center.y}px`,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "scale(1)" : "scale(0.88)",
            transitionDelay: "100ms",
          }}
        >
          {orderedNodes.map((node) => {
            const r = nodeRadius(node.x, node.y);
            return (
              <ellipse
                key={node.id}
                cx={center.x}
                cy={center.y}
                rx={r}
                ry={r * ringSquash}
                fill="none"
                stroke={
                  hovered === node.id ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.32)"
                }
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                className="transition-[stroke] duration-300"
              />
            );
          })}
        </g>

        {/* Centre: double ring around the tower + ember beacon */}
        <g
          className="transition-opacity duration-700"
          style={{ opacity: isVisible ? 1 : 0, transitionDelay: "300ms" }}
        >
          <ellipse
            cx={center.x}
            cy={center.y}
            rx={centerRing}
            ry={centerRing * ringSquash}
            fill="none"
            stroke="rgba(255,255,255,0.75)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
          <ellipse
            cx={center.x}
            cy={center.y}
            rx={centerRing - 9}
            ry={(centerRing - 9) * ringSquash}
            fill="none"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
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
          <circle cx={center.x} cy={center.y} r="8" fill="rgba(255,255,255,0.9)" />
          <circle cx={center.x} cy={center.y} r="4.5" fill="#B42810" />
        </g>

        {/* Hairlines drawing outward, then a streak of light travelling
            each one once — the hero cue's gesture, mapped outward. */}
        <defs>
          {orderedNodes.map((node, i) => {
            const l = connectionLine(node.x, node.y);
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
                    transitionDelay: `${500 + i * 110}ms`,
                  }}
                />
              </mask>
            );
          })}
        </defs>
        {orderedNodes.map((node, i) => {
          const l = connectionLine(node.x, node.y);
          const isHovered = hovered === node.id;
          return (
            <g key={node.id}>
              <line
                {...l}
                mask={`url(#conn-mask-${i})`}
                stroke={isHovered ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.45)"}
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
                      "--streak-delay": `${1400 + i * 110}ms`,
                    } as React.CSSProperties
                  }
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Ember dots + quiet two-line labels — real text on the same
          normalized coordinates as the SVG. */}
      <div className="absolute inset-0 z-[7]">
        {orderedNodes.map((node, i) => {
          const item = byId[node.id];
          if (!item) return null;
          const isHovered = hovered === node.id;
          return (
            <div
              key={node.id}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center transition-all duration-700 ease-out"
              style={{
                left: `${(node.x / viewBox.w) * 100}%`,
                top: `${(node.y / viewBox.h) * 100}%`,
                opacity: isVisible ? 1 : 0,
                transform: isVisible
                  ? "translate(-50%,-50%) translateY(0)"
                  : "translate(-50%,-50%) translateY(8px)",
                transitionDelay: `${1150 + i * 110}ms`,
              }}
            >
              {/* Anchor dot with a halo that rings it on hover */}
              <span className="relative flex items-center justify-center">
                <span
                  aria-hidden="true"
                  className={`absolute h-6 w-6 rounded-full border border-white/70 transition-all duration-300 ${
                    isHovered ? "scale-100 opacity-100" : "scale-50 opacity-0"
                  }`}
                />
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 rounded-full bg-brand shadow-[0_0_0_2px_rgba(255,255,255,0.9),0_0_12px_2px_rgba(255,255,255,0.45)]"
                />
              </span>
              {/* Two-line label: sentence-case name, tracked time */}
              <div
                onMouseEnter={() => setHovered(node.id)}
                onMouseLeave={() => setHovered(null)}
                className="pointer-events-auto mt-2 flex flex-col items-center gap-1 text-center"
              >
                <span className="text-[clamp(0.6875rem,0.95vw,0.9375rem)] leading-tight font-medium whitespace-nowrap text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.65),0_2px_14px_rgba(0,0,0,0.55)]">
                  {item.label}
                </span>
                <span className="font-display text-[clamp(0.5625rem,0.7vw,0.6875rem)] font-medium tracking-[0.28em] text-pearl-ivory uppercase [text-shadow:0_1px_3px_rgba(0,0,0,0.7),0_2px_12px_rgba(0,0,0,0.6)]">
                  {item.minutes}&nbsp;min
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
