// Performance budget check. Loads a representative route set in a headless
// browser and asserts transfer/request/font budgets, so "all pages are fast"
// is measured, not eyeballed. Standalone and advisory: it is NOT wired into the
// build or verify.mjs, so it can never break those. Run it on demand:
//   node scripts/perf.mjs            (against http://localhost:3000)
//   PERF_BASE=https://commview-green.vercel.app node scripts/perf.mjs
// Exit code is non-zero only if a hard budget is breached, so it can later be
// dropped into CI if desired.
import { chromium } from "playwright";

const BASE = process.env.PERF_BASE || "http://localhost:3000";

// Representative slice: every template/pillar plus the heaviest core pages.
const ROUTES = [
  "/", "/what-we-do", "/how-we-work", "/work", "/about", "/insights",
  "/cmo-support", "/fractional-cmo", "/positioning", "/ideal-customer-profile-workshop",
  "/growth", "/growth/seo", "/growth/aeo", "/growth/outbound-lead-generation",
  "/product-strategy", "/product-strategy/consulting",
  "/ai-consulting", "/ai-consulting/business-operations",
];

// Budgets (transfer/requests are device-independent; a good proxy for a lean page).
const BUDGET = {
  transferKB: 300,   // total bytes over the wire per route
  requests: 30,      // total requests per route
  fontFiles: 1,      // exactly one (variable) font file
  requirePreloadFont: true,
};

const b = await chromium.launch();
let breaches = 0;
const rows = [];

for (const route of ROUTES) {
  const p = await b.newPage();
  const resources = [];
  p.on("response", async (res) => {
    try {
      const h = res.headers();
      const len = Number(h["content-length"] || 0);
      resources.push({ url: res.url(), len });
    } catch {}
  });
  await p.goto(BASE + route, { waitUntil: "networkidle", timeout: 60000 });
  const measured = await p.evaluate(() => {
    const r = performance.getEntriesByType("resource");
    let total = 0;
    for (const e of r) total += e.transferSize || e.encodedBodySize || 0;
    const fonts = r.filter((e) => /\.woff2?(\?|$)/.test(e.name)).length;
    const nav = performance.getEntriesByType("navigation")[0];
    const preloadFont = !!document.querySelector('link[rel=preload][as=font]');
    return {
      transferKB: Math.round(total / 1024),
      requests: r.length,
      fonts,
      preloadFont,
      domInteractive: Math.round(nav?.domInteractive || 0),
    };
  });
  await p.close();

  const flags = [];
  if (measured.transferKB > BUDGET.transferKB) flags.push(`transfer ${measured.transferKB}KB > ${BUDGET.transferKB}`);
  if (measured.requests > BUDGET.requests) flags.push(`requests ${measured.requests} > ${BUDGET.requests}`);
  if (measured.fonts > BUDGET.fontFiles) flags.push(`fonts ${measured.fonts} > ${BUDGET.fontFiles}`);
  if (BUDGET.requirePreloadFont && !measured.preloadFont) flags.push("no font preload");
  if (flags.length) breaches++;
  rows.push({ route, ...measured, flags });
}

await b.close();

console.log(`Perf budget @ ${BASE}\n`);
console.log("route".padEnd(42), "KB".padStart(5), "req".padStart(4), "font".padStart(5), "  status");
for (const r of rows) {
  const status = r.flags.length ? "OVER: " + r.flags.join("; ") : "ok";
  console.log(r.route.padEnd(42), String(r.transferKB).padStart(5), String(r.requests).padStart(4), String(r.fonts).padStart(5), " ", status);
}
console.log(`\n${breaches ? breaches + " route(s) over budget" : "all routes within budget"}`);
process.exit(breaches ? 1 : 0);
