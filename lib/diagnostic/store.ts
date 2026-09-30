// Supabase data seam for the diagnostic. Server-only, REST over fetch with the
// service-role key (no vendor SDK, per repo convention). RLS is on with no public
// policies, so the anon key can't reach the table.
//
// Lifecycle: a row is created at completion (anonymous) with the deterministic
// spine; the AI analysis and the lead's details are attached on unlock.

import type { Answer } from "./types";
import type { Spine } from "./spine";
import type { Analysis } from "./ai";

export interface CreateInput {
  answers: Record<string, Answer>;
  evidence: string[];
  readingId: string;
  weakLink: string;
  freeText?: string;
  spine: Spine;
  primaryArea: string;
  evidenceStrength: string;
  journeyType: string;
}

export interface UnlockInput {
  firstName?: string;
  email?: string;
  phone?: string;
  company?: string;
  marketingConsent: boolean;
}

export interface SubmissionRow {
  id: string;
  created_at: string;
  answers: Record<string, Answer>;
  evidence: string[];
  reading: string;
  weak_link: string;
  free_text: string | null;
  first_name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  marketing_consent: boolean;
  spine: Spine | null;
  analysis: Analysis | null;
  analysis_version: number | null;
  primary_area: string | null;
  evidence_strength: string | null;
  journey_type: string | null;
  unlocked_at: string | null;
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

/** Create an anonymous submission at completion; returns the new id. */
export async function createSubmission(input: CreateInput): Promise<string> {
  if (!storeConfigured()) throw new Error("Supabase not configured");
  const res = await fetch(`${URL}/rest/v1/${TABLE}`, {
    method: "POST",
    headers: headers({ Prefer: "return=representation" }),
    body: JSON.stringify({
      answers: input.answers,
      evidence: input.evidence,
      reading: input.readingId,
      weak_link: input.weakLink,
      free_text: input.freeText ?? null,
      spine: input.spine,
      primary_area: input.primaryArea,
      evidence_strength: input.evidenceStrength,
      journey_type: input.journeyType,
      marketing_consent: false,
    }),
  });
  if (!res.ok) throw new Error(`Supabase insert failed: ${res.status} ${await res.text()}`);
  const rows = (await res.json()) as SubmissionRow[];
  return rows[0].id;
}

/** Attach the lead's details on unlock. */
export async function unlockSubmission(id: string, input: UnlockInput): Promise<void> {
  if (!storeConfigured()) throw new Error("Supabase not configured");
  const res = await fetch(`${URL}/rest/v1/${TABLE}?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: headers({ Prefer: "return=minimal" }),
    body: JSON.stringify({
      first_name: input.firstName ?? null,
      email: input.email ?? null,
      phone: input.phone ?? null,
      company: input.company ?? null,
      marketing_consent: input.marketingConsent,
      unlocked_at: new Date().toISOString(),
    }),
  });
  if (!res.ok) throw new Error(`Supabase unlock failed: ${res.status} ${await res.text()}`);
}

/** Cache the generated AI analysis against a row. */
export async function saveAnalysis(id: string, analysis: Analysis, version: number): Promise<void> {
  if (!storeConfigured()) return;
  await fetch(`${URL}/rest/v1/${TABLE}?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: headers({ Prefer: "return=minimal" }),
    body: JSON.stringify({ analysis, analysis_version: version }),
  });
}

/** Fetch one submission (for the result page and the unlock route). */
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
