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
- `components/ui/` — layout/typography/media primitives (`Container`, `SectionHeading`, `Stat`, `Button`, `Reveal`, `RevealLines`, `VideoBackground`).
- `lib/motion.ts` + `components/motion/` — the **global motion system**: one set of durations/easings/distances (`lib/motion.ts`, mirrored as CSS variables in `globals.css`), the smooth-scroll provider (`SmoothScroll`, Lenis — wheel only, off on touch and under reduced motion, synced with GSAP ScrollTrigger, anchor-aware) and `ParallaxMedia`. `Reveal` has four variants (fade / lines / image / stagger) so different content types move differently but always in the same language; markup is authored in its finished state so reduced-motion and no-JS visitors see the complete page. The hero is a sticky backdrop that later sections slide over (`main > section` rule in `globals.css`).
- `components/forms/` + `lib/hooks/useEnquiryForm.ts` + `lib/validation.ts` — the shared enquiry form logic used by both the Contact section and the Enquiry modal.
- `lib/actions/submitEnquiry.ts` — the one place leads leave the website, sending each lead to `lib/integrations/crm.ts` (CRM) and then `lib/integrations/sheets.ts` (Google Sheets ledger) in sequence, the sheet row carrying the CRM's verdict (see below).
- `content/blog/articles/*.md` + `lib/blog/*` + `app/blog/*` — the **Journal** (SEO blog): Markdown articles, statically generated at `/blog`, `/blog/<slug>` and `/blog/category/<slug>`, with per-article metadata, social cards, JSON-LD and automatic sitemap entries. How to add an article: `docs/JOURNAL.md`.

## Wiring up a lead backend

Every lead gets a website-issued reference (`YSC-YYYYMMDD-XXXXXXXX`) and goes to **two independent destinations** from the server action (`lib/actions/submitEnquiry.ts`), CRM first, then the sheet carrying the CRM verdict (`noted_in_crm` TRUE/FALSE + `crm_note`):

1. the CRM webhook — `lib/integrations/crm.ts`, `ENQUIRY_WEBHOOK_URL` (see `docs/CRM_INTEGRATION.md`);
2. the **Google Sheets lead ledger** — `lib/integrations/sheets.ts`, `LEADS_SHEET_WEBHOOK_URL` + `LEADS_SHEET_WEBHOOK_SECRET`, the business's own record of every lead, independent of the CRM provider (setup: `docs/GOOGLE_SHEETS_LEADS.md`, script: `integrations/google-sheets/Code.gs`).

The sheet row is written whatever the CRM returned, so the sheet itself lists the leads that still need a manual CRM push. Brochure policy (enforced server-side in `lib/actions/submitEnquiry.ts`): the visitor gets the thank-you screen and brochure when the CRM accepts the lead; if the CRM fails they are asked to submit once more (same reference, via a signed retry token); if it fails a second time and the sheet holds the lead, the brochure is released on the sheet alone so a CRM outage never costs a client. While neither destination is configured the form shows an honest "not available yet" message and never fakes a submission.

Never expose backend credentials via `NEXT_PUBLIC_*` variables; keep integration secrets server-only.

## Content rules

Only verified, explicitly supplied project facts belong in `content/*.ts`. Do not invent locations, addresses, distances, history, statistics, or positioning claims — and do not infer geography from the project name. Fields left empty (`""` / `[]`) are treated as "not configured": the dependent UI (footer contact rows, WhatsApp CTAs, RERA line, the People Behind and Legacy sections) hides itself until real data is added.

## Intentionally unconfigured (resolve before launch)

