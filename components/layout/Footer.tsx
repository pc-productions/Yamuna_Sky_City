import { navLinks } from "@/content/nav";
import { brand, contact, legal, socialLinks } from "@/content/site";
import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="dark-surface border-t border-line-dark bg-night text-mist">
      <Container className="flex flex-col gap-12 py-16">
        <div className="flex flex-col justify-between gap-10 lg:flex-row">
          <div className="flex flex-col gap-4">
            <span className="font-display text-xl font-medium text-white">{brand.name}</span>
            <p className="max-w-xs text-sm leading-relaxed text-mist-muted">{brand.tagline}</p>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs font-semibold uppercase tracking-[0.12em] text-mist-muted transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-2 text-sm text-mist-muted">
            <a href={contact.phoneHref} className="hover:text-white">
              {contact.phoneDisplay}
            </a>
            <a href={`mailto:${contact.email}`} className="hover:text-white">
              {contact.email}
            </a>
            <address className="not-italic">{contact.address}</address>
          </div>
        </div>

        {socialLinks.length > 0 && (
          <div className="flex gap-6">
            {socialLinks.map((social) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold uppercase tracking-[0.12em] text-mist-muted hover:text-white"
              >
                {social.label}
              </a>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-3 border-t border-line-dark pt-8 text-xs text-mist-muted">
          <p>{legal.reraNumber}</p>
          <p className="max-w-3xl leading-relaxed">{legal.disclaimer}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
            <a href="/privacy-policy" className="hover:text-white">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-white">
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
