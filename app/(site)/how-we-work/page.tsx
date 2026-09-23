import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";

import "../../../styles/how-we-work.css";

// /how-we-work: bespoke corporate conversion/trust page, built on the design
// system. Copy supplied by the client (content/how-we-work-definition.md and the
// revised design). Header/footer come from the shared (site) chrome.
// Not a pillar/service page, so it deliberately does not use the content schema.

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://commview-green.vercel.app";
const cvar = (c: string): CSSProperties => ({ ["--c" as string]: c }) as CSSProperties;

export const metadata: Metadata = {
  title: { absolute: "How We Work | Insight, Momentum, Impact | CommView" },
  description:
    "See how Commview diagnoses business problems, gets the right work moving and measures what changes. Senior thinking and hands-on delivery.",
  alternates: { canonical: "/how-we-work" },
};

// ---- inline icons (stroke-based, matching the site's icon language) ----
const PATHS: Record<string, ReactNode> = {
  search: <><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.2-4.2" strokeLinecap="round" /></>,
  doc: <><path d="M7 3.75h6.5L18 8.25V19.5a1.25 1.25 0 0 1-1.25 1.25h-9.5A1.25 1.25 0 0 1 6 19.5v-14.5A1.25 1.25 0 0 1 7 3.75Z" /><path d="M13.25 3.75V8.5H18" /><path d="M9 12.5h6M9 15.5h4" strokeLinecap="round" /></>,
  bolt: <path d="M13 2.5 5.5 13H11l-1 8.5L18.5 10.5H12l1-8Z" strokeLinejoin="round" />,
  chart: <><path d="M4 20h16" strokeLinecap="round" /><path d="M7.5 20v-6M12 20V9M16.5 20v-9" strokeLinecap="round" /></>,
  people: <><circle cx="9" cy="8.5" r="3.2" /><path d="M3.5 19a5.5 5.5 0 0 1 11 0" /><path d="M15.5 6a3 3 0 0 1 0 5.9M17 19a5.5 5.5 0 0 0-2.8-4.8" strokeLinecap="round" /></>,
  target: <><circle cx="12" cy="12" r="8.2" /><circle cx="12" cy="12" r="4.3" /><circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" /></>,
  layers: <><path d="M12 3.2 20.5 8 12 12.8 3.5 8 12 3.2Z" strokeLinejoin="round" /><path d="M3.5 12 12 16.8 20.5 12" strokeLinejoin="round" /><path d="M3.5 15.8 12 20.6l8.5-4.8" strokeLinejoin="round" /></>,
  puzzle: <path d="M14 4.6a2 2 0 1 0-4 0V6H6.6A1.6 1.6 0 0 0 5 7.6V11H3.6a2 2 0 1 0 0 4H5v3.4A1.6 1.6 0 0 0 6.6 20H10v-1.4a2 2 0 1 1 4 0V20h3.4a1.6 1.6 0 0 0 1.6-1.6V15h1.4a2 2 0 1 0 0-4H19V7.6A1.6 1.6 0 0 0 17.4 6H14V4.6Z" strokeLinejoin="round" />,
  deck: <><rect x="3.5" y="4" width="17" height="11.5" rx="1.4" /><path d="M12 15.5v4M9 19.5h6" strokeLinecap="round" /></>,
  megaphone: <><path d="M4 10.2v3.6a1 1 0 0 0 1 1h2.2l7.3 3.7V5.5L7.2 9.2H5a1 1 0 0 0-1 1Z" strokeLinejoin="round" /><path d="M17.5 8.4a4 4 0 0 1 0 7.2" strokeLinecap="round" /></>,
  person: <><circle cx="12" cy="8" r="3.6" /><path d="M5.5 20a6.5 6.5 0 0 1 13 0" strokeLinecap="round" /></>,
};

function Icon({ name, className }: { name: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      {PATHS[name]}
    </svg>
  );
}

// ---- data ----
const SLABS = [
  { num: "01", label: "Insight", cap: "Find out what's going on.", c: "var(--brand-cyan)" },
  { num: "02", label: "Momentum", cap: "Get something moving.", c: "var(--brand-blue)" },
  { num: "03", label: "Impact", cap: "Prove it made a difference.", c: "var(--accent-pink)" },
];

const FLOW = [
  { icon: "search", name: "Understand", body: "Get close to the business, the customer and the evidence.", c: "var(--brand-cyan)" },
  { icon: "doc", name: "Diagnose", body: "Identify the constraint and decide what is worth moving first.", c: "var(--accent-blue)" },
  { icon: "bolt", name: "Do", body: "Start shipping work rather than spending months planning it.", c: "var(--brand-blue)" },
  { icon: "chart", name: "Measure", body: "See what changed, learn from it and decide what moves next.", c: "var(--accent-pink)" },
];

