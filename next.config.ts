import type { NextConfig } from "next";
import path from "path";

// GitHub Pages serves this repo at /happy-hounds-web/, so the Pages build
// needs a static export and a base path. API routes and the booking system
// are excluded from static export (they need Vercel or another Node host).
// The default (Vercel) build stays a normal server build.
const isGithubPagesBuild = process.env.GITHUB_PAGES_BUILD === "true";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  ...(isGithubPagesBuild
    ? {
        output: "export",
        basePath: "/happy-hounds-web",
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
