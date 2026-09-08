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
  /** Optional lighter variant for narrow viewports (≤ 1023px); falls back to `src`. */
  mobileSrc?: string;
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

/**
 * Hero film on Cloudinary. The upload is the 4K master; visitors never
 * receive it directly — Cloudinary derives the delivered file on the fly
 * from the transformation in the URL, and caches it on its CDN:
 *   q_auto   — automatic quality (smaller file, no visible loss)
 *   w_1920   — scaled to 1080p for desktops
 *   w_1280   — scaled to 720p-class for phones and tablets
 * To change the film, upload the new master and replace HERO_FILM.
 * NOTE: a derived variant is generated on its first request, which for a
 * 4K source can take a while — open both URLs once in a browser after
 * any change so the encodes exist before visitors arrive.
 */
const CLOUDINARY_VIDEO = "https://res.cloudinary.com/brojss75/video/upload";
const HERO_FILM = "v1788895838/Yamuna_Sky_City.mp4";

export const heroVideo: VideoSource = {
  // Supplied hero film (12s loop, 16:9), served from Cloudinary rather
  // than from the deploy: the film is the heaviest asset on the site, and
  // hosting it on the media CDN keeps it (and its bandwidth) off Vercel.
  // The poster stays local — it is small and must paint before the film.
  src: `${CLOUDINARY_VIDEO}/q_auto,w_1920/${HERO_FILM}`,
  mobileSrc: `${CLOUDINARY_VIDEO}/q_auto,w_1280/${HERO_FILM}`,
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
