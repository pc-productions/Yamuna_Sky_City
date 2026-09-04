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
      {/* Left reading region — progressive white wash + frosted glass diffusion */}
      <div
        aria-hidden="true"
        data-loc-atmo=""
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.95) 10%, rgba(255,255,255,0.75) 18%, rgba(255,255,255,0.35) 26%, rgba(255,255,255,0.06) 34%, rgba(255,255,255,0) 40%)",
        }}
      />
      {/* Frosted backdrop blur layer — held at full strength across the
          whole editorial column so it evidently sits behind the text,
          then dissolves toward the tower. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-[44%] backdrop-blur-[14px] [mask-image:linear-gradient(90deg,black_0%,black_45%,transparent_100%)]"
      />
      {/* Top boundary melt */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-24 bg-gradient-to-b from-white/90 via-white/35 to-transparent"
      />
    </>
  );
}
