import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Strict typing is the build-time safety net. ESLint is not wired up in
  // Phase 1; verification is Playwright + tsc. (Add eslint-config-next later.)
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: true },
  images: {
    // Sanity's image CDN is the only remote source.
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  // TEMPORARY — pre-launch: X-Robots-Tag on every response blocks indexers even
  // if they ignore the meta tag. Remove this headers() block to allow indexing.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },

  // Section decision: visible label "Insight", canonical URLs live under
  // /insights (SEO plan). /blog was live briefly, so 301 it across.
  async redirects() {
    return [
      { source: "/blog", destination: "/insights", permanent: true },
      {
        source: "/blog/topic/:slug",
        destination: "/insights/category/:slug",
        permanent: true,
      },
      { source: "/blog/:slug*", destination: "/insights/:slug*", permanent: true },
    ];
  },
};

export default nextConfig;
