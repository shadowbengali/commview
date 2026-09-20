import type { MetadataRoute } from "next";

// TEMPORARY — pre-launch. Block every crawler/indexer (Google, Bing/Meta,
// GPTBot, ClaudeBot, PerplexityBot, etc.) until the site is ready to index.
// To go live: restore `allow: "/"` with the /studio,/api,/diagnostic/result
// disallows and the sitemap line (see git history), and lift the noindex in
// app/layout.tsx + the X-Robots-Tag header in next.config.ts.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
  };
}
