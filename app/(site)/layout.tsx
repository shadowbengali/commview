// Self-hosted Inter, the weights the type scale uses (400/500/600/700/800).
// Self-hosting removes the render-blocking Google Fonts request and the GDPR
// argument — and means verification cannot silently pass on a fallback face.
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";

// Design system, in load order: tokens → components → chrome.
import "../../styles/tokens.css";
import "../../styles/components.css";
import "../../styles/chrome.css";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Header and footer are ported in Phase 1; the group layout is the seam.
  return <>{children}</>;
}
