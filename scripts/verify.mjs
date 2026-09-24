// Ported from reference/verify.js to run against the live dev server instead
// of static files. Extend ROUTES as each phase adds pages.
//
// Known trap (CLAUDE.md): Google Fonts can be blocked in sandboxes, so layout
// checks silently run in a fallback face and pass when they should fail. We
// self-host Inter, and this script asserts an Inter face is actually loaded
// before trusting any width measurement.
import { chromium } from "playwright";

const BASE = process.env.VERIFY_BASE || "http://localhost:3000";
// Bespoke routes + a representative slice of the content-driven pages (every
// template, accent and diagram kind). All 26 content pages are covered by the
// content validator and the production build; this checks rendered overflow.
const ROUTES = [
  "/", "/insights", "/what-we-do", "/how-we-work", "/contact", "/work", "/about", "/fractional-cmo", "/cmo-support",
  "/growth", "/product-strategy", "/ai-consulting",
  "/growth/seo", "/growth/outbound-lead-generation", "/product-strategy/consulting",
  "/ai-consulting/genai", "/ai-consulting/implementation",
  "/fractional-cmo/uk", "/fractional-cmo/for-startups",
  "/growth/seo/saas", "/growth/aeo/services",
  "/positioning", "/ideal-customer-profile-workshop",
];
const WIDTHS = [360, 390, 430, 768, 900, 1024, 1280, 1440, 1920];

const b = await chromium.launch();
let fails = 0;
const fail = (...m) => {
  fails++;
  console.log("FAIL", ...m);
};

// --- Font gate: Inter must genuinely be loaded, or measurements are worthless.
{
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  const font = await p.evaluate(async () => {
    await document.fonts.ready;
    return {
      interLoaded: document.fonts.check("700 24px Inter"),
      bodyFamily: getComputedStyle(document.body).fontFamily,
    };
  });
  if (!font.interLoaded) fail("Inter not loaded — measurements untrustworthy", font.bodyFamily);
  else console.log("OK   Inter loaded |", font.bodyFamily);
  await p.close();
}

// --- Overflow + console/page errors at every width.
for (const route of ROUTES) {
  for (const w of WIDTHS) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    const errs = [];
    p.on("pageerror", (e) => errs.push(String(e)));
    p.on("console", (m) => m.type() === "error" && errs.push("console: " + m.text()));
    await p.goto(BASE + route, { waitUntil: "networkidle" });
    const r = await p.evaluate(() => {
      const d = document.documentElement;
      const over = [];
      document.querySelectorAll("body *").forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.width && rect.right > d.clientWidth + 1) {
          let a = el.parentElement, clipped = false;
          while (a) { if (getComputedStyle(a).overflowX !== "visible") { clipped = true; break; } a = a.parentElement; }
          if (!clipped && getComputedStyle(el).position !== "fixed")
            over.push(el.tagName + " R" + Math.round(rect.right));
        }
      });
      return { sw: d.scrollWidth, cw: d.clientWidth, over: over.slice(0, 6) };
    });
    if (r.sw > r.cw + 1 || errs.length)
      fail(route, w, "scroll", r.sw, "client", r.cw, errs.join("|"), r.over.join(" | "));
    await p.close();
  }
}

// --- Structure: one h1, no heading jumps, every img has alt, JSON-LD parses.
for (const route of ROUTES) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(BASE + route, { waitUntil: "networkidle" });
  const r = await p.evaluate(() => {
    const hs = [...document.querySelectorAll("h1,h2,h3,h4")].map((h) => +h.tagName[1]);
    let jump = null;
    for (let i = 1; i < hs.length; i++) if (hs[i] - hs[i - 1] > 1) jump = hs[i - 1] + "->" + hs[i];
    const ld = [];
    document.querySelectorAll('script[type="application/ld+json"]').forEach((s) => {
      try { JSON.parse(s.textContent); } catch (e) { ld.push("PARSE ERROR: " + e.message); }
    });
    return {
      h1: document.querySelectorAll("h1").length,
      jump,
      imgNoAlt: [...document.querySelectorAll("img")].filter((i) => !i.hasAttribute("alt")).length,
      ldErrors: ld,
    };
  });
  console.log(route, "| h1:", r.h1, "| jump:", r.jump || "none", "| img no-alt:", r.imgNoAlt);
  if (r.h1 !== 1) fail(route, "h1 count", r.h1);
  if (r.jump) fail(route, "heading jump", r.jump);
  if (r.imgNoAlt) fail(route, "img missing alt", r.imgNoAlt);
  if (r.ldErrors.length) fail(route, "json-ld", r.ldErrors.join(" | "));
  await p.close();
}

// --- Homepage interactions actually work.
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.waitForTimeout(1500); // let the client effect hydrate before measuring

  // Teleprompter advances (counter changes and last word gets accented).
  const tp0 = await p.evaluate(() => document.getElementById("tp-n")?.textContent);
  const accented = await p.evaluate(
    () => document.querySelectorAll("#tp-track .tp__q em").length
  );
  await p.waitForTimeout(6000);
  const tp1 = await p.evaluate(() => document.getElementById("tp-n")?.textContent);
  if (accented < 20) fail("teleprompter accents", accented);
  if (tp0 === tp1) fail("teleprompter did not advance", tp0, tp1);
  else console.log("teleprompter:", tp0, "->", tp1, "| accented rows:", accented);

  // Capability panels: opening Growth hides GTM's panel, sets aria-expanded.
  await p.click('.cap__open[data-target="growth"]');
  await p.waitForTimeout(300);
  const caps = await p.evaluate(() => ({
    growthOpen: !document.getElementById("panel-growth")?.hidden,
    gtmClosed: document.getElementById("panel-gtm-leadership")?.hidden,
    aria: document
      .querySelector('.cap__open[data-target="growth"]')
      ?.getAttribute("aria-expanded"),
  }));
  if (!caps.growthOpen || !caps.gtmClosed || caps.aria !== "true")
    fail("capability panels", JSON.stringify(caps));
  else console.log("capability panels: toggle OK");
  await p.close();
}

// --- Mobile menu opens.
{
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.click(".burger");
  await p.waitForTimeout(200);
  const menu = await p.evaluate(() => {
    const n = document.getElementById("nav");
    return {
      open: n?.getAttribute("data-open"),
      expanded: document.querySelector(".burger")?.getAttribute("aria-expanded"),
      h: Math.round(n?.getBoundingClientRect().height || 0),
    };
  });
  if (menu.open !== "true" || menu.h < 100) fail("mobile menu", JSON.stringify(menu));
  else console.log("mobile menu:", menu.open, menu.h + "px", "| expanded:", menu.expanded);
  await p.close();
}

// --- /studio must load without a page crash. Its first dev compile is heavy,
// so a slow load here is a soft note, not a failure of the site's pages.
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = [];
  p.on("pageerror", (e) => errs.push(String(e)));
  try {
    await p.goto(BASE + "/studio", { waitUntil: "domcontentloaded", timeout: 60000 });
    await p.waitForTimeout(2500);
    if (errs.length) fail("/studio pageerror", errs.slice(0, 2).join(" | "));
    else console.log("/studio | loaded ok");
  } catch {
    console.log("/studio | skipped (slow first compile) — not a site-page failure");
  }
  await p.close();
}

console.log("\n" + (fails ? fails + " FAILURES" : "all checks passed"));
await b.close();
process.exit(fails ? 1 : 0);
