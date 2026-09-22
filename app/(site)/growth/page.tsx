import type { Metadata } from "next";

import "../../../styles/growth.css";

// /growth — Growth pillar page. Copy from the client content doc
// (Commview_Growth_Final_Content.docx), laid out to the approved design.
// Green accent per the fixed colour coding. Shared (site) header/footer.

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://commview-green.vercel.app";

export const metadata: Metadata = {
  title: { absolute: "B2B Growth Marketing for Scale-ups | CommView" },
  description:
    "B2B growth marketing focused on commercial results. SEO, AEO, demand gen, content, paid and CRO, diagnosed and delivered by operators.",
  alternates: { canonical: "/growth" },
};

// ---- data ------------------------------------------------------------------
const ENGINE = [
  { n: "01", h: "Strategy", p: "Set the direction based on your commercial goals, market and opportunity. We work out what growth needs to achieve before deciding which activity belongs in the plan." },
  { n: "02", h: "Audience", p: "Understand who is most likely to buy, succeed and create value. That means getting beyond broad personas and focusing on the customers and buying situations that matter." },
  { n: "03", h: "Content", p: "Create what buyers actually need: content that answers real questions, builds authority, supports discovery and helps customers move towards a decision." },
  { n: "04", h: "Channels", p: "Choose the right mix of SEO, AEO, paid, organic, email, partnerships and other routes based on how the audience actually researches and buys." },
  { n: "05", h: "Conversion", p: "Turn attention into commercial progress. We analyse journeys, forms, sign-up flows, propositions and hand-offs to understand where interest is being lost." },
];

const STEPS = [
  { n: "01", h: "Understand", p: "Start with the commercial goal, audience, market and current performance. What are we trying to change?" },
  { n: "02", h: "Diagnose", p: "Follow the evidence. What is working, what isn’t, and where is the biggest constraint?" },
  { n: "03", h: "Prioritise", p: "Focus on the activities most likely to create commercial impact rather than producing a long list of marketing tasks." },
  { n: "04", h: "Execute", p: "Build, launch and optimise the work. Commview can execute directly, work with your team or bring in specialist capability." },
  { n: "05", h: "Measure", p: "Track what changed, learn from the result and put more investment behind what works." },
];

const STATS = [
  { b: "6,000+", s: "MQLs generated" },
  { b: "1,000+", s: "SQLs created" },
  { b: "£3m", s: "Marketing-influenced pipeline" },
  { b: "50%", s: "Run-cost reduction, from £7m to £3.5m" },
  { b: "800%", s: "Organic growth delivered" },
];

const LOGOS = ["Vodafone Business", "ADI Global", "Distrelec", "Travis Perkins", "Money Advisor"];

const FAQS = [
  { q: "What’s the difference between growth marketing and demand generation?", a: "Growth marketing looks across the wider commercial growth system, including audience, acquisition, conversion, pipeline and measurement. Demand generation is one part of that system, focused on creating awareness, interest and preference before and during the buying journey." },
  { q: "Which channels do you focus on?", a: "We are deliberately channel-neutral. Commview works across SEO, AEO, content, demand generation, paid media, email and conversion, but we don’t start by deciding which channel to sell. We diagnose the growth constraint first, then choose the work that fits it." },
  { q: "How do you measure success?", a: "We agree the measures around the problem being solved. That may include qualified demand, conversion, pipeline, progression, revenue or efficiency rather than relying on traffic, impressions or lead volume alone. The measures should tell us whether the original diagnosis was right." },
  { q: "Do you work with our existing team or agency?", a: "Yes. Commview can work alongside internal marketers, sales teams and existing agencies. We can set the direction, connect work that has become fragmented, fill capability gaps and make sure each part of the growth system is working towards the same commercial outcome." },
  { q: "How long does a growth engagement usually last?", a: "It depends on the problem. A focused diagnostic or conversion project can be relatively contained, while SEO, content and broader growth programmes need time to compound. We scope the engagement around the work required rather than forcing every client into the same retainer." },
  { q: "What types of businesses do you work with?", a: "Commview is built primarily for B2B companies that already have a product or service people buy but need to improve how they grow. The strongest fit is where marketing, sales, product and operations overlap and the answer is unlikely to sit inside one channel." },
];

