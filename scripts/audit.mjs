// Site-wide tidy-up audit. Two halves:
//   A) source scans (fs + regex): em/en dashes, brand casing, CTA arrows,
//      americanised spelling, TODO/placeholder leakage, hardcoded hex in
//      component CSS.
//   B) live crawl (fetch against the dev server): per-page title/description/
//      canonical, duplicate SEO, title/desc length, every internal link's
//      status (404s, '#'), and broken images.
// Layout/overflow/h1/JSON-LD/console are covered by scripts/verify.mjs.
//
// Run the dev server first, then: node scripts/audit.mjs
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const BASE = process.env.AUDIT_BASE || "http://localhost:3000";
let flags = 0;
const hdr = (t) => console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));
const flag = (...m) => { flags++; console.log("  •", ...m); };

// ---- gather source files ----
function walk(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === ".next" || e.name === ".git" || e.name === "reference") continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}
const all = walk(".");
const tsx = all.filter((f) => f.endsWith(".tsx"));
const contentJson = all.filter((f) => f.startsWith("content" + require_sep()) && f.endsWith(".json") && !f.endsWith("page.schema.json"));
const cssFiles = all.filter((f) => f.endsWith(".css"));
function require_sep() { return join("content", "x").slice(7, 8); }
const copyFiles = [...tsx, ...contentJson];

function lines(file) { return readFileSync(file, "utf8").split(/\r?\n/); }

// ---- A1: em / en dashes in copy ----
hdr("A1  Em / en dashes (—, –) in copy");
for (const f of copyFiles) {
  lines(f).forEach((ln, i) => {
    if (/[—–]/.test(ln) && !/^\s*(\/\/|\*)/.test(ln)) flag(`${f}:${i + 1}  ${ln.trim().slice(0, 90)}`);
  });
}

// ---- A2: brand casing (should be CommView; COMMVIEW only in the logo) ----
hdr("A2  Brand casing (want 'CommView'; 'COMMVIEW' only in the logo)");
for (const f of copyFiles) {
  if (/Logo/.test(f)) continue; // the wordmark component is the allowed exception
  lines(f).forEach((ln, i) => {
    for (const m of ln.matchAll(/commview/gi)) {
      const tok = m[0];
      const after = ln.slice(m.index + tok.length, m.index + tok.length + 12);
      const before = ln.slice(Math.max(0, m.index - 1), m.index);
      if (tok === "CommView") continue;                        // correct
      if (/^[.-]/.test(after) || before === "/") continue;      // commview.co.uk, commview-green, /commview paths
      flag(`${f}:${i + 1}  '${tok}'  ${ln.trim().slice(0, 80)}`);
    }
  });
}

// ---- A3: arrows near CTA/button/link text ----
hdr("A3  Arrows in CTA/button/link text (data arrows are fine — review each)");
for (const f of copyFiles) {
  lines(f).forEach((ln, i) => {
    if (/[→➤»]|->/.test(ln) && /(btn|cta|label|button|link|"href")/i.test(ln)) flag(`${f}:${i + 1}  ${ln.trim().slice(0, 90)}`);
  });
}

