# Yamuna Sky City — notes for Claude Code

Marketing website for the Yamuna Sky City residential tower (Kulai,
Mangalore) by Yamuna Homes and Design Pvt. Ltd. Next.js 16 App Router,
React 19, TypeScript, Tailwind v4. Hosted on Vercel.

## Branches and deployment (important)
- Work on `claude/yamuna-sky-city-rebuild-lnm5dd`. Every push there deploys
  the preview at https://yamuna-sky-city.vercel.app.
- `main` is production (https://yamunaskycity.com). Never push to `main`
  unless the person says "push to production" in the current session;
  then fast-forward it: `git push origin origin/<working-branch>:main`.
- Keep commits small and separately revertible. Conventional commit
  messages (`feat:`, `fix:`, `content(journal):`, `perf(hero):` ...).

## Content rules
- No invented facts. Project figures come from `content/*.ts` and the
  brochure in `public/media/brochure/`; if a claim has no source, leave it
  out and flag it rather than guess.
- Brand: Ember #B42810, Pearl Ivory, Black, Mist Grey; Poppins, Inter,
  Cormorant Garamond. Logo artwork only through `components/ui/Logo.tsx`.
- Journal articles are Markdown in `content/blog/articles/`; see
  `docs/JOURNAL.md` for the frontmatter and authoring rules.

## Secrets
- `ENQUIRY_WEBHOOK_URL`, `ENQUIRY_WEBHOOK_SECRET`, `LEADS_SHEET_WEBHOOK_URL`,
  `LEADS_SHEET_WEBHOOK_SECRET` live only in Vercel. Never commit them and
  never expose them under `NEXT_PUBLIC_`.
- Visitor-facing error text stays generic; it must never reveal which
  backend failed.

## Everyday commands
- `npm run dev` for local work; `npx tsc --noEmit && npm run lint && npm run build`
  before every commit.
- `/site-checkup` runs the full live + local health check
  (`.claude/commands/site-checkup.md`).

## Docs worth reading first
`docs/GO_LIVE_CHECKLIST.md`, `docs/CRM_INTEGRATION.md`,
`docs/GOOGLE_SHEETS_LEADS.md`, `docs/JOURNAL.md`, `docs/PRODUCTION_AUDIT.md`.
