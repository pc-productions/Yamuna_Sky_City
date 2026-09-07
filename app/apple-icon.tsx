import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Apple touch icon (home-screen bookmark): the approved reversed mark on
// a SkyCity Ember field, same treatment as app/icon.tsx at 180px.
export default async function AppleIcon() {
  const mark = await readFile(
    path.join(process.cwd(), "public/media/brand/mark-reversed.png"),
  );
  const markSrc = `data:image/png;base64,${mark.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#B42810",
        }}
      >
        <img src={markSrc} width={124} height={101} alt="" />
      </div>
    ),
    { ...size },
  );
}
