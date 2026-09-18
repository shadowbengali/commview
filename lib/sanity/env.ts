// Single source of truth for Sanity connection config.
// Kept deliberately non-throwing so the app boots before a project exists
// (Phase 0). `sanityConfigured` lets callers degrade gracefully until then.

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";

export const sanityConfigured = projectId.length > 0;

export const readToken = process.env.SANITY_API_READ_TOKEN || "";
