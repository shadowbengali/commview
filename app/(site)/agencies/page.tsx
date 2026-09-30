import type { CSSProperties } from "react";
import type { Metadata } from "next";

import "../../../styles/agencies.css";

// /agencies — the "For agencies" proposition. Bespoke server component using the
// site design system (like /contact and /work). Copy verbatim from the approved
// brief: UK English, no em dashes, no agency-replacement framing. Company names
// in the experience strip are the ones already approved on the site (operator
// experience, not CommView clients).

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.commview.co.uk";
const CONTACT = "/contact?source=agencies";

const cvar = (c: string): CSSProperties => ({ ["--c" as string]: c }) as CSSProperties;

export const metadata: Metadata = {
  title: { absolute: "For Agencies | Specialist B2B Delivery & Expertise | CommView" },
  description:
    "Extend your agency's capabilities with experienced support across SEO, Growth, GTM, Product and AI. Behind the scenes, white-labelled or client-facing.",
  alternates: { canonical: "/agencies" },
};

const REASONS = [
  {
    c: "var(--accent-green)",
    icon: <path d="M12 3l9 5-9 5-9-5 9-5zM3 12l9 5 9-5M3 16l9 5 9-5" strokeLinejoin="round" />,
    h: "You've sold work you need help delivering.",
    p: "The client needs SEO, email, social, content or another specialist workstream, but you don't have the capacity or capability available internally. We can work inside the existing strategy and delivery structure without you having to recruit around every brief.",
  },
  {
    c: "var(--brand-cyan)",
    icon: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1" /></>,
    h: "The brief has moved beyond the original scope.",
    p: "A channel brief can expose a bigger commercial problem. What started as SEO might uncover weak positioning. Paid media might reveal the wrong ICP. A website project might raise questions about proposition or product adoption. We can help solve the wider problem rather than forcing it back into the service originally sold.",
  },
  {
    c: "var(--brand-blue)",
    icon: <><circle cx="9" cy="8" r="3" /><circle cx="16" cy="9" r="2.4" /><path d="M4 19a5 5 0 0 1 10 0M14.5 19a4 4 0 0 1 5.5-3.7" strokeLinecap="round" /></>,
    h: "You need senior expertise in the room.",
    p: "Sometimes the client conversation needs someone who has operated at that level before. Bring us into a pitch, workshop, strategy session or important client conversation when deeper GTM, Growth, Product or AI experience strengthens what your agency can offer.",
  },
];

const CAPABILITIES = [
  {
    colour: "var(--brand-cyan)",
    h: "GTM Leadership",
    p: "Senior commercial thinking when the question is who to target, what to say, how to reach them or how Product, Marketing and Sales fit together.",
    items: ["Positioning", "Ideal customer profiles", "Proposition", "Routes to market", "Product launches", "GTM strategy", "Sales and Marketing alignment"],
    link: "Explore GTM Leadership",
    href: "/gtm-leadership",
    icon: (
      <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1" /></>
    ),
  },
  {
    colour: "var(--accent-green)",
    h: "Growth",
    p: "Hands-on specialist delivery and growth support where the priority is measurable commercial performance.",
    items: ["SEO", "Technical SEO", "AEO / GEO", "Email marketing", "Social media", "Content", "Demand generation", "Outbound", "Paid media", "Conversion optimisation"],
    link: "Explore Growth",
    href: "/growth",
    icon: (
      <><path d="M4 20h16M7.5 20v-6M12 20V8M16.5 20v-10" strokeLinecap="round" /></>
    ),
  },
  {
    colour: "var(--brand-blue)",
    h: "Product",
    p: "Product expertise when the commercial problem starts further upstream than marketing.",
    items: ["Product strategy", "Discovery", "Prioritisation", "MVP definition", "Roadmaps", "Product GTM", "Adoption"],
    link: "Explore Product",
    href: "/product-strategy",
    icon: (
      <path d="M12 2.5l8.5 4.8v9.4L12 21.5l-8.5-4.8V7.3L12 2.5zM3.5 7.3L12 12l8.5-4.7M12 12v9.5" strokeLinejoin="round" />
    ),
  },
  {
    colour: "var(--accent-pink)",
    h: "Operational AI",
    p: "Practical AI and automation support focused on changing how work gets done, not adding AI for the sake of it.",
    items: ["Workflow analysis", "AI opportunity identification", "Automation", "AI implementation", "Marketing operations", "Operational redesign"],
    link: "Explore Operational AI",
    href: "/ai-consulting",
    icon: (
      <path d="M13 2.5L4.5 13.5H11l-1 8 8.5-11H12l1-7.5z" strokeLinejoin="round" />
    ),
  },
];

