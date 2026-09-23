import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";

import "../../../styles/what-we-do.css";

// /what-we-do — the mega-menu hub page. Bespoke design (built on the design
// system), copy supplied by the client and reproduced verbatim. Header/footer
// come from the shared (site) chrome.

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://commview-green.vercel.app";
const cvar = (c: string): CSSProperties => ({ ["--c" as string]: c }) as CSSProperties;

export const metadata: Metadata = {
  title: { absolute: "B2B Consulting Services | GTM, Growth, Product & AI | CommView" },
  description:
    "B2B consulting services spanning GTM leadership, growth, product and operational AI. We diagnose what is holding growth back, then help fix it.",
  alternates: { canonical: "/what-we-do" },
};

type Para = { text: string; lit?: boolean };

interface Pillar {
  colour: string;
  num: string;
  label: string;
  question: string;
  body: Para[];
  chipsLabel: string;
  chips: string[];
  explore: { label: string; href: string };
  rail:
    | { kind: "quote"; eyebrow: string; quote: ReactNode }
    | { kind: "flow"; eyebrow: string; steps: string[] }
    | { kind: "media"; eyebrow: string };
}

const PILLARS: Pillar[] = [
  {
    colour: "var(--brand-cyan)",
    num: "01",
    label: "GTM Leadership",
    question: "How do we actually reach and win these customers?",
    body: [
      { text: "You can have a good product, a capable sales team and plenty of marketing activity and still struggle to turn any of it into predictable growth." },
      { text: "Usually there's something underneath it." },
      { text: "The market has moved but the positioning hasn't. The ICP has become so broad that everyone is a potential customer. Marketing and Sales disagree about what a good opportunity looks like. The business has added channels without deciding how they fit together. Or nobody senior owns the journey from market to revenue." },
      { text: "That's where our GTM Leadership work starts.", lit: true },
      { text: "We can tackle a defined problem or work inside the business as a fractional CMO, taking responsibility for the commercial system rather than standing outside it giving advice." },
    ],
    chipsLabel: "That can include:",
    chips: ["Positioning", "Ideal Customer Profile", "Routes to market", "Pipeline", "Sales hand-off", "Operating rhythm"],
    explore: { label: "Explore GTM Leadership", href: "/fractional-cmo" },
    rail: {
      kind: "quote",
      eyebrow: "From strategy to traction",
      quote: (
        <>
          &ldquo;Who are we trying to win? Why should they choose us? How are we
          going to <em>reach them?</em>&rdquo;
        </>
      ),
    },
  },
  {
    colour: "var(--accent-green)",
    num: "02",
    label: "Growth",
    question: "Why isn't the marketing producing more growth?",
    body: [
      { text: "“Marketing isn't working” can mean almost anything." },
      { text: "Not enough of the right people are finding you. They're finding you but not engaging. They're engaging but not converting. Leads are coming through but Sales doesn't want them. Opportunities are being created but not closing." },
      { text: "Those are different problems.", lit: true },
      { text: "So our B2B growth marketing work doesn't begin with a channel. It begins by following the journey from discovery to revenue and finding where it's breaking down." },
      { text: "We care about what happens commercially after the click. Traffic matters when the right people are arriving. Leads matter when they become genuine opportunities. Marketing matters when it contributes to growth." },
      { text: "If you don't need more leads at all, we'll tell you.", lit: true },
    ],
    chipsLabel: "Depending on what we find, the work might involve:",
    chips: ["SEO", "Answer Engine Optimization (AEO)", "B2B lead generation", "Demand generation", "Paid media", "Content marketing", "Conversion optimisation"],
    explore: { label: "Explore Growth", href: "/growth" },
    rail: { kind: "flow", eyebrow: "More than traffic", steps: ["Traffic", "Demand", "Pipeline", "Revenue"] },
  },
  {
    colour: "var(--brand-blue)",
    num: "03",
    label: "Product",
    question: "Build the right thing. Or fix what you've built.",
    body: [
      { text: "A roadmap full of features isn't a product strategy. Neither is building whatever the loudest customer asked for last week." },
      { text: "Product decisions start with understanding the problem you're solving, who you're solving it for and why solving it matters enough for someone to change their behaviour or pay for it." },
      { text: "Our B2B product strategy work can start before a product exists or after it's already in customers' hands." },
      { text: "For something new, that can mean discovery, validating the problem, defining the proposition, scoping an MVP and getting it into the hands of real users." },
      { text: "For an existing product, the question might be different. Why aren't customers adopting this feature? Why has the roadmap become impossible to prioritise? Are we building what customers need or what individual customers request? Has the product drifted away from the market it originally served?" },
    ],
    chipsLabel: "Our Product work includes:",
    chips: ["Product strategy consulting", "Fractional CPO", "Product discovery", "MVP scoping and delivery", "Roadmap and prioritisation"],
    explore: { label: "Explore Product", href: "/product-strategy" },
    rail: { kind: "media", eyebrow: "Ideas to impact" },
  },
  {
    colour: "var(--accent-pink)",
    num: "04",
    label: "Operational AI",
    question: "Where can AI actually take cost out and make us faster?",
    body: [
      { text: "There are plenty of places you could use AI. That's not particularly useful." },
      { text: "The better question is where people are repeatedly spending time, money or attention on work that technology can now do faster, cheaper or more consistently." },
      { text: "That's how we approach AI consulting. We start with the operation rather than the technology." },
      { text: "Where are the repetitive workflows? Where does information have to be manually moved between systems? Where is the team recreating essentially the same work every week? Where is valuable data sitting unused because nobody has time to do anything with it?" },
      { text: "If AI earns its place, we use it. If it doesn't, we don't.", lit: true },
    ],
    chipsLabel: "That can lead us into:",
    chips: ["AI workflow automation", "AI automation consulting", "AI implementation", "Generative AI", "AI transformation"],
    explore: { label: "Explore Operational AI", href: "/ai-consulting" },
    rail: {
      kind: "quote",
      eyebrow: "Real efficiency. Not hype.",
      quote: (
        <>
          The technology comes <em>after the problem.</em>
        </>
      ),
    },
  },
];

