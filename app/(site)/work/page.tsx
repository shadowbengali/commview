import type { CSSProperties } from "react";
import type { Metadata } from "next";

import { CaseStudies } from "@/components/work/CaseStudies";
import { CASES, CAP_COLOUR, CAP_HREF, type Cap } from "@/lib/work/cases";

import "../../../styles/work.css";

// /work — evidence of delivery, built to the approved mock-up on the design
// system. The unit of evidence is the problem/workstream. Current engagements
// are anonymous (no logos); proven work carries company wordmarks + outcomes.

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://commview-green.vercel.app";
const cvar = (c: string): CSSProperties => ({ ["--c" as string]: c }) as CSSProperties;

export const metadata: Metadata = {
  title: { absolute: "B2B Consulting Case Studies | GTM, Growth, Product & AI | Commview" },
  description:
    "See how Commview has solved B2B GTM, growth, product and operational AI problems, plus the live work we're tackling now.",
  alternates: { canonical: "/work" },
};

const WORKSTREAMS: { n: string; cap: Cap; title: string; body: string }[] = [
  { n: "01", cap: "Operational AI", title: "Making agency reporting faster with AI", body: "Helping a digital agency redesign its reporting process around AI, identifying where repetitive analysis and reporting work can be accelerated while keeping human review and judgement in the loop. The work includes data analysis, insight generation, workflow design and creating a repeatable approach the wider team can use." },
  { n: "02", cap: "Product", title: "Building a property management platform", body: "Supporting an estate agency to design and build its own property management platform, from discovery and workflow mapping through to requirements and delivery. The product brings core property operations together with Open Banking and third-party services for background checks, AML and related processes." },
  { n: "03", cap: "Operational AI", title: "Putting AI into a legal environment", body: "Working with a solicitors' firm on practical AI adoption, including governance, guardrails, model selection and defining the outputs different users actually need. Translating those requirements into workflows, specifications and user stories so AI can be introduced in a controlled, useful way." },
  { n: "04", cap: "Growth", title: "Building an EMEA growth engine", body: "Developing an integrated growth strategy for a furniture business across EMEA, connecting SEO, social, email and paid media rather than treating them as separate channels. The work also covers measurement and understanding where digital activity influences demand across a more complex B2B buying journey." },
  { n: "05", cap: "Growth", title: "SEO, AEO and GEO across multiple markets", body: "Supporting a digital agency on SEO, AEO and GEO strategy across B2B, hospitality and leisure, spanning the UK, UAE, Asia and America. The work covers technical foundations, search demand, content, entity visibility, AI discovery and measurement." },
  { n: "06", cap: "GTM Leadership", title: "Helping startups find their route to market", body: "Supporting several startups with the commercial questions that come before scaling demand, including ICP, positioning, proposition, product-market fit, messaging, buying journeys and the GTM model needed to turn a product into a repeatable commercial proposition." },
];

export default function WorkPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "Work",
        url: `${SITE}/work`,
        about: "B2B consulting case studies across GTM, growth, product and operational AI.",
        mainEntity: {
          "@type": "ItemList",
          itemListElement: CASES.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: `${c.company}${c.unit ? ` ${c.unit}` : ""}: ${c.headline}`,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "Work", item: `${SITE}/work` },
        ],
      },
    ],
  };

  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ===== HERO ===== */}
      <section className="wk-hero dark" aria-labelledby="wk-h1">
        <div className="wrap wk-hero__grid">
          <div className="wk-hero__lead">
            <p className="eyebrow-x">Work</p>
            <h1 className="wk-hero__h1" id="wk-h1">
              Real problems.<br /><span className="wk-grad">Real progress.</span>
            </h1>
            <p className="wk-hero__body">
              From live engagements to proven outcomes, this is the work we do across GTM, growth,
              product and operational AI.
            </p>
          </div>

          <div className="wk-signal" aria-hidden="true">
            <div className="wk-signal__meta">
              <ul className="wk-signal__words">
                <li>Insight</li>
                <li>Momentum</li>
                <li>Impact</li>
              </ul>
              <p className="wk-signal__note">Different problems.<br />Same approach.</p>
            </div>
            <svg className="wk-signal__slash" viewBox="0 0 260 320" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="wkBeam" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0" stopColor="var(--accent-pink)" />
                  <stop offset="0.5" stopColor="var(--brand-blue)" />
                  <stop offset="1" stopColor="var(--brand-cyan)" />
                </linearGradient>
              </defs>
              <path d="M150 -20 L196 -20 L96 340 L50 340 Z" fill="url(#wkBeam)" />
            </svg>
          </div>
        </div>
      </section>

      {/* ===== CURRENT ENGAGEMENTS ===== */}
      <section className="wk-eng" aria-labelledby="wk-eng-h">
        <div className="wrap">
          <div className="wk-head">
            <div>
              <p className="eyebrow-x wk-eye">Current engagements</p>
              <h2 id="wk-eng-h">What we&rsquo;re working on now.</h2>
            </div>
            <div className="wk-head__intro">
              <p className="wk-head__strong">Live work. Different problems. Different capabilities.</p>
              <p>A snapshot of the problems we&rsquo;re working on right now. Some sit inside the same organisation. We show them separately because the work, expertise and outcomes are different. We&rsquo;ll publish the results when there&rsquo;s something useful to share.</p>
            </div>
          </div>

          <ol className="wk-streams">
            {WORKSTREAMS.map((w) => (
              <li className="wk-stream" style={cvar(CAP_COLOUR[w.cap])} key={w.n}>
                <span className="wk-stream__n">{w.n}</span>
                <div className="wk-stream__c">
                  <a className="wk-stream__tag" href={CAP_HREF[w.cap]}>{w.cap}</a>
                  <h3 className="wk-stream__title">{w.title}</h3>
                  <p className="wk-stream__body">{w.body}</p>
                  <span className="wk-stream__status">In progress</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ===== PROVEN WORK ===== */}
      <section className="wk-proven" aria-labelledby="wk-proven-h">
        <div className="wrap">
          <div className="wk-head">
            <div>
              <p className="eyebrow-x wk-eye">Proven work</p>
              <h2 id="wk-proven-h">Selected case studies.</h2>
            </div>
            <div className="wk-head__intro">
              <p className="wk-head__strong">Different challenges. Same principle.</p>
              <p>Understand what&rsquo;s actually going on, get the right thing moving, and prove what changed.</p>
            </div>
          </div>

          <CaseStudies />
        </div>
      </section>

      {/* ===== CLOSING CTA ===== */}
      <section className="wk-cta dark" aria-labelledby="wk-cta-h">
        <div className="wrap wk-cta__grid">
          <div>
            <p className="eyebrow-x wk-eye">Let&rsquo;s talk</p>
            <h2 id="wk-cta-h">Got a similar problem?</h2>
            <p className="wk-cta__body">Bring us the question. We&rsquo;ll find the answer.</p>
          </div>
          <a className="btn btn--cyan btn--lg" href="/contact">Talk to us</a>
        </div>
      </section>
    </main>
  );
}