const MAPPINGS = [
  {
    colour: "var(--accent-green)", asked: "More traffic", found: "Positioning / ICP",
    icon: <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" strokeLinecap="round" /></>,
    fic: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="3.5" /></>,
  },
  {
    colour: "var(--accent-blue)", asked: "More leads", found: "Conversion / Sales",
    icon: <path d="M4 20h16M7.5 20v-6M12 20V8M16.5 20v-10" strokeLinecap="round" />,
    fic: <path d="M4 5h16l-6 7v5l-4 2v-7L4 5z" strokeLinejoin="round" />,
  },
  {
    colour: "var(--brand-blue)", asked: "A new website", found: "Proposition / Product",
    icon: <><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8M12 17v4" strokeLinecap="round" /></>,
    fic: <path d="M12 2.5l8 4.5v9L12 20.5 4 16v-9l8-4.5zM4 7l8 4.5L20 7M12 11.5v9" strokeLinejoin="round" />,
  },
  {
    colour: "var(--accent-orange)", asked: "AI strategy", found: "Workflow / Operations",
    icon: <><circle cx="12" cy="12" r="8.5" /><path d="M12 3.5v17M3.5 12h17" strokeLinecap="round" /></>,
    fic: <path d="M20 12a8 8 0 1 1-2.3-5.6M20 3.5V8h-4.5" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    colour: "var(--accent-pink)", asked: "Email campaigns", found: "Customer journey",
    icon: <><rect x="3.5" y="5.5" width="17" height="13" rx="1.5" /><path d="M4 7l8 6 8-6" strokeLinecap="round" strokeLinejoin="round" /></>,
    fic: <><circle cx="12" cy="8" r="3" /><path d="M6 20a6 6 0 0 1 12 0" strokeLinecap="round" /></>,
  },
];

const MODELS = [
  { icon: <path d="M2 12s3.6-7 10-7 10 7 10 7M9.7 9.7a3 3 0 0 0 4.2 4.2M3 3l18 18" strokeLinecap="round" strokeLinejoin="round" />, h: "Behind the scenes", p: "We work with your team while you continue to own the client relationship and lead the engagement." },
  { icon: <><path d="M11 3H5a2 2 0 0 0-2 2v6l9 9 8-8-9-9z" strokeLinejoin="round" /><circle cx="7.5" cy="7.5" r="1.3" /></>, h: "White-label", p: "Where appropriate, CommView operates as part of your delivery capability without needing to appear as a separate supplier to the client." },
  { icon: <><circle cx="9" cy="12" r="6" /><circle cx="15" cy="12" r="6" /></>, h: "Co-branded", p: "Your agency and CommView are both visible, with each business bringing its respective expertise to the engagement." },
  { icon: <><circle cx="9" cy="8" r="3" /><circle cx="16" cy="9" r="2.4" /><path d="M4 19a5 5 0 0 1 10 0M14.5 19a4 4 0 0 1 5.5-3.7" strokeLinecap="round" /></>, h: "Client-facing", p: "We work directly with the client as your specialist partner, with the relationship, responsibilities and commercial boundaries agreed before the work begins." },
];

const STEPS = [
  { n: "01", h: "Tell us what the client needs.", p: "Give us the brief, the problem or simply the bit your current team cannot cover." },
  { n: "02", h: "We work out what experience it needs.", p: "We'll tell you whether we can help, who should be involved and whether the work needs delivery capacity, specialist expertise or something broader." },
  { n: "03", h: "Agree how we show up.", p: "Behind the scenes, white-labelled, co-branded or client-facing. We agree the model before the work starts." },
  { n: "04", h: "Get the work moving.", p: "The people brought into the engagement stay close to delivery rather than handing the work down through layers of account management." },
];

const FAQS = [
  { q: "Will you approach our client directly?", a: "Not unless that's the model we've agreed. We define the relationship before the work starts. If we're working behind your agency, we stay behind your agency. If the engagement is client-facing, everyone knows the role CommView is there to play." },
  { q: "Can you white-label your work?", a: "Yes, where it makes sense. We can work behind the scenes, white-labelled, co-branded or client-facing depending on the engagement and what works best for the agency-client relationship." },
  { q: "Can you just provide delivery capacity?", a: "Yes. Not every engagement needs a strategy project. If you need experienced support across SEO, AEO/GEO, email, social, content, demand generation or another workstream, we can work inside the existing plan and delivery structure." },
  { q: "What if the work turns into something bigger?", a: "That's often where CommView is most useful. If a channel problem exposes something in positioning, GTM, Product, Growth or operations, we can bring in the right experience rather than forcing the problem back into the original scope." },
  { q: "Do you only work with marketing agencies?", a: "No. The model can work with digital, creative, development, technology and other specialist agencies where CommView's capabilities complement what the agency already does." },
  { q: "How do you charge?", a: "It depends on the engagement. A defined project, additional delivery capacity and ongoing embedded support need different commercial models. We agree the scope, responsibilities and commercial relationship with the agency before work starts." },
];

