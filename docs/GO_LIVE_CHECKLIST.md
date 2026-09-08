# Go-Live Checklist — yamunaskycity.com

Status as of 7 September 2026. The build is production-hardened (lint,
typecheck, build, accessibility, Lighthouse and runtime checks all pass
on the current head). What remains is almost entirely inputs and
decisions that only the project team can make. Items are grouped by
whether launch should wait for them.

Legend: **[Team]** needs the client / project team · **[CRM dev]** needs
the CRM developer · **[Dev]** website change, ready to do on request.

---

## Lead ledger (new)

- [ ] Google Sheet created, Apps Script deployed, `LEADS_SHEET_WEBHOOK_URL` + `LEADS_SHEET_WEBHOOK_SECRET` set in Vercel Production (docs/GOOGLE_SHEETS_LEADS.md). Test lead appears in the sheet.

## Branch policy (in force)

- Vercel Production environment tracks `main`; the Claude working branch deploys as Preview only.
- Changes are pushed to the working branch by default. "Push to production" fast-forwards `main`.

## A. Blocking — do not switch DNS until these are done

1. **Domain on Vercel** [Team]
   Add `yamunaskycity.com` and `www.yamunaskycity.com` to the Vercel
   project. Decide the canonical host (recommend `www`) and let Vercel
   308-redirect the other to it. SSL is automatic.

2. **`NEXT_PUBLIC_SITE_URL` in Vercel → Production** [Team]
   Set to the canonical origin, e.g. `https://www.yamunaskycity.com`,
   then redeploy. Until this is set the site is deliberately `noindex`
   and ships placeholder canonical / sitemap URLs. Setting it turns on
   indexing, per-page canonicals, `sitemap.xml`, `robots.txt` allow,
   Organization + WebSite structured data and correct OG/Twitter URLs.

3. **CRM workflow activated + secret set** [CRM dev / Team]
   SparkOs answered the requirements document on 8 Sep 2026 (contract in
   `docs/CRM_INTEGRATION.md`). Two things remain: the n8n workflow must
   be **active** (the live test on 8 Sep still got 404 "not registered"),
   and `ENQUIRY_WEBHOOK_SECRET` must be set in Vercel Production
   alongside `ENQUIRY_WEBHOOK_URL` (without it every lead is answered
   401). Until both are done, leads land only in the Google Sheet marked
   `noted_in_crm` FALSE and visitors get the brochure on their second
   submit. Then: one test lead named `Google-TEST-website` from the live
   domain, confirmed by SparkOs and deleted; the sheet row must show TRUE.
   Still owed by SparkOs: the fixed campaign ID / owner values they asked
   for.

4. **Mailbox `sales@yamunaskycity.com` exists and is monitored** [Team]
   It is printed in the footer and the privacy policy (from the
   brochure). If the domain's email is not yet set up (MX / SPF / DKIM
   at the registrar), either set it up or tell us to switch the site
   back to `yamunahomes16@gmail.com`.

5. **WhatsApp number is WhatsApp-enabled** [Team]
   `+91 88844 39155` is wired into three places (desktop button, mobile
   bar, form). Confirm it is a live WhatsApp Business number.

6. **Legal sign-off** [Team]
   - Privacy Policy: review the draft, supply the **Grievance Officer
     name and email** (required under the DPDP Act) and the approval
     date (`legal.grievanceOfficer`, `legal.privacyLastUpdated` in
     `content/site.ts`).
   - **Terms & Conditions** copy — the page still shows "being
     finalised".
   - Footer disclaimer wording and the RERA line as displayed.

7. **Intro film decision** [Team → Dev]
   No intro film has been supplied. Today a first-time visitor sees a
   6-second poster overlay with a progress bar before the hero. Either
   supply the film (20–30 s, MP4 H.264, `content/media.ts`) or tell us
   to **disable the intro** until it exists (one-line change; the hero
   then plays immediately).

8. **Fact approvals** [Team]
   Two figures on the page are not backed by the brochure:
   - "300 m from the Arabian Sea" — brochure says 300 m on one page and
     250 m on another.
   - "3+ acres of greenery" — brochure gives 18,795 sq ft landscaped
     area on the 3rd floor instead.
   Also confirm the headline claim "South India's Tallest Sea-View
   Tower" is one the company is prepared to stand behind in advertising.

## B. Strongly recommended before launch

9. **Real-device QA on iPhone (Safari) and one Android phone** [Team/Dev]
   Everything is verified in emulation; iOS Safari deserves a hands-on
   pass for the sticky hero, autoplay of the muted film (Low Power Mode
   shows the poster instead), the bottom bar and the cookie bar.

10. **Portrait hero crop on phones** [Team]
    The 16:9 film's baked-in title letters crop into fragments on
    portrait screens. A portrait cut of the film fixes it
    (`content/media.ts` already accepts per-breakpoint sources).

11. **Google Tag Manager tags** [Team / agency]
    The container is installed and consent-gated. Configure inside GTM:
    GA4, Google Ads conversion for `whatsapp_click` (placements
    `floating` and `mobile-bar`), and keep every tag's built-in consent
    checks on. **[Dev]** we can add an `enquiry_submitted` dataLayer
    event on confirmed form success so form conversions can be tracked
    too — say the word.

12. **Google Search Console** [Team]
    Verify the property (HTML-tag method → set
    `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` in Vercel) and submit
    `/sitemap.xml` after the domain is live.

13. **Retire the old draft site** [Team]
    `sky-city-yamuna.vercel.app` (the earlier build) should be taken
    down or redirected to the new domain to avoid duplicate content.

14. **Social profiles** [Team]
    Facebook / Instagram / LinkedIn / YouTube URLs, or leave hidden
    (they stay hidden while empty).

15. **Brochure sign-off** [Team]
    The web copy of the brochure is the client PDF compressed to
    9.8 MB with images capped at 2000 px. Confirm this quality is
    acceptable for public download, or supply a print-quality link.

16. **3D experience link** [Team]
    Confirm `https://www.turiya.co/360/YamunaSkyCity/` is the final,
    public URL (could not be reached from our sandbox).

## C. First week after launch

17. Run Lighthouse and the enquiry flow on the live domain; watch Vercel
    logs for `[enquiry]` lines during the first days.
18. Check Search Console for indexing of `/`, `/privacy-policy`,
    `/terms`; check the OG card via a link-preview tool.
19. Decide on the two hidden sections: **People Behind** (content ready,
    switched off) and **Legacy** (no verified content yet).
20. Consider Cloudflare Turnstile only if the honeypot + timing checks
    let spam through.

---

## Go-live sequence (once A is complete)

1. Set `NEXT_PUBLIC_SITE_URL` (and the Search Console token) in Vercel
   Production → redeploy.
2. Attach the domain, confirm the 308 redirect and HTTPS.
3. From the live domain: submit a test enquiry, confirm it in the CRM,
   delete it; tap WhatsApp on a phone; download the brochure.
4. Verify `https://www.yamunaskycity.com/robots.txt` shows `Allow: /`
   and `sitemap.xml` lists the real domain.
5. Submit the sitemap in Search Console.
