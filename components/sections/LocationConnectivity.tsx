"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  connectivity,
  connectivityMap,
  locationHighlights,
  type ConnectivityId,
} from "@/content/location";
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

/**
 * Orbital parameters. The user requested all icons to share the SAME orbit,
 * equidistant from each other around the tower center, revolving gently.
 */
const ORBIT_RADIUS = 220;
const orbitNodes = nodes.map((n, i) => {
  // Equal distance from each other means equally spaced angles (2PI / count)
  // We offset by -PI/2 so the first icon starts at the top (12 o'clock)
  const angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
  const x = center.x + ORBIT_RADIUS * Math.cos(angle);
  const y = center.y + ORBIT_RADIUS * Math.sin(angle);
  return { ...n, x, y, a0: angle };
});

const orbitParams = orbitNodes.map((n) => {
  return { rx: ORBIT_RADIUS, ry: ORBIT_RADIUS, a0: n.a0, x0: n.x, y0: n.y };
});

/** Connector lines begin this far from the tower centre. */
const LINE_INNER = lineEndRadius;

/** One full orbit takes this long (ms) — slow, almost cinematic. */
const ORBIT_PERIOD_MS = 24000;

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

/* Legend icons for the information box (waves / pin / sparkle). */
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
  const hoveredRef = useRef(false);
  const orbitEls = useRef<(HTMLDivElement | null)[]>([]);
  const lineEls = useRef<(SVGLineElement | null)[]>([]);
  const dotEls = useRef<(SVGCircleElement | null)[]>([]);
  // Flips once, ~1.5s after reveal: releases the entrance line masks and
  // starts the orbital engine. Never set under prefers-reduced-motion,
  // so reduced-motion visitors keep the static approved layout.
  const [orbiting, setOrbiting] = useState(false);

  useEffect(() => {
    if (!isVisible) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(() => setOrbiting(true), 1100);
    return () => window.clearTimeout(t);
  }, [isVisible]);

  // Orbital engine: one rAF loop, zero React state per frame. Each tick
  // advances a shared angle (eased to a crawl while any marker is
  // hovered/focused) and writes styles/attributes directly: markers get
  // translate3d along their own ellipse plus a whisper of depth scale
  // (never rotation — labels stay upright), and each connector line and
  // Ember dot is repositioned in viewBox units so it stays glued to its
  // marker along the radial direction.
  useEffect(() => {
    if (!orbiting) return;
    const figure = ref.current?.parentElement;
    if (!figure) return;
    let unit = figure.getBoundingClientRect().width / viewBox.w;
    const onResize = () => {
      unit = figure.getBoundingClientRect().width / viewBox.w;
    };
    window.addEventListener("resize", onResize);

    const omega = (2 * Math.PI) / ORBIT_PERIOD_MS;
    let raf = 0;
    let last = performance.now();
    let angle = 0;
    let speed = 0; // ramps 0 → 1 so the orbit eases in, and toward ~0.1 on hover
    const tick = (now: number) => {
      const dt = Math.min(now - last, 100);
      last = now;
      // Hovering slows the orbit noticeably but never to an apparent
      // standstill — a resting cursor must not make it look broken.
      const target = hoveredRef.current ? 0.3 : 1;
      speed += (target - speed) * Math.min(1, dt / 450);
      angle += omega * dt * speed;
      for (let i = 0; i < orbitParams.length; i++) {
        const q = orbitParams[i];
        const a = q.a0 + angle;
        const ux = center.x + q.rx * Math.cos(a);
        const uy = center.y + q.ry * Math.sin(a);
        const el = orbitEls.current[i];
        if (el) {
          const depth = (Math.sin(a) + 1) / 2; // lower on screen = nearer
          el.style.transform = `translate3d(${(ux - q.x0) * unit}px, ${(uy - q.y0) * unit}px, 0) scale(${0.94 + 0.06 * depth})`;
          el.style.opacity = (0.88 + 0.12 * depth).toFixed(3);
        }
        const ddx = ux - center.x;
        const ddy = uy - center.y;
        const len = Math.hypot(ddx, ddy) || 1;
        const nx = ddx / len;
        const ny = ddy / len;
        const line = lineEls.current[i];
        if (line) {
          line.setAttribute("x1", String(center.x + nx * Math.min(LINE_INNER, len - chipRadius - 8)));
          line.setAttribute("y1", String(center.y + ny * Math.min(LINE_INNER, len - chipRadius - 8)));
          line.setAttribute("x2", String(ux - nx * chipRadius));
          line.setAttribute("y2", String(uy - ny * chipRadius));
        }
        const dot = dotEls.current[i];
        if (dot) {
          dot.setAttribute("cx", String(ux - nx * chipRadius));
          dot.setAttribute("cy", String(uy - ny * chipRadius));
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [orbiting, ref]);

  // Quiet depth: expose scroll progress as --loc-drift on the figure;
  // globals.css offsets the ring layer and the editorial content at
  // different rates (markers and the tower stay still). rAF-throttled,
  // transform-only, skipped entirely under prefers-reduced-motion.
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const figure = root.parentElement;
    if (!figure) return;
    let raf = 0;
    const update = () => {
      const r = figure.getBoundingClientRect();
      const p = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
      figure.style.setProperty("--loc-drift", Math.max(-1, Math.min(1, p)).toFixed(3));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref]);

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
        data-parallax="rings"
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
              /* Outer rings carry long dash arcs and drift imperceptibly
                 (48s / 72s counter-rotation) — ambient, not mechanical. */
              strokeDasharray={i === 1 ? "150 90" : i === 2 ? "110 140" : undefined}
              className={
                i === 1
                  ? "animate-ring-drift"
                  : i === 2
                    ? "animate-ring-drift-reverse"
                    : undefined
              }
            />
          ))}
        </g>

        {/* Hairlines drawing outward from the tower toward each marker */}
        <defs>
          {orbitNodes.map((node, i) => {
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
        {orbitNodes.map((node, i) => {
          const l = connectionLine(node.x, node.y);
          return (
            <g key={node.id}>
              <line
                {...l}
                ref={(el) => {
                  lineEls.current[i] = el;
                }}
                mask={orbiting ? undefined : `url(#conn-mask-${i})`}
                stroke={
                  hovered === node.id ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.45)"
                }
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                className="transition-[stroke] duration-300"
              />
              {/* Small sharp Ember anchor where the line meets the
                  marker; after entrance it breathes with a tiny
                  staggered pulse. */}
              <g
                className="transition-opacity duration-500"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transitionDelay: `${900 + i * 80}ms`,
                }}
              >
                <circle
                  ref={(el) => {
                    dotEls.current[i] = el;
                  }}
                  cx={l.x2}
                  cy={l.y2}
                  r="3.4"
                  fill={hovered === node.id ? "#DA2B1D" : "#B42810"}
                  stroke="rgba(255,255,255,0.9)"
                  strokeWidth="1"
                  className={isVisible ? "animate-node-pulse" : undefined}
                  style={{ animationDelay: `${1.8 + i * 0.45}s` }}
                />
              </g>
            </g>
          );
        })}
      </svg>

      {/* Small white icon markers + quiet labels — real text on the
          same normalized coordinates as the SVG. */}
      <div className="absolute inset-0 z-[7]">
        {orbitNodes.map((node, i) => {
          const item = byId[node.id];
          if (!item) return null;
          return (
            <div
              key={node.id}
              /* Orbit carrier: the rAF engine moves this wrapper along
                 the marker's circle with translate3d only (no React
                 involvement, no rotation — labels stay upright). */
              ref={(el) => {
                orbitEls.current[i] = el;
              }}
              className="absolute"
              style={{
                left: `${(node.x / viewBox.w) * 100}%`,
                top: `${((node.y - chipRadius) / viewBox.h) * 100}%`,
                willChange: "transform, opacity",
              }}
            >
            <div
              /* Top-anchored so the MARKER's centre (not the stack's)
                 sits exactly on the node point the SVG geometry uses.
                 The whole stack is one hover/focus group, keyboard
                 reachable, with the destination as its accessible name. */
              role="group"
              tabIndex={0}
              aria-label={`${item.label} — ${item.minutes} minutes away`}
              onMouseEnter={() => {
                hoveredRef.current = true;
                setHovered(node.id);
              }}
              onMouseLeave={() => {
                hoveredRef.current = false;
                setHovered(null);
              }}
              onFocus={() => {
                hoveredRef.current = true;
                setHovered(node.id);
              }}
              onBlur={() => {
                hoveredRef.current = false;
                setHovered(null);
              }}
              className="group pointer-events-auto flex -translate-x-1/2 flex-col items-center transition-all duration-700 ease-out"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible
                  ? "translateX(-50%) translateY(0)"
                  : "translateX(-50%) translateY(6px)",
                transitionDelay: `${750 + i * 80}ms`,
              }}
            >
              <div className="flex aspect-square w-[3.4vw] items-center justify-center rounded-full bg-white text-[#0B1B33] shadow-[0_5px_16px_rgba(0,0,0,0.22)] transition-[translate,box-shadow] duration-300 ease-out group-hover:-translate-y-[3px] group-hover:shadow-[0_10px_24px_rgba(0,0,0,0.3)] group-focus-visible:-translate-y-[3px]">
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
                className={`mt-[0.5vw] text-center text-[clamp(0.6875rem,1.05vw,1.0625rem)] leading-tight font-bold tracking-[0.02em] text-white/95 uppercase transition-colors duration-300 group-hover:text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.75),0_2px_8px_rgba(0,0,0,0.35)] ${
                  item.label.length > 22 ? "max-w-[12vw]" : "whitespace-nowrap"
                }`}
              >
                {item.label}
              </span>
              <span className="mt-0.5 font-display text-[clamp(0.75rem,1.15vw,1.125rem)] font-bold text-[#DA2B1D] transition-colors duration-300 group-hover:text-[#ff3a28] [text-shadow:0_1px_3px_rgba(0,0,0,0.55)]">
                {item.minutes}
                <span className="pl-0.5 text-[0.72em] font-semibold opacity-80">MIN</span>
              </span>
            </div>
            </div>
          );
        })}
      </div>

      {/* Information box, lower left (lg+): three approved highlight
          rows on a restrained translucent card. Mobile gets these rows
          in its own flow block below the image instead. */}
      <div
        className="absolute bottom-[15%] left-[3%] z-[8] hidden transition-all duration-700 ease-out lg:block"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(12px)",
          transitionDelay: "1250ms",
        }}
      >
        <LocationHighlightRows className="w-[clamp(15rem,18.5vw,19rem)] rounded-2xl border border-white/50 bg-white/85 px-5 py-1 shadow-[0_8px_30px_rgba(0,0,0,0.15)] backdrop-blur-[10px] [&_li]:gap-3 [&_li]:py-2.5 [&_li_span:first-child]:h-4 [&_li_span:first-child]:w-4 [&_li_span:last-child]:text-[0.6875rem]" />
      </div>
    </div>
  );
}

/**
 * The three approved highlight rows — used by the desktop information
 * box above and by the mobile flow block in Location.tsx.
 */
export function LocationHighlightRows({ className = "" }: { className?: string }) {
  return (
    <ul className={className}>
      {locationHighlights.map((h, i) => (
        <li
          key={h.id}
          className={`flex items-center gap-3.5 py-3.5 ${
            i > 0 ? "border-t border-[#0B1B33]/10" : ""
          }`}
        >
          <span className="h-5 w-5 shrink-0 text-brand">{highlightIcons[h.id]}</span>
          <span className="text-[0.8125rem] font-semibold tracking-[0.05em] text-[#0B1B33] uppercase">
            {h.label}
          </span>
        </li>
      ))}
    </ul>
  );
}
