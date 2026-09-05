# Yamuna Sky City

Production website for Yamuna Sky City — Next.js (App Router) + TypeScript + Tailwind CSS v4.

## Brand system

The official Brand Guidelines PDF is the single source of truth for identity.

- **Palette**: SkyCity Ember `#B42810`, Pearl Ivory `#F7F0E6`, Black `#000000`, Mist Grey `#C6C7C8` — defined once in `app/globals.css` behind semantic tokens (`brand`, `paper`, `ink`, `night`, `line`, …). Composition principle: the site reads ~60% Ivory / 30% Ember / 7% Black / 3% Mist Grey overall.
- **Typography**: Poppins (Semibold/Medium, UPPERCASE, tight tracking) for headings; Inter (Regular/Medium, sentence case) for body/UI. Hierarchy reference: H1 48px / H2 32px, scaled responsively.
- **Logo**: approved artwork extracted from the guidelines lives in `public/media/brand/` (mark / wordmark / lockup × primary / reversed / dark / mono). Render marks only through `components/ui/Logo.tsx` — never text recreations, never CSS recolouring. The header cross-fades primary ↔ dark-application assets per background; the footer carries the dark lockup with the official tagline ("The Pinnacle of South India") beneath it.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Where things live

- `app/` — routes, root layout, SEO metadata (`layout.tsx`), sitemap/robots, dynamic OG/Twitter/favicon images.
- `content/` — **single source of truth for editable content.** Project facts, nav links, CTA labels, contact/WhatsApp details, external URLs (e.g. the 3D experience), people/legacy data, form field definitions, and media source paths all live here as typed objects. Update these files, not the components, for routine content changes.
- `components/sections/` — one file per homepage section (Hero, ProjectFacts, Location, etc.), each self-contained and independently reorderable. `app/page.tsx` is a flat, explicit, ordered list of these — reordering the homepage means reordering lines there.
- `components/layout/` — Header/nav, Footer, and the persistent CTA system (desktop CTAs live in the sticky Header; the mobile bottom bar is `PersistentCTA`). `SiteChrome` wires these together with the shared Enquiry modal state.
- `components/ui/` — layout/typography/media primitives (`Container`, `SectionHeading`, `Stat`, `Button`, `Reveal`, `VideoBackground`).
- `components/forms/` + `lib/hooks/useEnquiryForm.ts` + `lib/validation.ts` — the shared enquiry form logic used by both the Contact section and the Enquiry modal.
- `lib/actions/submitEnquiry.ts` — the one place a lead backend integration gets wired in (see below).

## Wiring up a lead backend

No CRM/email/API integration exists yet. While `ENQUIRY_WEBHOOK_URL` is unset, `lib/actions/submitEnquiry.ts` returns an explicit `not_configured` result and the form shows an honest "enquiries not available yet" message — it never fakes a successful submission. To connect a real backend:

1. Set `ENQUIRY_WEBHOOK_URL` (a server-only environment variable — see `.env.example`) to the endpoint that should receive submissions.
2. That's it — the function already POSTs the payload as JSON once the variable is set. No component changes needed.

Never expose backend credentials via `NEXT_PUBLIC_*` variables; keep integration secrets server-only.

## Content rules

Only verified, explicitly supplied project facts belong in `content/*.ts`. Do not invent locations, addresses, distances, history, statistics, or positioning claims — and do not infer geography from the project name. Fields left empty (`""` / `[]`) are treated as "not configured": the dependent UI (footer contact rows, WhatsApp CTAs, RERA line, the People Behind and Legacy sections) hides itself until real data is added.

## Intentionally unconfigured (resolve before launch)

- **Hero video**: DONE — the supplied 4K master is optimized to `public/media/video/hero-1080.{mp4,webm}` (1080p30, muted, faststart; WebM preferred where supported) with the first frame as `hero-poster.jpg`. On narrow portrait screens the 16:9 crop trims the film's flanking title words; supply a portrait cut and branch in `content/media.ts` if that matters.
- **Intro video**: still not supplied. The section renders its poster/fallback gracefully; drop the file into `public/media/video/` and set `introVideo.src` in `content/media.ts`. The entry flow is an explicit state machine (`IntroExperience`: resolving → intro → hero) so the hero video only activates after the intro completes, is skipped, or is ineligible.
- **Location artwork**: DONE — the approved "Perfectly Connected" artwork (1600×900) ships at `public/media/location/perfectly-connected.jpg`; travel-time data source of truth stays in `content/location.ts` and drives the mobile-only list below the image. For crisper large desktops, a higher-resolution export (e.g. 2400px wide) can replace the same path.
- **Private-viewing background, 3D preview**: placeholder SVGs in `public/media/`, swap via `content/media.ts`.
- **People behind the project** (`content/people.ts`) and **Yamuna's Legacy** (`content/legacy.ts`): data sources are empty; both sections currently render as minimal editorial statements (eyebrow + heading only) and expand to their full presentations automatically once verified entries/figures are added — nothing is invented, no placeholder rows are shown.
- **Contact details, WhatsApp number, RERA number, Twitter handle** (`content/site.ts`): empty until confirmed; dependent UI stays hidden.
- **3D experience URL**: DONE — configured in `content/site.ts` (clearing it falls back to a link-less "Coming Soon" preview). **Production domain**: set `NEXT_PUBLIC_SITE_URL` in the deploy environment (see Launch checklist below).
- **Temporary visuals** (intro poster, private-viewing background, 3D preview): neutral brand-toned graphics with no development labels; marked TEMPORARY in the SVG sources — replace via `content/media.ts`.
- **Privacy Policy / Terms pages** (`app/privacy-policy`, `app/terms`): honest "being finalised" copy until the confirmed legal text is supplied.
- **Lead backend**: see above — not connected by default.

## Launch checklist

The build is production-hardened (security headers, env-driven canonical
domain with an automatic noindex guard, branded 404/error pages, honest
not-configured states everywhere). Before go-live, supply the inputs only
the project team can confirm:

1. **Domain** — set `NEXT_PUBLIC_SITE_URL=https://<confirmed-domain>` in the
   deploy environment. Until it is set, the site serves `noindex` robots and
   omits structured data, so a misconfigured deploy can never be indexed
   with placeholder URLs.
2. **Lead backend** — set `ENQUIRY_WEBHOOK_URL` (server-only) so enquiry
   submissions are delivered; the form is honest about being unavailable
   until then.
3. **Contact details** — phone, email, address, WhatsApp number in
   `content/site.ts`; the dependent UI appears automatically.
4. **RERA number + legal copy** — `content/site.ts` (`legal.reraNumber`) and
   the Privacy Policy / Terms pages.
5. **Remaining content** — intro film (`content/media.ts`), People Behind
   (`content/people.ts`), Legacy figures (`content/legacy.ts`), social
   profiles and Twitter handle (`content/site.ts`).
6. **Analytics** — Google Tag Manager is integrated (container
   `GTM-MHNRSR6J`, `content/site.ts` → `analytics.gtmId`; override or
   disable per environment with `NEXT_PUBLIC_GTM_ID`). Configure the
   actual tags (GA4, ads pixels, conversions) inside the GTM container —
   no code changes needed.

`npm run lint && npm run build` must pass before every deploy; both are
clean at the current head.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — run a production build
- `npm run lint` — ESLint
