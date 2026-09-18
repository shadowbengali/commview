import type { CSSProperties } from "react";
import type { Metadata } from "next";

import { getBlogIndex } from "@/lib/sanity/queries";
import type { CapabilityColour, PostCard, Topic } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { subscribe } from "./actions";
import "../../../styles/blog.css";

// The blog index ("Insight"). Post data (featured, latest, topics) is read from
// Sanity; empty states show honest gaps until content is published in /studio.
//
// TODO: the editorial chrome below (hero heading + lede, "Latest", topics
// heading, closing CTA and subscribe copy) is placeholder drafted in the mock —
// approve or rewrite before launch. It is NOT invented; it is the mock's draft.

export const metadata: Metadata = {
  title: "Insight",
  description:
    "Field notes from the work — what we see inside scale-ups, what it usually turns out to be, and what we would do about it.",
  alternates: { canonical: "/blog" },
};

const COLOUR: Record<CapabilityColour, string> = {
  cyan: "var(--brand-cyan)",
  green: "var(--accent-green)",
  blue: "var(--brand-blue)",
  pink: "var(--accent-pink)",
};

const cvar = (c: string): CSSProperties => ({ ["--c" as string]: c }) as CSSProperties;

function formatDate(iso: string): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

function isoDate(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
}

function TopicChip({ colour, title }: { colour: string; title: string }) {
  return (
    <p className="topic" style={cvar(colour)}>
      <i aria-hidden="true"></i>
      <span>{title}</span>
    </p>
  );
}

function CardMedia({ post, colour }: { post: PostCard; colour: string }) {
  const href = `/blog/${post.slug}`;
  return (
    <a className="card__media" href={href} tabIndex={-1} aria-hidden="true">
      {post.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={urlFor(post.coverImage).width(800).height(500).fit("crop").url()}
          alt=""
        />
      ) : (
        <svg viewBox="0 0 400 250" preserveAspectRatio="none" aria-hidden="true">
          <path d="M262 -10 L318 -10 L188 260 L132 260 Z" fill={colour} fillOpacity=".16" />
          <path d="M336 -10 L352 -10 L222 260 L206 260 Z" fill={colour} fillOpacity=".38" />
        </svg>
      )}
    </a>
  );
}