const CHAPTERS = [
  {
    num: "01", name: "Insight", c: "var(--brand-cyan)",
    lead: "Find out what's actually going on.",
    body: "We look at the data, customer behaviour, market context, team input and current activity to understand the real problem.",
    pull: "The output isn't a deck. It's a decision about what needs to change.",
  },
  {
    num: "02", name: "Momentum", c: "var(--brand-blue)",
    lead: "Get something moving.",
    body: "We help you make the right changes and start executing, whether that's positioning, a campaign, a product change, a process or an AI implementation.",
    pull: "Strategy and execution stay connected.",
  },
  {
    num: "03", name: "Impact", c: "var(--accent-pink)",
    lead: "Prove it made a difference.",
    body: "We define what success looks like, measure what changed and build on what's working. If it's not working, we change it.",
    pull: "The point isn't to prove the strategy was right. It's to make the business better.",
  },
];

const ENGAGEMENTS = [
  { icon: "people", title: "Fractional leadership", body: "Senior ownership embedded in the business when you need ongoing leadership without making a permanent hire." },
  { icon: "target", title: "Focused projects", body: "A defined commercial problem with a clear outcome, such as positioning, product discovery, SEO strategy or an AI implementation." },
  { icon: "layers", title: "Build and embed", body: "We help create the capability, process or system, get it working and help your team take ownership of it." },
  { icon: "puzzle", title: "Specialist support", body: "When the problem requires deeper expertise, we bring the right specialist into the work rather than pretending one person can do everything." },
];

