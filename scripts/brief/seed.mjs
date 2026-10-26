// Seed or update a prospect brief in Supabase: content (+ optional homepage
// screenshot) and the published flag. Reads credentials from .env.local so the
// confidential content and image never pass through anything but the database.
//
// Usage:
//   node scripts/brief/seed.mjs \
//     --token <40-char token> --company "Trumeter" --contact "Gil Copitch" \
//     --content <path to content.json> [--shot <path to data-uri.txt>] [--publish]
//
// The shot file is a full `data:image/webp;base64,...` URI (see capture-home.mjs).
import fs from "node:fs";

function readEnvLocal() {
  const env = {};
  try {
    for (const line of fs.readFileSync(".env.local", "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch { /* no file */ }
  return env;
}

function arg(name) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

const env = readEnvLocal();
const URL = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const token = arg("token");
const company = arg("company");
const contact = arg("contact") || null;
const contentPath = arg("content");
const shotPath = arg("shot");
const publish = process.argv.includes("--publish");
if (!token || !company || !contentPath) {
  console.error("Required: --token --company --content");
  process.exit(1);
}

const content = JSON.parse(fs.readFileSync(contentPath, "utf8"));
const screenshot = shotPath ? fs.readFileSync(shotPath, "utf8").trim() : undefined;

const row = {
  token,
  company,
  contact_name: contact,
  content,
  ...(screenshot !== undefined ? { screenshot } : {}),
  published: publish,
  updated_at: new Date().toISOString(),
};

const res = await fetch(`${URL}/rest/v1/prospect_pages?on_conflict=token`, {
  method: "POST",
  headers: {
    apikey: KEY,
    Authorization: `Bearer ${KEY}`,
    "Content-Type": "application/json",
    Prefer: "resolution=merge-duplicates,return=representation",
  },
  body: JSON.stringify(row),
});

if (!res.ok) {
  console.error("Seed failed:", res.status, await res.text());
  process.exit(1);
}
const [out] = await res.json();
console.log(
  `OK  ${out.company}  published=${out.published}  shot=${out.screenshot ? Math.round(out.screenshot.length / 1024) + "KB" : "none"}`
);
console.log(`URL: ${(env.NEXT_PUBLIC_SITE_URL || "https://www.commview.co.uk").replace(/\/$/, "")}/brief/${token}`);
