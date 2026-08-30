# Yamuna Sky City

Production website for Yamuna Sky City — Next.js (App Router) + TypeScript + Tailwind CSS v4.

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
- **3D experience URL**: DONE — configured in `content/site.ts` (clearing it falls back to a link-less "Coming Soon" preview). **Production domain**: still a `TODO` in `content/site.ts`.
- **Temporary visuals** (intro poster, private-viewing background, 3D preview): neutral brand-toned graphics with no development labels; marked TEMPORARY in the SVG sources — replace via `content/media.ts`.
- **Privacy Policy / Terms pages** (`app/privacy-policy`, `app/terms`): placeholder copy.
- **Lead backend**: see above — not connected by default.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — run a production build
- `npm run lint` — ESLint
