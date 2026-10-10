"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import dynamic from "next/dynamic";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type {
  RobotMode,
} from "./RobotScene3D";

/* =========================================================
   CLIENT-ONLY 3D ROBOT
   ========================================================= */

const RobotScene3D = dynamic(
  () =>
    import("./RobotScene3D").then(
      (module) => module.RobotScene3D
    ),
  {
    ssr: false,

    loading: () => (
      <div className="h-full w-full" />
    ),
  }
);

/* =========================================================
   SUPPORT IMAGE
   ========================================================= */

const SUPPORT_IMAGE =
  "/about/robot/robot_360_turnaround.svg";

/* =========================================================
   STORY
   ========================================================= */

const STORY = [
  {
    number: "01",
    eyebrow: "START WITH THE PROBLEM",

    title:
      "We understand before we build.",

    body:
      "We begin by understanding the business, the user, the constraint and the real problem underneath the brief.",
  },

  {
    number: "02",
    eyebrow:
      "CONNECT THE DISCIPLINES",

    title:
      "Strategy, design and technology move together.",

    body:
      "We connect thinking, design and execution early — so each decision supports the same outcome instead of becoming a disconnected handoff.",
  },

  {
    number: "03",
    eyebrow: "BUILD WHAT MATTERS",

    title:
      "Then we turn the thinking into useful digital experiences.",

    body:
      "Brands, websites, digital products and growth systems — built around the problem, not the template.",
  },
];

/* =========================================================
   ABOUT
   ========================================================= */

