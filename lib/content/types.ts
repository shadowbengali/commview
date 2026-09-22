// Content contract v1.0 — mirrors content/page.schema.json.
// ChatGPT authors content/<slug>.json against this shape; the pillar renderer
// consumes it. Keep this file and page.schema.json in lockstep.

export type Pillar = "gtm-leadership" | "growth" | "product" | "operational-ai" | "corporate";
export type Accent = "cyan" | "green" | "blue" | "pink" | "neutral";

export type Heading = string | string[]; // array = one forced <span> line per element
export type Rich = string | string[]; // one paragraph, or several

export type Cta = { label: string; href: string; style: "primary" | "ghost" };

export type InternalLink = {
  href: string;
  purpose: "parent" | "child" | "related" | "insight" | "cta";
};

export type Meta = {
  title: string;
  description: string;
  primaryKeyword: string;
  secondaryKeywords?: string[];
  schemaTypes?: ("Service" | "FAQPage" | "BreadcrumbList")[];
  breadcrumb?: { name: string; href?: string }[];
  internalLinks?: InternalLink[];
};

export type Diagram =
  | { kind: "none" }
  | { kind: "hub"; caption?: string; sub?: string; core: string; nodes: string[]; answer?: string }
  | { kind: "overlap"; core: string; coreLines?: string[]; lobes: string[] }
  | { kind: "stack"; layers: string[] }
  | { kind: "image"; src: string; alt: string };

export type Hero = {
  eyebrow: string;
  h1: Heading;
  accentLine?: number;
  sub: Rich;
  ctas: Cta[];
  meta?: { label: string[] }[];
  diagram?: Diagram;
};

export type Stat = {
  value: string;
  label: string;
  context?: string;
  evidence: "verified" | "needs-verification";
};

type Base = {
  id: string;
  theme?: "light" | "alt" | "dark";
  tight?: boolean;
  eyebrow?: string;
  heading?: Heading;
  intro?: Rich;
  targetKeyword?: string; // not rendered — records why the section exists
  notes?: string; // not rendered — ChatGPT ↔ Claude comment
};

export type Section =
  | (Base & { type: "lead" })
  | (Base & { type: "grid"; items: { title: string; body: string; href?: string }[] })
  | (Base & {
      type: "venn";
      body?: Rich;
      pull?: string;
      centre?: string;
      caption?: string;
      left: { title: string; lines: string[] };
      right: { title: string; lines: string[] };
    })
  | (Base & { type: "stepper"; style?: "arrows" | "circles"; steps: { title: string; body: string }[] })
  | (Base & { type: "stats"; stats: Stat[] })
  | (Base & { type: "callout"; accentLine?: number; body: Rich; icon?: "ai" | "spark" | "none" })
  | (Base & { type: "comparison"; columns: { title: string; items: string[] }[] })
  | (Base & { type: "logos"; logos: { name: string; asset?: string; alt: string }[] })
  | (Base & { type: "faq"; layout?: "stacked" | "split"; items: { q: string; a: string }[] })
  | (Base & { type: "cta"; body?: Rich; ctas: Cta[]; tagline?: string[] });

export type Page = {
  slug: string;
  pillar: Pillar;
  accent: Accent;
  meta: Meta;
  hero: Hero;
  sections: Section[];
  notes?: string;
};
