import type { ReactNode } from "react";
import type { Metadata } from "next";

import "../../../styles/fractional-cmo.css";

// /fractional-cmo — GTM Leadership pillar page. Copy from the client content doc
// (Commview_Fractional_CMO_Final_Content.docx), laid out to the approved design.
// Header/footer are the shared (site) chrome.

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://commview-green.vercel.app";

export const metadata: Metadata = {
  title: { absolute: "Fractional CMO for B2B Scale-ups | CommView" },
  description:
    "Fractional CMO services for B2B scale-ups. Senior GTM leadership across positioning, demand and pipeline, with hands-on execution.",
  alternates: { canonical: "/fractional-cmo" },
};

// ---- Hero diagram: Leadership / Commview / Execution cylinders (SVG, live text)
const RX = 195, RY = 46, H = 58, CX = 290;
const bodyPath = (ty: number) =>
  `M ${CX - RX},${ty} L ${CX - RX},${ty + H} A ${RX},${RY} 0 0 0 ${CX + RX},${ty + H} L ${CX + RX},${ty} A ${RX},${RY} 0 0 1 ${CX - RX},${ty} Z`;
const spokes = (ty: number) =>
  [30, 90, 150, 210, 270, 330]
    .map((a) => {
      const r = (a * Math.PI) / 180;
      return `M ${CX},${ty} L ${(CX + RX * Math.cos(r)).toFixed(1)},${(ty + RY * Math.sin(r)).toFixed(1)}`;
    })
    .join(" ");

function Cyl({ ty, label, cyan }: { ty: number; label: string; cyan?: boolean }) {
  const stroke = cyan ? "#7df6ff" : "#33506b";
  return (
    <g>
      <path d={bodyPath(ty)} fill={cyan ? "url(#fcBodyCyan)" : "url(#fcBodyDark)"} stroke={stroke} strokeWidth={cyan ? 1.5 : 1} />
      <ellipse cx={CX} cy={ty} rx={RX} ry={RY} fill={cyan ? "url(#fcTopCyan)" : "url(#fcTopDark)"} stroke={stroke} strokeWidth={cyan ? 1.5 : 1} />
      <path d={spokes(ty)} fill="none" stroke={cyan ? "#bff8ff" : "#4a6a88"} strokeWidth="1" strokeOpacity={cyan ? 0.5 : 0.28} />
      <text x={CX} y={ty + 38} textAnchor="middle" className="fc-diagram__lbl" fontSize="26" fill={cyan ? "#062a33" : "#f8fafc"}>
        {label}
      </text>
    </g>
  );
}

function Note({ yc, lines }: { yc: number; lines: string[] }) {
  return (
    <g>
      <path d={`M 490 ${yc} H 556 M 556 ${yc - 27} V ${yc + 27}`} fill="none" stroke="#33506b" strokeWidth="1" />
      {lines.map((l, i) => (
        <text key={l} x={576} y={yc - 24 + i * 24} className="fc-diagram__note">{l}</text>
      ))}
    </g>
  );
}

