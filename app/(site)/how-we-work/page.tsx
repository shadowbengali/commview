import type { Metadata } from "next";

import "../../../styles/how-we-work.css";

// /how-we-work: bespoke corporate conversion/trust page, built on the design
// system. Copy supplied by the client (content/how-we-work-definition.md) and
// reproduced verbatim. Header/footer come from the shared (site) chrome.
// Not a pillar/service page, so it deliberately does not use the content schema.

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://commview-green.vercel.app";

export const metadata: Metadata = {
  title: { absolute: "How We Work | Insight, Momentum, Impact | CommView" },
  description:
    "See how Commview diagnoses business problems, gets the right work moving and measures what changes. Senior thinking and hands-on delivery.",
  alternates: { canonical: "/how-we-work" },
};

type Para = { text: string; lit?: boolean };

interface Chapter {
  num: string;
  name: string;
  heading: string;
  body: Para[];
  pull: string;
}

const CHAPTERS: Chapter[] = [
  {
    num: "01",
    name: "Insight",
    heading: "Insight: find out what's actually going on",
    body: [
      { text: "The problem you are seeing is not always the problem you have." },
      { text: "Poor leads might actually be weak positioning. Low conversion might be the wrong audience. Slow product adoption might start with what was built rather than how it was marketed. A capacity problem might be a process that should never have remained manual." },
      { text: "So we start with evidence.", lit: true },
      { text: "Depending on the problem, that could mean customer behaviour, search data, pipeline, product usage, sales feedback, analytics, workflows, systems or conversations with the people closest to the work." },
      { text: "We follow the evidence until we understand where the constraint is." },
    ],
    pull: "The output isn't a deck. It's a decision about what needs to change.",
  },
  {
    num: "02",
    name: "Momentum",
    heading: "Momentum: get something moving",
    body: [
      { text: "Once we know where the problem sits, we start doing something about it." },
      { text: "That might mean changing the positioning. Reworking the customer journey. Building a demand programme. Prototyping a product change. Fixing measurement. Automating a workflow. Or stopping something that is not working." },
      { text: "This is where Commview is deliberately different." },
      { text: "Strategy and execution don't get handed to different people.", lit: true },
      { text: "The person helping make the strategic decision stays close enough to the execution to see whether it works. When specialist expertise is needed, we bring it into the work." },
    ],
    pull: "Work moves forward every week, not once the deck is signed off.",
  },
  {
    num: "03",
    name: "Impact",
    heading: "Impact: prove it made a difference",
    body: [
      { text: "Activity is not the outcome." },
      { text: "Before changing something, we establish what we are trying to improve and how we will know whether it is working." },
      { text: "Then we measure it.", lit: true },
      { text: "If the evidence says it is working, we build on it. If it does not, we change it." },
    ],
    pull: "The point isn't to prove the strategy was right. It's to make the business better.",
  },
];

const RHYTHM = [
  { step: "Understand", body: "Get close to the business, the customer and the evidence." },
  { step: "Diagnose", body: "Identify the constraint and decide what is worth moving first." },
  { step: "Do", body: "Start shipping work rather than spending months planning it." },
  { step: "Measure", body: "See what changed, learn from it and decide what moves next." },
];

const ENGAGEMENTS = [
  { title: "Fractional leadership", body: "Senior ownership embedded in the business when you need ongoing leadership without making a permanent senior hire." },
  { title: "Focused projects", body: "A defined commercial problem with a clear outcome, such as positioning, product discovery, SEO strategy or an AI implementation." },
  { title: "Build and embed", body: "We help create the capability, process or system, get it working and help your team take ownership of it." },
  { title: "Specialist support", body: "When the problem requires deeper expertise, we bring the right specialist into the work rather than pretending one person can do everything." },
];

const MANIFESTO = [
  "No strategy disappearing into a deck.",
  "No predetermined channel because that's what we sell.",
  "No junior team appearing after the pitch.",
  "No activity report pretending to be an outcome.",
  "No AI recommendation simply because AI is fashionable.",
];

