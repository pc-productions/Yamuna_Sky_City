---
description: Full health check of yamunaskycity.com (live site + local build). Read-only unless told otherwise.
---

Run a complete checkup of the Yamuna Sky City website and report what you
find. Do not change any file, commit, push, or submit the enquiry form
unless the person explicitly asks for it in this session. Read CLAUDE.md
first for the branch and deployment rules.

Site: https://yamunaskycity.com (production, branch `main`).
Preview: https://yamuna-sky-city.vercel.app (branch `claude/yamuna-sky-city-rebuild-lnm5dd`).

Work through every section below, using curl, node scripts and the tools
already in the repo. Where a check fails, keep going and collect the
failures. Finish with a short report: a pass/fail table per section, then
the failures with the exact URL or file and what you observed.

## 1. Live site: availability and redirects
- `GET /`, `/blog`, `/privacy-policy`, `/terms`, `/robots.txt`,
  `/sitemap.xml`, `/favicon.ico`, `/opengraph-image` must return 200.
- `https://www.yamunaskycity.com/` must 308 to the bare domain.
- `http://yamunaskycity.com/` must redirect to https.
- Old WordPress paths `/brochure`, `/amenities`, `/contact-me` must 308 to
  the matching section on `/`.
- The six retired Journal slugs listed in `next.config.ts` must 308 to
  their replacement articles, and the replacements must return 200.
- A random unknown path must return 404 with the site's own 404 page.

## 2. Live site: SEO and metadata
- `robots.txt` allows crawling and points at the sitemap on the bare
  domain. No `noindex` header or meta on production pages.
- Every URL in `sitemap.xml` returns 200; count the `/blog/` article URLs
  and compare with the number of published `.md` files in
  `content/blog/articles` (files without `draft: true` and a past date).
- Home, `/blog` and one article each have: one `<h1>`, a `<title>`, a
  meta description, a canonical on the bare domain, `og:title`,
  `og:image` (fetch it, expect 200 and an image content-type), and valid
  JSON-LD (parse it; expect Organization/WebSite on home, Article and
  BreadcrumbList on an article).
- Article Open Graph route `/blog/<slug>/opengraph-image` returns a PNG.

## 3. Live site: headers and security
- Response headers on `/` include: `strict-transport-security`,
  `x-content-type-options: nosniff`, `x-frame-options: SAMEORIGIN`,
  `referrer-policy`, `permissions-policy`, `cross-origin-opener-policy`.
  `x-powered-by` must be absent.
- `/media/*` responses carry the `Cache-Control` from `next.config.ts`.
- No secret or webhook URL appears anywhere in the HTML or JS served to
  the browser (grep the fetched HTML and the `/_next/static` chunks
  referenced by the home page for `hooks.`, `n8n`, `script.google`,
  `webhook`, `secret`).

## 4. Live site: content spot checks
- `/privacy-policy` mentions Meta Platforms, Google Tag Manager, the
  cookie bar and shows "Last updated: 1 September 2026".
- Footer on `/` shows the RERA number, both phone numbers, the sales
  email and the Instagram link.
- Home page contains the hero video source on `res.cloudinary.com` and
  a preconnect to it.
- `/blog` lists the same article count as section 2 and every card image
  returns 200.

## 5. Live site: performance
- Run Lighthouse against `https://yamunaskycity.com/` and one article,
  mobile and desktop:
  `npx lighthouse <url> --preset=perf --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=<file> --chrome-flags="--headless=new" --quiet`
  (use `--preset=desktop` for desktop). Report the four scores, LCP,
  TBT and CLS. Flag SEO below 100 or performance below 85 mobile / 95
  desktop, and list the top three opportunities Lighthouse names.

## 6. Local: the code still builds cleanly
- `npm ci` (or `npm install` if there is no lockfile change),
  `npx tsc --noEmit`, `npm run lint`, `npm run build`. All must pass with
  no errors. Note any warnings.
- Confirm the working tree is clean and which commit `main` and the
  working branch are on (`git status`, `git log --oneline -3 origin/main`
  after `git fetch`). Report whether the working branch is ahead of
  `main`, listing the unreleased commits.

## 7. Local: Journal integrity
- Every article's `featuredImage` and every inline image path exists
  under `public/`.
- Every article `category` exists in `content/blog/categories.ts`.
- Internal links inside articles (`/blog/...`, `/#section`) resolve: the
  slug exists, or the anchor id exists in a component under
  `components/sections`.
- No article body contains a link to `yamunabuilders.com` other than the
  developer-site links that are deliberate, and none contains
  `utm_source=chatgpt`.

## 8. Enquiry pipeline (read-only by default)
- Confirm `lib/actions/submitEnquiry.ts` still references
  `ENQUIRY_WEBHOOK_URL`, `ENQUIRY_WEBHOOK_SECRET`,
  `LEADS_SHEET_WEBHOOK_URL` and `LEADS_SHEET_WEBHOOK_SECRET` from
  `process.env` and nothing under `NEXT_PUBLIC_`.
- Confirm `.env.example` lists those four names and that no `.env*` file
  with real values is tracked by git.
- Do NOT submit the live form. If, and only if, the person asks for an
  end-to-end test in this session, submit one enquiry with the name
  prefixed `Google-TEST-`, confirm the success state appears and the
  brochure link works, then remind them to delete the test row and to
  tell the CRM team to delete the test lead.

## 9. Report
Give the pass/fail table, then failures, then anything that looks off
even if it passed (slow responses, large payloads, warnings). Keep it
short. Do not propose code changes unless something failed.
