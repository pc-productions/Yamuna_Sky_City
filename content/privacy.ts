import { brand, contact, legal } from "@/content/site";

/**
 * Privacy Policy — DRAFT for legal review.
 *
 * Written to describe ONLY what this website actually does (see the
 * enquiry pipeline in lib/, the consent bar, Google Tag Manager and the
 * hosting platform). Entity name, grievance officer and dates are read
 * from content/site.ts so nothing is invented: while they are empty the
 * policy falls back to the brand name and states that contact details
 * will be published. Framework references: Digital Personal Data
 * Protection Act, 2023 and the Information Technology Act, 2000 with the
 * SPDI Rules, 2011.
 */

export type PolicySection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  /** Paragraphs rendered after the bullet list. */
  after?: string[];
};

const who = legal.entityName || brand.name;

export const privacyPolicy = {
  title: "Privacy Policy",
  lastUpdated: legal.privacyLastUpdated,
  intro: [
    `${who} (“we”, “us”, “our”) operates this website for the ${brand.name} residential project. This Privacy Policy explains what personal data we collect when you use the website, why we collect it, how we protect it, who we share it with and the choices and rights you have.`,
    "This Policy is published in accordance with the Digital Personal Data Protection Act, 2023 and the Information Technology Act, 2000 together with the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011. By using the website or submitting an enquiry you confirm that you have read and understood this Policy.",
  ],
  sections: [
    {
      heading: "1. Information we collect",
      paragraphs: ["We collect personal data in three ways."],
      bullets: [
        "Information you give us. When you submit the enquiry form or request a private viewing we ask for your full name, email address, mobile number and, optionally, your city, together with your confirmation that we may contact you about your enquiry. We record the wording of that consent and the time it was given.",
        "Information collected automatically. With your consent (see “Cookies and analytics” below) our analytics and advertising tags collect information about your device and browser, approximate location derived from your IP address, the pages you view and how you interact with them. Independently of consent, the website keeps a note in your browser’s session storage of how you arrived (campaign parameters in the link, the referring website and the first page you opened) so that, if you enquire, we know which campaign your enquiry came from. This note is deleted when you close the browser.",
        "Technical logs. Our hosting provider records standard server logs, including IP address, browser type and the time of each request, for security, abuse prevention and troubleshooting.",
      ],
      after: [
        "We do not knowingly collect sensitive personal data (such as financial information, health data or government identifiers) through this website, and we ask you not to include such information in any message you send us.",
      ],
    },
    {
      heading: "2. How we use your information",
      bullets: [
        "To respond to your enquiry, arrange a private viewing and share project information, pricing and the brochure with you.",
        "To contact you by telephone, email, SMS or WhatsApp about the project, where you have consented to be contacted.",
        "To record your enquiry in our lead-management (CRM) system so that our sales team can follow it up.",
        "To understand how the website is used and to improve its content and performance.",
        "To measure the effectiveness of our marketing campaigns and, with your consent, to show you relevant advertising.",
        "To keep the website secure, to detect and block automated or fraudulent submissions, and to comply with applicable law.",
      ],
    },
    {
      heading: "3. Lawful basis and consent",
      paragraphs: [
        "We process the personal data you submit through the enquiry form on the basis of the consent you give by ticking the consent box. Cookies and similar technologies that are not strictly necessary are used only after you accept them in the cookie bar.",
        "You may withdraw your consent at any time by using the “Cookie preferences” link in the website footer, by replying to any message we send you, or by contacting us using the details in section 11. Withdrawing consent does not affect processing that took place before withdrawal.",
      ],
    },
    {
      heading: "4. Who we share your information with",
      paragraphs: ["We do not sell your personal data. We share it only as follows."],
      bullets: [
        "Our sales team and authorised representatives who handle enquiries for the project.",
        "Service providers who process data on our behalf and under our instructions: the provider of our lead-management (CRM) and workflow-automation system, our website hosting and content-delivery provider, and Google (Google Tag Manager, Google Analytics and Google Ads) for analytics and advertising measurement.",
        "Messaging platforms you choose to contact us through, such as WhatsApp, whose own privacy policies apply to that communication.",
        "Courts, regulators, law-enforcement agencies and professional advisers where the law requires it or where necessary to establish, exercise or defend legal claims.",
        "A successor entity in the event of a merger, acquisition or transfer of the project, subject to this Policy.",
      ],
    },
    {
      heading: "5. Cookies and analytics",
      paragraphs: [
        "This website uses Google Tag Manager to manage analytics and advertising tags. The tags may set cookies or use similar technologies to recognise your browser, measure visits and attribute enquiries and conversions to advertising campaigns.",
        "No analytics or advertising cookie is set until you choose “Accept” in the cookie bar shown on your first visit. If you choose “Decline”, these tags remain disabled. Your choice is stored in your browser so that it is remembered on later visits, and you can change it at any time using the “Cookie preferences” link in the footer. You can also delete or block cookies through your browser settings, although some parts of the website may then work less well.",
        "Information collected through Google services is processed by Google in accordance with Google’s privacy policy, which may involve transfer of data outside India.",
      ],
    },
    {
      heading: "6. How long we keep your information",
      paragraphs: [
        "We keep enquiry data for as long as it is needed to respond to you and to manage our relationship with you in connection with the project, and thereafter only for as long as required by applicable law or to resolve disputes. Analytics data is retained for the periods configured in our analytics tools. Server logs are retained for a limited period for security purposes. Campaign-attribution notes held in your browser are removed when you close it.",
        "You may ask us to delete your personal data at any time (see section 8). We will do so unless we are required by law to retain it.",
      ],
    },
    {
      heading: "7. How we protect your information",
      paragraphs: [
        "The website is served only over HTTPS. Enquiry data is transmitted from our servers to our lead-management system rather than from your browser, and access to that system is restricted to authorised personnel. We use automated checks to reject spam and automated submissions. While we apply reasonable security practices and procedures, no method of transmission or storage over the internet is completely secure, and we cannot guarantee absolute security.",
      ],
    },
    {
      heading: "8. Your rights",
      paragraphs: ["Subject to applicable law, you have the right to:"],
      bullets: [
        "access the personal data we hold about you and a summary of how it is processed;",
        "have inaccurate or incomplete personal data corrected or updated;",
        "have your personal data erased where it is no longer necessary for the purpose for which it was collected;",
        "withdraw consent you have previously given;",
        "nominate another individual to exercise these rights on your behalf in the event of your death or incapacity; and",
        "raise a grievance about how your personal data has been handled.",
      ],
      after: [
        "To exercise any of these rights, contact us using the details in section 11. We may need to verify your identity before acting on a request. We will respond within the time permitted by applicable law. If you are not satisfied with our response you may approach the Data Protection Board of India.",
      ],
    },
    {
      heading: "9. Children",
      paragraphs: [
        "This website is intended for adults interested in purchasing property. It is not directed at children under 18 years of age, and we do not knowingly collect personal data from them. If you believe a child has provided us with personal data, please contact us and we will delete it.",
      ],
    },
    {
      heading: "10. Third-party websites and services",
      paragraphs: [
        "The website contains links to third-party services, including the interactive 3D experience of the project hosted by a third-party provider and messaging services such as WhatsApp. These services are governed by their own privacy policies, which we encourage you to read. We are not responsible for the privacy practices of third parties.",
      ],
    },
    {
      heading: "11. Contact and grievance redressal",
      paragraphs: [
        "If you have any question about this Policy, wish to exercise your rights, or have a grievance about the handling of your personal data, please contact our Grievance Officer:",
      ],
    },
    {
      heading: "12. Changes to this Policy",
      paragraphs: [
        "We may update this Policy from time to time to reflect changes in our practices or in the law. The current version will always be published on this page with its date of last update. Where a change materially affects how we use your personal data, we will take reasonable steps to bring it to your attention.",
      ],
    },
  ] as PolicySection[],
  /** Contact block for section 11 — from content/site.ts (empty = hidden). */
  contactBlock: {
    officerName: legal.grievanceOfficer.name,
    officerEmail: legal.grievanceOfficer.email || contact.email,
    phone: contact.phoneDisplay,
    phoneHref: contact.phoneHref,
    address: contact.address,
    pendingText:
      "Contact details for privacy requests and grievances will be published here shortly.",
  },
} as const;
