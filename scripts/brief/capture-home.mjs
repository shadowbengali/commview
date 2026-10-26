// Capture a prospect's homepage hero and emit a compact webp `data:` URI for
// the brief page. Dismisses cookie consent, hides fixed chat/consent widgets,
// grabs the above-the-fold hero, and optimises it small enough to inline.
//
// Usage: node scripts/brief/capture-home.mjs <homepageUrl> <outFile.datauri>
// Then pass <outFile.datauri> to seed.mjs --shot.
import { chromium } from "playwright";
import sharp from "sharp";
import { writeFileSync } from "node:fs";

const [, , url, out] = process.argv;
if (!url || !out) {
  console.error("Usage: node capture-home.mjs <homepageUrl> <out.datauri>");
  process.exit(1);
}

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
try {
  await p.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await p.waitForTimeout(3500);
  // dismiss cookie consent (privacy: reject where possible)
  for (const rx of [/reject all/i, /reject/i, /decline/i, /only necessary/i]) {
    const btn = p.getByRole("button", { name: rx }).first();
    if (await btn.count().catch(() => 0)) { await btn.click({ timeout: 2500 }).catch(() => {}); break; }
  }
  // hide any remaining fixed chat/consent overlays
  await p.evaluate(() => {
    document.querySelectorAll('[id*="chat" i],[class*="chat" i],[class*="cookie" i],[id*="cookie" i],[class*="consent" i],[class*="livechat" i]').forEach((e) => {
      const s = getComputedStyle(e);
      if (s.position === "fixed" || s.position === "sticky") e.style.display = "none";
    });
  });
  await p.waitForTimeout(800);
  const png = await p.screenshot({ clip: { x: 0, y: 0, width: 1440, height: 780 } });
  const webp = await sharp(png).resize({ width: 920 }).webp({ quality: 62 }).toBuffer();
  writeFileSync(out, "data:image/webp;base64," + webp.toString("base64"));
  console.log(`captured ${url} -> ${out}  (${Math.round(webp.length / 1024)}KB)`);
} catch (e) {
  console.error("ERR", e.message);
  process.exit(1);
} finally {
  await b.close();
}
