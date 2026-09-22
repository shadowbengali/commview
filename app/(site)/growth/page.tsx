import type { Metadata } from "next";

import "../../../styles/pillar.css";
import PillarPage, { pageMetadata } from "../../../components/pillar/PillarPage";
import type { Page } from "../../../lib/content/types";
import growth from "../../../content/growth.json";

// /growth — Growth pillar page. Content lives in content/growth.json (owned by
// the content pipeline); layout is the shared pillar renderer. Reference
// implementation for the content contract.

const page = growth as unknown as Page;

export const metadata: Metadata = pageMetadata(page);

export default function GrowthPage() {
  return <PillarPage page={page} />;
}
