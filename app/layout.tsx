import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.commview.co.uk";

// Root layout is deliberately bare: it owns <html>/<body> only. The site's
// design-system CSS is scoped to the (site) route group, so /studio renders
// with its own styling, uncontaminated by the site chrome.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "COMMVIEW", template: "%s — COMMVIEW" },
  description:
    "Operator-led fractional GTM, Growth, Product and Operational AI.",
  // Indexable by default. Gated/private pages (e.g. /diagnostic/result/[id])
  // set their own noindex in their page metadata.
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // British English for search and screen readers. The site is light-themed
  // with dark sections flipping locally via .dark — matching the mocks, which
  // are all data-theme="light".
  return (
    <html lang="en-GB" data-theme="light">
      <body>{children}</body>
    </html>
  );
}
