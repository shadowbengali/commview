// Pillar-page renderer. Consumes a content/<slug>.json (typed as Page) and
// renders it through styles/pillar.css. This is the only place pillar layout
// lives; ChatGPT never touches it. Server Component (native <details>, no JS).
import type { Page, Section, Heading, Rich, Diagram, Stat } from "../../lib/content/types";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://commview-green.vercel.app";
// Unverified stats show (flagged) in dev/preview for QA, but never in production.
const IS_PROD = process.env.VERCEL_ENV === "production";

const ACCENT = "var(--c)";

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

function SectionHead({ s }: { s: Extract<Section, { type: string }> }) {
  const heading = "heading" in s ? s.heading : undefined;
  const intro = "intro" in s ? s.intro : undefined;
  const eyebrow = "eyebrow" in s ? s.eyebrow : undefined;
  const inner = (
    <div>
      {eyebrow && <p className="eyebrow-x" style={{ color: ACCENT }}>{eyebrow}</p>}
      {heading && <h2 id={s.id} style={{ marginTop: "var(--space-3)" }}><Head h={heading} /></h2>}
    </div>
  );
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

function OverlapDiagram({ d }: { d: Extract<Diagram, { kind: "overlap" }> }) {
  const pc = { x: 300, y: 236, r: 66 };
  const lobePos = [
    { cx: 238, cy: 174, lx: 188, ly: 120 }, { cx: 362, cy: 174, lx: 412, ly: 120 },
    { cx: 238, cy: 298, lx: 188, ly: 352 }, { cx: 362, cy: 298, lx: 412, ly: 352 },
  ];
  return (
    <div className="p-diagram">
      <svg viewBox="0 0 600 470" role="img" aria-label={`${d.core}: ${d.lobes.join(", ")}.`}>
        <defs>
          <filter id="pdoGlow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="14" /></filter>
          <radialGradient id="pdoCore" cx="50%" cy="40%" r="65%"><stop offset="0" stopColor="#1a2350" /><stop offset="1" stopColor="#0b0f14" /></radialGradient>
        </defs>
        {d.lobes.map((_, i) => <circle key={i} cx={lobePos[i]?.cx} cy={lobePos[i]?.cy} r="122" fill={ACCENT} fillOpacity="0.09" stroke={ACCENT} strokeWidth="1.2" strokeOpacity="0.6" />)}
        <circle cx={pc.x} cy={pc.y} r={pc.r + 14} fill={ACCENT} opacity="0.35" filter="url(#pdoGlow)" />
        <circle cx={pc.x} cy={pc.y} r={pc.r} fill="url(#pdoCore)" stroke={ACCENT} strokeWidth="2" />
        <text x={pc.x} y={pc.y - (d.coreLines?.length ? 6 : 0)} textAnchor="middle" className="p-diagram__core">{d.core}</text>
        {d.coreLines?.map((l, i) => <text key={i} x={pc.x} y={pc.y + 16 + i * 16} textAnchor="middle" className="p-diagram__coreline">{l}</text>)}
        {d.lobes.map((label, i) => {
          const words = label.split(" ");
          const p = lobePos[i]; if (!p) return null;
          return (
            <g key={label}>
              <text x={p.lx} y={p.ly} textAnchor="middle" className="p-diagram__lobe">{words[0]}</text>
              {words[1] && <text x={p.lx} y={p.ly + 18} textAnchor="middle" className="p-diagram__lobe">{words.slice(1).join(" ")}</text>}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function DiagramView({ d }: { d?: Diagram }) {
  if (!d || d.kind === "none") return null;
  if (d.kind === "hub") return <HubDiagram d={d} />;
  if (d.kind === "overlap") return <OverlapDiagram d={d} />;
  if (d.kind === "image") return <div className="p-shot"><img src={d.src} alt={d.alt} /></div>;
  if (d.kind === "stack") {
    const n = d.layers.length;
    const top = 22, avail = 470 - top * 2, gap = 14;
    const h = Math.min(72, (avail - gap * (n - 1)) / n), step = h + gap;
    return (
      <div className="p-diagram"><svg viewBox="0 0 600 470" role="img" aria-label={d.layers.join(", then ")}>
        <defs><filter id="pdsGlow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="10" /></filter></defs>
        {d.layers.map((l, i) => {
          const y = top + i * step, last = i === n - 1;
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
  const cls = c.style === "primary" ? "btn btn--accent btn--lg" : "btn btn--ghost btn--lg";
  return <a className={cls} href={c.href}>{c.label}</a>;
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
            <div className="p-lead__body">{s.intro && <Paras r={s.intro} />}</div>
          </div>
        </section>
      );
    case "grid": {
      const cols = String(s.items.length);
      return (
        <section className={secClass(s)} aria-labelledby={s.id}>
          <div className="wrap">
            <SectionHead s={s} />
            <div className="p-grid" data-cols={cols}>
              {s.items.map((it, i) => (
                <div className="p-cell" key={i}>
                  <b>{String(i + 1).padStart(2, "0")}</b>
                  <h3>{it.title}</h3>
                  <p>{it.body}</p>
                  {it.href && <a className="p-cell__more" href={it.href}>Learn more</a>}
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
      const circles = s.style === "circles";
      return (
        <section className={secClass(s)} aria-labelledby={s.id}>
          <div className="wrap">
            <SectionHead s={s} />
            <div className={"p-proc__grid " + (circles ? "p-proc--circles" : "p-proc--arrows")}>
              {s.steps.map((st, i) => (
                <div className="p-step" key={i}>
                  {circles ? <div className="p-step__n">{String(i + 1).padStart(2, "0")}</div> : <b>{String(i + 1).padStart(2, "0")}</b>}
                  <h3>{st.title}</h3>
                  <p>{st.body}</p>
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
                  {!IS_PROD && x.evidence === "needs-verification" && <span className="p-stat__flag">Needs verification</span>}
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }
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
            <div className="p-compare__grid" data-cols={String(s.columns.length)} style={{ gridTemplateColumns: `repeat(${s.columns.length}, minmax(0, 1fr))` }}>
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
