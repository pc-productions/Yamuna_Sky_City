/**
 * Marketing attribution — a deliberately small, integration-ready
 * capture of where a visitor came from, so the CRM boundary can pass it
 * along once the CRM agency specifies the fields it wants.
 *
 * First-touch per browser session: captured once on the landing page
 * (UTM parameters, document.referrer, landing URL) into sessionStorage,
 * then read at enquiry submit time. No cookies, no third-party script,
 * no page-view tracking — Google Tag Manager handles analytics.
 *
 * Field names here are the website's own; the CRM adapter maps them.
 */

export type Attribution = Partial<{
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  referrer: string;
  landing_page: string;
}>;

const STORAGE_KEY = "ysc-attribution";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

/** Call once on app mount (client). Idempotent — keeps the first touch. */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const params = new URLSearchParams(window.location.search);
    const data: Attribution = {};
    for (const key of UTM_KEYS) {
      const v = params.get(key);
      if (v) data[key] = v.slice(0, 200);
    }
    // Ignore same-site referrers — only an external origin is attribution.
    const ref = document.referrer;
    if (ref && !ref.startsWith(window.location.origin)) data.referrer = ref.slice(0, 500);
    data.landing_page = (window.location.pathname + window.location.search).slice(0, 500);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage unavailable (private mode, blocked) — attribution is optional.
  }
}

/** Read the captured first-touch attribution; empty object if none. */
export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : {};
  } catch {
    return {};
  }
}
