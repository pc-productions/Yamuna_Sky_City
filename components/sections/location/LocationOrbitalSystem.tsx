import { viewBox, center, rings } from "@/components/sections/location/config";

/** Ring opacities, innermost → outermost. Thin, elegant, semi-transparent. */
const RING_OPACITY = [0.9, 0.72, 0.55];

/**
 * Layer 2 — the orbital rings around the tower. Pure SVG, centred on
 * the tower anchor from content/location.ts. The rings do NOT rotate;
 * GSAP materializes them one-by-one (opacity + scale with a subtle
 * overshoot) during the entrance sequence, then they rest.
 */
export function LocationOrbitalSystem() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      viewBox={`0 0 ${viewBox.w} ${viewBox.h}`}
      preserveAspectRatio="none"
    >
      {rings.map((r, i) => (
        <circle
          key={r}
          data-loc-ring=""
          cx={center.x}
          cy={center.y}
          r={r}
          fill="none"
          stroke={`rgba(255,255,255,${RING_OPACITY[i] ?? 0.25})`}
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
