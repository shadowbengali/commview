import type { ReactNode } from "react";
import type { Metadata } from "next";

import "../../../../styles/outbound.css";

// /growth/outbound-lead-generation — Growth sub-pillar, bespoke build to the
// approved design. Copy from content/pages/outbound-lead-generation.md. Growth
// green accent. One primary visual (the outbound operating system) + editorial
// sections. Owns "outbound lead generation"; distinct from /growth/b2b-lead-generation.

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://commview-green.vercel.app";

export const metadata: Metadata = {
  title: { absolute: "B2B Outbound Lead Generation | CommView" },
  description:
    "B2B outbound lead generation built around the right accounts, signals and conversations. Strategy, data, outreach, SDR and pipeline in one system.",
  alternates: { canonical: "/growth/outbound-lead-generation" },
};

const PATHS: Record<string, ReactNode> = {
  target: <><circle cx="12" cy="12" r="8.2" /><circle cx="12" cy="12" r="4.3" /><circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" /></>,
  mail: <><rect x="3.5" y="5.5" width="17" height="13" rx="1.5" /><path d="M4 7l8 6 8-6" strokeLinecap="round" strokeLinejoin="round" /></>,
  bolt: <path d="M13 2.5 5.5 13H11l-1 8.5L18.5 10.5H12l1-8Z" strokeLinejoin="round" />,
  chat: <><path d="M4 5.5h16v10H9l-4 3.5v-3.5H4Z" strokeLinejoin="round" /></>,
  chart: <><path d="M4 20h16" strokeLinecap="round" /><path d="M7.5 20v-6M12 20V9M16.5 20v-9" strokeLinecap="round" /></>,
  pound: <><path d="M8 20h9" strokeLinecap="round" /><path d="M9 20c2.4-1.6 2.4-4.3 2-6.2C10.4 11 9.5 8.6 11 6.6c1.3-1.7 4-1.6 5.2.2" strokeLinecap="round" /><path d="M7.5 13.2h6.5" strokeLinecap="round" /></>,
  people: <><circle cx="9" cy="8.5" r="3.2" /><path d="M3.5 19a5.5 5.5 0 0 1 11 0" /><path d="M15.5 6a3 3 0 0 1 0 5.9M17 19a5.5 5.5 0 0 0-2.8-4.8" strokeLinecap="round" /></>,
  database: <><ellipse cx="12" cy="6" rx="7" ry="2.6" /><path d="M5 6v6c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6V6M5 12v6c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6v-6" /></>,
  layers: <><path d="M12 3.2 20.5 8 12 12.8 3.5 8 12 3.2Z" strokeLinejoin="round" /><path d="M3.5 12 12 16.8 20.5 12" strokeLinejoin="round" /><path d="M3.5 15.8 12 20.6l8.5-4.8" strokeLinejoin="round" /></>,
  doc: <><path d="M7 3.75h6.5L18 8.25V19.5a1.25 1.25 0 0 1-1.25 1.25h-9.5A1.25 1.25 0 0 1 6 19.5v-14.5A1.25 1.25 0 0 1 7 3.75Z" /><path d="M13.25 3.75V8.5H18" /><path d="M9 12.5h6M9 15.5h4" strokeLinecap="round" /></>,
  refresh: <><path d="M20 12a8 8 0 1 1-2.3-5.6" strokeLinecap="round" /><path d="M20 4v3.2h-3.2" strokeLinecap="round" strokeLinejoin="round" /></>,
  phone: <path d="M6.5 4h3l1.3 3.3-2 1.4a11 11 0 0 0 4.5 4.5l1.4-2 3.3 1.3v3a1.5 1.5 0 0 1-1.6 1.5A14.5 14.5 0 0 1 5 6.6 1.5 1.5 0 0 1 6.5 4Z" strokeLinejoin="round" />,
  in: <><rect x="3.5" y="3.5" width="17" height="17" rx="2" /><path d="M7.5 10v6M7.5 7.5v.01M11 16v-3.4c0-1.2.9-2.1 2-2.1s2 .9 2 2.1V16" strokeLinecap="round" /></>,
  reply: <><path d="M9 7 4 12l5 5" strokeLinecap="round" strokeLinejoin="round" /><path d="M4 12h9a6 6 0 0 1 6 6v1" strokeLinecap="round" /></>,
  trend: <><path d="M4 16l5-5 3 3 7-7" strokeLinecap="round" strokeLinejoin="round" /><path d="M15 7h5v5" strokeLinecap="round" strokeLinejoin="round" /></>,
};
function Icon({ name }: { name: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">{PATHS[name]}</svg>;
}

const PROBLEMS = [
  { icon: "target", title: "Wrong accounts", body: "Time wasted on accounts that will never buy." },
  { icon: "mail", title: "Generic outreach", body: "Templates and poor personalisation get ignored." },
  { icon: "bolt", title: "No clear process", body: "Activity without a system rarely creates pipeline." },
  { icon: "reply", title: "Poor handoff", body: "Leads that don't reach sales or aren't properly qualified." },
];

const APPROACH = [
  { icon: "target", label: "Target the right accounts" },
  { icon: "chart", label: "Use real buying signals" },
  { icon: "chat", label: "Start the right conversations" },
  { icon: "pound", label: "Create qualified pipeline" },
];

const NODES = [
  { n: "1", name: "ICP", body: "Define your ideal customers" },
  { n: "2", name: "Accounts", body: "Select and prioritise accounts" },
  { n: "3", name: "Signals", body: "Identify buying signals and triggers" },
  { n: "4", name: "Contacts", body: "Find and enrich the right people" },
  { n: "5", name: "Context", body: "Research and personalise" },
  { n: "6", name: "Outreach", body: "Multi-channel campaigns" },
  { n: "7", name: "Conversation", body: "Start meaningful discussions" },
  { n: "8", name: "Qualification", body: "Route to the right AE" },
];

const CHANNELS = [
  { icon: "mail", title: "Email", lines: ["Personalised sequences", "Deliverability best practice", "Reply handling and follow up"] },
  { icon: "in", title: "LinkedIn", lines: ["Targeted outreach", "Engage before you pitch", "Build ongoing relationships"] },
  { icon: "phone", title: "Phone", lines: ["Relevant, well-timed calls", "Follow up on engagement", "Speak to key decision makers"] },
];

const AI_SIDE = ["Account research", "Data enrichment", "Signal detection", "Personalisation at scale", "Sequence management", "Admin and CRM updates"];
const HUMAN_SIDE = ["Real conversations", "Discovering needs", "Understanding nuance", "Qualifying opportunities", "Managing stakeholders", "Commercial judgement"];

const DELIVER = [
  { icon: "target", title: "ICP and account strategy", body: "Define your target market and build a prioritised account list." },
  { icon: "database", title: "Data and enrichment", body: "High-quality contact data with relevant context." },
  { icon: "chat", title: "Messaging and positioning", body: "Tailored messaging that resonates with your audience." },
  { icon: "layers", title: "Multi-channel sequences", body: "Email, LinkedIn and phone working together." },
  { icon: "doc", title: "SDR playbook and workflows", body: "Clear process, templates and guidance." },
  { icon: "refresh", title: "CRM integration and routing", body: "Qualified opportunities to the right AE." },
  { icon: "chart", title: "Reporting and optimisation", body: "Track performance and continuously improve." },
  { icon: "bolt", title: "Execution support", body: "We can run the campaigns or enable your team." },
];

const RESULTS = [
  { icon: "reply", title: "Positive response rate", body: "Meaningful engagement, not just opens." },
  { icon: "chat", title: "Qualified conversations", body: "Meetings with real potential." },
  { icon: "target", title: "Pipeline created", body: "Opportunities that match your ICP." },
  { icon: "pound", title: "Cost per opportunity", body: "Efficient use of your budget." },
  { icon: "trend", title: "Revenue influence", body: "Pipeline that converts to revenue." },
];

const FAQ = [
  { q: "Does cold outbound still work?", a: "Yes, but “does outbound work?” is too broad a question. Performance depends on the market, proposition, account selection, data, timing, channel, message and follow-up. Sending more generic outreach because automation made it cheap is not the same as having an effective outbound system. We test whether the motion creates commercially useful conversations." },
  { q: "Should we hire SDRs or outsource outbound?", a: "Hire internally when the motion is understood, the workload is persistent and you want the capability permanently inside the business. Outsourcing can make sense when you need to test a motion, enter a market or add capability without building the whole function first. Commview can also work with existing SDRs rather than replacing them." },
  { q: "How much of outbound can AI automate?", a: "AI can assist research, enrichment, account summaries, signal interpretation, personalisation drafts, sequencing, CRM administration and reporting. We would not hand qualification and commercial judgement to automation by default. The objective is to remove low-value work so people spend more time on relevant conversations and better decisions." },
  { q: "Is cold calling still worth doing in B2B?", a: "It can be. A phone conversation can expose fit, timing, objections and buying context faster than a long automated sequence. We use calling where the economics, audience and proposition justify it. The point is not maximum dial volume. It is using the right channel to create and develop a useful conversation." },
  { q: "What is the difference between outbound and B2B lead generation?", a: "B2B lead generation is the broader discipline of creating and capturing potential commercial opportunities across channels. Outbound lead generation specifically identifies target accounts and proactively approaches them. Our broader B2B lead generation service covers the wider channel mix; this service focuses on the outbound motion." },
];

export default function OutboundLeadGenerationPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: "B2B outbound lead generation",
        serviceType: "Outbound lead generation",
        provider: { "@id": `${SITE}/#organisation` },
        url: `${SITE}/growth/outbound-lead-generation`,
        areaServed: "GB",
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "Growth", item: `${SITE}/growth` },
          { "@type": "ListItem", position: 3, name: "Outbound Lead Generation", item: `${SITE}/growth/outbound-lead-generation` },
        ],
      },
    ],
  };

  return (
    <main id="main" className="ob">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ===== HERO ===== */}
      <section className="ob-hero dark" aria-labelledby="ob-h1">
        <div className="wrap ob-hero__grid">
          <div className="ob-hero__lead">
            <p className="eyebrow-x">Growth / Outbound Lead Generation</p>
            <h1 className="ob-hero__h1" id="ob-h1">B2B Outbound Lead Generation Built Around the <span className="ob-grad">Right Accounts</span></h1>
            <p className="ob-hero__body">
              More activity is not an outbound strategy. We build B2B outbound lead generation around the
              accounts worth reaching, the reason to contact them and the conversation you want to create.
            </p>
            <div className="ob-hero__row">
              <a className="btn btn--green btn--lg" href="/contact">Talk to us</a>
              <a className="btn btn--ghost" href="/how-we-work">See how we work</a>
            </div>
          </div>
          <div className="ob-hero__art" aria-hidden="true">
            <span className="ob-beam" />
            <ul className="ob-hero__wins">
              <li><b>More</b><span>conversations</span></li>
              <li><b>Higher quality</b><span>pipeline</span></li>
              <li><b>Shorter</b><span>sales cycles</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* ===== THE PROBLEM ===== */}
      <section className="ob-problem" aria-labelledby="ob-problem-h">
        <div className="wrap ob-split">
          <div className="ob-split__lead">
            <p className="eyebrow-x ob-eye">The problem</p>
            <h2 id="ob-problem-h">Outbound is not a<br />volume problem.</h2>
            <p className="ob-split__intro">More emails, more calls and more activity do not automatically create more pipeline. Most outbound campaigns fail because they target the wrong accounts, use generic messaging or lack a clear process from first contact to qualified opportunity.</p>
          </div>
          <ul className="ob-cards">
            {PROBLEMS.map((p) => (
              <li className="ob-card" key={p.title}>
                <span className="ob-card__ico"><Icon name={p.icon} /></span>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===== OUR APPROACH ===== */}
      <section className="ob-approach dark" aria-labelledby="ob-approach-h">
        <div className="wrap ob-split">
          <div className="ob-split__lead">
            <p className="eyebrow-x ob-eye">Our approach</p>
            <h2 id="ob-approach-h">An outbound system<br />that actually works.</h2>
            <p className="ob-split__intro ob-split__intro--dark">We build outbound campaigns around your ideal customer profile, real buying signals and a clear process from initial outreach to qualified opportunity. It is a multi-channel, data-driven approach designed to start the right conversations with the right people.</p>
          </div>
          <ul className="ob-approach__grid">
            {APPROACH.map((a) => (
              <li key={a.label}><span className="ob-approach__ico"><Icon name={a.icon} /></span>{a.label}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===== THE OUTBOUND OPERATING SYSTEM ===== */}
      <section className="ob-os" aria-labelledby="ob-os-h">
        <div className="wrap">
          <p className="eyebrow-x ob-eye">The outbound operating system</p>
          <h2 id="ob-os-h">From target accounts to pipeline.</h2>
          <p className="ob-os__intro">We design and run end-to-end outbound campaigns, using data, AI and human judgement to engage the right people at the right time.</p>
          <ol className="ob-flow">
            {NODES.map((nd) => (
              <li className="ob-node" key={nd.n}>
                <span className="ob-node__n">{nd.n}</span>
                <span className="ob-node__name">{nd.name}</span>
                <span className="ob-node__body">{nd.body}</span>
              </li>
            ))}
          </ol>
          <div className="ob-bands" aria-hidden="true">
            <div className="ob-band ob-band--ai">
              <b>AI and data</b>
              <span>Research · Enrichment · Signals · Prioritisation · Personalisation · Automation</span>
            </div>
            <div className="ob-band ob-band--human">
              <b>Human judgement</b>
              <span>Conversations · Discovery · Nuance · Qualification</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MULTI-CHANNEL ===== */}
      <section className="ob-chan" aria-labelledby="ob-chan-h">
        <div className="wrap">
          <div className="ob-split">
            <div className="ob-split__lead">
              <p className="eyebrow-x ob-eye">Multi-channel outbound</p>
              <h2 id="ob-chan-h">Meet prospects<br />where they are.</h2>
              <p className="ob-split__intro">We use a coordinated mix of channels to increase reach and create more meaningful conversations. Each channel plays a role, and the messaging is tailored to the audience and context.</p>
            </div>
            <div className="ob-chan__cols">
              {CHANNELS.map((c) => (
                <div className="ob-chan__col" key={c.title}>
                  <span className="ob-chan__ico"><Icon name={c.icon} /></span>
                  <h3>{c.title}</h3>
                  <ul>{c.lines.map((l) => <li key={l}>{l}</li>)}</ul>
                </div>
              ))}
            </div>
          </div>
          <p className="ob-chan__shared">One account view · Shared context · One conversation history</p>
        </div>
      </section>

      {/* ===== THE MODERN SDR ROLE ===== */}
      <section className="ob-sdr dark" aria-labelledby="ob-sdr-h">
        <div className="wrap ob-split">
          <div className="ob-split__lead">
            <p className="eyebrow-x ob-eye">The modern SDR role</p>
            <h2 id="ob-sdr-h">AI handles the heavy lifting.<br />Humans have better conversations.</h2>
            <p className="ob-split__intro ob-split__intro--dark">AI can now do much of the research, enrichment, prioritisation and administrative work. This lets SDRs focus on what they do best: having high-quality conversations, understanding needs and developing opportunities.</p>
          </div>
          <div className="ob-sdr__split">
            <div className="ob-sdr__box ob-sdr__box--ai">
              <span className="ob-sdr__cap"><Icon name="bolt" />AI and automation</span>
              <ul>{AI_SIDE.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
            <span className="ob-sdr__plus" aria-hidden="true">+</span>
            <div className="ob-sdr__box ob-sdr__box--human">
              <span className="ob-sdr__cap"><Icon name="people" />Human judgement</span>
              <ul>{HUMAN_SIDE.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHAT WE DELIVER ===== */}
      <section className="ob-deliver" aria-labelledby="ob-deliver-h">
        <div className="wrap">
          <p className="eyebrow-x ob-eye">What we deliver</p>
          <h2 id="ob-deliver-h">A complete outbound engine.</h2>
          <p className="ob-os__intro">We don&rsquo;t just send emails. We design and build an outbound system that creates pipeline and can be scaled over time.</p>
          <ul className="ob-grid4">
            {DELIVER.map((d) => (
              <li className="ob-tile" key={d.title}>
                <span className="ob-tile__ico"><Icon name={d.icon} /></span>
                <h3>{d.title}</h3>
                <p>{d.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===== RESULTS ===== */}
      <section className="ob-results dark" aria-labelledby="ob-results-h">
        <div className="wrap">
          <p className="eyebrow-x ob-eye">Results that matter</p>
          <h2 id="ob-results-h">Measure what drives growth.</h2>
          <p className="ob-os__intro ob-os__intro--dark">We focus on the outcomes that impact your business, not activity metrics.</p>
          <ul className="ob-metrics">
            {RESULTS.map((r) => (
              <li className="ob-metric" key={r.title}>
                <span className="ob-metric__ico"><Icon name={r.icon} /></span>
                <h3>{r.title}</h3>
                <p>{r.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="ob-faq" aria-labelledby="ob-faq-h">
        <div className="wrap">
          <p className="eyebrow-x ob-eye">FAQ</p>
          <h2 id="ob-faq-h">Outbound lead generation FAQs</h2>
          <div className="ob-faq__list">
            {FAQ.map((f, i) => (
              <details key={i}>
                <summary>{f.q}</summary>
                <p className="ob-faq__a">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CLOSING CTA ===== */}
      <section className="ob-cta dark" aria-labelledby="ob-cta-h">
        <div className="wrap ob-cta__grid">
          <div>
            <p className="eyebrow-x ob-eye">Let&rsquo;s build your outbound engine</p>
            <h2 id="ob-cta-h">Ready to create pipeline<br />with the right accounts?</h2>
            <p className="ob-cta__body">You bring the pipeline problem. We build the outbound system around it.</p>
          </div>
          <div className="ob-cta__row">
            <a className="btn btn--green btn--lg" href="/contact">Talk to us</a>
            <a className="btn btn--ghost" href="/how-we-work">See how we work</a>
          </div>
        </div>
      </section>

      {/* related links (kept in-flow for internal linking) */}
      <nav className="ob-related wrap" aria-label="Related services">
        <span>Related:</span>
        <a href="/growth/b2b-lead-generation">B2B lead generation</a>
        <a href="/growth/demand-generation">Demand generation</a>
        <a href="/ideal-customer-profile-workshop">Ideal Customer Profile workshop</a>
        <a href="/positioning">Positioning</a>
      </nav>
    </main>
  );
}
