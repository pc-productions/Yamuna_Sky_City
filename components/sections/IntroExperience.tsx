"use client";

import { useEffect, useState } from "react";
import { IntroVideo } from "@/components/sections/IntroVideo";
import { Hero } from "@/components/sections/Hero";

const SESSION_KEY = "ysc-intro-seen";

/**
 * Explicit state model for the entry experience:
 *
 *   "resolving" — initial state on every load. Neither video is active:
 *                 the Hero renders its poster only and loads nothing
 *                 heavy, so the two videos never compete for bandwidth
 *                 while we decide whether the intro should play.
 *   "intro"     — the intro overlay is the primary media experience.
 *                 The Hero stays poster-only underneath it.
 *   "hero"      — the intro has completed / been skipped / failed, or was
 *                 never eligible (reduced motion, repeat visit). Only now
 *                 does the Hero video become active.
 *
 * The Hero is mounted throughout (never remounted), so the intro's fade
 * reveals an already-rendered layer with no layout shift.
 */
type EntryPhase = "resolving" | "intro" | "hero";

export function IntroExperience() {
  const [phase, setPhase] = useState<EntryPhase>("resolving");

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let alreadySeen = false;
    try {
      alreadySeen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      // Storage unavailable (private mode etc.) — treat as first visit.
    }

    const nextPhase: EntryPhase =
      prefersReducedMotion || alreadySeen ? "hero" : "intro";

    // Deferred via rAF rather than called synchronously in the effect body.
    const frame = requestAnimationFrame(() => setPhase(nextPhase));
    return () => cancelAnimationFrame(frame);
  }, []);

  const completeIntro = () => {
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // Best-effort only.
    }
    setPhase("hero");
  };

  return (
    <>
      {phase === "intro" && <IntroVideo onComplete={completeIntro} />}
      <Hero active={phase === "hero"} />
    </>
  );
}