const FAQ = [
  {
    q: "How does Commview work with clients?",
    a: "We start by understanding the problem, the evidence and what is happening inside the business. From there, we identify what needs to change, help execute it and measure whether it made a difference. The exact approach depends on the problem rather than following a fixed consulting methodology.",
  },
  {
    q: "Does Commview provide strategy or execution?",
    a: "Both. Strategy and execution stay connected. The person helping diagnose the problem and decide what needs to change stays close to the work required to make it happen. Where specialist expertise is needed, we bring the right people into the work.",
  },
  {
    q: "How long does a Commview engagement last?",
    a: "It depends on the problem. Some work is a focused project with a defined outcome, while fractional leadership or more complex transformation may require ongoing involvement. We agree the scope and expected outcomes before the work starts rather than forcing every problem into the same engagement model.",
  },
  {
    q: "Can Commview work with our existing team or agency?",
    a: "Yes. We can work alongside internal marketing, sales, product and technology teams as well as existing agencies and specialist partners. Often our role is to connect the work across those functions, establish what matters commercially and help everyone work towards the same outcome.",
  },
  {
    q: "How do you measure whether the work has been successful?",
    a: "We establish what needs to change and how we will measure it before getting deep into execution. The measure depends on the problem, whether that is pipeline, conversion, product adoption, efficiency, cost, capacity or another commercial outcome. If the evidence shows something is not working, we change it.",
  },
];

