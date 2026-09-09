/**
 * Global, non-section-specific site configuration.
 * Edit here to change brand copy, external links, and CTA labels
 * across the entire site — nothing below should be duplicated in components.
 *
 * FACTUAL CONTENT RULE: only verified, explicitly supplied project facts
 * belong in this file. Fields that are not yet confirmed are left empty
 * ("" / []) — components treat empty as "not configured" and hide the
 * related UI rather than showing invented or dummy values. Do not infer
 * geography or positioning from the project name.
 */

export const brand = {
  name: "Yamuna Sky City",
  shortName: "YSC",
  // Official tagline from the brand guidelines (see content/brand.ts).
  tagline: "The Pinnacle of South India",
} as const;

/**
 * Canonical production origin, e.g. "https://www.yamunaskycity.com".
 * Set NEXT_PUBLIC_SITE_URL in the deploy environment (see .env.example).
 * While unset, the fallback origin below is used for URL construction and
 * the site serves noindex robots — a deploy without the confirmed domain
 * can never be indexed with broken canonical/OG/sitemap URLs.
 */
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const isSiteUrlConfigured = Boolean(configuredSiteUrl);

export const seo = {
  titleDefault: "Yamuna Sky City",
  // Homepage <title> / og:title: brand name + the official tagline (the
  // only positioning line approved in the brand guidelines).
  homeTitle: `${brand.name} | ${brand.tagline}`,
  titleTemplate: "%s | Yamuna Sky City",
  // Built only from approved facts — no location or positioning claims.
  // Facts only (content/facts.ts): scale, configuration, corridor, distance.
  // Leads with the phrase the previous yamunaskycity.com site ranked for
  // ("Sea View Apartments in Mangalore", its tagline) so the switch
  // keeps that relevance; the rest is approved facts only.
  description:
    "Yamuna Sky City — sea view apartments in Mangalore. South India's tallest sea-view tower: 296 sea-facing 2, 3, 4 & 5 BHK residences across GF+60 floors on NH 66, Kulai, minutes from the Arabian Sea. Schedule a private viewing.",
  siteUrl: configuredSiteUrl ?? "https://www.yamunaskycity.example",
  // TODO: set the confirmed handle, or leave empty to omit the tag.
  twitterHandle: "",
  // Google Search Console "HTML tag" verification token (the content=
  // value only). Public, but deploy-specific — set via env; omitted when
  // empty.
  googleSiteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "",
} as const;

/**
 * Google Tag Manager container — the public container ID supplied by
 * the client (GTM_YSC.docx). Public identifiers are safe to commit.
 * Override per environment with NEXT_PUBLIC_GTM_ID; set it to an empty
 * string to disable tagging on a deploy (e.g. previews) without
 * touching code — the layout renders nothing when the ID is empty.
 */
export const analytics = {
  gtmId: process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-MHNRSR6J",
} as const;

/**
 * Contact channels. Every field is optional in practice: leave a field
 * as an empty string until the real value is confirmed and the UI that
 * depends on it (footer rows, call links, WhatsApp CTAs) stays hidden.
 */
export const contact = {
  // Confirmed from the client's earlier site build (SkyCity draft):
  // sales line, email and the Yamuna Homes office address.
  phoneDisplay: "+91 88844 39155",
  phoneHref: "tel:+918884439155",
  /** Second sales line printed in the brochure. */
  phoneSecondaryDisplay: "+91 88845 39155",
  phoneSecondaryHref: "tel:+918884539155",
  // Project sales mailbox as printed in the official brochure (the
  // earlier draft site used yamunahomes16@gmail.com).
  email: "sales@yamunaskycity.com",
  address: "1st Floor, Nalapad Building, Mallikatta, Kadri, Mangalore – 575003",
  /** Project site, as printed on the brochure cover. */
  projectSiteLine: "N.H. 66, Kulai, Mangaluru",
  /** Structured form of `address` for JSON-LD. */
  postalAddress: {
    streetAddress: "1st Floor, Nalapad Building, Mallikatta, Kadri",
    addressLocality: "Mangalore",
    addressRegion: "Karnataka",
    postalCode: "575003",
    addressCountry: "IN",
  },
  // WhatsApp number — digits only, country code included, no leading +.
  whatsappNumber: "918884439155",
  whatsappPrefilledMessage:
    "Hi, I'm interested in Yamuna Sky City. Please share more details.",
} as const;

