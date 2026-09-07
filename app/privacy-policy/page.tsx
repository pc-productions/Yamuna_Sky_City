import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { privacyPolicy } from "@/content/privacy";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Yamuna Sky City collects, uses and protects your personal data.",
  alternates: { canonical: "/privacy-policy" },
  openGraph: { title: "Privacy Policy | Yamuna Sky City", url: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  const { title, lastUpdated, intro, sections, contactBlock } = privacyPolicy;
  const hasContact = Boolean(
    contactBlock.officerName || contactBlock.officerEmail || contactBlock.phone || contactBlock.address,
  );

  return (
    <Container className="pt-36 pb-24 sm:pt-40">
      <div className="h-[2px] w-12 bg-brand" />
      <h1 className="mt-6 font-display text-display-lg font-semibold uppercase text-ink">{title}</h1>
      {lastUpdated && (
        <p className="mt-3 text-sm text-ink-muted">Last updated: {lastUpdated}</p>
      )}

      <div className="mt-10 max-w-3xl space-y-5 text-[1.0625rem] leading-[1.75] text-ink/85">
        {intro.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>

      <div className="mt-14 max-w-3xl space-y-12">
        {sections.map((section) => (
          <section key={section.heading} aria-labelledby={slug(section.heading)}>
            <h2
              id={slug(section.heading)}
              className="font-display text-display-md font-semibold text-ink"
            >
              {section.heading}
            </h2>
            <div className="mt-4 space-y-4 text-[1.0625rem] leading-[1.75] text-ink/85">
              {section.paragraphs?.map((p) => <p key={p}>{p}</p>)}
              {section.bullets && (
                <ul className="list-disc space-y-3 pl-6 marker:text-brand">
                  {section.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
              {section.after?.map((p) => <p key={p}>{p}</p>)}
              {section.heading.startsWith("11.") && (
                <address className="not-italic">
                  {hasContact ? (
                    <div className="space-y-1">
                      {contactBlock.officerName && <p className="font-medium text-ink">{contactBlock.officerName}</p>}
                      {contactBlock.officerEmail && (
                        <p>
                          Email:{" "}
                          <a href={`mailto:${contactBlock.officerEmail}`} className="underline underline-offset-2">
                            {contactBlock.officerEmail}
                          </a>
                        </p>
                      )}
                      {contactBlock.phone && contactBlock.phoneHref && (
                        <p>
                          Phone:{" "}
                          <a href={contactBlock.phoneHref} className="underline underline-offset-2">
                            {contactBlock.phone}
                          </a>
                        </p>
                      )}
                      {contactBlock.address && <p>{contactBlock.address}</p>}
                    </div>
                  ) : (
                    <p className="text-ink-muted">{contactBlock.pendingText}</p>
                  )}
                </address>
              )}
            </div>
          </section>
        ))}
      </div>
    </Container>
  );
}

function slug(heading: string) {
  return heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
