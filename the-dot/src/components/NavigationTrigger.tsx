"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import gsap from "gsap";

import {
  EdgeCurve,
  EDGE_CURVE_WIDTH,
} from "./EdgeCurve";

interface NavigationTriggerProps {
  isOpen: boolean;
  activeSection: string;
  onToggle: () => void;
}

const MORPH_DURATION = 1.05;
const MORPH_EASE = "power3.inOut";

const COLLAPSED_SCALE_X = 0.018;

/*
 * How far the entire trigger moves beyond
 * the right edge while WORK is active.
 */
const WORK_HIDE_X = EDGE_CURVE_WIDTH + 24;

export function NavigationTrigger({
  isOpen,
  activeSection,
  onToggle,
}: NavigationTriggerProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const curveWrapperRef =
    useRef<HTMLDivElement>(null);

  const hamburgerRef =
    useRef<HTMLSpanElement>(null);

  const scrollerRef =
    useRef<HTMLElement | null>(null);

  const collapsedRef = useRef(false);
  const animatingRef = useRef(false);

  const workModeRef = useRef(false);
  const workHiddenRef = useRef(false);

  const [pressed, setPressed] = useState(false);

  /* =======================================================
     LINE → CURVE
     ======================================================= */

  const expandCurve = useCallback(
    (immediate = false) => {
      const curve = curveWrapperRef.current;
      const hamburger = hamburgerRef.current;

      if (!curve || !hamburger) {
        return;
      }

      collapsedRef.current = false;

      gsap.killTweensOf([
        curve,
        hamburger,
      ]);

      if (immediate) {
        gsap.set(curve, {
          scaleX: 1,
        });

        gsap.set(hamburger, {
          opacity: 1,
          scale: 1,
          x: 0,
        });

        return;
      }

      animatingRef.current = true;

      const timeline = gsap.timeline({
        onComplete: () => {
          animatingRef.current = false;
        },
      });

      timeline.to(curve, {
        scaleX: 1,
        duration: MORPH_DURATION,
        ease: MORPH_EASE,
        overwrite: "auto",
      });

      timeline.to(
        hamburger,
        {
          opacity: 1,
          scale: 1,
          x: 0,
          duration: 0.32,
          ease: "power2.out",
        },
        "-=0.38"
      );
    },
    []
  );

  /* =======================================================
     CURVE → LINE
     ======================================================= */

  const collapseCurve = useCallback(
    (immediate = false) => {
      const curve = curveWrapperRef.current;
      const hamburger = hamburgerRef.current;

      if (!curve || !hamburger) {
        return;
      }

      collapsedRef.current = true;

      gsap.killTweensOf([
        curve,
        hamburger,
      ]);

      if (immediate) {
        gsap.set(hamburger, {
          opacity: 0,
          scale: 0.82,
          x: 8,
        });

        gsap.set(curve, {
          scaleX: COLLAPSED_SCALE_X,
        });

        return;
      }

      animatingRef.current = true;

      const timeline = gsap.timeline({
        onComplete: () => {
          animatingRef.current = false;
        },
      });

      timeline.to(hamburger, {
        opacity: 0,
        scale: 0.82,
        x: 8,
        duration: 0.22,
        ease: "power2.in",
      });

      timeline.to(
        curve,
        {
          scaleX: COLLAPSED_SCALE_X,
          duration: MORPH_DURATION,
          ease: MORPH_EASE,
          overwrite: "auto",
        },
        "-=0.08"
      );
    },
    []
  );

  /* =======================================================
     WORK → HIDE COMPLETELY

     curve → edge line → outside viewport
     ======================================================= */

  const hideForWork = useCallback(
    (immediate = false) => {
      const button = buttonRef.current;
      const curve = curveWrapperRef.current;
      const hamburger = hamburgerRef.current;

      if (
        !button ||
        !curve ||
        !hamburger
      ) {
        return;
      }

      if (workHiddenRef.current) {
        return;
      }

      workHiddenRef.current = true;
      collapsedRef.current = true;

      gsap.killTweensOf([
        button,
        curve,
        hamburger,
      ]);

      if (immediate) {
        gsap.set(hamburger, {
          opacity: 0,
          scale: 0.82,
          x: 8,
        });

        gsap.set(curve, {
          scaleX: COLLAPSED_SCALE_X,
        });

        gsap.set(button, {
          x: WORK_HIDE_X,
        });

        return;
      }

      animatingRef.current = true;

      const timeline = gsap.timeline({
        onComplete: () => {
          animatingRef.current = false;
        },
      });

      timeline.to(
        hamburger,
        {
          opacity: 0,
          scale: 0.82,
          x: 8,
          duration: 0.18,
          ease: "power2.in",
        },
        0
      );

      timeline.to(
        curve,
        {
          scaleX: COLLAPSED_SCALE_X,
          duration: 0.68,
          ease: "power3.inOut",
        },
        0.03
      );

      timeline.to(
        button,
        {
          x: WORK_HIDE_X,
          duration: 0.68,
          ease: "power3.inOut",
          overwrite: "auto",
        },
        0.2
      );
    },
    []
  );

  /* =======================================================
     WORK EDGE HOVER → REVEAL
     ======================================================= */

  const revealForWork = useCallback(
    (immediate = false) => {
      const button = buttonRef.current;
      const curve = curveWrapperRef.current;
      const hamburger = hamburgerRef.current;

      if (
        !button ||
        !curve ||
        !hamburger
      ) {
        return;
      }

      workHiddenRef.current = false;
      collapsedRef.current = false;

      gsap.killTweensOf([
        button,
        curve,
        hamburger,
      ]);

      if (immediate) {
        gsap.set(button, {
          x: 0,
        });

        gsap.set(curve, {
          scaleX: 1,
        });

        gsap.set(hamburger, {
          opacity: 1,
          scale: 1,
          x: 0,
        });

        return;
      }

      animatingRef.current = true;

      const timeline = gsap.timeline({
        onComplete: () => {
          animatingRef.current = false;
        },
      });

      /*
       * Bring the line back first.
       */
      timeline.to(button, {
        x: 0,
        duration: 0.62,
        ease: "power3.out",
        overwrite: "auto",
      });

      /*
       * Then let it bloom into the curve.
       */
      timeline.to(
        curve,
        {
          scaleX: 1,
          duration: 0.82,
          ease: MORPH_EASE,
        },
        0.12
      );

      timeline.to(
        hamburger,
        {
          opacity: 1,
          scale: 1,
          x: 0,
          duration: 0.3,
          ease: "power2.out",
        },
        0.54
      );
    },
    []
  );

  /* =======================================================
     DETECT WHETHER WORK OWNS THE VIEWPORT
     ======================================================= */

  const isInsideWork = useCallback(
    (scroller: HTMLElement) => {
      const work =
        document.getElementById("work");

      if (!work) {
        return false;
      }

      const rootRect =
        scroller.getBoundingClientRect();

      const workRect =
        work.getBoundingClientRect();

      /*
       * Slightly above the exact center gives the
       * disappearance a more natural timing.
       */
      const probe =
        rootRect.top +
        rootRect.height * 0.43;

      return (
        workRect.top <= probe &&
        workRect.bottom >= probe
      );
    },
    []
  );

  /* =======================================================
     NORMAL / WORK SCROLL STATE
     ======================================================= */

  useEffect(() => {
    const findActiveScroller = () => {
      const active =
        document.querySelector<HTMLElement>(
          '[data-scene-scroll][data-active="true"]'
        );

      scrollerRef.current = active;

      return active;
    };

    let scroller = findActiveScroller();

    const syncNavigation = (
      immediate = false
    ) => {
      scroller =
        scrollerRef.current ??
        findActiveScroller();

      if (!scroller) {
        return;
      }

      const inWork =
        isInsideWork(scroller);

      workModeRef.current = inWork;

      /*
       * Fullscreen menu owns the navigation
       * while open.
       */
      if (isOpen) {
        return;
      }

      /* =============================================
         WORK
         ============================================= */

      if (inWork) {
        hideForWork(immediate);
        return;
      }

      /* =============================================
         EXIT WORK
         ============================================= */

      if (workHiddenRef.current) {
        workHiddenRef.current = false;

        if (buttonRef.current) {
          if (immediate) {
            gsap.set(buttonRef.current, {
              x: 0,
            });
          } else {
            gsap.to(buttonRef.current, {
              x: 0,
              duration: 0.62,
              ease: "power3.out",
              overwrite: "auto",
            });
          }
        }
      }

      /* =============================================
         NORMAL NAVIGATION BEHAVIOUR
         ============================================= */

      if (scroller.scrollTop <= 20) {
        if (collapsedRef.current) {
          expandCurve(immediate);
        }

        return;
      }

      if (!collapsedRef.current) {
        collapseCurve(immediate);
      }
    };

    syncNavigation(true);

    const handleScroll = () => {
      syncNavigation(false);
    };

    scroller?.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    /* ===============================================
       WATCH ACTIVE SCENE
       =============================================== */

    const observer =
      new MutationObserver(() => {
        const nextScroller =
          findActiveScroller();

        if (
          nextScroller === scroller
        ) {
          return;
        }

        scroller?.removeEventListener(
          "scroll",
          handleScroll
        );

        scroller = nextScroller;

        scroller?.addEventListener(
          "scroll",
          handleScroll,
          {
            passive: true,
          }
        );

        syncNavigation(true);
      });

    observer.observe(
      document.body,
      {
        subtree: true,
        attributes: true,
        attributeFilter: [
          "data-active",
        ],
      }
    );

    return () => {
      scroller?.removeEventListener(
        "scroll",
        handleScroll
      );

      observer.disconnect();
    };
  }, [
    activeSection,
    collapseCurve,
    expandCurve,
    hideForWork,
    isInsideWork,
    isOpen,
  ]);

  /* =======================================================
     MENU OPEN / CLOSE
     ======================================================= */

  useEffect(() => {
    if (isOpen) {
      /*
       * Menu opening still uses the
       * normal curve → line motion.
       */
      collapseCurve();

      return;
    }

    const scroller =
      document.querySelector<HTMLElement>(
        '[data-scene-scroll][data-active="true"]'
      );

    if (!scroller) {
      expandCurve();
      return;
    }

    const inWork =
      isInsideWork(scroller);

    workModeRef.current = inWork;

    if (inWork) {
      hideForWork();
      return;
    }

    if (workHiddenRef.current) {
      workHiddenRef.current = false;

      if (buttonRef.current) {
        gsap.to(buttonRef.current, {
          x: 0,
          duration: 0.6,
          ease: "power3.out",
          overwrite: "auto",
        });
      }
    }

    if (scroller.scrollTop <= 20) {
      expandCurve();
    } else {
      collapseCurve();
    }
  }, [
    isOpen,
    collapseCurve,
    expandCurve,
    hideForWork,
    isInsideWork,
  ]);

  /* =======================================================
     RIGHT EDGE HOVER
     ======================================================= */

  useEffect(() => {
    const handlePointerMove = (
      event: PointerEvent
    ) => {
      if (isOpen) {
        return;
      }

      const distanceFromRight =
        window.innerWidth -
        event.clientX;

      /* =============================================
         WORK MODE
         ============================================= */

      if (workModeRef.current) {
        /*
         * Cursor reaches edge:
         * reveal the curved menu.
         */
        if (distanceFromRight <= 30) {
          if (workHiddenRef.current) {
            revealForWork();
          }

          return;
        }

        /*
         * Cursor leaves menu region:
         * hide it again.
         */
        if (
          distanceFromRight >= 170 &&
          !workHiddenRef.current &&
          !animatingRef.current
        ) {
          hideForWork();
        }

        return;
      }

      /* =============================================
         NORMAL MODE
         ============================================= */

      if (distanceFromRight <= 24) {
        if (collapsedRef.current) {
          expandCurve();
        }

        return;
      }

      const scroller =
        scrollerRef.current;

      if (
        distanceFromRight > 130 &&
        scroller &&
        scroller.scrollTop > 20 &&
        !collapsedRef.current &&
        !animatingRef.current
      ) {
        collapseCurve();
      }
    };

    window.addEventListener(
      "pointermove",
      handlePointerMove,
      {
        passive: true,
      }
    );

    return () => {
      window.removeEventListener(
        "pointermove",
        handlePointerMove
      );
    };
  }, [
    collapseCurve,
    expandCurve,
    hideForWork,
    isOpen,
    revealForWork,
  ]);

  /* =======================================================
     CLICK
     ======================================================= */

  const handleClick = () => {
    if (collapsedRef.current) {
      if (workModeRef.current) {
        revealForWork();
      } else {
        expandCurve();
      }

      return;
    }

    setPressed(true);

    window.setTimeout(() => {
      setPressed(false);
    }, 200);

    onToggle();
  };

  /* =======================================================
     JSX
     ======================================================= */

  return (
    <>
      {/* =================================================
          INVISIBLE RIGHT EDGE SENSOR

          This remains even while the actual curve is
          outside the screen.
         ================================================= */}

      {!isOpen && (
        <div
          aria-hidden="true"
          className="
            fixed
            bottom-0
            right-0
            top-0

            z-[88]

            w-[24px]
          "
          onPointerEnter={() => {
            if (workModeRef.current) {
              revealForWork();
              return;
            }

            if (collapsedRef.current) {
              expandCurve();
            }
          }}
        />
      )}

      {/* =================================================
          NAVIGATION BUTTON
         ================================================= */}

      <button
        ref={buttonRef}
        type="button"
        aria-label="Open navigation"
        onClick={handleClick}
        onPointerDown={() => {
          if (!collapsedRef.current) {
            setPressed(true);
          }
        }}
        onPointerUp={() => {
          setPressed(false);
        }}
        onPointerCancel={() => {
          setPressed(false);
        }}
        onPointerLeave={() => {
          setPressed(false);
        }}
        className="
          fixed
          bottom-0
          right-0
          top-0

          z-[90]

          flex
          items-center
          justify-end

          border-0
          bg-transparent

          p-0

          outline-none

          will-change-transform
        "
        style={{
          width: `${EDGE_CURVE_WIDTH}px`,
        }}
      >
        {/* CURVE */}

        <div
          ref={curveWrapperRef}
          className="
            absolute
            inset-0

            will-change-transform
          "
          style={{
            transformOrigin:
              "right center",
          }}
        >
          <EdgeCurve
            tone="dark"
            pressed={pressed}
          />
        </div>

        {/* HAMBURGER */}

        <span
          ref={hamburgerRef}
          aria-hidden="true"
          className="
            pointer-events-none

            absolute

            right-[18px]
            top-1/2

            z-20

            flex

            h-7
            w-8

            -translate-y-1/2

            flex-col
            items-center
            justify-center

            gap-[5px]

            will-change-transform
          "
        >
          <span
            className="
              block
              h-px
              w-[24px]
              bg-white
            "
          />

          <span
            className="
              block
              h-px
              w-[18px]
              bg-white
            "
          />

          <span
            className="
              block
              h-px
              w-[24px]
              bg-white
            "
          />
        </span>
      </button>
    </>
  );
}