const EXPERIENCE = ["Vodafone Business", "ADI Global", "Distrelec", "Travis Perkins"];

export default function AgenciesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: "CommView for Agencies",
        serviceType: "Specialist B2B delivery and consulting support for agencies",
        provider: { "@type": "Organization", name: "CommView", url: `${SITE}/` },
        areaServed: "GB",
        description:
          "Experienced delivery capacity and specialist capability across Growth, GTM Leadership, Product and Operational AI for agencies, behind the scenes, white-labelled, co-branded or client-facing.",
        url: `${SITE}/agencies`,
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
          { "@type": "ListItem", position: 2, name: "For Agencies", item: `${SITE}/agencies` },
        ],
      },
    ],
  };

  // Capability cards inside the hero "commview" panel (short descriptions).
  const heroCaps = [
    { c: "var(--accent-green)", h: "Growth", d: "SEO, AEO, email, social, content and demand", i: <path d="M4 20h16M7.5 20v-6M12 20V8M16.5 20v-10" strokeLinecap="round" /> },
    { c: "var(--brand-cyan)", h: "GTM Leadership", d: "Positioning, ICP, proposition and go-to-market", i: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1" /></> },
    { c: "var(--brand-blue)", h: "Product", d: "Strategy, discovery, roadmaps and adoption", i: <path d="M12 2.5l8.5 4.8v9.4L12 21.5l-8.5-4.8V7.3L12 2.5zM3.5 7.3L12 12l8.5-4.7M12 12v9.5" strokeLinejoin="round" /> },
    { c: "var(--accent-pink)", h: "Operational AI", d: "Workflows, automation and operational redesign", i: <path d="M13 2.5L4.5 13.5H11l-1 8 8.5-11H12l1-7.5z" strokeLinejoin="round" /> },
  ];

  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ===== HERO ===== */}
      <section className="agy-hero" aria-labelledby="agy-h1">
        <div className="wrap agy-hero__grid">
          <div className="agy-hero__lead">
            <p className="eyebrow-x">For agencies</p>
            <h1 className="agy-hero__h1" id="agy-h1">
              Say yes to more client work.
              <br />
              <span className="dim">Without building every capability in-house.</span>
            </h1>
            <p className="agy-hero__body">
              Bring CommView in when a client needs capability or capacity your
              team doesn&rsquo;t have available.
            </p>
            <p className="agy-hero__body">
              From SEO, email and social delivery to GTM, Product, Growth and
              Operational AI, we work behind your agency, alongside your team or in
              the room with the client.
            </p>
            <div className="agy-hero__cta">
              <a className="btn btn--cyan btn--lg" href={CONTACT}>
                Talk to us<span aria-hidden="true"> &rarr;</span>
              </a>
              <a className="btn btn--ghost btn--lg" href="#capabilities">
                See what we can support<span aria-hidden="true"> &darr;</span>
              </a>
            </div>
            <p className="agy-tagline">
              <span className="agy-tagline__dash" aria-hidden="true" />
              Your client. Your relationship. We add the capability.
            </p>
          </div>

          {/* Coded capability-flow diagram: CommView feeds capability up into the
              agency, which leads the client relationship. */}
          <div className="agy-fig" aria-hidden="true">
            <div className="agy-fig__client">
              <span className="agy-fig__ico">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 21V6l7-3 7 3v15M9 21v-4h6v4M8.5 8h1M14.5 8h1M8.5 11.5h1M14.5 11.5h1M8.5 15h1M14.5 15h1" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              <b>Your client</b>
              <span>A broader conversation</span>
            </div>

            <span className="agy-fig__up">
              <svg viewBox="0 0 16 44" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M8 44V6M3 11l5-5 5 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>

            <div className="agy-fig__mid">
              <div className="agy-fig__note agy-fig__note--l">
                <span className="agy-fig__note-ico">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="9" cy="8" r="3" /><circle cx="16" cy="9" r="2.4" /><path d="M4 19a5 5 0 0 1 10 0M14.5 19a4 4 0 0 1 5.5-3.7" strokeLinecap="round" /></svg>
                </span>
                <span className="agy-fig__note-t">More you<br />can deliver</span>
              </div>

              <div className="agy-fig__agency dark">
                <div className="agy-fig__agency-head">
                  <span className="agy-fig__ico agy-fig__ico--cyan">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="9" cy="8" r="3" /><circle cx="16" cy="9" r="2.4" /><path d="M4 19a5 5 0 0 1 10 0M14.5 19a4 4 0 0 1 5.5-3.7" strokeLinecap="round" /></svg>
                  </span>
                  <div>
                    <b>Your agency</b>
                    <span>You lead the client relationship</span>
                  </div>
                </div>
                <div className="agy-fig__pills">
                  {["SEO", "Email", "Social", "Content", "Paid media", "Creative"].map((p) => (
                    <span key={p}>{p}</span>
                  ))}
                </div>
              </div>

              <div className="agy-fig__note agy-fig__note--r">
                <span className="agy-fig__note-ico">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 17l6-6 4 4 6-7M15 8h5v5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
                <span className="agy-fig__note-t">More client<br />problems<br />you can solve</span>
              </div>
            </div>

            <div className="agy-fig__link">
              <svg viewBox="0 0 300 42" fill="none" preserveAspectRatio="none">
                <g stroke="var(--brand-cyan)" strokeWidth="1.6" strokeDasharray="3 4" opacity="0.7">
                  <path d="M40 42V22 Q40 8 60 8" />
                  <path d="M150 42V6" />
                  <path d="M260 42V22 Q260 8 240 8" />
                </g>
                <g fill="var(--brand-cyan)">
                  <circle cx="40" cy="42" r="3" /><circle cx="150" cy="42" r="3" /><circle cx="260" cy="42" r="3" />
                </g>
              </svg>
            </div>

            <div className="agy-fig__cv">
              <div className="agy-fig__cv-head">
                <span className="agy-fig__spark">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.6 5.6L19 9l-5.4 1.4L12 16l-1.6-5.6L5 9l5.4-1.4L12 2z" /></svg>
                </span>
                <b>commview</b>
              </div>
              <p className="agy-fig__cv-sub">Specialist delivery and senior expertise when you need it</p>
              <div className="agy-fig__caps">
                {heroCaps.map((cap) => (
                  <div className="agy-fig__cap" key={cap.h} style={cvar(cap.c)}>
                    <span className="agy-fig__cap-ico">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">{cap.i}</svg>
                    </span>
                    <b>{cap.h}</b>
                    <span>{cap.d}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHERE WE FIT ===== */}
      <section className="agy-sec" aria-labelledby="agy-fit-h">
        <div className="wrap">
          <div className="agy-fit__head">
            <p className="eyebrow-x">Where we fit</p>
            <h2 className="agy-h2" id="agy-fit-h">
              Sometimes you need capacity.
              <br />
              Sometimes you need capability.
            </h2>
            <p className="agy-intro">
              You don't need to hire around every client brief. CommView can add
              experienced delivery when the team is stretched, specialist
              capability when the work needs it, or senior thinking when the
              conversation moves beyond the original scope.
            </p>
          </div>
          <div className="agy-cards">
            {REASONS.map((r) => (
              <article className="agy-card" key={r.h} style={cvar(r.c)}>
                <span className="agy-card__ico">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">{r.icon}</svg>
                </span>
                <h3>{r.h}</h3>
                <p>{r.p}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CAPABILITIES ===== */}
      <section className="agy-sec agy-sec--alt" id="capabilities" aria-labelledby="agy-cap-h">
        <div className="wrap">
          <p className="eyebrow-x">What we can support</p>
          <h2 className="agy-h2" id="agy-cap-h">Add the capability the work actually needs.</h2>
          <p className="agy-intro">
            The support can be narrow and executional or span a wider commercial
            problem. We assemble around the work rather than forcing every
            engagement into the same package.
          </p>
          <div className="agy-caps">
            {CAPABILITIES.map((c) => (
              <article className="agy-cap" key={c.h} style={cvar(c.colour)}>
                <span className="agy-cap__ico">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">{c.icon}</svg>
                </span>
                <h3>{c.h}</h3>
                <p>{c.p}</p>
                <ul className="agy-cap__list">
                  {c.items.map((it) => (
                    <li key={it}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {it}
                    </li>
                  ))}
                </ul>
                <a className="agy-cap__link" href={c.href}>
                  {c.link}<span aria-hidden="true"> &rarr;</span>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== GO BEYOND THE BRIEF ===== */}
      <section className="agy-sec" aria-labelledby="agy-beyond-h">
        <div className="wrap agy-beyond">
          <div className="agy-beyond__lead">
            <p className="eyebrow-x">Go beyond the brief</p>
            <h2 className="agy-h2" id="agy-beyond-h">When your client asks what you weren't built to answer.</h2>
            <p className="agy-body">Sometimes the work uncovers a bigger problem.</p>
            <p className="agy-body">
              An SEO engagement exposes weak positioning. A paid campaign shows the
              ICP isn't clear. A website project raises questions about product
              adoption. A client asking for an "AI strategy" actually has broken
              workflows underneath it.
            </p>
            <p className="agy-body">You don't have to pretend that's part of the original brief.</p>
            <p className="agy-body">
              Bring in the right experience, solve the wider problem and keep the
              client relationship intact.
            </p>
          </div>
          <div className="agy-map">
            <div className="agy-map__head">
              <span>What they asked for</span>
              <span>What you discovered</span>
            </div>
            {MAPPINGS.map((m) => (
              <div className="agy-map__row" key={m.asked} style={cvar(m.colour)}>
                <span className="agy-map__asked">
                  <svg className="agy-map__ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">{m.icon}</svg>
                  {m.asked}
                </span>
                <svg className="agy-map__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M4 12h15M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="agy-map__found">
                  <svg className="agy-map__ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">{m.fic}</svg>
                  {m.found}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW THE RELATIONSHIP WORKS ===== */}
      <section className="agy-sec agy-sec--alt" aria-labelledby="agy-models-h">
        <div className="wrap">
          <p className="eyebrow-x">Working together</p>
          <h2 className="agy-h2" id="agy-models-h">Your client stays your client.</h2>
          <p className="agy-intro">
            We're there to strengthen what you can offer, not create a route around
            you. Before the work starts, we agree how CommView fits into the
            relationship, who owns what and how visible we should be to the client.
          </p>
          <div className="agy-models">
            {MODELS.map((m) => (
              <article className="agy-model" key={m.h}>
                <span className="agy-model__ico">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">{m.icon}</svg>
                </span>
                <h3>{m.h}</h3>
                <p>{m.p}</p>
              </article>
            ))}
          </div>
          <p className="agy-models__foot">
            One project. One specialist. An embedded workstream. Or ongoing support
            when you need additional capability.
          </p>
        </div>
      </section>

      {/* ===== EXPERIENCE + START WITH THE GAP ===== */}
      <section className="agy-sec" aria-labelledby="agy-exp-h">
        <div className="wrap agy-band">
          <div className="agy-exp">
            <p className="eyebrow-x">Experience built at</p>
            <h2 className="agy-h2" id="agy-exp-h">Experienced operators behind the work.</h2>
            <p className="agy-body">
              CommView brings together experienced operators across GTM, Growth,
              Product and Operational AI. We bring in the experience the work
              requires rather than expecting one person to pretend they can do
              everything.
            </p>
            <ul className="agy-exp__names">
              {EXPERIENCE.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
            <p className="agy-exp__note">
              Experience built inside these organisations, not CommView client work.
            </p>
          </div>
          <div className="agy-steps">
            <p className="eyebrow-x">Keep it simple</p>
            <h2 className="agy-h2">Start with the gap.</h2>
            <ol className="agy-steps__list">
              {STEPS.map((s) => (
                <li className="agy-step" key={s.n}>
                  <span className="agy-step__n">{s.n}</span>
                  <div>
                    <h3>{s.h}</h3>
                    <p>{s.p}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="agy-sec agy-sec--alt" aria-labelledby="agy-faq-h">
        <div className="wrap">
          <p className="eyebrow-x">Common questions</p>
          <h2 className="agy-h2" id="agy-faq-h">Working with CommView</h2>
          <div className="agy-faq">
            {FAQS.map((f) => (
              <details className="agy-faq__item" key={f.q}>
                <summary>
                  <span>{f.q}</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                  </svg>
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="agy-final dark" aria-labelledby="agy-final-h">
        <div className="wrap agy-final__in">
          <p className="eyebrow-x">Need support?</p>
          <h2 className="agy-final__h" id="agy-final-h">Need another pair of experienced hands?</h2>
          <p className="agy-final__body">
            Tell us what the client needs, what you're already covering and where
            the gap is. We'll tell you quickly whether CommView is a good fit and
            how we'd suggest working together.
          </p>
          <div className="agy-final__row">
            <a className="btn btn--cyan btn--lg" href={CONTACT}>Talk to us</a>
            <p className="agy-final__strap">
              Your client. Your relationship. The right expertise when you need it.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
