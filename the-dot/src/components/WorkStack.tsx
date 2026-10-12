"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import dynamic from "next/dynamic";
import Link from "next/link";

import type { WorkProject } from "./WorkCard";

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

const AUTOPLAY_DELAY = 5000;
const WHEEL_COOLDOWN = 1000;
const DOCKED_MANUAL_DELAY = 720;
const WHEEL_THRESHOLD = 16;

const WORK_THOUGHTS = [
  {
    text: "A space that feels like home.",
    animation: "proud",
  },
  {
    text: "Complex underneath. Simple to use.",
    animation: "thinking",
  },
  {
    text: "Clean systems make scaling feel lighter.",
    animation: "playful",
  },
  {
    text: "Back where we started. Still looks good.",
    animation: "proud",
  },
] as const;

export function WorkStack({
  projects,
}: WorkStackProps) {
  const rootRef =
    useRef<HTMLDivElement>(null);

  const introStartedRef =
    useRef(false);

  const autoplayTimerRef =
    useRef<number | null>(null);

  const wheelLockedRef =
    useRef(false);

  const wheelUnlockTimerRef =
    useRef<number | null>(null);

  const manualRotationTimerRef =
    useRef<number | null>(null);

  const rotationStepRef =
    useRef(0);

  const introFinishedRef =
    useRef(false);

  const automationPausedRef =
    useRef(false);

  const dotDockedRef =
    useRef(false);

  const pendingRotationDirectionRef =
    useRef<1 | -1>(1);

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

  const clearAutoplay =
    useCallback(() => {
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
    }, []);

  const clearManualTimer =
    useCallback(() => {
      if (
        manualRotationTimerRef.current !==
        null
      ) {
        window.clearTimeout(
          manualRotationTimerRef.current
        );

        manualRotationTimerRef.current =
          null;
      }
    }, []);

  const notifyDotPull =
    useCallback(
      (
        direction: 1 | -1,
        source:
          | "intro"
          | "auto"
          | "manual"
      ) => {
        window.dispatchEvent(
          new CustomEvent(
            "dot:work-pull-start",
            {
              detail: {
                direction,
                source,
              },
            }
          )
        );
      },
      []
    );

  const notifyDotSettled =
    useCallback(
      (
        index: number
      ) => {
        const thought =
          WORK_THOUGHTS[
            index %
              WORK_THOUGHTS.length
          ];

        window.dispatchEvent(
          new CustomEvent(
            "dot:work-settled",
            {
              detail: {
                index,
                thought:
                  thought.text,
                animation:
                  thought.animation,
              },
            }
          )
        );
      },
      []
    );

  const rotateCube =
    useCallback(
      (
        direction:
          | 1
          | -1,
        source:
          | "auto"
          | "manual"
      ) => {
        pendingRotationDirectionRef.current =
          direction;

        setContentVisible(
          false
        );

        notifyDotPull(
          direction,
          source
        );

        setRotationStep(
          (previous) =>
            previous +
            direction
        );
      },
      [
        notifyDotPull,
      ]
    );

  /* =========================================================
     DOT DOCK STATE
     ========================================================= */

  useEffect(() => {
    const handleDockState =
      (
        event: Event
      ) => {
        const detail =
          (
            event as CustomEvent<{
              docked:
                boolean;
            }>
          ).detail;

        dotDockedRef.current =
          detail.docked;
      };

    window.addEventListener(
      "dot:work-docked-state",
      handleDockState
    );

    return () => {
      window.removeEventListener(
        "dot:work-docked-state",
        handleDockState
      );
    };
  }, []);

  /* =========================================================
     RESET
     ========================================================= */

  useEffect(() => {
    const handleWorkReset =
      () => {
        clearAutoplay();
        clearManualTimer();

        if (
          wheelUnlockTimerRef.current !==
          null
        ) {
          window.clearTimeout(
            wheelUnlockTimerRef.current
          );

          wheelUnlockTimerRef.current =
            null;
        }

        introStartedRef.current =
          false;

        rotationStepRef.current =
          0;

        introFinishedRef.current =
          false;

        automationPausedRef.current =
          false;

        dotDockedRef.current =
          false;

        pendingRotationDirectionRef.current =
          1;

        wheelLockedRef.current =
          false;

        setIntroMode(
          true
        );

        setImagesVisible(
          false
        );

        setContentVisible(
          false
        );

        setIntroFinished(
          false
        );

        setAutomationPaused(
          false
        );

        setRotationStep(
          0
        );
      };

    window.addEventListener(
      "dot:work-reset",
      handleWorkReset
    );

    return () => {
      window.removeEventListener(
        "dot:work-reset",
        handleWorkReset
      );
    };
  }, [
    clearAutoplay,
    clearManualTimer,
  ]);

  /* =========================================================
     INTRO
     ========================================================= */

  useEffect(() => {
    const handleIntroPull =
      () => {
        if (
          introStartedRef.current
        ) {
          return;
        }

        introStartedRef.current =
          true;

        pendingRotationDirectionRef.current =
          1;

        setImagesVisible(
          true
        );

        notifyDotPull(
          1,
          "intro"
        );

        setIntroMode(
          false
        );
      };

    window.addEventListener(
      "dot:work-intro-pull",
      handleIntroPull
    );

    return () => {
      window.removeEventListener(
        "dot:work-intro-pull",
        handleIntroPull
      );
    };
  }, [
    notifyDotPull,
  ]);

  /* =========================================================
     MANUAL WHEEL CONTROL
     ========================================================= */

  useEffect(() => {
    const root =
      rootRef.current;

    if (!root) {
      return;
    }

    const handleWheel =
      (
        event: WheelEvent
      ) => {
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
          event.deltaY >
          0;

        if (
          scrollingDown &&
          current === 3 &&
          !wheelLockedRef.current
        ) {
          return;
        }

        if (
          !scrollingDown &&
          current === 0 &&
          !wheelLockedRef.current
        ) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();

        if (
          wheelLockedRef.current
        ) {
          return;
        }

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

        const direction:
          | 1
          | -1 =
          scrollingDown
            ? 1
            : -1;

        window.dispatchEvent(
          new CustomEvent(
            "dot:work-interaction",
            {
              detail: {
                direction,
              },
            }
          )
        );

        clearManualTimer();

        const rotationDelay =
          dotDockedRef.current
            ? DOCKED_MANUAL_DELAY
            : 0;

        manualRotationTimerRef.current =
          window.setTimeout(
            () => {
              rotateCube(
                direction,
                "manual"
              );

              manualRotationTimerRef.current =
                null;
            },
            rotationDelay
          );

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
            WHEEL_COOLDOWN +
              rotationDelay
          );
      };

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

      clearManualTimer();

      if (
        wheelUnlockTimerRef.current !==
        null
      ) {
        window.clearTimeout(
          wheelUnlockTimerRef.current
        );
      }
    };
  }, [
    clearAutoplay,
    clearManualTimer,
    rotateCube,
  ]);

  /* =========================================================
     AUTOPLAY
     ========================================================= */

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
          rotateCube(
            1,
            "auto"
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
    clearAutoplay,
    rotateCube,
  ]);

  if (
    !activeProject
  ) {
    return null;
  }

  return (
    <div
      ref={rootRef}
      className="
        relative
        grid
        h-full
        min-h-0
        w-full
        grid-cols-1
        items-center
        overscroll-contain
        lg:grid-cols-12
        lg:gap-0
      "
    >
      {/* =================================================
          SMALL LEFT BREATHING SPACE
         ================================================= */}

      <div
        aria-hidden="true"
        className="
          hidden
          h-full
          lg:col-span-1
          lg:block
        "
      />

      {/* =================================================
          LARGE CUBE AREA
         ================================================= */}

      <div
        data-work-cube-zone
        className="
          relative
          flex
          h-[390px]
          min-h-0
          w-full
          flex-col

          sm:h-[440px]
          md:h-[500px]

          lg:col-span-6
          lg:h-[clamp(470px,65vh,590px)]
          lg:-translate-x-4

          xl:h-[clamp(500px,67vh,620px)]
          xl:-translate-x-6
        "
      >
        <div
          className="
            min-h-0
            w-full
            flex-1
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
              const current =
                (
                  (
                    rotationStepRef.current %
                    4
                  ) +
                  4
                ) %
                4;

              if (
                !introFinishedRef.current
              ) {
                introFinishedRef.current =
                  true;

                setIntroFinished(
                  true
                );

                setContentVisible(
                  true
                );

                notifyDotSettled(
                  current
                );

                return;
              }

              setContentVisible(
                true
              );

              notifyDotSettled(
                current
              );
            }}
          />
        </div>

        {/* =================================================
            DOT HOME

            Under cube, toward its lower-right.
           ================================================= */}

        <span
          data-dot-work-home
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -bottom-[4px]
            left-[83%]
            h-px
            w-px
          "
        />
      </div>

      {/* =================================================
          PROJECT COPY

          Larger and closer to cube.
         ================================================= */}

      <div
        className="
          flex
          min-w-0
          items-center

          lg:col-span-5
          lg:-ml-10
          lg:pr-4

          xl:-ml-14
          xl:pr-5
        "
      >
        <div
          key={`${activeProject.slug}-${activeIndex}`}
          className="
            w-full
            max-w-[500px]

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
              mb-5
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
                tracking-[0.18em]
                text-black/42

                xl:text-[11px]
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
                tracking-[0.18em]
                text-black/42

                xl:text-[11px]
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
              max-w-[500px]

              font-sora

              text-[38px]
              font-bold

              leading-[0.96]
              tracking-[-0.055em]

              text-[#181818]

              sm:text-[42px]
              lg:text-[48px]
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
              mt-6
              max-w-[480px]

              font-sora

              text-[14px]
              leading-[1.7]

              text-black/50

              lg:text-[15px]
              xl:text-[16px]
            "
          >
            {activeProject.summary ??
              `Selected work for ${activeProject.client}. Explore the thinking, design decisions and execution behind the project.`}
          </p>

          {/* TAGS */}

          <div
            className="
              mt-6
              flex
              flex-wrap
              gap-2.5
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

                    px-4
                    py-2

                    font-sora

                    text-[9px]
                    font-semibold

                    uppercase
                    tracking-[0.09em]

                    text-black/48
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

              xl:text-[14px]
            "
          >
            <span className="relative">
              View full story

              <span
                className="
                  absolute
                  -bottom-[6px]
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

                h-11
                w-11

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

          <p
            className="
              mt-7

              font-sora

              text-[8px]
              font-semibold

              uppercase
              tracking-[0.17em]

              text-black/18
            "
          >
            {automationPaused
              ? "Manual control"
              : ""}
          </p>
        </div>
      </div>

      {/* =================================================
          SCREEN-CENTRED SCROLL LABEL
         ================================================= */}

      <div
  className="
    pointer-events-none
    absolute
    bottom-[-16px]
    left-1/2
    z-20
    -translate-x-1/2
    whitespace-nowrap
    font-sora
    text-[8px]
    font-semibold
    uppercase
    tracking-[0.2em]
    text-black/22
    lg:text-[9px]
  "
>
  {introFinished
    ? "Scroll to rotate"
    : "\u00A0"}
</div>
    </div>
  );
}