/** Returns null while no WhatsApp number is configured — callers hide the CTA. */
export function getWhatsAppUrl(customMessage?: string): string | null {
  if (!contact.whatsappNumber) return null;
  const message = encodeURIComponent(
    customMessage ?? contact.whatsappPrefilledMessage,
  );
  return `https://wa.me/${contact.whatsappNumber}?text=${message}`;
}

export const externalLinks = {
  // External 3D location experience (client-supplied). If ever cleared,
  // the 3D section falls back to a link-less "Coming Soon" preview —
  // visitors are never sent to a fake destination.
  explore3d: "https://www.turiya.co/360/YamunaSkyCity/",
  /** Developer's corporate site, as printed in the brochure. */
  developerSite: "https://www.yamunabuilders.com",
} as const;

/**
 * Homepage section switches. Sections whose verified content has not
 * been supplied yet are kept in the codebase but NOT rendered for
 * visitors. Flip a flag to `true` once the content exists — the
 * section, and any nav link that points to it, appear again with no
 * other change.
 */
export const sectionVisibility = {
  peopleBehind: false, // content ready (verified from the brochure); switched off for launch by client decision
  legacy: false, // TODO: enable once content/legacy.ts has verified content
} as const;

export const ctaLabels = {
  scheduleViewing: "Schedule a Private Viewing",
  enquireNow: "Enquire Now",
  submitEnquiry: "Submit Enquiry",
  chatWhatsApp: "Chat on WhatsApp",
  exploreIn3d: "Explore in 3D",
  skipIntro: "Skip Intro",
  mobileEnquire: "Enquire",
  mobileWhatsApp: "WhatsApp",
  mobileSchedule: "Schedule a Viewing",
} as const;

/**
 * Brochure (website-hosted delivery, approach A). Left EMPTY until the
 * approved brochure file exists — no fake asset is ever linked. Set to
 * a path under /public (e.g. "/media/brochure/yamuna-sky-city.pdf") or
 * an absolute URL. Access is resolved in lib/brochure.ts only after a
 * confirmed successful enquiry; a CRM-provided URL takes precedence.
 */
export const brochure = {
  // Official brochure (final edition) supplied by the client, served
  // from /public. Offered only after a confirmed enquiry.
  href: "/media/brochure/Yamuna-Sky-City-Brochure.pdf",
} as const;

export const legal = {
  // Karnataka RERA registration, as published on the client's earlier
  // site build. Rendered with a "RERA No." label in the footer.
  reraNumber: "PRM/KA/RERA/1257/334/PR/171023/006331",
  /** Registered legal entity that operates the website / markets the
      project — used in the privacy policy and the footer copyright. */
  entityName: "Yamuna Homes and Design Pvt. Ltd.",
  /** Grievance Officer under the DPDP Act 2023 / IT Rules. Empty → the
      policy states that contact details will be published. TODO. */
  grievanceOfficer: { name: "Cyril Joselin Rodrigues", email: "" }, // email: falls back to contact.email until a dedicated privacy address exists
  /** Date the privacy policy was approved, e.g. "7 September 2026".
      Empty → the "Last updated" line is hidden. */
  privacyLastUpdated: "",
  disclaimer:
    "All images, plans and information are indicative and subject to change without notice. Details herein do not constitute an offer or contract.",
} as const;

export type SocialLink = { label: string; href: string };

export const socialLinks: SocialLink[] = [
  // TODO: populate with confirmed social profiles, or leave empty.
];
