import type { CSSProperties } from "react";

import { Logo } from "./Logo";

const slate: CSSProperties = { color: "var(--slate)" };
const cyan: CSSProperties = { color: "var(--brand-cyan)" };

export function SiteFooter() {
  return (
    <footer className="ftr dark">
      <div className="wrap">
        <div className="ftr__top">
          <a className="logo" href="#" aria-label="COMMVIEW home">
            <Logo />
            <span className="logo__sub" style={slate}>
              GTM Leadership · Growth · Product · Operational AI
            </span>
          </a>
          <nav className="ftr__meta" aria-label="Footer">
            <a href="#what-we-do">What We Do</a>
            <a href="#how-we-work">How We Work</a>
            <a href="#work">Work</a>
            {/* Visible label "Insight"; canonical URL is /insights. */}
            <a href="/insights">Insight</a>
            <a href="#about">About</a>
            <a href="#diagnostic">Diagnostic</a>
          </nav>
        </div>
        <hr className="hair" style={{ marginTop: "var(--space-12)" }} />
        <div className="ftr__bottom small dim">
          <address style={{ fontStyle: "normal" }}>
            Manchester ·{" "}
            <a href="mailto:hello@commview.co.uk" style={cyan}>
              hello@commview.co.uk
            </a>{" "}
            ·{" "}
            <a href="#" rel="me" style={cyan}>
              LinkedIn
            </a>
          </address>
          <span className="ftr__strap">Insight → Momentum → Impact</span>
        </div>
      </div>
    </footer>
  );
}
