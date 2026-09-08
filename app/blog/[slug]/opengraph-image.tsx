import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { getCategory } from "@/content/blog/categories";
import { getArticle } from "@/lib/blog/articles";
import { formatDateShort } from "@/lib/blog/seo";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Yamuna Sky City Journal";

/**
 * Per-article social preview: the featured photograph under a dark
 * gradient, the title in white, the category and date, and the approved
 * dark-application lockup — so a shared link carries the article AND the
 * brand. Built from the same repo-owned assets as the site; nothing is
 * fetched.
 */
export default async function ArticleOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  const [lockup, photo] = await Promise.all([
    readFile(path.join(process.cwd(), "public/media/brand/lockup-dark.png")),
    article ? readFile(path.join(process.cwd(), "public", article.featuredImage)).catch(() => null) : null,
  ]);
  const lockupSrc = `data:image/png;base64,${lockup.toString("base64")}`;
  const mime = article?.featuredImage.endsWith(".png") ? "image/png" : "image/jpeg";
  const photoSrc = photo ? `data:${mime};base64,${photo.toString("base64")}` : null;
  const category = article ? getCategory(article.category)?.label : undefined;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#000000",
          fontFamily: "sans-serif",
        }}
      >
        {photoSrc && (
          <img src={photoSrc} width={1200} height={630} alt="" style={{ position: "absolute", inset: 0, objectFit: "cover", width: "100%", height: "100%" }} />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.88) 100%)",
          }}
        />
        <div style={{ position: "absolute", left: 72, top: 60, display: "flex" }}>
          <img src={lockupSrc} width={225} height={80} alt="" />
        </div>
        <div style={{ position: "absolute", left: 72, right: 72, bottom: 64, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 20, letterSpacing: 6, textTransform: "uppercase", color: "#F7F0E6", opacity: 0.9 }}>
            {[category, article ? formatDateShort(article.publishedAt) : ""].filter(Boolean).join("   ·   ")}
          </div>
          <div style={{ marginTop: 20, fontSize: 56, fontWeight: 700, lineHeight: 1.12, color: "#FFFFFF", letterSpacing: -1 }}>
            {article?.title ?? "Yamuna Journal"}
          </div>
          <div style={{ marginTop: 22, width: 64, height: 4, background: "#B42810" }} />
        </div>
      </div>
    ),
    { ...size },
  );
}
