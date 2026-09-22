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

// --- route discovery, for internal-link existence checks ---
function discoverRoutes() {
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
const ROUTES = discoverRoutes();
const routeExists = (href) => {
  const p = (href.split(/[?#]/)[0].replace(/\/+$/, "")) || "/";
  if (ROUTES.exact.has(p)) return true;
  return ROUTES.dynamicParents.has(p.split("/")[1]);
};

const flat = (v) => (Array.isArray(v) ? v.join(" ") : v || "");
function collectHrefs(data) {
  const out = [];
  for (const c of data.hero?.ctas || []) out.push(c.href);
  for (const s of data.sections || []) {
    for (const it of s.items || []) if (it.href) out.push(it.href);
    for (const c of s.ctas || []) out.push(c.href);
  }
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

  // internal-link existence (404 risk)
  for (const h of collectHrefs(data)) {
    if (h.startsWith("/") && !routeExists(h)) seo(f, `internal link ${h} → no such route yet (would 404)`);
  }
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
  if (data.slug && data.slug !== slug) fail(f, `slug "${data.slug}" does not match filename "${slug}"`);

  const json = JSON.stringify(data);
  const todos = (json.match(/TODO:/g) || []).length;
  if (todos) warn(f, `${todos} TODO placeholder(s) — unresolved copy or unsupported claim`);
  const unverified = (json.match(/"evidence":"needs-verification"/g) || []).length;
  if (unverified) warn(f, `${unverified} stat(s) needs-verification — hidden in production until verified`);

  const surface = JSON.stringify([data.hero?.ctas, data.sections]);
  for (const link of data.meta?.internalLinks || []) {
    const rx = new RegExp(`"href":"${link.href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`);
    if (!rx.test(surface)) warn(f, `declared internal link ${link.href} (${link.purpose}) is not rendered on the page`);
  }

  auditSeo(f, data);
  if (errors === before) console.log(`OK   ${f}`);
}

console.log(`\nSEO mode: ${STRICT ? "STRICT (quality issues fail the build)" : "advisory (quality issues warn)"}`);
console.log(`${errors ? errors + " error(s)" : "content valid"}${warnings ? `, ${warnings} warning(s)` : ""}`);
process.exit(errors ? 1 : 0);
