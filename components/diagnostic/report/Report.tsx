import type { Analysis } from "@/lib/diagnostic/ai";
import type { EvidenceItem, EvidenceStrength, JourneyType, Spine } from "@/lib/diagnostic/spine";

import { JourneyRail } from "./JourneyRail";
import { UnlockGate } from "./UnlockGate";
import { UnlockedModal } from "./UnlockedModal";
import { ViewTracker, TrackedLink, PrintButton } from "./ReportClient";

// The full report presentation. Pure props in, so it can be rendered from the
// stored submission (the page) or from mock data (a preview). The teaser
// (summary + journey) always renders; the interpretation only when unlocked.

// Journey model -> functional accent. Cross-functional uses purple, per the brief.
const ACCENT: Record<JourneyType, string> = {
  commercial: "var(--brand-cyan)",
  product: "var(--accent-blue)",
  operations: "var(--accent-pink)",
  cross_functional: "var(--brand-blue)",
};
const STRENGTH_LABEL: Record<EvidenceStrength, string> = {
  strong: "Strong evidence",
  moderate: "Moderate evidence",
  limited: "Limited evidence",
};
const STRENGTH_SEGMENTS = 8;
const STRENGTH_FILL: Record<EvidenceStrength, number> = { limited: 2, moderate: 4, strong: 7 };

// Category icons for the insight cards, cycled by position (matches the
// reference: magnifier, cube, people).
const INSIGHT_ICONS = [
  <svg key="s" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
  </svg>,
  <svg key="c" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" strokeLinejoin="round" />
    <path d="M4 7.5l8 4.5 8-4.5M12 12v9" strokeLinejoin="round" />
  </svg>,
  <svg key="u" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <circle cx="9" cy="8" r="3" />
    <path d="M3.5 20a5.5 5.5 0 0 1 11 0" strokeLinecap="round" />
    <path d="M16 5.5a3 3 0 0 1 0 5.5M21 20a5.5 5.5 0 0 0-4-5.3" strokeLinecap="round" />
  </svg>,
];

function EvidenceList({ items, tone }: { items: EvidenceItem[]; tone: "point" | "complicate" }) {
  return (
    <ul className={`dr-ev dr-ev--${tone}`}>
      {items.map((e, i) => (
        <li key={i}>
          <span className="dr-ev__mark" aria-hidden="true">
            {tone === "point" ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3l9 16H3z" strokeLinejoin="round" />
                <path d="M12 10v4" strokeLinecap="round" />
                <circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" />
              </svg>
            )}
          </span>
          <span>{e.statement}</span>
        </li>
      ))}
    </ul>
  );
}

