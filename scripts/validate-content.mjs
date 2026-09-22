// Validates every content/<slug>.json against content/page.schema.json and the
// contract rules that JSON Schema can't express. Runs in CI; fails the PR on any
// error. Warnings (TODOs, undelivered internal links) are surfaced, not fatal.
import Ajv2020 from "ajv/dist/2020.js";
import fs from "node:fs";
import path from "node:path";

const DIR = "content";
const schema = JSON.parse(fs.readFileSync(path.join(DIR, "page.schema.json"), "utf8"));
const ajv = new Ajv2020({ allErrors: true, strict: false });
const validate = ajv.compile(schema);

const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".json") && f !== "page.schema.json");
let errors = 0;
let warnings = 0;
const fail = (f, m) => { errors++; console.error(`FAIL ${f}: ${m}`); };
const warn = (f, m) => { warnings++; console.warn(`WARN ${f}: ${m}`); };

if (!files.length) console.log("(no content files yet)");

for (const f of files) {
  const slug = f.replace(/\.json$/, "");
  if (slug === "home") { fail(f, "the homepage is locked and out of scope for the content pipeline"); continue; }

  let data;
  try { data = JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8")); }
  catch (e) { fail(f, "invalid JSON — " + e.message); continue; }

  if (!validate(data)) {
    for (const e of validate.errors) fail(f, `${e.instancePath || "/"} ${e.message}`);
  }

  if (data.slug && data.slug !== slug) fail(f, `slug "${data.slug}" does not match filename "${slug}"`);

  const json = JSON.stringify(data);

  // Unsupported factual claims must be flagged, not invented (Rule 4).
  const todos = (json.match(/TODO:/g) || []).length;
  if (todos) warn(f, `${todos} TODO placeholder(s) — unresolved copy or unsupported claim`);

  // Every stat must declare evidence; unverified ones never reach production.
  const unverified = JSON.stringify(data.sections || [])
    .match(/"evidence":"needs-verification"/g)?.length || 0;
  if (unverified) warn(f, `${unverified} stat(s) marked needs-verification — hidden in production until verified`);

  // Declared internal links should actually render somewhere on the page — check
  // the rendered surface (hero CTAs + sections), not the meta declaration itself.
  const surface = JSON.stringify([data.hero?.ctas, data.sections]);
  for (const link of data.meta?.internalLinks || []) {
    const rendered = new RegExp(`"href":"${link.href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`).test(surface);
    if (!rendered) warn(f, `internal link ${link.href} (${link.purpose}) is declared but not rendered on the page`);
  }

  if (!errors) console.log(`OK   ${f}`);
}

console.log(`\n${errors ? errors + " error(s)" : "content valid"}${warnings ? `, ${warnings} warning(s)` : ""}`);
process.exit(errors ? 1 : 0);
