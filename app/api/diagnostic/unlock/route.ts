import { NextResponse } from "next/server";

import { generateAnalysis, ANALYSIS_VERSION } from "@/lib/diagnostic/ai";
import { getSubmission, saveAnalysis, unlockSubmission, storeConfigured } from "@/lib/diagnostic/store";
import { crm } from "@/lib/crm";

// POST /api/diagnostic/unlock — unlock the full report.
// The visitor submits their details against a completed (anonymous) submission.
// We attach the details, generate the tailored analysis from the stored spine,
// cache it on the row, and upsert the lead to HubSpot. The client then reloads
// the report page, which server-renders the full, unlocked view.

export const runtime = "nodejs";
export const maxDuration = 30;

function clean(v: unknown, max = 200) {
  return String(v ?? "").replace(/[<>]/g, "").trim().slice(0, max);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // honeypot
    if (body.website) return NextResponse.json({ ok: true });

    const id = clean(body.id, 64);
    const email = clean(body.email, 200);
    const firstName = clean(body.firstName, 120);
    const phone = clean(body.phone, 40);
    const company = clean(body.company, 200);
    const marketingConsent = !!body.consent;

    if (!id || !email || !email.includes("@") || !firstName || !phone) {
      return NextResponse.json({ error: "Missing name, email or phone" }, { status: 400 });
    }
    if (!storeConfigured()) {
      return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
    }

    const row = await getSubmission(id);
    if (!row || !row.spine) {
      return NextResponse.json({ error: "Diagnostic not found" }, { status: 404 });
    }

    // Attach the lead's details.
    await unlockSubmission(id, { firstName, email, phone, company, marketingConsent });

    // Generate the tailored analysis from the stored spine (idempotent: if it was
    // already generated, keep it rather than paying for a second call).
    if (!row.analysis) {
      const analysis = await generateAnalysis(row.spine, row.free_text ?? undefined);
      await saveAnalysis(id, analysis, ANALYSIS_VERSION);
    }

    // Upsert the lead to HubSpot (best-effort; never block the unlock).
    if (process.env.HUBSPOT_PRIVATE_APP_TOKEN) {
      try {
        await crm.identify({
          email,
          firstName,
          company: company || undefined,
          properties: { phone },
        });
      } catch (e) {
        console.error("Diagnostic unlock: HubSpot contact upsert failed", e);
      }
      try {
        await crm.identify({
          email,
          properties: {
            diagnostic_reading: row.spine.headline,
            diagnostic_weak_link: row.spine.weakLink,
          },
        });
      } catch (e) {
        console.error("Diagnostic unlock: HubSpot tagging failed", e);
      }
      try {
        await crm.setLeadSource(email, "diagnostic");
      } catch (e) {
        console.error("Diagnostic unlock: HubSpot lead source stamp failed", e);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Diagnostic unlock failed", e);
    return NextResponse.json({ error: "Could not unlock" }, { status: 500 });
  }
}
