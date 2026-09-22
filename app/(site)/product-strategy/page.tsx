import type { Metadata } from "next";

import "../../../styles/product-strategy.css";

// /product-strategy — Product pillar page. Copy from the client content doc
// (Commview_Product_Strategy_Final_Content.docx), laid out to the approved
// design. Blue accent per the fixed colour coding. Shared (site) chrome.

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://commview-green.vercel.app";

export const metadata: Metadata = {
  title: { absolute: "B2B Product Strategy & Fractional CPO | CommView" },
  description:
    "B2B product strategy for scale-ups. Customer discovery, prioritisation, MVPs, roadmaps and fractional product leadership, from strategy to delivery.",
  alternates: { canonical: "/product-strategy" },
};

// ---- data ------------------------------------------------------------------
const PROBLEMS = [
  { n: "01", h: "Feature-driven roadmaps", p: "Roadmaps driven by customer requests, not real needs." },
  { n: "02", h: "Unclear customer fit", p: "Not enough evidence of what customers value." },
  { n: "03", h: "Features that go unused", p: "Time and money spent on features that don’t get adopted." },
  { n: "04", h: "Slow from idea to impact", p: "It takes months to move from idea to value." },
];

const SERVICES = [
  { n: "01", h: "Product Strategy Consulting", p: "Define where to play, what to solve and how to win." },
  { n: "02", h: "Fractional CPO", p: "Executive product leadership without the full-time hire." },
  { n: "03", h: "MVP Scoping and Delivery", p: "Validate the idea and get to market quickly." },
  { n: "04", h: "Product Discovery", p: "Understand the problem, the customer and the opportunity." },
  { n: "05", h: "Roadmap and Prioritisation", p: "Focus on what matters and build a roadmap that delivers results." },
];

const STEPS = [
  { n: "01", h: "Understand", p: "Customer, market, data and current product." },
  { n: "02", h: "Decide", p: "What to build (or not), based on evidence." },
  { n: "03", h: "Prototype", p: "Validate the solution with real users." },
  { n: "04", h: "Specify", p: "Turn the solution into clear requirements." },
  { n: "05", h: "Deliver", p: "Support delivery and measure the impact." },
];

const LOGOS = ["Vodafone Business", "ADI Global", "Distrelec", "Travis Perkins", "Money Advisor"];

const FAQS = [
  { q: "What does a product strategy consultant do?", a: "A product strategy consultant helps a business decide which customer problems are worth solving and how those choices translate into product direction. The work can include discovery, prioritisation, roadmap decisions, proposition, prototyping and measurement. Commview can also stay involved through specification and delivery rather than stopping at the recommendation." },
  { q: "What is the difference between product strategy and product management?", a: "Product strategy defines the choices behind the product: who it is for, which problems matter, where the product should compete and what outcomes matter. Product management turns those choices into continuous decisions and delivery. In a scale-up the two often overlap, which is why Commview can work across both." },
  { q: "Fractional CPO or full-time CPO: which is right?", a: "A fractional CPO can make sense when the business needs senior product leadership but does not yet need, or cannot justify, a permanent executive hire. A full-time CPO is better where the scale, team and ongoing leadership requirement justify a permanent role. The decision depends on the problem and operating model." },
  { q: "Can you work with our existing product and engineering team?", a: "Yes. Commview can work alongside product managers, designers, engineers and commercial teams rather than replacing them. The role may be to provide senior product direction, strengthen discovery and prioritisation, turn decisions into clearer requirements or connect product work more closely to customer and commercial evidence." },
  { q: "Do you build prototypes and write product requirements?", a: "Yes. Where it helps move the product decision forward, Commview can work on user journeys, clickable prototypes, requirements, specifications and user stories. The objective is not documentation for its own sake. These artefacts should make assumptions visible, improve decisions and give delivery teams enough clarity to build effectively." },
  { q: "How do you use AI in product strategy?", a: "Commview uses AI to accelerate parts of product work such as synthesis, prototyping, journey development and first-pass specifications. AI does not decide the roadmap. Prioritisation, strategic trade-offs and investment decisions still require human judgement grounded in customer evidence, commercial context and the consequences of getting the decision wrong." },
];

// ---- hero product diagram (SVG, live text) ---------------------------------
const PC = { x: 300, y: 236, r: 66 };
const LOBES = [
  { l1: "Customer", l2: "needs", cx: 238, cy: 174, lx: 188, ly: 120 },
  { l1: "Market", l2: "opportunity", cx: 362, cy: 174, lx: 412, ly: 120 },
  { l1: "Commercial", l2: "viability", cx: 238, cy: 298, lx: 188, ly: 352 },
  { l1: "Right", l2: "solution", cx: 362, cy: 298, lx: 412, ly: 352 },
];

