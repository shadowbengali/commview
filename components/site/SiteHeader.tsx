"use client";

import { useState } from "react";

import { Logo } from "./Logo";

// The site header. Client because the mobile menu is a real disclosure: the
// burger toggles the nav's data-open state (chrome.css keys the collapsed menu
// off [data-open="true"]) and its own aria-expanded.
export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="hdr">
      <div className="wrap hdr__in">
        <a className="logo" href="#" aria-label="COMMVIEW home">
          <Logo />
          <span className="logo__sub">
            GTM Leadership / Growth / Product / Operational AI
          </span>
        </a>
        <nav
          className="hdr__nav"
          id="nav"
          aria-label="Main"
          data-open={open ? "true" : "false"}
        >
          <a href="#" aria-current="page">
            Home
          </a>
          <a href="#what-we-do">What We Do</a>
          <a href="#how-we-work">How We Work</a>
          <a href="#">Work</a>
          {/* Section label is "Insight"; canonical URL is /blog. */}
          <a href="/blog">Insight</a>
          <a href="#about">About</a>
        </nav>
        <a className="btn btn--ink hdr__cta" href="#">
          Talk to us
        </a>
        <button
          className="burger"
          type="button"
          aria-label="Menu"
          aria-expanded={open}
          aria-controls="nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}
