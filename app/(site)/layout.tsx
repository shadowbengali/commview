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
        // afterInteractive is GTM's recommended next/script strategy — it
        // injects the loader into <head> once hydration begins.
        <Script id="gtm-base" strategy="afterInteractive">
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
