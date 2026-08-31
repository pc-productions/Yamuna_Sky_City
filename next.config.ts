import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
};

export default nextConfig;
