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

// ---------------------------------------------------------------------------
// Blog — single article route.
// ---------------------------------------------------------------------------

// Portable Text is typed loosely here; the renderer owns the block shapes.
export type PortableBlock = { _type: string; _key: string; [k: string]: unknown };

export interface Faq {
  question: string;
  answer: string;
}

export interface PostFull {
  _id: string;
  title: string;
  slug: string;
  standfirst: string;
  publishedAt: string;
  readTime: number;
  category: { title: string; slug: string; colour: CapabilityColour } | null;
  author: {
    name: string;
    role: string | null;
    initials: string | null;
    bio: string | null;
    linkedIn: string | null;
  } | null;
  coverImage: (SanityImageSource & { alt?: string }) | null;
  body: PortableBlock[] | null;
  takeaways: string[] | null;
  faqs: Faq[] | null;
  tags: { title: string; slug: string }[] | null;
  related: PostCard[];
  seo: { title?: string; description?: string; noIndex?: boolean } | null;
}

const postQuery = groq`*[_type == "post" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
  _id,
  title,
  "slug": slug.current,
  standfirst,
  publishedAt,
  "readTime": round(length(pt::text(body)) / 5 / 200),
  category->{ title, "slug": slug.current, colour },
  author->{ name, role, initials, bio, linkedIn },
  coverImage,
  // Expand inline post references so the body renderer can draw a card.
  body[]{
    ...,
    _type == "postReference" => {
      ...,
      "post": post->{ title, "slug": slug.current }
    }
  },
  takeaways,
  faqs,
  tags[]->{ title, "slug": slug.current },
  // Explicit related posts, else newest three in the same category.
  "related": select(
    count(relatedPosts) > 0 => relatedPosts[]->${postCardProjection},
    *[_type == "post" && _id != ^._id && category._ref == ^.category._ref && !(_id in path("drafts.**"))]
      | order(publishedAt desc)[0...3] ${postCardProjection}
  ),
  seo
}`;

const slugsQuery = groq`*[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))].slug.current`;

// A single post by slug, or null if not found / Sanity unavailable.
export async function getPost(slug: string): Promise<PostFull | null> {
  if (!sanityConfigured) return null;
  try {
    return await client.fetch<PostFull | null>(postQuery, { slug });
  } catch {
    return null;
  }
}

// All published slugs, for generateStaticParams.
export async function getPostSlugs(): Promise<string[]> {
  if (!sanityConfigured) return [];
  try {
    return (await client.fetch<string[]>(slugsQuery)) || [];
  } catch {
    return [];
  }
}
