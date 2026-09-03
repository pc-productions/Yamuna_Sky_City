import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Terms & Conditions",
};

export default function TermsPage() {
  return (
    <Container className="flex flex-col gap-6 pt-40 pb-24">
      <h1 className="font-display text-4xl font-medium text-ink">Terms &amp; Conditions</h1>
      <p className="max-w-2xl text-ink-muted">
        The terms &amp; conditions for Yamuna Sky City are being finalised and
        will be published on this page.
      </p>
    </Container>
  );
}
