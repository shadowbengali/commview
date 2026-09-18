import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";

import { HomeInteractions } from "@/components/site/HomeInteractions";
import { HOME_JSON_LD } from "./homeJsonLd";
import "../../styles/home.css";

// Locked homepage, ported verbatim from reference/index.html. Copy must not be
// edited, reordered or paraphrased. Layout/behaviour come from home.css +
// HomeInteractions; the markup here only carries the (locked) content.

const cvar = (c: string): CSSProperties => ({ ["--c" as string]: c }) as CSSProperties;

export const metadata: Metadata = {
  title: {
    absolute:
      "B2B Specialists for Scale-Ups | GTM, Growth, Product & Operational AI | COMMVIEW",
  },
  description:
    "COMMVIEW is an operator-led B2B consultancy for scale-ups. GTM leadership, growth, product and operational AI. You bring the question. We find the answer. Then we help you do something about it.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "COMMVIEW",
    locale: "en_GB",
    url: "/",
    title: "B2B specialists for scale-ups | COMMVIEW",
    description:
      "You bring the question. We find the answer. Then we help you do something about it. GTM leadership, growth, product and operational AI for growing B2B businesses.",
    images: ["/og-commview.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "B2B specialists for scale-ups | COMMVIEW",
    description:
      "Operator-led GTM, growth, product and operational AI for scale-ups. From Insight to Impact.",
    images: ["/og-commview.png"],
  },
};

