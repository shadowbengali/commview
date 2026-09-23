"use client";

import { useState } from "react";

import { CASES, FILTERS, type Cap } from "@/lib/work/cases";

// Proven-work grid with a client-side capability filter: no reload, multi-tag,
// accessible buttons with a selected state, default All.

export function CaseStudies() {
  const [active, setActive] = useState<"All" | Cap>("All");
  const shown = active === "All" ? CASES : CASES.filter((c) => c.caps.includes(active));

  return (
    <>
      <div className="wk-filter" role="group" aria-label="Filter case studies by capability">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            className="wk-filter__btn"
            aria-pressed={active === f}
            onClick={() => setActive(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <ul className="wk-cases">
        {shown.map((c) => (
          <li className="wk-case" key={c.id}>
            <div className="wk-case__logo">
              {/* TODO(client): approved brand asset in place of the text wordmark */}
              <span className="wk-case__wordmark">{c.company}</span>
              {c.unit ? <span className="wk-case__unit">{c.unit}</span> : null}
            </div>
            <h3 className="wk-case__headline">{c.headline}</h3>
            <div className="wk-case__outcomes">
              {c.outcomes.map((o) => (
                <div className="wk-case__metric" key={o.l}>
                  <span className="wk-case__v">{o.v}</span>
                  <span className="wk-case__l">{o.l}</span>
                </div>
              ))}
            </div>
            <span className="wk-case__soon" aria-hidden="true">Full case study coming soon</span>
          </li>
        ))}
      </ul>
    </>
  );
}
