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
  /** Path under /public/media/video. Undefined = poster/fallback only. */
  src?: string;
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

export const heroVideo: VideoSource = {
  src: undefined, // TODO: 5–6s looping hero film, already contains on-screen text.
  poster: "/media/posters/hero-poster.svg",
  objectPosition: {
    mobile: "center 30%",
    tablet: "center 40%",
    desktop: "center",
  },
};

export const locationImage = {
  // TODO: replace with the final exported "Perfectly Connected" artwork
  // (landscape). The placeholder mirrors its composition and data.
  src: "/media/location/connectivity-diagram.svg",
  alt: "Connectivity diagram showing Yamuna Sky City at the center with travel times to the beach, National Highway 66, International School, A. J. Hospital, City Mall, City Centre and Mangalore International Airport",
  /** Aspect ratio of the artwork — keeps loading stable across swaps. */
  aspect: "16 / 9",
};

export const privateViewingBackground = {
  src: "/media/posters/private-viewing-bg.svg", // TODO: replace with a project render / cinematic still.
  alt: "",
};

export const explore3dPreview = {
  src: "/media/posters/explore-3d-preview.svg", // TODO: replace with a screenshot of the 3D experience.
  alt: "Preview of the immersive 3D location experience for Yamuna Sky City",
};
