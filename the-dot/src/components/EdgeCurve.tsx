"use client";

interface EdgeCurveProps {
  tone: "dark" | "light";
  pressed?: boolean;
  className?: string;
}

export const EDGE_CURVE_WIDTH = 120;

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
        h-full
        w-full
        ${className}
      `}
      style={{
        width: `${EDGE_CURVE_WIDTH}px`,
      }}
    >
      {/*
        Curve intentionally begins below the top
        and finishes above the bottom.
      */}

      <div
        className="
          absolute
          left-0
          top-12
          w-full
        "
        style={{
          height: "calc(100% - 96px)",

          transformOrigin: "right center",

          transform: pressed
            ? "translateX(-5px) scaleX(1.075) scaleY(0.992)"
            : "translateX(0px) scaleX(1) scaleY(1)",

          transition:
            "transform 600ms cubic-bezier(.16,1,.3,1), filter 600ms cubic-bezier(.16,1,.3,1)",

          /*
           * Dark shadow only.
           *
           * No light/glowing edge is produced here.
           */
          filter: pressed
            ? "drop-shadow(-14px 0 26px rgba(24,24,24,0.18))"
            : "drop-shadow(-7px 0 18px rgba(24,24,24,0.09))",
        }}
      >
        <svg
          viewBox="0 0 120 1000"
          preserveAspectRatio="none"
          className="
            block
            h-full
            w-full
            overflow-visible
          "
        >
          <defs>
            {/* =================================================
                DARK SURFACE

                Kept very subtle.

                No white stops.
                No bright highlight.
               ================================================= */}

            <linearGradient
              id="dot-edge-dark"
              x1="0"
              y1="0"
              x2="1"
              y2="0"
            >
              <stop
                offset="0%"
                stopColor="#211B1B"
              />

              <stop
                offset="32%"
                stopColor="#1C1818"
              />

              <stop
                offset="66%"
                stopColor="#181818"
              />

              <stop
                offset="100%"
                stopColor="#181818"
              />
            </linearGradient>

            {/* =================================================
                LIGHT SURFACE
               ================================================= */}

            <linearGradient
              id="dot-edge-light"
              x1="0"
              y1="0"
              x2="1"
              y2="0"
            >
              <stop
                offset="0%"
                stopColor="#F1F1F1"
              />

              <stop
                offset="52%"
                stopColor="#F8F8F8"
              />

              <stop
                offset="100%"
                stopColor="#FFFFFF"
              />
            </linearGradient>

            {/* Light tone can keep its subtle surface lighting */}

            <linearGradient
              id="dot-edge-light-highlight"
              x1="0"
              y1="0"
              x2="1"
              y2="0"
            >
              <stop
                offset="0%"
                stopColor="#FFFFFF"
                stopOpacity="0.42"
              />

              <stop
                offset="55%"
                stopColor="#FFFFFF"
                stopOpacity="0.1"
              />

              <stop
                offset="100%"
                stopColor="#FFFFFF"
                stopOpacity="0"
              />
            </linearGradient>
          </defs>

          {/* =================================================
              MAIN CURVE

                       (
                      
              One continuous smooth curve.
             ================================================= */}

          <path
            d="
              M120 0

              C118 150
               48 300
               48 500

              C48 700
               118 850
               120 1000

              L120 0
              Z
            "
            fill={
              isDark
                ? "url(#dot-edge-dark)"
                : "url(#dot-edge-light)"
            }
          />

          {/* =================================================
              LIGHT VERSION ONLY

              Important:
              dark curve gets NO highlight overlay.
             ================================================= */}

          {!isDark && (
            <path
              d="
                M120 0

                C118 150
                 48 300
                 48 500

                C48 700
                 118 850
                 120 1000

                L120 0
                Z
              "
              fill="url(#dot-edge-light-highlight)"
            />
          )}

          {/* =================================================
              LIGHT VERSION CONTOUR ONLY

              The previous dark white stroke was responsible
              for the visible pale trace.
             ================================================= */}

          {!isDark && (
            <path
              d="
                M119 5

                C116 153
                 50 303
                 50 500

                C50 697
                 116 847
                 119 995
              "
              fill="none"
              stroke="#181818"
              strokeWidth="1"
              strokeOpacity="0.04"
            />
          )}
        </svg>
      </div>
    </div>
  );
}