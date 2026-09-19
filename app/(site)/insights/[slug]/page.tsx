import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPost, getPostSlugs } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { PostBody, extractToc } from "@/components/blog/portable";
import { ArticleProgress } from "@/components/blog/ArticleProgress";
import { COLOUR, cvar, formatDate, isoDate, PostCardView } from "@/components/blog/shared";
import "../../../../styles/article.css";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://commview-green.vercel.app";

export const revalidate = 3600; // hourly ISR until the publish webhook lands.

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Not found" };
  return {
    title: post.seo?.title || post.title,
    description: post.seo?.description || post.standfirst,
    alternates: { canonical: `/insights/${post.slug}` },
    robots: post.seo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.standfirst,
      url: `/insights/${post.slug}`,
      publishedTime: post.publishedAt,
      images: post.coverImage
        ? [urlFor(post.coverImage).width(1200).height(630).fit("crop").url()]
        : undefined,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const colour = post.category ? COLOUR[post.category.colour] : "var(--brand-cyan)";
  const toc = extractToc(post.body);
  const url = `${SITE}/insights/${post.slug}`;
  const initials =
    post.author?.initials ||
    (post.author?.name || "")
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const share = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    x: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post.title)}`,
    email: `mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(url)}`,
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: post.title,
        description: post.standfirst,
        datePublished: post.publishedAt,
        author: post.author ? { "@type": "Person", name: post.author.name } : undefined,
        publisher: { "@id": `${SITE}/#organisation` },
        mainEntityOfPage: url,
        image: post.coverImage ? urlFor(post.coverImage).width(1200).url() : undefined,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "Insight", item: `${SITE}/insights` },
          ...(post.category
            ? [
                {
                  "@type": "ListItem",
                  position: 3,
                  name: post.category.title,
                  item: `${SITE}/insights/category/${post.category.slug}`,
                },
              ]
            : []),
        ],
      },
      ...(post.faqs && post.faqs.length
        ? [
            {
              "@type": "FAQPage",
              mainEntity: post.faqs.map((f) => ({
                "@type": "Question",
                name: f.question,
                acceptedAnswer: { "@type": "Answer", text: f.answer },
              })),
            },
          ]
        : []),
    ],
  };

  const Share = ({ className }: { className?: string }) => (
    <div className={className || "share"}>
      <a href={share.linkedin} aria-label="Share on LinkedIn" rel="noopener" target="_blank">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.05c.53-.95 1.83-1.95 3.76-1.95 4.02 0 4.76 2.5 4.76 5.76V21h-4v-5.2c0-1.24-.02-2.84-1.8-2.84-1.8 0-2.07 1.35-2.07 2.75V21h-4z"/></svg>
      </a>
      <a href={share.x} aria-label="Share on X" rel="noopener" target="_blank">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.3 3h3.3l-7.2 8.2L21.8 21h-6.6l-4.4-5.7L5.7 21H2.4l7.7-8.8L2.6 3h6.8l4 5.3zm-1.2 16h1.8L7.9 4.8H6z"/></svg>
      </a>
      <a href={share.email} aria-label="Share by email">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="2.5" y="4.5" width="19" height="15" rx="2"/><path d="M3 6l9 6.5L21 6"/></svg>
      </a>
      <button type="button" data-copy aria-label="Copy link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M10 13.5a4 4 0 0 0 5.7.3l3-3a4 4 0 0 0-5.7-5.7l-1.2 1.2"/><path d="M14 10.5a4 4 0 0 0-5.7-.3l-3 3a4 4 0 0 0 5.7 5.7l1.2-1.2"/></svg>
      </button>
    </div>
  );

  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="prog" style={cvar(colour)} aria-hidden="true">
        <i id="prog"></i>
      </div>

      <article style={cvar(colour)}>
        <nav className="crumb wrap" aria-label="Breadcrumb">
          <ol>
            <li><a href="/">Home</a></li>
            <li><a href="/insights">Insight</a></li>
            {post.category ? (
              <li>
                <a href={`/insights/category/${post.category.slug}`}>{post.category.title}</a>
              </li>
            ) : null}
            <li aria-current="page">{post.title}</li>
          </ol>
        </nav>

        <header className="ahead wrap">
          {post.category ? (
            <p className="topic" style={cvar(colour)}>
              <i aria-hidden="true"></i>
              <span>{post.category.title}</span>
            </p>
          ) : null}
          <h1>{post.title}</h1>
          <p className="ahead__stand">{post.standfirst}</p>
          <div className="byline">
            <div className="byline__who">
              <span className="avatar" aria-hidden="true">{initials}</span>
              <span className="byline__ident">
                <span className="byline__name">{post.author?.name}</span>
                {post.author?.role ? (
                  <span className="byline__role">{post.author.role}</span>
                ) : null}
              </span>
            </div>
            <p className="meta">
              <time dateTime={isoDate(post.publishedAt)}>{formatDate(post.publishedAt)}</time>
              <i aria-hidden="true">·</i>
              <span>{Math.max(post.readTime || 0, 1)} min read</span>
            </p>
            <Share />
          </div>
          <figure className="ahero">
            {post.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={urlFor(post.coverImage).width(1600).height(686).fit("crop").url()}
                alt={post.coverImage.alt || ""}
              />
            ) : (
              <div className="ahero__slab">
                <svg viewBox="0 0 1200 514" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M700 -20 L840 -20 L560 534 L420 534 Z" fill={colour} fillOpacity=".14" />
                  <path d="M896 -20 L936 -20 L656 534 L616 534 Z" fill={colour} fillOpacity=".36" />
                </svg>
              </div>
            )}
          </figure>
        </header>

        <div className="abody">
          <div className="wrap abody__grid">
            {toc.length > 0 ? (
              <nav className="toc" aria-label="On this page">
                <div className="toc__desk">
                  <p className="toc__h">On this page</p>
                  <ol id="toc">
                    {toc.map((t) => (
                      <li key={t.id}><a href={`#${t.id}`}>{t.text}</a></li>
                    ))}
                  </ol>
                </div>
                <details className="toc__mob">
                  <summary>On this page</summary>
                  <ol id="toc-mob">
                    {toc.map((t) => (
                      <li key={t.id}><a href={`#${t.id}`}>{t.text}</a></li>
                    ))}
                  </ol>
                </details>
              </nav>
            ) : null}

            <div className="prose">
              {post.takeaways && post.takeaways.length ? (
                <aside className="takeaways">
                  <h2>In short</h2>
                  <ul>
                    {post.takeaways.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </aside>
              ) : null}
              <PostBody body={post.body} />
            </div>

            <aside className="rail">
              <p className="rail__h">Share</p>
              <Share />
              <p className="rail__read">Reading progress</p>
              <div className="rail__bar"><i id="prog2"></i></div>
            </aside>

            <div className="afoot">
              {post.faqs && post.faqs.length ? (
                <section className="faq" aria-labelledby="faq-h">
                  <h2 id="faq-h">Questions we get asked about this</h2>
                  <div className="faq__list">
                    {post.faqs.map((f, i) => (
                      <details key={i}>
                        <summary>{f.question}</summary>
                        <p>{f.answer}</p>
                      </details>
                    ))}
                  </div>
                </section>
              ) : null}

              {post.author ? (
                <aside className="author">
                  <span className="avatar" aria-hidden="true">{initials}</span>
                  <div>
                    <b>{post.author.name}</b>
                    {post.author.role ? <span>{post.author.role}</span> : null}
                    {post.author.bio ? <p>{post.author.bio}</p> : null}
                    <a href="/about">More about COMMVIEW</a>
                  </div>
                </aside>
              ) : null}

              {post.tags && post.tags.length ? (
                <div className="tags">
                  {post.category ? (
                    <a href={`/insights/category/${post.category.slug}`}>{post.category.title}</a>
                  ) : null}
                  {post.tags.map((t) => (
                    <a key={t.slug} href={`/insights/tag/${t.slug}`}>{t.title}</a>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </article>

      {post.related && post.related.length ? (
        <section className="rel" aria-labelledby="rel-h">
          <div className="wrap">
            <h2 id="rel-h">Read next</h2>
            <div className="cards rel__grid">
              {post.related.map((p) => (
                <PostCardView key={p._id} post={p} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="close dark" aria-labelledby="close-h">
        <div className="wrap">
          <div className="close__in">
            {/* TODO: closing copy is the mock draft — approve or rewrite. */}
            <h2 className="close__h" id="close-h">Sounds like your pipeline?</h2>
            <p className="close__p">
              Bring us the question. We will tell you which of the three it
              actually is, and what we would do about it.
            </p>
            <div className="close__row">
              <a className="btn btn--cyan btn--lg" href="/contact">Talk to us</a>
              <a className="btn btn--ghost btn--lg" href="/diagnostic">Take the diagnostic</a>
            </div>
          </div>
        </div>
      </section>

      <ArticleProgress />
    </main>
  );
}
