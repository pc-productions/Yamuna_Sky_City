import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center bg-paper">
      <Container className="py-32 sm:py-40">
        <div className="h-[2px] w-12 bg-brand" />
        <p className="mt-5 text-[0.6875rem] font-medium uppercase tracking-[0.3em] text-brand">
          Error 404
        </p>
        <h1 className="mt-6 max-w-3xl text-display-lg text-ink">
          Page Not Found
        </h1>
        <p className="mt-6 max-w-xl text-[1.0625rem] leading-[1.7] text-ink/80">
          The page you are looking for doesn&apos;t exist or has moved.
        </p>
        <Link
          href="/"
          className="font-display mt-10 inline-flex items-center bg-brand px-7 py-3.5 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-paper transition-colors duration-300 hover:bg-brand-dark"
        >
          Back to Home
        </Link>
      </Container>
    </main>
  );
}
