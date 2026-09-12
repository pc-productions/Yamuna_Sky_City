---
description: Render every page across phone, foldable, tablet and desktop sizes, with touch emulation, and report layout or motion defects. Read-only.
---

Run a responsiveness audit of the Yamuna Sky City website and report
what you find. Do not change files, commit or push unless the person
asks in this session. Read CLAUDE.md first.

Target: https://yamunaskycity.com by default; use the preview
https://yamuna-sky-city.vercel.app if asked, or a local `npm run build
&& npm run start` if the network is blocked. Use Playwright with the
bundled Chromium (`npx playwright install chromium` if needed).

## Viewport matrix
Render each page at every size. `touch` means `isMobile: true,
hasTouch: true` in the browser context, which also makes the site's
`(pointer: coarse)` and `(hover: none)` media queries match.

| name | width x height | touch |
|---|---|---|
| phone-360 | 360 x 800 | yes |
| phone-390 | 390 x 844 | yes |
| phone-412 | 412 x 915 | yes |
| fold-closed | 344 x 882 | yes |
| fold-open-landscape | 836 x 697 | yes |
| fold-open-portrait | 884 x 1104 | yes |
| tablet-portrait | 768 x 1024 | yes |
| tablet-landscape | 1024 x 768 | yes |
| ipad-portrait | 834 x 1194 | yes |
| ipad-landscape | 1194 x 834 | yes |
| tablet-wide | 1280 x 800 | yes |
| laptop-720 | 1280 x 720 | no |
| laptop-768 | 1366 x 768 | no |
| desktop-900 | 1440 x 900 | no |
| desktop-1080 | 1920 x 1080 | no |

Pages: `/`, `/blog`, one article, `/blog/category/yamuna-sky-city`,
`/privacy-policy`, `/terms`, a 404.

## For every page x size
1. Load, dismiss nothing (set `localStorage.ysc-cookie-consent = "denied"`
   in an init script so the cookie bar does not cover content).
2. Scroll the whole page in steps of 60% of the viewport with ~120ms
   pauses, so scroll-triggered reveals fire as they would for a visitor,
   then wait 1s.
3. Record: horizontal overflow (`scrollWidth - clientWidth` must be 0);
   any element wider than the viewport; text that overflows its box;
   images with `naturalWidth === 0`; elements with `opacity < 1` that
   are inside the viewport 2s after scrolling past them (a reveal that
   never completed); console errors and page errors.
4. Take a full-page screenshot, plus a section screenshot of
   `#location` on `/` after waiting 7s for its entrance to settle.
5. On touch sizes: after a scroll gesture, sample `scrollY` every 250ms
   for 1.5s and report any drift; and confirm no element inside
   `#location` has a computed `backdrop-filter` (blur is mouse-only by
   design).
6. Open the mobile menu on phone and fold sizes and record the panel's
   height as a percentage of the viewport (expect under 50%).
7. Tap "Load more" on `/blog`, open the last card, go back, and confirm
   the grid is still expanded and the scroll position is unchanged.

## Report
A table of page x size with pass/fail, then every failure with the size,
the URL, the selector or a description, and the screenshot path. Look
at the screenshots yourself for anything the checks cannot measure:
cropped headings, overlapping labels in the Location overlay, cards
that look wrong, spacing that collapses. Do not propose code changes
unless something failed.
