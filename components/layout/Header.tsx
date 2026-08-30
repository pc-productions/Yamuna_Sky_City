"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { navLinks } from "@/content/nav";
import { brand, ctaLabels } from "@/content/site";
import { Button } from "@/components/ui/Button";

/**
 * Minimal sticky header. On the homepage it starts transparent over the
 * dark hero (light text) and settles onto a solid paper surface once the
 * visitor scrolls; on inner pages it is always solid. One rAF-throttled
 * scroll listener — no animation library.
 */
export function Header({ onEnquire }: { onEnquire: () => void }) {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const overlaysHero = pathname === "/";

  useEffect(() => {
    if (!overlaysHero) return;
    let ticking = false;
    const update = () => {
      setScrolled(window.scrollY > 24);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlaysHero]);

  // Solid when: inner page, scrolled, or the mobile menu is open.
  const solid = !overlaysHero || isScrolled || isMenuOpen;

  const linkTone = solid
    ? "text-ink-muted hover:text-brand"
    : "text-white/80 hover:text-white";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${
        solid
          ? "border-b border-line/70 bg-paper/90 backdrop-blur-sm"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 sm:px-10 lg:px-16">
        <a
          href="#top"
          className={`font-display text-lg tracking-tight transition-colors duration-500 ${
            solid ? "text-ink" : "text-white"
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
          <Button
            variant={solid ? "ghost-light" : "ghost-dark"}
            onClick={onEnquire}
          >
            {ctaLabels.enquireNow}
          </Button>
          <Button href="#contact" variant={solid ? "primary" : "outline-light"}>
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
            className={`h-px w-6 transition-all duration-300 ${solid ? "bg-ink" : "bg-white"} ${
              isMenuOpen ? "translate-y-[3.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-px w-6 transition-all duration-300 ${solid ? "bg-ink" : "bg-white"} ${
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
