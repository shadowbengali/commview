import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://commview.co.uk";

// Root layout is deliberately bare: it owns <html>/<body> only. The site's
// design-system CSS is scoped to the (site) route group, so /studio renders
// with its own styling, uncontaminated by the site chrome.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "COMMVIEW", template: "%s — COMMVIEW" },
  description:
    "Operator-led fractional GTM, Growth, Product and Operational AI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // British English, as a document-level signal for search and screen readers.
  return (
    <html lang="en-GB">
      <body>{children}</body>
    </html>
  );
}
