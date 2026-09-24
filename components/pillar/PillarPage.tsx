// Pillar-page renderer. Consumes a content/<slug>.json (typed as Page) and
// renders it through styles/pillar.css. This is the only place pillar layout
// lives; ChatGPT never touches it. Server Component (native <details>, no JS).
import type { CSSProperties, ReactNode } from "react";
import type { Page, Section, Heading, Rich, Diagram, Stat } from "../../lib/content/types";

const ACC_VAR: Record<string, string> = { cyan: "var(--brand-cyan)", green: "var(--accent-green)", blue: "var(--accent-blue)", pink: "var(--accent-pink)" };

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://commview-green.vercel.app";
// Unverified stats show (flagged) in dev/preview for QA, but never in production.
const IS_PROD = process.env.VERCEL_ENV === "production";

const ACCENT = "var(--c)";

/* ---------- icons ---------- */
const ICONS: Record<string, ReactNode> = {
  report: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" strokeLinecap="round" /></>,
  workflow: <><circle cx="12" cy="12" r="3.2" /><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.2 5.2l2.1 2.1M16.7 16.7l2.1 2.1M18.8 5.2l-2.1 2.1M7.3 16.7l-2.1 2.1" strokeLinecap="round" /></>,
  database: <><ellipse cx="12" cy="6" rx="7.5" ry="3" /><path d="M4.5 6v6c0 1.6 3.4 3 7.5 3s7.5-1.4 7.5-3V6M4.5 12v6c0 1.6 3.4 3 7.5 3s7.5-1.4 7.5-3v-6" /></>,
  people: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.2" /><path d="M3 20a6 6 0 0 1 12 0M15.5 20a5 5 0 0 1 5.5-4.9" /></>,
  chart: <path d="M4 20h16M8 20v-6M13 20V8M18 20v-9" strokeLinecap="round" />,
  target: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1" /></>,
  layers: <path d="M12 3l9 5-9 5-9-5 9-5zM3 12l9 5 9-5M3 16l9 5 9-5" />,
  sparkle: <path d="M12 3l1.9 5.5L19.5 10l-5.6 1.5L12 17l-1.9-5.5L4.5 10l5.6-1.5L12 3z" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" strokeLinecap="round" /></>,
  doc: <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z" /><path d="M14 3v5h5M9 13h6M9 17h6" strokeLinecap="round" /></>,
  bulb: <><path d="M9 18h6M10 21h4" strokeLinecap="round" /><path d="M12 3a6 6 0 0 0-4 10.5c.7.6 1 1.2 1 2h6c0-.8.3-1.4 1-2A6 6 0 0 0 12 3z" /></>,
  box: <path d="M12 2.5l8 4.5v9L12 20.5 4 16v-9l8-4.5zM4 7l8 4.5L20 7M12 11.5v9" />,
  refresh: <path d="M20 12a8 8 0 1 1-2.3-5.6M20 3.5V8h-4.5" strokeLinecap="round" strokeLinejoin="round" />,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5v4.7l3.2 2" strokeLinecap="round" /></>,
  lightning: <path d="M13 2.5L4.5 13.5H11l-1 8 8.5-11H12l1-7.5z" strokeLinejoin="round" />,
  check: <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />,
};
function Icon({ name }: { name?: string }) {
  const g = name ? ICONS[name] : null;
  if (!g) return null;
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">{g}</svg>;
}

/* ---------- helpers ---------- */
function Head({ h, accentLine }: { h: Heading; accentLine?: number }) {
  if (typeof h === "string") return <>{h}</>;
  return (
    <>
      {h.map((line, i) => (
        <span key={i} className={i === accentLine ? "accent" : undefined}>{line}</span>
      ))}
    </>
  );
}

function Paras({ r, className }: { r: Rich; className?: string }) {
  const arr = Array.isArray(r) ? r : [r];
  return <>{arr.map((p, i) => <p key={i} className={className}>{p}</p>)}</>;
}