function Card({ post }: { post: PostCard }) {
  const colour = post.category ? COLOUR[post.category.colour] : "var(--slate)";
  const href = `/blog/${post.slug}`;
  return (
    <article className="card" style={cvar(colour)}>
      <CardMedia post={post} colour={colour} />
      <div className="card__body">
        {post.category ? (
          <TopicChip colour={colour} title={post.category.title} />
        ) : null}
        <h3 className="card__h">
          <a href={href}>{post.title}</a>
        </h3>
        <p className="card__stand">{post.standfirst}</p>
        <p className="card__meta meta">
          <time dateTime={isoDate(post.publishedAt)}>
            {formatDate(post.publishedAt)}
          </time>
          <i aria-hidden="true">·</i>
          <span>{Math.max(post.readTime || 0, 1)} min read</span>
        </p>
      </div>
    </article>
  );
}

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ subscribed?: string }>;
}) {
  const { subscribed } = await searchParams;
  const { featured, latest, topics } = await getBlogIndex();
  const hasTopics = topics.some((t) => t.count > 0) || topics.length > 0;

  return (
    <main id="main">
      {/* ============ HERO ============ */}
      <section className="bhero dark" aria-labelledby="bhero-h">
        <svg
          className="bhero__slash"
          viewBox="0 0 400 800"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M250 -40 L330 -40 L150 840 L70 840 Z" fill="#00e5ff" fillOpacity=".10" />
          <path d="M352 -40 L376 -40 L196 840 L172 840 Z" fill="#5b4df5" fillOpacity=".22" />
        </svg>
        <div className="wrap bhero__grid">
          <div>
            <p className="eyebrow-x">Insight</p>
            {/* TODO: placeholder hero copy (mock draft) — approve or rewrite. */}
            <h1 className="bhero__h1" id="bhero-h">
              Answers we keep
              <br />
              having to <em>find</em> twice.
            </h1>
            <p className="bhero__lede">
              Field notes from the work — what we see inside scale-ups, what it
              usually turns out to be, and what we would do about it. Written by
              the people doing it, not a content team.
            </p>
          </div>
          {hasTopics ? (
            <div className="bhero__rail">
              <p className="eyebrow-x">Browse by topic</p>
              <ul className="bhero__list">
                {topics.map((t) => (
                  <li key={t.slug} style={cvar(COLOUR[t.colour])}>
                    <a href={`/blog/topic/${t.slug}`}>
                      <span>
                        <i aria-hidden="true"></i>
                        <b>{t.title}</b>
                        <u>{pieces(t.count)}</u>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>

      {/* ============ FEATURED ============ */}
      {featured ? (
        <section className="feat" aria-labelledby="feat-h">
          <div className="wrap feat__grid">
            <div>
              <div className="feat__top">
                <span className="tag">Featured</span>
                {featured.category ? (
                  <span className="topic" style={cvar(COLOUR[featured.category.colour])}>
                    <i aria-hidden="true"></i>
                    <span>{featured.category.title}</span>
                  </span>
                ) : null}
              </div>
              <h2 className="feat__h" id="feat-h">
                <a href={`/blog/${featured.slug}`}>{featured.title}</a>
              </h2>
              <p className="feat__stand">{featured.standfirst}</p>
              <div className="feat__foot">
                <p className="meta">
                  {featured.author ? <span>{featured.author.name}</span> : null}
                  {featured.author ? <i aria-hidden="true">·</i> : null}
                  <time dateTime={isoDate(featured.publishedAt)}>
                    {formatDate(featured.publishedAt)}
                  </time>
                  <i aria-hidden="true">·</i>
                  <span>{Math.max(featured.readTime || 0, 1)} min read</span>
                </p>
                <a className="btn btn--ink" href={`/blog/${featured.slug}`}>
                  Read the piece
                </a>
              </div>
            </div>
            <div className="feat__media">
              {featured.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={urlFor(featured.coverImage).width(1000).height(750).fit("crop").url()}
                  alt={featured.coverImage.alt || ""}
                />
              ) : (
                <div className="slab slab--momentum">
                  <svg viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M262 -20 L322 -20 L198 320 L138 320 Z" fill="#0b0f14" fillOpacity=".72" />
                    <path d="M340 -20 L356 -20 L232 320 L216 320 Z" fill="#f8fafc" fillOpacity=".16" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </section>
      ) : null}

      {/* ============ LATEST ============ */}
      <section className="latest" aria-labelledby="latest-h">
        <div className="wrap">
          <div className="sechead">
            <h2 id="latest-h">Latest</h2>
            <a href="/blog">See everything</a>
          </div>
          {latest.length > 0 ? (
            <div className="cards">
              {latest.map((post) => (
                <Card key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <p className="body dim" style={{ paddingBlock: "var(--space-12)" }}>
              {/* Honest empty state — no fabricated posts. */}
              TODO: No posts published yet. Create posts in{" "}
              <a href="/studio" style={{ color: "var(--brand-cyan)" }}>
                /studio
              </a>{" "}
              and they will appear here.
            </p>
          )}
        </div>
      </section>

      {/* ============ TOPICS ============ */}
      {topics.length > 0 ? (
        <section className="topics" aria-labelledby="topics-h">
          <div className="wrap">
            <div className="sechead">
              <h2 id="topics-h">Four disciplines. One view.</h2>
            </div>
            <div className="topics__grid">
              {topics.map((t) => (
                <a
                  key={t.slug}
                  className="tile"
                  style={cvar(COLOUR[t.colour])}
                  href={`/blog/topic/${t.slug}`}
                >
                  <b>{t.title}</b>
                  {/* TODO: topic descriptions are mock drafts — approve or rewrite. */}
                  <span>{t.description || "TODO: topic description"}</span>
                  <u>{pieces(t.count)}</u>
                </a>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ============ CLOSING: CTA + SUBSCRIBE ============ */}
      <section className="close dark" aria-labelledby="close-h">
        <div className="wrap close__grid">
          <div>
            {/* TODO: placeholder closing copy (mock draft) — approve or rewrite. */}
            <h2 className="close__h" id="close-h">
              Reading about it only gets you so far.
            </h2>
            <p className="close__p">
              If something here sounds like your business, bring us the question.
              We will tell you what we think is actually going on.
            </p>
            <div className="close__row">
              <a className="btn btn--cyan btn--lg" href="/contact">
                Talk to us
              </a>
              <a className="btn btn--ghost btn--lg" href="/diagnostic">
                Take the diagnostic
              </a>
            </div>
          </div>
          <div className="sub">
            <h2 className="sub__h" id="sub-h">One piece a month. Nothing else.</h2>
            <p className="sub__p">
              What we saw, what we changed and whether it worked. No newsletter
              series, no drip sequence.
            </p>
            {subscribed ? (
              <p className="sub__note" style={{ color: "var(--brand-cyan)" }}>
                Thanks — you&apos;re on the list.
              </p>
            ) : (
              <form className="sub__form" action={subscribe}>
                <label className="sub__field">
                  <span className="sr">Work email</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@company.com"
                    autoComplete="email"
                    required
                  />
                </label>
                <button className="btn btn--cyan" type="submit">
                  Subscribe
                </button>
              </form>
            )}
            <p className="sub__note">
              Unsubscribe in one click. We do not share your address.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function pieces(n: number): string {
  return `${n} ${n === 1 ? "piece" : "pieces"}`;
}
