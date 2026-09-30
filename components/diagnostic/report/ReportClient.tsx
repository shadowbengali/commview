"use client";

import { useEffect } from "react";

import { track } from "@/lib/analytics";

// Small client helpers for the (server-rendered) report page: a view tracker, a
// tracked CTA link, and the PDF (print) button.

export function ViewTracker({
  primaryArea,
  evidenceStrength,
  journeyType,
  unlocked,
}: {
  primaryArea: string;
  evidenceStrength: string;
  journeyType: string;
  unlocked: boolean;
}) {
  useEffect(() => {
    track("diagnostic_results_viewed", {
      primary_area: primaryArea,
      evidence_strength: evidenceStrength,
      journey_type: journeyType,
      unlocked: String(unlocked),
    });
  }, [primaryArea, evidenceStrength, journeyType, unlocked]);
  return null;
}

export function TrackedLink({
  href,
  event,
  props,
  className,
  children,
}: {
  href: string;
  event: string;
  props?: Record<string, string>;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a href={href} className={className} onClick={() => track(event, props)}>
      {children}
    </a>
  );
}

export function PrintButton({
  className,
  primaryArea,
  children,
}: {
  className?: string;
  primaryArea: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        track("diagnostic_pdf_exported", { primary_area: primaryArea });
        window.print();
      }}
    >
      {children}
    </button>
  );
}
