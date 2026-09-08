import { Marked, type Tokens } from "marked";
import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * Markdown → HTML for Journal articles. Server-side only, at build time.
 *
 * The renderer is tuned for the editorial reading column rather than
 * generic HTML:
 *  - h2/h3 get stable ids (anchor links, table of contents later);
 *  - images become <figure> with an optional caption (the Markdown
 *    title, `![alt](src "caption")`), carry intrinsic width/height (no
 *    layout shift), lazy-load, and are served through Next's image
 *    optimizer (`/_next/image` srcset → WebP/AVIF, responsive sizes)
 *    exactly as next/image would — without shipping any client JS;
 *  - links to the website's own pages are marked `data-track="project"`
 *    so the article's click tracking can report them; external links
 *    open in a new tab with rel="noopener";
 *  - tables are wrapped so they scroll instead of breaking the column.
 *
 * Article content is repo-owned (never user input), so no sanitiser is
 * needed. Markdown authoring rules: docs/JOURNAL.md.
 */

/** Widths Next's optimizer accepts by default (deviceSizes). */
const SRCSET_WIDTHS = [640, 750, 828, 1080, 1200, 1920];
/** The reading column is ~46rem; images never need more than that at 1x. */
const INLINE_SIZES = "(min-width: 48rem) 46rem, 100vw";

function optimizedSrc(src: string, width: number): string {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z]+;/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

/** Intrinsic size of a repo-owned JPEG/PNG under /public (header parse only). */
export function imageDimensions(publicPath: string): { width: number; height: number } | undefined {
  try {
    const buf = readFileSync(path.join(process.cwd(), "public", publicPath));
    // PNG: IHDR at byte 16
    if (buf[0] === 0x89 && buf.toString("ascii", 1, 4) === "PNG") {
      return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
    }
    // JPEG: walk segments to the first SOF marker
    if (buf[0] === 0xff && buf[1] === 0xd8) {
      let i = 2;
      while (i < buf.length) {
        if (buf[i] !== 0xff) return undefined;
        const marker = buf[i + 1];
        const len = buf.readUInt16BE(i + 2);
        if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
          return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
        }
        i += 2 + len;
      }
    }
  } catch {
    // Missing file: the build's article audit reports it; render without dimensions.
  }
  return undefined;
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function renderMarkdown(markdown: string): string {
  const marked = new Marked({ gfm: true, breaks: false });

  marked.use({
    renderer: {
      heading({ tokens, depth }: Tokens.Heading) {
        const text = this.parser.parseInline(tokens);
        // H1 is reserved for the article title rendered by the page.
        const level = depth === 1 ? 2 : depth;
        const id = slugifyHeading(text);
        return `<h${level} id="${id}">${text}</h${level}>\n`;
      },
      image({ href, title, text }: Tokens.Image) {
        const dims = href.startsWith("/") ? imageDimensions(href) : undefined;
        const local = href.startsWith("/");
        const srcset = local
          ? ` srcset="${SRCSET_WIDTHS.map((w) => `${optimizedSrc(href, w)} ${w}w`).join(", ")}" sizes="${INLINE_SIZES}"`
          : "";
        const src = local ? optimizedSrc(href, 1200) : href;
        const size = dims ? ` width="${dims.width}" height="${dims.height}"` : "";
        const img = `<img src="${escapeAttr(src)}"${srcset}${size} alt="${escapeAttr(text)}" loading="lazy" decoding="async">`;
        const caption = title ? `<figcaption>${escapeAttr(title)}</figcaption>` : "";
        return `<figure>${img}${caption}</figure>\n`;
      },
      link({ href, title, tokens }: Tokens.Link) {
        const text = this.parser.parseInline(tokens);
        const titleAttr = title ? ` title="${escapeAttr(title)}"` : "";
        const external = /^https?:\/\//.test(href);
        if (external) {
          return `<a href="${escapeAttr(href)}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`;
        }
        const track = href.startsWith("/blog/") ? "article" : href.startsWith("/") ? "project" : "";
        const trackAttr = track ? ` data-track="${track}"` : "";
        return `<a href="${escapeAttr(href)}"${titleAttr}${trackAttr}>${text}</a>`;
      },
      table({ header, rows }: Tokens.Table) {
        const cell = (c: Tokens.TableCell, tag: "th" | "td") => {
          const align = c.align ? ` style="text-align:${c.align}"` : "";
          return `<${tag}${align}>${this.parser.parseInline(c.tokens)}</${tag}>`;
        };
        const head = `<thead><tr>${header.map((c) => cell(c, "th")).join("")}</tr></thead>`;
        const body = `<tbody>${rows.map((r) => `<tr>${r.map((c) => cell(c, "td")).join("")}</tr>`).join("")}</tbody>`;
        // Keyboard users must be able to reach a scrollable region.
        return `<div class="table-scroll" role="region" aria-label="Table" tabindex="0"><table>${head}${body}</table></div>\n`;
      },
    },
  });

  return marked.parse(markdown) as string;
}

/** Plain-text word count of a Markdown body (for reading time). */
export function countWords(markdown: string): number {
  const text = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`|-]/g, " ");
  return text.split(/\s+/).filter(Boolean).length;
}
