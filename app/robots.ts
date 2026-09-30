import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.commview.co.uk";

// Public site open to search engines and AI answer engines; only the private
// surfaces (Studio, API, gated diagnostic results) are blocked.
const DISALLOW = ["/studio", "/api", "/diagnostic/result"];

// AI answer-engine / crawler user-agents we explicitly welcome (AEO).
const AI_BOTS = [
  "GPTBot", // OpenAI crawler (training)
  "OAI-SearchBot", // ChatGPT search
  "ChatGPT-User", // ChatGPT user-initiated browsing
  "PerplexityBot", // Perplexity crawler
  "Perplexity-User", // Perplexity user-initiated fetch
  "Google-Extended", // Gemini / Vertex AI
  "ClaudeBot", // Anthropic crawler
  "Claude-User", // Claude user-initiated browsing
  "anthropic-ai", // Anthropic (legacy token)
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      { userAgent: AI_BOTS, allow: "/", disallow: DISALLOW },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
