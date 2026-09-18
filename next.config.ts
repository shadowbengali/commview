import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // British English, strict typing — build fails on type or lint errors.
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },
  images: {
    // Sanity's image CDN is the only remote source.
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  // Section decision: visible label "Insight", canonical URLs live under /blog.
  // No /insight redirect is needed — nothing was ever indexed at /insight.
};

export default nextConfig;
