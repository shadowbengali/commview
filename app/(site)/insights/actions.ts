"use server";

import { redirect } from "next/navigation";

import { crm } from "@/lib/crm";

// Newsletter subscribe. Goes through the CRM seam only; with no HubSpot token
// set it runs as a safe no-op, so the form works end to end before the CRM is
// live. Redirects back with a flag the page reads to show confirmation.
export async function subscribe(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  if (email) {
    await crm.subscribe(email, "blog-index");
  }
  redirect("/insights?subscribed=1");
}