function LayerDiagram() {
  return (
    <svg viewBox="0 0 880 545" role="img" aria-label="Commview sits between leadership — set direction, find the opportunity, align the business — and execution — build the plan, get on the tools, deliver results — connecting the dots and driving the work.">
      <defs>
        <radialGradient id="fcTopDark" cx="50%" cy="42%" r="65%">
          <stop offset="0" stopColor="#33475e" />
          <stop offset="1" stopColor="#0d1620" />
        </radialGradient>
        <linearGradient id="fcBodyDark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1b2836" />
          <stop offset="1" stopColor="#0a1017" />
        </linearGradient>
        <radialGradient id="fcTopCyan" cx="50%" cy="42%" r="65%">
          <stop offset="0" stopColor="#d6fdff" />
          <stop offset="0.5" stopColor="#25e6ff" />
          <stop offset="1" stopColor="#06b6d4" />
        </radialGradient>
        <linearGradient id="fcBodyCyan" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0fbfe0" />
          <stop offset="1" stopColor="#075f78" />
        </linearGradient>
        <filter id="fcGlow" x="-70%" y="-70%" width="240%" height="240%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <filter id="fcGlowBig" x="-140%" y="-140%" width="380%" height="380%">
          <feGaussianBlur stdDeviation="30" />
        </filter>
        <radialGradient id="fcAmbient" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#12d3ef" stopOpacity="0.34" />
          <stop offset="0.55" stopColor="#0891b2" stopOpacity="0.12" />
          <stop offset="1" stopColor="#00e5ff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ambient wash + layered cyan bloom behind the middle cylinder */}
      <ellipse cx={CX} cy={279} rx={390} ry={225} fill="url(#fcAmbient)" />
      <ellipse cx={CX} cy={279} rx={RX + 48} ry={H + 66} fill="#00e5ff" opacity="0.5" filter="url(#fcGlowBig)" />
      <ellipse cx={CX} cy={279} rx={RX + 4} ry={H + 26} fill="#6cf3ff" opacity="0.6" filter="url(#fcGlowBig)" />

      {/* glowing connector beams */}
      <path d={`M ${CX} 176 V 210 M ${CX} 346 V 382`} stroke="#00e5ff" strokeWidth="8" strokeLinecap="round" filter="url(#fcGlowBig)" opacity="0.9" />
      <path d={`M ${CX} 178 V 208 M ${CX} 350 V 378`} stroke="#eafdff" strokeWidth="1.8" strokeLinecap="round" filter="url(#fcGlow)" />

      <Cyl ty={80} label="LEADERSHIP" />
      <Cyl ty={250} label="COMMVIEW" cyan />
      {/* bright rim bloom on the glowing cylinder's top edge */}
      <ellipse cx={CX} cy={250} rx={RX} ry={RY} fill="none" stroke="#c8fbff" strokeWidth="3" opacity="0.8" filter="url(#fcGlow)" />
      <Cyl ty={420} label="EXECUTION" />

      <Note yc={109} lines={["Set direction", "Find the opportunity", "Align the business"]} />
      <Note yc={279} lines={["Connect the dots", "Drive the work", "Keep it moving"]} />
      <Note yc={449} lines={["Build the plan", "Get on the tools", "Deliver results"]} />
    </svg>
  );
}

const SIGNS = [
  { n: "01", h: "Growth has flattened", p: "What got you here is no longer producing the same result. Before spending more, you need to understand whether the constraint is positioning, demand, conversion, pipeline or something else." },
  { n: "02", h: "Marketing is busy, but the commercial result is not there", p: "Campaigns are running and content is being published, but pipeline is not moving with it. That usually requires looking across the whole system rather than blaming a single channel." },
  { n: "03", h: "Sales and Marketing are not connected", p: "Marketing believes it is delivering leads. Sales says they are the wrong leads. The underlying problem may be ICP, qualification, intent, hand-off or weak feedback loops." },
  { n: "04", h: "Founder-led marketing has become a constraint", p: "The founder still owns positioning, approves campaigns and gets pulled into pipeline decisions. It worked to get here, but it is now slowing the business down." },
  { n: "05", h: "You need senior leadership without another permanent executive", p: "The problem is substantial enough to need experienced ownership, but the business does not need, or is not ready for, a full-time CMO." },
];

