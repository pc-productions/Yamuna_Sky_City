/**
 * Layer 1 — atmospheric overlays. The signature element is the large
 * soft white fade over the left edge (the editorial region); the exact
 * stops make an extremely gradual dissolve with no hard edge, reaching
 * zero well before the tower. A thin white fade along the top lets the
 * section melt into the light section above instead of meeting it at a
 * hard skyline edge.
 */
export function LocationAtmosphere() {
  return (
    <>
      <div
        aria-hidden="true"
        data-loc-atmo=""
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.88) 8%, rgba(255,255,255,0.65) 16%, rgba(255,255,255,0.32) 24%, rgba(255,255,255,0.08) 34%, rgba(255,255,255,0) 45%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-24 bg-gradient-to-b from-white/90 via-white/35 to-transparent"
      />
    </>
  );
}