function SectionHead({ s, center }: { s: Extract<Section, { type: string }>; center?: boolean }) {
  const heading = "heading" in s ? s.heading : undefined;
  const intro = "intro" in s ? s.intro : undefined;
  const eyebrow = "eyebrow" in s ? s.eyebrow : undefined;
  const inner = (
    <div>
      {eyebrow && <p className="eyebrow-x" style={{ color: ACCENT }}>{eyebrow}</p>}
      {heading && <h2 id={s.id} style={{ marginTop: "var(--space-3)" }}><Head h={heading} /></h2>}
    </div>
  );
  if (center) return <div className="p-head p-head--solo p-head--center">{inner}{intro && <div><Paras r={intro} className="p-head__intro" /></div>}</div>;
  if (!intro) return <div className="p-head p-head--solo">{inner}</div>;
  return (
    <div className="p-head">
      {inner}
      <div><Paras r={intro} className="p-head__intro" /></div>
    </div>
  );
}

function secClass(s: { theme?: string; tight?: boolean }, extra = "") {
  const theme = s.theme === "dark" ? "dark" : s.theme === "alt" ? "p-sec--alt" : "";
  return ["p-sec", s.tight ? "p-sec--tight" : "", theme, extra].filter(Boolean).join(" ");
}

/* ---------- diagrams ---------- */
const pillW = (label: string) => Math.max(96, label.length * 9 + 34);
const HUB_POS: Record<number, [number, number][]> = {
  4: [[300, 118], [110, 235], [490, 235], [300, 350]],
  5: [[300, 118], [112, 188], [488, 188], [150, 330], [450, 330]],
  6: [[300, 110], [112, 182], [488, 182], [112, 322], [488, 322], [300, 366]],
};
function hubPositions(n: number): [number, number][] {
  if (HUB_POS[n]) return HUB_POS[n];
  const out: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const a = -Math.PI + (i + 0.5) * (Math.PI / n);
    out.push([300 + 195 * Math.cos(a), 250 + 120 * Math.sin(a)]);
  }
  return out;
}

function HubDiagram({ d }: { d: Extract<Diagram, { kind: "hub" }> }) {
  const core = { x: 300, y: 250, r: 62 };
  const pos = hubPositions(d.nodes.length);
  const findW = d.answer ? pillW(d.answer) : 0;
  return (
    <div className="p-diagram">
      <svg viewBox="0 0 600 470" role="img" aria-label={`${d.core}: ${d.nodes.join(", ")}. ${d.answer ?? ""}`}>
        <defs>
          <filter id="pdGlow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="12" /></filter>
          <radialGradient id="pdCore" cx="50%" cy="42%" r="65%"><stop offset="0" stopColor="#0d1f18" /><stop offset="1" stopColor="#0b0f14" /></radialGradient>
        </defs>
        {d.caption && <text x="300" y="26" textAnchor="middle" className="p-diagram__cap">{d.caption}</text>}
        {d.sub && <text x="300" y="50" textAnchor="middle" className="p-diagram__sub">{d.sub}</text>}
        <g stroke="var(--slate-dark)" strokeWidth="1.5">
          {pos.map(([x, y], i) => <line key={i} x1={core.x} y1={core.y} x2={x} y2={y} />)}
        </g>
        {d.answer && <line x1="300" y1={core.y + core.r} x2="300" y2="406" stroke={ACCENT} strokeWidth="2" />}
        <circle cx={core.x} cy={core.y} r={core.r + 12} fill={ACCENT} opacity="0.3" filter="url(#pdGlow)" />
        <circle cx={core.x} cy={core.y} r={core.r} fill="url(#pdCore)" stroke={ACCENT} strokeWidth="2" />
        <text x={core.x} y={core.y + 7} textAnchor="middle" className="p-diagram__core">{d.core}</text>
        {d.nodes.map((label, i) => {
          const [x, y] = pos[i]; const w = pillW(label);
          return (
            <g key={label}>
              <rect x={x - w / 2} y={y - 17} width={w} height="34" rx="17" fill="var(--brand-charcoal)" stroke="var(--slate)" strokeWidth="1" />
              <text x={x} y={y + 5} textAnchor="middle" className="p-diagram__node">{label}</text>
            </g>
          );
        })}
        {d.answer && <>
          <rect x={300 - findW / 2} y="413" width={findW} height="38" rx="19" fill={ACCENT} opacity="0.28" filter="url(#pdGlow)" />
          <rect x={300 - findW / 2} y="414" width={findW} height="36" rx="18" fill={ACCENT} />
          <text x="300" y="437" textAnchor="middle" className="p-diagram__find">{d.answer}</text>
        </>}
      </svg>
    </div>
  );
}

