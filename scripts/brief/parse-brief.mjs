// Parse one prospect sheet from the source spreadsheet into a BriefContent JSON.
// The xlsx must be unzipped first (it is a zip of XML):
//   mkdir -p /tmp/xlsx && (cd /tmp/xlsx && unzip -o -q "<xlsx>")
// Then: node scripts/brief/parse-brief.mjs /tmp/xlsx "<Sheet Name>"
// Prints the JSON to stdout. Reusable for all prospect sheets.
import { readFileSync } from "node:fs";
import { join } from "node:path";

const [, , dir, sheetName] = process.argv;
if (!dir || !sheetName) {
  console.error('Usage: node parse-brief.mjs <extracted-xlsx-dir> "<Sheet Name>"');
  process.exit(1);
}

const read = (p) => readFileSync(join(dir, p), "utf8");
const unescape = (s) =>
  s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'");

// shared strings
const strings = [...read("xl/sharedStrings.xml").matchAll(/<si>([\s\S]*?)<\/si>/g)].map((m) =>
  unescape([...m[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((x) => x[1]).join(""))
);

// locate the sheet's file via workbook + rels
const wb = read("xl/workbook.xml");
const sheetId = [...wb.matchAll(/<sheet [^>]*name="([^"]*)"[^>]*r:id="(rId\d+)"/g)].find((m) => m[1] === sheetName);
if (!sheetId) { console.error("Sheet not found:", sheetName); process.exit(1); }
const rels = read("xl/_rels/workbook.xml.rels");
const target = [...rels.matchAll(/<Relationship [^>]*Id="([^"]*)"[^>]*Target="([^"]*)"/g)].find((m) => m[1] === sheetId[2]);
const sheetFile = "xl/" + target[2].replace(/^\//, "").replace(/^xl\//, "");

// parse rows into {A,B,C,D,...} maps keyed by column letter
function rowsOf(file) {
  const xml = read(file);
  return [...xml.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)].map((r) => {
    const row = {};
    for (const c of r[1].matchAll(/<c r="([A-Z]+)\d+"([^>]*)>(?:<v>([^<]*)<\/v>|<is>([\s\S]*?)<\/is>)?<\/c>/g)) {
      const col = c[1], attrs = c[2], v = c[3], is = c[4];
      let val = "";
      if (is !== undefined) val = unescape([...is.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((x) => x[1]).join(""));
      else if (v !== undefined) val = /t="s"/.test(attrs) ? (strings[+v] ?? "") : v;
      if (val !== "") row[col] = val.trim();
    }
    return row;
  });
}

const rows = rowsOf(sheetFile);

// --- meta (top rows, before the "Section | Element | Copy" header) ---
const metaOf = (label) => {
  const r = rows.find((x) => (x.A || "").toLowerCase() === label.toLowerCase());
  return r ? r.B || r.C || "" : "";
};
const company = (rows[0]?.A || sheetName).replace(/:\s*landing page copy.*/i, "").trim();
const preparedForRaw = metaOf("Prepared for");
const preparedFor = /not named/i.test(preparedForRaw) || !preparedForRaw ? null : preparedForRaw;
const website = metaOf("Website");
const disciplines = metaOf("Where we would start").split(",").map((s) => s.trim()).filter(Boolean);

// --- content rows (after the header row) ---
const headerIdx = rows.findIndex((r) => (r.A || "") === "Section" && (r.B || "") === "Element");
const body = rows.slice(headerIdx + 1).filter((r) => r.B); // skip divider rows (only col A)

// index helpers
const find = (section, element) =>
  body.find((r) => r.A === section && (r.B || "").toLowerCase() === element.toLowerCase());
const copy = (section, element) => find(section, element)?.C || "";
const note = (section, element) => find(section, element)?.D || "";
const all = (section) => body.filter((r) => r.A === section);

const DISCS = ["GTM Leadership", "Growth", "Product", "Operational AI"];
const discOf = (s) => DISCS.find((d) => (s || "").trim().toLowerCase() === d.toLowerCase()) || s.trim();

// hero
const hero = {
  privateLabel: copy("Hero", "Top-right label"),
  date: note("Hero", "Top-right label"),
  eyebrow: copy("Hero", "Eyebrow"),
  smallLabel: copy("Hero", "Small label"),
  question: copy("Hero", "Question (main heading)"),
  answerLine: copy("Hero", "Answer line"),
  intro: copy("Hero", "Intro"),
};

// stats
const stats = [];
for (let i = 1; i <= 6; i++) {
  const num = find("Stats band", `Stat ${i}: number`);
  if (!num) break;
  const lab = find("Stats band", `Stat ${i}: label`);
  stats.push({ number: num.C, label: lab?.C || "", ...(lab?.D ? { source: lab.D } : {}) });
}

// insight findings
const findings = [];
for (let i = 1; i <= 8; i++) {
  const tag = find("Insight", `Finding ${i}: discipline tag`);
  if (!tag) break;
  findings.push({
    discipline: discOf(tag.C),
    title: copy("Insight", `Finding ${i}: title`),
    body: copy("Insight", `Finding ${i}: body`),
    ...(copy("Insight", `Finding ${i}: source line`) ? { source: copy("Insight", `Finding ${i}: source line`) } : {}),
  });
}
const insight = { heading: copy("Insight", "Section heading"), intro: copy("Insight", "Intro"), findings };

// chart
let chart;
const barsRow = find("Chart", "Bars");
if (barsRow) {
  const bars = barsRow.C.split(";").map((seg) => {
    const m = seg.trim().match(/^(.*?):\s*([\d,\.]+)\s*(\(highlighted\))?$/i);
    return m ? { label: m[1].trim(), value: Number(m[2].replace(/,/g, "")), ...(m[3] ? { highlight: true } : {}) } : null;
  }).filter(Boolean);
  chart = {
    title: copy("Chart", "Chart title"),
    ...(note("Chart", "Chart title") ? { subtitle: note("Chart", "Chart title") } : {}),
    bars,
    ...(copy("Chart", "Caption") ? { caption: copy("Chart", "Caption") } : {}),
  };
}

// constraint steps
const steps = [];
for (let i = 1; i <= 8; i++) {
  const n = String(i).padStart(2, "0");
  const t = find("Connections", `Step ${n}: title`);
  if (!t) break;
  steps.push({ title: t.C, body: copy("Connections", `Step ${n}: body`) });
}
const constraint = {
  heading: copy("Connections", "Section heading"),
  intro: copy("Connections", "Intro"),
  steps,
  closing: copy("Connections", "Closing line"),
};

// momentum
const serviceTiles = all("90 days")
  .filter((r) => /^Service tile:/i.test(r.B))
  .map((r) => {
    const discipline = discOf(r.B.replace(/^Service tile:\s*/i, ""));
    const later = /not a priority yet/i.test(r.C);
    const body = r.C.replace(/\.?\s*(Where we would start|Not a priority yet)\.?$/i, "").trim();
    return { discipline, body, status: later ? "later" : "start" };
  });
const phases = all("90 days")
  .filter((r) => /·/.test(r.B) && /days/i.test(r.B))
  .map((r) => {
    const [label, name] = r.B.split("·").map((s) => s.trim());
    return { label, name, body: r.C };
  });
const tracks = [];
for (const disc of DISCS) {
  const aim = find("90 days", `${disc}: aim`);
  if (!aim) continue;
  const actions = [];
  for (let i = 1; i <= 8; i++) {
    const a = find("90 days", `${disc}: action ${i}`);
    if (!a) break;
    actions.push(a.C);
  }
  tracks.push({ discipline: disc, aim: aim.C, actions });
}
const momentum = {
  heading: copy("90 days", "Section heading"),
  intro: copy("90 days", "Intro"),
  serviceTiles,
  phases,
  tracks,
};

// impact
const outcomes = [];
for (let i = 1; i <= 8; i++) {
  const t = find("Impact", `Outcome ${i}: title`);
  if (!t) break;
  outcomes.push({ title: t.C, body: copy("Impact", `Outcome ${i}: body`) });
}
const impact = { heading: copy("Impact", "Section heading"), outcomes };

// experience
const results = all("Experience")
  .filter((r) => /^Result \d/i.test(r.B))
  .map((r) => ({ result: r.C, attribution: r.D || "" }));
const experience = {
  heading: copy("Experience", "Section heading"),
  intro: copy("Experience", "Intro"),
  results,
  note: copy("Experience", "Note"),
};

// cta
const cta = {
  heading: copy("Call to action", "Heading"),
  body: copy("Call to action", "Body"),
  button: copy("Call to action", "Button"),
  closing: copy("Call to action", "Closing line"),
  footer: copy("Call to action", "Footer"),
};

// sources + method
const sources = all("Sources")
  .filter((r) => (r.B || "").toLowerCase() === "source")
  .map((r) => ({ label: r.C, ...(r.D && /^https?:/i.test(r.D) ? { url: r.D } : {}) }));
const method = copy("Sources", "Method note");

const content = {
  company,
  preparedFor,
  website,
  disciplines,
  hero,
  stats,
  insight,
  chart,
  constraint,
  momentum,
  impact,
  experience,
  cta,
  sources,
  method,
};

process.stdout.write(JSON.stringify(content, null, 2));
