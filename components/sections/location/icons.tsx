import type { ReactNode } from "react";
import {
  FirstAid,
  Handbag,
  GraduationCap,
  Buildings,
  AirplaneTilt,
} from "@phosphor-icons/react";
import type { ConnectivityId } from "@/content/location";
import type { locationHighlights } from "@/content/location";

/*
 * Location node icons — Phosphor (@phosphor-icons/react), matched
 * icon-for-icon against the approved "Perfectly Connected" artwork:
 * line weights for beach/road/bag/cap/cross, FILL weights for the
 * plane and the city buildings, exactly as the artwork mixes them.
 * All inherit currentColor from the bubble. The beach motif (sun over
 * waves) is a composite the libraries don't ship as one icon, drawn to
 * Phosphor's visual weight.
 */
const iconClass = "h-1/2 w-1/2";

/* Straight-on road (two converging edges + dashed centre line) — the
   artwork's exact motif; Phosphor only ships a horizon variant. */
const RoadIcon = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    aria-hidden="true"
    className={iconClass}
  >
    <path d="M8.2 3.5 5.2 20.5M15.8 3.5l3 17" />
    <path d="M12 4.5v3M12 10.7v3M12 16.9v3" />
  </svg>
);

const BeachIcon = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    aria-hidden="true"
    className={iconClass}
  >
    <circle cx="12" cy="7" r="2.7" />
    <path d="M12 1.8v1.6M8.3 3.3l1.1 1.1M15.7 3.3l-1.1 1.1M6.8 7h1.6M15.6 7h1.6" />
    <path d="M3 14.6c1.5-1.5 3-1.5 4.5 0s3 1.5 4.5 0 3-1.5 4.5 0 3 1.5 4.5 0" />
    <path d="M3 19.2c1.5-1.5 3-1.5 4.5 0s3 1.5 4.5 0 3-1.5 4.5 0 3 1.5 4.5 0" />
  </svg>
);

export const nodeIcons: Record<ConnectivityId, ReactNode> = {
  beach: BeachIcon,
  nh66: RoadIcon,
  mall: <Handbag weight="regular" className={iconClass} />,
  school: <GraduationCap weight="regular" className={iconClass} />,
  hospital: <FirstAid weight="regular" className={iconClass} />,
  cityCentre: <Buildings weight="fill" className={iconClass} />,
  airport: <AirplaneTilt weight="fill" className={iconClass} />,
};

/** Legend icons for the feature card (waves / pin / sparkle). */
export const highlightIcons: Record<(typeof locationHighlights)[number]["id"], ReactNode> = {
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

/**
 * The four-point star from the official Yamuna Sky City logomark —
 * traced verbatim from the brand asset's vector silhouette
 * (public/media/brand/mark-primary.png), so it is the exact glyph, not
 * an approximation. Fills with currentColor; size via className.
 */
export function LogoStar({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" fill="currentColor" className={className}>
      <path d="M48.6 0.0L51.0 0.3L52.1 10.4L53.1 12.5L53.1 14.6L53.8 15.3L54.2 17.4L55.2 18.8L55.2 20.1L55.9 20.5L56.2 22.2L56.9 22.6L57.3 24.0L58.0 24.3L58.3 25.7L59.0 26.0L59.4 27.4L61.1 29.2L61.1 29.9L62.2 30.2L63.2 32.3L67.4 36.5L68.1 36.5L69.1 37.8L69.8 37.8L69.8 38.5L70.5 38.5L72.6 40.6L74.0 41.0L74.3 41.7L75.3 41.7L76.0 42.7L77.1 42.7L78.1 43.8L79.9 44.1L80.2 44.8L81.6 44.8L82.6 45.8L84.4 45.8L85.8 46.9L87.8 46.9L88.9 47.6L93.8 47.9L95.1 48.6L99.0 48.6L100.0 49.3L100.0 50.7L99.0 51.7L96.2 51.4L96.2 51.7L92.7 51.7L92.7 52.1L88.9 52.4L86.8 53.5L85.1 53.5L83.3 54.5L81.2 54.9L80.9 55.6L78.8 55.9L78.5 56.6L76.7 56.9L76.4 57.6L75.7 57.6L75.3 58.3L74.0 58.7L73.6 59.4L70.8 60.8L70.1 61.8L69.4 61.8L63.2 67.7L63.2 68.4L61.1 70.1L61.1 70.8L59.4 72.6L59.0 74.0L58.0 74.7L58.0 75.7L56.2 77.8L56.2 78.8L55.2 79.9L55.2 81.2L54.2 82.3L54.2 83.7L53.1 85.1L53.1 87.2L52.1 88.9L52.1 91.7L51.4 92.7L51.0 99.7L49.0 100.0L48.3 99.3L48.3 95.1L47.9 95.1L47.2 88.9L46.2 87.2L46.2 85.1L45.5 84.7L45.1 82.3L44.4 81.6L44.1 79.9L43.4 79.5L43.1 77.8L42.0 76.7L42.0 75.7L40.3 74.0L40.3 72.9L39.2 72.2L39.2 71.5L38.2 70.8L37.2 68.8L35.4 67.4L35.4 66.7L34.4 66.3L34.0 65.3L33.3 65.3L33.3 64.6L32.6 64.6L31.2 62.8L30.6 62.8L29.5 61.5L28.8 61.5L28.1 60.4L26.4 59.7L25.7 58.7L24.7 58.7L24.0 57.6L22.9 57.6L22.6 56.9L20.8 56.6L20.5 55.9L18.8 55.6L17.4 54.5L16.3 54.5L14.6 53.5L12.8 53.5L12.2 52.8L10.4 52.8L10.4 52.4L8.7 52.4L8.7 52.1L6.9 52.1L6.9 51.7L3.5 51.7L3.5 51.4L0.7 51.7L0.0 50.7L0.0 49.0L0.7 48.6L3.8 48.6L3.8 48.3L5.6 48.3L5.6 47.9L8.7 47.9L8.7 47.6L10.4 47.6L11.8 46.9L13.5 46.9L13.5 46.5L14.6 46.5L14.9 45.8L16.7 45.8L17.7 44.8L19.1 44.8L20.1 43.8L21.5 43.8L22.2 42.7L23.3 42.7L23.6 42.0L25.0 41.7L25.3 41.0L26.7 40.6L27.4 39.6L29.2 38.9L33.3 34.7L34.0 34.7L34.4 33.7L35.1 33.7L35.1 33.0L36.8 31.6L36.8 30.9L38.2 29.9L38.2 29.2L40.3 27.1L40.6 25.7L41.3 25.3L42.4 22.9L43.1 22.6L43.4 20.8L44.1 20.5L44.4 18.4L45.1 18.1L45.1 16.3L46.2 15.3L46.5 12.5L47.2 11.5L47.2 9.4L47.6 9.4L47.6 7.6L47.9 7.6L47.9 5.9L48.3 5.9Z" />
    </svg>
  );
}
