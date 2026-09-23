import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";

import "../../../styles/about.css";

// /about — Commview as an operator-led network, built to the approved mock-up.
// Copy from content/about-page-build-brief.md (content source of truth). The
// experience logos mark where network members gained experience: not clients,
// partners or endorsers. No fabricated founder photo.

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://commview-green.vercel.app";
const cvar = (c: string): CSSProperties => ({ ["--c" as string]: c }) as CSSProperties;

export const metadata: Metadata = {
  title: { absolute: "About Commview | B2B GTM, Growth, Product & AI Operators" },
  description:
    "Meet Commview, an operator-led network bringing experienced GTM, growth, product, AI and transformation expertise around complex B2B problems.",
  alternates: { canonical: "/about" },
};

const PATHS: Record<string, ReactNode> = {
  people: <><circle cx="9" cy="8.5" r="3.2" /><path d="M3.5 19a5.5 5.5 0 0 1 11 0" /><path d="M15.5 6a3 3 0 0 1 0 5.9M17 19a5.5 5.5 0 0 0-2.8-4.8" strokeLinecap="round" /></>,
  target: <><circle cx="12" cy="12" r="8.2" /><circle cx="12" cy="12" r="4.3" /><circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" /></>,
  bolt: <path d="M13 2.5 5.5 13H11l-1 8.5L18.5 10.5H12l1-8Z" strokeLinejoin="round" />,
  chart: <><path d="M4 20h16" strokeLinecap="round" /><path d="M7.5 20v-6M12 20V9M16.5 20v-9" strokeLinecap="round" /></>,
};
function Icon({ name }: { name: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">{PATHS[name]}</svg>;
}

const PRINCIPLES = [
  { icon: "people", title: "Senior expertise", body: "Experienced people doing the work, not supervising a junior team doing it." },
  { icon: "target", title: "Right people, right problem", body: "The team changes with the problem. You get the expertise you need, when you need it." },
  { icon: "bolt", title: "Close to delivery", body: "We don't stop at recommendations. We work alongside your team to make things happen." },
  { icon: "chart", title: "Measurable impact", body: "The work should change something you can see, whether that's growth, cost, speed, conversion, adoption or operational performance." },
];

const LOGOS = [
  { src: "/logos/experience/vodafone.svg", alt: "Vodafone" },
  { src: "/logos/experience/google.svg", alt: "Google" },
  { src: "/logos/experience/microsoft.svg", alt: "Microsoft" },
  { src: "/logos/experience/apple.svg", alt: "Apple" },
  { src: "/logos/experience/capgemini.svg", alt: "Capgemini" },
  { src: "/logos/experience/accenture.svg", alt: "Accenture" },
  { src: "/logos/experience/travis-perkins.svg", alt: "Travis Perkins" },
  { src: "/logos/experience/resideo.svg", alt: "Resideo" },
  { src: "/logos/experience/adi.png", alt: "ADI Global Distribution" },
  { src: "/logos/experience/distrelec.jpg", alt: "Distrelec" },
  { src: "/logos/experience/barclays.svg", alt: "Barclays" },
];

const DISCIPLINES_L = [
  { label: "GTM", c: "var(--brand-cyan)" },
  { label: "Product", c: "var(--accent-blue)" },
  { label: "Growth", c: "var(--accent-green)" },
  { label: "Operational AI", c: "var(--accent-pink)" },
];
const DISCIPLINES_R = [
  { label: "Transformation" }, { label: "Commercial" }, { label: "Finance" }, { label: "Cybersecurity" },
];

const TRADITIONAL = ["Partner", "Director", "Manager", "Consultant", "Junior delivery"];
const COMMVIEW_MODEL = ["Understand the problem", "Bring in the right operators", "Work alongside your team", "Deliver measurable progress"];

const PHILOSOPHY = [
  { n: "01", label: "Insight", body: "Find out what's actually going on.", c: "var(--brand-cyan)" },
  { n: "02", label: "Momentum", body: "Bring the right people together and get the work moving.", c: "var(--brand-blue)" },
  { n: "03", label: "Impact", body: "Prove something changed.", c: "var(--accent-pink)" },
];

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE}/#organisation`,
        name: "Commview",
        url: SITE,
        description: "An operator-led network bringing experienced GTM, growth, product, AI and transformation expertise around complex B2B problems.",
        founder: { "@type": "Person", name: "Asad Ali", jobTitle: "Founder" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "About", item: `${SITE}/about` },
        ],
      },
    ],
  };

  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ===== HERO ===== */}
      <section className="ab-hero dark" aria-labelledby="ab-h1">
        <div className="wrap ab-hero__grid">
          <div className="ab-hero__lead">
            <p className="eyebrow-x">About</p>
            <h1 className="ab-hero__h1" id="ab-h1">
              Experience,<br /><span className="ab-grad">assembled around</span><br />the problem.
            </h1>
            <div className="ab-hero__body">
              <p>Commview brings together experienced operators across GTM, growth, product, AI and transformation. People who have built products, launched propositions, grown businesses and led transformation inside some of the world&rsquo;s largest organisations.</p>
              <p className="ab-hero__sub">You bring the problem. We bring the right experience around it.</p>
            </div>
          </div>
          <div className="ab-signal" aria-hidden="true">
            <svg className="ab-signal__slash" viewBox="0 0 220 340" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="abBeam" x1="0" y1="1" x2="0.6" y2="0">
                  <stop offset="0" stopColor="var(--accent-pink)" />
                  <stop offset="0.5" stopColor="var(--brand-blue)" />
                  <stop offset="1" stopColor="var(--brand-cyan)" />
                </linearGradient>
              </defs>
              <path d="M120 -20 L168 -20 L92 360 L44 360 Z" fill="url(#abBeam)" />
            </svg>
            <p className="ab-signal__note">Real experience.<br />Real outcomes.<br />A more practical approach.</p>
          </div>
        </div>
      </section>

      {/* ===== THE COMMVIEW DIFFERENCE ===== */}
      <section className="ab-diff" aria-labelledby="ab-diff-h">
        <div className="wrap">
          <p className="eyebrow-x ab-eye">The Commview difference</p>
          <h2 id="ab-diff-h">Not an agency. Not a traditional consultancy.<br />A network of operators.</h2>
          <div className="ab-diff__grid">
            <div className="ab-diff__body">
              <p>Most businesses don&rsquo;t need another team standing on the outside telling them what to do. And they don&rsquo;t always need another permanent senior hire.</p>
              <p>Sometimes they need access to someone who&rsquo;s solved this kind of problem before.</p>
              <p>Commview brings together experienced operators from different disciplines and puts the right expertise around the problem. We stay close to the work, help make decisions and get involved in delivery.</p>
            </div>
            <ul className="ab-principles">
              {PRINCIPLES.map((p) => (
                <li className="ab-principle" key={p.title}>
                  <span className="ab-principle__ico"><Icon name={p.icon} /></span>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ===== EXPERIENCE / LOGOS ===== */}
      <section className="ab-exp" aria-labelledby="ab-exp-h">
        <div className="wrap">
          <p className="eyebrow-x ab-eye">Experience from inside the room</p>
          <h2 id="ab-exp-h">Experience earned by doing the work.</h2>
          <div className="ab-exp__body">
            <p>Across the Commview network, our experience has been built inside organisations including Vodafone, Google, Microsoft, Apple, Capgemini, Accenture, Barclays, Travis Perkins, Resideo, ADI Global and Distrelec.</p>
            <p>That experience spans paid acquisition, GTM, product, commercial strategy, cybersecurity, finance, customer experience and large-scale digital and business transformation. It includes people who&rsquo;ve led acquisition, launched products, transformed operating models and, in the case of Barclays, helped launch its first mobile banking app.</p>
          </div>
          <ul className="ab-logos">
            {LOGOS.map((l) => (
              <li key={l.alt}><img src={l.src} alt={l.alt} loading="lazy" /></li>
            ))}
          </ul>
          <p className="ab-exp__note">The logos aren&rsquo;t the proposition. The experience behind them is. They mark where network members gained experience, not endorsement, partnership or client status.</p>
        </div>
      </section>

      {/* ===== THE NETWORK ===== */}
      <section className="ab-net" aria-labelledby="ab-net-h">
        <div className="wrap ab-net__grid">
          <div className="ab-net__lead">
            <p className="eyebrow-x ab-eye">A broader range of experience</p>
            <h2 id="ab-net-h">Different experience.<br />A shared approach.</h2>
            <div className="ab-net__body">
              <p>Business problems rarely stay neatly inside one function.</p>
              <p>A growth problem might turn out to be positioning. A product problem might actually be GTM. An AI opportunity might require process redesign before it requires any technology.</p>
              <p>That&rsquo;s why Commview isn&rsquo;t built around a fixed team or a single discipline. We diagnose what&rsquo;s actually happening, then bring together the experience the problem requires.</p>
            </div>
            <a className="btn btn--cyan" href="/contact">Talk to us</a>
          </div>

          <div className="ab-orbit">
            <ul className="ab-orbit__col">
              {DISCIPLINES_L.map((d) => (
                <li className="ab-chip" style={cvar(d.c)} key={d.label}><span className="ab-chip__dot" aria-hidden="true" />{d.label}</li>
              ))}
            </ul>
            <div className="ab-orbit__core">
              <span className="ab-orbit__name">COMMVIEW</span>
              <span className="ab-orbit__tag">Diagnose. Assemble. Deliver.</span>
            </div>
            <ul className="ab-orbit__col">
              {DISCIPLINES_R.map((d) => (
                <li className="ab-chip ab-chip--n" key={d.label}><span className="ab-chip__dot" aria-hidden="true" />{d.label}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ===== OPERATING MODEL ===== */}
      <section className="ab-model" aria-labelledby="ab-model-h">
        <div className="wrap ab-model__grid">
          <div className="ab-model__lead">
            <p className="eyebrow-x ab-eye">A simpler, more effective model</p>
            <h2 id="ab-model-h">No pyramid. Just the right people doing the work.</h2>
            <div className="ab-model__body">
              <p>Traditional consulting models often separate the people who understand the problem from the people delivering the work. Commview is deliberately different.</p>
              <p>We keep the core small and bring specialist experience into an engagement when it&rsquo;s needed. No unnecessary layers. No permanent bench to keep busy. No handing the work down through a hierarchy.</p>
            </div>
          </div>
          <div className="ab-compare">
            <div className="ab-compare__card ab-compare__card--old">
              <span className="ab-compare__title">Traditional model</span>
              <ol className="ab-pyramid">
                {TRADITIONAL.map((t, i) => (
                  <li key={t} style={{ opacity: 1 - i * 0.14 }}>{t}</li>
                ))}
              </ol>
            </div>
            <div className="ab-compare__card ab-compare__card--new">
              <span className="ab-compare__title">Commview model</span>
              <ol className="ab-steps">
                {COMMVIEW_MODEL.map((t) => (
                  <li key={t}><span className="ab-steps__dot" />{t}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOUNDER ===== */}
      <section className="ab-founder" aria-labelledby="ab-founder-h">
        <div className="wrap ab-founder__grid">
          <div className="ab-founder__lead">
            <p className="eyebrow-x ab-eye">Founded by an operator</p>
            <h2 id="ab-founder-h">Why I started Commview</h2>
            <div className="ab-founder__body">
              <p>Across 15+ years in product, GTM, growth and digital, including Vodafone Business, ADI Global, Distrelec and Travis Perkins, I kept seeing the same pattern.</p>
              <p>The problems holding businesses back rarely belonged to one function. Marketing problems were sometimes product problems. Product problems were sometimes GTM problems. Businesses bought more technology when the real problem was the process underneath it. Strategies were created by one team and handed to another team to somehow make work.</p>
              <p>Commview came from wanting to work differently. Start with the problem. Bring the right experience around it. Stay close enough to delivery to make a difference. Then measure whether anything actually changed.</p>
            </div>
            <p className="ab-founder__by"><strong>Asad Ali</strong><span>Founder, Commview</span></p>
          </div>
          <div className="ab-founder__aside">
            {/* TODO(client): supply an approved photograph of Asad; placeholder until then (no fabricated portrait). */}
            <div className="ab-founder__photo" role="img" aria-label="Photograph of Asad Ali, to be supplied">
              <span>Founder photo</span>
            </div>
            <figure className="ab-quote">
              <blockquote>&ldquo;The best person for the problem matters more than the department they sit in.&rdquo;</blockquote>
              <figcaption><strong>Asad Ali</strong><span>Founder, Commview</span></figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ===== OPERATING PHILOSOPHY ===== */}
      <section className="ab-phil" aria-labelledby="ab-phil-h">
        <div className="wrap">
          <div className="ab-phil__head">
            <div>
              <p className="eyebrow-x ab-eye">Our operating philosophy</p>
              <h2 id="ab-phil-h">From insight to impact.</h2>
            </div>
            <p className="ab-phil__sub">Whatever the problem, the approach stays simple.</p>
          </div>
          <ol className="ab-phil__steps">
            {PHILOSOPHY.map((p) => (
              <li className="ab-phil__step" style={cvar(p.c)} key={p.n}>
                <span className="ab-phil__n">{p.n}</span>
                <span className="ab-phil__label">{p.label}</span>
                <p>{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ===== CLOSING CTA ===== */}
      <section className="ab-cta dark" aria-labelledby="ab-cta-h">
        <div className="wrap ab-cta__grid">
          <div>
            <p className="eyebrow-x ab-eye">Let&rsquo;s talk</p>
            <h2 id="ab-cta-h">Got a problem that doesn&rsquo;t fit neatly into one box?</h2>
            <p className="ab-cta__body">That&rsquo;s usually where we start.</p>
          </div>
          <a className="btn btn--cyan btn--lg" href="/contact">Talk to us</a>
        </div>
      </section>
    </main>
  );
}
