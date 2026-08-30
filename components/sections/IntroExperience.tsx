"use client";

import { useEffect, useState } from "react";
import { IntroVideo } from "@/components/sections/IntroVideo";
import { Hero } from "@/components/sections/Hero";

const SESSION_KEY = "ysc-intro-seen";

/**
 * Coordinates the cinematic intro overlay with the Hero underneath: the
 * Hero is always mounted (so it's ready the instant the intro clears) but
 * only starts loading/playing its own video once the intro is dismissed,
 * so both videos are never competing for bandwidth at once. Skips the
 * intro entirely for reduced-motion visitors and repeat visits in the
 * same session.
 */
export function IntroExperience() {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const alreadySeen = sessionStorage.getItem(SESSION_KEY) === "1";

    if (!prefersReducedMotion && !alreadySeen) {
      // Deferred via rAF rather than called synchronously in the effect body.
      const frame = requestAnimationFrame(() => setShowIntro(true));
      return () => cancelAnimationFrame(frame);
    }
  }, []);

  const completeIntro = () => {
    sessionStorage.setItem(SESSION_KEY, "1");
    setShowIntro(false);
  };

  return (
    <>
      {showIntro && <IntroVideo onComplete={completeIntro} />}
      <Hero active={!showIntro} />
    </>
  );
}
