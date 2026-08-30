import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Local placeholder assets are SVG until final photography/renders are
    // supplied; these are trusted, repo-owned files, not user uploads.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "script-src 'none'; frame-src 'none'; sandbox;",
  },
};

export default nextConfig;