function TwoLine({ text, x, y }: { text: string; x: number; y: number }) {
  const w = text.split(" ");
  if (w.length < 2) return <text x={x} y={y + 5} textAnchor="middle" className="p-diagram__lobe">{text}</text>;
  const mid = Math.ceil(w.length / 2);
  return (
    <>
      <text x={x} y={y - 4} textAnchor="middle" className="p-diagram__lobe">{w.slice(0, mid).join(" ")}</text>
      <text x={x} y={y + 15} textAnchor="middle" className="p-diagram__lobe">{w.slice(mid).join(" ")}</text>
    </>
  );
}

function OverlapDiagram({ d }: { d: Extract<Diagram, { kind: "overlap" }> }) {
  return (
    <div className="p-diagram">
      <svg viewBox="0 0 600 470" role="img" aria-label={`${d.leftLabel} and ${d.rightLabel}${d.centreLabel ? " combine into " + d.centreLabel : ""}.`}>
        {d.caption && <text x="300" y="40" textAnchor="middle" className="p-diagram__cap">{d.caption}</text>}
        {d.sub && <text x="300" y="64" textAnchor="middle" className="p-diagram__sub">{d.sub}</text>}
        <circle cx="235" cy="268" r="150" fill="none" stroke="var(--slate)" strokeWidth="1.4" />
        <circle cx="365" cy="268" r="150" fill={ACCENT} fillOpacity="0.14" stroke={ACCENT} strokeWidth="1.6" />
        <TwoLine text={d.leftLabel} x={150} y={268} />
        <TwoLine text={d.rightLabel} x={450} y={268} />
        {d.centreLabel && (
          <g><text x="300" y="272" textAnchor="middle" className="p-diagram__seq" fill={ACCENT}>{d.centreLabel.split(" ").slice(0, 1)}</text>
          {d.centreLabel.split(" ").length > 1 && <text x="300" y="290" textAnchor="middle" className="p-diagram__seq" fill={ACCENT}>{d.centreLabel.split(" ").slice(1).join(" ")}</text>}</g>
        )}
      </svg>
    </div>
  );
}

