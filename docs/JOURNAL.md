# Journal (blog) — how it works and how to add an article

The Journal lives at `/blog`. It is file-based: every article is one
Markdown file, read at build time, statically generated. There is no
database, no CMS and no admin screen; publishing is a commit.

## Where things live

| Path | What |
|---|---|
| `content/blog/articles/<slug>.md` | One article per file; the file name is the URL slug |
| `content/blog/categories.ts` | The categories (slug, label, description). The only place category names exist |
| `content/blog/authors.ts` | Authors. Only the organisation today; add a person when the business supplies a real name |
| `lib/blog/articles.ts` | Reads, validates, sorts and filters the Markdown (published / draft / scheduled) |
| `lib/blog/markdown.ts` | Markdown → HTML: heading ids, `<figure>` images through the image optimizer, tracked links, scrollable tables |
| `lib/blog/seo.ts` | Metadata (title, description, canonical, Open Graph, Twitter) and JSON-LD (Article, BreadcrumbList, CollectionPage) |
| `lib/blog/analytics.ts` | The four dataLayer events |
| `app/blog/page.tsx` | Journal front: hero → featured article → category strip → grid → CTA |
| `app/blog/[slug]/page.tsx` | Article page (+ `opengraph-image.tsx` / `twitter-image.tsx`: per-article social card) |
| `app/blog/category/[category]/page.tsx` | One page per category with at least one published article |
| `components/journal/*` | Cards, featured story, category strip, breadcrumb, CTA, brochure button, tracking |
| `app/globals.css` → `.journal-prose` | The reading column's typography |

## Adding an article

1. Create `content/blog/articles/<slug>.md`. The slug must be lowercase
   kebab-case (`a-guide-to-buying-a-luxury-apartment-in-mangalore`); it
   becomes `/blog/<slug>` and is validated at build.
2. Fill in the frontmatter:

   ```yaml
   ---
   title: "Article title (this is the H1)"
   excerpt: "One or two sentences shown on cards and under the title."
   category: buying-guides          # a slug from content/blog/categories.ts
   author: yamuna-homes             # optional; defaults to the organisation
   publishedAt: 2026-09-08          # ISO date; a future date schedules it
   updatedAt: 2026-09-08            # optional; defaults to publishedAt
   featuredImage: /media/journal/coastline-clear.jpg   # under /public
   featuredImageAlt: "Describe what is in the picture."
   featuredImageCaption: "Optional caption under the picture."
   tags: [mangalore, buying-guide]  # optional; used for related articles
   seoTitle: "Optional <title>, ≤ 60 characters"      # defaults to title
   seoDescription: "Optional meta description, ≤ 160 characters"  # defaults to excerpt
   featured: false                  # true pins it as the lead story
   draft: false                     # true keeps it out of everything in production
   ---
   ```

3. Write the body in Markdown below the frontmatter. Do not add a
   `# H1` — the title is the H1. Start sections at `##` and use `###`
   underneath; never skip levels or use headings for emphasis.
4. Supported: paragraphs, **bold**, *italic*, ordered and unordered
   lists, `> blockquotes` (rendered as a serif pull-quote), links,
   tables, horizontal rules and images:

   ```markdown
   ![Alt text describing the photograph](/media/journal/photo.jpg "Optional caption")
   ```

   Images must be files under `/public` (JPEG or PNG). They are served
   through Next's image optimizer (WebP/AVIF, responsive sizes, lazy
   loading) with intrinsic dimensions so the page never shifts.
5. Link into the website with descriptive anchor text, e.g.
   `[explore the residences at Yamuna Sky City](/#project)`,
   `[discover the location](/#location)`, `[arrange a private viewing](/#contact)`,
   and to other articles as `/blog/<slug>`. Links into the website are
   reported to GTM as `blog_project_click` automatically.
6. Run `npm run build`. The build fails with a clear message if the
   frontmatter is incomplete, the category or author is unknown, or the
   slug is malformed. Commit and push; the article, its category page,
   its sitemap entry and its social card all exist on the next deploy.

Publishing rules: `draft: true` or a future `publishedAt` → not listed,
not in the sitemap, not built (404 in production). Locally (`npm run
dev`) unpublished articles still render at their URL for preview.

## Content rules

- Only verified project facts (content/site.ts, content/facts.ts, the
  brochure). No invented statistics, prices, yields, appreciation
  figures, infrastructure projects or government announcements. If a
  claim needs a source you do not have, leave it out.
- Keep the project's known ambiguities out of articles: the distance to
  the sea is printed as both 250 m and 300 m in the brochure, so say
  "a couple of minutes' walk"; the "3+ acres" figure is not in the
  brochure.
- One topic per article, one cluster per category. Deepen a subject
  rather than repeating a keyword across articles.
- Editorial tone: calm, specific, useful. The CTA at the end of the
  page is the only sales moment; the article itself should read as
  journalism.

## SEO, in one paragraph each

**Metadata.** `lib/blog/seo.ts` builds `<title>` (seoTitle or title,
with the site's " | Yamuna Sky City" template), the description
(seoDescription or excerpt), a self-referencing canonical
(`https://<domain>/blog/<slug>` — never with query strings), Open Graph
(`type: article`, published/modified time, section, tags) and a
`summary_large_image` Twitter card. The root layout's `metadataBase`
makes every URL absolute from `NEXT_PUBLIC_SITE_URL`.

**Social image.** `app/blog/[slug]/opengraph-image.tsx` renders a
1200×630 PNG per article: featured photograph, gradient, title,
category · date, and the approved dark lockup. Listing pages use the
site's brand image.

**Structured data.** Article pages emit `Article` (headline,
description, image, datePublished, dateModified, author, publisher →
the site Organization, mainEntityOfPage, articleSection, wordCount) and
`BreadcrumbList` (Home › Journal › Category › Article). The front emits
`CollectionPage` + breadcrumbs; category pages emit breadcrumbs. All of
it is only rendered once the real domain is configured, like the rest
of the site's JSON-LD.

**Sitemap and robots.** `app/sitemap.ts` reads the same article list,
so `/blog`, every active category and every published article are
listed automatically with their `updatedAt`. Robots already allow the
whole site once the domain is set; nothing blocks `/blog`.

**Internal links.** Articles link to the homepage sections by anchor
and to each other by slug; every article ends with the project CTA
(Explore Sky City → `/#project`; Request brochure → the existing
enquiry modal) and three related articles (same category first, then
shared tags).

## Analytics

Pushed to the existing GTM dataLayer (no second container, nothing
initialised twice):

| Event | When | Fields |
|---|---|---|
| `blog_article_view` | article page opened | slug, category |
| `blog_brochure_click` | Request brochure clicked | slug, placement |
| `blog_project_click` | a link into the main site clicked (CTA or in-body) | slug, href, placement |
| `blog_related_article_click` | a related-article card clicked | slug, to |

Configure triggers/tags for these names inside GTM.

## Later

- **Pagination**: the front shows every published article; add paging
  in `app/blog/page.tsx` once the archive is long (≈ 24+).
- **Headless CMS**: replace `readAll()` in `lib/blog/articles.ts` with a
  fetch that returns the same `Article` shape. Nothing else changes.
- **Photography**: the current featured images are the aerial
  photograph and three text-free frames from the hero film. Dedicated
  editorial photography per article would strengthen both the cards and
  the social previews.
