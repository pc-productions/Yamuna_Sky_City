import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// Favicon: the approved reversed mark on a SkyCity Ember field.
export default async function Icon() {
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
        <img src={markSrc} width={44} height={36} alt="" />
      </div>
    ),
    { ...size },
  );
}
