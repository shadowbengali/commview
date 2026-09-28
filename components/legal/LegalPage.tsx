import type { ReactNode } from "react";

// Shared shell for the three legal pages (/privacy, /terms, /cookies). Uses the
// site chrome and design system only: no marketing hero, no CTA, no cards. A
// narrow measure for readable long-form prose, a clear H1 and a "last updated"
// line, then the page's H2 sections, then a small cross-link nav.
export function LegalPage({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <main id="main">
      <section className="lgl">
        <div className="wrap lgl__wrap">
          <header className="lgl__head">
            <p className="eyebrow-x">{eyebrow}</p>
            <h1 className="lgl__h1">{title}</h1>
            <p className="lgl__updated">Last updated: {updated}</p>
          </header>
          <div className="lgl__prose">{children}</div>
          <nav className="lgl__nav" aria-label="Legal pages">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Website Terms of Use</a>
            <a href="/cookies">Cookie Policy</a>
          </nav>
        </div>
      </section>
    </main>
  );
}

// Small helper for the repeated contact block. No registered office address is
// ever rendered — only company number and public email, per the brief.
export function LegalContact() {
  return (
    <p className="lgl__contact">
      Commview Limited
      <br />
      Company number: 17456529
      <br />
      Email: <a href="mailto:info@commview.co.uk">info@commview.co.uk</a>
    </p>
  );
}
