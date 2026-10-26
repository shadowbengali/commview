import type { BriefContent, Discipline } from "@/lib/brief/types";
import { BriefTracker } from "./BriefTracker";

// Alternate "audit dossier" treatment of the prospect brief: identical content,
// denser dark instrument-panel styling, the real homepage shot kept in the hero.
// Self-contained styles (.brd-*) so the original BriefPage is untouched. Server-
// rendered; the only client piece is first-party engagement tracking.

const CALENDAR_URL = "https://calendar.app.google/Hx4AQi6bJurZL8jU7";

const DISC_COLOUR: Record<Discipline, string> = {
  "GTM Leadership": "var(--brand-cyan)",
  Growth: "var(--accent-green)",
  Product: "var(--brand-blue)",
  "Operational AI": "var(--accent-pink)",
};

// Decorative accent cycles for the number cards (colour only, no copy meaning).
const STAT_ACCENTS = ["var(--accent-green)", "var(--brand-cyan)", "var(--brand-blue)"];
const RESULT_ACCENTS = ["var(--accent-green)", "var(--brand-blue)", "var(--accent-pink)"];

const cvar = (c: string): React.CSSProperties => ({ ["--c" as string]: c });

function Cta({ label, place }: { label: string; place: string }) {
  return (
    <a className="btn btn--cyan btn--lg" href={CALENDAR_URL} data-cta={place} target="_blank" rel="noopener">
      {label}
    </a>
  );
}

