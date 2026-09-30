import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCategoryPage } from "@/lib/sanity/queries";
import { Card, cvar, COLOUR } from "@/components/blog/Card";
import "../../../../../styles/blog.css";

// One reusable Insight category archive for /insights/category/[slug]. The
// category title/colour and its posts come from Sanity; the intro + closing-CTA
// copy live in this typed config keyed by slug (the schema has no CTA fields, so
// keeping intro alongside them here avoids touching existing category content).
// Article URLs stay flat at /insights/{slug}.

type Cta = { label: string; href: string };
type CatConfig = {
  name: string;
  intro: string;
  metaTitle: string;
  metaDescription: string;
  cta: { eyebrow: string; heading: string; copy: string; primary: Cta; secondary: Cta };
};

const CATEGORIES: Record<string, CatConfig> = {
  "gtm-leadership": {
    name: "GTM Leadership",
    intro:
      "Go-to-market problems rarely sit neatly inside Sales or Marketing. We look at positioning, ideal customers, buying behaviour, commercial alignment and the systems connecting them, with a focus on what actually helps B2B businesses turn market opportunity into revenue.",
    metaTitle: "B2B GTM Leadership Insights | CommView",
    metaDescription:
      "Practical thinking on B2B go-to-market strategy, positioning, ideal customers, buying behaviour and commercial alignment from CommView.",
    cta: {
      eyebrow: "GTM LEADERSHIP",
      heading: "Not sure where the GTM problem actually sits?",
      copy: "Start with the problem. We'll help you work out what's getting in the way and what needs to change.",
      primary: { label: "Explore GTM Leadership", href: "/fractional-cmo" },
      secondary: { label: "Take the Diagnostic", href: "/diagnostic" },
    },
  },
  growth: {
    name: "Growth",
    intro:
      "Growth doesn't usually stop because a business suddenly forgot how to market itself. We look at the constraints behind stalled B2B growth, from acquisition and conversion to market headroom, customer fit and the commercial system around them.",
    metaTitle: "B2B Growth Insights | CommView",
    metaDescription:
      "Practical B2B growth insights covering acquisition, conversion, growth constraints, customer fit and building repeatable growth engines.",
    cta: {
      eyebrow: "GROWTH",
      heading: "Growth has slowed. The first job is finding out why.",
      copy: "We'll help you identify where growth is breaking down before you spend more trying to fix the wrong thing.",
      primary: { label: "Explore Growth", href: "/growth" },
      secondary: { label: "Take the Diagnostic", href: "/diagnostic" },
    },
  },
  product: {
    name: "Product",
    intro:
      "Good product decisions start with the problem, not the feature. We write about discovery, prioritisation, adoption, roadmaps and the evidence needed to decide what to build, what to change and what not to build at all.",
    metaTitle: "B2B Product Strategy Insights | CommView",
    metaDescription:
      "Practical thinking on B2B product strategy, discovery, prioritisation, roadmaps, feature adoption and making better product decisions.",
    cta: {
      eyebrow: "PRODUCT",
      heading: "The roadmap isn't the strategy.",
      copy: "We help B2B teams understand the problem, make better product decisions and connect what they build to customer and commercial value.",
      primary: { label: "Explore Product Strategy", href: "/product-strategy" },
      secondary: { label: "Take the Diagnostic", href: "/diagnostic" },
    },
  },
  "operational-ai": {
    name: "Operational AI",
    intro:
      "AI creates value when it improves real work. We look at where AI and automation can reduce cost, remove repetitive work, improve decisions and change how software is used, without starting with the technology and searching for a problem.",
    metaTitle: "Operational AI Insights | CommView",
    metaDescription:
      "Practical thinking on AI, automation, workflow redesign, AI ROI and applying AI to real business operations.",
    cta: {
      eyebrow: "OPERATIONAL AI",
      heading: "Don't start with AI. Start with the work.",
      copy: "We'll help you find where AI can make a measurable difference, redesign the workflow and work out what is actually worth implementing.",
      primary: { label: "Explore Operational AI", href: "/ai-consulting" },
      secondary: { label: "Take the Diagnostic", href: "/diagnostic" },
    },
  },
};

export function generateStaticParams() {
  return Object.keys(CATEGORIES).map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cfg = CATEGORIES[slug];
  if (!cfg) return {};
  return {
    title: { absolute: cfg.metaTitle },
    description: cfg.metaDescription,
    alternates: { canonical: `/insights/category/${slug}` },
  };
}

export default async function CategoryArchivePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cfg = CATEGORIES[slug];
  if (!cfg) notFound();

  const { category, posts } = await getCategoryPage(slug);
  const colour = category ? COLOUR[category.colour] : "var(--brand-cyan)";
  const name = category?.title || cfg.name;

  return (
    <main id="main">
      {/* ===== category header (drill-down from /insights) ===== */}
      <section className="icat-hero" style={cvar(colour)}>
        <div className="wrap">
          <nav className="crumb" aria-label="Breadcrumb">
            <ol>
              <li><a href="/insights">Insights</a></li>
              <li aria-current="page">{name}</li>
            </ol>
          </nav>
          <p className="eyebrow-x" style={{ color: colour }}>INSIGHTS</p>
          <h1 className="icat-h1">{name}</h1>
          <p className="icat-intro">{cfg.intro}</p>
        </div>
      </section>

      {/* ===== articles ===== */}
      <section className="latest" aria-label={`${name} articles`}>
        <div className="wrap">
          {posts.length > 0 ? (
            <div className="cards">
              {posts.map((post) => (
                <Card key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <div className="icat-empty">
              <h2 className="icat-empty__h">Nothing published here yet.</h2>
              <p className="icat-intro">We&apos;re working on it. Explore the latest CommView Insights in the meantime.</p>
              <div className="close__row">
                <a className="btn btn--ink btn--lg" href="/insights">View all Insights</a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===== closing CTA (reuses the site's dark CTA treatment) ===== */}
      <section className="close dark" aria-labelledby="icat-cta-h">
        <div className="wrap">
          <p className="eyebrow-x" style={{ color: colour }}>{cfg.cta.eyebrow}</p>
          <h2 className="close__h" id="icat-cta-h">{cfg.cta.heading}</h2>
          <p className="close__p">{cfg.cta.copy}</p>
          <div className="close__row">
            <a className="btn btn--cyan btn--lg" href={cfg.cta.primary.href}>{cfg.cta.primary.label}</a>
            <a className="btn btn--ghost btn--lg" href={cfg.cta.secondary.href}>{cfg.cta.secondary.label}</a>
          </div>
        </div>
      </section>
    </main>
  );
}