- **Hero video**: DONE — the supplied 4K master is optimized to `public/media/video/hero-1080.{mp4,webm}` (1080p30, muted, faststart; WebM preferred where supported) with the first frame as `hero-poster.jpg`. On narrow portrait screens the 16:9 crop trims the film's flanking title words; supply a portrait cut and branch in `content/media.ts` if that matters.
- **Intro video**: still not supplied. The section renders its poster/fallback gracefully; drop the file into `public/media/video/` and set `introVideo.src` in `content/media.ts`. The entry flow is an explicit state machine (`IntroExperience`: resolving → intro → hero) so the hero video only activates after the intro completes, is skipped, or is ineligible.
- **Location artwork**: DONE — desktop uses the clean aerial render (`public/media/location/tower-aerial.jpg`, 1672×941) with a programmatic GSAP/SVG connectivity overlay driven by `content/location.ts`; below `lg` the approved mobile composition `mbl_loc_img.png` (1448×1086, labels and travel times matching the content layer) is served through `next/image`, so visitors receive an optimised derivative rather than the 2.7 MB source. Keep the two in sync if travel times change: desktop from `content/location.ts`, mobile by re-exporting the artwork.
- **Private-viewing background, 3D preview**: placeholder SVGs in `public/media/`, swap via `content/media.ts`.
- **People behind the project** (`content/people.ts`): DONE — the project team (architect, structural, wind, geotechnical, MEP, PMC, landscape, piling, civil, formwork) is reproduced exactly from the official brochure; the section is complete but **switched off for launch** by client decision (`sectionVisibility.peopleBehind` in `content/site.ts` — flip to `true` to show it). **Yamuna's Legacy** (`content/legacy.ts`) remains **switched off** via `sectionVisibility` in `content/site.ts` until verified history/figures exist (the brochure carries none).
- **Brochure**: DONE — the official final-edition brochure ships at `public/media/brochure/Yamuna-Sky-City-Brochure.pdf` (web-optimised) and is offered after a confirmed enquiry via `brochure.href`.
- **Contact details, WhatsApp number, RERA number, legal entity** (`content/site.ts`): DONE — taken from the client's earlier site build (SkyCity draft). They drive the footer rows, the WhatsApp CTAs (form button, desktop floating control `components/layout/FloatingWhatsApp.tsx`), the privacy-policy contact block and Organization JSON-LD. **Social profiles and Twitter handle** remain empty (the draft only had placeholder links); **grievance officer** name is still to be confirmed.
- **3D experience URL**: DONE — configured in `content/site.ts` (clearing it falls back to a link-less "Coming Soon" preview). **Production domain**: set `NEXT_PUBLIC_SITE_URL` in the deploy environment (see Launch checklist below).
- **Temporary visuals** (intro poster, private-viewing background, 3D preview): neutral brand-toned graphics with no development labels; marked TEMPORARY in the SVG sources — replace via `content/media.ts`.
- **Privacy Policy** (`content/privacy.ts`): a full draft describing exactly what the site does (enquiry data → CRM, consent-gated GTM tags, session-only attribution), awaiting legal sign-off. Fill `legal.entityName`, `legal.grievanceOfficer` and `legal.privacyLastUpdated` in `content/site.ts`; until then the policy uses the brand name and states that contact details will be published. **Terms** (`app/terms`): honest "being finalised" copy until the confirmed legal text is supplied.
- **Lead backend**: see above — not connected by default.

## Branches and deployment

- `main` is **production**: Vercel's Production environment tracks it, and the
  .com domain will point at it. Nothing reaches production without a push to
  `main`.
- `claude/yamuna-sky-city-rebuild-lnm5dd` is the **working branch**: every
  change lands here first and gets a Vercel **Preview** URL. Review there.
- Promotion is an explicit step: fast-forward `main` to the reviewed commit
  (`git push origin <branch>:main`). When working with Claude, the phrase
  **"push to production"** triggers exactly that; otherwise pushes go to the
  working branch only.

## Launch checklist

The build is production-hardened (security headers, env-driven canonical
domain with an automatic noindex guard, branded 404/error pages, honest
not-configured states everywhere). Before go-live, supply the inputs only
the project team can confirm:

1. **Domain** — set `NEXT_PUBLIC_SITE_URL=https://<confirmed-domain>` in the
   deploy environment. Until it is set, the site serves `noindex` robots and
   omits structured data, so a misconfigured deploy can never be indexed
   with placeholder URLs.
2. **Lead backend / CRM** — set `ENQUIRY_WEBHOOK_URL` (server-only, in
   Vercel) to the CRM developer's n8n webhook recorded in
   `docs/CRM_INTEGRATION.md`; each enquiry is POSTed as
   `{ name, email, phone, project, details }` and the form shows the
   thank-you/brochure state only after the webhook answers 2xx. Until
   the variable is set the form is honest about being unavailable. The
   mapping lives in `lib/integrations/crm.ts`; open points to confirm
   with the CRM developer (key names, auth, response) are in the same doc.
   Brochure access: set `brochure.href` in `content/site.ts` once the
   approved PDF exists.
3. **Contact details** — DONE (phone, email, address, WhatsApp in
   `content/site.ts`).
4. **RERA number** — DONE (`legal.reraNumber`). **Legal copy** — Privacy
   Policy drafted (needs sign-off + grievance officer name); Terms pending.
5. **Remaining content** — intro film (`content/media.ts`), People Behind
   (`content/people.ts`), Legacy figures (`content/legacy.ts`), social
   profiles and Twitter handle (`content/site.ts`).
6. **Analytics** — Google Tag Manager is integrated (container
   `GTM-MHNRSR6J`, `content/site.ts` → `analytics.gtmId`; override or
   disable per environment with `NEXT_PUBLIC_GTM_ID`). Configure the
   actual tags (GA4, ads pixels, conversions) inside the GTM container —
   no code changes needed. Google Consent Mode v2 is wired in: every
   non-essential storage type is denied until the visitor accepts the
   cookie bar (`components/layout/CookieConsent.tsx`, `lib/consent.ts`),
   so tags in the container must keep their built-in consent checks on.
7. **Search** — once `NEXT_PUBLIC_SITE_URL` is set the site becomes
   indexable automatically: `index,follow` robots, per-page canonicals,
   `sitemap.xml`, Organization + WebSite JSON-LD and branded OG/Twitter
   cards. Then: (a) in Vercel, attach the domain and make the non-canonical
   host (www vs apex) a 308 redirect to the canonical one; (b) verify the
   property in Google Search Console — set
   `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` to the HTML-tag token — and
   submit `/sitemap.xml`; (c) re-run Lighthouse on the live URL (the SEO
   category can only pass once the site is crawlable).

`npm run lint && npm run build` must pass before every deploy; both are
clean at the current head.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — run a production build
- `npm run lint` — ESLint
