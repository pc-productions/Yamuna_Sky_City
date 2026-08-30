import { ImageResponse } from "next/og";
import { brand } from "@/content/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
          background:
            "radial-gradient(circle at 50% 35%, #1a2b5c 0%, #0d1330 55%, #0a0d16 100%)",
          color: "#e8eaf2",
        }}
      >
        <div style={{ fontSize: 64, letterSpacing: 4, fontFamily: "Georgia, serif" }}>
          {brand.name.toUpperCase()}
        </div>
        <div style={{ marginTop: 20, fontSize: 20, letterSpacing: 6, color: "#8d90a1" }}>
          {brand.tagline.toUpperCase()}
        </div>
      </div>
    ),
    { ...size },
  );
}
