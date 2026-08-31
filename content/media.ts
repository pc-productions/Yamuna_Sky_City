/**
 * Centralized media configuration.
 *
 * No final video/photography assets have been supplied yet. `src` fields
 * are left `undefined` where real footage is required — every media
 * component treats a missing `src` as an expected state and renders its
 * poster/fallback gracefully rather than a broken request. Fill these in
 * as production assets arrive; no component code needs to change.
 */

export type VideoSource = {
  /** MP4 (H.264) path under /public/media/video. Undefined = poster/fallback only. */
  src?: string;
  /** Optional WebM (VP9) variant — preferred by browsers that support it. */
  webmSrc?: string;
  poster: string;
  /** object-position per breakpoint, so embedded video framing/text is never cropped. */
  objectPosition?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  };
};

export const introVideo: VideoSource = {
  src: undefined, // TODO: ~20–30s cinematic amenities/lifestyle film (mp4, h264).
  poster: "/media/posters/intro-poster.svg",
};

/** Only used while `introVideo.src` is unset, to drive the progress indicator. */
export const introFallbackDurationMs = 6000;

/**
 * How often the cinematic intro plays, on every device (desktop and
 * mobile behave identically):
 *  - "always":            every full page load.
 *  - "once-per-session":  first load only; repeat visits in the same
 *                         browser session go straight to the hero.
 * Visitors with the OS-level "reduce motion" preference always skip the
 * intro regardless of this setting.
 */
export const introFrequency: "always" | "once-per-session" = "once-per-session";

export const heroVideo: VideoSource = {
  // Supplied hero film (12s loop, 16:9). Optimized from the 4K master to
  // 1080p30 h264, muted, faststart. Poster is the film's first frame so
  // playback starts without a visual jump.
  src: "/media/video/hero-1080.mp4",
  webmSrc: "/media/video/hero-1080.webm",
  poster: "/media/posters/hero-poster.jpg",
  // The film's embedded titles sit around the tower at frame center, so
  // every breakpoint keeps center framing. On narrow portrait screens a
  // 16:9 crop trims the flanking words — if that matters, supply a
  // portrait cut and branch on `src` here; the component already accepts
  // per-breakpoint positioning.
  objectPosition: {
    mobile: "center",
    tablet: "center",
    desktop: "center",
  },
};

export const locationImage = {
  // Approved "Perfectly Connected" artwork (client-supplied, 1600×900).
  src: "/media/location/perfectly-connected.jpg",
  alt: "Perfectly Connected — Yamuna Sky City at the center of an aerial seaside view, with travel times to the beach (2 min), National Highway 66 (5 min), International School (6 min), A. J. Hospital (7 min), City Mall (8 min), City Centre (15 min) and Mangalore International Airport (20 min)",
  /** Aspect ratio of the artwork — keeps loading stable across swaps. */
  aspect: "16 / 9",
};

export const privateViewingBackground = {
  src: "/media/posters/private-viewing-bg.svg", // TODO: replace with a project render / cinematic still.
  alt: "",
};

export const explore3dPreview = {
  src: "/media/posters/explore-3d-preview.jpg",
  alt: "Aerial 3D location and master plan overview for Yamuna Sky City",
};
