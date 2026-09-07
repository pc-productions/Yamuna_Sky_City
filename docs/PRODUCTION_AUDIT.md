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
   `docs/CRM_DEVELOPER_REQUIREMENTS.md`; brochure PDF (`brochure.href`).
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

## Launch checklist (20-point) — 2026-09-07

| # | Item | Status | Notes |
|---|---|---|---|
| 1 | Privacy policy page | Page exists, copy pending | `/privacy-policy` renders honest "being finalised" text; the legal wording must come from the client. It should cover: enquiry data sent to the CRM, GTM cookies (analytics / ads, consent-gated), session-only attribution storage. |
| 2 | Terms & conditions page | Page exists, copy pending | Same as above for `/terms`. |
| 3 | Secrets off the frontend | Done | Only `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` are public; the webhook URL is server-only. Verified by grep and bundle review. |
| 4 | Force HTTPS | Done | Vercel redirects http→https at the edge; HSTS (2 years, subdomains) is sent by the app. |
| 5 | Cookie consent banner | Done | Google Consent Mode v2: all non-essential storage denied by default before GTM loads; banner Accept/Decline; choice persisted and restored before GTM on later visits; "Cookie preferences" in the footer re-opens it. |
| 6 | Meta titles + descriptions | Done | Per page, with canonicals and per-page OpenGraph. |
| 7 | Social preview image | Done | Generated 1200×630 OG/Twitter image from the approved lockup. |
| 8 | Favicon | Done | Dynamic favicon (64px) plus Apple touch icon (180px), both from the approved mark. |
| 9 | Sitemap + robots.txt | Done | Both generated; indexable only once the real domain is configured. |
| 10 | Alt text on images | Done | 0 images without `alt`; decorative images use `alt=""`. |
| 11 | Compress images | Done | All raster images go through `next/image`; the mobile location source re-encoded PNG 2.7 MB → JPEG 0.5 MB; hero film 1080p WebM/MP4. |
| 12 | Page load speed | Done | Lighthouse Performance 100 desktop / 86 mobile; CLS 0. |
| 13 | Colour contrast | Done | axe colour-contrast rule: 0 violations on every route, viewport and the consent bar. |
| 14 | Mobile friendly | Done, two visual caveats | No overflow at 360–820 px; touch targets fine. Caveats: hero film crops its title letters on portrait phones (needs a portrait cut); mobile Location uses interim artwork. |
| 15 | Custom 404 page | Done | Branded, returns HTTP 404. |
| 16 | Fix broken links | Done | Crawled every anchor on all routes: header/footer section links were hash-only and did nothing on the legal pages — now absolute (`/#section`). External 3D link cannot be reached from the audit sandbox; check once by hand. |
| 17 | Form validation | Done | Client + server validation; phone 7–15 digits; consent required. |
| 18 | Spam protection | Done | Honeypot field + 1.5 s time-to-submit floor, enforced server-side before the CRM is called. No third-party service, no keys. Add Cloudflare Turnstile later only if spam volume warrants it. |
| 19 | Analytics | Done | GTM container `GTM-MHNRSR6J`, consent-gated. Tags are configured inside GTM. |
| 20 | One clear call to action | Done | "Schedule a Private Viewing" is the single primary CTA in the header, checkpoint section and mobile bar; "Enquire" is secondary. |

## Deliberately not done

- No Content-Security-Policy header: the client will configure tags
  (GA4, ad pixels) inside GTM without code changes, and a strict CSP
  would silently block each new vendor domain. Revisit with an
  allow-list once the tag set is final.
- No third-party CAPTCHA: honeypot + timing cover the common bot traffic
  without keys or a vendor; escalate to Turnstile only if spam appears.
