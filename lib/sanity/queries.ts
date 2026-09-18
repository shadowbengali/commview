import { groq } from "next-sanity";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { client } from "./client";
import { sanityConfigured } from "./env";

// ---------------------------------------------------------------------------
// Every GROQ query in the app lives here. Nothing else imports the client.
// Phase 0 has one job: prove the pipe from Sanity to a rendered page. Phase 1
// adds the post / category / page queries against the real content model.
// ---------------------------------------------------------------------------

export interface SanityHealth {
  connected: boolean;
  projectConfigured: boolean;
  documentCount: number | null;
}

const healthQuery = groq`count(*[!(_id in path("drafts.**"))])`;

// Returns a snapshot of the connection for the Phase 0 proof page.
export async function fetchSanityHealth(): Promise<SanityHealth> {
  if (!sanityConfigured) {
    return { connected: false, projectConfigured: false, documentCount: null };
  }
  try {
    const documentCount = await client.fetch<number>(healthQuery);
    return { connected: true, projectConfigured: true, documentCount };
  } catch {
    return { connected: false, projectConfigured: true, documentCount: null };
  }
}

// ---------------------------------------------------------------------------
// Blog (Insight) — index route.
// ---------------------------------------------------------------------------

export type CapabilityColour = "cyan" | "green" | "blue" | "pink";

export interface PostCard {
  _id: string;
  title: string;
  slug: string;
  standfirst: string;
  publishedAt: string;
  readTime: number;
  category: { title: string; slug: string; colour: CapabilityColour } | null;
  author: { name: string } | null;
  coverImage: (SanityImageSource & { alt?: string }) | null;
}

export interface Topic {
  title: string;
  slug: string;
  colour: CapabilityColour;
  description: string | null;
  count: number;
}

export interface BlogIndex {
  featured: PostCard | null;
  latest: PostCard[];
  topics: Topic[];
}

// readTime is computed from the body at query time (never stored) — words / 200,
// via plain-text length ÷ 5 chars per word.
const postCardProjection = groq`{
  _id,
  title,
  "slug": slug.current,
  standfirst,
  publishedAt,
  "readTime": round(length(pt::text(body)) / 5 / 200),
  category->{ title, "slug": slug.current, colour },
  author->{ name },
  coverImage
}`;

const blogIndexQuery = groq`{
  "featured": *[_type == "post" && featured == true && !(_id in path("drafts.**"))]
    | order(publishedAt desc)[0] ${postCardProjection},
  "latest": *[_type == "post" && featured != true && !(_id in path("drafts.**"))]
    | order(publishedAt desc)[0...6] ${postCardProjection},
  "topics": *[_type == "category"] | order(order asc){
    title,
    "slug": slug.current,
    colour,
    description,
    "count": count(*[_type == "post" && references(^._id) && !(_id in path("drafts.**"))])
  }
}`;

const EMPTY_INDEX: BlogIndex = { featured: null, latest: [], topics: [] };

// The blog index in one round trip. Returns empties (not an error) when Sanity
// is unconfigured or unreachable, so the route always renders.
export async function getBlogIndex(): Promise<BlogIndex> {
  if (!sanityConfigured) return EMPTY_INDEX;
  try {
    return await client.fetch<BlogIndex>(blogIndexQuery);
  } catch {
    return EMPTY_INDEX;
  }
}
