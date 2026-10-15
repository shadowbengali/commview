"use client";

import { useState } from "react";

// Small outlined "Copy" button. Copies the given text and briefly confirms.
// aria-live announces the change to assistive tech; the label itself flips.
export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for older browsers / insecure contexts.
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch { /* give up quietly */ }
      ta.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      type="button"
      className="copy-btn"
      data-copied={copied ? "" : undefined}
      aria-live="polite"
      onClick={copy}
    >
      {copied ? "Copied" : label}
    </button>
  );
}
