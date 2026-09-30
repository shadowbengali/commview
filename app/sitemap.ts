import type { MetadataRoute } from "next";

import { allPages } from "@/lib/content/pages";
import { getAllPostSlugs } from "@/lib/sanity/queries";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.commview.co.uk";

// Generated at build time from the real, built pages: the static app routes, the
// content-driven pillar/service pages, the four Insights categories and every
// published Insights post. Excludes /studio, /api, the interactive diagnostic
// runner and the gated result pages. Rebuilds on each deploy (and whenever the
// Sanity revalidate webhook triggers a build).

// Bespoke top-level pages that aren't content-driven and aren't gated.
const STATIC_PATHS = [
  "/",
  "/what-we-do",
  "/how-we-work",
  "/work",
  "/about",
  "/agencies",
  "/gtm-leadership",
  "/contact",
  "/diagnostic",
  "/insights",
  "/growth/outbound-lead-generation",
  "/privacy",
  "/terms",
  "/cookies",
];

const CATEGORY_SLUGS = ["gtm-leadership", "growth", "product", "operational-ai"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const seen = new Set<string>();
  const entries: MetadataRoute.Sitemap = [];
  const add = (path: string, lastModified: Date = now, priority?: number) => {
    const url = `${siteUrl}${path === "/" ? "/" : path}`;
    if (seen.has(url)) return;
    seen.add(url);
    entries.push({ url, lastModified, ...(priority !== undefined ? { priority } : {}) });
  };

  add("/", now, 1);
  for (const p of STATIC_PATHS) if (p !== "/") add(p);

  // Content-driven pillar + service pages.
  for (const page of allPages()) add(`/${page.slug}`);

  // Insights categories.
  for (const c of CATEGORY_SLUGS) add(`/insights/category/${c}`);

  // Published Insights posts.
  const posts = await getAllPostSlugs();
  for (const post of posts) {
    add(`/insights/${post.slug}`, post.updated ? new Date(post.updated) : now);
  }

  return entries;
}
