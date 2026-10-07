"use client";

interface EdgeCurveProps {
  tone: "dark" | "light";
  pressed?: boolean;
  className?: string;
}

/*
 * Shared width for:
 * - black navigation opener
 * - white fullscreen-menu closer
 */
export const EDGE_CURVE_WIDTH = 112;

export function EdgeCurve({
  tone,
  pressed = false,
  className = "",
}: EdgeCurveProps) {
  const isDark = tone === "dark";

  return (
    <div
      aria-hidden="true"
      className={`
        pointer-events-none
        relative
        flex
        h-full
        w-full
        items-center
        justify-end
        ${className}
      `}
      style={{
        width: `${EDGE_CURVE_WIDTH}px`,
      }}
    >
      {/*
       * IMPORTANT:
       *
       * The curve occupies only the CENTER of the viewport.
       * It does NOT run all the way from top to bottom.
       *
       * 76% gives the reference-like proportion.
       */}
      <div
        className="
          relative
          h-[76%]
          w-full
        "
        style={{
          transformOrigin: "right center",

          transform: pressed
            ? "translateX(-4px) scaleX(1.055) scaleY(1.008)"
            : "translateX(0px) scaleX(1) scaleY(1)",

          transition: `
            transform 650ms cubic-bezier(.16,1,.3,1),
            filter 650ms cubic-bezier(.16,1,.3,1)
          `,

          filter: pressed
            ? "drop-shadow(-12px 0 22px rgba(0,0,0,0.15))"
            : "drop-shadow(-5px 0 14px rgba(0,0,0,0.07))",
        }}
      >
        <svg
          viewBox="0 0 112 800"
          preserveAspectRatio="none"
          className="
            h-full
            w-full
            overflow-visible
          "
        >
          <defs>
            {isDark ? (
              <>
                <linearGradient
                  id="edge-dome-dark"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                >
                  <stop
                    offset="0%"
                    stopColor="#202020"
                  />

                  <stop
                    offset="30%"
                    stopColor="#121212"
                  />

                  <stop
                    offset="68%"
                    stopColor="#070707"
                  />

                  <stop
                    offset="100%"
                    stopColor="#000000"
                  />
                </linearGradient>

                <linearGradient
                  id="edge-dome-dark-gloss"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                >
                  <stop
                    offset="0%"
                    stopColor="#FFFFFF"
                    stopOpacity="0.13"
                  />

                  <stop
                    offset="36%"
                    stopColor="#FFFFFF"
                    stopOpacity="0.045"
                  />

                  <stop
                    offset="100%"
                    stopColor="#FFFFFF"
                    stopOpacity="0"
                  />
                </linearGradient>
              </>
            ) : (
              <>
                <linearGradient
                  id="edge-dome-light"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                >
                  <stop
                    offset="0%"
                    stopColor="#E7E7E7"
                  />

                  <stop
                    offset="42%"
                    stopColor="#F4F4F4"
                  />

                  <stop
                    offset="100%"
                    stopColor="#FFFFFF"
                  />
                </linearGradient>

                <linearGradient
                  id="edge-dome-light-gloss"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                >
                  <stop
                    offset="0%"
                    stopColor="#FFFFFF"
                    stopOpacity="0.36"
                  />

                  <stop
                    offset="54%"
                    stopColor="#FFFFFF"
                    stopOpacity="0.11"
                  />

                  <stop
                    offset="100%"
                    stopColor="#FFFFFF"
                    stopOpacity="0"
                  />
                </linearGradient>
              </>
            )}
          </defs>

          {/*
           * ============================================================
           * TRUE SMOOTH DOME
           * ============================================================
           *
           * TOP:
           *   boundary begins at right edge
           *
           * CENTRE:
           *   reaches x = 43
           *
           * BOTTOM:
           *   returns to right edge
           *
           * Critical detail:
           *
           * First curve ends with:
           *     control point x = 43
           *
           * Second curve begins with:
           *     control point x = 43
           *
           * Therefore both curves share the SAME vertical tangent.
           *
           * Result:
           * NO POINT.
           * NO CUSP.
           * NO HOURGLASS.
           */}

          <path
            d="
              M112 0

              C108 105
               52 245
               52 400

              C52 555
               108 695
               112 800

              L112 0
              Z
            "
            fill={
              isDark
                ? "url(#edge-dome-dark)"
                : "url(#edge-dome-light)"
            }
          />

          {/* Gloss uses exactly the same geometry */}
          <path
            d="
              M112 0

              C108 105
               43 245
               43 400

              C43 555
               108 695
               112 800

              L112 0
              Z
            "
            fill={
              isDark
                ? "url(#edge-dome-dark-gloss)"
                : "url(#edge-dome-light-gloss)"
            }
            opacity="0.48"
          />

          {/*
           * Subtle polished contour.
           *
           * Same smooth tangent at center.
           */}
          <path
            d="
              M111 5

              C107 108
               45 247
               45 400

              C45 553
               107 692
               111 795
            "
            fill="none"
            stroke={
              isDark
                ? "#FFFFFF"
                : "#000000"
            }
            strokeOpacity={
              isDark
                ? "0.08"
                : "0.045"
            }
            strokeWidth="1"
          />
        </svg>
      </div>
    </div>
  );
}