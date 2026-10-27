import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getBrief } from "@/lib/brief/store";
import { BriefDossier } from "@/components/brief/BriefDossier";

import "../../../../styles/brief-dossier.css";

// /brief/[token] — a personalised, confidential CommView analysis for one
// prospect. Served from an unguessable token (Supabase in prod, gitignored
// fixture in dev). Always noindex, never in the sitemap, robots-disallowed.
// Unknown/invalid/unpublished token -> 404.

export const dynamic = "force-dynamic"; // per-token, never statically cached

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  const { token } = await params;
  const brief = await getBrief(token);
  if (!brief) return { title: { absolute: "Not found" }, robots: { index: false, follow: false } };
  const { content } = brief;

  // Personalised share preview; page itself stays noindex.
  return {
    title: { absolute: `A CommView analysis of ${content.company}` },
    description: content.hero.answerLine,
    robots: { index: false, follow: false, nocache: true },
    openGraph: {
      type: "website",
      title: `${content.company}: ${content.hero.question}`,
      description: content.hero.answerLine,
      images: ["/og-commview.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${content.company}: ${content.hero.question}`,
      description: content.hero.answerLine,
    },
  };
}

export default async function BriefRoute({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const brief = await getBrief(token);
  if (!brief) notFound();

  return <BriefDossier content={brief.content} screenshot={brief.screenshot} token={token} />;
}
