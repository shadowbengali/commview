"use client";

import { useState } from "react";

import { Logo } from "./Logo";

// The site header with the "What We Do" mega-menu. Client because the mobile
// burger and the mega-menu are real disclosures (state + aria-expanded).

type Col = { title: string; href: string; accent: string; icon: keyof typeof ICON; tag: string; links: [string, string][] };

const ICON = {
  chart: <path d="M4 20h16M7.5 20v-6M12 20V8M16.5 20v-10" strokeLinecap="round" />,
  target: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1" /></>,
  cube: <path d="M12 2.5l8.5 4.8v9.4L12 21.5l-8.5-4.8V7.3L12 2.5zM3.5 7.3L12 12l8.5-4.7M12 12v9.5" strokeLinejoin="round" />,
  bolt: <path d="M13 2.5L4.5 13.5H11l-1 8 8.5-11H12l1-7.5z" strokeLinejoin="round" />,
};

const MENU: Col[] = [
  {
    title: "GTM Leadership", href: "/fractional-cmo", accent: "cyan", icon: "chart",
    tag: "Clearer positioning, sharper focus and a go-to-market engine that delivers.",
    links: [
      ["Fractional CMO Services", "/fractional-cmo/services"],
      ["B2B Positioning", "/positioning"],
      ["Ideal Customer Profile", "/ideal-customer-profile-workshop"],
      ["Demand Generation", "/demand-generation"],
    ],
  },
  {
    title: "Growth", href: "/growth", accent: "green", icon: "target",
    tag: "More of the right customers, through the right channels, with measurable impact.",
    links: [
      ["B2B SEO", "/growth/seo"],
      ["AEO & AI Search", "/growth/aeo"],
      ["B2B Lead Generation", "/growth/b2b-lead-generation"],
      ["Demand Generation", "/growth/demand-generation"],
      ["Paid Media", "/growth/paid-media"],
      ["Content Marketing", "/growth/content-marketing"],
      ["Conversion Optimisation", "/growth/conversion-optimisation"],
    ],
  },
  {
    title: "Product", href: "/product-strategy", accent: "blue", icon: "cube",
    tag: "Turn better ideas into products people actually use and buy.",
    links: [
      ["Product Strategy Consulting", "/product-strategy/consulting"],
      ["Fractional CPO", "/product-strategy/fractional-cpo"],
      ["Product Discovery", "/product-strategy/discovery"],
      ["MVP Development", "/product-strategy/mvp"],
      ["Product Roadmaps", "/product-strategy/roadmap"],
    ],
  },
  {
    title: "Operational AI", href: "/ai-consulting", accent: "pink", icon: "bolt",
    tag: "Practical AI that improves how you work, reduces waste and increases output.",
    links: [
      ["AI for Business Operations", "/ai-consulting/business-operations"],
      ["AI Workflow Automation", "/ai-consulting/workflow-automation"],
      ["AI Automation Consulting", "/ai-consulting/automation"],
      ["AI Implementation", "/ai-consulting/implementation"],
      ["Generative AI Consulting", "/ai-consulting/genai"],
      ["AI Transformation", "/ai-consulting/transformation"],
    ],
  },
];

const Chevron = () => (
  <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M9 6l6 6-6 6" /></svg>
);

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);

  return (
    <header className="hdr" onMouseLeave={() => setMega(false)}>
      <div className="wrap hdr__in">
        <a className="logo" href="/" aria-label="CommView home">
          <Logo />
          <span className="logo__sub">GTM Leadership / Growth / Product / Operational AI</span>
        </a>
        <nav className="hdr__nav" id="nav" aria-label="Main" data-open={open ? "true" : "false"}>
          <a href="/">Home</a>
          <button
            className="hdr__wwd"
            type="button"
            aria-expanded={mega}
            onClick={() => setMega((v) => !v)}
            onMouseEnter={() => setMega(true)}
          >
            What We Do
          </button>
          <a className="hdr__wwd-m" href="/what-we-do">What We Do</a>
          <a href="/how-we-work">How We Work</a>
          <a href="/work">Work</a>
          <a href="/insights">Insight</a>
          <a href="/about">About</a>
        </nav>
        <a className="btn btn--ink hdr__cta" href="/contact">Talk to us</a>
        <button
          className="burger"
          type="button"
          aria-label="Menu"
          aria-expanded={open}
          aria-controls="nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span></span><span></span><span></span>
        </button>
      </div>

      <div className={"mega" + (mega ? " mega--open" : "")} hidden={!mega} role="region" aria-label="What We Do">
        <div className="wrap mega__in">
          <div className="mega__cols">
            {MENU.map((col) => (
              <div className="mega-col" data-accent={col.accent} key={col.title}>
                <span className="mega-col__bar" aria-hidden></span>
                <span className="mega-col__ico" aria-hidden>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">{ICON[col.icon]}</svg>
                </span>
                <a className="mega-col__head" href={col.href} onClick={() => setMega(false)}>
                  {col.title} <Chevron />
                </a>
                <p className="mega-col__tag">{col.tag}</p>
                <ul className="mega-col__links">
                  {col.links.map(([label, href]) => (
                    <li key={href}><a href={href} onClick={() => setMega(false)}>{label} <Chevron /></a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <a className="mega__cta" href="/diagnostic" onClick={() => setMega(false)}>
            <span className="mega__cta-ico" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" strokeLinecap="round" /></svg>
            </span>
            <span className="mega__cta-lead">
              <span className="mega__cta-kicker">Not sure where the problem sits?</span>
              <span className="mega__cta-title">Take the Business Diagnostic.</span>
            </span>
            <span className="mega__cta-desc">Tell us what&rsquo;s not working and we&rsquo;ll help identify the constraint.</span>
            <span className="mega__cta-btn">Start the Diagnostic</span>
          </a>
        </div>
      </div>
    </header>
  );
}
