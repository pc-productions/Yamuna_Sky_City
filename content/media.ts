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
  /**
   * MP4 (H.264) source: an absolute URL on the media CDN (Cloudinary) or a
   * path under /public. Undefined = poster/fallback only.
   */
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
  // Supplied hero film (12s loop, 16:9), served from Cloudinary rather
  // than from the deploy: the film is the heaviest asset on the site, and
  // hosting it on the media CDN keeps it (and its bandwidth) off Vercel.
  // The poster stays local — it is small and must paint before the film.
  // Swap the film by replacing this URL; nothing else changes.
  src: "https://res.cloudinary.com/brojss75/video/upload/v1788895838/Yamuna_Sky_City.mp4",
  poster: "/media/posters/hero-poster.jpg",
  // The film's embedded titles sit around the tower at frame center, so
  // every breakpoint keeps center framing. On narrow portrait screens a
  // 16:9 crop trims the flanking words — if that matters, supply a
  // portrait cut and branch on `src` here; the component already accepts
  // per-breakpoint positioning.
  objectPosition: {
    mobile: "center top",
    tablet: "center top",
    desktop: "center top",
  },
};

// Kept for the upcoming Location section rebuild — the assets remain in
// /public/media/location and the approved data in content/location.ts.
export const locationImage = {
  // Clean aerial render (client-supplied, 1672×941) with no text baked
  // into the asset — overlay content is meant to render programmatically.
  src: "/media/location/tower-aerial.jpg",
  mobileSrc: "/media/location/mbl_loc_img.png",
  alt: "Aerial view of the Yamuna Sky City tower rising from coastal greenery, with National Highway 66 and a river bridge to the right and the Arabian Sea beach in the foreground",
  /** Aspect ratio of the artwork — keeps loading stable across swaps.
      Must match the asset's true ratio, and connectivityMap.viewBox in
      content/location.ts must follow it, or overlay markers drift. */
  aspect: "1672 / 941",
  mobileAspect: "1448 / 1086",
};

export const explore3dPreview = {
  src: "/media/posters/explore-3d-preview.jpg",
  alt: "Aerial 3D location and master plan overview for Yamuna Sky City",
};
