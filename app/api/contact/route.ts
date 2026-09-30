import { NextResponse } from "next/server";

import { crm } from "@/lib/crm";

// Contact form delivery. Resend via REST (no SDK dep), honeypot, input
// sanitisation, and a truthful result — we only report success when the mail
// provider confirms it. Every enquiry is also captured in HubSpot (best-effort,
// via the CRM seam) so follow-up can be triggered/tracked, not just sat in an
// inbox. Phone is required; an optional pillar picker feeds a HubSpot property.

export const runtime = "nodejs";

const TO = process.env.CONTACT_TO_EMAIL || "info@commview.co.uk";
const FROM = process.env.CONTACT_FROM_EMAIL || "CommView website <website@commview.co.uk>";

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
    const phone = clean(body.phone, 40);
    const company = clean(body.company, 200);
    const area = clean(body.area, 60);

    if (!situation || !outcome || !name || !email || !email.includes("@") || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // The enquiry succeeds if it lands in EITHER channel — HubSpot (the CRM of
    // record) or email — and only fails if both are unavailable. So a missing
    // mail key never loses a lead.
    let captured = false;
    let emailed = false;
    const key = process.env.RESEND_API_KEY;

    const text = [
      "New enquiry from the CommView contact form", "",
      `Name: ${name}`, `Work email: ${email}`, `Phone: ${phone}`,
      `Company: ${company || "Not supplied"}`, `Area: ${area || "Not specified"}`, "",
      "WHAT'S HAPPENING", situation, "",
      "WHAT THEY'D LIKE TO BE DIFFERENT", outcome,
    ].join("\n");

    // Capture the lead in HubSpot before sending, so it lands even if the mail
    // provider is down. Best-effort: a CRM hiccup must never break the enquiry.
    if (process.env.HUBSPOT_PRIVATE_APP_TOKEN) {
      // Standard fields first, so the contact always lands.
      try {
        await crm.identify({
          email,
          firstName: name,
          company: company || undefined,
          properties: { phone },
        });
        captured = true;
      } catch (e) {
        console.error("Contact: HubSpot contact upsert failed", e);
      }
      // Lead source: last-touch + first-touch, isolated so it can't drop the
      // base contact above.
      try {
        await crm.setLeadSource(email, "contact");
      } catch (e) {
        console.error("Contact: HubSpot lead source stamp failed", e);
      }
      // Optional pillar interest is a custom property; tag it separately so a
      // missing property never drops the contact above.
      if (area) {
        try {
          await crm.identify({ email, properties: { pillar_interest: area } });
        } catch (e) {
          console.error("Contact: HubSpot pillar tagging failed", e);
        }
      }
    }

    // Email notification — best-effort. Only attempted when a mail key is set.
    if (key) {
      try {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: FROM,
            to: [TO],
            reply_to: email,
            subject: `CommView enquiry from ${name}${company ? ` · ${company}` : ""}`,
            text,
          }),
        });
        if (response.ok) emailed = true;
        else console.error("Contact form: mail provider rejected request", response.status);
      } catch (e) {
        console.error("Contact form: mail send failed", e);
      }
    }

    // Fail only if the enquiry reached neither channel.
    if (!captured && !emailed) {
      console.error("Contact form: neither HubSpot nor email delivered the enquiry");
      return NextResponse.json({ error: "Could not send" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
