import type { Metadata } from "next";

import "../../../styles/pillar.css";
import PillarPage, { pageMetadata } from "../../../components/pillar/PillarPage";
import type { Page } from "../../../lib/content/types";
import content from "../../../content/product-strategy.json";

// /product-strategy — Product pillar page. Content in content/product-strategy.json
// (owned by the content pipeline); layout is the shared pillar renderer.

const page = content as unknown as Page;

export const metadata: Metadata = pageMetadata(page);

export default function ProductStrategyPage() {
  return <PillarPage page={page} />;
}
