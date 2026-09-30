import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";

import "../../../styles/what-we-do.css";

// /what-we-do — the mega-menu hub page. Bespoke design on the shared design
// system; copy supplied by the client and reproduced verbatim. Header/footer
// come from the (site) chrome.

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://commview-green.vercel.app";
const cvar = (c: string): CSSProperties => ({ ["--c" as string]: c }) as CSSProperties;

export const metadata: Metadata = {
  title: { absolute: "B2B Consulting Services | GTM, Growth, Product & AI | Commview" },
  description:
    "B2B consulting services spanning GTM leadership, growth, product and operational AI. We diagnose what is holding growth back, then help fix it.",
  alternates: { canonical: "/what-we-do" },
};

type Para = { text: string; lit?: boolean };

interface Pillar {
  colour: string;
  num: string;
  label: string;
  tagline: string;
  icon: ReactNode;
  question: string;
  body: Para[];
  chips: string[];
  explore: { label: string; href: string };
  quote?: ReactNode;
  flow?: string[];
  dark?: boolean;
}

const ICON = {
  chart: <path d="M4 20h16M7.5 20v-6M12 20V8M16.5 20v-10" strokeLinecap="round" />,
  target: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1" /></>,
  cube: <path d="M12 2.5l8.5 4.8v9.4L12 21.5l-8.5-4.8V7.3L12 2.5zM3.5 7.3L12 12l8.5-4.7M12 12v9.5" strokeLinejoin="round" />,
  bolt: <path d="M13 2.5L4.5 13.5H11l-1 8 8.5-11H12l1-7.5z" strokeLinejoin="round" />,
};

const PILLARS: Pillar[] = [
  {
    colour: "var(--brand-cyan)",
    num: "01",
    label: "GTM Leadership",
    tagline: "From strategy to traction",
    icon: ICON.chart,
    question: "How do we actually reach and win these customers?",
    body: [
      { text: "You can have a good product, a capable sales team and plenty of marketing activity and still struggle to turn any of it into predictable growth." },
      { text: "Usually there's something underneath it." },
      { text: "The market has moved but the positioning hasn't. The ICP has become so broad that everyone is a potential customer. Marketing and Sales disagree about what a good opportunity looks like. The business has added channels without deciding how they fit together. Or nobody senior owns the journey from market to revenue." },
      { text: "That's where our GTM Leadership work starts.", lit: true },
      { text: "We can tackle a defined problem or work inside the business as a fractional CMO, taking responsibility for the commercial system rather than standing outside it giving advice." },
    ],
    chips: ["Positioning", "Ideal Customer Profile", "Routes to market", "Pipeline", "Sales hand-off", "Operating rhythm"],
    explore: { label: "Explore GTM Leadership", href: "/gtm-leadership" },
    quote: (
      <>&ldquo;Who are we trying to win? Why should they choose us? How are we going to <em>reach them?</em>&rdquo;</>
    ),
  },
  {
    colour: "var(--accent-green)",
    num: "02",
    label: "Growth",
    tagline: "More than traffic",
    icon: ICON.target,
    dark: true,
    question: "Why isn't the marketing producing more growth?",
    body: [
      { text: "“Marketing isn't working” can mean almost anything." },
      { text: "Not enough of the right people are finding you. They're finding you but not engaging. They're engaging but not converting. Leads are coming through but Sales doesn't want them. Opportunities are being created but not closing." },
      { text: "Those are different problems.", lit: true },
      { text: "So our B2B growth marketing work doesn't begin with a channel. It begins by following the journey from discovery to revenue and finding where it's breaking down." },
      { text: "We care about what happens commercially after the click. Traffic matters when the right people are arriving. Leads matter when they become genuine opportunities. Marketing matters when it contributes to growth." },
      { text: "If you don't need more leads at all, we'll tell you.", lit: true },
    ],
    chips: ["SEO", "Answer Engine Optimisation (AEO)", "B2B lead generation", "Demand generation", "Paid media", "Content marketing", "Conversion optimisation"],
    explore: { label: "Explore Growth", href: "/growth" },
    flow: ["Traffic", "Demand", "Pipeline", "Revenue"],
  },
  {
    colour: "var(--brand-blue)",
    num: "03",
    label: "Product",
    tagline: "Ideas to impact",
    icon: ICON.cube,
    question: "Build the right thing. Or fix what you've built.",
    body: [
      { text: "A roadmap full of features isn't a product strategy. Neither is building whatever the loudest customer asked for last week." },
      { text: "Product decisions start with understanding the problem you're solving, who you're solving it for and why solving it matters enough for someone to change their behaviour or pay for it." },
      { text: "Our B2B product strategy work can start before a product exists or after it's already in customers' hands.", lit: true },
      { text: "For something new, that can mean discovery, validating the problem, defining the proposition, scoping an MVP and getting it into the hands of real users." },
      { text: "For an existing product, the question might be different. Why aren't customers adopting this feature? Why has the roadmap become impossible to prioritise? Are we building what customers need or what individual customers request? Has the product drifted away from the market it originally served?" },
    ],
    chips: ["Product strategy consulting", "Fractional CPO", "Product discovery", "MVP scoping and delivery", "Roadmap and prioritisation"],
    explore: { label: "Explore Product", href: "/product-strategy" },
  },
  {
    colour: "var(--accent-pink)",
    num: "04",
    label: "Operational AI",
    tagline: "Real efficiency. Not hype.",
    icon: ICON.bolt,
    dark: true,
    question: "Where can AI actually take cost out and make us faster?",
    body: [
      { text: "There are plenty of places you could use AI. That's not particularly useful." },
      { text: "The better question is where people are repeatedly spending time, money or attention on work that technology can now do faster, cheaper or more consistently." },
      { text: "That's how we approach AI consulting. We start with the operation rather than the technology.", lit: true },
      { text: "Where are the repetitive workflows? Where does information have to be manually moved between systems? Where is the team recreating essentially the same work every week? Where is valuable data sitting unused because nobody has time to do anything with it?" },
      { text: "If AI earns its place, we use it. If it doesn't, we don't.", lit: true },
    ],
    chips: ["AI workflow automation", "AI automation consulting", "AI implementation", "Generative AI", "AI transformation"],
    explore: { label: "Explore Operational AI", href: "/ai-consulting" },
    quote: <>The technology comes <em>after the problem.</em></>,
  },
];