const QUESTIONS: string[] = [
  "Why isn't the marketing working?",
  "Why do customers keep choosing the competition?",
  "Where should we spend the next £100k?",
  "Why has the deal stalled?",
  "Why can't we find more customers?",
  "Why does it take so long to launch a campaign?",
  "Why aren't customers using the new features?",
  "Can we charge more for this?",
  "Why are we getting leads but not closing them?",
  "Why has growth flattened?",
  "Why isn't the website converting?",
  "Why does every launch feel like we're starting again?",
  "Which marketing is actually making us money?",
  "Do we need more leads, or are we wasting the ones we have?",
  "Should we build this feature at all?",
  "Why do Sales and Marketing disagree about the leads?",
  "Are we targeting the wrong customers?",
  "Is the positioning wrong, or is the product wrong?",
  "Can AI actually reduce our costs?",
  "Why are we paying three agencies and still joining the dots ourselves?",
];

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6 9.5l6 6 6-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: HOME_JSON_LD }}
      />

      <main id="main">
        {/* ============ HERO ============ */}
        <section className="hero dark" aria-labelledby="hero-h">
          <svg
            className="hero__slash"
            viewBox="0 0 400 800"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="g-slash" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#00E5FF" stopOpacity=".30" />
                <stop offset="1" stopColor="#5B4DF5" stopOpacity=".05" />
              </linearGradient>
            </defs>
            <polygon points="286,0 400,0 176,800 62,800" fill="url(#g-slash)" />
            <polygon points="344,0 358,0 134,800 120,800" fill="#00E5FF" opacity=".55" />
            <polygon points="372,0 378,0 154,800 148,800" fill="#5B4DF5" opacity=".7" />
          </svg>

          <div className="wrap hero__grid">
            <div className="hero__col">
              <h1 className="hero__h1" id="hero-h">
                B2B specialists for scale-ups.
              </h1>
            </div>

            <div className="tp hero__tp">
              <p className="tp__meta">
                <span className="tp__count">
                  <b id="tp-n">01</b> / 20
                </span>
                <span className="tp__rail" id="tp-rail" aria-hidden="true"></span>
                <span className="tp__label">Questions keeping you up at night…</span>
              </p>
              <div className="tp__viewport">
                <ul className="tp__track" id="tp-track">
                  {QUESTIONS.map((q, n) => (
                    <li
                      key={n}
                      className="tp__q"
                      {...(n === 0 ? { "data-live": "true" } : {})}
                    >
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p id="tp-live" className="sr" aria-live="polite"></p>
            </div>

            <p className="hero__scroll eyebrow-x">
              <i
                style={{
                  display: "block",
                  width: "24px",
                  height: "1px",
                  background: "currentColor",
                }}
              ></i>
              Scroll
            </p>

            <aside className="hero__aside">
              <p className="lede" style={{ fontWeight: 600 }}>
                You bring the question.
              </p>
              <p className="lede dim">
                We find the answer. Then we help you do something about it.
              </p>
              <div className="hero__cta">
                <a className="btn btn--cyan btn--lg" href="#">
                  Talk to us
                </a>
              </div>
            </aside>
          </div>
        </section>

        {/* ============ TRUST ============ */}
        <section className="trust" aria-labelledby="trust-h">
          <div className="wrap trust__in">
            <h2 className="eyebrow-x" id="trust-h">
              Experience built at
            </h2>
            <p className="trust__names">
              <span>Vodafone Business</span>
              <span>ADI Global</span>
              <span>Distrelec</span>
              <span>Travis Perkins</span>
            </p>
          </div>
        </section>

        {/* ============ PROBLEM ============ */}
        <section className="problem" aria-labelledby="problem-h">
          <div className="wrap problem__in">
            <span className="problem__tick" aria-hidden="true"></span>
            <h2 id="problem-h">You know something isn't working.</h2>

            <ul className="symptoms">
              <li className="symptom" style={cvar("var(--accent-green)")}>
                <i aria-hidden="true"></i>
                <span>
                  Maybe <b>growth</b> has <b>slowed</b>.
                </span>
              </li>
              <li className="symptom" style={cvar("var(--brand-cyan)")}>
                <i aria-hidden="true"></i>
                <span>
                  Maybe you're spending more on marketing without seeing{" "}
                  <b>more pipeline</b>.
                </span>
              </li>
              <li className="symptom" style={cvar("var(--brand-blue)")}>
                <i aria-hidden="true"></i>
                <span>
                  Maybe Sales says the <b>leads aren't good enough</b>.
                </span>
              </li>
              <li className="symptom" style={cvar("var(--accent-pink)")}>
                <i aria-hidden="true"></i>
                <span>
                  Maybe something that should take two weeks{" "}
                  <b>takes two months</b>.
                </span>
              </li>
            </ul>

            <svg className="wires" id="wires" aria-hidden="true"></svg>

            <figure className="venn">
              <svg
                viewBox="0 0 760 586"
                role="img"
                aria-label="The four disciplines overlap: GTM Leadership, Growth, Product and Operational AI, meeting where the real problem sits."
              >
                <g className="venn__fields">
                  <ellipse cx="380" cy="200" rx="178" ry="146" fill="var(--brand-cyan)" />
                  <ellipse cx="248" cy="310" rx="178" ry="146" fill="var(--accent-green)" />
                  <ellipse cx="512" cy="310" rx="178" ry="146" fill="var(--brand-blue)" />
                  <ellipse cx="380" cy="420" rx="178" ry="146" fill="var(--accent-pink)" />
                </g>
                <g className="venn__labels">
                  <text x="380" y="126" className="venn__name">GTM LEADERSHIP</text>
                  <text x="380" y="150" className="venn__caps">Positioning · ICP · Pipeline</text>

                  <text x="196" y="300" className="venn__name">GROWTH</text>
                  <text x="196" y="324" className="venn__caps">Content · Conversion · Analytics</text>

                  <text x="566" y="300" className="venn__name">PRODUCT</text>
                  <text x="566" y="324" className="venn__caps">Requirements · User journeys · Launch</text>

                  <text x="380" y="478" className="venn__name">OPERATIONAL AI</text>
                  <text x="380" y="502" className="venn__caps">Reporting · Lead scoring · Automation</text>
                </g>
                <g id="venn-core">
                  <circle cx="380" cy="310" r="62" fill="var(--brand-charcoal)" />
                  <text x="380" y="303" className="venn__core">THE PROBLEMS</text>
                  <text x="380" y="323" className="venn__core">OVERLAP</text>
                </g>
              </svg>
            </figure>

            <ul className="venn-legend">
              <li style={cvar("var(--brand-cyan)")}>
                <i aria-hidden="true"></i>
                <b>GTM Leadership</b>
                <span>Positioning · ICP · Pipeline</span>
              </li>
              <li style={cvar("var(--accent-green)")}>
                <i aria-hidden="true"></i>
                <b>Growth</b>
                <span>Content · Conversion · Analytics</span>
              </li>
              <li style={cvar("var(--brand-blue)")}>
                <i aria-hidden="true"></i>
                <b>Product</b>
                <span>Requirements · User journeys · Launch</span>
              </li>
              <li style={cvar("var(--accent-pink)")}>
                <i aria-hidden="true"></i>
                <b>Operational AI</b>
                <span>Reporting · Lead scoring · Automation</span>
              </li>
            </ul>

            <div className="pivot">
              <p className="pivot__a">The difficult part isn't always fixing it.</p>
              <p className="pivot__b">It's working out what's actually wrong.</p>
              <div className="pivot__tail">
                <p>
                  Most businesses don't have neat GTM problems, Growth problems,
                  Product problems or AI problems.
                </p>
                <p>The problems overlap.</p>
                <p>
                  That's why we look across the business before deciding what
                  needs to change.
                </p>
              </div>

              <div className="problem__cta">
                <span className="problem__cta-rule" aria-hidden="true"></span>
                <a className="btn btn--cyan btn--lg btn--wide" href="#diagnostic">
                  Take the Diagnostic
                </a>
                <p className="small dim">
                  Takes around 5 minutes. No sales call required.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============ HOW WE WORK ============ */}
        <section className="how dark" id="how-we-work" aria-labelledby="how-h">
          <div className="wrap">
            <header className="how__head">
              <h2 className="eyebrow-x" id="how-h">How we work</h2>
            </header>

            <div className="stages">
              <article className="stage" style={cvar("var(--brand-cyan)")}>
                <p className="stage__head">
                  <b>01</b>
                  <i aria-hidden="true"></i>
                  <span>Insight</span>
                </p>
                <h3 className="stage__promise">Find out what's actually going on.</h3>
                <div className="stage__body">
                  <p>Start with the question.</p>
                  <p>
                    Look at the customers, market, product, data, positioning,
                    pipeline and what the team is actually doing.
                  </p>
                  <p>Find the problem before prescribing the answer.</p>
                </div>
              </article>
              <article className="stage" style={cvar("var(--accent-orange)")}>
                <p className="stage__head">
                  <b>02</b>
                  <i aria-hidden="true"></i>
                  <span>Momentum</span>
                </p>
                <h3 className="stage__promise">Do something about it.</h3>
                <div className="stage__body">
                  <p>Fix the positioning.</p>
                  <p>Change the GTM.</p>
                  <p>Build the campaign.</p>
                  <p>Improve the product.</p>
                  <p>Sort the systems.</p>
                  <p>Launch the thing.</p>
                  <p>We don't stop at telling you what needs to happen.</p>
                </div>
              </article>
              <article className="stage" style={cvar("var(--accent-green)")}>
                <p className="stage__head">
                  <b>03</b>
                  <i aria-hidden="true"></i>
                  <span>Impact</span>
                </p>
                <h3 className="stage__promise">Prove it made a difference.</h3>
                <div className="stage__body">
                  <p>
                    Whatever we're trying to change, we agree how we'll know if it
                    worked.
                  </p>
                </div>
              </article>
            </div>

            <div className="how__close">
              <h3>From Insight to Impact.</h3>
              <span className="how__gradient" aria-hidden="true"></span>
              <p className="how__note">
                No frameworks for frameworks' sake. No 40-slide deck for your team
                to figure out afterwards.
              </p>
              <p className="how__note how__note--lit">Work moves forward every week.</p>
            </div>
          </div>
        </section>

        {/* ============ WHAT WE DO ============ */}
        <section className="work" id="what-we-do" aria-labelledby="work-h">
          <div className="wrap">
            <header className="work__head">
              <span className="work__tick" aria-hidden="true"></span>
              <p className="eyebrow-x">What we do</p>
              <h2 id="work-h">
                Different questions.
                <br />
                Different answers.
                <br />
                <em>Usually more than one.</em>
              </h2>
            </header>

            <div className="caps">
              <svg
                className="caps__arcs"
                viewBox="0 0 1200 300"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <g className="caps__fills">
                  <ellipse cx="150" cy="300" rx="235" ry="300" fill="var(--brand-cyan)" />
                  <ellipse cx="450" cy="300" rx="235" ry="300" fill="var(--accent-green)" />
                  <ellipse cx="750" cy="300" rx="235" ry="300" fill="var(--brand-blue)" />
                  <ellipse cx="1050" cy="300" rx="235" ry="300" fill="var(--accent-pink)" />
                </g>
                <g className="caps__rings">
                  <ellipse cx="150" cy="300" rx="235" ry="300" stroke="var(--brand-cyan)" />
                  <ellipse cx="450" cy="300" rx="235" ry="300" stroke="var(--accent-green)" />
                  <ellipse cx="750" cy="300" rx="235" ry="300" stroke="var(--brand-blue)" />
                  <ellipse cx="1050" cy="300" rx="235" ry="300" stroke="var(--accent-pink)" />
                </g>
              </svg>
              <div className="caps__grid">
                <CapColumn
                  c="var(--brand-cyan)"
                  num="01"
                  id="gtm-leadership"
                  name="GTM Leadership"
                  q="How do we actually reach and win these customers?"
                  line="Positioning. ICP. Routes to market. Demand generation. Pipeline. Sales hand-off. Operating rhythm."
                  expanded
                />
                <CapColumn
                  c="var(--accent-green)"
                  num="02"
                  id="growth"
                  name="Growth"
                  q="Why isn't the marketing producing more growth?"
                  line="SEO. AEO/GEO. Paid. Content. Websites. Conversion. Email. CRM. Automation. Analytics."
                />
                <CapColumn
                  c="var(--brand-blue)"
                  num="03"
                  id="product"
                  name="Product"
                  q="Build the right thing. Or fix what you've built."
                  line="Customer problem. Product strategy. Prioritisation. Requirements. User journeys. Launch."
                />
                <CapColumn
                  c="var(--accent-pink)"
                  num="04"
                  id="operational-ai"
                  name="Operational AI"
                  q="Where can AI actually take cost out and make us faster?"
                  line="Content. Translation. Reporting. Lead scoring. Sales intelligence. Workflow automation."
                />
              </div>
            </div>

            <div className="details">
              <CapPanel
                c="var(--brand-cyan)"
                id="gtm-leadership"
                num="01"
                tag="GTM LEADERSHIP"
                q="How do we actually reach and win these customers?"
                chips={[
                  "Positioning",
                  "ICP",
                  "Routes to market",
                  "Demand generation",
                  "Pipeline",
                  "Sales hand-off",
                  "Operating rhythm",
                ]}
                explore="Explore GTM Leadership"
              >
                <p>
                  We work out how customers actually buy, where the current route
                  to market is breaking down and what needs to happen next.
                </p>
                <p>
                  Project support, or someone senior taking ownership inside the
                  business as a fractional GTM lead.
                </p>
              </CapPanel>
              <CapPanel
                c="var(--accent-green)"
                id="growth"
                num="02"
                tag="GROWTH"
                q="Why isn't the marketing producing more growth?"
                chips={[
                  "SEO",
                  "AEO/GEO",
                  "Paid",
                  "Content",
                  "Websites",
                  "Conversion",
                  "Email",
                  "CRM",
                  "Automation",
                  "Analytics",
                ]}
                explore="Explore Growth"
                hidden
              >
                <p>
                  We look at how customers find you, what happens when they arrive,
                  what makes them convert and where you're losing them.
                </p>
                <p>Then we work on what will make the biggest difference.</p>
                <p>
                  No channel quotas. No selling you SEO because we happen to sell
                  SEO.
                </p>
              </CapPanel>
              <CapPanel
                c="var(--brand-blue)"
                id="product"
                num="03"
                tag="PRODUCT"
                q="Build the right thing. Or fix what you've built."
                chips={[
                  "Customer problem",
                  "Product strategy",
                  "Prioritisation",
                  "Requirements",
                  "User journeys",
                  "Launch",
                ]}
                explore="Explore Product"
                hidden
              >
                <p>
                  New product from zero. Or a roadmap that's drifted from what
                  customers actually need.
                </p>
                <p>
                  Project work, or fractional product leadership inside an existing
                  team.
                </p>
              </CapPanel>
              <CapPanel
                c="var(--accent-pink)"
                id="operational-ai"
                num="04"
                tag="OPERATIONAL AI"
                q="Where can AI actually take cost out and make us faster?"
                chips={[
                  "Content",
                  "Translation",
                  "Reporting",
                  "Lead scoring",
                  "Sales intelligence",
                  "Workflow automation",
                ]}
                explore="Explore Operational AI"
                hidden
              >
                <p>
                  We find where AI genuinely earns its place inside the operation,
                  ship the top opportunities and train your team to run them.
                </p>
                <p>If AI earns its place, we use it. If it doesn't, we don't.</p>
              </CapPanel>
            </div>
          </div>
        </section>

        {/* ============ DIAGNOSTIC ============ */}
        <section className="diag dark" id="diagnostic" aria-labelledby="diag-h">
          <div className="wrap diag__grid">
            <div className="diag__pitch">
              <p className="eyebrow-x">Still not sure what's actually wrong?</p>
              <h2 id="diag-h">
                Take the Commview
                <br />
                <em>Business Diagnostic.</em>
              </h2>

              <div className="diag__lede">
                <p>
                  You don't need to know whether you have a GTM problem, a Growth
                  problem, a Product problem or an AI problem. That's what the
                  diagnostic is for.
                </p>
                <p>
                  Start with the question that's bothering you. We'll ask a few
                  more about the business and use your answers to look for patterns
                  across:
                </p>
              </div>

              <p className="diag__areas">
                GTM Leadership <i>·</i> Growth <i>·</i> Product <i>·</i> Operational
                AI
              </p>

              <p className="eyebrow-x diag__label">You'll see:</p>
              <ul className="outcomes">
                <li style={cvar("var(--accent-green)")}>
                  <b>Strengths</b>
                  <span>what's already working.</span>
                </li>
                <li style={cvar("var(--accent-orange)")}>
                  <b>Weaknesses</b>
                  <span>what needs attention.</span>
                </li>
                <li style={cvar("var(--accent-yellow)")}>
                  <b>Blind spots</b>
                  <span>what you might not be seeing yet.</span>
                </li>
                <li style={cvar("var(--brand-blue)")}>
                  <b>First moves</b>
                  <span>where we'd start.</span>
                </li>
              </ul>

              <div className="diag__promise">
                <p>You'll see your initial assessment straight away.</p>
                <p>
                  Want the complete analysis? Leave your details and we'll send you
                  the full report with what we'd investigate and what we'd
                  prioritise next.
                </p>
              </div>

              <div className="diag__cta">
                <a className="btn btn--cyan btn--lg" href="#">
                  Take the Diagnostic
                </a>
                <p className="diag__terms">
                  Takes around 5 minutes.
                  <br />
                  No sales call required.
                </p>
              </div>
            </div>

            <div className="ui" aria-hidden="true">
              <div className="ui__bar">
                <span className="ui__dot"></span>
                <span className="ui__dot"></span>
                <span className="ui__dot"></span>
                <span className="ui__title">Commview Business Diagnostic</span>
              </div>
              <div className="ui__body">
                <p className="ui__step">Question 01 / 08</p>
                <div className="ui__progress">
                  <i></i>
                </div>

                <p className="ui__q">What's keeping you awake?</p>

                <div className="ui__opts">
                  <div className="ui__opt" data-sel="">
                    <i></i>Why are we getting leads but not closing them?
                  </div>
                  <div className="ui__opt">
                    <i></i>Why do customers keep choosing the competition?
                  </div>
                  <div className="ui__opt">
                    <i></i>Why has growth flattened?
                  </div>
                  <div className="ui__opt">
                    <i></i>Where should we spend the next £100k?
                  </div>
                </div>

                <div className="ui__foot">
                  <span className="ui__next">Next</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ PROOF ============ */}
        <section className="proof" id="work" aria-labelledby="proof-h">
          <div className="wrap">
            <div className="proof__head">
              <h2 id="proof-h">We've dealt with difficult questions before.</h2>
            </div>

            <div className="figs">
              <div className="fig" style={cvar("var(--brand-charcoal)")}>
                <b>£5m+</b>
                <span>Marketing-influenced pipeline</span>
                <i>Vodafone Business</i>
              </div>
              <div className="fig" style={cvar("var(--brand-blue)")}>
                <b>£690k</b>
                <span>Annualised cost savings</span>
                <i>V-Hub</i>
              </div>
              <div className="fig" style={cvar("var(--brand-charcoal)")}>
                <b>45,000+</b>
                <span>Users across 10 markets</span>
                <i>V-Hub</i>
              </div>
              <div className="fig" style={cvar("var(--accent-green)")}>
                <b>£80m</b>
                <span>eCommerce P&L experience</span>
                <i>ADI Global</i>
              </div>
            </div>

            <div className="proof__cta">
              <a className="btn btn--ink btn--lg" href="#">
                Talk to us
              </a>
              <a
                className="explore"
                style={{ ["--accent" as string]: "var(--brand-blue)" } as CSSProperties}
                href="#"
              >
                See our work
              </a>
            </div>
          </div>
        </section>

        {/* ============ OPERATOR-LED ============ */}
        <section className="op" id="about" aria-labelledby="about-h">
          <div className="wrap op__grid">
            <div>
              <p className="eyebrow-x" style={{ marginBottom: "var(--space-6)" }}>
                About
              </p>
              <h2 id="about-h">Operator-led.</h2>
            </div>
            <div>
              <div className="flow lede">
                <p>
                  We've built and run Product, GTM, demand generation and
                  eCommerce inside businesses including Vodafone Business, ADI
                  Global, Distrelec and Travis Perkins.
                </p>
                <p className="dim">
                  Now we bring that experience into growing B2B businesses.
                </p>
              </div>
              <div
                className="flow body"
                style={{ marginTop: "var(--space-8)", color: "var(--text-secondary)" }}
              >
                <p>We think about the problem.</p>
                <p>We get into the work.</p>
                <p>
                  And when something needs specialist expertise, we bring in the
                  right people.
                </p>
              </div>
              <p className="op__key">
                Small team. <span>Senior people.</span> Hands-on work.
              </p>
              <a
                className="explore"
                style={{ ["--accent" as string]: "var(--brand-cyan)" } as CSSProperties}
                href="#"
              >
                More about Commview
              </a>
            </div>
          </div>
        </section>

        {/* ============ AGENCIES ============ */}
        <section className="ag dark" id="agencies" aria-labelledby="ag-h">
          <div className="wrap ag__panel">
            <div>
              <p className="eyebrow-x" style={{ marginBottom: "var(--space-6)" }}>
                For agencies
              </p>
              <h2 id="ag-h">We also work with agencies.</h2>
              <p className="lede dim" style={{ marginTop: "var(--space-6)" }}>
                When your client asks a question your agency wasn't built to
                answer.
              </p>
              <a
                className="btn btn--ghost"
                style={{ marginTop: "var(--space-8)" }}
                href="#"
              >
                Commview for Agencies
              </a>
            </div>
            <div>
              <div className="ag__lines">
                <p>Your client wants GTM strategy.</p>
                <p>They need senior product thinking.</p>
                <p>They want to know what AI should actually change.</p>
                <p>They need someone senior in the room for the pitch.</p>
                <p>
                  Or the work has moved beyond the specialist service you were
                  originally hired to provide.
                </p>
              </div>
              <p className="body dim" style={{ marginTop: "var(--space-6)" }}>
                We can work alongside your team, client-facing or behind the
                scenes.
              </p>
              <p className="ag__stay">Your client stays your client.</p>
            </div>
          </div>
        </section>

        {/* ============ FINAL CTA ============ */}
        <section className="final dark" aria-labelledby="final-h">
          <span className="final__glow" aria-hidden="true"></span>
          <div className="wrap">
            <p className="eyebrow-x" style={{ marginBottom: "var(--space-6)" }}>
              One more question
            </p>
            <h2 id="final-h">What's keeping you awake?</h2>
            <div className="final__sub">
              <p>You don't need to know the answer.</p>
              <p style={{ color: "var(--brand-cyan)" }}>Start with the question.</p>
              <p style={{ marginTop: "var(--space-4)" }}>
                Tell us what's happening. We'll tell you if we think we can help.
              </p>
            </div>
            <div className="final__cta">
              <a className="btn btn--cyan btn--lg" href="#">
                Talk to us
              </a>
              <p className="small dim">No pitch deck. No obligation.</p>
            </div>
          </div>
        </section>
      </main>

      <HomeInteractions />
    </>
  );
}

