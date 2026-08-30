import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPolicyPage() {
  return (
    <Container className="flex flex-col gap-6 py-24">
      <h1 className="font-display text-4xl font-medium text-ink">Privacy Policy</h1>
      <p className="max-w-2xl text-ink-muted">
        Placeholder — the confirmed privacy policy for Yamuna Sky City will be published here
        before launch.
      </p>
    </Container>
  );
}
