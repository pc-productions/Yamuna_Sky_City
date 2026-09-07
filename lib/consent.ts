/**
 * Cookie consent state + Google Consent Mode v2 bridge.
 *
 * Default state (set by the inline script in app/layout.tsx BEFORE GTM
 * loads): every storage category denied except functionality/security.
 * The visitor's choice is persisted in localStorage; on later visits the
 * same inline script restores a "granted" choice before GTM runs, so
 * tags never fire ahead of consent. Tags inside the GTM container must
 * use their built-in consent checks (default for Google tags).
 */
export const CONSENT_STORAGE_KEY = "ysc-cookie-consent";
/** Fired on window to re-open the banner (footer "Cookie preferences"). */
export const CONSENT_OPEN_EVENT = "ysc:cookie-preferences";

export type ConsentChoice = "granted" | "denied";

type DataLayerWindow = Window & { dataLayer?: unknown[] };

export function getStoredConsent(): ConsentChoice | null {
  try {
    const v = localStorage.getItem(CONSENT_STORAGE_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

function gtag(...args: unknown[]) {
  const w = window as DataLayerWindow;
  w.dataLayer = w.dataLayer || [];
  // Consent Mode requires the `arguments` object shape, not an array.
  // eslint-disable-next-line prefer-rest-params
  w.dataLayer.push(arguments);
  void args;
}

export function applyConsent(choice: ConsentChoice) {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    // Storage unavailable (private mode): the choice still applies for
    // this page view.
  }
  gtag("consent", "update", {
    ad_storage: choice,
    ad_user_data: choice,
    ad_personalization: choice,
    analytics_storage: choice,
  });
  const w = window as DataLayerWindow;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event: "ysc_consent_update", consent: choice });
}

/**
 * Inline bootstrap for the root layout (runs before GTM). Kept as a
 * string so it can be emitted with next/script `beforeInteractive`.
 */
export const consentBootstrapScript = `
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',functionality_storage:'granted',security_storage:'granted'});
try{if(localStorage.getItem('${CONSENT_STORAGE_KEY}')==='granted'){gtag('consent','update',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'});}}catch(e){}
`.trim();
