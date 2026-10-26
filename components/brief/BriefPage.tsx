import type { BriefContent, Discipline } from "@/lib/brief/types";
import { BriefTracker } from "./BriefTracker";

// The prospect brief template. One shape, filled per prospect. Server-rendered;
// the only client piece is first-party engagement tracking. Design reuses
// CommView's system (tokens, the four capability colours, dark/light sections).

const CALENDAR_URL = "https://calendar.app.google/Hx4AQi6bJurZL8jU7";

const DISC_COLOUR: Record<Discipline, string> = {
  "GTM Leadership": "var(--brand-cyan)",
  Growth: "var(--accent-green)",
  Product: "var(--brand-blue)",
  "Operational AI": "var(--accent-pink)",
};

const cvar = (c: string): React.CSSProperties => ({ ["--c" as string]: c });

function Cta({ label, place }: { label: string; place: string }) {
  return (
    <a className="btn btn--cyan btn--lg br-cta-btn" href={CALENDAR_URL} data-cta={place} target="_blank" rel="noopener">
      {label}
    </a>
  );
}

// Highlight an optional substring of the callout body in brand cyan.
function emphasise(body: string, emphasis?: string): React.ReactNode {
  if (!emphasis || !body.includes(emphasis)) return body;
  const [before, after] = body.split(emphasis);
  return (
    <>
      {before}
      <b className="br-shot__em">{emphasis}</b>
      {after}
    </>
  );
}

