import { NextResponse } from "next/server";

// Contact form delivery. Adapted from PR #10: Resend via REST (no SDK dep),
// honeypot, input sanitisation, and a truthful result — we only report success
// when the mail provider confirms it. The "problem/service" field from PR #10 is
// dropped: the simplified brief has no service picker.

export const runtime = "nodejs";

const TO = process.env.CONTACT_TO_EMAIL || "info@commview.co.uk";
const FROM = process.env.CONTACT_FROM_EMAIL || "Commview website <website@commview.co.uk>";

function clean(value: unknown, max = 4000) {
  return String(value ?? "").replace(/[<>]/g, "").trim().slice(0, max);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Honeypot: bots fill the hidden "website" field. Pretend success, send nothing.
    if (body.website) return NextResponse.json({ ok: true });

    const situation = clean(body.situation);
    const outcome = clean(body.outcome);
    const name = clean(body.name, 120);
    const email = clean(body.email, 200);
    const company = clean(body.company, 200);

    if (!situation || !outcome || !name || !email || !email.includes("@")) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const key = process.env.RESEND_API_KEY;
    if (!key) {
      console.error("Contact form: RESEND_API_KEY is not configured");
      return NextResponse.json({ error: "Mail service unavailable" }, { status: 503 });
    }

    const text = [
      "New enquiry from the Commview contact form", "",
      `Name: ${name}`, `Work email: ${email}`, `Company: ${company || "Not supplied"}`, "",
      "WHAT'S HAPPENING", situation, "",
      "WHAT THEY'D LIKE TO BE DIFFERENT", outcome,
    ].join("\n");

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        reply_to: email,
        subject: `Commview enquiry from ${name}${company ? ` · ${company}` : ""}`,
        text,
      }),
    });

    if (!response.ok) {
      console.error("Contact form: mail provider rejected request", response.status);
      return NextResponse.json({ error: "Could not send" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
