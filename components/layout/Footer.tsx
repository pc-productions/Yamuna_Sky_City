import Link from "next/link";
import { Envelope, FacebookLogo, InstagramLogo, MapPin, Phone } from "@phosphor-icons/react/dist/ssr";
import { navLinks } from "@/content/nav";
import { CookiePreferencesButton } from "@/components/layout/CookiePreferencesButton";
import { brand, contact, externalLinks, legal, socialLinks } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";

/** Footer social icons, keyed by the `icon` field in content/site.ts. */
const socialIcons = {
  instagram: InstagramLogo,
  facebook: FacebookLogo,
} as const;

/**
 * Footer — three quiet columns on one baseline (brand + social, site
 * map, contact), a hairline, then one legal strip: RERA, disclaimer,
 * policy links and the copyright. Compact vertical rhythm; the eyebrow
 * column headings carry the structure so nothing needs a border.
 * Contact rows render only once confirmed values exist in content/site.ts.
 */
export function Footer() {
  const columnHeading = "eyebrow mb-5 block text-mist-muted";
  const rowLink = "text-sm text-mist/85 transition-colors duration-[var(--motion-fast)] hover:text-white";
  const contactRow = "flex items-start gap-3";
  const contactIcon = "mt-0.5 shrink-0 text-mist-muted";

  return (
    <footer data-header-tone="dark" className="dark-surface bg-night text-mist">
      <Container className="pt-14 pb-8 sm:pt-16 sm:pb-10">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr_1.3fr] md:gap-10 lg:gap-16">
          {/* Brand: dark-application lockup with the tagline, social beneath. */}
          <div className="flex flex-col items-start gap-7">
            <Logo type="lockup" variant="dark" height={56} withTagline />
            {socialLinks.length > 0 && (
              <div className="flex gap-2">
                {socialLinks.map((social) => {
                  const Icon = socialIcons[social.icon];
                  return (
                    <a
                      key={social.href}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      title={social.label}
                      className="flex size-9 items-center justify-center border border-white/15 text-mist/85 transition-colors duration-[var(--motion-fast)] hover:border-white/40 hover:text-white"
                    >
                      <Icon size={18} weight="regular" aria-hidden="true" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Site map */}
          <nav aria-label="Footer">
            <span className={columnHeading}>Explore</span>
            <ul className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={rowLink}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact — rows appear only once confirmed values exist. */}
          {(contact.phoneDisplay || contact.email || contact.address) && (
            <div>
              <span className={columnHeading}>Contact</span>
              <ul className="flex flex-col gap-3 text-sm">
                {contact.phoneDisplay && (
                  <li className={contactRow}>
                    <Phone size={16} aria-hidden="true" className={contactIcon} />
                    <span>
                      <a href={contact.phoneHref} className={`${rowLink} whitespace-nowrap`}>
                        {contact.phoneDisplay}
                      </a>
                      {contact.phoneSecondaryDisplay && (
                        <>
                          <span aria-hidden="true" className="text-mist-muted/60"> · </span>
                          <a href={contact.phoneSecondaryHref} className={`${rowLink} whitespace-nowrap`}>
                            {contact.phoneSecondaryDisplay}
                          </a>
                        </>
                      )}
                    </span>
                  </li>
                )}
                {contact.email && (
                  <li className={contactRow}>
                    <Envelope size={16} aria-hidden="true" className={contactIcon} />
                    <a href={`mailto:${contact.email}`} className={rowLink}>
                      {contact.email}
                    </a>
                  </li>
                )}
                {contact.address && (
                  <li className={contactRow}>
                    <MapPin size={16} aria-hidden="true" className={contactIcon} />
                    <address className="not-italic leading-relaxed text-mist/85">
                      {contact.address}
                      {contact.projectSiteLine && (
                        <span className="block text-mist-muted">
                          Project site: <span className="text-mist/85">{contact.projectSiteLine}</span>
                        </span>
                      )}
                    </address>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Legal strip */}
        <div className="mt-12 border-t border-line-dark pt-6 text-xs leading-relaxed text-mist-muted sm:mt-14">
          <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between md:gap-8">
            {legal.reraNumber && <p className="shrink-0">RERA No. {legal.reraNumber}</p>}
            <p className="max-w-2xl md:text-right">{legal.disclaimer}</p>
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Link href="/privacy-policy" className="transition-colors hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms" className="transition-colors hover:text-white">
                Terms
              </Link>
              <CookiePreferencesButton className="transition-colors hover:text-white" />
            </div>
            <p>
              &copy; {new Date().getFullYear()}{" "}
              {externalLinks.developerSite ? (
                <a
                  href={externalLinks.developerSite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                >
                  {legal.entityName || brand.name}
                </a>
              ) : (
                legal.entityName || brand.name
              )}
              . All rights reserved.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
