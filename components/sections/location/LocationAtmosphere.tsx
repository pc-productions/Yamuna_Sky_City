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
          then dissolves toward the tower. Mouse devices only: on Android
          tablets this masked blur over the parallax image rendered as a
          hard blurred rectangle and made scrolling stutter. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-[1] hidden w-[52%] backdrop-blur-[14px] [mask-image:linear-gradient(90deg,black_0%,black_55%,transparent_100%)] fine:block"
      />
      {/* Boundary melts — the photograph surfaces out of the light
          section above and dissolves again before the Ember field
          below, so the section is entered and left, never cut to. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-40 bg-gradient-to-b from-white via-white/45 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-28 bg-gradient-to-t from-white/80 via-white/25 to-transparent"
      />
    </>
  );
}
