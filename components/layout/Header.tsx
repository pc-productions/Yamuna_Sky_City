"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { navLinks } from "@/content/nav";
import { brand, ctaLabels } from "@/content/site";
import { Button } from "@/components/ui/Button";

/**
 * Header tone follows the section beneath it, so it never clashes with
 * light or dark content:
 *
 *   "video" — fully transparent over full-bleed media (the Hero marks
 *             itself data-header-tone="video").
 *   "dark"  — translucent night surface over dark sections (Private
 *             Viewing, Legacy, Footer mark data-header-tone="dark").
 *   "light" — solid paper over everything else (the default; light
 *             sections need no attribute).
 *
 * One rAF-throttled scroll/resize probe checks which marked section
 * currently sits under the header — a handful of getBoundingClientRect
 * calls per frame, no library, no IntersectionObserver bookkeeping.
 * Inner pages are always "light".
 */
type HeaderTone = "video" | "dark" | "light";

function useHeaderTone(enabled: boolean): HeaderTone {
  const [tone, setTone] = useState<HeaderTone>(enabled ? "video" : "light");

  useEffect(() => {
    if (!enabled) return;

    const probe = () => {
      const probeY = 36; // vertical middle of the header bar
      let next: HeaderTone = "light";
      for (const el of document.querySelectorAll<HTMLElement>("[data-header-tone]")) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= probeY && rect.bottom >= probeY) {
          next = (el.dataset.headerTone as HeaderTone) ?? "light";
          break;
        }
      }
      setTone(next);
    };

    let ticking = false;
    const onScrollOrResize = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          probe();
          ticking = false;
        });
      }
    };

    // Initial probe deferred to a frame — no synchronous setState in effect.
    const frame = requestAnimationFrame(probe);
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [enabled]);

  // Inner pages are always light, regardless of any stale probed tone.
  return enabled ? tone : "light";
}

const surfaceByTone: Record<HeaderTone, string> = {
  video: "border-b border-transparent bg-transparent",
  dark: "border-b border-white/10 bg-night/70 backdrop-blur-sm",
  light: "border-b border-line/70 bg-paper/90 backdrop-blur-sm",
};

export function Header({ onEnquire }: { onEnquire: () => void }) {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const sectionTone = useHeaderTone(pathname === "/");

  // The open mobile menu always sits on a solid paper panel.
  const tone: HeaderTone = isMenuOpen ? "light" : sectionTone;
  const onDark = tone !== "light";

  const linkTone = onDark ? "text-white/80 hover:text-white" : "text-ink-muted hover:text-brand";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${surfaceByTone[tone]}`}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 sm:px-10 lg:px-16">
        <a
          href="#top"
          className={`font-display text-lg tracking-tight transition-colors duration-500 ${
            onDark ? "text-white" : "text-ink"
          }`}
        >
          {brand.name}
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-[0.6875rem] font-semibold uppercase tracking-[0.18em] transition-colors duration-300 ${linkTone}`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button variant={onDark ? "ghost-dark" : "ghost-light"} onClick={onEnquire}>
            {ctaLabels.enquireNow}
          </Button>
          <Button href="#contact" variant={onDark ? "outline-light" : "primary"}>
            {ctaLabels.scheduleViewing}
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="flex flex-col gap-1.5 p-2 lg:hidden"
        >
          <span
            className={`h-px w-6 transition-all duration-300 ${onDark ? "bg-white" : "bg-ink"} ${
              isMenuOpen ? "translate-y-[3.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-px w-6 transition-all duration-300 ${onDark ? "bg-white" : "bg-ink"} ${
              isMenuOpen ? "-translate-y-[3.5px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {isMenuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="flex flex-col border-t border-line/70 bg-paper px-6 py-6 lg:hidden"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="py-3.5 font-display text-2xl text-ink transition-colors hover:text-brand"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
