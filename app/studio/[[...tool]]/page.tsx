import { NextStudio } from "next-sanity/studio";

import config from "@/sanity.config";

// The embedded Sanity Studio. next-sanity's exported metadata sets the
// noindex robots tag, so /studio never reaches search.
export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