function CapColumn({
  c,
  num,
  id,
  name,
  q,
  line,
  expanded,
}: {
  c: string;
  num: string;
  id: string;
  name: string;
  q: string;
  line: string;
  expanded?: boolean;
}) {
  return (
    <article className="cap" style={cvar(c)}>
      <p className="cap__num">
        <i aria-hidden="true"></i>
        {num}
      </p>
      <h3 className="cap__name" id={id}>
        {name}
      </h3>
      <p className="cap__q">{q}</p>
      <p className="cap__line">{line}</p>
      <button
        className="cap__open"
        type="button"
        aria-expanded={expanded ? true : false}
        aria-controls={`panel-${id}`}
        data-target={id}
      >
        <span className="sr">Open {name}</span>
        <Chevron />
      </button>
    </article>
  );
}

function CapPanel({
  c,
  id,
  num,
  tag,
  q,
  chips,
  explore,
  hidden,
  children,
}: {
  c: string;
  id: string;
  num: string;
  tag: string;
  q: string;
  chips: string[];
  explore: string;
  hidden?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className="detail"
      id={`panel-${id}`}
      style={cvar(c)}
      role="region"
      aria-labelledby={id}
      hidden={hidden}
    >
      <div className="detail__lede">
        <p className="detail__tag">
          <b>{num}</b> / {tag}
        </p>
        <p className="detail__q">{q}</p>
        <div className="detail__body">{children}</div>
        <a className="explore" href="#">
          {explore}
        </a>
      </div>
      <div className="detail__work">
        <p className="eyebrow-x">In this area we work on</p>
        <ul className="chips">
          {chips.map((chip) => (
            <li key={chip}>{chip}</li>
          ))}
        </ul>
      </div>
      <aside className="detail__rail">
        <p className="small dim">
          That's why we look across the business before deciding what needs to
          change.
        </p>
      </aside>
    </div>
  );
}