const VENN = [
  { key: "gtm", fill: "var(--brand-cyan)", cx: 380, cy: 200, name: "GTM Leadership", cap: "Who and how?", nx: 380, ny: 126 },
  { key: "growth", fill: "var(--accent-green)", cx: 248, cy: 310, name: "Growth", cap: "Demand and conversion", nx: 196, ny: 300 },
  { key: "product", fill: "var(--brand-blue)", cx: 512, cy: 310, name: "Product", cap: "What to build?", nx: 566, ny: 300 },
  { key: "ai", fill: "var(--accent-pink)", cx: 380, cy: 420, name: "Operational AI", cap: "Do more with less", nx: 380, ny: 478 },
];

// Answers reinforce the brief's themes (diagnose before prescribing, strategy
// and execution stay connected, operator-led, specialists brought in) with no
// invented proof, prices, outcomes or team-size claims.
const FAQ = [
  {
    q: "What does a B2B consultant actually do?",
    a: "A good B2B consultant helps you work out what is actually holding the business back, then helps fix it. That means diagnosing the real problem before prescribing a solution, making the commercial decisions with you and staying close to the work as it happens rather than handing over a document and leaving.",
  },
  {
    q: "What B2B consulting services does Commview provide?",
    a: "Commview works across four connected areas: GTM Leadership, Growth, Product and Operational AI. Most engagements use more than one, because business problems rarely sit inside a single function. We start from the problem rather than the service, then bring the right combination of the four to solve it.",
  },
  {
    q: "Do I need to know which service I need before contacting you?",
    a: "No. You do not need to diagnose the problem before asking for help. If you know growth has slowed, the marketing is not landing or the team is stretched, that is enough to start. We work out where the constraint sits and what is worth looking at first.",
  },
  {
    q: "Does Commview only provide strategy?",
    a: "No. Strategy and execution stay connected. The person helping make the strategic decision stays close enough to the work to see whether it is working and to change course if it is not. Where a problem needs deeper specialist expertise, we bring the right specialist into the work.",
  },
  {
    q: "Can Commview work alongside our existing team?",
    a: "Yes. We can work alongside your internal marketing, sales, product and technology teams, as well as existing agencies and specialist partners. Often the most useful thing we do is connect the work across those functions so everyone is solving the same problem and moving towards the same outcome.",
  },
];