function ProductDiagram() {
  return (
    <div className="pr-diagram">
      <svg viewBox="0 0 600 470" role="img" aria-label="Product sits where customer needs, market opportunity, commercial viability and the right solution overlap — real customer problems, real growth.">
        <defs>
          <filter id="prGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
          <radialGradient id="prCore" cx="50%" cy="40%" r="65%">
            <stop offset="0" stopColor="#2b2f8f" />
            <stop offset="1" stopColor="#0b0f14" />
          </radialGradient>
        </defs>

        {LOBES.map((o) => (
          <circle key={o.l1} cx={o.cx} cy={o.cy} r="122" fill="var(--c)" fillOpacity="0.09" stroke="var(--c)" strokeWidth="1.2" strokeOpacity="0.6" />
        ))}

        {/* core */}
        <circle cx={PC.x} cy={PC.y} r={PC.r + 14} fill="var(--c)" opacity="0.35" filter="url(#prGlow)" />
        <circle cx={PC.x} cy={PC.y} r={PC.r} fill="url(#prCore)" stroke="var(--c)" strokeWidth="2" />
        <text x={PC.x} y={PC.y - 6} textAnchor="middle" className="pr-diagram__core">PRODUCT</text>
        <text x={PC.x} y={PC.y + 16} textAnchor="middle" className="pr-diagram__coreline">Real customer problems.</text>
        <text x={PC.x} y={PC.y + 32} textAnchor="middle" className="pr-diagram__coreline">Real growth.</text>

        {/* lobe labels */}
        {LOBES.map((o) => (
          <g key={o.l1 + "l"}>
            <text x={o.lx} y={o.ly} textAnchor="middle" className="pr-diagram__lobe">{o.l1}</text>
            <text x={o.lx} y={o.ly + 18} textAnchor="middle" className="pr-diagram__lobe">{o.l2}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export default function ProductStrategyPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: "B2B Product Strategy",
        serviceType: "Product strategy",
        description:
          "B2B product strategy for scale-ups: customer discovery, prioritisation, MVPs, roadmaps and fractional product leadership, from strategy to delivery.",
        provider: { "@id": `${SITE}/#organisation` },
        areaServed: { "@type": "Country", name: "United Kingdom" },
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "Product Strategy", item: `${SITE}/product-strategy` },
        ],
      },
    ],
  };

  return (
    <main id="main" className="pr">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ===== HERO ===== */}
      <section className="pr-hero dark" aria-labelledby="pr-h1">
        <div className="wrap pr-hero__grid">
          <div>
            <p className="eyebrow-x">B2B Product Strategy</p>
            <h1 className="pr-hero__h1" id="pr-h1">
              <span>Build the right thing.</span>
              <span className="accent">Not just the next thing.</span>
            </h1>
            <p className="pr-hero__sub">
              Product strategy starts before the roadmap. We help B2B scale-ups understand the
              customer problem, decide what is worth solving, turn the evidence into clear product
              decisions and stay close enough to delivery to make sure the right thing gets built.
            </p>
            <div className="pr-hero__cta">
              <a className="btn btn--blue btn--lg" href="/contact">Talk to us</a>
              <a className="btn btn--ghost btn--lg" href="/diagnostic">Take the Diagnostic &rarr;</a>
            </div>
            <div className="pr-hero__meta">
              <div className="pr-meta"><b>Customer<br />problem first</b></div>
              <div className="pr-meta"><b>Evidence<br />over opinion</b></div>
              <div className="pr-meta"><b>Faster with AI,<br />smarter with experience</b></div>
            </div>
          </div>
          <ProductDiagram />
        </div>
      </section>

      {/* ===== A DIFFERENT APPROACH ===== */}
      <section className="pr-sec" aria-labelledby="pr-approach">
        <div className="wrap pr-lead">
          <div>
            <p className="eyebrow-x" style={{ color: "var(--c)" }}>A different approach to B2B product consulting</p>
            <h2 className="pr-lead__h" id="pr-approach" style={{ marginTop: "var(--space-4)" }}>
              <span>Strategy, evidence</span>
              <span>and hands-on execution.</span>
            </h2>
          </div>
          <div className="pr-lead__body">
            <p>We combine strategic thinking with practical product experience so you can make better decisions, build faster and create products that customers actually use.</p>
          </div>
        </div>
      </section>

      {/* ===== PROBLEMS ===== */}
      <section className="pr-sec dark" aria-labelledby="pr-problems">
        <div className="wrap">
          <div className="pr-head">
            <div>
              <p className="eyebrow-x" style={{ color: "var(--c)" }}>Common product strategy problems</p>
              <h2 id="pr-problems" style={{ marginTop: "var(--space-3)" }}>
                <span>Where scale-ups drift</span>
                <span>on product.</span>
              </h2>
            </div>
            <p className="pr-head__intro">Most product problems aren&rsquo;t about ideas. They&rsquo;re about focus, evidence and execution. We help you cut through the noise and get back on track.</p>
          </div>
          <div className="pr-problems__grid">
            {PROBLEMS.map((c) => (
              <div className="pr-prob" key={c.n}>
                <b>{c.n}</b>
                <h3>{c.h}</h3>
                <p>{c.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="pr-sec pr-sec--alt" aria-labelledby="pr-services">
        <div className="wrap">
          <div className="pr-head">
            <div>
              <p className="eyebrow-x" style={{ color: "var(--c)" }}>Our B2B product strategy services</p>
              <h2 id="pr-services" style={{ marginTop: "var(--space-3)" }}>From insight to impact.</h2>
            </div>
            <p className="pr-head__intro">We offer a complete set of product services, from strategic advice to hands-on delivery, tailored to the needs of B2B scale-ups.</p>
          </div>
          <div className="pr-svc__grid">
            {SERVICES.map((c) => (
              <div className="pr-svc" key={c.n}>
                <b>{c.n}</b>
                <h3>{c.h}</h3>
                <p>{c.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW WE WORK — stepper ===== */}
      <section className="pr-sec dark" aria-labelledby="pr-proc">
        <div className="wrap">
          <div className="pr-head">
            <div>
              <p className="eyebrow-x" style={{ color: "var(--c)" }}>How we work</p>
              <h2 id="pr-proc" style={{ marginTop: "var(--space-3)" }}>A practical, hands-on process.</h2>
            </div>
            <p className="pr-head__intro">We work with you as an extension of your team, moving from insight to impact.</p>
          </div>
          <div className="pr-proc__grid">
            {STEPS.map((s) => (
              <div className="pr-step" key={s.n}>
                <div className="pr-step__n">{s.n}</div>
                <h3>{s.h}</h3>
                <p>{s.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== AI ACCELERATOR ===== */}
      <section className="pr-sec pr-sec--tight" aria-labelledby="pr-ai">
        <div className="wrap pr-ai__grid">
          <div className="pr-ai__ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="7" y="7" width="10" height="10" rx="2" />
              <path d="M10 2v3M14 2v3M10 19v3M14 19v3M2 10h3M2 14h3M19 10h3M19 14h3" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className="pr-ai__h" id="pr-ai">
            AI can make product work faster.{" "}
            <span className="accent">It can&rsquo;t tell you what to build.</span>
          </h2>
          <p className="pr-ai__body">We use AI to accelerate discovery, prototyping, specification and delivery, but product decisions are made by experienced humans, not algorithms.</p>
        </div>
      </section>

      {/* ===== TRUSTED EXPERIENCE — logo strip ===== */}
      <section className="pr-sec pr-sec--tight" aria-labelledby="pr-logos">
        <div className="wrap">
          <div className="pr-logos__head">
            <p className="eyebrow-x" style={{ color: "var(--c)" }}>Trusted experience</p>
            <h2 id="pr-logos" style={{ marginTop: "var(--space-3)" }}>Experience across complex B2B markets.</h2>
          </div>
          {/* TODO: replace text wordmarks with official vector logos (public/logos/clients). */}
          <div className="pr-logos__grid">
            {LOGOS.map((name) => (
              <div className="pr-logo" key={name}>{name}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="pr-sec pr-faq" aria-labelledby="pr-faq-h">
        <div className="wrap pr-faq__grid">
          <div className="pr-faq__head">
            <p className="eyebrow-x" style={{ color: "var(--c)" }}>Product FAQ</p>
            <h2 id="pr-faq-h" style={{ marginTop: "var(--space-3)" }}>
              <span>Straight answers</span>
              <span>to common questions.</span>
            </h2>
          </div>
          <div className="pr-faq__list">
            {FAQS.map((f, i) => (
              <details key={i}>
                <summary>{f.q}</summary>
                <p className="pr-faq__a">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="pr-final dark" aria-labelledby="pr-final">
        <div className="wrap">
          <p className="eyebrow-x" style={{ color: "var(--c)" }}>Let&rsquo;s talk</p>
          <h2 className="pr-final__h" id="pr-final" style={{ marginTop: "var(--space-3)" }}>
            <span>Ready to build a better product?</span>{" "}
            <span>Let&rsquo;s find out what&rsquo;s possible.</span>
          </h2>
          <div className="pr-final__row2">
            <div>
              <p className="pr-final__p">If the roadmap is full but the direction is unclear, the answer may not be another prioritisation framework. Let&rsquo;s work out what the customer needs, what the evidence supports and what deserves to be built.</p>
              <div className="pr-final__row">
                <a className="btn btn--blue btn--lg" href="/contact">Talk to us</a>
                <a className="btn btn--ghost btn--lg" href="/diagnostic">Take the Diagnostic &rarr;</a>
              </div>
            </div>
            <p className="pr-final__tag">Clearer thinking.<br />Faster progress.<br />Real impact.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
