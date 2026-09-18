// Copy-fidelity guard for locked pages. Compares the server-rendered text of a
// route against its reference mock as a multiset of words, so the teleprompter
// clone and aria-live mirror don't cause false diffs. Exits non-zero on drift.
//
// Usage: node scripts/fidelity.mjs [route] [referenceFile]
//   defaults: "/"  reference/index.html
import { readFileSync } from "fs";

const BASE = process.env.VERIFY_BASE || "http://localhost:3000";
const route = process.argv[2] || "/";
const refFile = process.argv[3] || "reference/index.html";

function mainText(html) {
  const m = html.match(/<main[\s\S]*?<\/main>/i);
  let s = m ? m[0] : html;
  s = s.replace(/<script[\s\S]*?<\/script>/gi, " ");
  s = s.replace(/<svg[\s\S]*?<\/svg>/gi, " "); // SVG carries no copy
  s = s.replace(/<[^>]+>/g, " ");
  s = s
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&#8230;/g, "…")
    .replace(/&amp;/g, "&")
    .replace(/&pound;/g, "£")
    .replace(/&nbsp;/g, " ");
  return s.replace(/\s+/g, " ").trim();
}
const words = (t) => t.split(" ").filter(Boolean);
const bag = (ws) => ws.reduce((m, w) => m.set(w, (m.get(w) || 0) + 1), new Map());

const ref = mainText(readFileSync(refFile, "utf8"));
const live = mainText(await (await fetch(BASE + route)).text());
const rb = bag(words(ref));
const lb = bag(words(live));
const missing = [];
const extra = [];
for (const [w, c] of rb) { const d = c - (lb.get(w) || 0); if (d > 0) missing.push(`${w}×${d}`); }
for (const [w, c] of lb) { const d = c - (rb.get(w) || 0); if (d > 0) extra.push(`${w}×${d}`); }

console.log(`${route}  ref:${words(ref).length}  live:${words(live).length}`);
console.log("  missing:", missing.length ? missing.join(", ") : "none");
console.log("  extra  :", extra.length ? extra.join(", ") : "none");
if (missing.length || extra.length) {
  console.log("\nFIDELITY DRIFT — locked copy changed.");
  process.exit(1);
}
console.log("\ncopy is verbatim");