export function About() {
  const sectionRef =
    useRef<HTMLElement>(null);

  const aboutLabelRef =
    useRef<HTMLDivElement>(null);

  const robotStageRef =
    useRef<HTMLDivElement>(null);

  const hiBubbleRef =
    useRef<HTMLDivElement>(null);

  const byeBubbleRef =
    useRef<HTMLDivElement>(null);

  const progressRef =
    useRef<HTMLDivElement>(null);

  const panelRefs =
    useRef<
      Array<HTMLDivElement | null>
    >([]);

  const [robotMode, setRobotMode] =
    useState<RobotMode>("intro");

  const robotModeRef =
    useRef<RobotMode>("intro");

  const changeRobotMode = (
    next: RobotMode
  ) => {
    if (
      robotModeRef.current === next
    ) {
      return;
    }

    robotModeRef.current = next;
    setRobotMode(next);
  };

  /* =======================================================
     ABOUT STORY
     ======================================================= */

  useEffect(() => {
    const section =
      sectionRef.current;

    const aboutLabel =
      aboutLabelRef.current;

    const robotStage =
      robotStageRef.current;

    const hiBubble =
      hiBubbleRef.current;

    const byeBubble =
      byeBubbleRef.current;

    const progress =
      progressRef.current;

    const panels =
      panelRefs.current.filter(
        (
          panel
        ): panel is HTMLDivElement =>
          panel !== null
      );

    if (
      !section ||
      !aboutLabel ||
      !robotStage ||
      !hiBubble ||
      !byeBubble ||
      !progress ||
      panels.length !== STORY.length
    ) {
      return;
    }

    gsap.registerPlugin(
      ScrollTrigger
    );

    /*
     * IMPORTANT:
     *
     * Your Home page does NOT scroll on window.
     * It scrolls inside the active SceneManager container.
     */

    const scroller =
      section.closest<HTMLElement>(
        '[data-scene-scroll][data-active="true"]'
      ) ??
      section.closest<HTMLElement>(
        "[data-scene-scroll]"
      ) ??
      undefined;

    const reduced =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

    const leftPosition = () =>
      -Math.min(
        window.innerWidth * 0.24,
        360
      );

    /* =====================================================
       REDUCED MOTION
       ===================================================== */

    if (reduced) {
      gsap.set(aboutLabel, {
        opacity: 1,
        y: 0,
      });

      gsap.set(robotStage, {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
      });

      gsap.set(panels, {
        opacity: 0,
        visibility: "hidden",
      });

      gsap.set(progress, {
        scaleX: 1,
      });

      changeRobotMode("exit");

      return;
    }

    /* =====================================================
       GSAP CONTEXT
       ===================================================== */

    const ctx =
      gsap.context(() => {
        /* ===============================================
           INITIAL STATES
           =============================================== */

        gsap.set(aboutLabel, {
          opacity: 0,
          y: -12,
        });

        gsap.set(robotStage, {
          opacity: 0,

          x: 0,
          y: 70,

          scale: 0.9,
          rotation: 0,

          transformOrigin:
            "50% 100%",
        });

        gsap.set(hiBubble, {
          opacity: 0,
          y: 10,
          scale: 0.9,
        });

        gsap.set(byeBubble, {
          opacity: 0,
          y: 10,
          scale: 0.9,
        });

        gsap.set(panels, {
          opacity: 0,
          y: 26,

          visibility: "hidden",
          pointerEvents: "none",
        });

        gsap.set(progress, {
          scaleX: 0,

          transformOrigin:
            "left center",
        });

        /* ===============================================
           MASTER TIMELINE

           NO PINNING.

           CSS sticky handles the fixed viewport.
           ScrollTrigger only calculates progress.
           =============================================== */

        const timeline =
          gsap.timeline({
            scrollTrigger: {
              trigger: section,

              scroller,

              start: "top top",

              /*
               * Critical:
               *
               * Animation finishes at the exact point
               * where the CSS sticky viewport releases.
               */
              end: "bottom bottom",

              /*
               * Tiny interpolation only.
               *
               * No heavy catch-up.
               */
              scrub: 0.12,

              invalidateOnRefresh:
                true,
            },
          });

        /* =================================================
           01 — INTRO
           ================================================= */

        timeline.call(() => {
          changeRobotMode("intro");
        });

        timeline.to(robotStage, {
          opacity: 1,

          y: 0,
          scale: 1,

          duration: 0.28,

          ease: "power3.out",
        });

        /* =================================================
           JUMP
           ================================================= */

        timeline.to(robotStage, {
          y: -38,

          duration: 0.13,

          ease: "power2.out",
        });

        timeline.to(robotStage, {
          y: 0,

          duration: 0.18,

          ease: "power2.in",
        });

        /*
         * Landing compression.
         */

        timeline.to(robotStage, {
          scaleX: 1.025,
          scaleY: 0.975,

          duration: 0.055,
        });

        timeline.to(robotStage, {
          scaleX: 1,
          scaleY: 1,

          duration: 0.09,

          ease: "power2.out",
        });

        /* =================================================
           HI
           ================================================= */

        timeline.to(
          hiBubble,
          {
            opacity: 1,

            y: 0,
            scale: 1,

            duration: 0.16,

            ease:
              "back.out(1.4)",
          },
          "-=0.07"
        );

        /* =================================================
           ABOUT US
           ================================================= */

        timeline.to(
          aboutLabel,
          {
            opacity: 1,

            y: 0,

            duration: 0.19,

            ease:
              "power3.out",
          },
          "-=0.04"
        );

        timeline.to(
          {},
          {
            duration: 0.16,
          }
        );

        timeline.to(hiBubble, {
          opacity: 0,

          y: -6,
          scale: 0.95,

          duration: 0.12,
        });

        /* =================================================
           ROBOT CENTER → LEFT
           ================================================= */

        timeline.call(() => {
          changeRobotMode(
            "story-1"
          );
        });

        timeline.to(robotStage, {
          x: leftPosition,

          y: 0,

          duration: 0.42,

          ease:
            "power3.inOut",
        });

        /* =================================================
           STORY 01
           ================================================= */

        timeline.set(panels[0], {
          visibility: "visible",
        });

        timeline.to(panels[0], {
          opacity: 1,

          y: 0,

          duration: 0.28,

          ease: "power3.out",
        });

        timeline.to(
          {},
          {
            duration: 0.5,
          }
        );

        /* =================================================
           01 → 02
           ================================================= */

        timeline.to(panels[0], {
          opacity: 0,

          y: -20,

          duration: 0.22,

          ease:
            "power2.inOut",
        });

        timeline.set(panels[0], {
          visibility: "hidden",
        });

        timeline.call(() => {
          changeRobotMode(
            "story-2"
          );
        });

        /*
         * Tiny body movement.
         *
         * Robot stays anchored LEFT.
         */

        timeline.to(
          robotStage,
          {
            y: 15,

            rotation: -1.7,

            scale: 0.99,

            duration: 0.17,

            ease:
              "sine.inOut",
          },
          "-=0.09"
        );

        timeline.to(robotStage, {
          y: 0,

          rotation: 0,
          scale: 1,

          duration: 0.22,

          ease: "power2.out",
        });

        /* =================================================
           STORY 02
           ================================================= */

        timeline.set(panels[1], {
          visibility: "visible",
        });

        timeline.to(
          panels[1],
          {
            opacity: 1,

            y: 0,

            duration: 0.28,

            ease:
              "power3.out",
          },
          "-=0.15"
        );

        timeline.to(
          {},
          {
            duration: 0.5,
          }
        );

        /* =================================================
           02 → 03
           ================================================= */

        timeline.to(panels[1], {
          opacity: 0,

          y: -20,

          duration: 0.22,

          ease:
            "power2.inOut",
        });

        timeline.set(panels[1], {
          visibility: "hidden",
        });

        timeline.call(() => {
          changeRobotMode(
            "story-3"
          );
        });

        timeline.to(
          robotStage,
          {
            y: 14,

            rotation: 1.7,

            scale: 0.99,

            duration: 0.17,

            ease:
              "sine.inOut",
          },
          "-=0.09"
        );

        timeline.to(robotStage, {
          y: 0,

          rotation: 0,
          scale: 1,

          duration: 0.22,

          ease: "power2.out",
        });

        /* =================================================
           STORY 03
           ================================================= */

        timeline.set(panels[2], {
          visibility: "visible",
        });

        timeline.to(
          panels[2],
          {
            opacity: 1,

            y: 0,

            duration: 0.28,

            ease:
              "power3.out",
          },
          "-=0.15"
        );

        timeline.to(
          {},
          {
            duration: 0.52,
          }
        );

        /* =================================================
           STORY 03 → GOODBYE
           ================================================= */

        timeline.to(panels[2], {
          opacity: 0,

          y: -18,

          duration: 0.22,

          ease:
            "power2.inOut",
        });

        /*
         * Return to centre at the same time.
         */

        timeline.to(
          robotStage,
          {
            x: 0,

            y: 0,

            rotation: 0,

            duration: 0.34,

            ease:
              "power3.inOut",
          },
          "-=0.11"
        );

        timeline.set(panels[2], {
          visibility: "hidden",
        });

        /* =================================================
           FACE USER AGAIN
           ================================================= */

        timeline.call(() => {
          changeRobotMode("intro");
        });

        timeline.to(robotStage, {
          y: -5,

          scale: 1.012,

          duration: 0.1,

          ease: "power2.out",
        });

        timeline.to(robotStage, {
          y: 0,

          scale: 1,

          duration: 0.12,

          ease:
            "power2.inOut",
        });

        /* =================================================
           BYE
           ================================================= */

        timeline.to(
          byeBubble,
          {
            opacity: 1,

            y: 0,

            scale: 1,

            duration: 0.16,

            ease:
              "back.out(1.4)",
          },
          "-=0.05"
        );

        timeline.to(
          {},
          {
            duration: 0.18,
          }
        );

        /* =================================================
           TURN AROUND
           ================================================= */

        timeline.call(() => {
          changeRobotMode("exit");
        });

        /*
         * Let Three.js interpolate the turn.
         */

        timeline.to(
          {},
          {
            duration: 0.36,
          }
        );

        /* =================================================
           BYE DISAPPEARS
           ================================================= */

        timeline.to(
          byeBubble,
          {
            opacity: 0,

            y: -5,
            scale: 0.94,

            duration: 0.12,

            ease: "power2.in",
          },
          "-=0.15"
        );

        /* =================================================
           FINAL STATE

           Robot remains standing.
           No fade.
           No drop.
           No additional hold.
           ================================================= */

        timeline.set(robotStage, {
          opacity: 1,

          x: 0,
          y: 0,

          scale: 1,

          rotation: 0,

          visibility: "visible",
        });

        timeline.set(byeBubble, {
          opacity: 0,

          visibility: "hidden",
        });

        timeline.set(aboutLabel, {
          opacity: 1,
          y: 0,
        });

        /* =================================================
           PROGRESS
           ================================================= */

        gsap.to(progress, {
          scaleX: 1,

          ease: "none",

          scrollTrigger: {
            trigger: section,

            scroller,

            start: "top top",
            end: "bottom bottom",

            scrub: true,
          },
        });
      }, section);

    /*
     * Wait one frame so all Three.js / image dimensions
     * exist before ScrollTrigger measures the section.
     */

    const frame =
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });

    return () => {
      cancelAnimationFrame(frame);

      ctx.revert();
    };
  }, []);

  /* =======================================================
     JSX
     ======================================================= */

  return (
    <section
      ref={sectionRef}
      id="about"

      /*
       * ===================================================
       * CRITICAL ARCHITECTURE
       * ===================================================
       *
       * 500svh total.
       *
       * Sticky viewport = 100svh.
       *
       * Therefore:
       *
       * 400svh scroll distance exists while the
       * SAME About viewport remains in place.
       *
       * Once bottom meets bottom:
       * sticky naturally releases.
       *
       * No GSAP pin.
       * No overlapping spacer.
       * No shaking.
       */

      className="
        relative

        z-20

        h-[500svh]
        w-full

        isolate

        bg-white
        text-brand
      "
    >
      {/* =================================================
          NATIVE STICKY VIEWPORT
         ================================================= */}

      <div
        className="
          sticky
          top-0

          z-20

          h-[100svh]
          w-full

          overflow-hidden

          bg-white
        "
      >
        {/* =================================================
            ABOUT US
           ================================================= */}

        <div
          ref={aboutLabelRef}

          className="
            absolute

            left-6
            top-7

            z-40

            md:left-12
            md:top-9
          "
        >
          <p
            className="
              font-sora

              text-[13px]
              font-bold

              uppercase

              tracking-[0.22em]

              text-brand

              md:text-[14px]
            "
          >
            About us
          </p>
        </div>

        {/* =================================================
            3D ROBOT
           ================================================= */}

        <div
          ref={robotStageRef}

          className="
            pointer-events-none

            absolute

            left-1/2
            top-[56%]

            z-20

            h-[300px]
            w-[220px]

            -translate-x-1/2
            -translate-y-1/2

            will-change-transform

            sm:h-[360px]
            sm:w-[260px]

            md:h-[440px]
            md:w-[320px]

            lg:h-[500px]
            lg:w-[360px]
          "
        >
          <RobotScene3D
            mode={robotMode}
          />

          {/* =============================================
              HI
             ============================================= */}

          <div
            ref={hiBubbleRef}

            className="
              absolute

              -right-8
              top-[15%]

              z-30

              rounded-full

              border
              border-black/10

              bg-white

              px-4
              py-2

              shadow-[0_15px_38px_rgba(24,24,24,0.08)]
            "
          >
            <span
              className="
                font-sora

                text-[11px]
                font-semibold

                tracking-[0.08em]

                text-brand
              "
            >
              HI!
            </span>
          </div>

          {/* =============================================
              BYE
             ============================================= */}

          <div
            ref={byeBubbleRef}

            className="
              absolute

              -right-10
              top-[15%]

              z-30

              rounded-full

              border
              border-black/10

              bg-white

              px-4
              py-2

              shadow-[0_15px_38px_rgba(24,24,24,0.08)]
            "
          >
            <span
              className="
                font-sora

                text-[11px]
                font-semibold

                tracking-[0.08em]

                text-brand
              "
            >
              BYE!
            </span>
          </div>
        </div>

        {/* =================================================
            STORY PANELS
           ================================================= */}

        {STORY.map(
          (
            item,
            index
          ) => (
            <div
              key={item.number}

              ref={(element) => {
                panelRefs.current[
                  index
                ] = element;
              }}

              className="
                absolute

                left-6
                right-6

                top-[16svh]

                z-30

                md:left-auto
                md:right-[7vw]

                md:w-[43vw]
                md:max-w-[650px]
              "
            >
              {/* =========================================
                  COPY
                 ========================================= */}

              <div
                className="
                  ml-auto
                  max-w-[610px]
                "
              >
                <div
                  className="
                    mb-4

                    flex

                    items-center

                    gap-4
                  "
                >
                  <span
                    className="
                      font-sora

                      text-[10px]
                      font-semibold

                      tracking-[0.14em]

                      text-accent

                      md:text-[11px]
                    "
                  >
                    {item.number}
                  </span>

                  <span
                    className="
                      h-px
                      w-8

                      bg-black/15
                    "
                  />

                  <span
                    className="
                      font-sora

                      text-[10px]
                      font-semibold

                      uppercase

                      tracking-[0.18em]

                      text-text-muted

                      md:text-[11px]
                    "
                  >
                    {item.eyebrow}
                  </span>
                </div>

                <h2
                  className="
                    font-sora

                    text-[34px]
                    font-bold

                    leading-[0.98]

                    tracking-[-0.05em]

                    text-brand

                    sm:text-[40px]

                    md:text-[46px]

                    lg:text-[52px]
                  "
                >
                  {item.title}
                </h2>

                <p
                  className="
                    mt-5

                    max-w-[560px]

                    font-sora

                    text-[14px]

                    leading-[1.65]

                    text-text-secondary

                    md:text-[15px]
                  "
                >
                  {item.body}
                </p>
              </div>

              {/* =========================================
                  IMAGE
                 ========================================= */}

              <div
                className="
                  mt-8
                  ml-auto

                  w-full
                  max-w-[610px]

                  overflow-hidden

                  rounded-[20px]

                  border
                  border-black/[0.07]

                  bg-[#FBFBFB]

                  p-4

                  shadow-[0_18px_60px_rgba(24,24,24,0.05)]

                  md:mt-10
                  md:p-5
                "
              >
                <img
                  src={SUPPORT_IMAGE}

                  alt="THE DOT robot turnaround"

                  draggable={false}

                  className="
                    block

                    h-[150px]
                    w-full

                    select-none

                    object-contain

                    sm:h-[180px]

                    md:h-[210px]
                  "
                />
              </div>
            </div>
          )
        )}

        {/* =================================================
            PROGRESS
           ================================================= */}

        <div
          className="
            absolute

            bottom-0
            left-0
            right-0

            z-50

            h-[2px]

            bg-black/[0.06]
          "
        >
          <div
            ref={progressRef}

            className="
              h-full
              w-full

              bg-accent
            "
          />
        </div>
      </div>
    </section>
  );
}