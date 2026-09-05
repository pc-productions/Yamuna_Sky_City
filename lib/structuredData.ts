import { brand, contact, seo, socialLinks } from "@/content/site";

/**
 * Site-wide JSON-LD. Strictly factual: only fields whose values are
 * verified brand/config data are emitted — optional facts (phone, social
 * profiles) appear automatically once content/site.ts carries them.
 * Rendered only when the real domain is configured (see app/layout.tsx).
 */
export function buildSiteStructuredData() {
  const organization: Record<string, unknown> = {
    "@type": "Organization",
    "@id": `${seo.siteUrl}/#organization`,
    name: brand.name,
    url: seo.siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${seo.siteUrl}/media/brand/lockup-primary.png`,
    },
    slogan: brand.tagline,
  };
  const sameAs = socialLinks.map((s) => s.href).filter(Boolean);
  if (sameAs.length > 0) organization.sameAs = sameAs;
  if (contact.phoneDisplay) {
    organization.contactPoint = {
      "@type": "ContactPoint",
      telephone: contact.phoneDisplay,
      contactType: "sales",
      ...(contact.email ? { email: contact.email } : {}),
    };
  }

  return {
    "@context": "https://schema.org",
    "@graph": [
      organization,
      {
        "@type": "WebSite",
        "@id": `${seo.siteUrl}/#website`,
        name: brand.name,
        url: seo.siteUrl,
        publisher: { "@id": `${seo.siteUrl}/#organization` },
        inLanguage: "en",
      },
    ],
  };
}
