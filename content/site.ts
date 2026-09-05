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
  description:
    "Yamuna Sky City — 60 levels, 296 residences across 2, 3, 4 & 5 BHK configurations. Schedule a private viewing.",
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
  phoneDisplay: "", // TODO: confirmed sales number, e.g. "+91 ..."
  phoneHref: "", // TODO: matching tel: link, e.g. "tel:+91..."
  email: "", // TODO: confirmed sales email
  address: "", // TODO: confirmed project address
  // WhatsApp number — digits only, country code included, no leading +.
  whatsappNumber: "", // TODO: confirmed WhatsApp business number
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
} as const;

export const ctaLabels = {
  scheduleViewing: "Schedule a Private Viewing",
  enquireNow: "Enquire Now",
  submitEnquiry: "Submit Enquiry",
  chatWhatsApp: "Chat on WhatsApp",
  exploreIn3d: "Explore in 3D",
  skipIntro: "Skip Intro",
  mobileEnquire: "Enquire",
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
  href: "", // TODO: approved brochure PDF path or URL
} as const;

export const legal = {
  // Left empty until the confirmed RERA number is supplied — the footer
  // hides this row while empty.
  reraNumber: "",
  disclaimer:
    "All images, plans and information are indicative and subject to change without notice. Details herein do not constitute an offer or contract.",
} as const;

export type SocialLink = { label: string; href: string };

export const socialLinks: SocialLink[] = [
  // TODO: populate with confirmed social profiles, or leave empty.
];
