// Thin analytics seam. Pushes events to the GTM dataLayer; Google Consent Mode
// (set up in lib/consent.ts + ConsentManager) governs whether tags actually
// fire, so this never needs its own consent check. Never send free-text answers
// or report content — only the non-sensitive properties passed here.

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export function track(event: string, props: Record<string, string> = {}): void {
  if (typeof window === "undefined") return;
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...props });
  } catch {
    /* analytics must never break the page */
  }
}
