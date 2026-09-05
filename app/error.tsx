"use client";

import { Container } from "@/components/ui/Container";

/**
 * Route-level error boundary — a branded, recoverable fallback instead of
 * a blank screen if a section throws at runtime.
 */
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="flex flex-1 items-center bg-paper">
      <Container className="py-32 sm:py-40">
        <div className="h-[2px] w-12 bg-brand" />
        <p className="mt-5 text-[0.6875rem] font-medium uppercase tracking-[0.3em] text-brand">
          Something Went Wrong
        </p>
        <h1 className="mt-6 max-w-3xl text-display-lg text-ink">
          An Unexpected Error Occurred
        </h1>
        <p className="mt-6 max-w-xl text-[1.0625rem] leading-[1.7] text-ink/80">
          Please try again. If the problem persists, come back a little
          later.
        </p>
        <button
          type="button"
          onClick={reset}
          className="font-display mt-10 inline-flex items-center bg-brand px-7 py-3.5 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-paper transition-colors duration-300 hover:bg-brand-dark"
        >
          Try Again
        </button>
      </Container>
    </div>
  );
}