export default function HowWeWorkPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
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
          { "@type": "ListItem", position: 2, name: "How We Work", item: `${SITE}/how-we-work` },
        ],
      },
    ],
  };

  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ===== HERO ===== */}
      <section className="hw-hero dark" aria-labelledby="hw-h1">
        <div className="wrap hw-hero__in">
          <p className="eyebrow-x">How we work</p>
          <h1 className="hw-hero__h1" id="hw-h1">
            How Commview works. <em>Insight. Momentum. Impact.</em>
          </h1>
          <div className="hw-hero__intro">
            <p className="hw-lead">You do not need another strategy that tells you what you already know.</p>
            <p>
              We start by understanding what is actually happening, work out what needs to change, then
              stay close enough to the work to see whether it made a difference.
            </p>
          </div>
          <p className="hw-hero__pull">
            No frameworks for the sake of frameworks. No 40-slide decks. Work moves forward every week.
          </p>
          <div className="hw-hero__row">
            <a className="btn btn--cyan btn--lg" href="/contact">Talk to us</a>
            <a className="btn btn--ghost" href="/diagnostic">Take the Business Diagnostic</a>
          </div>
          <ol className="hw-hero__method" aria-hidden="true">
            <li>Insight</li>
            <li>Momentum</li>
            <li>Impact</li>
          </ol>
        </div>
      </section>

      {/* ===== CHAPTERS: INSIGHT / MOMENTUM / IMPACT ===== */}
      {CHAPTERS.map((c) => (
        <section key={c.num} className="hw-chapter" aria-labelledby={`hw-${c.num}`}>
          <div className="wrap hw-chapter__grid">
            <div className="hw-chapter__aside">
              <span className="hw-chapter__num">{c.num}</span>
              <span className="hw-chapter__name">{c.name}</span>
            </div>
            <div className="hw-chapter__main">
              <h2 id={`hw-${c.num}`}>{c.heading}</h2>
              <div className="hw-chapter__body">
                {c.body.map((p, i) => (
                  <p key={i} className={p.lit ? "lit" : undefined}>{p.text}</p>
                ))}
              </div>
              <p className="hw-chapter__pull">{c.pull}</p>
            </div>
          </div>
        </section>
      ))}

      {/* ===== WORKING RHYTHM ===== */}
      <section className="hw-rhythm dark" aria-labelledby="hw-rhythm-h">
        <div className="wrap">
          <div className="hw-rhythm__head">
            <p className="eyebrow-x" style={{ color: "var(--brand-cyan)" }}>The operating model</p>
            <h2 id="hw-rhythm-h">A working rhythm, not a rigid methodology</h2>
            <p className="hw-rhythm__intro">
              Insight, Momentum and Impact are how we think. Underneath sits a simple, repeating loop.
              Every engagement uses it differently, but the movement is always the same.
            </p>
          </div>

          <ol className="hw-loop" aria-label="Understand, diagnose, do, measure, then repeat">
            {RHYTHM.map((r, i) => (
              <li key={r.step} className="hw-loop__step">
                <span className="hw-loop__n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <span className="hw-loop__step-name">{r.step}</span>
                <span className="hw-loop__step-body">{r.body}</span>
              </li>
            ))}
          </ol>
          <p className="hw-loop__repeat" aria-hidden="true">
            <span>Measure feeds the next round of insight</span>
          </p>
        </div>
      </section>

      {/* ===== ENGAGEMENTS ===== */}
      <section className="hw-eng" aria-labelledby="hw-eng-h">
        <div className="wrap">
          <div className="hw-eng__head">
            <p className="eyebrow-x" style={{ color: "var(--brand-cyan)" }}>Ways to work together</p>
            <h2 id="hw-eng-h">One way of working. Different ways to use it.</h2>
            <p className="hw-eng__intro">
              You do not always need a consultant embedded in the business for six months. And some
              problems are not going to be solved in a two-week project. The way we work depends on the problem.
            </p>
          </div>
          <div className="hw-eng__grid">
            {ENGAGEMENTS.map((e, i) => (
              <article key={e.title} className="hw-eng__item">
                <span className="hw-eng__n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <h3>{e.title}</h3>
                <p>{e.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TEAM ===== */}
      <section className="hw-team" aria-labelledby="hw-team-h">
        <div className="wrap hw-team__grid">
          <div>
            <p className="eyebrow-x" style={{ color: "var(--brand-cyan)" }}>Alongside your people</p>
            <h2 id="hw-team-h">We work with the team you already have</h2>
          </div>
          <div className="hw-team__body">
            <p>We are not there to replace good people.</p>
            <p>
              If you already have a marketing team, sales team, product people, developers, designers or
              specialist agencies, we work with them.
            </p>
            <p className="lit">Sometimes the biggest problem is not capability.</p>
            <p>It is that everyone is solving a slightly different problem.</p>
            <p>
              Commview can sit across those functions, connect the commercial decisions and help get
              everyone moving towards the same outcome.
            </p>
          </div>
        </div>
      </section>

      {/* ===== WHAT YOU WON'T GET ===== */}
      <section className="hw-manifesto dark" aria-labelledby="hw-manifesto-h">
        <div className="wrap">
          <p className="eyebrow-x" style={{ color: "var(--accent-pink)" }}>Where we draw the line</p>
          <h2 id="hw-manifesto-h">What you won't get from Commview</h2>
          <ul className="hw-manifesto__list">
            {MANIFESTO.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="hw-faq" aria-labelledby="hw-faq-h">
        <div className="wrap">
          <div className="hw-faq__head">
            <div>
              <p className="eyebrow-x" style={{ color: "var(--brand-cyan)" }}>FAQ</p>
              <h2 id="hw-faq-h" style={{ marginTop: "var(--space-3)" }}>Working with Commview</h2>
            </div>
            <p>Straight answers to the questions we hear most before a first conversation.</p>
          </div>
          <div className="hw-faq__list">
            {FAQ.map((f, i) => (
              <details key={i}>
                <summary>{f.q}</summary>
                <p className="hw-faq__a">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CLOSING CTA ===== */}
      <section className="hw-cta dark" aria-labelledby="hw-cta-h">
        <div className="wrap hw-cta__in">
          <p className="eyebrow-x" style={{ color: "var(--brand-cyan)" }}>From insight to impact</p>
          <h2 id="hw-cta-h">
            You bring the question. We find the answer. Then we help you do something about it.
          </h2>
          <div className="hw-cta__row">
            <a className="btn btn--cyan btn--lg" href="/contact">Talk to us</a>
            <a className="btn btn--ghost" href="/diagnostic">Take the Business Diagnostic</a>
          </div>
        </div>
      </section>
    </main>
  );
}
