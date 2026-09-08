"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { contact, ctaLabels, getWhatsAppUrl } from "@/content/site";

/**
 * Mobile-only persistent action bar (desktop CTAs live in the Header and
 * the floating WhatsApp control). Two segments: WhatsApp on the left,
 * "Schedule a Viewing" on the right, which takes the visitor to the
 * Contact section's form.
 *
 * On the homepage the schedule link is a plain in-page anchor: touch
 * devices keep native scrolling (no Lenis), and the browser handles a
 * bare "#contact" reliably where a router-driven "/#contact" did not.
 * On inner pages it navigates home first.
 */
export function PersistentCTA() {
  const pathname = usePathname();
  const whatsappUrl = getWhatsAppUrl();
  const onHome = pathname === "/";

  const track = () => {
    const w = window as Window & { dataLayer?: unknown[] };
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event: "whatsapp_click", placement: "mobile-bar" });
  };

  const scheduleClass =
    "font-display flex flex-1 items-center justify-center bg-brand py-4 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-paper transition-colors duration-[var(--motion-fast)] hover:bg-brand-dark";

  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-white/10 bg-night/85 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {whatsappUrl && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={track}
          aria-label={`${ctaLabels.chatWhatsApp} (${contact.phoneDisplay})`}
          className="font-display flex flex-1 items-center justify-center gap-2.5 border-r border-white/10 py-4 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-paper/90 transition-colors duration-[var(--motion-fast)] hover:text-paper"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-[#25D366]">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="currentColor" />
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.979-1.381A9.965 9.965 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.964 7.964 0 01-4.058-1.107l-.291-.173-3.018.836.823-3.018-.19-.309A7.963 7.963 0 014 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z" fill="currentColor" />
          </svg>
          {ctaLabels.mobileWhatsApp}
        </a>
      )}
      {onHome ? (
        <a href="#contact" className={scheduleClass}>
          {ctaLabels.mobileSchedule}
        </a>
      ) : (
        <Link href="/#contact" className={scheduleClass}>
          {ctaLabels.mobileSchedule}
        </Link>
      )}
    </nav>
  );
}
