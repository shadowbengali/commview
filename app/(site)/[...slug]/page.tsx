import type { Metadata } from "next";
import { notFound } from "next/navigation";

import "../../../styles/pillar.css";
import PillarPage, { pageMetadata } from "../../../components/pillar/PillarPage";
import { allPages, pageBySlug } from "../../../lib/content/pages";

// Catch-all for every content-driven page (pillars + nested service pages).
// Any content/<slug>.json renders at its slug path — flat or nested — with no
// per-page route. Bespoke routes (/, /what-we-do, /fractional-cmo, /insights)
// take precedence and are not in this set.
export const dynamicParams = false;

export function generateStaticParams() {
  return allPages().map((p) => ({ slug: p.slug.split("/") }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = pageBySlug(slug.join("/"));
  return page ? pageMetadata(page) : {};
}

export default async function ContentPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const page = pageBySlug(slug.join("/"));
  if (!page) notFound();
  return <PillarPage page={page} />;
}
