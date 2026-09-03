import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPolicyPage() {
  return (
    <Container className="flex flex-col gap-6 pt-40 pb-24">
      <h1 className="font-display text-4xl font-medium text-ink">Privacy Policy</h1>
      <p className="max-w-2xl text-ink-muted">
        The privacy policy for Yamuna Sky City is being finalised and will be
        published on this page.
      </p>
    </Container>
  );
}
