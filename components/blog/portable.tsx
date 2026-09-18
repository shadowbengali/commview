import { PortableText } from "@portabletext/react";
import type { PortableTextComponents } from "@portabletext/react";
import type { CSSProperties } from "react";

import { urlFor } from "@/lib/sanity/image";
import type { PortableBlock } from "@/lib/sanity/queries";

// Slugify heading text into an anchor id. Used for both the rendered <h2 id>
// and the generated TOC links, so they always match.
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function blockText(value: unknown): string {
  const children = (value as { children?: Array<{ text?: unknown }> })?.children;
  if (!Array.isArray(children)) return "";
  return children.map((c) => (typeof c?.text === "string" ? c.text : "")).join("");
}

export interface TocEntry {
  id: string;
  text: string;
}

// Pull the h2 headings out of the body for the "On this page" table of contents.
export function extractToc(body: PortableBlock[] | null): TocEntry[] {
  if (!body) return [];
  return body
    .filter((b) => b._type === "block" && (b as { style?: string }).style === "h2")
    .map((b) => {
      const text = blockText(b);
      return { id: slugify(text), text };
    })
    .filter((e) => e.text.length > 0);
}

const components: PortableTextComponents = {
  block: {
    h2: ({ value, children }) => <h2 id={slugify(blockText(value))}>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    normal: ({ children }) => <p>{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="pull">
        <p>{children}</p>
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ value, children }) => {
      const href = (value as { href?: string })?.href || "#";
      const external = /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          {...(external ? { rel: "noopener noreferrer", target: "_blank" } : {})}
        >
          {children}
        </a>
      );
    },
  },
  list: {
    bullet: ({ children }) => <ul>{children}</ul>,
    number: ({ children }) => <ol>{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  types: {
    figure: ({ value }) => {
      const v = value as { alt?: string; caption?: string; asset?: unknown };
      if (!v.asset) return null;
      return (
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={urlFor(v as never).width(1200).url()} alt={v.alt || ""} />
          {v.caption ? <figcaption>{v.caption}</figcaption> : null}
        </figure>
      );
    },
    callout: ({ value }) => {
      const v = value as { label?: string; text?: string };
      return (
        <div className="callout">
          {v.label ? <p>{v.label}</p> : null}
          <p>{v.text}</p>
        </div>
      );
    },
    codeBlock: ({ value }) => {
      const v = value as { language?: string; code?: string };
      return (
        <pre style={{ ["--lang" as string]: v.language } as CSSProperties}>
          <code>{v.code}</code>
        </pre>
      );
    },
    postReference: ({ value }) => {
      const v = value as { post?: { title?: string; slug?: string } };
      if (!v.post?.slug) return null;
      return (
        <p>
          <a href={`/insights/${v.post.slug}`}>{v.post.title}</a>
        </p>
      );
    },
  },
};

export function PostBody({ body }: { body: PortableBlock[] | null }) {
  if (!body) return null;
  return <PortableText value={body} components={components} />;
}