export function Report({
  spine,
  analysis,
  firstName,
  createdAt,
  id,
}: {
  spine: Spine;
  analysis: Analysis | null;
  firstName: string | null;
  createdAt: string;
  id: string;
}) {
  const unlocked = !!analysis;
  const accent = ACCENT[spine.journey.type] ?? "var(--brand-cyan)";

  const prepared = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(createdAt));

  // Headline stays deterministic — short and on-brand. The AI writes the prose
  // around it, not the verdict itself.
  const headline = spine.headline;
  const initialRead =
    analysis?.initialRead ?? `The strongest signal appears to sit around ${spine.weakLink.toLowerCase()}.`;
  const summary = analysis?.summary?.length ? analysis.summary : [spine.summary];

  const rightItems = spine.complicating.length ? spine.complicating : spine.unknowns;
  const rightHeading = spine.complicating.length ? "What complicates the picture" : "What we don’t know yet";

  return (
    <main id="main" className="dr" style={{ ["--c" as string]: accent }}>
      <ViewTracker
        primaryArea={spine.primaryArea}
        evidenceStrength={spine.evidenceStrength}
        journeyType={spine.journey.type}
        unlocked={unlocked}
      />

      {/* SECTION 1 — SUMMARY */}
      <section className="dr-summary">
        <div className="wrap dr-summary__grid">
          <div className="dr-summary__lead">
            <p className="dr-eyebrow">Your Commview Diagnostic</p>
            <p className="dr-meta">
              {firstName ? `Prepared for ${firstName} · ` : "Prepared · "}
              {prepared}
            </p>
            <h1 className="dr-h1">{headline}</h1>
            <p className="dr-hypothesis">{initialRead}</p>
            <div className="dr-prose">
              {summary.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>

          <aside className="dr-read" aria-label="Initial read">
            <p className="dr-read__k">Initial read</p>
            <p className="dr-read__area">{spine.primaryArea}</p>
            <p className="dr-read__strength">{STRENGTH_LABEL[spine.evidenceStrength]}</p>
            <div className="dr-strength" aria-hidden="true">
              {Array.from({ length: STRENGTH_SEGMENTS }).map((_, i) => (
                <span key={i} className={i < STRENGTH_FILL[spine.evidenceStrength] ? "is-on" : ""} />
              ))}
            </div>
            <div className="dr-read__stats">
              <div className="dr-stat">
                <span className="dr-stat__top">Based on</span>
                <b>{spine.answersAnalysed}</b>
                <span className="dr-stat__unit">answers</span>
              </div>
              <div className="dr-stat">
                <span className="dr-stat__top">Important gaps</span>
                <b>{spine.gapsRemaining}</b>
                <span className="dr-stat__unit">remain</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* SECTION 2 — WHERE THE SIGNAL APPEARS */}
      <section className="dr-journey">
        <div className="wrap">
          <div className="dr-journey__head">
            <p className="dr-eyebrow">Where the signal appears</p>
            <p className="dr-journey__model">{spine.journey.label}</p>
          </div>
          <JourneyRail journey={spine.journey} />

          <div className="dr-split">
            {spine.strongestSignals.length ? (
              <div className="dr-panel dr-panel--point">
                <h2 className="dr-panel__h">What points us here</h2>
                <EvidenceList items={spine.strongestSignals} tone="point" />
              </div>
            ) : null}
            {rightItems.length ? (
              <div className="dr-panel dr-panel--warn">
                <h2 className="dr-panel__h">{rightHeading}</h2>
                <EvidenceList items={rightItems} tone="complicate" />
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {unlocked && analysis ? (
        <>
          <UnlockedModal primaryArea={spine.primaryArea} />

          {/* SECTION 3 — AI INTERPRETATION */}
          {analysis.insights.length ? (
            <section className="dr-insights dark">
              <div className="wrap">
                <p className="dr-eyebrow">What doesn&rsquo;t quite add up</p>
                <h2 className="dr-section-h">The parts worth a closer look.</h2>
                <div className={`dr-cards dr-cards--${analysis.insights.length}`}>
                  {analysis.insights.map((c, i) => (
                    <article className="dr-card" key={i}>
                      <span className="dr-card__top">
                        <span className="dr-card__num">{String(i + 1).padStart(2, "0")}</span>
                        <span className="dr-card__icon">{INSIGHT_ICONS[i % INSIGHT_ICONS.length]}</span>
                      </span>
                      <h3 className="dr-card__h">{c.headline}</h3>
                      <p className="dr-card__p">{c.explanation}</p>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          ) : null}

          {/* SECTION 4 — WHERE WE'D INVESTIGATE FIRST */}
          {analysis.investigationPriorities.length ? (
            <section className="dr-investigate">
              <div className="wrap">
                <div className="dr-journey__head">
                  <p className="dr-eyebrow">Where we&rsquo;d investigate first</p>
                  <p className="dr-journey__model">Based on your answers</p>
                </div>
                <div className={`dr-cols dr-cols--${analysis.investigationPriorities.length}`}>
                  {analysis.investigationPriorities.map((p, i) => (
                    <div className="dr-prio" key={i}>
                      <span className="dr-prio__num">{String(i + 1).padStart(2, "0")}</span>
                      <h3 className="dr-prio__t">{p.title}</h3>
                      <p className="dr-prio__q">{p.question}</p>
                      <p className="dr-prio__x">{p.explanation}</p>
                      <div className="dr-prio__foot">
                        <span className={`dr-tag dr-tag--${p.evidenceType}`}>
                          {p.evidenceType === "signal"
                            ? "Signal"
                            : p.evidenceType === "gap"
                            ? "Gap"
                            : "Hypothesis"}
                        </span>
                        <span className="dr-prio__why">{p.whyItMatters}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ) : null}

          {/* SECTION 5 — RECOMMENDED FIRST MOVE */}
          <section className="dr-move">
            <div className="wrap dr-move__wrap">
              <div className="dr-move__lead">
                <p className="dr-eyebrow">Our recommended first move</p>
                <h2 className="dr-move__h">{analysis.recommendedFirstMove.title}</h2>
                <p className="dr-move__p">{analysis.recommendedFirstMove.explanation}</p>
              </div>
              {analysis.recommendedFirstMove.questionsToAnswer.length ? (
                <div className="dr-move__know">
                  <p className="dr-move__k">What we&rsquo;d want to know</p>
                  <ul>
                    {analysis.recommendedFirstMove.questionsToAnswer.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </section>

          {/* SECTION 6 — WHAT WE WOULDN'T DO YET */}
          {analysis.whatNotToDoYet ? (
            <section className="dr-avoid">
              <div className="wrap dr-avoid__wrap">
                <p className="dr-eyebrow">What we wouldn&rsquo;t do yet</p>
                <h2 className="dr-avoid__h">{analysis.whatNotToDoYet.title}</h2>
                <p className="dr-avoid__p">{analysis.whatNotToDoYet.explanation}</p>
              </div>
            </section>
          ) : null}

          {/* SECTION 7 — NEXT STEP */}
          <section className="dr-next dark">
            <div className="wrap dr-next__wrap">
              <p className="dr-eyebrow">Next step</p>
              <h2 className="dr-next__h">Want us to go deeper?</h2>
              <p className="dr-next__p">
                This is an initial view based on what you&rsquo;ve told us. The next step is
                validating it against the data, customers and people inside the business.
              </p>
              <div className="dr-next__row">
                <TrackedLink
                  href={`/contact?source=diagnostic&ref=${id}`}
                  event="diagnostic_contact_clicked"
                  props={{ primary_area: spine.primaryArea }}
                  className="btn btn--cyan btn--lg"
                >
                  Talk to Commview<span aria-hidden="true"> &rarr;</span>
                </TrackedLink>
                <PrintButton className="btn btn--ghost btn--lg" primaryArea={spine.primaryArea}>
                  Download as PDF
                </PrintButton>
              </div>
            </div>
          </section>
        </>
      ) : (
        <UnlockGate id={id} primaryArea={spine.primaryArea} evidenceStrength={spine.evidenceStrength} />
      )}
    </main>
  );
}
