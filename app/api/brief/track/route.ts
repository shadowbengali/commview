import { NextResponse } from "next/server";

import { logBriefEvent, validToken } from "@/lib/brief/store";

// POST /api/brief/track — record a first-party engagement event for a brief
// page (open / scroll / cta). Best-effort; no-op when Supabase isn't
// configured (e.g. local dev). Never returns anything useful to the caller.

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const token = String(body.token ?? "");
    if (!validToken(token)) return NextResponse.json({ ok: true });

    const type = body.type === "scroll" || body.type === "cta" ? body.type : "open";
    const scrollPct =
      typeof body.scrollPct === "number" ? Math.max(0, Math.min(100, Math.round(body.scrollPct))) : undefined;
    const referrer = typeof body.referrer === "string" ? body.referrer.slice(0, 300) : undefined;

    await logBriefEvent(token, type, { scrollPct, referrer });
  } catch {
    /* ignore */
  }
  return NextResponse.json({ ok: true });
}
