"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { connectivity, locationContent } from "@/content/location";
import { locationImage } from "@/content/media";
import { Container } from "@/components/ui/Container";
import { CoverFrame } from "@/components/sections/location/CoverFrame";
import { LocationBackground } from "@/components/sections/location/LocationBackground";
import { LocationAtmosphere } from "@/components/sections/location/LocationAtmosphere";
import { LocationOrbitalSystem } from "@/components/sections/location/LocationOrbitalSystem";
import { LocationConnectionLines } from "@/components/sections/location/LocationConnectionLines";
import { LocationNode } from "@/components/sections/location/LocationNode";
import { LocationEditorial } from "@/components/sections/location/LocationEditorial";
import {
  LocationFeatureCard,
  HighlightRows,
} from "@/components/sections/location/LocationFeatureCard";
import {
  viewBox,
  nodes,
  towerX,
  towerY,
  BUBBLE_R,
  nodePresentation,
} from "@/components/sections/location/config";

const byId = Object.fromEntries(connectivity.map((c) => [c.id, c]));

/**
 * Location / Perfectly Connected — full-screen aerial composition.
 *
 * The photograph is the foundation; every annotation (white fade,
 * editorial column, orbital rings, dotted connections, red points,
 * floating location bubbles, glass feature card) is a real HTML/CSS/
 * SVG element so each can animate independently.
 *
 * Entrance choreography (GSAP + ScrollTrigger, plays once):
 * background settle → white atmosphere → heading → divider → body →
 * rings materialize one-by-one → connection lines draw → bubbles pop
 * in sequence → feature card. After the entrance, the only ongoing
 * motion is a very subtle per-bubble vertical float and a slow pulse
 * on the red points (both CSS, gated by [data-settled], disabled under
 * reduced motion). The rings never rotate and the bubbles never orbit.
 *
 * Reduced motion / no-JS: the markup is authored in its FINISHED
 * state; GSAP only introduces the hidden "from" states when it runs,
 * so those visitors simply see the completed composition.
 */
