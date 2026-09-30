// Native CommView consent manager — shared constants, types and the pre-GTM
// init script. No external CMP. This module is the single source of truth for
// the cookie name, version and shape, so the inline init script (set before GTM
// loads) and the React UI (components/site/ConsentManager.tsx) always agree.
//
// Google Consent Mode is used in BASIC mode: optional storage defaults to
// denied, so Google tags in the GTM container do not read or write storage
// until the visitor grants the matching category.

export const CONSENT_COOKIE = "commview_consent";

// Bump this when the cookie categories change materially; a stored choice with
// an older version is treated as absent, so consent is requested again.
export const CONSENT_VERSION = 1;

// How long a recorded choice is remembered. Documented in the Cookie Policy.
export const CONSENT_MAX_AGE_DAYS = 182; // ~6 months

export type ConsentCategories = {
  analytics: boolean;
  marketing: boolean;
};

export type ConsentChoice = ConsentCategories & {
  v: number; // consent version the choice was recorded against
  ts: number; // unix ms when the choice was recorded
};

// Inline script injected ahead of the (deferred) GTM tag. It establishes the
// Consent Mode defaults (everything optional denied, necessary storage granted)
// and, for a returning visitor with a valid stored choice, immediately updates
// to that choice — all synchronously, before gtm.js ever runs. Kept tiny and
// dependency-free because it ships in the HTML on every public page.
export function consentInitScript(): string {
  return `(function(){
  window.dataLayer=window.dataLayer||[];
  function gtag(){dataLayer.push(arguments);}
  window.gtag=window.gtag||gtag;
  gtag('consent','default',{
    ad_storage:'denied',
    ad_user_data:'denied',
    ad_personalization:'denied',
    analytics_storage:'denied',
    functionality_storage:'granted',
    security_storage:'granted',
    wait_for_update:500
  });
  try{
    var m=document.cookie.match(/(?:^|; )${CONSENT_COOKIE}=([^;]+)/);
    if(m){
      var c=JSON.parse(decodeURIComponent(m[1]));
      if(c&&c.v===${CONSENT_VERSION}){
        gtag('consent','update',{
          analytics_storage:c.analytics?'granted':'denied',
          ad_storage:c.marketing?'granted':'denied',
          ad_user_data:c.marketing?'granted':'denied',
          ad_personalization:c.marketing?'granted':'denied'
        });
      }
    }
  }catch(e){}
})();`;
}