const COMMITMENTS = [
  { icon: "deck", title: "No strategy disappearing into a deck.", sub: "Strategy stays connected to execution." },
  { icon: "megaphone", title: "No predetermined channel because that's what we sell.", sub: "We diagnose before we prescribe." },
  { icon: "person", title: "No junior team appearing after the pitch.", sub: "Senior people stay close to the work." },
  { icon: "chart", title: "No activity for activity's sake.", sub: "We measure what changed, not what we did." },
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
        <div className="wrap hw-hero__grid">
          <div className="hw-hero__lead">
            <p className="eyebrow-x">How we work</p>
            <h1 className="hw-hero__h1" id="hw-h1">
              <span>Insight.</span>
              <span className="hw-accent">Momentum.</span>
              <span>Impact.</span>
            </h1>
            <p className="hw-hero__sub">
              You don&rsquo;t need another strategy that tells you what you already know. We find out
              what&rsquo;s actually going on, get something moving, then prove it made a difference.
            </p>
            <p className="hw-hero__pull">
              No frameworks for the sake of frameworks. No 40-slide decks. Work moves forward every week.
            </p>
            <div className="hw-hero__row">
              <a className="btn btn--cyan btn--lg" href="/contact">Talk to us</a>
              <a className="btn btn--ghost" href="/diagnostic">Take the Business Diagnostic</a>
            </div>
          </div>

          <div className="hw-slabs" aria-hidden="true">
            {SLABS.map((s) => (
              <div className="hw-slab" style={cvar(s.c)} key={s.num}>
                <div className="hw-slab__in">
                  <span className="hw-slab__num">{s.num}</span>
                  <span className="hw-slab__label">{s.label}</span>
                  <span className="hw-slab__cap">{s.cap}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== THE APPROACH: WORKING RHYTHM ===== */}
      <section className="hw-approach" aria-labelledby="hw-approach-h">
        <div className="wrap">
          <div className="hw-head">
            <div>
              <p className="eyebrow-x hw-eye">The approach</p>
              <h2 id="hw-approach-h">A working rhythm,<br />not a rigid methodology.</h2>
            </div>
            <div className="hw-head__intro">
              <p>Every business is different. The problems change, the context changes and the work required is never identical.</p>
              <p>But the way we work always follows the same rhythm.</p>
            </div>
          </div>

          <ol className="hw-flow">
            {FLOW.map((f) => (
              <li className="hw-flow__step" style={cvar(f.c)} key={f.name}>
                <span className="hw-flow__ico"><Icon name={f.icon} /></span>
                <h3 className="hw-flow__name">{f.name}</h3>
                <p className="hw-flow__body">{f.body}</p>
              </li>
            ))}
          </ol>

          <div className="hw-continuum" aria-hidden="true">
            <span className="hw-continuum__line hw-continuum__line--l"></span>
            <span className="hw-continuum__label">Insight to impact</span>
            <span className="hw-continuum__line hw-continuum__line--r"></span>
          </div>
        </div>
      </section>

      {/* ===== THREE STAGES: CHAPTERS ===== */}
      <section className="hw-stages" aria-labelledby="hw-stages-h">
        <div className="wrap">
          <div className="hw-head">
            <div>
              <p className="eyebrow-x hw-eye">Three stages. One focus.</p>
              <h2 id="hw-stages-h">From insight<br />to impact.</h2>
            </div>
            <div className="hw-head__intro">
              <p>The same rhythm applies whether we&rsquo;re helping with go-to-market, growth, product or operational AI. We follow the evidence, focus on what will make a difference and stay close enough to the work to see it through.</p>
              <a className="hw-link" href="/what-we-do">Explore what we do</a>
            </div>
          </div>

          <div className="hw-chapters">
            {CHAPTERS.map((c) => (
              <article className="hw-chapter" style={cvar(c.c)} key={c.num}>
                <span className="hw-chapter__num">{c.num}</span>
                <span className="hw-chapter__name">{c.name}</span>
                <h3 className="hw-chapter__lead">{c.lead}</h3>
                <p className="hw-chapter__body">{c.body}</p>
                <p className="hw-chapter__pull">{c.pull}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FLEXIBLE ENGAGEMENTS ===== */}
      <section className="hw-eng dark" aria-labelledby="hw-eng-h">
        <div className="wrap">
          <div className="hw-head">
            <div>
              <p className="eyebrow-x hw-eye">Flexible engagements</p>
              <h2 id="hw-eng-h">Different problems need<br />different ways to work.</h2>
            </div>
            <div className="hw-head__intro hw-head__intro--dark">
              <p>You don&rsquo;t always need a consultant embedded in the business for six months. And some problems aren&rsquo;t going to be solved in a two-week project. We tailor the engagement to the problem.</p>
            </div>
          </div>

          <div className="hw-grid4">
            {ENGAGEMENTS.map((e) => (
              <article className="hw-eng__item" key={e.title}>
                <span className="hw-eng__ico"><Icon name={e.icon} /></span>
                <h3>{e.title}</h3>
                <p>{e.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WORKING TOGETHER ===== */}
      <section className="hw-team" aria-labelledby="hw-team-h">
        <div className="wrap hw-team__grid">
          <div>
            <p className="eyebrow-x hw-eye">Working together</p>
            <h2 id="hw-team-h">We work with the team<br />you already have.</h2>
            <a className="btn btn--cyan" href="/contact">Talk to us</a>
          </div>
          <div className="hw-team__body">
            <p>We&rsquo;re not here to replace good people.</p>
            <p>If you already have a marketing team, sales team, product people, developers, designers or specialist agencies, we work with them.</p>
            <p>Sometimes the biggest problem isn&rsquo;t capability. It&rsquo;s that everyone is solving a slightly different problem. Commview can sit across those functions, connect the commercial decisions and help get everyone moving towards the same outcome.</p>
          </div>
        </div>
      </section>

      {/* ===== OUR COMMITMENT: WHAT YOU WON'T GET ===== */}
      <section className="hw-commit dark" aria-labelledby="hw-commit-h">
        <div className="wrap">
          <div className="hw-head">
            <div>
              <p className="eyebrow-x hw-eye" style={{ color: "var(--accent-pink)" }}>Our commitment</p>
              <h2 id="hw-commit-h">What you won&rsquo;t get<br />from Commview.</h2>
            </div>
            <div className="hw-head__intro hw-head__intro--dark">
              <p>We&rsquo;re clear about how we work. And we&rsquo;re equally clear about what you won&rsquo;t get.</p>
            </div>
          </div>

          <div className="hw-grid4">
            {COMMITMENTS.map((c) => (
              <article className="hw-commit__item" key={c.title}>
                <span className="hw-commit__ico"><Icon name={c.icon} /></span>
                <h3>{c.title}</h3>
                <p>{c.sub}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="hw-faq" aria-labelledby="hw-faq-h">
        <div className="wrap">
          <div className="hw-faq__head">
            <div>
              <p className="eyebrow-x hw-eye">FAQ</p>
              <h2 id="hw-faq-h">Working with Commview</h2>
            </div>
            <p>Straight answers to the questions we hear most often in initial conversations.</p>
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
        <div className="wrap hw-cta__grid">
          <div>
            <p className="eyebrow-x hw-eye">From insight to impact</p>
            <h2 id="hw-cta-h">You bring the question.<br />We find the answer.</h2>
            <p className="hw-cta__tail">Then we help you do something about it.</p>
          </div>
          <div className="hw-cta__row">
            <a className="btn btn--cyan btn--lg" href="/contact">Talk to us</a>
            <a className="btn btn--ghost" href="/diagnostic">Take the Business Diagnostic</a>
          </div>
        </div>
      </section>
    </main>
  );
}
