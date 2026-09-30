// Supabase data seam for the diagnostic. Server-only. Uses the REST API over
// fetch with the service-role key (no vendor SDK, per repo convention). All
// access is server-side; RLS on the table has no public policies so the anon
// key can't reach it.

import type { Answer, Reading } from "./types";

export interface AiOutput {
  narrative: string[];
  moves: { horizon: string; title: string; detail: string }[];
  insights: { slug: string; title: string }[];
  debug?: string; // temporary: why AI fell back (removed once confirmed working)
}

export interface SubmissionInput {
  answers: Record<string, Answer>;
  evidence: string[];
  reading: Reading;
  freeText?: string;
  firstName?: string;
  email?: string;
  company?: string;
  marketingConsent: boolean;
}

export interface SubmissionRow {
  id: string;
  created_at: string;
  answers: Record<string, Answer>;
  evidence: string[];
  reading: string; // reading id
  weak_link: string;
  free_text: string | null;
  first_name: string | null;
  email: string | null;
  company: string | null;
  marketing_consent: boolean;
  ai: AiOutput | null;
}

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TABLE = "diagnostic_submissions";

export function storeConfigured(): boolean {
  return !!(URL && KEY);
}

function headers(extra: Record<string, string> = {}) {
  return {
    apikey: KEY as string,
    Authorization: `Bearer ${KEY}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

/** Insert a submission and return its new id. */
export async function insertSubmission(input: SubmissionInput): Promise<string> {
  if (!storeConfigured()) throw new Error("Supabase not configured");
  const res = await fetch(`${URL}/rest/v1/${TABLE}`, {
    method: "POST",
    headers: headers({ Prefer: "return=representation" }),
    body: JSON.stringify({
      answers: input.answers,
      evidence: input.evidence,
      reading: input.reading.id,
      weak_link: input.reading.weakLink,
      free_text: input.freeText ?? null,
      first_name: input.firstName ?? null,
      email: input.email ?? null,
      company: input.company ?? null,
      marketing_consent: input.marketingConsent,
    }),
  });
  if (!res.ok) throw new Error(`Supabase insert failed: ${res.status} ${await res.text()}`);
  const rows = (await res.json()) as SubmissionRow[];
  return rows[0].id;
}

/** Cache the generated AI output against a row. */
export async function saveAi(id: string, ai: AiOutput): Promise<void> {
  if (!storeConfigured()) return;
  await fetch(`${URL}/rest/v1/${TABLE}?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: headers({ Prefer: "return=minimal" }),
    body: JSON.stringify({ ai }),
  });
}

/** Fetch one submission (for the result page). */
export async function getSubmission(id: string): Promise<SubmissionRow | null> {
  if (!storeConfigured()) return null;
  const res = await fetch(
    `${URL}/rest/v1/${TABLE}?id=eq.${encodeURIComponent(id)}&select=*&limit=1`,
    { headers: headers(), cache: "no-store" }
  );
  if (!res.ok) return null;
  const rows = (await res.json()) as SubmissionRow[];
  return rows[0] ?? null;
}
