"use client";

import { useEffect, useState } from "react";

import { track } from "@/lib/analytics";
import { UNLOCK_FLAG } from "./UnlockGate";

// Shown once, immediately after a visitor unlocks their report (the gate sets a
// session flag before reloading). Invites them to book a call. Dismissable; it
// does not reappear on later visits to the same report.

export const CALENDAR_URL = "https://calendar.app.google/Hx4AQi6bJurZL8jU7";

export function UnlockedModal({ primaryArea }: { primaryArea: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(UNLOCK_FLAG)) {
        sessionStorage.removeItem(UNLOCK_FLAG);
        setOpen(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="dr-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dr-modal-h"
      onClick={() => setOpen(false)}
    >
      <div className="dr-modal__card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="dr-modal__close"
          aria-label="Close"
          onClick={() => setOpen(false)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>

        <p className="dr-modal__eyebrow">Your diagnostic is ready</p>
        <h2 className="dr-modal__h" id="dr-modal-h">
          Discuss your diagnostic with an expert
        </h2>
        <p className="dr-modal__p">
          This is an initial read. The fastest way to pressure-test it is a short call &mdash; we&rsquo;ll
          validate it against your data, customers and team, and agree the first move.
        </p>

        <div className="dr-modal__actions">
          <a
            className="btn btn--cyan btn--lg"
            href={CALENDAR_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("diagnostic_book_call_clicked", { primary_area: primaryArea })}
          >
            Book a call
          </a>
          <button type="button" className="dr-modal__later" onClick={() => setOpen(false)}>
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