function RailView({ rail }: { rail: Pillar["rail"] }) {
  if (rail.kind === "quote") {
    return (
      <>
        <p className="wwd-rail__eyebrow">{rail.eyebrow}</p>
        <p className="wwd-rail__quote">{rail.quote}</p>
      </>
    );
  }
  if (rail.kind === "flow") {
    const steps = rail.steps;
    return (
      <>
        <p className="wwd-rail__eyebrow">{rail.eyebrow}</p>
        <div className="wwd-flow">
          {steps.map((s, i) => (
            <span key={s} className={i === steps.length - 1 ? "end" : undefined}>
              {s}
              {i < steps.length - 1 ? <i aria-hidden="true">&darr;</i> : null}
            </span>
          ))}
        </div>
      </>
    );
  }
  return (
    <>
      <p className="wwd-rail__eyebrow">{rail.eyebrow}</p>
      <div className="wwd-rail__media">
        {/* TODO: replace with a real product image */}
        <svg viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden="true">
          <rect width="400" height="300" fill="var(--surface-raised)" />
          <path d="M262 -20 L322 -20 L198 320 L138 320 Z" fill="var(--brand-blue)" fillOpacity=".18" />
          <path d="M340 -20 L356 -20 L232 320 L216 320 Z" fill="var(--brand-blue)" fillOpacity=".4" />
        </svg>
      </div>
    </>
  );
}

