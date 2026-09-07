"use client";

import { cookieConsent } from "@/content/consent";
import { CONSENT_OPEN_EVENT } from "@/lib/consent";

/** Footer control that re-opens the cookie consent bar. */
export function CookiePreferencesButton({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}
      className={className}
    >
      {cookieConsent.preferencesLabel}
    </button>
  );
}
