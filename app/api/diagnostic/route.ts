import { NextResponse } from "next/server";

import { buildSpine } from "@/lib/diagnostic/spine";
import type { RunState } from "@/lib/diagnostic/types";
import { createSubmission, storeConfigured } from "@/lib/diagnostic/store";

// POST /api/diagnostic — diagnostic completion.
// The client sends the full run (path + answers). We recompute the deterministic
// spine server-side (never trust the client for it), store an anonymous
// submission, and return its id. The report page shows the free teaser from the
// spine; the AI analysis and the lead's details are attached later, on unlock.

export const runtime = "nodejs";
export const maxDuration = 20;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const state: RunState = {
      path: Array.isArray(body?.state?.path) ? body.state.path : [],
      answers:
        body?.state?.answers && typeof body.state.answers === "object" ? body.state.answers : {},
    };
    if (!state.path.length) {
      return NextResponse.json({ error: "Empty diagnostic" }, { status: 400 });
    }

    if (!storeConfigured()) {
      return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
    }

    const spine = buildSpine(state);
    const freeText = String(state.answers.problem_open?.text ?? "")
      .replace(/[<>]/g, "")
      .trim()
      .slice(0, 2000);

    const id = await createSubmission({
      answers: state.answers,
      evidence: spine.evidence,
      readingId: spine.readingId,
      weakLink: spine.weakLink,
      freeText: freeText || undefined,
      spine,
      primaryArea: spine.primaryArea,
      evidenceStrength: spine.evidenceStrength,
      journeyType: spine.journey.type,
    });

    return NextResponse.json({ id });
  } catch (e) {
    console.error("Diagnostic completion failed", e);
    return NextResponse.json({ error: "Could not save" }, { status: 500 });
  }
}
