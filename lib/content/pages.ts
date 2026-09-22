// Server-only registry of pillar/service content pages. Reads content/*.json at
// build time so the catch-all route can render any page from its slug — no
// hand-written route per page. slug may be nested (e.g. "product-strategy/consulting").
import fs from "node:fs";
import path from "node:path";
import type { Page } from "./types";

const DIR = path.join(process.cwd(), "content");

export function allPages(): Page[] {
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".json") && f !== "page.schema.json")
    .map((f) => JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8")) as Page);
}

export function pageBySlug(slug: string): Page | undefined {
  return allPages().find((p) => p.slug === slug);
}
