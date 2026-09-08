"use client";

import { useEffect, useState } from "react";
import { cookieConsent } from "@/content/consent";
import { CONSENT_OPEN_EVENT, applyConsent, getStoredConsent } from "@/lib/consent";
import { Button } from "@/components/ui/Button";

/**
 * Non-blocking cookie consent bar. Shown until the visitor makes a
 * choice; re-openable from the footer. Renders nothing on the server
 * and until mounted, so there is no hydration mismatch and no flash for
 * visitors who already decided.
 */
export function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      if (getStoredConsent() === null) setOpen(true);
    });
    const reopen = () => setOpen(true);
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
    };
  }, []);

  // Let fixed controls (the WhatsApp button) make room while the bar is up.
  useEffect(() => {
    document.documentElement.dataset.consentOpen = open ? "true" : "false";
    return () => {
      delete document.documentElement.dataset.consentOpen;
    };
  }, [open]);

  if (!open) return null;

  const choose = (choice: "granted" | "denied") => {
    applyConsent(choice);
    setOpen(false);
  };

  return (
    <section
      aria-label={cookieConsent.heading}
      className="fixed inset-x-0 bottom-[calc(3.25rem+env(safe-area-inset-bottom))] z-[45] border-t border-paper/10 bg-night/95 text-paper backdrop-blur-sm lg:bottom-0"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-4 sm:px-8 lg:flex-row lg:items-center lg:gap-8 lg:px-10">
        <div className="flex-1">
          <p className="font-display text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-paper">
            {cookieConsent.heading}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-mist-muted">
            {cookieConsent.message}{" "}
            <a href="/privacy-policy" className="underline underline-offset-2 hover:text-white">
              {cookieConsent.policyLabel}
            </a>
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <Button type="button" variant="outline-light" onClick={() => choose("denied")}>
            {cookieConsent.declineLabel}
          </Button>
          <Button type="button" variant="primary" onClick={() => choose("granted")}>
            {cookieConsent.acceptLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
