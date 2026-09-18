import { groq } from "next-sanity";

import { client } from "./client";
import { sanityConfigured } from "./env";

// ---------------------------------------------------------------------------
// Every GROQ query in the app lives here. Nothing else imports the client.
// Phase 0 has one job: prove the pipe from Sanity to a rendered page. Phase 1
// adds the post / category / page queries against the real content model.
// ---------------------------------------------------------------------------

export interface SanityHealth {
  connected: boolean;
  projectConfigured: boolean;
  documentCount: number | null;
}

const healthQuery = groq`count(*[!(_id in path("drafts.**"))])`;

// Returns a snapshot of the connection for the Phase 0 proof page.
export async function fetchSanityHealth(): Promise<SanityHealth> {
  if (!sanityConfigured) {
    return { connected: false, projectConfigured: false, documentCount: null };
  }
  try {
    const documentCount = await client.fetch<number>(healthQuery);
    return { connected: true, projectConfigured: true, documentCount };
  } catch {
    return { connected: false, projectConfigured: true, documentCount: null };
  }
}
