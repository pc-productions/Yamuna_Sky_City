"use client";

import { useEffect, useState } from "react";
import { contact, ctaLabels, getWhatsAppUrl } from "@/content/site";

/**
 * Desktop WhatsApp entry point — a single round control in the bottom-
 * right corner (the phone gets the persistent action bar instead). It
 * rises into view once the visitor has moved past the opening film, so
 * the hero stays uncluttered, and steps up above the cookie bar while
 * that is open. Uses WhatsApp's own brand mark and green, as a third-
 * party identifier rather than a site accent. Renders nothing until a
 * WhatsApp number is configured in content/site.ts.
 */
export function FloatingWhatsApp() {
  const url = getWhatsAppUrl();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() =>
        setVisible(window.scrollY > window.innerHeight * 0.5),
      );
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (!url) return null;

  const track = () => {
    const w = window as Window & { dataLayer?: unknown[] };
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event: "whatsapp_click", placement: "floating" });
  };

  return (
    <aside aria-label="Quick contact">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${ctaLabels.chatWhatsApp} (${contact.phoneDisplay})`}
        onClick={track}
        className={`group fixed right-6 bottom-6 z-[44] hidden items-center gap-3 lg:flex [html[data-consent-open=true]_&]:bottom-32 transition-[opacity,transform,bottom] duration-[var(--motion-standard)] ease-[var(--ease-editorial)] xl:right-8 xl:bottom-8 ${
          visible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <span className="font-display pointer-events-none translate-x-2 rounded-sm bg-night/85 px-3 py-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-paper opacity-0 backdrop-blur-sm transition-[opacity,transform] duration-[var(--motion-fast)] group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
          {ctaLabels.chatWhatsApp}
        </span>
        <span className="flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_18px_40px_-16px_rgba(0,0,0,0.55)] transition-transform duration-[var(--motion-fast)] group-hover:scale-105">
          {/* WhatsApp mark */}
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
              fill="currentColor"
            />
            <path
              d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.979-1.381A9.965 9.965 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.964 7.964 0 01-4.058-1.107l-.291-.173-3.018.836.823-3.018-.19-.309A7.963 7.963 0 014 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z"
              fill="currentColor"
            />
          </svg>
        </span>
      </a>
    </aside>
  );
}
