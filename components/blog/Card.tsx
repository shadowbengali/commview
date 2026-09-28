import type { CSSProperties } from "react";

import type { CapabilityColour, PostCard } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";

// Shared Insight article card — the same markup and blog.css classes the /insights
// index uses, so the category archives are a true drill-down, not a second design.

export const COLOUR: Record<CapabilityColour, string> = {
  cyan: "var(--brand-cyan)",
  green: "var(--accent-green)",
  blue: "var(--brand-blue)",
  pink: "var(--accent-pink)",
};

export const cvar = (c: string): CSSProperties => ({ ["--c" as string]: c }) as CSSProperties;

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));
}
function isoDate(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
}

export function TopicChip({ colour, title }: { colour: string; title: string }) {
  return (
    <p className="topic" style={cvar(colour)}>
      <i aria-hidden="true"></i>
      <span>{title}</span>
    </p>
  );
}

function CardMedia({ post, colour }: { post: PostCard; colour: string }) {
  const href = `/insights/${post.slug}`;
  return (
    <a className="card__media" href={href} tabIndex={-1} aria-hidden="true">
      {post.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={urlFor(post.coverImage).width(800).height(500).fit("crop").url()} alt="" />
      ) : (
        <svg viewBox="0 0 400 250" preserveAspectRatio="none" aria-hidden="true">
          <path d="M262 -10 L318 -10 L188 260 L132 260 Z" fill={colour} fillOpacity=".16" />
          <path d="M336 -10 L352 -10 L222 260 L206 260 Z" fill={colour} fillOpacity=".38" />
        </svg>
      )}
    </a>
  );
}

export function Card({ post }: { post: PostCard }) {
  const colour = post.category ? COLOUR[post.category.colour] : "var(--slate)";
  const href = `/insights/${post.slug}`;
  return (
    <article className="card" style={cvar(colour)}>
      <CardMedia post={post} colour={colour} />
      <div className="card__body">
        {post.category ? <TopicChip colour={colour} title={post.category.title} /> : null}
        <h3 className="card__h">
          <a href={href}>{post.title}</a>
        </h3>
        <p className="card__stand">{post.standfirst}</p>
        <p className="card__meta meta">
          <time dateTime={isoDate(post.publishedAt)}>{formatDate(post.publishedAt)}</time>
          <i aria-hidden="true">·</i>
          <span>{Math.max(post.readTime || 0, 1)} min read</span>
        </p>
      </div>
    </article>
  );
}
