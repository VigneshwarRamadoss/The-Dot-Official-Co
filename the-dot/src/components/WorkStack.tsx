"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import dynamic from "next/dynamic";
import Link from "next/link";

import type {
  WorkProject,
} from "./WorkCard";

const WorkCube3D = dynamic(
  () =>
    import("./WorkCube3D").then(
      (module) => module.WorkCube3D
    ),
  {
    ssr: false,

    loading: () => (
      <div className="h-full w-full" />
    ),
  }
);

interface WorkStackProps {
  projects: WorkProject[];
}

/* =========================================================
   TIMING
   ========================================================= */

const BLACK_CUBE_HOLD = 1000;

const CONTENT_REVEAL_DELAY = 420;

/*
 * Idle for 5 seconds:
 * cube automatically moves to next project.
 */
const AUTOPLAY_DELAY = 5000;

/*
 * Protect against one wheel gesture
 * triggering multiple project rotations.
 */
const WHEEL_COOLDOWN = 900;

/*
 * Ignore tiny trackpad noise.
 */
const WHEEL_THRESHOLD = 16;

export function WorkStack({
  projects,
}: WorkStackProps) {
  const rootRef =
    useRef<HTMLDivElement>(null);

  const introStartedRef =
    useRef(false);

  const autoplayTimerRef =
    useRef<number | null>(null);

  const revealTimerRef =
    useRef<number | null>(null);

  const wheelLockedRef =
    useRef(false);

  const wheelUnlockTimerRef =
    useRef<number | null>(null);

  const rotationStepRef =
    useRef(0);

  const introFinishedRef =
    useRef(false);

  const automationPausedRef =
    useRef(false);

  const [
    introMode,
    setIntroMode,
  ] = useState(true);

  const [
    imagesVisible,
    setImagesVisible,
  ] = useState(false);

  const [
    contentVisible,
    setContentVisible,
  ] = useState(false);

  const [
    introFinished,
    setIntroFinished,
  ] = useState(false);

  const [
    automationPaused,
    setAutomationPaused,
  ] = useState(false);

  const [
    rotationStep,
    setRotationStep,
  ] = useState(0);

  /* =======================================================
     KEEP REFS CURRENT
     ======================================================= */

  useEffect(() => {
    rotationStepRef.current =
      rotationStep;
  }, [rotationStep]);

  useEffect(() => {
    introFinishedRef.current =
      introFinished;
  }, [introFinished]);

  useEffect(() => {
    automationPausedRef.current =
      automationPaused;
  }, [automationPaused]);

  /* =======================================================
     FOUR PROJECT FACES

     01
     02
     03
     04 = repeat 01
     ======================================================= */

  const faceProjects =
    useMemo(() => {
      if (
        projects.length === 0
      ) {
        return [];
      }

      return Array.from(
        {
          length: 4,
        },
        (_, index) =>
          projects[
            index %
              projects.length
          ]
      );
    }, [projects]);

  const activeIndex =
    (
      (
        rotationStep %
        4
      ) +
      4
    ) %
    4;

  const activeProject =
    faceProjects[
      activeIndex
    ];

  /* =======================================================
     TIMER HELPERS
     ======================================================= */

  const clearAutoplay =
    () => {
      if (
        autoplayTimerRef.current !==
        null
      ) {
        window.clearTimeout(
          autoplayTimerRef.current
        );

        autoplayTimerRef.current =
          null;
      }
    };

  /* =======================================================
     INTRO

     0 sec
       black cube / 3 visible faces

     1 sec
       rotate into straight project face

     ~1.4 sec
       image + content reveal
     ======================================================= */

  useEffect(() => {
    const root =
      rootRef.current;

    if (!root) {
      return;
    }

    const scene =
      root.closest<HTMLElement>(
        "[data-scene-scroll]"
      );

    let blackTimer:
      number | null =
      null;

    const startIntro =
      () => {
        if (
          introStartedRef.current
        ) {
          return;
        }

        introStartedRef.current =
          true;

        blackTimer =
          window.setTimeout(
            () => {
              /*
               * Three-face black cube
               * →
               * straight front face.
               */
              setIntroMode(false);

              revealTimerRef.current =
                window.setTimeout(
                  () => {
                    setImagesVisible(
                      true
                    );

                    setContentVisible(
                      true
                    );

                    setIntroFinished(
                      true
                    );
                  },
                  CONTENT_REVEAL_DELAY
                );
            },
            BLACK_CUBE_HOLD
          );
      };

    if (!scene) {
      startIntro();
    } else if (
      scene.dataset.active ===
      "true"
    ) {
      startIntro();
    }

    if (!scene) {
      return () => {
        if (
          blackTimer !== null
        ) {
          window.clearTimeout(
            blackTimer
          );
        }

        if (
          revealTimerRef.current !==
          null
        ) {
          window.clearTimeout(
            revealTimerRef.current
          );
        }
      };
    }

    const observer =
      new MutationObserver(
        () => {
          if (
            scene.dataset.active ===
            "true"
          ) {
            startIntro();
          }
        }
      );

    observer.observe(
      scene,
      {
        attributes: true,

        attributeFilter: [
          "data-active",
        ],
      }
    );

    return () => {
      observer.disconnect();

      if (
        blackTimer !== null
      ) {
        window.clearTimeout(
          blackTimer
        );
      }

      if (
        revealTimerRef.current !==
        null
      ) {
        window.clearTimeout(
          revealTimerRef.current
        );
      }
    };
  }, []);

  /* =======================================================
     MOUSE / TRACKPAD CONTROL

     IMPORTANT:

     While cube can move in requested direction,
     EVERY wheel event is prevented.

     This includes the inertia/momentum events
     after the first physical scroll.

     Therefore page stays completely still.
     ======================================================= */

  useEffect(() => {
    const root =
      rootRef.current;

    if (!root) {
      return;
    }

    const handleWheel =
      (
        event:
          WheelEvent
      ) => {
        /*
         * Before intro finishes,
         * don't trap the user.
         */
        if (
          !introFinishedRef.current
        ) {
          return;
        }

        if (
          Math.abs(
            event.deltaY
          ) <
          WHEEL_THRESHOLD
        ) {
          return;
        }

        const current =
          (
            (
              rotationStepRef.current %
              4
            ) +
            4
          ) %
          4;

        const scrollingDown =
          event.deltaY > 0;

        /* =============================================
           RELEASE DOWNWARD SCROLL

           Project 04
                ↓
           next page section
           ============================================= */

        if (
          scrollingDown &&
          current === 3 &&
          !wheelLockedRef.current
        ) {
          return;
        }

        /* =============================================
           RELEASE UPWARD SCROLL

           Project 01
                ↑
           previous page content
           ============================================= */

        if (
          !scrollingDown &&
          current === 0 &&
          !wheelLockedRef.current
        ) {
          return;
        }

        /*
         * VERY IMPORTANT:
         *
         * Prevent page movement BEFORE checking
         * the wheel lock.
         *
         * This absorbs all momentum events from
         * the current scroll gesture.
         */
        event.preventDefault();
        event.stopPropagation();

        /*
         * Cube is already transitioning.
         *
         * Still consume wheel events,
         * but do NOT trigger another rotation.
         */
        if (
          wheelLockedRef.current
        ) {
          return;
        }

        /* =============================================
           MANUAL CONTROL STARTED

           Permanently pause autoplay.
           ============================================= */

        if (
          !automationPausedRef.current
        ) {
          automationPausedRef.current =
            true;

          setAutomationPaused(
            true
          );

          clearAutoplay();
        }

        wheelLockedRef.current =
          true;

        /*
         * Hide current project's copy.
         */
        setContentVisible(
          false
        );

        /* =============================================
           ROTATE
           ============================================= */

        if (
          scrollingDown
        ) {
          setRotationStep(
            (
              previous
            ) =>
              previous +
              1
          );
        } else {
          setRotationStep(
            (
              previous
            ) =>
              previous -
              1
          );
        }

        /*
         * Absorb mouse/trackpad momentum
         * while the cube completes movement.
         */
        if (
          wheelUnlockTimerRef.current !==
          null
        ) {
          window.clearTimeout(
            wheelUnlockTimerRef.current
          );
        }

        wheelUnlockTimerRef.current =
          window.setTimeout(
            () => {
              wheelLockedRef.current =
                false;

              wheelUnlockTimerRef.current =
                null;
            },
            WHEEL_COOLDOWN
          );
      };

    /*
     * passive:false is essential.
     *
     * Without this the browser is allowed
     * to scroll even after preventDefault().
     */
    root.addEventListener(
      "wheel",
      handleWheel,
      {
        passive: false,
        capture: true,
      }
    );

    return () => {
      root.removeEventListener(
        "wheel",
        handleWheel,
        {
          capture: true,
        }
      );

      if (
        wheelUnlockTimerRef.current !==
        null
      ) {
        window.clearTimeout(
          wheelUnlockTimerRef.current
        );
      }
    };
  }, []);

  /* =======================================================
     AUTOPLAY — 5 SECONDS
     ======================================================= */

  useEffect(() => {
    clearAutoplay();

    if (
      !introFinished ||
      !contentVisible ||
      automationPaused
    ) {
      return;
    }

    autoplayTimerRef.current =
      window.setTimeout(
        () => {
          setContentVisible(
            false
          );

          /*
           * Auto rotation always continues
           * in the same horizontal direction.
           */
          setRotationStep(
            (
              previous
            ) =>
              previous +
              1
          );
        },
        AUTOPLAY_DELAY
      );

    return () => {
      clearAutoplay();
    };
  }, [
    rotationStep,
    introFinished,
    contentVisible,
    automationPaused,
  ]);

  if (!activeProject) {
    return null;
  }

  return (
    <div
      ref={rootRef}
      className="
        relative

        grid

        min-h-[58svh]
        w-full

        grid-cols-1

        items-center

        gap-6

        overscroll-contain

        lg:grid-cols-10
        lg:gap-3
      "
    >
      {/* =================================================
          LEFT 60% — CUBE
         ================================================= */}

      <div
        className="
          relative

          h-[360px]
          w-full

          sm:h-[410px]

          md:h-[450px]

          lg:col-span-6
          lg:h-[500px]

          xl:h-[535px]
        "
      >
        <WorkCube3D
          projects={
            faceProjects
          }

          rotationStep={
            rotationStep
          }

          introMode={
            introMode
          }

          showImages={
            imagesVisible
          }

          onSettled={() => {
            /*
             * Initial reveal uses its own timer.
             */
            if (
              !introFinishedRef.current
            ) {
              return;
            }

            /*
             * New project face is now
             * looking directly forward.
             */
            setContentVisible(
              true
            );
          }}
        />

        {/* INTERACTION HINT */}

        {introFinished && (
          <div
            className="
              pointer-events-none

              absolute

              bottom-2
              left-1/2

              -translate-x-1/2

              whitespace-nowrap

              font-sora

              text-[9px]
              font-semibold

              uppercase

              tracking-[0.18em]

              text-black/25
            "
          >
            Scroll to rotate
          </div>
        )}
      </div>

      {/* =================================================
          RIGHT 40% — CONTENT
         ================================================= */}

      <div
        className="
          flex

          items-center

          lg:col-span-4

          lg:pl-4
          lg:pr-6

          xl:pl-7
          xl:pr-10
        "
      >
        <div
          key={`${activeProject.slug}-${activeIndex}`}
          className="
            w-full
            max-w-[455px]

            transition-[opacity,transform]

            duration-500

            ease-[cubic-bezier(.16,1,.3,1)]

            will-change-[opacity,transform]
          "
          style={{
            opacity:
              contentVisible
                ? 1
                : 0,

            transform:
              contentVisible
                ? "translateY(0px)"
                : "translateY(12px)",

            pointerEvents:
              contentVisible
                ? "auto"
                : "none",
          }}
        >
          {/* META */}

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

                uppercase

                tracking-[0.16em]

                text-black/40
              "
            >
              {String(
                activeIndex +
                  1
              ).padStart(
                2,
                "0"
              )}
            </span>

            <span
              className="
                h-px
                w-10

                bg-black/15
              "
            />

            <span
              className="
                font-sora

                text-[10px]
                font-semibold

                uppercase

                tracking-[0.16em]

                text-black/40
              "
            >
              {
                activeProject.client
              }
            </span>
          </div>

          {/* TITLE */}

          <h3
            className="
              max-w-[450px]

              font-sora

              text-[40px]
              font-bold

              leading-[0.94]

              tracking-[-0.055em]

              text-[#181818]

              sm:text-[44px]

              xl:text-[54px]
            "
          >
            {
              activeProject.title
            }
          </h3>

          {/* DESCRIPTION */}

          <p
            className="
              mt-5

              max-w-[420px]

              font-sora

              text-[14px]

              leading-[1.7]

              text-black/55

              xl:text-[15px]
            "
          >
            {
              activeProject.summary ??
              `Selected work for ${activeProject.client}. Explore the thinking, design decisions and execution behind the project.`
            }
          </p>

          {/* TAGS */}

          <div
            className="
              mt-6

              flex
              flex-wrap

              gap-2
            "
          >
            {activeProject.tags.map(
              (
                tag,
                index
              ) => (
                <span
                  key={`${tag}-${index}`}
                  className="
                    rounded-full

                    border
                    border-black/[0.09]

                    px-3
                    py-1.5

                    font-sora

                    text-[9px]
                    font-semibold

                    uppercase

                    tracking-[0.09em]

                    text-black/50
                  "
                >
                  {tag}
                </span>
              )
            )}
          </div>

          {/* CTA */}

          <Link
            href={`/work/${activeProject.slug}`}
            className="
              group

              mt-8

              inline-flex

              items-center
              gap-4

              font-sora

              text-[13px]
              font-semibold

              text-[#181818]
            "
          >
            <span className="relative">
              View full story

              <span
                className="
                  absolute

                  -bottom-[5px]
                  left-0

                  h-px
                  w-full

                  origin-left

                  bg-[#181818]

                  transition-transform

                  duration-500

                  ease-[cubic-bezier(.16,1,.3,1)]

                  group-hover:scale-x-[0.3]
                "
              />
            </span>

            <span
              className="
                grid

                h-10
                w-10

                place-items-center

                rounded-full

                border
                border-black/10

                transition-all

                duration-500

                ease-[cubic-bezier(.16,1,.3,1)]

                group-hover:rotate-45
                group-hover:bg-[#181818]
                group-hover:text-white
              "
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="
                  h-4
                  w-4
                "
              >
                <path
                  d="M5 19L19 5M10 5H19V14"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Link>

          {/* STATUS */}

          <p
            className="
              mt-8

              font-sora

              text-[9px]
              font-semibold

              uppercase

              tracking-[0.16em]

              text-black/20
            "
          >
            {automationPaused
              ? "Manual control"
              : "Scroll to rotate"}
          </p>
        </div>
      </div>
    </div>
  );
}