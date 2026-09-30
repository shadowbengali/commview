import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { READINGS } from "@/lib/diagnostic/content";
import { getSubmission } from "@/lib/diagnostic/store";

import "../../../../../styles/diagnostic.css";

// /diagnostic/result/[id] — the gated, personalised diagnostic, rendered from
// the stored submission. Always noindex (personal + gated), shareable by link.

export const metadata: Metadata = {
  title: { absolute: "Your Business Diagnostic | Commview" },
  robots: { index: false, follow: false },
};

export default async function DiagnosticResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await getSubmission(id);
  if (!row) notFound();

  const reading = READINGS[row.reading];
  const ai = row.ai;
  const narrative = ai?.narrative?.length ? ai.narrative : reading ? [reading.summary] : [];
  const moves = ai?.moves ?? [];
  const insights = ai?.insights ?? [];
  const evidence = (row.evidence ?? []).slice(0, 6);

  return (
    <main id="main">
      <section className="dgr">
        <div className="wrap dgr__wrap">
          <p className="dg-run__eyebrow">Your Commview Diagnostic</p>
          {row.first_name ? <p className="dgr__hi">Prepared for {row.first_name}.</p> : null}
          <h1 className="dgr__headline">{reading?.headline ?? "Your diagnostic"}</h1>

          <div className="dgr__block">
            <p className="dgr__k">Weak link</p>
            <p className="dgr__weak">{row.weak_link}</p>
          </div>

          <div className="dgr__block">
            <p className="dgr__k">What we&rsquo;re seeing</p>
            {narrative.map((p, i) => (
              <p key={i} className="dgr__body">{p}</p>
            ))}
          </div>

          {moves.length ? (
            <div className="dgr__block">
              <p className="dgr__k">Where we&rsquo;d start</p>
              <ol className="dgr__moves">
                {moves.map((m, i) => (
                  <li className="dgr__move" key={i}>
                    <span className="dgr__move-h">{m.horizon}</span>
                    <b className="dgr__move-t">{m.title}</b>
                    <span className="dgr__move-d">{m.detail}</span>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          {evidence.length ? (
            <div className="dgr__block">
              <p className="dgr__k">Evidence from your answers</p>
              <ul className="dgr__ev">
                {evidence.map((e, i) => (
                  <li key={i}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                      <path d="M7 4h7l4 4v12H7z" strokeLinejoin="round" />
                      <path d="M13 4v5h5" strokeLinejoin="round" />
                    </svg>
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {insights.length ? (
            <div className="dgr__block">
              <p className="dgr__k">Worth reading next</p>
              <ul className="dgr__insights">
                {insights.map((it) => (
                  <li key={it.slug}>
                    <a href={`/insights/${it.slug}`}>
                      {it.title}<span aria-hidden="true"> &rarr;</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="dgr__cta dark">
            <h2 className="dgr__ctah">Want us to go deeper?</h2>
            <p className="dgr__ctap">
              This is an initial view based on what you&rsquo;ve told us. The next
              step is validating it against the data, customers and people inside
              the business.
            </p>
            <a className="btn btn--cyan btn--lg" href="/contact?source=diagnostic">
              Talk to Commview<span aria-hidden="true"> &rarr;</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
