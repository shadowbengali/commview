// Seed or update a prospect brief in Supabase: content + the published flag,
// plus an optional homepage screenshot uploaded to Vercel Blob, so the database
// row holds a short CDN URL rather than an inlined image. Credentials come from
// .env.local (never committed): the Supabase service key for the row, and
// BLOB_READ_WRITE_TOKEN for the image upload.
//
// Usage:
//   node scripts/brief/seed.mjs \
//     --token <40-char token> --company "Trumeter" --contact "Gil Copitch" \
//     --content <path to content.json> [--shot <path to .webp>] [--publish]
//
//   --shot <file.webp>   webp from capture-home.mjs, uploaded here to Blob
//   --shot-url <url>     reuse an existing Blob URL instead of uploading
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
const shotUrl = arg("shot-url");
const publish = process.argv.includes("--publish");
if (!token || !company || !contentPath) {
  console.error("Required: --token --company --content");
  process.exit(1);
}

const content = JSON.parse(fs.readFileSync(contentPath, "utf8"));

// Resolve the screenshot to a public URL. --shot uploads a local .webp to
// Vercel Blob (the row then stores a short CDN URL, not an inlined data URI);
// --shot-url reuses an existing blob URL unchanged. A generic blob path plus a
// random suffix keeps the URL unguessable and free of the brief token.
let screenshot;
if (shotUrl) {
  screenshot = shotUrl;
} else if (shotPath) {
  const blobToken = env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN;
  if (!blobToken) {
    console.error("Missing BLOB_READ_WRITE_TOKEN in .env.local (needed to upload --shot)");
    process.exit(1);
  }
  const bytes = fs.readFileSync(shotPath);
  const { put } = await import("@vercel/blob");
  const blob = await put("brief/home.webp", bytes, {
    access: "public",
    contentType: "image/webp",
    addRandomSuffix: true,
    token: blobToken,
  });
  screenshot = blob.url;
  console.log(`uploaded shot -> ${screenshot}  (${Math.round(bytes.length / 1024)}KB)`);
}

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
console.log(`OK  ${out.company}  published=${out.published}  shot=${out.screenshot || "none"}`);
console.log(`URL: ${(env.NEXT_PUBLIC_SITE_URL || "https://www.commview.co.uk").replace(/\/$/, "")}/brief/${token}`);
