"use client";

import { useEffect, useRef, useState } from "react";

interface NavigationTriggerProps {
  isOpen: boolean;
  onToggle: () => void;
  activeSection?: string;
}

type Dot = {
  cx: number;
  cy: number;
  r: number;
  opacity: number;
  delay: number;
};

/*
|--------------------------------------------------------------------------
| EXACTLY TWO DOTTED LEFT CHEVRONS
|--------------------------------------------------------------------------
|
| Shape:
|
|      <   <
|
| No tail dots.
| No particles after the second arrow.
| No third chevron.
|
*/

const CHEVRON_DOTS: Dot[] = [
  // FIRST <
  { cx: 8, cy: 24, r: 2.8, opacity: 1, delay: 0 },

  { cx: 13, cy: 19, r: 2.5, opacity: 0.96, delay: 20 },
  { cx: 18, cy: 14, r: 2.25, opacity: 0.9, delay: 40 },
  { cx: 23, cy: 9, r: 2.0, opacity: 0.82, delay: 60 },
  { cx: 28, cy: 4, r: 1.65, opacity: 0.7, delay: 80 },

  { cx: 13, cy: 29, r: 2.5, opacity: 0.96, delay: 20 },
  { cx: 18, cy: 34, r: 2.25, opacity: 0.9, delay: 40 },
  { cx: 23, cy: 39, r: 2.0, opacity: 0.82, delay: 60 },
  { cx: 28, cy: 44, r: 1.65, opacity: 0.7, delay: 80 },

  // SECOND <
  { cx: 32, cy: 24, r: 2.8, opacity: 1, delay: 45 },

  { cx: 37, cy: 19, r: 2.5, opacity: 0.96, delay: 65 },
  { cx: 42, cy: 14, r: 2.25, opacity: 0.9, delay: 85 },
  { cx: 47, cy: 9, r: 2.0, opacity: 0.82, delay: 105 },
  { cx: 52, cy: 4, r: 1.65, opacity: 0.7, delay: 125 },

  { cx: 37, cy: 29, r: 2.5, opacity: 0.96, delay: 65 },
  { cx: 42, cy: 34, r: 2.25, opacity: 0.9, delay: 85 },
  { cx: 47, cy: 39, r: 2.0, opacity: 0.82, delay: 105 },
  { cx: 52, cy: 44, r: 1.65, opacity: 0.7, delay: 125 },
];

