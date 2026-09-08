"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { trackJournal, type JournalEvent } from "@/lib/blog/analytics";

/**
 * next/link that reports a Journal dataLayer event on click. Used for
 * the handful of links whose clicks the business wants to see in GTM
 * (related articles, links into the main site); ordinary navigation
 * uses plain <Link>.
 */
export function JournalLink({ track, onClick, ...props }: ComponentProps<typeof Link> & { track: JournalEvent }) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        trackJournal(track);
        onClick?.(e);
      }}
    />
  );
}