// ---- hero constraint diagram (SVG, live text) ------------------------------
const CORE = { x: 300, y: 250, r: 62 };
const NODES = [
  { label: "Demand?", x: 300, y: 118 },
  { label: "Targeting?", x: 112, y: 188 },
  { label: "Conversion?", x: 488, y: 188 },
  { label: "Proposition?", x: 150, y: 330 },
  { label: "Pipeline?", x: 450, y: 330 },
];
const pillW = (label: string) => Math.max(96, label.length * 9 + 34);

function GrowthDiagram() {
  const findW = pillW("We find the constraint.");
  return (
    <div className="gr-diagram">
      <svg viewBox="0 0 600 470" role="img" aria-label="Growth has slowed — is it demand, targeting, conversion, proposition or pipeline? Commview finds the constraint.">
        <defs>
          <filter id="grGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="12" />
          </filter>
          <radialGradient id="grCore" cx="50%" cy="42%" r="65%">
            <stop offset="0" stopColor="#0d1f18" />
            <stop offset="1" stopColor="#0b0f14" />
          </radialGradient>
        </defs>

        <text x="300" y="26" textAnchor="middle" className="gr-diagram__cap">GROWTH HAS SLOWED.</text>
        <text x="300" y="50" textAnchor="middle" className="gr-diagram__sub">Is it&hellip;</text>

        {/* connectors from the core to each question */}
        <g stroke="var(--slate-dark)" strokeWidth="1.5">
          {NODES.map((n) => (
            <line key={n.label} x1={CORE.x} y1={CORE.y} x2={n.x} y2={n.y} />
          ))}
        </g>
        <line x1="300" y1={CORE.y + CORE.r} x2="300" y2="406" stroke="var(--c)" strokeWidth="2" />

        {/* core */}
        <circle cx={CORE.x} cy={CORE.y} r={CORE.r + 12} fill="var(--c)" opacity="0.3" filter="url(#grGlow)" />
        <circle cx={CORE.x} cy={CORE.y} r={CORE.r} fill="url(#grCore)" stroke="var(--c)" strokeWidth="2" />
        <text x={CORE.x} y={CORE.y + 7} textAnchor="middle" className="gr-diagram__core">GROWTH</text>

        {/* question pills */}
        {NODES.map((n) => {
          const w = pillW(n.label);
          return (
            <g key={n.label}>
              <rect x={n.x - w / 2} y={n.y - 17} width={w} height="34" rx="17" fill="var(--brand-charcoal)" stroke="var(--slate)" strokeWidth="1" />
              <text x={n.x} y={n.y + 5} textAnchor="middle" className="gr-diagram__node">{n.label}</text>
            </g>
          );
        })}

        {/* answer pill */}
        <rect x={300 - findW / 2} y="413" width={findW} height="38" rx="19" fill="var(--c)" opacity="0.28" filter="url(#grGlow)" />
        <rect x={300 - findW / 2} y="414" width={findW} height="36" rx="18" fill="var(--c)" />
        <text x="300" y="437" textAnchor="middle" className="gr-diagram__find">We find the constraint.</text>
      </svg>
    </div>
  );
}