const NODES: { label: string; p: string; icon: ReactNode }[] = [
  { label: "Positioning", p: "Who are you for, what problem do you solve and why should the customer choose you?", icon: <path d="M12 3v18M3 12h18" /> },
  { label: "Ideal Customer Profile", p: "Which companies are most likely to buy, succeed, stay and create commercial value?", icon: <><circle cx="9" cy="8" r="3" /><path d="M15 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="17" cy="7" r="2" /></> },
  { label: "Routes to market", p: "How does this customer actually buy, and which route makes sense for the product and economics?", icon: <path d="M4 18l7-7 3 3 6-8" /> },
  { label: "Demand generation", p: "How do we create and capture relevant demand across the channels your buyers actually use?", icon: <><path d="M3 11l16-6-3 14-5-4-3 3z" /></> },
  { label: "Pipeline", p: "What happens after engagement, from qualification through opportunity creation and progression?", icon: <path d="M3 6h18l-7 8v5l-4 2v-7z" /> },
  { label: "Sales hand-off", p: "Do Marketing and Sales share definitions, data and feedback, or optimise different versions of the funnel?", icon: <><path d="M8 7l-4 4 4 4" /><path d="M16 7l4 4-4 4" /><path d="M4 11h16" /></> },
  { label: "Operating rhythm", p: "How do priorities, owners, measures and decisions turn the strategy into weekly work?", icon: <><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" /></> },
];

const COMPARE = {
  cols: ["Fractional CMO (Commview)", "Full-time CMO", "Interim CMO", "Agency"],
  rows: [
    ["Senior leadership", "Yes", "Yes", "Yes", "Varies"],
    ["Embedded in business", "Yes", "Yes", "Yes", "Usually limited"],
    ["Permanent hire", "No", "Yes", "No", "No"],
    ["Owns GTM direction", "Yes", "Yes", "Usually", "Usually scoped"],
    ["Execution", "Can be hands-on", "Depends on team", "Depends", "Within remit"],
    ["Cross-functional", "Yes", "Yes", "Yes", "Usually marketing"],
  ],
};

const STEPS = [
  { n: "01", h: "Understand", p: "Start with the commercial question that brought you to us." },
  { n: "02", h: "Diagnose", p: "Look across customer, positioning, acquisition, pipeline, sales, product and operating model where relevant." },
  { n: "03", h: "Prioritise", p: "Agree what matters, what happens first and what we will measure." },
  { n: "04", h: "Execute", p: "Do the work directly, alongside your team or with specialist capability where needed." },
  { n: "05", h: "Measure and adapt", p: "Check what changed. If the evidence challenges the original assumption, change course." },
];

const STATS = [
  { b: "10 markets", s: "Digital proposition scaled internationally" },
  { b: "£3m", s: "Marketing-influenced pipeline" },
  { b: "50%", s: "Run-cost reduction from £7m to £3.5m" },
  { b: "800%", s: "Organic growth in a previous demand-generation leadership role" },
];

const FAQS = [
  { q: "How many days a week does a fractional CMO work?", a: "It depends on the problem and the level of ownership required. Some businesses need a light leadership cadence, while others need a more embedded operator working across strategy and execution. Commview scopes the cadence after understanding the work rather than forcing every client into the same number of days." },
  { q: "How long does a fractional CMO engagement usually last?", a: "A fractional CMO engagement should last long enough to diagnose the problem, change the operating model and demonstrate whether the work is producing the intended result. The right duration depends on the starting point, internal capability and scale of change rather than an arbitrary minimum contract." },
  { q: "Will you work with our existing marketing team or agency?", a: "Yes. Commview can work with internal marketers, sales teams and existing agencies. The role is often to give those capabilities clearer direction, connect their work to the commercial strategy and fill gaps where required, rather than replacing people who are already doing useful work." },
  { q: "Do I need a fractional CMO or a Head of Marketing?", a: "A Head of Marketing is usually a permanent operational leadership hire. A fractional CMO is useful when you need senior strategic ownership without adding another full-time executive, particularly when the business is changing quickly or the right long-term structure is not yet clear." },
  { q: "Can a fractional CMO manage agencies and external suppliers?", a: "Yes. Managing external specialists can be part of the role. Commview can set the brief, make sure channel work supports the wider GTM strategy, review performance and challenge recommendations where necessary, while keeping responsibility for the overall commercial outcome inside the business." },
  { q: "Do you work remotely or inside the business?", a: "Both can work. Commview is Manchester-based and can combine remote working with in-person sessions where they materially improve the work. The operating model should fit the business and the problem rather than requiring meetings for their own sake." },
];

// Hero visual: "image" uses the supplied render (cropped into two legible
// parts on mobile); "svg" uses the live-text LayerDiagram. Flip to compare.
const HERO_MODE = "image" as "image" | "svg";

export default function FractionalCmoPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: "Fractional CMO",
        serviceType: "Fractional CMO",
        description:
          "Senior GTM leadership for B2B scale-ups across positioning, demand and pipeline, with hands-on execution.",
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
          { "@type": "ListItem", position: 2, name: "What We Do", item: `${SITE}/what-we-do` },
          { "@type": "ListItem", position: 3, name: "GTM Leadership", item: `${SITE}/fractional-cmo` },
        ],
      },
    ],
  };

  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ===== HERO ===== */}
      <section className="fc-hero dark" aria-labelledby="fc-h1">
        <div className="wrap fc-hero__grid">
          <div>
            <p className="eyebrow-x">Fractional CMO for B2B scale-ups</p>
            <h1 className="fc-hero__h1" id="fc-h1">
              <span>Strategic leadership.</span>{" "}
              <span>Hands-on execution.</span>{" "}
              <span>Real growth.</span>
            </h1>
            <p className="fc-hero__sub">
              A fractional CMO who doesn&rsquo;t just advise — but gets involved,
              fixes what&rsquo;s not working and makes it happen.
            </p>
            <div className="fc-hero__cta">
              <a className="btn btn--cyan btn--lg" href="/diagnostic">Take the Diagnostic &rarr;</a>
              <a className="btn btn--ghost btn--lg" href="/contact">Talk to us</a>
            </div>
          </div>
          {HERO_MODE === "image" ? (
            <div className="fc-shot">
              <img
                className="fc-shot__full"
                src="/fractional-cmo-hero.webp"
                width={1672}
                height={941}
                alt="CommView sits between leadership and execution — three stacked layers. Leadership: set direction, find the opportunity, align the business. CommView: connect the dots, drive the work, keep it moving. Execution: build the plan, get on the tools, deliver results."
              />
              <div className="fc-shot__split">
                <img
                  src="/fractional-cmo-hero-cylinders.webp"
                  width={890}
                  height={900}
                  alt="Three stacked layers — Leadership, CommView and Execution — with CommView glowing in the middle."
                />
                <img
                  src="/fractional-cmo-hero-notes.webp"
                  width={520}
                  height={900}
                  alt="What each layer does. Leadership: set direction, find the opportunity, align the business. CommView: connect the dots, drive the work, keep it moving. Execution: build the plan, get on the tools, deliver results."
                />
              </div>
            </div>
          ) : (
            <div className="fc-diagram">
              <LayerDiagram />
            </div>
          )}
        </div>
      </section>

      {/* ===== WHAT IS A FRACTIONAL CMO ===== */}
      <section className="fc-sec" aria-labelledby="fc-what">
        <div className="wrap fc-lead">
          <div>
            <p className="eyebrow-x" style={{ color: "var(--brand-cyan)" }}>What is a fractional CMO?</p>
            <h2 className="fc-lead__h" id="fc-what" style={{ marginTop: "var(--space-4)" }}>
              Senior marketing leadership for ambitious B2B companies.
            </h2>
          </div>
          <div className="fc-lead__body">
            <p>A fractional CMO is an experienced marketing leader who joins a business on a part-time basis and takes responsibility for its marketing and go-to-market direction without becoming a full-time executive.</p>
            <p>But there is a difference between having access to a CMO and having someone who actually takes ownership. Commview is built around the second model.</p>
            <p>We can work at leadership level on positioning, ICP, routes to market, budgets and commercial priorities, then get into the systems, data, content and customer journey underneath them. If the numbers do not make sense, we investigate them. If the hand-off between Marketing and Sales is not working, we get into the process. If the proposition is not landing, we work on it.</p>
          </div>
          <p className="fc-pull">
            Strategy and execution don&rsquo;t get handed to different people.
            <span>The person helping determine what needs to change stays close enough to the work to see whether it actually does.</span>
          </p>
        </div>
      </section>

      {/* ===== WHEN DO YOU NEED ONE — five signs ===== */}
      <section className="fc-sec fc-sec--tight" aria-labelledby="fc-signs">
        <div className="wrap">
          <div className="fc-signs__head">
            <p className="eyebrow-x" style={{ color: "var(--brand-cyan)" }}>When do you need a fractional CMO?</p>
            <h2 id="fc-signs" style={{ marginTop: "var(--space-3)" }}>Five signs it&rsquo;s time to bring one in.</h2>
          </div>
          <div className="fc-signs__grid">
            {SIGNS.map((s) => (
              <div className="fc-sign" key={s.n}>
                <b>{s.n}</b>
                <h3>{s.h}</h3>
                <p>{s.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHAT WE OWN — GTM operating system ===== */}
      <section className="fc-sec dark" aria-labelledby="fc-own">
        <div className="wrap">
          <div className="fc-own__head">
            <div>
              <p className="eyebrow-x">What we own</p>
              <h2 id="fc-own" style={{ marginTop: "var(--space-3)" }}>A complete go-to-market operating system.</h2>
            </div>
            <p className="fc-own__intro">The exact scope depends on the problem, but a Commview fractional CMO can connect the seven parts of the GTM system rather than treating them as separate marketing projects.</p>
          </div>
          <div className="fc-own__grid">
            {NODES.map((n) => (
              <div className="fc-node" key={n.label}>
                <span className="fc-node__ico">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {n.icon}
                  </svg>
                </span>
                <b>{n.label}</b>
                <p>{n.p}</p>
              </div>
            ))}
          </div>
          <p className="fc-own__more">
            <a href="/fractional-cmo/services">See all services &rarr;</a>
          </p>
        </div>
      </section>

      {/* ===== STILL ON THE TOOLS — venn ===== */}
      <section className="fc-sec" aria-labelledby="fc-tools">
        <div className="wrap fc-tools__grid">
          <div>
            <p className="eyebrow-x" style={{ color: "var(--brand-cyan)" }}>Still on the tools</p>
            <h2 className="fc-tools__h" id="fc-tools" style={{ marginTop: "var(--space-3)" }}>Leadership and execution, in one.</h2>
            <div className="fc-tools__body">
              <p>This is the biggest distinction in how Commview works. Seniority should not mean becoming detached from the work.</p>
              <p>We can sit in the leadership conversation about where the company should grow, then get into analytics to understand why a journey is not converting. We can define the content strategy and work on the content. We can identify a problem between systems and get into how they connect. We can spot friction in the signup journey and analyse what needs changing.</p>
              <p>That does not mean pretending one person is the best specialist at everything. Where deeper expertise is needed, we bring in the right capability. Commview stays close enough to make sure the execution still reflects the strategy.</p>
              <p className="lit">We don&rsquo;t just tell you what to do. We help you do it.</p>
            </div>
          </div>
          <figure className="fc-venn">
            <svg viewBox="0 0 520 350" role="img" aria-label="Leadership and execution in one person: where to grow, who to sell to and what's stopping pipeline, alongside doing the work.">
              <circle cx="180" cy="160" r="152" className="fc-venn__exec" fillOpacity="0.92" />
              <circle cx="345" cy="170" r="150" fill="var(--slate-light)" />
              <text x="150" y="120" textAnchor="middle" className="fc-venn__title" fill="var(--brand-polar)">LEADERSHIP</text>
              <text x="150" y="150" textAnchor="middle" className="fc-venn__line" fill="var(--brand-polar)">Where should we grow?</text>
              <text x="150" y="168" textAnchor="middle" className="fc-venn__line" fill="var(--brand-polar)">Who should we sell to?</text>
              <text x="150" y="186" textAnchor="middle" className="fc-venn__line" fill="var(--brand-polar)">What&rsquo;s stopping pipeline?</text>
              <text x="378" y="120" textAnchor="middle" className="fc-venn__title" fill="var(--brand-charcoal)">EXECUTION</text>
              <text x="378" y="148" textAnchor="middle" className="fc-venn__line" fill="var(--brand-charcoal)">Open Search Console.</text>
              <text x="378" y="166" textAnchor="middle" className="fc-venn__line" fill="var(--brand-charcoal)">Interrogate the CRM.</text>
              <text x="378" y="184" textAnchor="middle" className="fc-venn__line" fill="var(--brand-charcoal)">Rewrite the proposition.</text>
              <text x="378" y="202" textAnchor="middle" className="fc-venn__line" fill="var(--brand-charcoal)">Fix the journey.</text>
              <text x="378" y="220" textAnchor="middle" className="fc-venn__line" fill="var(--brand-charcoal)">Build the content plan.</text>
              <text x="262" y="176" textAnchor="middle" fontSize="26" fill="var(--brand-cyan)">+</text>
            </svg>
            <figcaption className="fc-venn__foot">Same person. Real momentum.</figcaption>
          </figure>
          <p className="fc-scribble" aria-hidden="true">Still on<br />the <u>tools.</u></p>
        </div>
      </section>

      {/* ===== HOW DOES IT COMPARE — table ===== */}
      <section className="fc-sec fc-sec--tight" aria-labelledby="fc-compare">
        <div className="wrap">
          <div className="fc-compare__head">
            <p className="eyebrow-x" style={{ color: "var(--brand-cyan)" }}>How does it compare?</p>
            <h2 id="fc-compare" style={{ marginTop: "var(--space-3)" }}>A different kind of CMO.</h2>
          </div>
          <div className="fc-tablewrap">
            <table className="fc-table">
              <thead>
                <tr>
                  <th scope="col"></th>
                  {COMPARE.cols.map((c, i) => (
                    <th scope="col" key={c} className={i === 0 ? "is-us" : undefined}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE.rows.map((row) => (
                  <tr key={row[0]}>
                    <th scope="row">{row[0]}</th>
                    {row.slice(1).map((cell, i) => (
                      <td key={i} className={i === 0 ? "is-us" : undefined}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ===== COST ===== */}
      <section className="fc-sec" aria-labelledby="fc-cost">
        <div className="wrap fc-cost__grid">
          <div>
            <p className="eyebrow-x" style={{ color: "var(--brand-cyan)" }}>What does a fractional CMO cost?</p>
            <h2 className="fc-cost__h" id="fc-cost" style={{ marginTop: "var(--space-3)" }}>A flexible investment for bigger returns.</h2>
          </div>
          <div className="fc-cost__body">
            <p>There is no single UK rate for a fractional CMO. Published pricing varies according to seniority, cadence, scope and how operational the engagement is. Some fractional leaders work mainly as advisers; others are embedded in the business and take responsibility for execution as well as direction.</p>
            <p className="fc-todo">
              TODO: add a separately-sourced, verified UK market benchmark here (day-rate / monthly-retainer ranges), presented as market context — not Commview pricing. Verify figures and sources before launch.
            </p>
            <p>Commview does not publish a standard retainer because the scope depends on what needs fixing and how much hands-on execution is required. We agree that after understanding the problem.</p>
          </div>
          <div className="fc-axis" aria-hidden="true">
            <span className="fc-axis__eyebrow">Advisory</span>
            <span>Lower involvement</span>
            <span className="fc-axis__bar"></span>
            <span>Higher involvement</span>
            <span className="fc-axis__eyebrow">Embedded + execution</span>
          </div>
        </div>
      </section>

      {/* ===== HOW WE WORK — process ===== */}
      <section className="fc-sec fc-sec--tight" aria-labelledby="fc-proc">
        <div className="wrap">
          <div className="fc-proc__head">
            <p className="eyebrow-x" style={{ color: "var(--brand-cyan)" }}>How we work</p>
            <h2 id="fc-proc" style={{ marginTop: "var(--space-3)" }}>A focused, practical process.</h2>
          </div>
          <div className="fc-proc__grid">
            {STEPS.map((s) => (
              <div className="fc-step" key={s.n}>
                <b>{s.n}</b>
                <h3>{s.h}</h3>
                <p>{s.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== EXPERIENCE ===== */}
      <section className="fc-sec dark" aria-labelledby="fc-exp">
        <div className="wrap">
          <p className="eyebrow-x">Experience behind Commview</p>
          <h2 id="fc-exp" style={{ marginTop: "var(--space-3)" }}>Proven in the real world.</h2>
          <div className="fc-exp__grid">
            {STATS.map((s) => (
              <div className="fc-stat" key={s.b}>
                <b>{s.b}</b>
                <span>{s.s}</span>
              </div>
            ))}
            <p className="fc-exp__note">
              These results are from previous leadership roles and form the experience behind Commview, not client case studies.
            </p>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="fc-sec fc-sec--tight" aria-labelledby="fc-faq">
        <div className="wrap">
          <div className="fc-faq__head">
            <p className="eyebrow-x" style={{ color: "var(--brand-cyan)" }}>FAQ</p>
            <h2 id="fc-faq" style={{ marginTop: "var(--space-3)" }}>Straight answers to the questions we get.</h2>
          </div>
          <div className="fc-faq__grid">
            {FAQS.map((f, i) => (
              <details key={i}>
                <summary>{f.q}</summary>
                <p className="fc-faq__a">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="fc-final dark" aria-labelledby="fc-final">
        <div className="wrap fc-final__grid">
          <div>
            <p className="eyebrow-x" style={{ color: "var(--brand-cyan)" }}>Let&rsquo;s talk</p>
            <h2 className="fc-final__h" id="fc-final" style={{ marginTop: "var(--space-3)" }}>
              Something isn&rsquo;t working. Let&rsquo;s find out what.
            </h2>
            <p className="fc-final__p">You don&rsquo;t need to diagnose it before speaking to us.</p>
            <div className="fc-final__row">
              <a className="btn btn--cyan btn--lg" href="/contact">Talk to us</a>
              <a className="btn btn--ghost btn--lg" href="/diagnostic">Take the Diagnostic &rarr;</a>
            </div>
          </div>
          <p className="fc-scribble" aria-hidden="true">Real strategy.<br />Real progress.</p>
        </div>
      </section>
    </main>
  );
}