export default function WhatWeDoPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: "B2B consulting services",
        provider: { "@id": `${SITE}/#organisation` },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "CommView services",
          itemListElement: PILLARS.map((p) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: p.label, url: `${SITE}${p.explore.href}` },
          })),
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "What We Do", item: `${SITE}/what-we-do` },
        ],
      },
    ],
  };

  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ===== HERO ===== */}
      <section className="wwd-hero dark" aria-labelledby="wwd-h1">
        <div className="wrap wwd-hero__grid">
          <div>
            <p className="eyebrow-x">What we do</p>
            <h1 className="wwd-hero__h1" id="wwd-h1">
              Four services. Usually you need <em>more than one.</em>
            </h1>
            <div className="wwd-hero__intro">
              <p className="lead">A growth problem rarely sits neatly inside Marketing.</p>
              <p>
                Sales might say the leads are wrong. Marketing might say the
                positioning isn't landing. Customers might be choosing a competitor
                for reasons nobody expected. The product might be solving the right
                problem for the wrong customer. Or the team might be spending hours
                every week doing work that could be automated.
              </p>
              <p>
                That's why our B2B consulting services span GTM Leadership, Growth,
                Product and Operational AI.
              </p>
              <p>Not because every business needs all four.</p>
              <p>
                Because you shouldn't have to diagnose the problem before you ask
                for help.
              </p>
            </div>
            <div className="wwd-hero__row">
              <a className="btn btn--cyan btn--lg" href="/diagnostic">Take the Diagnostic</a>
              <a className="btn btn--ghost" href="/contact">Talk to us</a>
            </div>
            <div className="wwd-hero__pillars">
              <span>GTM Leadership</span>
              <span>Growth</span>
              <span>Product</span>
              <span>Operational AI</span>
            </div>
          </div>
          <p className="wwd-hero__accent" aria-hidden="true">Clarity creates momentum</p>
        </div>
      </section>

      {/* ===== PERSPECTIVE + VENN ===== */}
      <section className="wwd-persp" aria-labelledby="wwd-persp-h">
        <div className="wrap wwd-persp__grid">
          <div>
            <p className="eyebrow-x" style={{ color: "var(--brand-cyan)" }}>A broader perspective</p>
            <h2 id="wwd-persp-h" style={{ marginTop: "var(--space-4)" }}>
              Why we don't split growth problems neatly
            </h2>
            <div className="wwd-persp__body">
              <p>Businesses tend to organise themselves into functions. Customers don't experience them that way.</p>
              <p>A positioning problem can show up as poor lead quality.</p>
              <p>A product problem can show up as low conversion.</p>
              <p>A sales hand-off problem can make Marketing look ineffective.</p>
              <p>A weak ICP can waste money across paid media, content, sales and product development at the same time.</p>
              <p>And automating a broken process doesn't fix it. It just makes the broken process run faster.</p>
              <p className="lit">So we look across the business before deciding what needs to change.</p>
              <p>Sometimes the answer sits squarely inside one of our four services. Often it crosses two or three.</p>
              <p className="lit">The problem determines the work. Not the other way around.</p>
            </div>
          </div>
          <figure className="wwd-venn">
            <svg viewBox="0 0 760 586" role="img" aria-label="The four services overlap where sustainable growth sits: GTM Leadership, Growth, Product and Operational AI.">
              <g style={{ mixBlendMode: "multiply" }}>
                {VENN.map((v) => (
                  <ellipse key={v.key} cx={v.cx} cy={v.cy} rx={178} ry={146} fill={v.fill} fillOpacity={0.16} />
                ))}
              </g>
              <g>
                {VENN.map((v) => (
                  <ellipse key={v.key} cx={v.cx} cy={v.cy} rx={178} ry={146} fill="none" stroke={v.fill} strokeOpacity={0.5} />
                ))}
              </g>
              <g>
                {VENN.map((v) => (
                  <g key={v.key}>
                    <text x={v.nx} y={v.ny} className="wwd-venn__name">{v.name}</text>
                    <text x={v.nx} y={v.ny + 20} className="wwd-venn__cap">{v.cap}</text>
                  </g>
                ))}
              </g>
              <g>
                <circle cx={380} cy={310} r={64} fill="var(--brand-charcoal)" />
                <text x={380} y={305} className="wwd-venn__core">Sustainable</text>
                <text x={380} y={323} className="wwd-venn__core">growth</text>
              </g>
            </svg>
          </figure>
        </div>
      </section>

      {/* ===== PILLARS ===== */}
      {PILLARS.map((p) => (
        <section key={p.num} className="wwd-pillar" style={cvar(p.colour)} aria-labelledby={`wwd-${p.num}`}>
          <div className="wrap wwd-pillar__grid">
            <div>
              <p className="wwd-pillar__eyebrow">
                <b>{p.num}</b>
                <i aria-hidden="true"></i>
                {p.label}
              </p>
              <h2 id={`wwd-${p.num}`}>{p.question}</h2>
              <div className="wwd-pillar__body">
                {p.body.map((para, i) => (
                  <p key={i} className={para.lit ? "lit" : undefined}>{para.text}</p>
                ))}
                <p style={{ color: "var(--text-primary)" }}>{p.chipsLabel}</p>
              </div>
              <ul className="wwd-chips">
                {p.chips.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              <a className="wwd-explore" href={p.explore.href}>
                {p.explore.label}
              </a>
            </div>
            <aside className="wwd-rail">
              <RailView rail={p.rail} />
            </aside>
          </div>
        </section>
      ))}

      {/* ===== CLOSING CTA ===== */}
      <section className="wwd-cta dark" aria-labelledby="wwd-cta-h">
        <div className="wrap wwd-cta__grid">
          <div>
            <p className="eyebrow-x" style={{ color: "var(--brand-cyan)" }}>Not sure which service you need?</p>
            <h2 id="wwd-cta-h">You don't need to be.</h2>
            <div className="wwd-cta__body">
              <p>If you already knew exactly what was wrong, you'd probably be looking for someone to execute a very specific piece of work.</p>
              <p>Often that's not the situation.</p>
              <p>You know growth has slowed.</p>
              <p>You know Marketing isn't producing what it should.</p>
              <p>You know customers aren't behaving the way you expected.</p>
              <p>You know the team is spending too much time doing things manually.</p>
              <p>Or you simply know that something isn't working as well as it should.</p>
              <p style={{ color: "var(--brand-polar)", fontWeight: 600 }}>That's enough to start.</p>
              <p>The Commview Business Diagnostic looks across GTM Leadership, Growth, Product and Operational AI to identify strengths, weaknesses, blind spots and where we'd investigate first.</p>
            </div>
            <div className="wwd-cta__row">
              <a className="btn btn--cyan btn--lg" href="/diagnostic">Take the Diagnostic</a>
              <a className="btn btn--ghost" href="/contact">Or talk to us</a>
            </div>
          </div>
          <aside className="wwd-cta__aside">
            <p className="wwd-cta__eyebrow">A more complete view</p>
            <div className="wwd-cta__list">
              <span>GTM Leadership</span>
              <span>Growth</span>
              <span>Product</span>
              <span>Operational AI</span>
            </div>
          </aside>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="wwd-faq" aria-labelledby="wwd-faq-h">
        <div className="wrap">
          <div className="wwd-faq__head">
            <div>
              <p className="eyebrow-x" style={{ color: "var(--brand-cyan)" }}>FAQ</p>
              <h2 id="wwd-faq-h" style={{ marginTop: "var(--space-3)" }}>Frequently asked questions</h2>
            </div>
            <p>Straight answers to common questions about our B2B consulting services.</p>
          </div>
          <div className="wwd-faq__list">
            {FAQ.map((f, i) => (
              <details key={i}>
                <summary>{f.q}</summary>
                <p className="wwd-faq__a">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