export function NavigationTrigger({
  isOpen,
  onToggle,
  activeSection = "hero",
}: NavigationTriggerProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const isHeroActive = activeSection === "hero";

  /*
  |--------------------------------------------------------------------------
  | REDUCED MOTION
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const sync = () => {
      setReducedMotion(media.matches);
    };

    sync();

    media.addEventListener?.("change", sync);

    return () => {
      media.removeEventListener?.("change", sync);
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | IMPORTANT FIX:
  | RESET ARROW WHEN MENU / SECTION CHANGES
  |--------------------------------------------------------------------------
  |
  | Previously:
  | - user hovered arrow
  | - clicked it
  | - button disappeared while still "hovered"
  | - mouseleave never fired
  | - returning Home reused isHovered=true
  |
  | Result:
  | arrow stayed permanently visible.
  |
  | Now every navigation state change resets it.
  |
  */

  useEffect(() => {
    setIsHovered(false);
    setIsFocused(false);
    setIsPressed(false);
  }, [isOpen, activeSection]);

  /*
  |--------------------------------------------------------------------------
  | HERO ONLY
  |--------------------------------------------------------------------------
  */

  if (isOpen) {
  return null;
}

  const arrowVisible = isHovered || isFocused;

  return (
    <>
      {/* ================================================================
          FULL-HEIGHT RIGHT EDGE GLOW

          This is NOT a circle.
          This is NOT a rectangular grey patch.

          It runs from TOP → BOTTOM of viewport.

          RIGHT EDGE:
          darkest

          moving LEFT into website:
          progressively fades away
         ================================================================ */}

      <div
        aria-hidden="true"
        className="
          fixed
          top-0
          right-0
          z-[48]

          h-[100svh]
          w-[105px]

          pointer-events-none
        "
        style={{
          background: `
            linear-gradient(
              to left,

              rgba(0, 0, 0, 0.48) 0px,
              rgba(0, 0, 0, 0.42) 4px,
              rgba(0, 0, 0, 0.32) 12px,
              rgba(0, 0, 0, 0.22) 26px,
              rgba(0, 0, 0, 0.13) 44px,
              rgba(0, 0, 0, 0.065) 66px,
              rgba(0, 0, 0, 0.025) 84px,
              rgba(0, 0, 0, 0) 105px
            )
          `,
        }}
      />

      {/* ================================================================
          DARK EDGE CORE

          Adds the stronger edge exactly at the right-most boundary.

          Narrow + full-height.
          This creates the reference-like "edge light" behaviour,
          but in BLACK.
         ================================================================ */}

      <div
        aria-hidden="true"
        className="
          fixed
          top-0
          right-0
          z-[49]

          h-[100svh]
          w-[4px]

          pointer-events-none
        "
        style={{
          background: "rgba(0,0,0,0.92)",

          boxShadow: `
            -4px 0 7px rgba(0,0,0,0.38),
            -10px 0 15px rgba(0,0,0,0.24),
            -22px 0 26px rgba(0,0,0,0.14),
            -40px 0 42px rgba(0,0,0,0.07)
          `,
        }}
      />

      {/* ================================================================
          INVISIBLE HERO INTERACTION AREA

          Only centered vertically.

          It does NOT control glow dimensions.
          Glow is separate and full-height.
         ================================================================ */}

      <button
        ref={triggerRef}
        type="button"
        aria-label="Open navigation"
        aria-expanded={isOpen}
        aria-controls="fullscreen-menu"
        data-cursor="beacon"
        onClick={onToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsPressed(false);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onPointerDown={() => setIsPressed(true)}
        onPointerUp={() => setIsPressed(false)}
        className="
          fixed
          right-0
          top-1/2
          z-[60]

          -translate-y-1/2

          w-[120px]
          h-[170px]

          border-0
          outline-none
          ring-0
          appearance-none
          bg-transparent

          cursor-none
          select-none

          focus:outline-none
        "
      >
        {/* ==============================================================
            EXACTLY TWO DOTTED < <

            Hidden initially.
            Appears ONLY on actual hover/focus.
           ============================================================== */}

        <div
          aria-hidden="true"
          className="
            absolute
            right-[22px]
            top-1/2

            pointer-events-none
            will-change-transform
          "
          style={{
            opacity: arrowVisible ? 1 : 0,

            transform: `
              translate3d(
                ${arrowVisible ? -8 : 10}px,
                -50%,
                0
              )
              scale(${
                isPressed
                  ? 0.9
                  : arrowVisible
                  ? 1
                  : 0.92
              })
            `,

            transition: reducedMotion
              ? `
                opacity 160ms ease,
                transform 160ms ease
              `
              : `
                opacity 220ms ease,
                transform 440ms cubic-bezier(.16,1,.3,1)
              `,
          }}
        >
          <svg
            width="62"
            height="52"
            viewBox="0 0 62 48"
            fill="none"
            overflow="visible"
          >
            {CHEVRON_DOTS.map((dot, index) => (
              <circle
                key={`${dot.cx}-${dot.cy}-${index}`}
                cx={dot.cx}
                cy={dot.cy}
                r={dot.r}
                fill="#050505"
                style={{
                  opacity: arrowVisible
                    ? dot.opacity
                    : 0,

                  transformOrigin: `${dot.cx}px ${dot.cy}px`,

                  transform: arrowVisible
                    ? "translateX(0px) scale(1)"
                    : "translateX(8px) scale(0.55)",

                  transition: reducedMotion
                    ? "opacity 160ms ease"
                    : `
                      opacity 260ms ease ${dot.delay}ms,
                      transform 380ms cubic-bezier(.16,1,.3,1) ${dot.delay}ms
                    `,
                }}
              />
            ))}
          </svg>
        </div>
      </button>
    </>
  );
}