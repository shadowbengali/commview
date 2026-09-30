import { NextResponse } from "next/server";

import { buildResult } from "@/lib/diagnostic/engine";
import type { RunState } from "@/lib/diagnostic/types";
import { insertSubmission, saveAi, storeConfigured } from "@/lib/diagnostic/store";
import { generateDiagnostic } from "@/lib/diagnostic/ai";
import { crm } from "@/lib/crm";

// POST /api/diagnostic — gated diagnostic submission.
// The client sends the full run (path + answers) plus the lead fields. We
// recompute the reading server-side (never trust the client for it), store the
// submission in Supabase, generate the tailored ChatGPT output, cache it on the
// row, upsert the lead to HubSpot, and return the id for the result page.

export const runtime = "nodejs";
export const maxDuration = 30;

function clean(v: unknown, max = 300) {
  return String(v ?? "").replace(/[<>]/g, "").trim().slice(0, max);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // honeypot
    if (body.website) return NextResponse.json({ ok: true });

    const state: RunState = {
      path: Array.isArray(body?.state?.path) ? body.state.path : [],
      answers: body?.state?.answers && typeof body.state.answers === "object" ? body.state.answers : {},
    };
    if (!state.path.length) {
      return NextResponse.json({ error: "Empty diagnostic" }, { status: 400 });
    }

    const email = clean(body.email, 200);
    const firstName = clean(body.firstName, 120);
    const company = clean(body.company, 200);
    const marketingConsent = !!body.consent;

    if (!email || !email.includes("@") || !firstName) {
      return NextResponse.json({ error: "Missing name or email" }, { status: 400 });
    }

    if (!storeConfigured()) {
      return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
    }

    // Recompute the deterministic reading + evidence from the answers.
    const { reading, evidence } = buildResult(state);
    const freeText = clean(state.answers.problem_open?.text, 2000) || undefined;

    // 1. store the submission
    const id = await insertSubmission({
      answers: state.answers,
      evidence,
      reading,
      freeText,
      firstName,
      email,
      company,
      marketingConsent,
    });

    // 2. generate the tailored output and cache it on the row
    const ai = await generateDiagnostic({ reading, evidence, freeText });
    await saveAi(id, ai);

    // 3. upsert the lead to HubSpot (best-effort; a missing custom property must
    //    not break the result flow).
    let hubspotBase = "skipped";
    let hubspotTag = "skipped";
    if (process.env.HUBSPOT_PRIVATE_APP_TOKEN) {
      // 1. Create/update the contact with standard fields only — these always
      //    exist in HubSpot, so the contact always lands.
      try {
        await crm.identify({ email, firstName, company: company || undefined });
        hubspotBase = "ok";
      } catch (e) {
        hubspotBase = "error: " + String(e).slice(0, 220);
        console.error("Diagnostic: HubSpot contact create failed", e);
      }
      // 2. Best-effort tagging with the diagnostic properties. If these custom
      //    properties are not created in HubSpot, this fails without losing the
      //    contact above.
      try {
        // Consent is stored in Supabase (marketing_consent); no HubSpot
        // `subscribed` property needed here.
        void marketingConsent;
        await crm.identify({
          email,
          properties: {
            diagnostic_reading: reading.headline,
            diagnostic_weak_link: reading.weakLink,
            lead_source: "diagnostic",
          },
        });
        hubspotTag = "ok";
      } catch (e) {
        hubspotTag = "error: " + String(e).slice(0, 220);
        console.error("Diagnostic: HubSpot tagging failed", e);
      }
    } else {
      hubspotBase = "no HUBSPOT_PRIVATE_APP_TOKEN";
    }

    return NextResponse.json({ id, _hubspot: { base: hubspotBase, tag: hubspotTag } });
  } catch (e) {
    console.error("Diagnostic submission failed", e);
    return NextResponse.json({ error: "Could not submit" }, { status: 500 });
  }
}