// Highlight every standalone occurrence of `word` in brand cyan — emphasis on
// existing copy, never a change to it. No-op when the word is absent.
function highlightWord(text: string, word: string): React.ReactNode {
  const esc = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(\\b${esc}\\b)`, "i"));
  if (parts.length === 1) return text;
  return parts.map((p, i) =>
    p.toLowerCase() === word.toLowerCase() ? <em key={i}>{p}</em> : <span key={i}>{p}</span>
  );
}

// Highlight an optional substring of the callout body in brand cyan.
function emphasise(body: string, emphasis?: string): React.ReactNode {
  if (!emphasis || !body.includes(emphasis)) return body;
  const [before, after] = body.split(emphasis);
  return (
    <>
      {before}
      <b className="brd-shot__em">{emphasis}</b>
      {after}
    </>
  );
}

export function BriefDossier({
  content: c,
  screenshot,
  token,
}: {
  content: BriefContent;
  screenshot?: string | null;
  token: string;
}) {
  const maxBar = c.chart ? Math.max(...c.chart.bars.map((b) => b.value)) : 0;
  const shot = c.site && screenshot ? c.site : null;

  return (
    <main id="main" className="brd">
      <BriefTracker token={token} />

      {/* private strip */}
      <div className="brd-private">
        <span>{c.hero.privateLabel}{c.hero.date ? ` · ${c.hero.date}` : ""}</span>
        <span className="brd-private__tag">Confidential</span>
      </div>

      {/* ===== HERO ===== */}
      <section className="brd-hero" aria-labelledby="brd-q">
        <div className={`wrap brd-hero__grid${shot ? " brd-hero__grid--split" : ""}`}>
          <div className="brd-hero__lead">
            <span className="brd-pill">
              <span className="brd-pill__dot" aria-hidden="true" />
              {c.hero.eyebrow}
            </span>
            <p className="brd-hero__small">{c.hero.smallLabel}</p>
            <h1 className="brd-hero__q" id="brd-q">{highlightWord(c.hero.question, "not")}</h1>
            <p className="brd-hero__answer">{c.hero.answerLine}</p>
            <p className="brd-hero__intro">{c.hero.intro}</p>
            <div className="brd-hero__row">
              <Cta label={c.cta.button} place="hero" />
              {c.preparedFor && <span className="brd-hero__prep">Prepared for {c.preparedFor}</span>}
            </div>
            <p className="brd-hero__disc">
              <span>Where we would start</span> <b>{c.disciplines.join(" · ")}</b>
            </p>
          </div>

          {shot && (
            <div className="brd-shot">
              <span className="brd-shot__date">{shot.displayUrl} · {shot.capturedOn}</span>
              <div className="brd-shot__frame">
                <div className="brd-shot__bar" aria-hidden="true">
                  <i /><i /><i />
                  <span className="brd-shot__urlbar">{shot.displayUrl}</span>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <div className="brd-shot__img">
                  <img src={screenshot as string} alt={`${c.company} homepage, ${shot.capturedOn}`} loading="lazy" />
                </div>
              </div>
              <div className="brd-shot__callout">
                <span className="brd-shot__flag">
                  <span aria-hidden="true" />
                  {shot.callout.flag}
                </span>
                <p className="brd-shot__h">{shot.callout.headline}</p>
                <p className="brd-shot__b">{emphasise(shot.callout.body, shot.callout.emphasis)}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===== STATS BAND ===== */}
      {c.stats.length > 0 && (
        <section className="brd-band" aria-label="Key figures">
          <div className="wrap brd-stats">
            {c.stats.map((s, i) => (
              <div className="brd-stat" style={cvar(STAT_ACCENTS[i % STAT_ACCENTS.length])} key={i}>
                <span className="brd-stat__n">{s.number}</span>
                <span className="brd-stat__l">{s.label}</span>
                {s.source && <span className="brd-stat__src">{s.source}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== 01 / INSIGHT ===== */}
      <section className="brd-sec" aria-labelledby="brd-insight-h">
        <div className="wrap">
          <p className="brd-kicker">01 / Insight</p>
          <h2 className="brd-h2" id="brd-insight-h">{c.insight.heading}</h2>
          <p className="brd-lead">{c.insight.intro}</p>
          <div className="brd-findings">
            {c.insight.findings.map((f, i) => (
              <article className="brd-finding" style={cvar(DISC_COLOUR[f.discipline])} key={i}>
                <div className="brd-finding__top">
                  <span className="brd-tag">{f.discipline}</span>
                  <span className="brd-finding__idx">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="brd-finding__h">{f.title}</h3>
                <p className="brd-finding__b">{f.body}</p>
                {f.source && <p className="brd-finding__src">{f.source}</p>}
              </article>
            ))}
          </div>

          {c.chart && (
            <figure className="brd-chart">
              <figcaption className="brd-chart__head">
                <span className="brd-chart__title">{c.chart.title}</span>
                {c.chart.subtitle && <span className="brd-chart__sub">{c.chart.subtitle}</span>}
              </figcaption>
              <div className="brd-chart__bars">
                {c.chart.bars.map((b, i) => (
                  <div className="brd-bar" data-hi={b.highlight ? "" : undefined} key={i}>
                    <span className="brd-bar__label">{b.label}</span>
                    <span className="brd-bar__track">
                      <span className="brd-bar__fill" style={{ width: `${Math.round((b.value / maxBar) * 100)}%` }} />
                    </span>
                    <span className="brd-bar__val">{b.value.toLocaleString("en-GB")}</span>
                  </div>
                ))}
              </div>
              {c.chart.caption && <p className="brd-chart__cap">{c.chart.caption}</p>}
            </figure>
          )}
        </div>
      </section>

      {/* ===== THE CONSTRAINT ===== */}
      <section className="brd-sec" aria-labelledby="brd-con-h">
        <div className="wrap">
          <h2 className="brd-h2" id="brd-con-h">{c.constraint.heading}</h2>
          <p className="brd-lead">{c.constraint.intro}</p>
          <ol className="brd-steps">
            {c.constraint.steps.map((s, i) => (
              <li className="brd-step" key={i}>
                <span className="brd-step__n">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="brd-step__h">{s.title}</h3>
                  <p className="brd-step__b">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="brd-constraint__close">{c.constraint.closing}</p>
        </div>
      </section>

      {/* ===== 02 / MOMENTUM ===== */}
      <section className="brd-sec" aria-labelledby="brd-mom-h">
        <div className="wrap">
          <p className="brd-kicker">02 / Momentum</p>
          <h2 className="brd-h2" id="brd-mom-h">{c.momentum.heading}</h2>
          <p className="brd-lead">{c.momentum.intro}</p>

          <div className="brd-tiles">
            {c.momentum.serviceTiles.map((t, i) => (
              <div className="brd-tile" data-later={t.status === "later" ? "" : undefined} style={cvar(DISC_COLOUR[t.discipline])} key={i}>
                <span className="brd-tile__name">{t.discipline}</span>
                <span className="brd-tile__body">{t.body}</span>
                <span className="brd-tile__status">{t.status === "start" ? "Where we would start" : "Not a priority yet"}</span>
              </div>
            ))}
          </div>

          <div className="brd-phases">
            {c.momentum.phases.map((p, i) => (
              <div className="brd-phase" key={i}>
                <span className="brd-phase__label">{p.label}</span>
                <span className="brd-phase__name">{p.name}</span>
                <span className="brd-phase__body">{p.body}</span>
              </div>
            ))}
          </div>

          <div className="brd-tracks">
            {c.momentum.tracks.map((t, i) => (
              <div className="brd-track" style={cvar(DISC_COLOUR[t.discipline])} key={i}>
                <span className="brd-track__tag">{t.discipline}</span>
                <h3 className="brd-track__aim">{t.aim}</h3>
                <ul className="brd-check">
                  {t.actions.map((a, j) => (
                    <li key={j}>{a}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 03 / IMPACT ===== */}
      <section className="brd-sec" aria-labelledby="brd-imp-h">
        <div className="wrap">
          <p className="brd-kicker">03 / Impact</p>
          <h2 className="brd-h2" id="brd-imp-h">{c.impact.heading}</h2>
          <div className="brd-outcomes">
            {c.impact.outcomes.map((o, i) => (
              <article className="brd-outcome" key={i}>
                <h3 className="brd-outcome__h">{o.title}</h3>
                <p className="brd-outcome__b">{o.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== OPERATOR EXPERIENCE ===== */}
      <section className="brd-sec" aria-labelledby="brd-exp-h">
        <div className="wrap">
          <h2 className="brd-h2" id="brd-exp-h">{c.experience.heading}</h2>
          <p className="brd-lead">{c.experience.intro}</p>
          <div className="brd-results">
            {c.experience.results.map((r, i) => (
              <div className="brd-result" style={cvar(RESULT_ACCENTS[i % RESULT_ACCENTS.length])} key={i}>
                <span className="brd-result__r">{r.result}</span>
                <span className="brd-result__a">{r.attribution}</span>
              </div>
            ))}
          </div>
          <p className="brd-exp__note">{c.experience.note}</p>
        </div>
      </section>

      {/* ===== CALL TO ACTION ===== */}
      <section className="brd-cta" aria-labelledby="brd-cta-h">
        <div className="wrap brd-cta__box">
          <h2 className="brd-cta__h" id="brd-cta-h">{c.cta.heading}</h2>
          <p className="brd-cta__b">{c.cta.body}</p>
          <div className="brd-cta__row">
            <Cta label={c.cta.button} place="footer" />
            <span className="brd-cta__close">{c.cta.closing}</span>
          </div>
          <p className="brd-cta__footer">{c.cta.footer}</p>
        </div>
      </section>

      {/* ===== SOURCES & METHOD (collapsed) ===== */}
      {(c.sources.length > 0 || c.method) && (
        <section className="brd-sources" aria-label="Sources and method">
          <div className="wrap">
            <details className="brd-src-details">
              <summary className="brd-src-summary">Sources &amp; method</summary>
              {c.sources.length > 0 && (
                <ul className="brd-src-list">
                  {c.sources.map((s, i) => (
                    <li key={i}>
                      {s.url ? (
                        <a href={s.url} target="_blank" rel="noopener nofollow">{s.label}</a>
                      ) : (
                        s.label
                      )}
                    </li>
                  ))}
                </ul>
              )}
              {c.method && <p className="brd-method">{c.method}</p>}
            </details>
          </div>
        </section>
      )}

      {/* mobile sticky CTA */}
      <div className="brd-sticky">
        <span className="brd-sticky__q">{c.cta.heading}</span>
        <Cta label={c.cta.button} place="sticky" />
      </div>
    </main>
  );
}