export function BriefPage({
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
    <main id="main" className="br">
      <BriefTracker token={token} />

      {/* private banner */}
      <div className="br-private">{c.hero.privateLabel}{c.hero.date ? ` · ${c.hero.date}` : ""}</div>

      {/* ===== HERO (dark) ===== */}
      <section className="br-hero dark" aria-labelledby="br-q">
        <div className={`wrap br-hero__grid${shot ? " br-hero__grid--split" : ""}`}>
          <div className="br-hero__lead">
            <span className="br-pill">
              <span className="br-pill__dot" aria-hidden="true" />
              {c.hero.eyebrow}
            </span>
            <p className="br-hero__small">{c.hero.smallLabel}</p>
            <h1 className="br-hero__q" id="br-q">{c.hero.question}</h1>
            <p className="br-hero__answer">{c.hero.answerLine}</p>
            <p className="br-hero__intro">{c.hero.intro}</p>
            <div className="br-hero__row">
              <Cta label={c.cta.button} place="hero" />
              <span className="br-hero__disc">
                Where we would start: {c.disciplines.join(" · ")}
              </span>
            </div>
          </div>

          {shot && (
            <div className="br-shot">
              <span className="br-shot__date">{shot.displayUrl} · {shot.capturedOn}</span>
              <div className="br-shot__frame">
                <div className="br-shot__bar" aria-hidden="true">
                  <i /><i /><i />
                  <span className="br-shot__urlbar">{shot.displayUrl}</span>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <div className="br-shot__img">
                  <img src={screenshot as string} alt={`${c.company} homepage, ${shot.capturedOn}`} loading="lazy" />
                </div>
              </div>
              <div className="br-shot__callout">
                <span className="br-shot__flag">
                  <span aria-hidden="true" />
                  {shot.callout.flag}
                </span>
                <p className="br-shot__h">{shot.callout.headline}</p>
                <p className="br-shot__b">{emphasise(shot.callout.body, shot.callout.emphasis)}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===== STATS BAND ===== */}
      {c.stats.length > 0 && (
        <section className="br-stats" aria-label="Key figures">
          <div className="wrap br-stats__grid">
            {c.stats.map((s, i) => (
              <div className="br-stat" key={i}>
                <span className="br-stat__n">{s.number}</span>
                <span className="br-stat__l">{s.label}</span>
                {s.source && <span className="br-stat__src">{s.source}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== 01 / INSIGHT ===== */}
      <section className="br-sec br-insight" aria-labelledby="br-insight-h">
        <div className="wrap">
          <p className="br-kicker">01 / Insight</p>
          <h2 className="br-h2" id="br-insight-h">{c.insight.heading}</h2>
          <p className="br-lead">{c.insight.intro}</p>
          <div className="br-findings">
            {c.insight.findings.map((f, i) => (
              <article className="br-finding" style={cvar(DISC_COLOUR[f.discipline])} key={i}>
                <span className="br-tag">{f.discipline}</span>
                <h3 className="br-finding__h">{f.title}</h3>
                <p className="br-finding__b">{f.body}</p>
                {f.source && <p className="br-finding__src">{f.source}</p>}
              </article>
            ))}
          </div>

          {c.chart && (
            <figure className="br-chart">
              <figcaption className="br-chart__head">
                <span className="br-chart__title">{c.chart.title}</span>
                {c.chart.subtitle && <span className="br-chart__sub">{c.chart.subtitle}</span>}
              </figcaption>
              <div className="br-chart__bars">
                {c.chart.bars.map((b, i) => (
                  <div className="br-bar" data-hi={b.highlight ? "" : undefined} key={i}>
                    <span className="br-bar__label">{b.label}</span>
                    <span className="br-bar__track">
                      <span className="br-bar__fill" style={{ width: `${Math.round((b.value / maxBar) * 100)}%` }} />
                    </span>
                    <span className="br-bar__val">{b.value.toLocaleString("en-GB")}</span>
                  </div>
                ))}
              </div>
              {c.chart.caption && <p className="br-chart__cap">{c.chart.caption}</p>}
            </figure>
          )}
        </div>
      </section>

      {/* ===== THE CONSTRAINT ===== */}
      <section className="br-sec br-constraint" aria-labelledby="br-con-h">
        <div className="wrap">
          <h2 className="br-h2" id="br-con-h">{c.constraint.heading}</h2>
          <p className="br-lead">{c.constraint.intro}</p>
          <ol className="br-steps">
            {c.constraint.steps.map((s, i) => (
              <li className="br-step" key={i}>
                <span className="br-step__n">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="br-step__h">{s.title}</h3>
                  <p className="br-step__b">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="br-constraint__close">{c.constraint.closing}</p>
        </div>
      </section>

      {/* ===== 02 / MOMENTUM ===== */}
      <section className="br-sec br-momentum dark" aria-labelledby="br-mom-h">
        <div className="wrap">
          <p className="br-kicker">02 / Momentum</p>
          <h2 className="br-h2" id="br-mom-h">{c.momentum.heading}</h2>
          <p className="br-lead">{c.momentum.intro}</p>

          <div className="br-tiles">
            {c.momentum.serviceTiles.map((t, i) => (
              <div className="br-tile" data-later={t.status === "later" ? "" : undefined} style={cvar(DISC_COLOUR[t.discipline])} key={i}>
                <span className="br-tile__name">{t.discipline}</span>
                <span className="br-tile__body">{t.body}</span>
                <span className="br-tile__status">{t.status === "start" ? "Where we would start" : "Not a priority yet"}</span>
              </div>
            ))}
          </div>

          <div className="br-phases">
            {c.momentum.phases.map((p, i) => (
              <div className="br-phase" key={i}>
                <span className="br-phase__label">{p.label}</span>
                <span className="br-phase__name">{p.name}</span>
                <span className="br-phase__body">{p.body}</span>
              </div>
            ))}
          </div>

          <div className="br-tracks">
            {c.momentum.tracks.map((t, i) => (
              <div className="br-track" style={cvar(DISC_COLOUR[t.discipline])} key={i}>
                <h3 className="br-track__h">
                  <span className="br-track__tag">{t.discipline}</span>
                  {t.aim}
                </h3>
                <ul className="br-track__actions">
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
      <section className="br-sec br-impact" aria-labelledby="br-imp-h">
        <div className="wrap">
          <p className="br-kicker">03 / Impact</p>
          <h2 className="br-h2" id="br-imp-h">{c.impact.heading}</h2>
          <div className="br-outcomes">
            {c.impact.outcomes.map((o, i) => (
              <article className="br-outcome" key={i}>
                <h3 className="br-outcome__h">{o.title}</h3>
                <p className="br-outcome__b">{o.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== OPERATOR EXPERIENCE ===== */}
      <section className="br-sec br-exp" aria-labelledby="br-exp-h">
        <div className="wrap">
          <h2 className="br-h2" id="br-exp-h">{c.experience.heading}</h2>
          <p className="br-lead">{c.experience.intro}</p>
          <div className="br-results">
            {c.experience.results.map((r, i) => (
              <div className="br-result" key={i}>
                <span className="br-result__r">{r.result}</span>
                <span className="br-result__a">{r.attribution}</span>
              </div>
            ))}
          </div>
          <p className="br-exp__note">{c.experience.note}</p>
        </div>
      </section>

      {/* ===== CALL TO ACTION (dark) ===== */}
      <section className="br-cta dark" aria-labelledby="br-cta-h">
        <div className="wrap">
          <h2 className="br-cta__h" id="br-cta-h">{c.cta.heading}</h2>
          <p className="br-cta__b">{c.cta.body}</p>
          <div className="br-cta__row">
            <Cta label={c.cta.button} place="footer" />
            <span className="br-cta__close">{c.cta.closing}</span>
          </div>
          <p className="br-cta__footer">{c.cta.footer}</p>
        </div>
      </section>

      {/* ===== SOURCES & METHOD (collapsed) ===== */}
      {(c.sources.length > 0 || c.method) && (
        <section className="br-sources" aria-label="Sources and method">
          <div className="wrap">
            <details className="br-src-details">
              <summary className="br-src-summary">Sources &amp; method</summary>
              {c.sources.length > 0 && (
                <ul className="br-src-list">
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
              {c.method && <p className="br-method">{c.method}</p>}
            </details>
          </div>
        </section>
      )}

      {/* mobile sticky CTA */}
      <div className="br-sticky">
        <span className="br-sticky__q">{c.cta.heading}</span>
        <Cta label={c.cta.button} place="sticky" />
      </div>
    </main>
  );
}
