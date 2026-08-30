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

No CRM/email/API integration exists yet. `lib/actions/submitEnquiry.ts` currently logs submissions server-side and returns success so the UI is fully testable. To connect a real backend:

1. Set `ENQUIRY_WEBHOOK_URL` (a server-only environment variable — see `.env.example`) to the endpoint that should receive submissions.
2. That's it — the function already POSTs the payload as JSON once the variable is set. No component changes needed.

Never expose backend credentials via `NEXT_PUBLIC_*` variables; keep integration secrets server-only.

## Known placeholders (must be resolved before launch)

- **Video**: no cinematic intro or hero footage has been supplied. Both sections render their poster/fallback gracefully; drop real files into `public/media/video/` and set the `src` fields in `content/media.ts`.
- **Location diagram, private-viewing background, 3D preview**: placeholder SVGs in `public/media/`, swap via `content/media.ts`.
- **People behind the project** (`content/people.ts`) and **Yamuna's Legacy** stats/copy (`content/legacy.ts`): placeholder entries marked "To be confirmed" — no real names, organizations, or figures have been invented. Replace before launch.
- **Contact details, WhatsApp number, RERA number, legal disclaimer, 3D experience URL, production domain** (`content/site.ts`): marked with `TODO` comments.
- **Privacy Policy / Terms pages** (`app/privacy-policy`, `app/terms`): placeholder copy.
- **Lead backend**: see above — not connected by default.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — run a production build
- `npm run lint` — ESLint
