import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { tagline } from "@/content/brand";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Pearl Ivory field with the approved primary lockup and the official
// tagline beneath it — generated at build time from the real asset.
export default async function OpengraphImage() {
  const lockup = await readFile(
    path.join(process.cwd(), "public/media/brand/lockup-primary.png"),
  );
  const lockupSrc = `data:image/png;base64,${lockup.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#F7F0E6",
        }}
      >
        <img src={lockupSrc} width={562} height={200} alt="" />
        <div
          style={{
            marginTop: 36,
            fontSize: 30,
            fontWeight: 600,
            color: "#B42810",
          }}
        >
          {tagline}
        </div>
      </div>
    ),
    { ...size },
  );
}
