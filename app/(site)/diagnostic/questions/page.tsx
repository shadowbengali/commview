import type { Metadata } from "next";

import { Runner } from "@/components/diagnostic/Runner";

import "../../../../styles/diagnostic.css";

// /diagnostic/questions — the text version of the Business Diagnostic. Standard
// site chrome (header/footer from the (site) layout). The runner is a client
// component; routing, evidence and the reading are computed client-side, so the
// free result is instant and needs no server round-trip.

export const metadata: Metadata = {
  title: { absolute: "Business Diagnostic | Commview" },
  description:
    "Work through the Commview Business Diagnostic. Your answers determine what we ask next, and you get an initial read on where the real constraint sits.",
  alternates: { canonical: "/diagnostic/questions" },
};

export default function DiagnosticQuestionsPage() {
  return (
    <main id="main">
      <Runner />
    </main>
  );
}
