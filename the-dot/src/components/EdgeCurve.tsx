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
        The curve intentionally does NOT touch
        the top or bottom of the viewport.
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

          filter: pressed
            ? "drop-shadow(-14px 0 26px rgba(24,24,24,0.16))"
            : "drop-shadow(-7px 0 18px rgba(24,24,24,0.08))",
        }}
      >
        <svg
          viewBox="0 0 120 1000"
          preserveAspectRatio="none"
          className="
            h-full
            w-full
            overflow-visible
          "
        >
          <defs>
            {/* DARK */}

            <linearGradient
              id="dot-edge-dark"
              x1="0"
              y1="0"
              x2="1"
              y2="0"
            >
              <stop
                offset="0%"
                stopColor="#272020"
              />

              <stop
                offset="34%"
                stopColor="#1E1818"
              />

              <stop
                offset="72%"
                stopColor="#181818"
              />

              <stop
                offset="100%"
                stopColor="#181818"
              />
            </linearGradient>

            <linearGradient
              id="dot-edge-dark-highlight"
              x1="0"
              y1="0"
              x2="1"
              y2="0"
            >
              <stop
                offset="0%"
                stopColor="#472B2A"
                stopOpacity="0.34"
              />

              <stop
                offset="46%"
                stopColor="#FFFFFF"
                stopOpacity="0.035"
              />

              <stop
                offset="100%"
                stopColor="#FFFFFF"
                stopOpacity="0"
              />
            </linearGradient>

            {/* LIGHT */}

            <linearGradient
              id="dot-edge-light"
              x1="0"
              y1="0"
              x2="1"
              y2="0"
            >
              <stop
                offset="0%"
                stopColor="#F3F3F3"
              />

              <stop
                offset="52%"
                stopColor="#FAFAFA"
              />

              <stop
                offset="100%"
                stopColor="#FFFFFF"
              />
            </linearGradient>

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
                stopOpacity="0.7"
              />

              <stop
                offset="100%"
                stopColor="#FFFFFF"
                stopOpacity="0"
              />
            </linearGradient>
          </defs>

          {/* =================================================
              ONE CONTINUOUS (
              
              Starts:
              top-right

              Moves:
              smoothly left toward centre

              Returns:
              bottom-right
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

          {/* Subtle surface lighting */}

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
                ? "url(#dot-edge-dark-highlight)"
                : "url(#dot-edge-light-highlight)"
            }
          />

          {/* Extremely subtle contour */}

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
            stroke={
              isDark
                ? "#FFFFFF"
                : "#181818"
            }
            strokeWidth="1"
            strokeOpacity={
              isDark
                ? "0.055"
                : "0.045"
            }
          />
        </svg>
      </div>
    </div>
  );
}