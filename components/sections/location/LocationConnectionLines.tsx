import { viewBox, nodes, connectionFor, DOT_R } from "@/components/sections/location/config";

/**
 * Layer 3 — dotted connection lines from the orbital core out to each
 * location bubble, with a small red connection point at the bubble rim.
 *
 * Draw-on animation: each dotted line is revealed through a mask whose
 * solid line (normalized with pathLength=1) GSAP animates from
 * stroke-dashoffset 1 → 0 — animating the dotted line's own dashoffset
 * would march the dots instead of drawing them. In the resting markup
 * the masks are fully open, so no-JS and reduced-motion visitors see
 * the finished composition.
 */
export function LocationConnectionLines() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      viewBox={`0 0 ${viewBox.w} ${viewBox.h}`}
      preserveAspectRatio="none"
    >
      <defs>
        {nodes.map((node, i) => {
          const { line } = connectionFor(node);
          return (
            <mask key={node.id} id={`loc-line-mask-${i}`} maskUnits="userSpaceOnUse">
              <line
                {...line}
                data-loc-linemask=""
                pathLength={1}
                stroke="#fff"
                strokeWidth="8"
                strokeDasharray="1"
                strokeDashoffset="0"
              />
            </mask>
          );
        })}
      </defs>
      {nodes.map((node, i) => {
        const { line, dot } = connectionFor(node);
        return (
          <g key={node.id}>
            <line
              {...line}
              mask={`url(#loc-line-mask-${i})`}
              stroke="rgba(255,255,255,0.75)"
              strokeWidth="1"
              strokeDasharray="3 5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            <circle
              data-loc-dot=""
              className="loc-dot"
              cx={dot.cx}
              cy={dot.cy}
              r={DOT_R}
              fill="#b42810"
              stroke="rgba(255,255,255,0.9)"
              strokeWidth="1"
              style={{ animationDelay: `${(i * 0.55) % 3.6}s` }}
            />
          </g>
        );
      })}
    </svg>
  );
}
