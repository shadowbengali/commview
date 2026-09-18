"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";

import { apiVersion, dataset, projectId } from "./lib/sanity/env";
import { schemaTypes } from "./sanity/schemas";

// The embedded Studio config, mounted at /studio. Editors log in on the live
// domain — no second deploy, no CORS dance.
export default defineConfig({
  name: "commview",
  title: "COMMVIEW",
  basePath: "/studio",
  projectId: projectId || "placeholder",
  dataset,
  schema: { types: schemaTypes },
  plugins: [structureTool(), visionTool({ defaultApiVersion: apiVersion })],
});
