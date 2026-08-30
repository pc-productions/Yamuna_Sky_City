import { navLinks } from "@/content/nav";
import { brand, contact, legal, socialLinks } from "@/content/site";
import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer data-header-tone="dark" className="dark-surface bg-night text-mist">
      <Container className="flex flex-col gap-16 pt-20 pb-14 sm:pt-28">
        <div className="flex flex-col justify-between gap-12 lg:flex-row lg:items-start">
          <div className="flex flex-col gap-5">
            <span className="font-display text-2xl text-white">{brand.name}</span>
            <p className="max-w-xs text-sm leading-relaxed text-mist-muted">{brand.tagline}</p>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-9 gap-y-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-mist-muted transition-colors duration-300 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Contact rows render only once confirmed values exist in content/site.ts. */}
          {(contact.phoneDisplay || contact.email || contact.address) && (
            <div className="flex flex-col gap-2.5 text-sm text-mist-muted">
              {contact.phoneDisplay && (
                <a href={contact.phoneHref} className="transition-colors hover:text-white">
                  {contact.phoneDisplay}
                </a>
              )}
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="transition-colors hover:text-white">
                  {contact.email}
                </a>
              )}
              {contact.address && <address className="not-italic">{contact.address}</address>}
            </div>
          )}
        </div>

        {socialLinks.length > 0 && (
          <div className="flex gap-7">
            {socialLinks.map((social) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-mist-muted transition-colors hover:text-white"
              >
                {social.label}
              </a>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-4 border-t border-line-dark pt-10 text-xs leading-relaxed text-mist-muted/80">
          {legal.reraNumber && <p>{legal.reraNumber}</p>}
          <p className="max-w-3xl">{legal.disclaimer}</p>
          <div className="flex flex-wrap gap-x-7 gap-y-2 pt-3">
            <a href="/privacy-policy" className="transition-colors hover:text-white">
              Privacy Policy
            </a>
            <a href="/terms" className="transition-colors hover:text-white">
              Terms
            </a>
            <span>
              &copy; {new Date().getFullYear()} {brand.name}. All rights reserved.
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
