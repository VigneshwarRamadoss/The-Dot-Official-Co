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
    useRef<ReturnType<typeof setTimeout> | null>(
      null
    );

  const scrollEndTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null
    );

  const [entered, setEntered] =
    useState(false);

  const [hovered, setHovered] =
    useState(false);

  const [edgeHovered, setEdgeHovered] =
    useState(false);

  const [pressed, setPressed] =
    useState(false);

  const [hasScrolled, setHasScrolled] =
    useState(false);

  const [isScrolling, setIsScrolling] =
    useState(false);

  const [reducedMotion, setReducedMotion] =
    useState(false);

  /* =======================================================
     REDUCED MOTION
     ======================================================= */

  useEffect(() => {
    const media =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      );

    const sync = () => {
      setReducedMotion(
        media.matches
      );
    };

    sync();

    media.addEventListener?.(
      "change",
      sync
    );

    return () => {
      media.removeEventListener?.(
        "change",
        sync
      );
    };
  }, []);

  /* =======================================================
     INITIAL ENTRANCE
     ======================================================= */

  useEffect(() => {
    let secondFrame = 0;

    const firstFrame =
      requestAnimationFrame(
        () => {
          secondFrame =
            requestAnimationFrame(
              () => {
                setEntered(true);
              }
            );
        }
      );

    return () => {
      cancelAnimationFrame(
        firstFrame
      );

      if (secondFrame) {
        cancelAnimationFrame(
          secondFrame
        );
      }
    };
  }, []);

  /* =======================================================
     ACTIVE SCENE SCROLL
     ======================================================= */

  useEffect(() => {
    const scroller =
      document.querySelector<HTMLElement>(
        '[data-scene-scroll][data-active="true"]'
      );

    if (!scroller) {
      return;
    }

    const handleScroll = () => {
      const scrollTop =
        scroller.scrollTop;

      /*
       * Back at top.
       */

      if (scrollTop <= 20) {
        setHasScrolled(false);
        setIsScrolling(false);

        if (
          scrollEndTimerRef.current
        ) {
          clearTimeout(
            scrollEndTimerRef.current
          );

          scrollEndTimerRef.current =
            null;
        }

        return;
      }

      /*
       * As soon as scrolling begins,
       * remove stale hover states.
       */

      setHovered(false);
      setEdgeHovered(false);

      setHasScrolled(true);
      setIsScrolling(true);

      if (
        scrollEndTimerRef.current
      ) {
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

      if (
        scrollEndTimerRef.current
      ) {
        clearTimeout(
          scrollEndTimerRef.current
        );

        scrollEndTimerRef.current =
          null;
      }
    };
  }, [
    activeSection,
    isOpen,
  ]);

  /* =======================================================
     SCENE RESET
     ======================================================= */

  useEffect(() => {
    setHovered(false);
    setEdgeHovered(false);
    setPressed(false);
    setIsScrolling(false);

    const frame =
      requestAnimationFrame(
        () => {
          const scroller =
            document.querySelector<HTMLElement>(
              '[data-scene-scroll][data-active="true"]'
            );

          setHasScrolled(
            (scroller?.scrollTop ?? 0) > 20
          );
        }
      );

    return () => {
      cancelAnimationFrame(
        frame
      );
    };
  }, [
    activeSection,
    isOpen,
  ]);

  /* =======================================================
     CLEANUP
     ======================================================= */

  useEffect(() => {
    return () => {
      if (
        openTimerRef.current
      ) {
        clearTimeout(
          openTimerRef.current
        );
      }

      if (
        scrollEndTimerRef.current
      ) {
        clearTimeout(
          scrollEndTimerRef.current
        );
      }
    };
  }, []);

  if (isOpen) {
    return null;
  }

  /* =======================================================
     VISIBILITY
     ======================================================= */

  const visible =
    entered &&
    !isScrolling &&
    (
      !hasScrolled ||
      edgeHovered ||
      hovered
    );

  /* =======================================================
     OPEN
     ======================================================= */

  const handleOpen = () => {
    if (
      openTimerRef.current
    ) {
      return;
    }

    setPressed(true);

    const delay =
      reducedMotion
        ? 0
        : 150;

    openTimerRef.current =
      setTimeout(() => {
        setPressed(false);

        openTimerRef.current =
          null;

        onToggle();
      }, delay);
  };

  return (
    <>
      {/* =================================================
          EXTREME RIGHT REVEAL ZONE
         ================================================= */}

      <div
        aria-hidden="true"
        className="
          fixed
          right-0
          top-0

          z-[58]

          h-[100svh]
          w-[30px]
        "
        onMouseEnter={() => {
          if (isScrolling) {
            return;
          }

          setEdgeHovered(true);
        }}
        onMouseLeave={() => {
          if (!hovered) {
            setEdgeHovered(false);
          }
        }}
      />

      {/* =================================================
          CURVE
         ================================================= */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none

          fixed
          right-0
          top-0

          z-[59]

          h-[100svh]

          will-change-transform
        "
        style={{
          width:
            `${EDGE_CURVE_WIDTH}px`,

          transformOrigin:
            "right center",

          transform: visible
            ? hovered
              ? `
                translate3d(-3px,0,0)
                scaleX(1.035)
                scaleY(1.004)
              `
              : `
                translate3d(0,0,0)
                scaleX(1)
                scaleY(1)
              `
            : `
                translate3d(${EDGE_CURVE_WIDTH + 18}px,0,0)
                scaleX(.66)
                scaleY(1.025)
              `,

          opacity:
            visible
              ? 1
              : 0,

          filter:
            visible
              ? "blur(0px)"
              : "blur(1px)",

          transition:
            reducedMotion
              ? `
                transform 180ms ease,
                opacity 180ms ease
              `
              : `
                transform 900ms cubic-bezier(.16,1,.3,1),
                opacity 680ms cubic-bezier(.16,1,.3,1),
                filter 700ms cubic-bezier(.16,1,.3,1)
              `,

          transitionDelay:
            visible
              ? "30ms"
              : "60ms",
        }}
      >
        <EdgeCurve
          tone="dark"
          pressed={pressed}
        />
      </div>

      {/* =================================================
          HAMBURGER
         ================================================= */}

      <button
        type="button"
        aria-label="Open navigation"
        aria-expanded={isOpen}
        aria-controls="fullscreen-menu"
        onClick={handleOpen}
        onMouseEnter={() => {
          if (isScrolling) {
            return;
          }

          setHovered(true);
          setEdgeHovered(true);
        }}
        onMouseLeave={() => {
          setHovered(false);

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
            visible
              ? 1
              : 0,

          pointerEvents:
            visible &&
            !isScrolling
              ? "auto"
              : "none",

          transition:
            reducedMotion
              ? "opacity 180ms ease"
              : "opacity 600ms cubic-bezier(.22,1,.36,1)",

          transitionDelay:
            visible
              ? "150ms"
              : "0ms",
        }}
      >
        <span
          aria-hidden="true"
          className="
            absolute

            flex
            w-[34px]

            flex-col

            items-center

            gap-[6px]
          "
          style={{
            right: "15px",

            transform:
              pressed
                ? "scaleX(1.16) scaleY(.82)"
                : hovered
                ? "scaleX(1.08)"
                : "scale(1)",

            transition:
              "transform 480ms cubic-bezier(.16,1,.3,1)",
          }}
        >
          <span
            className="
              block

              h-[1.5px]
              w-[27px]

              rounded-full

              bg-white
            "
          />

          <span
            className="
              block

              h-[1.5px]
              w-[20px]

              rounded-full

              bg-white
            "
          />

          <span
            className="
              block

              h-[1.5px]
              w-[27px]

              rounded-full

              bg-white
            "
          />
        </span>
      </button>
    </>
  );
}