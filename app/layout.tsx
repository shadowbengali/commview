import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://commview-green.vercel.app";

// Root layout is deliberately bare: it owns <html>/<body> only. The site's
// design-system CSS is scoped to the (site) route group, so /studio renders
// with its own styling, uncontaminated by the site chrome.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "COMMVIEW", template: "%s — COMMVIEW" },
  description:
    "Operator-led fractional GTM, Growth, Product and Operational AI.",
  // TEMPORARY — pre-launch: keep the whole site out of every index until the
  // content is live. Remove this block to allow indexing.
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
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
