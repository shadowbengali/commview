// Self-hosted Inter as ONE variable woff2 (weights 100-900) instead of five
// static weight files: ~48KB and a single request instead of ~120KB across
// five. Self-hosting keeps the render-blocking Google Fonts request and the
// GDPR argument out, and family stays "Inter" so nothing downstream changes.
// The woff2 is preloaded in the head below for a faster LCP.
import "../../styles/fonts.css";

// Design system, in load order: tokens → components → chrome.
import "../../styles/tokens.css";
import "../../styles/components.css";
import "../../styles/chrome.css";

import Script from "next/script";

import { LogoSprite } from "@/components/site/LogoSprite";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

// Google Tag Manager container, scoped to the public site only. Living in the
// (site) layout (not the root) deliberately keeps GTM off /studio, so logged-in
// editors managing content are not tracked. Override/disable per environment
// with NEXT_PUBLIC_GTM_ID.
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-KBH5CRD2";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Preload the variable Inter file so the hero text paints without waiting
          on CSS discovery — the single biggest LCP lever on these text pages. */}
      <link
        rel="preload"
        href="/fonts/inter-variable-latin.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      {GTM_ID && (
        // GTM <noscript> fallback — rendered first so it sits as high in the
        // document body as possible on public pages.
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
      )}
      {GTM_ID && (
        // lazyOnload defers GTM until the browser is idle after load, keeping
        // its third-party main-thread work off the critical path (better mobile
        // TBT). Tags still fire; they just do not compete with hydration.
        <Script id="gtm-base" strategy="lazyOnload">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      )}
      <LogoSprite />
      <a className="skip" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
