"use client";

import { useEffect, useState } from "react";

// The visible email is assembled in the browser so the plain address never
// appears in the server-rendered HTML (basic scraper obfuscation, not security).
// Server render shows a neutral fallback; the client swaps in the real mailto.

export function ContactEmail({ className, fallback = "email us directly" }: { className?: string; fallback?: string }) {
  const [addr, setAddr] = useState<string | null>(null);

  useEffect(() => {
    const user = ["info"].join("");
    const domain = ["commview", "co", "uk"].join(".");
    setAddr(`${user}@${domain}`);
  }, []);

  if (!addr) return <span className={className}>{fallback}</span>;
  return (
    <a className={className} href={`mailto:${addr}`}>
      {addr}
    </a>
  );
}
