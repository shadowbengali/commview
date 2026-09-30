import type { Metadata } from "next";

import "../../../styles/diagnostic.css";

// /diagnostic — the entry page. Standard site chrome (header/footer from the
// (site) layout). Two routes are offered: the voice diagnostic (built later,
// shown here as "coming soon") and the question diagnostic, which is the text
// version. Copy is verbatim from the approved mock; nothing invented.

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.commview.co.uk";

export const metadata: Metadata = {
  title: { absolute: "CommView Business Diagnostic | Find the real constraint" },
  description:
    "You already know the symptom. The CommView Business Diagnostic helps work out what's actually causing it, across GTM, growth, product and operations.",
  alternates: { canonical: "/diagnostic" },
};

export default function DiagnosticEntryPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Diagnostic", item: `${SITE}/diagnostic` },
    ],
  };

  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="dg-hero" aria-labelledby="dg-h1">
        <div className="wrap dg-hero__grid">
          {/* ---- left: the pitch ---- */}
          <div className="dg-hero__lead">
            <p className="eyebrow-x">CommView Business Diagnostic</p>
            <h1 className="dg-h1" id="dg-h1">
              Something isn&rsquo;t working.
              <br />
              Let&rsquo;s find out what.
            </h1>
            <p className="dg-lead">
              You probably already know the symptom. Growth has slowed. Leads
              aren&rsquo;t converting. Customers aren&rsquo;t adopting the product.
              Delivery is taking too long.
            </p>
            <p className="dg-lead">
              The harder part is working out{" "}
              <strong>what&rsquo;s actually causing it.</strong>
            </p>
            <p className="dg-lead">
              We&rsquo;ll ask about your business, customers, growth, product and
              operations, then connect the dots to show you where we&rsquo;d
              investigate first.
            </p>

            <ul className="dg-meta">
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <circle cx="12" cy="12" r="8.5" />
                  <path d="M12 7.5V12l3 2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                8&ndash;12 minutes
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path d="M5 19V11M12 19V6M19 19v-5" strokeLinecap="round" />
                </svg>
                No generic score
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path d="M7 4h7l4 4v12H7z" strokeLinejoin="round" />
                  <path d="M13 4v5h5M9.5 13h6M9.5 16h6" strokeLinecap="round" />
                </svg>
                Actionable findings
              </li>
            </ul>
          </div>

          {/* ---- right: choose a route ---- */}
          <div className="dg-routes">
            <h2 className="dg-routes__h">How would you like to do it?</h2>

            {/* Question diagnostic — the text version (this build). Leads the
                pair while voice is still coming soon. */}
            <div className="dg-card" aria-labelledby="dg-q-h">
              <div className="dg-card__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M5 5h14v10H9l-4 4z" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="dg-card__h" id="dg-q-h">Answer questions</h3>
              <p className="dg-card__p">
                Prefer to type? Work through the same diagnostic at your own pace.
                Your answers determine what we ask next.
              </p>
              <a className="btn btn--ink dg-card__cta" href="/diagnostic/questions">
                Start question diagnostic
                <span aria-hidden="true"> &rarr;</span>
              </a>
              <p className="dg-card__foot">
                Best if you&rsquo;d rather think through your answers as you go.
              </p>
            </div>

            {/* Voice — built later. Shown as coming soon so the design intent is
                preserved without a dead control. */}
            <div className="dg-card dg-card--voice dark" aria-labelledby="dg-voice-h">
              <div className="dg-card__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <rect x="9" y="3" width="6" height="12" rx="3" />
                  <path d="M6 11a6 6 0 0 0 12 0M12 17v4" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="dg-card__h" id="dg-voice-h">Talk it through</h3>
              <p className="dg-card__p">
                Have a conversation. We&rsquo;ll ask questions, follow interesting
                threads and dig deeper where something doesn&rsquo;t add up.
              </p>
              <span className="dg-card__cta dg-card__cta--soon" aria-disabled="true">
                Start voice diagnostic
                <span className="dg-soon">Coming soon</span>
              </span>
              <p className="dg-card__foot">
                Best if you&rsquo;d rather explain what&rsquo;s happening naturally.
              </p>
            </div>
          </div>
        </div>

        <div className="wrap dg-band">
          <p className="dg-band__h">Both routes lead to the same diagnostic.</p>
          <p className="dg-band__p">
            We&rsquo;ll look across GTM, growth, product and operations rather than
            assuming the problem sits where the symptom appears.
          </p>
        </div>

        <div className="wrap">
          <p className="dg-note" role="note">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 11v5M12 8h.01" strokeLinecap="round" />
            </svg>
            You don&rsquo;t need to prepare anything. If you don&rsquo;t know an
            answer, say so. That&rsquo;s useful too.
          </p>
        </div>
      </section>
    </main>
  );
}
