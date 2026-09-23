import type { Metadata } from "next";

import { ContactForm } from "@/components/contact/ContactForm";
import { ContactEmail } from "@/components/contact/ContactEmail";

import "../../../styles/contact.css";

// /contact — simplified contact page (content/contact-page-build-brief.md).
// One job: make it easy to start a conversation. Premium, direct, calm. The
// visual interest is typography, whitespace and one brand graphic, not cards or
// a diagnostic flow. Form delivery lives in app/api/contact/route.ts.

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://commview-green.vercel.app";

export const metadata: Metadata = {
  title: { absolute: "Contact Commview | Talk to a B2B GTM, Growth, Product & AI Consultant" },
  description:
    "Tell Commview what's not working. Start with the business problem and we'll work out what should happen next. Based in Manchester, working with B2B businesses across the UK.",
  alternates: { canonical: "/contact" },
};

const NEXT = [
  { n: "01", h: "We read it.", b: "A real human reads your message. Not a bot. Not an automated qualification engine." },
  { n: "02", h: "We’ll tell you what we think.", b: "If we think we can help, we’ll arrange a conversation. If we don’t, we’ll tell you that too." },
  { n: "03", h: "Then we decide what happens next.", b: "That might be a diagnostic, a defined piece of work, or simply pointing you in the right direction." },
];

export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "Contact", item: `${SITE}/contact` },
        ],
      },
    ],
  };

  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ===== HERO ===== */}
      <section className="ct-hero dark" aria-labelledby="ct-h1">
        <div className="wrap ct-hero__grid">
          <div className="ct-hero__lead">
            <p className="eyebrow-x">Talk to us</p>
            <h1 className="ct-hero__h1" id="ct-h1">
              What&rsquo;s <span className="ct-grad">not working?</span>
            </h1>
            <p className="ct-hero__body">
              You don&rsquo;t need a brief. You don&rsquo;t need to know which service you need. You just
              need to tell us what&rsquo;s happening and what you&rsquo;d like to be different.
            </p>
            <div className="ct-hero__row">
              <a className="btn btn--cyan btn--lg" href="#contact-form">Send us a message</a>
              <span className="ct-hero__reassure">A conversation, not a sales sequence.</span>
            </div>
          </div>

          <div className="ct-signal" aria-hidden="true">
            <svg viewBox="0 0 360 460" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="ctBeam" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0" stopColor="var(--brand-cyan)" />
                  <stop offset="0.5" stopColor="var(--brand-blue)" />
                  <stop offset="1" stopColor="var(--accent-pink)" />
                </linearGradient>
              </defs>
              <path d="M232 -30 L360 -30 L150 490 L22 490 Z" fill="url(#ctBeam)" opacity="0.92" />
              <path d="M300 -30 L330 -30 L120 490 L90 490 Z" fill="var(--brand-charcoal)" opacity="0.55" />
              <path d="M196 -30 L214 -30 L4 490 L-14 490 Z" fill="url(#ctBeam)" opacity="0.5" />
            </svg>
            <ul className="ct-signal__words">
              <li>Insight</li>
              <li>Momentum</li>
              <li>Impact</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ===== CONTACT FORM ===== */}
      <section className="ct-form" id="contact-form" aria-labelledby="ct-form-h">
        <div className="wrap ct-form__grid">
          <div className="ct-form__lead">
            <p className="eyebrow-x ct-eye">Get in touch</p>
            <h2 id="ct-form-h">Tell us what&rsquo;s going on.</h2>
            <p className="ct-form__intro">The more context you can share, the better we can help. A few sentences is enough.</p>

            <dl className="ct-meta">
              <div className="ct-meta__row">
                <dt>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="13" rx="1.5" /><path d="M4 7l8 6 8-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  Email
                </dt>
                <dd>Or email us directly at <ContactEmail className="ct-link" /></dd>
              </div>
              <div className="ct-meta__row">
                <dt>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" strokeLinejoin="round" /><circle cx="12" cy="10" r="2.4" /></svg>
                  Location
                </dt>
                <dd>Manchester, UK</dd>
              </div>
            </dl>
          </div>

          <div className="ct-form__panel">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* ===== WHAT HAPPENS NEXT ===== */}
      <section className="ct-next" aria-labelledby="ct-next-h">
        <div className="wrap">
          <p className="eyebrow-x ct-eye">What happens next</p>
          <h2 id="ct-next-h">A straightforward conversation.</h2>
          <ol className="ct-steps">
            {NEXT.map((s) => (
              <li className="ct-step" key={s.n}>
                <span className="ct-step__n">{s.n}</span>
                <h3>{s.h}</h3>
                <p>{s.b}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ===== CLOSING BAND ===== */}
      <section className="ct-close dark" aria-labelledby="ct-close-h">
        <div className="wrap ct-close__in">
          <p className="eyebrow-x">Prefer to just talk?</p>
          <h2 id="ct-close-h">Let&rsquo;s have a conversation.</h2>
          <p className="ct-close__body">
            Email us at <ContactEmail className="ct-link ct-link--bright" />
            {/* TODO(client): add the verified Commview LinkedIn company URL, then wire the link below. */}
            {" "}or connect on LinkedIn <span className="ct-close__todo">(LinkedIn URL to be supplied)</span>.
          </p>
        </div>
      </section>
    </main>
  );
}
