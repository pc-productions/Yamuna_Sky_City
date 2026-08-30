/**
 * Global, non-section-specific site configuration.
 * Edit here to change brand copy, external links, and CTA labels
 * across the entire site — nothing below should be duplicated in components.
 */

export const brand = {
  name: "Yamuna Sky City",
  shortName: "YSC",
  tagline: "A landmark on the Yamuna skyline.",
} as const;

export const seo = {
  titleDefault: "Yamuna Sky City — A Landmark on the Yamuna Skyline",
  titleTemplate: "%s | Yamuna Sky City",
  description:
    "Yamuna Sky City is a 60-level landmark residence on the Yamuna riverfront — 296 residences across 2, 3, 4 & 5 BHK configurations. Schedule a private viewing.",
  // TODO: replace with the production domain before launch.
  siteUrl: "https://www.yamunaskycity.com",
  twitterHandle: "@YamunaSkyCity",
} as const;

export const contact = {
  // TODO: confirm final phone/email/address with the client before launch.
  phoneDisplay: "+91 00000 00000",
  phoneHref: "tel:+910000000000",
  email: "sales@yamunaskycity.com",
  address: "Yamuna Sky City, Sector TBD, Noida, Uttar Pradesh",
  // WhatsApp deep link — digits only, no leading +, prefilled message optional.
  whatsappNumber: "910000000000",
  whatsappPrefilledMessage:
    "Hi, I'm interested in Yamuna Sky City. Please share more details.",
} as const;

export function getWhatsAppUrl(customMessage?: string) {
  const message = encodeURIComponent(
    customMessage ?? contact.whatsappPrefilledMessage,
  );
  return `https://wa.me/${contact.whatsappNumber}?text=${message}`;
}

export const externalLinks = {
  // TODO: replace with the production URL for the 3D location experience.
  explore3d: "https://example.com/yamuna-sky-city-3d",
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

export const legal = {
  // TODO: insert confirmed RERA number(s) and disclaimer copy before launch.
  reraNumber: "RERA No. — TBD",
  disclaimer:
    "All images, plans and information are indicative and subject to change without notice. Details herein do not constitute an offer or contract.",
} as const;

export type SocialLink = { label: string; href: string };

export const socialLinks: SocialLink[] = [
  // TODO: populate with confirmed social profiles, or remove if none exist.
];