// ---- A4: americanised spelling ----
hdr("A4  Americanised spelling (British English wanted)");
const usWords = /\b(optimiz(e|ed|ing)|organiz(e|ed|ing)|prioritiz(e|ed|ing)|realiz(e|ed)|analyz(e|ed)|customiz(e|ed)|maximiz(e|ed)|minimiz(e|ed)|behavior|favor|catalog|defense|fulfill)\b/i;
for (const f of copyFiles) {
  lines(f).forEach((ln, i) => {
    // skip CSS style props (color:), schema.org types (Organization), the AEO
    // term (Answer Engine Optimization) and code plumbing.
    if (/color:|@type|Organization|Optimization|className|import |from "|https?:/.test(ln)) return;
    const m = ln.match(usWords);
    if (m) flag(`${f}:${i + 1}  '${m[0]}'  ${ln.trim().slice(0, 80)}`);
  });
}

// ---- A5: TODO / placeholder leakage ----
hdr("A5  TODO / placeholder / coming-soon in copy");
for (const f of copyFiles) {
  lines(f).forEach((ln, i) => {
    if (/(TODO|coming soon|lorem ipsum|placeholder|to be supplied|to be confirmed|TBC)/i.test(ln)) flag(`${f}:${i + 1}  ${ln.trim().slice(0, 90)}`);
  });
}

// ---- A6: hardcoded hex in component CSS (tokens.css is the source of colour) ----
hdr("A6  Hardcoded hex in component CSS (should use tokens)");
for (const f of cssFiles) {
  if (f.endsWith("tokens.css")) continue;
  lines(f).forEach((ln, i) => {
    const m = ln.match(/#[0-9a-fA-F]{3,8}\b/);
    if (m) flag(`${f}:${i + 1}  '${m[0]}'  ${ln.trim().slice(0, 70)}`);
  });
}

// ---- B: live crawl ----
function contentSlugs() {
  return contentJson.map((f) => {
    try { return JSON.parse(readFileSync(f, "utf8")).slug; } catch { return null; }
  }).filter(Boolean).map((s) => "/" + s);
}
const ROUTES = [
  "/", "/what-we-do", "/how-we-work", "/work", "/contact", "/about", "/fractional-cmo", "/insights",
  ...contentSlugs(),
];

const pick = (html, re) => { const m = html.match(re); return m ? m[1].trim() : ""; };
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&rsquo;/g, "’").replace(/&amp;/g, "&");

const pages = [];
const linkSet = new Set();
let hashLinks = 0;
const imgs = new Set();

hdr("B  Crawling " + ROUTES.length + " pages…");
for (const r of ROUTES) {
  let html;
  try { const res = await fetch(BASE + r); html = await res.text(); if (!res.ok) { flag(`ROUTE ${r} → HTTP ${res.status}`); continue; } }
  catch (e) { flag(`ROUTE ${r} → fetch failed ${e.message}`); continue; }
  const title = decode(pick(html, /<title>([^<]*)<\/title>/i));
  const desc = decode(pick(html, /<meta name="description" content="([^"]*)"/i));
  const canonical = pick(html, /<link rel="canonical" href="([^"]*)"/i);
  pages.push({ r, title, desc, canonical });
  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    const h = m[1];
    if (h === "#" || h === "") { hashLinks++; flag(`ROUTE ${r} → placeholder href '${h || "(empty)"}'`); continue; }
    if (h.startsWith("/") && !h.startsWith("//") && !h.startsWith("/_next")) linkSet.add(h.split("#")[0]);
  }
  for (const m of html.matchAll(/<img[^>]+src="([^"]+)"/g)) {
    if (m[1].startsWith("/") && !m[1].startsWith("/_next")) imgs.add(m[1]);
  }
}

// ---- B1: title / description length + presence ----
hdr("B1  Title & description length / presence");
for (const p of pages) {
  if (!p.title) flag(`${p.r} — missing <title>`);
  else if (p.title.length > 62) flag(`${p.r} — title ${p.title.length} chars (>62): ${p.title}`);
  if (!p.desc) flag(`${p.r} — missing meta description`);
  else if (p.desc.length < 70 || p.desc.length > 160) flag(`${p.r} — desc ${p.desc.length} chars (want 70–160)`);
  if (!p.canonical) flag(`${p.r} — missing canonical`);
}

// ---- B2: duplicate titles / descriptions ----
hdr("B2  Duplicate titles / descriptions");
const byTitle = {}, byDesc = {};
for (const p of pages) { (byTitle[p.title] ||= []).push(p.r); (byDesc[p.desc] ||= []).push(p.r); }
for (const [t, rs] of Object.entries(byTitle)) if (t && rs.length > 1) flag(`duplicate TITLE on ${rs.join(", ")}: ${t}`);
for (const [d, rs] of Object.entries(byDesc)) if (d && rs.length > 1) flag(`duplicate DESC on ${rs.join(", ")}`);

// ---- B3: internal link resolution ----
hdr("B3  Internal link resolution (" + linkSet.size + " unique)");
for (const h of [...linkSet].sort()) {
  try { const res = await fetch(BASE + h, { redirect: "manual" }); if (res.status >= 400) flag(`LINK ${h} → HTTP ${res.status}`); }
  catch (e) { flag(`LINK ${h} → ${e.message}`); }
}

// ---- B4: image resolution ----
hdr("B4  Image resolution (" + imgs.size + " unique)");
for (const s of [...imgs].sort()) {
  try { const res = await fetch(BASE + s); if (!res.ok) flag(`IMG ${s} → HTTP ${res.status}`); }
  catch (e) { flag(`IMG ${s} → ${e.message}`); }
}

console.log("\n" + "=".repeat(64));
console.log(flags ? `${flags} item(s) flagged for review` : "no issues flagged");
console.log("=".repeat(64));
