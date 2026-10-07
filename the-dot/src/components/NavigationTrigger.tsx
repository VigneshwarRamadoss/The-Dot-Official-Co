"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  EdgeCurve,
  EDGE_CURVE_WIDTH,
} from "./EdgeCurve";

interface NavigationTriggerProps {
  isOpen: boolean;
  onToggle: () => void;
  activeSection?: string;
}

export function NavigationTrigger({
  isOpen,
  onToggle,
  activeSection = "hero",
}: NavigationTriggerProps) {
  const openTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollEndTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isHovered, setIsHovered] =
    useState(false);

  const [edgeHovered, setEdgeHovered] =
    useState(false);

  const [isPressed, setIsPressed] =
    useState(false);

  const [hasScrolled, setHasScrolled] =
    useState(false);

  const [isScrolling, setIsScrolling] =
    useState(false);

  const [reducedMotion, setReducedMotion] =
    useState(false);

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
  | ACTIVE SCENE SCROLL
  |--------------------------------------------------------------------------
  |
  | IMPORTANT FIX:
  |
  | We attach the listener DIRECTLY to the currently active
  | [data-scene-scroll] element.
  |
  | This is much more reliable than listening on document.
  |
  */

  useEffect(() => {
    if (typeof document === "undefined") return;

    const scroller =
      document.querySelector<HTMLElement>(
        '[data-scene-scroll][data-active="true"]'
      );

    if (!scroller) return;

    const handleScroll = () => {
      const scrollTop = scroller.scrollTop;

      /*
       * At top:
       * curve is allowed to return automatically.
       */
      if (scrollTop <= 20) {
        setHasScrolled(false);
        setIsScrolling(false);

        if (scrollEndTimerRef.current) {
          clearTimeout(
            scrollEndTimerRef.current
          );

          scrollEndTimerRef.current = null;
        }

        return;
      }

      /*
       * ---------------------------------------------------------------
       * CRITICAL FIX
       * ---------------------------------------------------------------
       *
       * As soon as scrolling begins, kill all previous hover states.
       *
       * Otherwise:
       *
       * user clicked curve
       * → mouse remains physically on right side
       * → edgeHovered remains true
       * → curve never disappears
       */

      setIsHovered(false);
      setEdgeHovered(false);

      setIsScrolling(true);
      setHasScrolled(true);

      /*
       * Scroll-end detection.
       */
      if (scrollEndTimerRef.current) {
        clearTimeout(
          scrollEndTimerRef.current
        );
      }

      scrollEndTimerRef.current =
        setTimeout(() => {
          setIsScrolling(false);

          scrollEndTimerRef.current =
            null;
        }, 260);
    };

    /*
     * Initialise correctly if returning to a scene
     * that was previously scrolled.
     */
    setHasScrolled(
      scroller.scrollTop > 20
    );

    scroller.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    return () => {
      scroller.removeEventListener(
        "scroll",
        handleScroll
      );

      if (scrollEndTimerRef.current) {
        clearTimeout(
          scrollEndTimerRef.current
        );

        scrollEndTimerRef.current =
          null;
      }
    };
  }, [activeSection, isOpen]);

  /*
  |--------------------------------------------------------------------------
  | SECTION / MENU STATE RESET
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    setIsHovered(false);
    setEdgeHovered(false);
    setIsPressed(false);
    setIsScrolling(false);

    const raf = requestAnimationFrame(() => {
      const scroller =
        document.querySelector<HTMLElement>(
          '[data-scene-scroll][data-active="true"]'
        );

      setHasScrolled(
        (scroller?.scrollTop ?? 0) > 20
      );
    });

    return () => {
      cancelAnimationFrame(raf);
    };
  }, [activeSection, isOpen]);

  /*
  |--------------------------------------------------------------------------
  | CLEANUP
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    return () => {
      if (openTimerRef.current) {
        clearTimeout(
          openTimerRef.current
        );
      }

      if (scrollEndTimerRef.current) {
        clearTimeout(
          scrollEndTimerRef.current
        );
      }
    };
  }, []);

  if (isOpen) {
    return null;
  }

  /*
  |--------------------------------------------------------------------------
  | VISIBILITY
  |--------------------------------------------------------------------------
  |
  | At top:
  | visible.
  |
  | Scrolled:
  | hidden.
  |
  | While scrolling:
  | always hidden.
  |
  | After scrolling:
  | moving back to extreme right edge reveals it again.
  |
  */

  const visible =
    !isScrolling &&
    (
      !hasScrolled ||
      edgeHovered ||
      isHovered
    );

  /*
  |--------------------------------------------------------------------------
  | OPEN MENU
  |--------------------------------------------------------------------------
  */

  const handleOpen = () => {
    if (openTimerRef.current) {
      return;
    }

    setIsPressed(true);

    const delay =
      reducedMotion ? 0 : 165;

    openTimerRef.current =
      setTimeout(() => {
        setIsPressed(false);

        openTimerRef.current =
          null;

        onToggle();
      }, delay);
  };

  return (
    <>
      {/* ================================================================
          INVISIBLE RIGHT EDGE REVEAL ZONE

          Always exists.

          After scrolling:
          move cursor to extreme right edge
          → curve returns.
         ================================================================ */}

      <div
        aria-hidden="true"
        className="
          fixed
          right-0
          top-0

          z-[58]

          h-[100svh]
          w-[32px]
        "
        onMouseEnter={() => {
          /*
           * Don't allow it to immediately reappear
           * while the user is actively scrolling.
           */
          if (isScrolling) return;

          setEdgeHovered(true);
        }}
        onMouseLeave={() => {
          if (!isHovered) {
            setEdgeHovered(false);
          }
        }}
      />

      {/* ================================================================
          FLUID CURVED BODY
         ================================================================ */}

      <div
        aria-hidden="true"
        className="
          fixed
          right-0
          top-0

          z-[59]

          h-[100svh]

          pointer-events-none

          will-change-transform
        "
        style={{
          width:
            `${EDGE_CURVE_WIDTH}px`,

          transformOrigin:
            "right center",

          /*
           * Slow liquid retreat.
           *
           * Instead of instantly shooting offscreen,
           * it compresses horizontally and stretches
           * slightly before leaving.
           */
          transform: visible
            ? `
              translate3d(0,0,0)
              scaleX(1)
              scaleY(1)
            `
            : `
              translate3d(${EDGE_CURVE_WIDTH + 18}px,0,0)
              scaleX(0.7)
              scaleY(1.025)
            `,

          opacity:
            visible ? 1 : 0,

          filter:
            visible
              ? "blur(0px)"
              : "blur(1.2px)",

          transition: reducedMotion
            ? `
              transform 200ms ease,
              opacity 180ms ease
            `
            : `
              transform 950ms cubic-bezier(.22,1,.36,1),
              opacity 760ms cubic-bezier(.22,1,.36,1),
              filter 820ms cubic-bezier(.22,1,.36,1)
            `,

          /*
           * Tiny resistance before disappearing.
           *
           * Returning has no delay.
           */
          transitionDelay:
            visible
              ? "0ms"
              : "90ms",
        }}
      >
        <EdgeCurve
          tone="dark"
          pressed={isPressed}
        />
      </div>

      {/* ================================================================
          HAMBURGER
         ================================================================ */}

      <button
        type="button"
        aria-label="Open navigation"
        aria-expanded={isOpen}
        aria-controls="fullscreen-menu"
        onClick={handleOpen}
        onMouseEnter={() => {
          if (isScrolling) return;

          setIsHovered(true);
          setEdgeHovered(true);
        }}
        onMouseLeave={() => {
          setIsHovered(false);

          if (hasScrolled) {
            setEdgeHovered(false);
          }
        }}
        className="
          fixed
          right-0
          top-1/2

          z-[60]

          flex
          -translate-y-1/2

          items-center
          justify-center

          border-0
          bg-transparent

          cursor-pointer

          outline-none
        "
        style={{
          width:
            `${EDGE_CURVE_WIDTH}px`,

          height: "150px",

          opacity:
            visible ? 1 : 0,

          pointerEvents:
            visible && !isScrolling
              ? "auto"
              : "none",

          transition: reducedMotion
            ? "opacity 180ms ease"
            : `
              opacity
              650ms
              cubic-bezier(.22,1,.36,1)
            `,

          transitionDelay:
            visible
              ? "100ms"
              : "0ms",
        }}
      >
        <span
          aria-hidden="true"
          className="
            absolute

            flex
            w-[32px]

            flex-col
            items-center

            gap-[5px]
          "
          style={{
            right: "18px",

            transform:
              isPressed
                ? "scaleX(1.18) scaleY(0.84)"
                : isHovered
                ? "scaleX(1.06)"
                : "scale(1)",

            transition:
              "transform 480ms cubic-bezier(.16,1,.3,1)",
          }}
        >
          <span
            className="
              block
              h-[1.5px]
              w-[26px]

              rounded-full
              bg-white
            "
          />

          <span
            className="
              block
              h-[1.5px]
              w-[19px]

              rounded-full
              bg-white
            "
          />

          <span
            className="
              block
              h-[1.5px]
              w-[26px]

              rounded-full
              bg-white
            "
          />
        </span>
      </button>
    </>
  );
}