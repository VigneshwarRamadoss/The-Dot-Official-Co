"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import gsap from "gsap";

/* =========================================================
   CLIENT DATA
   ========================================================= */

const clients = [
  {
    mark: "N",
    name: "Northstar Labs",
  },
  {
    mark: "A",
    name: "Aster House",
  },
  {
    mark: "F",
    name: "Fieldnote",
  },
  {
    mark: "M",
    name: "Morrow",
  },
  {
    mark: "K",
    name: "Kiteworks",
  },
  {
    mark: "O",
    name: "Orbit Works",
  },
];

/* =========================================================
   ORBIT POSITIONS
   ========================================================= */

const CLIENT_POSITIONS = [
  {
    angle: -92,
    radius: 31,
  },
  {
    angle: -32,
    radius: 36,
  },
  {
    angle: 28,
    radius: 41,
  },
  {
    angle: 88,
    radius: 43,
  },
  {
    angle: 148,
    radius: 39,
  },
  {
    angle: 208,
    radius: 34,
  },
];

/* =========================================================
   PLACEHOLDER LOGOS
   ========================================================= */

function ClientLogo({
  index,
  mark,
  active,
}: {
  index: number;
  mark: string;
  active: boolean;
}) {
  const symbols = [
    <svg
      key="northstar"
      viewBox="0 0 40 40"
      className="h-[46%] w-[46%]"
      fill="none"
    >
      <path
        d="M20 5L23.8 16.2L35 20L23.8 23.8L20 35L16.2 23.8L5 20L16.2 16.2L20 5Z"
        fill="currentColor"
      />
    </svg>,

    <svg
      key="aster"
      viewBox="0 0 40 40"
      className="h-[46%] w-[46%]"
      fill="none"
    >
      <circle
        cx="20"
        cy="20"
        r="12"
        stroke="currentColor"
        strokeWidth="3"
      />

      <circle
        cx="20"
        cy="20"
        r="4"
        fill="currentColor"
      />
    </svg>,

    <svg
      key="fieldnote"
      viewBox="0 0 40 40"
      className="h-[46%] w-[46%]"
      fill="none"
    >
      <path
        d="M8 10H31L21 20L31 30H8V10Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>,

    <svg
      key="morrow"
      viewBox="0 0 40 40"
      className="h-[46%] w-[46%]"
      fill="none"
    >
      <path
        d="M7 29V11L20 23L33 11V29"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>,

    <svg
      key="kiteworks"
      viewBox="0 0 40 40"
      className="h-[46%] w-[46%]"
      fill="none"
    >
      <path
        d="M20 5L34 20L20 35L6 20L20 5Z"
        stroke="currentColor"
        strokeWidth="3"
      />

      <path
        d="M20 5V35"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>,

    <svg
      key="orbit"
      viewBox="0 0 40 40"
      className="h-[46%] w-[46%]"
      fill="none"
    >
      <ellipse
        cx="20"
        cy="20"
        rx="15"
        ry="7"
        stroke="currentColor"
        strokeWidth="2.5"
        transform="rotate(-30 20 20)"
      />

      <circle
        cx="20"
        cy="20"
        r="5"
        fill="currentColor"
      />
    </svg>,
  ];

  return (
    <div
      aria-label={mark}
      className={`
        relative

        grid
        h-full
        w-full
        place-items-center

        rounded-full
        border

        transition-[background-color,border-color,color,box-shadow,opacity,transform]
        duration-200
        ease-out

        ${
          active
            ? `
              border-[#181818]
              bg-[#181818]
              text-white

              shadow-[0_0_0_5px_rgba(24,24,24,0.045),0_0_28px_rgba(71,43,42,0.16),0_13px_32px_rgba(24,24,24,0.10)]
            `
            : `
              border-black/[0.16]
              bg-white
              text-brand/55
            `
        }
      `}
    >
      {symbols[index] ?? mark}

      {/* Mild illuminated centre when selected */}

      <span
        aria-hidden="true"
        className={`
          pointer-events-none

          absolute

          left-1/2
          top-1/2

          h-[4px]
          w-[4px]

          -translate-x-1/2
          -translate-y-1/2

          rounded-full

          bg-white

          transition-all
          duration-150

          ${
            active
              ? `
                scale-100
                opacity-80
                shadow-[0_0_10px_rgba(255,255,255,0.65)]
              `
              : `
                scale-0
                opacity-0
              `
          }
        `}
      />
    </div>
  );
}

/* =========================================================
   ORBIT GUIDES
   ========================================================= */

function OrbitGuides() {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      className="h-full w-full"
    >
      <circle
        cx="50"
        cy="50"
        r="25"
        fill="none"
        stroke="currentColor"
        strokeWidth=".18"
      />

      <circle
        cx="50"
        cy="50"
        r="36"
        fill="none"
        stroke="currentColor"
        strokeWidth=".16"
      />

      <circle
        cx="50"
        cy="50"
        r="47"
        fill="none"
        stroke="currentColor"
        strokeWidth=".14"
      />
    </svg>
  );
}

/* =========================================================
   TRUSTED CLIENTS
   ========================================================= */

export function TrustedClients() {
  const sectionRef =
    useRef<HTMLElement>(null);

  const orbitRef =
    useRef<HTMLDivElement>(null);

  const indicatorRef =
    useRef<HTMLDivElement>(null);

  const centerRef =
    useRef<HTMLDivElement>(null);

  const logoRefs =
    useRef<
      Array<HTMLDivElement | null>
    >([]);

  const [
    activeIndex,
    setActiveIndex,
  ] = useState<number | null>(0);

  const [
    targetIndex,
    setTargetIndex,
  ] = useState(0);

  const currentIndexRef =
    useRef(0);

  const currentRotationRef =
    useRef(0);

  const autoplayRef =
    useRef<number | null>(null);

  /* =======================================================
     MOVE INDICATOR
     ======================================================= */

  const moveIndicatorTo =
    useCallback(
      (
        index: number,
        immediate = false
      ) => {
        const orbit =
          orbitRef.current;

        const indicator =
          indicatorRef.current;

        const logo =
          logoRefs.current[index];

        if (
          !orbit ||
          !indicator ||
          !logo
        ) {
          return;
        }

        /* ===============================================
           MEASURE TRUE LOGO CENTRE
           =============================================== */

        const orbitRect =
          orbit.getBoundingClientRect();

        const logoRect =
          logo.getBoundingClientRect();

        const centerX =
          orbitRect.width / 2;

        const centerY =
          orbitRect.height / 2;

        const logoCenterX =
          logoRect.left -
          orbitRect.left +
          logoRect.width / 2;

        const logoCenterY =
          logoRect.top -
          orbitRect.top +
          logoRect.height / 2;

        const dx =
          logoCenterX - centerX;

        const dy =
          logoCenterY - centerY;

        const distance =
          Math.sqrt(
            dx * dx +
              dy * dy
          );

        let angle =
          Math.atan2(
            dy,
            dx
          ) *
          (180 / Math.PI);

        /* ===============================================
           CONTINUOUS ROTATION
           =============================================== */

        if (!immediate) {
          while (
            angle <=
            currentRotationRef.current +
              0.5
          ) {
            angle += 360;
          }
        }

        currentRotationRef.current =
          angle;

        currentIndexRef.current =
          index;

        setTargetIndex(index);

        /*
         * Previous logo stops glowing immediately
         * when the pointer leaves it.
         */

        setActiveIndex(null);

        /* ===============================================
           INITIAL LOAD
           =============================================== */

        if (immediate) {
          gsap.set(
            indicator,
            {
              rotation: angle,
              width: distance,
            }
          );

          setActiveIndex(index);

          return;
        }

        /* ===============================================
           TRAVEL

           Reduced from 1.25s → 0.95s.

           Enough to feel elegant,
           but no longer sluggish.
           =============================================== */

        gsap.to(
          indicator,
          {
            rotation: angle,

            width: distance,

            duration: 0.95,

            ease:
              "power3.inOut",

            overwrite: true,

            onComplete: () => {
              /*
               * Active state switches immediately
               * when line reaches logo centre.
               */

              setActiveIndex(index);

              const targetLogo =
                logoRefs.current[
                  index
                ];

              if (targetLogo) {
                /*
                 * Quick arrival reaction.
                 *
                 * No long 500ms brightness delay.
                 */

                gsap.fromTo(
                  targetLogo,
                  {
                    scale: 0.96,
                  },
                  {
                    scale: 1,

                    duration: 0.24,

                    ease:
                      "back.out(1.55)",
                  }
                );
              }

              if (
                centerRef.current
              ) {
                gsap.fromTo(
                  centerRef.current,
                  {
                    scale: 0.985,
                  },
                  {
                    scale: 1,

                    duration: 0.22,

                    ease:
                      "power2.out",
                  }
                );
              }
            },
          }
        );
      },
      []
    );

  /* =======================================================
     INITIAL
     ======================================================= */

  useEffect(() => {
    const frame =
      requestAnimationFrame(() => {
        moveIndicatorTo(
          0,
          true
        );
      });

    return () => {
      cancelAnimationFrame(
        frame
      );
    };
  }, [moveIndicatorTo]);

  /* =======================================================
     RESPONSIVE RECALCULATION
     ======================================================= */

  useEffect(() => {
    const orbit =
      orbitRef.current;

    if (!orbit) {
      return;
    }

    const observer =
      new ResizeObserver(() => {
        requestAnimationFrame(
          () => {
            moveIndicatorTo(
              currentIndexRef.current,
              true
            );
          }
        );
      });

    observer.observe(orbit);

    return () => {
      observer.disconnect();
    };
  }, [moveIndicatorTo]);

  /* =======================================================
     AUTOPLAY
     ======================================================= */

  useEffect(() => {
    const reduced =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

    if (reduced) {
      return;
    }

    autoplayRef.current =
      window.setInterval(
        () => {
          const next =
            (
              currentIndexRef.current +
              1
            ) %
            clients.length;

          moveIndicatorTo(next);
        },
        3200
      );

    return () => {
      if (
        autoplayRef.current !==
        null
      ) {
        window.clearInterval(
          autoplayRef.current
        );
      }
    };
  }, [moveIndicatorTo]);

  /* =======================================================
     SELECT
     ======================================================= */

  const handleSelect = (
    index: number
  ) => {
    if (
      index ===
        currentIndexRef.current &&
      activeIndex === index
    ) {
      return;
    }

    moveIndicatorTo(index);
  };

  /* =======================================================
     POSITION CALC
     ======================================================= */

  const getNodePosition = (
    angle: number,
    radius: number
  ) => {
    const radians =
      (angle * Math.PI) /
      180;

    return {
      left:
        50 +
        Math.cos(radians) *
          radius,

      top:
        50 +
        Math.sin(radians) *
          radius,
    };
  };

  /* =======================================================
     JSX
     ======================================================= */

  return (
    <section
      ref={sectionRef}
      id="trusted-clients"
      className="
        relative

        flex
        h-[100svh]
        w-full

        flex-col

        overflow-hidden

        bg-white

        px-6
        pb-5
        pt-8

        text-brand

        md:px-12
        md:pb-7
        md:pt-10
      "
    >
      {/* =================================================
          HEADER
         ================================================= */}

      <div
        className="
          relative

          z-20

          mx-auto

          flex
          w-full
          max-w-[1440px]

          shrink-0

          items-start
          justify-between

          gap-8
        "
      >
        <div>
          <p
            className="
              font-sora

              text-[10px]
              font-semibold

              uppercase

              tracking-[0.2em]

              text-text-muted

              md:text-[11px]
            "
          >
            Trusted clients
          </p>

          <h2
            className="
              mt-2

              max-w-[530px]

              font-sora

              text-[36px]
              font-bold

              leading-[0.94]

              tracking-[-0.055em]

              text-brand

              sm:text-[42px]
              md:text-[48px]
              lg:text-[54px]
            "
          >
            Teams we move with.
          </h2>
        </div>

        <div
          className="
            hidden

            items-baseline
            gap-2

            font-sora

            md:flex
          "
        >
          <span
            className="
              text-[13px]
              font-semibold
              text-brand
            "
          >
            0{targetIndex + 1}
          </span>

          <span
            className="
              text-[10px]
              text-text-muted
            "
          >
            /
          </span>

          <span
            className="
              text-[10px]
              text-text-muted
            "
          >
            0{clients.length}
          </span>
        </div>
      </div>

      {/* =================================================
          ORBIT STAGE
         ================================================= */}

      <div
        className="
          relative

          flex
          min-h-0
          flex-1

          items-start
          justify-center

          pt-2

          md:pt-0
        "
      >
        <div
          ref={orbitRef}
          className="
            relative

            aspect-square
            shrink-0
          "
          style={{
            width:
              "min(82vw, 62svh, 570px)",
          }}
        >
          {/* =============================================
              VERY SOFT RADAR LIGHT

              Inspired by your second reference,
              but intentionally much lighter.
             ============================================= */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none

              absolute
              inset-[9%]

              rounded-full
            "
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(71,43,42,0.055) 0%, rgba(71,43,42,0.025) 34%, rgba(24,24,24,0.012) 55%, rgba(255,255,255,0) 72%)",

              filter:
                "blur(12px)",
            }}
          />

          {/* =============================================
              DARKER ORBIT RINGS
             ============================================= */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none

              absolute
              inset-[3%]

              text-black/[0.15]
            "
          >
            <OrbitGuides />
          </div>

          {/* =============================================
              POINTER
             ============================================= */}

          <div
            ref={indicatorRef}
            aria-hidden="true"
            className="
              pointer-events-none

              absolute

              left-1/2
              top-1/2

              z-10

              h-px

              origin-left

              bg-brand/65

              will-change-transform
            "
          >
            <span
              className="
                absolute

                right-[-3px]
                top-1/2

                h-[6px]
                w-[6px]

                -translate-y-1/2

                rounded-full

                bg-brand

                shadow-[0_0_8px_rgba(71,43,42,0.22)]
              "
            />
          </div>

          {/* =============================================
              CENTER
             ============================================= */}

          <div
            ref={centerRef}
            className="
              absolute

              left-1/2
              top-1/2

              z-20

              flex

              h-[92px]
              w-[92px]

              -translate-x-1/2
              -translate-y-1/2

              items-center
              justify-center

              rounded-full

              border
              border-black/[0.14]

              bg-white

              shadow-[0_10px_34px_rgba(24,24,24,0.055)]

              md:h-[104px]
              md:w-[104px]
            "
          >
            <span
              className="
                font-sora

                text-[15px]
                font-bold

                tracking-[-0.03em]

                text-brand

                md:text-[16px]
              "
            >
              THE DOT
            </span>
          </div>

          {/* =============================================
              CLIENTS
             ============================================= */}

          {clients.map(
            (
              client,
              index
            ) => {
              const {
                angle,
                radius,
              } =
                CLIENT_POSITIONS[
                  index
                ];

              const position =
                getNodePosition(
                  angle,
                  radius
                );

              const active =
                activeIndex ===
                index;

              return (
                <div
                  key={
                    client.name
                  }
                  className="
                    absolute

                    z-20

                    -translate-x-1/2
                    -translate-y-1/2
                  "
                  style={{
                    left:
                      `${position.left}%`,

                    top:
                      `${position.top}%`,
                  }}
                >
                  <button
                    type="button"
                    aria-label={`Select ${client.name}`}
                    aria-pressed={
                      active
                    }
                    onClick={() =>
                      handleSelect(
                        index
                      )
                    }
                    className="
                      group

                      relative

                      block

                      h-[50px]
                      w-[50px]

                      cursor-pointer

                      border-0
                      bg-transparent
                      p-0

                      outline-none

                      sm:h-[54px]
                      sm:w-[54px]

                      md:h-[58px]
                      md:w-[58px]
                    "
                  >
                    {/* LOGO */}

                    <div
                      ref={(
                        element
                      ) => {
                        logoRefs.current[
                          index
                        ] =
                          element;
                      }}
                      className={`
                        relative

                        h-full
                        w-full

                        rounded-full

                        transition-[opacity,transform,filter]
                        duration-200
                        ease-out

                        ${
                          active
                            ? `
                              scale-110
                              opacity-100
                              brightness-110
                            `
                            : `
                              scale-100
                              opacity-55
                              brightness-95

                              group-hover:opacity-80
                            `
                        }
                      `}
                      style={{
                        filter:
                          active
                            ? "brightness(1.08) drop-shadow(0 0 11px rgba(71,43,42,0.16))"
                            : undefined,
                      }}
                    >
                      <ClientLogo
                        index={
                          index
                        }
                        mark={
                          client.mark
                        }
                        active={
                          active
                        }
                      />
                    </div>

                    {/* NAME */}

                    <span
                      className={`
                        pointer-events-none

                        absolute

                        left-[calc(100%+12px)]
                        top-1/2

                        min-w-max

                        -translate-y-1/2

                        whitespace-nowrap

                        font-sora

                        text-[11px]
                        font-semibold

                        tracking-[-0.02em]

                        transition-all
                        duration-200

                        md:text-[12px]

                        ${
                          active
                            ? `
                              translate-x-0

                              text-brand

                              opacity-100
                            `
                            : `
                              -translate-x-1

                              text-brand/42

                              opacity-80

                              group-hover:translate-x-0
                              group-hover:text-brand/70
                            `
                        }
                      `}
                    >
                      {client.name}
                    </span>
                  </button>
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* MOBILE */}

      <div
        className="
          relative

          z-30

          shrink-0

          pb-2

          text-center

          md:hidden
        "
      >
        <p
          className="
            font-sora

            text-[13px]
            font-semibold

            text-brand
          "
        >
          {
            clients[
              targetIndex
            ].name
          }
        </p>

        <p
          className="
            mt-1

            font-sora

            text-[9px]

            uppercase

            tracking-[0.14em]

            text-text-muted
          "
        >
          0{targetIndex + 1}
          {" / "}
          0{clients.length}
        </p>
      </div>
    </section>
  );
}