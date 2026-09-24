// Validates every content/<slug>.json against content/page.schema.json, the
// contract rules, and the SEO/AEO baseline. Runs in the build; fails the PR on
// any error. Structural SEO faults are errors; content-quality SEO issues are
// warnings by default and become errors under SEO_STRICT=1 (flip once the back
// catalogue is clean, so every future page is forced to comply).
import Ajv2020 from "ajv/dist/2020.js";
import fs from "node:fs";
import path from "node:path";

const DIR = "content";
const STRICT = process.env.SEO_STRICT === "1";
const schema = JSON.parse(fs.readFileSync(path.join(DIR, "page.schema.json"), "utf8"));
const ajv = new Ajv2020({ allErrors: true, strict: false });
const validate = ajv.compile(schema);

let errors = 0, warnings = 0;
const fail = (f, m) => { errors++; console.error(`FAIL ${f}: ${m}`); };
const warn = (f, m) => { warnings++; console.warn(`WARN ${f}: ${m}`); };
const seo = (f, m) => (STRICT ? fail : warn)(f, m); // promotable SEO quality checks

// --- routes: canonical plan (lib/routes.json) + what's actually built ---
const norm = (href) => (href.split(/[?#]/)[0].replace(/\/+$/, "")) || "/";
const PLANNED = new Set(JSON.parse(fs.readFileSync("lib/routes.json", "utf8")).planned.map(norm));

function discoverBuilt() {
  const site = "app/(site)";
  const exact = new Set(["/"]);
  const dynamicParents = new Set();
  for (const d of fs.readdirSync(site, { withFileTypes: true })) {
    if (!d.isDirectory() || d.name.startsWith("(") || d.name.startsWith("[")) continue;
    exact.add("/" + d.name);
    const kids = fs.readdirSync(path.join(site, d.name), { withFileTypes: true });
    if (kids.some((k) => k.isDirectory() && k.name.startsWith("["))) dynamicParents.add(d.name);
  }
  return { exact, dynamicParents };
}
const BUILT = discoverBuilt();
// Every content page renders via the catch-all route, so a content slug counts as built.
const CONTENT_SLUGS = new Set(
  fs.readdirSync(DIR)
    .filter((f) => f.endsWith(".json") && f !== "page.schema.json")
    .map((f) => { try { return norm("/" + JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8")).slug); } catch { return null; } })
    .filter(Boolean)
);
const isBuilt = (href) => {
  const p = norm(href);
  return BUILT.exact.has(p) || BUILT.dynamicParents.has(p.split("/")[1]) || CONTENT_SLUGS.has(p);
};

const flat = (v) => (Array.isArray(v) ? v.join(" ") : v || "");
// Inline prose links written as [anchor](/path) in body copy / faq answers /
// callouts — the pillar renderer turns these into real <a> internal links, so
// the validator must treat them as internal links too.
const INLINE_LINK = /\]\((\/[^)\s]+)\)/g;
function inlineHrefs(data) {
  const out = [];
  let m;
  const s = JSON.stringify(data);
  INLINE_LINK.lastIndex = 0;
  while ((m = INLINE_LINK.exec(s))) out.push(m[1]);
  return out;
}
function collectHrefs(data) {
  const out = [];
  for (const c of data.hero?.ctas || []) out.push(c.href);
  for (const s of data.sections || []) {
    for (const it of s.items || []) if (it.href) out.push(it.href);
    for (const c of s.ctas || []) out.push(c.href);
  }
  out.push(...inlineHrefs(data));
  return out;
}

// --- SEO / AEO baseline ---
function auditSeo(f, data) {
  const kw = (data.meta.primaryKeyword || "").toLowerCase();
  const title = data.meta.title || "";
  const desc = data.meta.description || "";

  if (kw && !title.toLowerCase().includes(kw)) seo(f, `primary keyword "${kw}" not in <title>`);
  if (title.length > 60) seo(f, `<title> is ${title.length} chars (>60 risks SERP truncation)`);
  if (desc.length > 160) seo(f, `meta description ${desc.length} chars (>160)`);
  if (desc.length && desc.length < 70) seo(f, `meta description ${desc.length} chars (<70, thin)`);
  if (kw && !desc.toLowerCase().includes(kw)) seo(f, `primary keyword not in meta description`);

  const hero = [flat(data.hero?.h1), data.hero?.eyebrow, flat(data.hero?.sub)].join(" ").toLowerCase();
  if (kw && !hero.includes(kw)) seo(f, `primary keyword "${kw}" not present in the hero (h1/eyebrow/sub)`);

  // structured data consistency (structural — always errors)
  const types = data.meta.schemaTypes || [];
  const hasFaq = (data.sections || []).some((s) => s.type === "faq" && s.items?.length);
  if (types.includes("FAQPage") && !hasFaq) fail(f, `FAQPage schema declared but no faq section with items`);
  if (hasFaq && !types.includes("FAQPage")) seo(f, `has a faq section but FAQPage not in schemaTypes (missed AEO rich result)`);
  if (types.includes("BreadcrumbList") && !data.meta.breadcrumb?.length) fail(f, `BreadcrumbList declared but no breadcrumb`);
  if (!hasFaq) seo(f, `no faq section — recommended for AEO`);

  // internal links: must be in the planned sitemap. Forward-refs to planned-but-
  // unbuilt pages are fine (they route once built); an unplanned path is a typo.
  let pending = 0;
  for (const h of collectHrefs(data)) {
    if (!h.startsWith("/")) continue;
    if (!PLANNED.has(norm(h))) seo(f, `internal link ${h} is not in the planned sitemap (lib/routes.json) — typo or unplanned URL`);
    else if (!isBuilt(h)) pending++;
  }
  if (pending) console.log(`     ${f}: ${pending} link(s) target planned pages not built yet (will route when built)`);
}

// --- run ---
const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".json") && f !== "page.schema.json");
if (!files.length) console.log("(no content files yet)");

for (const f of files) {
  const slug = f.replace(/\.json$/, "");
  if (slug === "home") { fail(f, "the homepage is locked and out of scope for the content pipeline"); continue; }

  let data;
  try { data = JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8")); }
  catch (e) { fail(f, "invalid JSON — " + e.message); continue; }

  const before = errors;
  if (!validate(data)) for (const e of validate.errors) fail(f, `${e.instancePath || "/"} ${e.message}`);
  if (data.slug && data.slug.replaceAll("/", "-") !== slug) fail(f, `filename "${slug}" must be the slug "${data.slug}" with '/' as '-'`);
  if (data.slug && !PLANNED.has(norm("/" + data.slug))) seo(f, `slug "/${data.slug}" is not in the planned sitemap (lib/routes.json)`);

  const json = JSON.stringify(data);
  const todos = (json.match(/TODO:/g) || []).length;
  if (todos) warn(f, `${todos} TODO placeholder(s) — unresolved copy or unsupported claim`);
  const unverified = (json.match(/"evidence":"needs-verification"/g) || []).length;
  if (unverified) warn(f, `${unverified} stat(s) needs-verification — hidden in production until verified`);

  const surface = JSON.stringify([data.hero?.ctas, data.sections]);
  for (const link of data.meta?.internalLinks || []) {
    const esc = link.href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Rendered either as a structured href ("href":"/x") or an inline prose link ]( /x )
    const rx = new RegExp(`"href":"${esc}"|\\]\\(${esc}\\)`);
    if (!rx.test(surface)) warn(f, `declared internal link ${link.href} (${link.purpose}) is not rendered on the page`);
  }

  auditSeo(f, data);
  if (errors === before) console.log(`OK   ${f}`);
}

console.log(`\nSEO mode: ${STRICT ? "STRICT (quality issues fail the build)" : "advisory (quality issues warn)"}`);
console.log(`${errors ? errors + " error(s)" : "content valid"}${warnings ? `, ${warnings} warning(s)` : ""}`);
process.exit(errors ? 1 : 0);
