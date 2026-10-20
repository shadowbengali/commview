"use client";

import { useEffect } from "react";

// First-party engagement tracking for a brief page: one "open" event, scroll
// depth at 25/50/75/100%, and CTA clicks. Sends small beacons to
// /api/brief/track. Best-effort and privacy-light (no third-party cookies, no
// PII beyond the token the prospect was given).
export function BriefTracker({ token }: { token: string }) {
  useEffect(() => {
    const send = (type: "open" | "scroll" | "cta", extra: Record<string, unknown> = {}) => {
      const body = JSON.stringify({ token, type, referrer: document.referrer || undefined, ...extra });
      try {
        if (navigator.sendBeacon) {
          navigator.sendBeacon("/api/brief/track", new Blob([body], { type: "application/json" }));
        } else {
          fetch("/api/brief/track", { method: "POST", body, keepalive: true, headers: { "Content-Type": "application/json" } });
        }
      } catch {
        /* ignore */
      }
    };

    send("open");

    const thresholds = [25, 50, 75, 100];
    const fired = new Set<number>();
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      if (max <= 0) return;
      const pct = Math.min(100, Math.round((doc.scrollTop / max) * 100));
      for (const t of thresholds) {
        if (pct >= t && !fired.has(t)) {
          fired.add(t);
          send("scroll", { scrollPct: t });
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement)?.closest("[data-cta]");
      if (el) send("cta", { place: el.getAttribute("data-cta") || "unknown" });
    };
    document.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick);
    };
  }, [token]);

  return null;
}
