import type { NextConfig } from "next";
import path from "path";

// GitHub Pages serves this repo at /happy-hounds-web/, so the Pages build
// needs a static export and a base path. The default (Vercel) build stays
// a normal server build so API routes/server actions work once the
// booking system needs them — see README "Deploying".
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
