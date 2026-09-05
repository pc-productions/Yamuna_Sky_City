# Production Readiness Audit — 2026-09-05

Scope: full website, production build (`next build` + `next start`),
Chromium via Playwright, axe-core 4.10, Lighthouse 12. Two build modes
were exercised: **unconfigured** (no `NEXT_PUBLIC_SITE_URL`, as deployed
today) and **configured** (domain set, as it will be at launch).

## Results

| Check | Result |
|---|---|
| `npm run lint`, `tsc --noEmit`, `npm run build` | clean |
| `npm audit` | 0 vulnerabilities |
| Dependencies | Next 16.3.4 / eslint-config-next 16.3.4 / @next/third-parties 16.3.4 (patch updates applied) |
| Secrets / env hygiene | no secrets in repo; only `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` are public; `ENQUIRY_WEBHOOK_URL` server-only |
| Security headers | nosniff, X-Frame-Options SAMEORIGIN, Referrer-Policy, Permissions-Policy, HSTS (2 y, subdomains), no `X-Powered-By` |
| Static media caching | `/media/*` → `public, max-age=86400, stale-while-revalidate=604800` |
| Routes | `/`, `/privacy-policy`, `/terms` 200; unknown paths 404 with branded page; `robots.txt`, `sitemap.xml`, OG/Twitter/icon images 200 |
| Console / page errors | none from the site (the only failed request is `gtm.js`, blocked by the audit sandbox's egress proxy) |
| Horizontal overflow | 0 px at 1920, 1440, 1280, 1024, 820, 390, 360 wide |
| axe-core (WCAG 2.1 AA + best-practice) | 0 violations on every route and viewport, modal included |
| Landmarks / headings | one `h1`, no heading-level skips, `lang="en"`, no nested `main` |
| Keyboard | "Skip to content" is the first tab stop and moves focus to `main`; modal traps focus, closes on Escape, restores focus to its trigger; body scroll locked while open |
| Enquiry form | invalid submit blocks with 4 field errors; valid submit shows the honest "not available yet" message while unconfigured; never a fake success |
| Intro / hero | intro shows on a fresh session, Skip works, hero video plays muted; reduced-motion skips the intro and shows the Location section fully rendered |
| Lighthouse — desktop (configured mode) | Performance 100 · Accessibility 100 · Best Practices 96 · SEO 100 |
| Lighthouse — mobile (configured mode) | Performance 86 · Accessibility 100 · Best Practices 96 · SEO 100 (LCP 3.9 s, TBT 160 ms, CLS 0) |

Best Practices sits at 96 only because of the sandbox-blocked GTM
request; on a real network this audit passes.

## SEO state (configured mode)

- `index,follow` robots + `robots.txt` allow + sitemap link; unconfigured
  deploys stay `noindex` so a placeholder domain can never be indexed.
- Per-page `<title>`, description, canonical and `og:url` (the root
  canonical used to be inherited by the legal pages — fixed).
- Homepage title uses the official tagline: "Yamuna Sky City | The
  Pinnacle of South India".
- JSON-LD `@graph`: Organization (name, url, logo, slogan; `sameAs` and
  `contactPoint` appear automatically once social links / phone are
  filled in) + WebSite.
- Branded 1200×630 OG image generated from the real lockup; Twitter
  `summary_large_image`.
- Search Console verification tag via `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`.
- All content is server-rendered; the GSAP entrance only hides elements
  client-side, so crawlers receive the finished markup.

## Fixed in this pass

- Legal pages inherited the homepage canonical → per-page canonicals.
- Mobile action bar lived outside any landmark → `<nav aria-label>`.
- 404 / error pages nested a second `<main>` → plain container.
- No skip link → added, with a focusable `main`.
- Hero poster (the LCP image) was lazy-loaded behind the intro → eager /
  high priority (mobile Performance 75 → 86).
- No cache policy on `/media/*` → bounded cache with revalidation.
- Unreferenced 3 MB photo shipped in `public/` → removed.
- README pointed at a location asset that no longer exists → corrected.

## Not fixable from code — needs the project team

1. `NEXT_PUBLIC_SITE_URL` in Vercel (the site is `noindex` until then) and
   the www/apex 308 redirect on the domain.
2. Search Console verification token, then submit `/sitemap.xml`.
3. CRM: `ENQUIRY_WEBHOOK_URL` + the answers in
   `docs/CRM_AGENCY_REQUIREMENTS.md`; brochure PDF (`brochure.href`).
4. Contact details, WhatsApp number, RERA number, social profiles
   (`content/site.ts`); Privacy Policy and Terms copy.
5. Intro film; People Behind and Legacy content.
6. **Mobile hero**: the 16:9 film's baked-in title letters are cropped
   into fragments on portrait phones — a portrait cut of the film is
   needed (`content/media.ts` already accepts per-breakpoint sources).
7. **Mobile Location**: the interim mobile artwork carries outdated
   baked-in labels; a dedicated mobile composition is still to be built.
8. Content depth for search: the page is visually led with little
   indexable copy; approved paragraphs on the project, residences and
   location would materially help ranking.

## Deliberately not done

- No Content-Security-Policy header: the client will configure tags
  (GA4, ad pixels) inside GTM without code changes, and a strict CSP
  would silently block each new vendor domain. Revisit with an
  allow-list once the tag set is final.
- No consent banner: GTM currently loads for every visitor; add one if
  the tags configured in the container set non-essential cookies.
