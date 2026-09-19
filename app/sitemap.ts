import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://commview-green.vercel.app";

// Phase 0 baseline. Phase 1 generates entries from Sanity so a published post
// appears within seconds of the revalidate webhook firing.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
