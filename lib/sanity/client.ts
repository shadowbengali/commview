import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "./env";

// The one Sanity client for the whole app. Nothing outside lib/sanity/
// imports this — pages and components call the typed helpers in queries.ts.
export const client = createClient({
  projectId: projectId || "placeholder",
  dataset,
  apiVersion,
  // Content is served from the CDN in production; drafts bypass it via a token.
  useCdn: true,
});
