import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
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