export function LocationSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // CSS float/pulse are disabled globally anyway; deferred per the
      // set-state-in-effect rule.
      const raf = requestAnimationFrame(() => setSettled(true));
      return () => cancelAnimationFrame(raf);
    }
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Author-time markup is the finished state; hide via GSAP so the
      // section degrades to the complete composition without JS.
      gsap.set("[data-loc-bg]", { opacity: 0, scale: 1.03 });
      gsap.set("[data-loc-atmo]", { opacity: 0 });
      gsap.set("[data-loc-eyebrow]", { opacity: 0, y: 15 });
      gsap.set("[data-loc-heading]", { opacity: 0, y: 20 });
      gsap.set("[data-loc-divider]", { scaleX: 0, transformOrigin: "left center" });
      gsap.set("[data-loc-body]", { opacity: 0, y: 25 });
      gsap.set("[data-loc-ring]", { opacity: 0, scale: 0.55, transformOrigin: "50% 50%" });
      gsap.set("[data-loc-linemask]", { strokeDashoffset: 1 });
      gsap.set("[data-loc-dot]", { opacity: 0 });
      gsap.set("[data-loc-node]", { opacity: 0, scale: 0.3, y: 18 });
      gsap.set("[data-loc-card]", { opacity: 0, y: 25 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 75%", once: true },
        defaults: { ease: "power3.out" },
        onComplete: () => setSettled(true),
      });
      tl.to("[data-loc-bg]", { opacity: 1, scale: 1, duration: 1.35, ease: "power2.out" }, 0)
        .to("[data-loc-atmo]", { opacity: 1, duration: 1.05 }, 0.15)
        .to("[data-loc-eyebrow]", { opacity: 1, y: 0, duration: 0.7 }, 0.2)
        .to("[data-loc-heading]", { opacity: 1, y: 0, duration: 0.8 }, 0.28)
        .to("[data-loc-divider]", { scaleX: 1, duration: 0.6 }, 0.42)
        .to("[data-loc-body]", { opacity: 1, y: 0, duration: 0.8 }, 0.52)
        /* Pop: each ring zooms out from the tower with a clear overshoot
           while fading in — sequential, never rotating. */
        .to(
          "[data-loc-ring]",
          { opacity: 1, scale: 1, duration: 1.0, ease: "back.out(2.2)", stagger: 0.2 },
          0.6,
        )
        .to(
          "[data-loc-linemask]",
          { strokeDashoffset: 0, duration: 0.75, ease: "power2.inOut", stagger: 0.09 },
          1.3,
        )
        .to("[data-loc-dot]", { opacity: 1, duration: 0.45, stagger: 0.09 }, 1.55)
        /* Bubble pop: markers inflate from a third of their size with a
           springy overshoot as the section is entered. */
        .to(
          "[data-loc-node]",
          { opacity: 1, scale: 1, y: 0, duration: 0.85, ease: "back.out(2)", stagger: 0.13 },
          1.45,
        )
        .to("[data-loc-card]", { opacity: 1, y: 0, duration: 0.8 }, 2.15);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="location"
      ref={sectionRef}
      data-settled={settled}
      /* Height = the image's natural aspect height (56.28vw = 941/1672),
         floored at 600px (lg) / one screen (xl). Width always stays 100vw
         — pairing aspect-ratio with min-height on the section itself made
         the aspect resolve against the min-height and blow the section
         WIDER than the viewport (159px x-overflow at 1440×900). When the
         floor wins, the full-width frame simply letterboxes inside. */
      className="relative scroll-mt-16 overflow-hidden bg-paper-muted lg:h-[max(600px,56.28vw)] xl:h-[max(100vh,56.28vw)] xl:scroll-mt-18"
      style={{ "--tower-x": `${towerX}%`, "--tower-y": `${towerY}%` } as CSSProperties}
    >
      {/* ------------------------------------------------------------ *
       * Desktop composition (lg+): image-anchored overlay system.
       * ------------------------------------------------------------ */}
      <div className="absolute inset-0 hidden lg:block">
        {/* ONE shared frame carries the photograph AND every overlay
            layer (atmosphere, rings, lines, red points, bubbles), so
            they live in a single coordinate space — the orbit's centre
            is pinned to the tower by construction and cannot drift at
            any viewport size or zoom level. */}
        <CoverFrame className="z-0">
          <LocationBackground />
          <LocationAtmosphere />
          <div className="absolute inset-0 z-[2]">
            <LocationOrbitalSystem />
          </div>
          <div className="absolute inset-0 z-[3]">
            <LocationConnectionLines />
          </div>
          <div className="absolute inset-0 z-[4]">
            {nodes.map((node) => {
              const item = byId[node.id];
              if (!item) return null;
              return (
                <LocationNode
                  key={node.id}
                  item={item}
                  position={{
                    left: `${(node.x / viewBox.w) * 100}%`,
                    top: `${((node.y - BUBBLE_R) / viewBox.h) * 100}%`,
                  }}
                  float={nodePresentation[node.id].float}
                />
              );
            })}
          </div>
        </CoverFrame>
        <LocationEditorial />
        <LocationFeatureCard />
      </div>

      {/* ------------------------------------------------------------ *
       * Below lg — interim static fallback (image + verified travel
       * times + approved highlights, no animation). A dedicated mobile
       * composition will replace this; the desktop experience above is
       * the current focus. No data-loc-* attributes here, so the GSAP
       * entrance never hides this content.
       * ------------------------------------------------------------ */}
      <div className="lg:hidden">
        <Container className="pt-14">
          <span className="eyebrow block text-brand">{locationContent.eyebrow}</span>
          <h2 className="mt-4 font-display text-display-md font-semibold text-ink">
            {locationContent.heading}
          </h2>
          <p className="mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-ink-muted">
            {locationContent.supportingLine}
          </p>
        </Container>
        <div className="relative mt-8 w-full" style={{ aspectRatio: locationImage.aspect }}>
          <Image
            src={locationImage.src}
            alt={locationImage.alt}
            fill
            sizes="100vw"
            className="object-cover"
            loading="lazy"
          />
        </div>
        <Container className="py-10">
          <ul>
            {connectivity.map((item) => (
              <li
                key={item.id}
                className="flex items-baseline justify-between gap-6 border-t border-line py-4 last:border-b"
              >
                <span className="text-sm text-ink-muted">{item.label}</span>
                <span className="font-display text-xl whitespace-nowrap text-ink">
                  {item.minutes} min
                </span>
              </li>
            ))}
          </ul>
          <HighlightRows className="mt-8 rounded-2xl border border-line bg-paper px-5 py-1" />
        </Container>
      </div>
    </section>
  );
}