export default function GrowthPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: "B2B Growth Marketing",
        serviceType: "Growth marketing",
        description:
          "B2B growth marketing across SEO, AEO, demand generation, content, paid media and conversion — diagnosed and delivered by operators.",
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
          { "@type": "ListItem", position: 2, name: "Growth", item: `${SITE}/growth` },
        ],
      },
    ],
  };

  return (
    <main id="main" className="gr">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ===== HERO ===== */}
      <section className="gr-hero dark" aria-labelledby="gr-h1">
        <div className="wrap gr-hero__grid">
          <div>
            <p className="eyebrow-x">B2B Growth Marketing</p>
            <h1 className="gr-hero__h1" id="gr-h1">
              <span>Growth has slowed.</span>{" "}
              <span className="accent">Let&rsquo;s find out why.</span>
            </h1>
            <p className="gr-hero__sub">
              We help B2B scale-ups diagnose what&rsquo;s really holding growth back, then build and
              execute the work needed to move it. Not more marketing activity for the sake of it —
              the right work, focused on measurable commercial outcomes.
            </p>
            <div className="gr-hero__cta">
              <a className="btn btn--green btn--lg" href="/diagnostic">Take the Diagnostic &rarr;</a>
              <a className="btn btn--ghost btn--lg" href="/contact">Talk to us</a>
            </div>
            <div className="gr-hero__meta">
              <div className="gr-meta"><b>Diagnose<br />the constraint</b></div>
              <div className="gr-meta"><b>Focus<br />the investment</b></div>
              <div className="gr-meta"><b>Deliver<br />measurable results</b></div>
            </div>
          </div>
          <GrowthDiagram />
        </div>
      </section>

      {/* ===== A DIFFERENT APPROACH ===== */}
      <section className="gr-sec" aria-labelledby="gr-approach">
        <div className="wrap gr-lead">
          <div>
            <p className="eyebrow-x" style={{ color: "var(--c)" }}>A different approach</p>
            <h2 className="gr-lead__h" id="gr-approach" style={{ marginTop: "var(--space-4)" }}>
              More signal. Less noise. Real growth.
            </h2>
          </div>
          <div className="gr-lead__body">
            <p><span className="lit">B2B growth marketing isn&rsquo;t about adding more activity.</span> It&rsquo;s about understanding what is and isn&rsquo;t working, then focusing time and investment where they can make the biggest commercial difference.</p>
            <p>That means looking beyond channel metrics. Traffic can rise while conversion falls. Lead volume can increase while Sales sees less value. Content can perform well in search without influencing a single buying decision.</p>
            <p>The job is to connect the evidence and find the constraint before deciding what to do next.</p>
          </div>
        </div>
      </section>

      {/* ===== WHAT WE DO — growth engine ===== */}
      <section className="gr-sec gr-sec--alt" aria-labelledby="gr-engine">
        <div className="wrap">
          <div className="gr-engine__head">
            <div>
              <p className="eyebrow-x" style={{ color: "var(--c)" }}>What we do</p>
              <h2 id="gr-engine" style={{ marginTop: "var(--space-3)" }}>A complete growth engine, built for B2B.</h2>
            </div>
            <p className="gr-engine__intro">Commview works across the growth journey, from strategy and audience through content, channels, conversion and measurement. We don&rsquo;t assume every business needs every capability — the mix depends on the problem we are trying to solve.</p>
          </div>
          <div className="gr-engine__grid">
            {ENGINE.map((c) => (
              <div className="gr-cell" key={c.n}>
                <b>{c.n}</b>
                <h3>{c.h}</h3>
                <p>{c.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BUILT AROUND OUTCOMES — venn ===== */}
      <section className="gr-sec dark" aria-labelledby="gr-outcomes">
        <div className="wrap gr-venn__grid">
          <div>
            <p className="eyebrow-x" style={{ color: "var(--c)" }}>Built around commercial outcomes</p>
            <h2 className="gr-venn__h" id="gr-outcomes" style={{ marginTop: "var(--space-3)" }}>Strategy, execution and outcomes.</h2>
            <div className="gr-venn__body">
              <p>A strategy only matters if it changes what happens next. Commview combines the thinking with hands-on execution so the person diagnosing the growth problem stays close enough to the work to see whether the solution is actually working.</p>
            </div>
            <p className="gr-pull">Strategy + execution = growth.</p>
          </div>
          <figure className="gr-venn">
            <svg viewBox="0 0 520 350" role="img" aria-label="Strategy and execution combine into growth: where to play, who to target and what will win, alongside content, channels, campaigns and continuous optimisation.">
              <circle cx="185" cy="155" r="150" fill="var(--brand-charcoal)" stroke="var(--slate-dark)" strokeWidth="1" />
              <circle cx="335" cy="155" r="150" fill="var(--c)" fillOpacity="0.16" stroke="var(--c)" strokeWidth="1.5" />
              <text x="150" y="120" textAnchor="middle" className="gr-venn__title" fill="var(--brand-polar)">STRATEGY</text>
              <text x="150" y="148" textAnchor="middle" className="gr-venn__line" fill="var(--slate-light)">Where should we play?</text>
              <text x="150" y="166" textAnchor="middle" className="gr-venn__line" fill="var(--slate-light)">Who should we target?</text>
              <text x="150" y="184" textAnchor="middle" className="gr-venn__line" fill="var(--slate-light)">What will make us win?</text>
              <text x="372" y="120" textAnchor="middle" className="gr-venn__title" fill="var(--brand-polar)">EXECUTION</text>
              <text x="372" y="148" textAnchor="middle" className="gr-venn__line" fill="var(--slate-light)">Content and channels.</text>
              <text x="372" y="166" textAnchor="middle" className="gr-venn__line" fill="var(--slate-light)">Campaigns and automation.</text>
              <text x="372" y="184" textAnchor="middle" className="gr-venn__line" fill="var(--slate-light)">Continuous optimisation.</text>
              <text x="260" y="162" textAnchor="middle" fontSize="26" fill="var(--c)">+</text>
            </svg>
            <figcaption className="gr-venn__foot">More pipeline. Higher revenue.</figcaption>
          </figure>
        </div>
      </section>

      {/* ===== PROVEN IMPACT — stats ===== */}
      <section className="gr-sec" aria-labelledby="gr-impact">
        <div className="wrap">
          <p className="eyebrow-x" style={{ color: "var(--c)" }}>Proven impact</p>
          <h2 id="gr-impact" style={{ marginTop: "var(--space-3)" }}>Real results for real businesses.</h2>
          <div className="gr-stats__grid">
            {STATS.map((s) => (
              <div className="gr-stat" key={s.b}>
                <b>{s.b}</b>
                <span>{s.s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW WE WORK — process ===== */}
      <section className="gr-sec gr-sec--alt gr-sec--tight" aria-labelledby="gr-proc">
        <div className="wrap">
          <div className="gr-proc__head">
            <p className="eyebrow-x" style={{ color: "var(--c)" }}>How we work</p>
            <h2 id="gr-proc" style={{ marginTop: "var(--space-3)" }}>A clear, practical process.</h2>
          </div>
          <div className="gr-proc__grid">
            {STEPS.map((s) => (
              <div className="gr-step" key={s.n}>
                <b>{s.n}</b>
                <h3>{s.h}</h3>
                <p>{s.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TRUSTED EXPERIENCE — logo strip ===== */}
      <section className="gr-sec gr-sec--tight" aria-labelledby="gr-logos">
        <div className="wrap">
          <div className="gr-logos__head">
            <p className="eyebrow-x" style={{ color: "var(--c)" }}>Trusted experience</p>
            <h2 id="gr-logos" style={{ marginTop: "var(--space-3)" }}>Experience across complex B2B markets.</h2>
          </div>
          {/* TODO: replace text wordmarks with official vector logos (public/logos/clients). */}
          <div className="gr-logos__grid">
            {LOGOS.map((name) => (
              <div className="gr-logo" key={name}>{name}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="gr-sec gr-faq" aria-labelledby="gr-faq-h">
        <div className="wrap">
          <div className="gr-faq__head">
            <p className="eyebrow-x" style={{ color: "var(--c)" }}>Frequently asked questions</p>
            <h2 id="gr-faq-h" style={{ marginTop: "var(--space-3)" }}>Straight answers to common questions.</h2>
          </div>
          <div className="gr-faq__list">
            {FAQS.map((f, i) => (
              <details key={i}>
                <summary>{f.q}</summary>
                <p className="gr-faq__a">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="gr-final dark" aria-labelledby="gr-final">
        <div className="wrap gr-final__grid">
          <div>
            <p className="eyebrow-x" style={{ color: "var(--c)" }}>Let&rsquo;s talk</p>
            <h2 className="gr-final__h" id="gr-final" style={{ marginTop: "var(--space-3)" }}>
              Ready to grow smarter? Let&rsquo;s find the constraint.
            </h2>
            <p className="gr-final__p">You don&rsquo;t need to know whether the answer is SEO, demand generation, paid media, conversion or something else before speaking to us. That&rsquo;s the point of the diagnosis.</p>
            <div className="gr-final__row">
              <a className="btn btn--green btn--lg" href="/diagnostic">Take the Diagnostic &rarr;</a>
              <a className="btn btn--ghost btn--lg" href="/contact">Talk to us</a>
            </div>
          </div>
          <p className="gr-final__tag">Less guesswork.<br />More growth.</p>
        </div>
      </section>
    </main>
  );
}
