import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Keep serverless function bundles small (Vercel Hobby counts every
  // retained deployment's function size against a 10 GB quota). The OG /
  // Twitter image routes read `public/media/brand` and `public/media/
  // journal` with fs, which makes the tracer pull in all of `public/`;
  // everything else under it is served statically and never read by a
  // function. Sharp is only used by Next's built-in image optimiser, which
  // Vercel replaces with its own image service, so none of its binaries
  // are needed inside a function there (local `next start` still has it).
  outputFileTracingExcludes: {
    "*": [
      "./public/media/brochure/**",
      "./public/media/location/**",
      "./public/media/posters/**",
      "./public/media/people/**",
      "./public/*.mp4",
      "./public/*.webm",
      "./node_modules/sharp/**",
      "./node_modules/@img/**",
    ],
  },
  turbopack: {
    root: process.cwd(),
  },
  images: {
    // Local placeholder assets are SVG until final photography/renders are
    // supplied; these are trusted, repo-owned files, not user uploads.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "script-src 'none'; frame-src 'none'; sandbox;",
  },
  // Paths that existed on the previous yamunaskycity.com (a WordPress
  // single-pager whose menu pointed here) — sent to the matching part of
  // this site rather than a 404. Nothing else on the old site was public.
  async redirects() {
    return [
      { source: "/brochure", destination: "/#contact", permanent: true },
      { source: "/amenities", destination: "/#project", permanent: true },
      { source: "/contact-me", destination: "/#contact", permanent: true },
      // Journal articles retired when the Journal was rebuilt from the
      // Yamuna Homes and Design blog (Sept 2026). Each old slug goes to
      // the article that now covers the same ground.
      { source: "/blog/a-guide-to-buying-a-luxury-apartment-in-mangalore", destination: "/blog/best-localities-in-mangalore-for-apartment-living", permanent: true },
      { source: "/blog/what-should-you-look-for-when-choosing-a-luxury-apartment", destination: "/blog/inside-yamuna-sky-city-lifestyle-location-and-luxury", permanent: true },
      { source: "/blog/a-practical-guide-for-nris-buying-property-in-mangalore", destination: "/blog/yamuna-sky-city-debuts-at-the-india-property-show-in-dubai", permanent: true },
      { source: "/blog/kulai-and-new-mangalore-understanding-the-areas-growing-connectivity", destination: "/blog/how-mangalore-infrastructure-is-changing-where-people-live", permanent: true },
      { source: "/blog/why-mangalore-is-emerging-as-a-premium-coastal-real-estate-destination", destination: "/blog/the-new-face-of-mangalore-real-estate", permanent: true },
      { source: "/blog/why-sea-facing-homes-continue-to-attract-luxury-homebuyers", destination: "/blog/living-between-the-city-and-the-sea", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            // Safe to send unconditionally: browsers ignore it over http,
            // so local dev is unaffected.
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains",
          },
          {
            // Isolates the window from cross-origin openers while still
            // allowing the site's own new-tab links (WhatsApp, 3D
            // experience, brochure) to open normally.
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
        ],
      },
      {
        // Repo-owned media (video, artwork, brand marks). Not content-
        // hashed, so a bounded browser cache with background revalidation
        // rather than "immutable" — replacing a file under the same path
        // (as has happened with the location artwork) propagates within a
        // day while repeat visits stay fast.
        source: "/media/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
