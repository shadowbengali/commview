import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getSubmission } from "@/lib/diagnostic/store";
import { Report } from "@/components/diagnostic/report/Report";

import "../../../../../styles/diagnostic-result.css";

// /diagnostic/result/[id] — the gated, personalised diagnostic report, rendered
// from the stored submission. The deterministic teaser (summary + journey) is
// always shown; the AI interpretation only exists once the visitor unlocks.
// Always noindex (personal + gated), shareable by link.

export const metadata: Metadata = {
  title: { absolute: "Your Business Diagnostic | CommView" },
  robots: { index: false, follow: false },
};

export default async function DiagnosticResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await getSubmission(id);
  if (!row || !row.spine) notFound();

  return (
    <Report
      spine={row.spine}
      analysis={row.analysis}
      firstName={row.first_name}
      createdAt={row.created_at}
      id={id}
    />
  );
}
