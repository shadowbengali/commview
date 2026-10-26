// Data seam for prospect brief pages. In production, content is read from
// Supabase by token (service-role, server-side only; RLS on with no public
// policies). In local dev — where the Supabase keys are not present — it falls
// back to a gitignored fixture file so the template can be built against real
// content without shipping anything confidential to the repo.

import fs from "node:fs";
import path from "node:path";

import type { BriefContent } from "./types";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TABLE = "prospect_pages";

// Tokens are 40-char base62. Validate strictly: it gates a DB lookup and (in
// dev) a filesystem read, so this also prevents any path traversal.
export function validToken(token: string): boolean {
  return /^[A-Za-z0-9]{20,64}$/.test(token);
}

function supabaseConfigured(): boolean {
  return !!(URL && KEY);
}

interface Row {
  content: BriefContent;
  screenshot: string | null;
}

export interface Brief {
  content: BriefContent;
  screenshot: string | null; // data: URI of the homepage shot, or null
}

/** Fetch a published brief by token, or null if missing/unpublished/invalid. */
export async function getBrief(token: string): Promise<Brief | null> {
  if (!validToken(token)) return null;

  if (supabaseConfigured()) {
    const res = await fetch(
      `${URL}/rest/v1/${TABLE}?token=eq.${encodeURIComponent(token)}&published=eq.true&select=content,screenshot&limit=1`,
      {
        headers: { apikey: KEY as string, Authorization: `Bearer ${KEY}` },
        cache: "no-store",
      }
    );
    if (!res.ok) return null;
    const rows = (await res.json()) as Row[];
    const row = rows[0];
    return row ? { content: row.content, screenshot: row.screenshot ?? null } : null;
  }

  // Dev fallback: gitignored fixture (never used in production). The fixture may
  // carry the shot inline as `_screenshot` so the hero can be built locally.
  if (process.env.NODE_ENV !== "production") {
    try {
      const file = path.join(process.cwd(), "content", "brief-fixtures", `${token}.json`);
      const parsed = JSON.parse(fs.readFileSync(file, "utf8")) as BriefContent & { _screenshot?: string };
      const { _screenshot, ...content } = parsed;
      return { content: content as BriefContent, screenshot: _screenshot ?? null };
    } catch {
      return null;
    }
  }

  return null;
}

/** Record a first-party engagement event (best-effort; never throws). */
export async function logBriefEvent(
  token: string,
  type: "open" | "scroll" | "cta",
  opts: { scrollPct?: number; referrer?: string } = {}
): Promise<void> {
  if (!validToken(token) || !supabaseConfigured()) return;
  try {
    await fetch(`${URL}/rest/v1/prospect_events`, {
      method: "POST",
      headers: {
        apikey: KEY as string,
        Authorization: `Bearer ${KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        token,
        type,
        scroll_pct: opts.scrollPct ?? null,
        referrer: opts.referrer ?? null,
      }),
    });
  } catch {
    /* swallow: analytics must never break the page */
  }
}