const VENN = [
  { fill: "var(--brand-cyan)", cx: 130, name: ["GTM", "Leadership"] },
  { fill: "var(--accent-green)", cx: 290, name: ["Growth"] },
  { fill: "var(--brand-blue)", cx: 450, name: ["Product"] },
  { fill: "var(--accent-pink)", cx: 610, name: ["Operational", "AI"] },
];

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

function IconChip({ path, className }: { path: ReactNode; className?: string }) {
  return (
    <span className={className}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">{path}</svg>
    </span>
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
          name: "Commview services",
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
      <section className="wwd-hero" aria-labelledby="wwd-h1">
        <span className="wwd-hero__beam" aria-hidden="true" />
        <div className="wrap wwd-hero__grid">
          <div className="wwd-hero__lead">
            <p className="eyebrow-x">What we do</p>
            <h1 className="wwd-hero__h1" id="wwd-h1">
              Four services. Usually you need <em>more than one.</em>
            </h1>
            <p className="wwd-hero__sub">A growth problem rarely sits neatly inside Marketing.</p>
            <div className="wwd-hero__body">
              <p>
                Sales might say the leads are wrong. Marketing might say the
                positioning isn't landing. Customers might be choosing a competitor
                for reasons nobody expected. The product might be solving the right
                problem for the wrong customer. Or the team might be spending hours
                every week doing work that could be automated.
              </p>
              <p>
                That's why our B2B consulting services span GTM Leadership, Growth,
                Product and Operational AI. Not because every business needs all
                four. Because you shouldn't have to diagnose the problem before you
                ask for help.
              </p>
            </div>
            <div className="wwd-hero__row">
              <a className="btn btn--cyan btn--lg" href="/diagnostic">Take the Diagnostic</a>
              <a className="btn btn--ghost btn--lg" href="/contact">Talk to us</a>
            </div>
          </div>
          <p className="wwd-hero__spec">B2B specialists<br />for scale-ups.</p>
        </div>

        <div className="wrap wwd-cards">
          {PILLARS.map((p) => (
            <a key={p.num} className="wwd-card" href={`#svc-${p.num}`} style={cvar(p.colour)}>
              <IconChip path={p.icon} className="wwd-card__ico" />
              <span className="wwd-card__label">{p.label}</span>
              <span className="wwd-card__tag">{p.tagline}</span>
              <span className="wwd-card__arw" aria-hidden="true">&rarr;</span>
            </a>
          ))}
        </div>
      </section>

      {/* ===== BROADER PERSPECTIVE + VENN ===== */}
      <section className="wwd-persp dark" aria-labelledby="wwd-persp-h">
        <div className="wrap">
          <p className="eyebrow-x">A broader perspective</p>
          <h2 className="wwd-persp__h" id="wwd-persp-h">Why we don't split growth problems neatly</h2>
          <div className="wwd-persp__cols">
            <div>
              <p>Businesses tend to organise themselves into functions. Customers don't experience them that way.</p>
              <p>A positioning problem can show up as poor lead quality.</p>
              <p>A product problem can show up as low conversion.</p>
              <p>A sales hand-off problem can make Marketing look ineffective.</p>
              <p>A weak ICP can waste money across paid media, content, sales and product development at the same time.</p>
              <p>And automating a broken process doesn't fix it. It just makes the broken process run faster.</p>
            </div>
            <div>
              <p>So we look across the business before deciding what needs to change.</p>
              <p>Sometimes the answer sits squarely inside one of our four services. Often it crosses two or three.</p>
              <p className="wwd-persp__lit">The problem determines the work. Not the other way around.</p>
            </div>
          </div>
          <figure className="wwd-venn">
            <svg viewBox="0 0 740 240" role="img" aria-label="The four services overlap: GTM Leadership, Growth, Product and Operational AI.">
              {VENN.map((v, i) => (
                <circle key={i} cx={v.cx} cy={120} r={95} fill={v.fill} fillOpacity={0.12} stroke={v.fill} strokeOpacity={0.65} strokeWidth={1.5} />
              ))}
              {VENN.map((v, i) => (
                <text key={"t" + i} x={v.cx} y={v.name.length > 1 ? 114 : 125} textAnchor="middle" className="wwd-venn__label" fill="var(--brand-polar)">
                  {v.name.map((line, j) => (
                    <tspan key={j} x={v.cx} dy={j === 0 ? 0 : 18}>{line}</tspan>
                  ))}
                </text>
              ))}
            </svg>
          </figure>
        </div>
      </section>

      {/* ===== PILLAR DETAIL SECTIONS ===== */}
      {PILLARS.map((p) => (
        <section
          key={p.num}
          id={`svc-${p.num}`}
          className={"wwd-svc" + (p.dark ? " dark" : "")}
          style={cvar(p.colour)}
          aria-labelledby={`svc-h-${p.num}`}
        >
          <div className="wrap wwd-svc__grid">
            <div className="wwd-svc__main">
              <p className="wwd-svc__eyebrow"><b>{p.num}</b> {p.label}</p>
              <h2 id={`svc-h-${p.num}`} className="wwd-svc__q">{p.question}</h2>
              <div className="wwd-svc__body">
                {p.body.map((para, i) => (
                  <p key={i} className={para.lit ? "wwd-svc__lit" : undefined}>{para.text}</p>
                ))}
              </div>
              <a className="wwd-svc__explore" href={p.explore.href}>
                {p.explore.label}<span aria-hidden="true"> &rarr;</span>
              </a>
            </div>
            <ul className="wwd-svc__list">
              {p.chips.map((c) => (
                <li key={c}><span className="wwd-svc__dash" aria-hidden="true" />{c}</li>
              ))}
            </ul>
            <aside className="wwd-svc__rail">
              <p className="wwd-svc__pull">{p.tagline}</p>
              {p.quote ? <p className="wwd-svc__quote">{p.quote}</p> : null}
              {p.flow ? (
                <p className="wwd-svc__flow">
                  {p.flow.map((s, i) => (
                    <span key={s}>{s}{i < p.flow!.length - 1 ? <i aria-hidden="true"> &rarr; </i> : null}</span>
                  ))}
                </p>
              ) : null}
            </aside>
          </div>
        </section>
      ))}

      {/* ===== CLOSING: DIAGNOSTIC ===== */}
      <section className="wwd-close" aria-labelledby="wwd-close-h">
        <div className="wrap wwd-close__grid">
          <div>
            <p className="eyebrow-x wwd-close__eye">Not sure which service you need?</p>
            <h2 id="wwd-close-h" className="wwd-close__h">You don't need to be.</h2>
            <div className="wwd-close__body">
              <p>Often you just know that something isn't working as well as it should. The Commview Business Diagnostic looks across GTM Leadership, Growth, Product and Operational AI to identify strengths, weaknesses, blind spots and where we'd investigate first.</p>
            </div>
            <div className="wwd-close__row">
              <a className="btn btn--cyan btn--lg" href="/diagnostic">Take the Diagnostic</a>
              <a className="btn btn--ghost btn--lg" href="/contact">Or talk to us</a>
            </div>
          </div>
          <aside className="wwd-close__aside">
            <p className="wwd-close__asideh">A more complete view.</p>
            <ul className="wwd-close__icons">
              {PILLARS.map((p) => (
                <li key={p.num} style={cvar(p.colour)}>
                  <IconChip path={p.icon} className="wwd-close__ico" />
                  <span>{p.label}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="wwd-faq" aria-labelledby="wwd-faq-h">
        <div className="wrap">
          <div className="wwd-faq__head">
            <div>
              <p className="eyebrow-x wwd-close__eye">FAQ</p>
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