function OrbDiagram({ d }: { d: Extract<Diagram, { kind: "orb" }> }) {
  const core = { x: 225, y: 235, r: 48 };
  const pos: [number, number][] = [[225, 108], [95, 235], [355, 235], [225, 362]];
  return (
    <div className="p-diagram">
      <svg viewBox="0 0 700 460" role="img" aria-label={`${d.core} at the centre of ${d.nodes.join(", ")}.`}>
        <defs>
          <filter id="orbGlow" x="-120%" y="-120%" width="340%" height="340%"><feGaussianBlur stdDeviation="16" /></filter>
          <radialGradient id="orbFill" cx="50%" cy="42%" r="62%"><stop offset="0" stopColor="#141a24" /><stop offset="0.65" stopColor="#0b0f14" /><stop offset="1" stopColor="var(--c)" stopOpacity="0.5" /></radialGradient>
        </defs>
        {d.caption && <text x="225" y="28" textAnchor="middle" className="p-diagram__cap">{d.caption}</text>}
        {d.sub && <text x="225" y="50" textAnchor="middle" className="p-diagram__sub">{d.sub}</text>}
        <g stroke="var(--slate-dark)" strokeWidth="1.5">{pos.map(([x, y], i) => <line key={i} x1={core.x} y1={core.y} x2={x} y2={y} />)}</g>
        <circle cx={core.x} cy={core.y} r={core.r + 18} fill="var(--c)" opacity="0.4" filter="url(#orbGlow)" />
        <circle cx={core.x} cy={core.y} r={core.r} fill="url(#orbFill)" stroke="var(--c)" strokeWidth="2.5" />
        <text x={core.x} y={core.y + 8} textAnchor="middle" className="p-diagram__core">{d.core}</text>
        {d.nodes.map((label, i) => { const [x, y] = pos[i]; const w = Math.max(96, label.length * 9 + 30);
          return <g key={label}><rect x={x - w / 2} y={y - 16} width={w} height="32" rx="16" fill="var(--brand-charcoal)" stroke="var(--slate)" strokeWidth="1" /><text x={x} y={y + 5} textAnchor="middle" className="p-diagram__node">{label}</text></g>; })}
        {d.checklist?.map((item, i) => { const y = 148 + i * 48;
          return <g key={item}><path d={`M462 ${y} l4 5 l8 -10`} fill="none" stroke="var(--c)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /><text x={484} y={y + 4} className="p-diagram__check">{item}</text></g>; })}
      </svg>
    </div>
  );
}

function DiagramView({ d }: { d?: Diagram }) {
  if (!d || d.kind === "none") return null;
  if (d.kind === "hub") return <HubDiagram d={d} />;
  if (d.kind === "orb") return <OrbDiagram d={d} />;
  if (d.kind === "overlap") return <OverlapDiagram d={d} />;
  if (d.kind === "image") return <div className="p-shot"><img src={d.src} alt={d.alt} /></div>;
  if (d.kind === "signal") return (
    <div className="p-signal">
      <span className="p-signal__beam" aria-hidden="true" />
      <ul className="p-signal__points">{d.points.map((p, i) => <li key={i}>{p}</li>)}</ul>
    </div>
  );
  if (d.kind === "stack") {
    const n = d.layers.length;
    const hasHead = !!(d.caption || d.sub);
    const top = hasHead ? 78 : 22, avail = 470 - top - 22, gap = 14;
    const h = Math.min(72, (avail - gap * (n - 1)) / n), step = h + gap;
    const hi = typeof d.highlight === "number" ? d.highlight : n - 1;
    return (
      <div className="p-diagram"><svg viewBox="0 0 600 470" role="img" aria-label={d.layers.join(", then ")}>
        <defs><filter id="pdsGlow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="10" /></filter></defs>
        {d.caption && <text x="300" y="34" textAnchor="middle" className="p-diagram__cap">{d.caption}</text>}
        {d.sub && <text x="300" y="58" textAnchor="middle" className="p-diagram__sub">{d.sub}</text>}
        {d.layers.map((l, i) => {
          const y = top + i * step, last = i === hi;
          return (
            <g key={l}>
              {i < n - 1 && <line x1="300" y1={y + h} x2="300" y2={y + step} stroke="var(--slate-dark)" strokeWidth="1.5" />}
              {last && <rect x="128" y={y - 3} width="344" height={h + 6} rx="12" fill={ACCENT} opacity="0.28" filter="url(#pdsGlow)" />}
              <rect x="130" y={y} width="340" height={h} rx="12" fill={last ? ACCENT : "var(--brand-charcoal)"} fillOpacity={last ? 1 : 0.5} stroke={ACCENT} strokeWidth="1.4" strokeOpacity={last ? 1 : 0.55} />
              <text x="300" y={y + h / 2 + 5} textAnchor="middle" className="p-diagram__seq" fill={last ? "var(--brand-charcoal)" : "var(--brand-polar)"}>{l}</text>
            </g>
          );
        })}
      </svg></div>
    );
  }
  return null;
}

/* ---------- sections ---------- */
function Cta({ c }: { c: { label: string; href: string; style: string } }) {
  if (c.style === "text") return <a className="p-textlink" href={c.href}>{c.label}</a>;
  const cls = c.style === "primary" ? "btn btn--accent btn--lg" : "btn btn--ghost btn--lg";
  return <a className={cls} href={c.href}>{c.label}</a>;
}

function accentPhrase(text: string, phrase?: string) {
  if (!phrase || !text.includes(phrase)) return text;
  const i = text.indexOf(phrase);
  return (<>{text.slice(0, i)}<span className="accent">{phrase}</span>{text.slice(i + phrase.length)}</>);
}

const STEP_ICONS = [
  <svg key="s" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" strokeLinecap="round" /></svg>,
  <svg key="p" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M9 9v11" /></svg>,
  <svg key="l" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M8 6h12M8 12h12M8 18h12" strokeLinecap="round" /><circle cx="4" cy="6" r="1" /><circle cx="4" cy="12" r="1" /><circle cx="4" cy="18" r="1" /></svg>,
  <svg key="d" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinejoin="round" /></svg>,
];

function AiFlow({ s }: { s: Extract<Section, { type: "aiflow" }> }) {
  const lines = Array.isArray(s.heading) ? s.heading : [s.heading];
  return (
    <section className={secClass(s)} aria-labelledby={s.id}>
      <div className="wrap p-aiflow">
        <div className="p-aiflow__main">
          {s.eyebrow && <p className="eyebrow-x p-aiflow__eye" style={{ color: ACCENT }}>{s.eyebrow}</p>}
          <h2 className="p-aiflow__h" id={s.id}>{lines.map((l, i) => <span key={i}>{accentPhrase(l, s.accent)}</span>)}</h2>
          <div className="p-aiflow__flow">
            {s.steps.flatMap((st, i) => [
              <div className="p-aiflow__card" key={"c" + i}>
                <span className="p-aiflow__ico" aria-hidden>{STEP_ICONS[i % STEP_ICONS.length]}</span>
                <b>{st.title}</b>
                <p>{st.body}</p>
              </div>,
              i < s.steps.length - 1 ? <span className="p-aiflow__arw" key={"a" + i} aria-hidden>&rarr;</span> : null,
            ])}
          </div>
          {s.flowLabel && <div className="p-aiflow__bracket"><span>{s.flowLabel}</span></div>}
          <div className="p-aiflow__down" aria-hidden>&darr;</div>
          <div className="p-aiflow__decision dark">
            <span className="p-aiflow__dico" aria-hidden><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.2" /><path d="M3 20a6 6 0 0 1 12 0M15.5 20a5 5 0 0 1 5.5-4.9" /></svg></span>
            <b>{s.decision.title}</b>
            {s.decision.tags?.length ? <p className="p-aiflow__tags">{s.decision.tags.join("  •  ")}</p> : null}
            <p className="p-aiflow__note">{s.decision.note}</p>
          </div>
        </div>
        <div className="p-aiflow__side">
          <Paras r={s.body} className="p-aiflow__body" />
          {s.aside ? (
            <div className="p-aiflow__aside">
              {s.aside.lines.map((l, i) => <p key={i}>{accentPhrase(l, s.aside!.accent)}</p>)}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function MatrixCell({ v }: { v: "yes" | "no" | "partial" }) {
  const label = v === "yes" ? "Yes" : v === "no" ? "No" : "Partial";
  return (
    <span className={"p-mark p-mark--" + v} role="img" aria-label={label}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {v === "yes" ? <path d="M20 6L9 17l-5-5" /> : v === "no" ? <path d="M6 12h12" /> : <><circle cx="12" cy="12" r="8" strokeWidth="1.8" /><path d="M8.5 12h7" /></>}
      </svg>
    </span>
  );
}

function SectionView({ s }: { s: Section }) {
  switch (s.type) {
    case "lead":
      return (
        <section className={secClass(s)} aria-labelledby={s.id}>
          <div className="wrap p-lead">
            <div>
              {s.eyebrow && <p className="eyebrow-x" style={{ color: ACCENT }}>{s.eyebrow}</p>}
              {s.heading && <h2 className="p-lead__h" id={s.id} style={{ marginTop: "var(--space-4)" }}><Head h={s.heading} /></h2>}
            </div>
            <div className="p-lead__body">
              {s.intro && <Paras r={s.intro} />}
              {s.ctas?.length ? <div className="p-lead__cta">{s.ctas.map((c, i) => <Cta key={i} c={c} />)}</div> : null}
            </div>
          </div>
        </section>
      );
    case "grid": {
      const variant = s.variant ?? "numbered";
      const center = s.align === "center";
      const n = (i: number) => String(i + 1).padStart(2, "0");
      return (
        <section className={secClass(s)} aria-labelledby={s.id}>
          <div className="wrap">
            <SectionHead s={s} center={center} />
            <div className={`p-grid p-grid--${variant}${center ? " p-grid--center" : ""}`} data-cols={String(s.items.length)}>
              {s.items.map((it, i) => (
                <div className="p-cell" key={i}>
                  {variant === "cards" && <span className="p-cell__n">{n(i)}</span>}
                  {it.icon && <span className="p-cell__ico" aria-hidden><Icon name={it.icon} /></span>}
                  {variant === "numbered" && !it.icon && <b>{n(i)}</b>}
                  <h3>{it.title}</h3>
                  {it.body && <p>{it.body}</p>}
                  {it.points?.length ? <ul className="p-cell__points">{it.points.map((p, j) => <li key={j}>{p}</li>)}</ul> : null}
                  {it.href && (variant === "cards"
                    ? <a className="p-cell__arw" href={it.href} aria-label={it.title}>&rarr;</a>
                    : <a className="p-cell__more" href={it.href}>Learn more &rarr;</a>)}
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }
    case "venn":
      return (
        <section className={secClass(s)} aria-labelledby={s.id}>
          <div className="wrap p-venn__grid">
            <div>
              {s.eyebrow && <p className="eyebrow-x" style={{ color: ACCENT }}>{s.eyebrow}</p>}
              {s.heading && <h2 className="p-venn__h" id={s.id} style={{ marginTop: "var(--space-3)" }}><Head h={s.heading} /></h2>}
              {s.body && <div className="p-venn__body"><Paras r={s.body} /></div>}
              {s.pull && <p className="p-pull">{s.pull}</p>}
            </div>
            <figure className="p-venn">
              <svg viewBox="0 0 520 350" role="img" aria-label={`${s.left.title}: ${s.left.lines.join(", ")}. ${s.right.title}: ${s.right.lines.join(", ")}.`}>
                <circle cx="175" cy="155" r="145" fill="none" stroke="var(--slate)" strokeWidth="1.2" />
                <circle cx="345" cy="155" r="145" fill={ACCENT} fillOpacity="0.15" stroke={ACCENT} strokeWidth="1.5" />
                <text x="112" y="118" textAnchor="middle" className="p-venn__title" fill="var(--brand-polar)">{s.left.title}</text>
                {s.left.lines.map((l, i) => <text key={i} x="112" y={146 + i * 18} textAnchor="middle" className="p-venn__line" fill="var(--slate-light)">{l}</text>)}
                <text x="408" y="118" textAnchor="middle" className="p-venn__title" fill="var(--brand-polar)">{s.right.title}</text>
                {s.right.lines.map((l, i) => <text key={i} x="408" y={146 + i * 18} textAnchor="middle" className="p-venn__line" fill="var(--slate-light)">{l}</text>)}
                <text x="260" y="164" textAnchor="middle" fontSize="26" fill={ACCENT}>{s.centre ?? "+"}</text>
              </svg>
              {s.caption && <figcaption className="p-venn__foot">{s.caption}</figcaption>}
            </figure>
          </div>
        </section>
      );
    case "stepper": {
      const style = s.style ?? "arrows";
      return (
        <section className={secClass(s)} aria-labelledby={s.id}>
          <div className="wrap">
            <SectionHead s={s} />
            <div className={"p-proc__grid p-proc--" + style} data-cols={String(s.steps.length)}>
              {s.steps.map((st, i) => (
                <div className="p-step" key={i} style={st.accent ? ({ ["--c" as string]: ACC_VAR[st.accent] } as CSSProperties) : undefined}>
                  {style === "icons"
                    ? <div className="p-step__ico" aria-hidden><Icon name={st.icon} /></div>
                    : style === "circles"
                    ? <div className="p-step__n">{String(i + 1).padStart(2, "0")}</div>
                    : <b>{String(i + 1).padStart(2, "0")}</b>}
                  <h3>{style === "icons" ? `${i + 1}. ${st.title}` : st.title}</h3>
                  {st.body && <p>{st.body}</p>}
                  {st.points?.length ? <ul className="p-step__points">{st.points.map((p, j) => <li key={j}>{p}</li>)}</ul> : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }
    case "stats": {
      const shown: Stat[] = IS_PROD ? s.stats.filter((x) => x.evidence === "verified") : s.stats;
      if (!shown.length) return null;
      return (
        <section className={secClass(s)} aria-labelledby={s.id}>
          <div className="wrap">
            <SectionHead s={s} />
            <div className="p-stats__grid" data-cols={String(shown.length)}>
              {shown.map((x, i) => (
                <div className="p-stat" key={i}>
                  <b>{x.value}</b>
                  <span>{x.label}</span>
                  {x.context && <span className="p-stat__ctx">{x.context}</span>}
                  {!IS_PROD && x.evidence === "needs-verification" && <span className="p-stat__flag">Needs verification</span>}
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }
    case "aiflow":
      return <AiFlow s={s} />;
    case "callout":
      return (
        <section className={secClass(s)} aria-labelledby={s.id}>
          <div className="wrap p-callout__grid">
            <div className="p-callout__ico" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="7" y="7" width="10" height="10" rx="2" />
                <path d="M10 2v3M14 2v3M10 19v3M14 19v3M2 10h3M2 14h3M19 10h3M19 14h3" strokeLinecap="round" />
              </svg>
            </div>
            {s.heading && <h2 className="p-callout__h" id={s.id}><Head h={s.heading} accentLine={s.accentLine} /></h2>}
            <div className="p-callout__body"><Paras r={s.body} /></div>
          </div>
        </section>
      );
    case "comparison":
      return (
        <section className={secClass(s)} aria-labelledby={s.id}>
          <div className="wrap">
            <SectionHead s={s} />
            <div className="p-compare__grid" data-cols={String(s.columns.length)}>
              {s.columns.map((col, i) => (
                <div className="p-compare-col" key={i}>
                  <h3>{col.title}</h3>
                  <ul>{col.items.map((it, j) => <li key={j}>{it}</li>)}</ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    case "matrix":
      return (
        <section className={secClass(s)} aria-labelledby={s.id}>
          <div className="wrap">
            <SectionHead s={s} />
            <div className="p-matrix__wrap">
              <table className="p-matrix">
                <thead>
                  <tr>
                    <th scope="col"><span className="sr">Criterion</span></th>
                    {s.columns.map((c, i) => <th scope="col" key={i} className={c.highlight ? "is-hl" : undefined}>{c.title}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {s.rows.map((r, ri) => (
                    <tr key={ri}>
                      <th scope="row">{r.label}</th>
                      {r.cells.map((cell, ci) => (
                        <td key={ci} className={s.columns[ci]?.highlight ? "is-hl" : undefined}><MatrixCell v={cell} /></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {s.note && <p className="p-matrix__note">{s.note}</p>}
          </div>
        </section>
      );
    case "logos":
      return (
        <section className={secClass(s)} aria-labelledby={s.id}>
          <div className="wrap">
            <div className="p-logos__head">
              {s.eyebrow && <p className="eyebrow-x" style={{ color: ACCENT }}>{s.eyebrow}</p>}
              {s.heading && <h2 id={s.id} style={{ marginTop: "var(--space-3)" }}><Head h={s.heading} /></h2>}
            </div>
            <div className="p-logos__grid">
              {s.logos.map((lg, i) => (
                <div className="p-logo" key={i}>{lg.asset ? <img src={lg.asset} alt={lg.alt} /> : lg.name}</div>
              ))}
            </div>
          </div>
        </section>
      );
    case "faq": {
      const split = s.layout === "split";
      const head = (
        <div className="p-faq__head">
          {s.eyebrow && <p className="eyebrow-x" style={{ color: ACCENT }}>{s.eyebrow}</p>}
          {s.heading && <h2 id={s.id} style={{ marginTop: "var(--space-3)" }}><Head h={s.heading} /></h2>}
        </div>
      );
      const list = (
        <div className="p-faq__list">
          {s.items.map((f, i) => (
            <details key={i}><summary>{f.q}</summary><p className="p-faq__a">{f.a}</p></details>
          ))}
        </div>
      );
      return (
        <section className={secClass(s, "p-faq " + (split ? "p-faq--split" : ""))} aria-labelledby={s.id}>
          <div className="wrap">
            {split ? <div className="p-faq__grid">{head}{list}</div> : <>{head}{list}</>}
          </div>
        </section>
      );
    }
    case "cta":
      return (
        <section className={"p-final " + (s.theme === "dark" ? "dark" : "")} aria-labelledby={s.id}>
          <div className="wrap">
            {s.eyebrow && <p className="eyebrow-x" style={{ color: ACCENT }}>{s.eyebrow}</p>}
            {s.heading && <h2 className="p-final__h" id={s.id} style={{ marginTop: "var(--space-3)" }}><Head h={s.heading} /></h2>}
            <div className="p-final__row2">
              <div>
                {s.body && <Paras r={s.body} className="p-final__p" />}
                <div className="p-final__row">{s.ctas.map((c, i) => <Cta key={i} c={c} />)}</div>
              </div>
              {s.tagline && <p className="p-final__tag">{s.tagline.map((t, i) => <span key={i}>{t}{i < s.tagline!.length - 1 ? <br /> : null}</span>)}</p>}
            </div>
          </div>
        </section>
      );
  }
}

/* ---------- json-ld ---------- */
function buildJsonLd(page: Page) {
  const types = page.meta.schemaTypes ?? [];
  const graph: object[] = [];
  if (types.includes("Service")) {
    graph.push({
      "@type": "Service",
      name: page.meta.title.split("|")[0].trim(),
      description: page.meta.description,
      provider: { "@id": `${SITE}/#organisation` },
      areaServed: { "@type": "Country", name: "United Kingdom" },
    });
  }
  if (types.includes("LocalBusiness")) {
    graph.push({
      "@type": "LocalBusiness",
      name: "CommView",
      url: `${SITE}/${page.slug}`,
      areaServed: { "@type": "Country", name: "United Kingdom" },
    });
  }
  const faqs = page.sections.flatMap((s) => (s.type === "faq" ? s.items : []));
  if (types.includes("FAQPage") && faqs.length) {
    graph.push({ "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) });
  }
  if (types.includes("BreadcrumbList") && page.meta.breadcrumb?.length) {
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: page.meta.breadcrumb.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: b.name,
        item: b.href ? `${SITE}${b.href}` : i === 0 ? `${SITE}/` : `${SITE}/${page.slug}`,
      })),
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

/* ---------- page ---------- */
export default function PillarPage({ page }: { page: Page }) {
  const h = page.hero;
  const accentLine = h.accentLine ?? (Array.isArray(h.h1) ? h.h1.length - 1 : undefined);
  return (
    <main id="main" className={"pillar acc-" + page.accent}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(page)) }} />

      <section className="p-hero dark" aria-labelledby="p-h1">
        <div className="wrap p-hero__grid">
          <div>
            <p className="eyebrow-x">{h.eyebrow}</p>
            <h1 className="p-hero__h1" id="p-h1"><Head h={h.h1} accentLine={accentLine} /></h1>
            <Paras r={h.sub} className="p-hero__sub" />
            <div className="p-hero__cta">{h.ctas.map((c, i) => <Cta key={i} c={c} />)}</div>
            {h.meta && (
              <div className="p-hero__meta">
                {h.meta.map((m, i) => (
                  <div className="p-meta" key={i}><b>{m.label.map((l, j) => <span key={j}>{l}{j < m.label.length - 1 ? <br /> : null}</span>)}</b></div>
                ))}
              </div>
            )}
          </div>
          <DiagramView d={h.diagram} />
        </div>
      </section>

      {page.sections.map((s) => <SectionView key={s.id} s={s} />)}
    </main>
  );
}

export function pageMetadata(page: Page) {
  return {
    title: { absolute: page.meta.title },
    description: page.meta.description,
    alternates: { canonical: "/" + page.slug },
  };
}
