"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";

/* =========================================================
   CLIENTS
   ========================================================= */

const clients = [
  { mark: "N", name: "Northstar Labs" },
  { mark: "A", name: "Aster House" },
  { mark: "F", name: "Fieldnote" },
  { mark: "M", name: "Morrow" },
  { mark: "K", name: "Kiteworks" },
  { mark: "O", name: "Orbit Works" },
];

/* =========================================================
   POSITIONS
   ========================================================= */

const CLIENT_POSITIONS = [
  { angle: -90, radius: 31 },
  { angle: -28, radius: 36 },
  { angle: 26, radius: 41 },
  { angle: 88, radius: 43 },
  { angle: 148, radius: 39 },
  { angle: 210, radius: 34 },
];

/* =========================================================
   CLIENT LOGOS
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
      className={`
        relative
        grid
        h-full
        w-full
        place-items-center
        rounded-full
        border
        transition-[background-color,border-color,color,box-shadow,opacity,transform]
        duration-100
        ease-out
        ${
          active
            ? "border-black bg-black text-white"
            : "border-black/12 bg-white text-black/42"
        }
      `}
      style={
        active
          ? {
              boxShadow:
                "0 0 0 4px rgba(0,0,0,0.05), 0 0 18px rgba(0,0,0,0.16), 0 10px 24px rgba(0,0,0,0.10)",
            }
          : undefined
      }
    >
      {symbols[index] ?? mark}
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
        strokeWidth=".22"
      />
      <circle
        cx="50"
        cy="50"
        r="36"
        fill="none"
        stroke="currentColor"
        strokeWidth=".2"
      />
      <circle
        cx="50"
        cy="50"
        r="47"
        fill="none"
        stroke="currentColor"
        strokeWidth=".18"
      />
    </svg>
  );
}

/* =========================================================
   COMPONENT
   ========================================================= */

export function TrustedClients() {
  const orbitRef =
    useRef<HTMLDivElement>(null);

  const sweepGroupRef =
    useRef<HTMLDivElement>(null);

  const glowWedgeRef =
    useRef<HTMLDivElement>(null);

  const indicatorRef =
    useRef<HTMLDivElement>(null);

  const centerRef =
    useRef<HTMLDivElement>(null);

  const logoRefs =
    useRef<
      Array<HTMLDivElement | null>
    >([]);

  const motionTweenRef =
    useRef<gsap.core.Tween | null>(null);

  const autoplayTimerRef =
    useRef<number | null>(null);

  const currentIndexRef = useRef(0);
  const currentRotationRef = useRef(0);
  const tabHiddenRef = useRef(false);

  const [activeIndex, setActiveIndex] =
    useState<number | null>(0);

  const [targetIndex, setTargetIndex] =
    useState(0);

  const clearAutoplay =
    useCallback(() => {
      if (autoplayTimerRef.current !== null) {
        window.clearTimeout(
          autoplayTimerRef.current
        );
        autoplayTimerRef.current = null;
      }
    }, []);

  const getNodePosition = (
    angle: number,
    radius: number
  ) => {
    const radians = (angle * Math.PI) / 180;

    return {
      left: 50 + Math.cos(radians) * radius,
      top: 50 + Math.sin(radians) * radius,
    };
  };

  const moveIndicatorTo = useCallback(
    (index: number, immediate = false) => {
      const orbit = orbitRef.current;
      const sweepGroup = sweepGroupRef.current;
      const glowWedge = glowWedgeRef.current;
      const indicator = indicatorRef.current;
      const logo = logoRefs.current[index];

      if (
        !orbit ||
        !sweepGroup ||
        !glowWedge ||
        !indicator ||
        !logo
      ) {
        return;
      }

      const orbitRect =
        orbit.getBoundingClientRect();
      const logoRect =
        logo.getBoundingClientRect();

      const centerX = orbitRect.width / 2;
      const centerY = orbitRect.height / 2;

      const logoCenterX =
        logoRect.left -
        orbitRect.left +
        logoRect.width / 2;

      const logoCenterY =
        logoRect.top -
        orbitRect.top +
        logoRect.height / 2;

      const dx = logoCenterX - centerX;
      const dy = logoCenterY - centerY;

      const distance = Math.sqrt(dx * dx + dy * dy);

      let angle =
        Math.atan2(dy, dx) * (180 / Math.PI);

      if (!immediate) {
        while (
          angle <=
          currentRotationRef.current + 0.5
        ) {
          angle += 360;
        }
      }

      currentRotationRef.current = angle;
      currentIndexRef.current = index;
      setTargetIndex(index);
      setActiveIndex(null);

      if (immediate) {
        gsap.set(sweepGroup, {
          rotation: angle,
        });

        gsap.set(indicator, {
          width: distance,
        });

        gsap.set(glowWedge, {
          width: distance,
        });

        setActiveIndex(index);
        return;
      }

      motionTweenRef.current?.kill();

      const proxy = {
        rotation:
          (gsap.getProperty(
            sweepGroup,
            "rotation"
          ) as number) || 0,
        width:
          parseFloat(
            String(
              gsap.getProperty(indicator, "width")
            )
          ) || distance,
      };

      motionTweenRef.current = gsap.to(proxy, {
        rotation: angle,
        width: distance,
        duration: 0.78,
        ease: "power2.inOut",
        overwrite: true,
        onUpdate: () => {
          gsap.set(sweepGroup, {
            rotation: proxy.rotation,
          });

          gsap.set(indicator, {
            width: proxy.width,
          });

          gsap.set(glowWedge, {
            width: proxy.width,
          });
        },
        onComplete: () => {
          setActiveIndex(index);

          const activeLogo =
            logoRefs.current[index];

          if (activeLogo) {
            gsap.fromTo(
              activeLogo,
              {
                scale: 0.982,
              },
              {
                scale: 1,
                duration: 0.12,
                ease: "power2.out",
              }
            );
          }

          if (centerRef.current) {
            gsap.fromTo(
              centerRef.current,
              {
                scale: 0.992,
              },
              {
                scale: 1,
                duration: 0.12,
                ease: "power2.out",
              }
            );
          }
        },
      });
    },
    []
  );

  const scheduleNext = useCallback(() => {
    clearAutoplay();

    if (tabHiddenRef.current) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduced) return;

    autoplayTimerRef.current = window.setTimeout(
      () => {
        const next =
          (currentIndexRef.current + 1) %
          clients.length;

        moveIndicatorTo(next);
        scheduleNext();
      },
      2500
    );
  }, [clearAutoplay, moveIndicatorTo]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      moveIndicatorTo(0, true);
      scheduleNext();
    });

    return () => {
      cancelAnimationFrame(frame);
      clearAutoplay();
      motionTweenRef.current?.kill();
    };
  }, [moveIndicatorTo, scheduleNext, clearAutoplay]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        tabHiddenRef.current = true;
        motionTweenRef.current?.pause();
        clearAutoplay();
      } else {
        tabHiddenRef.current = false;

        if (
          motionTweenRef.current &&
          motionTweenRef.current.progress() < 1
        ) {
          motionTweenRef.current.resume();
        }

        scheduleNext();
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );
    };
  }, [clearAutoplay, scheduleNext]);

  useEffect(() => {
    const orbit = orbitRef.current;
    if (!orbit) return;

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        moveIndicatorTo(
          currentIndexRef.current,
          true
        );
      });
    });

    observer.observe(orbit);

    return () => observer.disconnect();
  }, [moveIndicatorTo]);

  const handleSelect = (index: number) => {
    clearAutoplay();
    moveIndicatorTo(index);
    scheduleNext();
  };

  return (
    <section
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
      {/* HEADER */}
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
          <span className="text-[13px] font-semibold text-brand">
            0{targetIndex + 1}
          </span>
          <span className="text-[10px] text-text-muted">
            /
          </span>
          <span className="text-[10px] text-text-muted">
            0{clients.length}
          </span>
        </div>
      </div>

      {/* RADAR */}
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
          className="relative aspect-square shrink-0 rounded-full"
          style={{
            width: "min(82vw, 62svh, 570px)",
          }}
        >
          {/* LIGHTER CIRCLES */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-[3%]
              z-[2]
              text-black/[0.07]
            "
          >
            <OrbitGuides />
          </div>

          {/* ROTATING GLOW + INDICATOR */}
          <div
            ref={sweepGroupRef}
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-0
              z-10
              will-change-transform
            "
            style={{
              transformOrigin: "50% 50%",
            }}
          >
            {/* WIDER + DARKER BLACK GLOW */}
            <div
              ref={glowWedgeRef}
              className="
                absolute
                left-1/2
                top-1/2
                h-[28%]
                -translate-y-1/2
                origin-left
                rounded-r-full
              "
              style={{
                background:
                  "linear-gradient(90deg, rgba(0,0,0,0.24) 0%, rgba(0,0,0,0.16) 36%, rgba(0,0,0,0.07) 68%, rgba(0,0,0,0) 100%)",
                clipPath:
                  "polygon(0% 50%, 100% 0%, 100% 100%)",
                filter: "blur(10px)",
                opacity: 0.36,
                width: 0,
              }}
            />

            {/* INDICATOR LINE */}
            <div
              ref={indicatorRef}
              className="
                absolute
                left-1/2
                top-1/2
                h-px
                -translate-y-1/2
                origin-left
                bg-[#2B2B2B]
              "
              style={{
                width: 0,
              }}
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
                  bg-[#2B2B2B]
                "
                style={{
                  boxShadow:
                    "0 0 6px rgba(0,0,0,0.12)",
                }}
              />
            </div>
          </div>

          {/* CENTER */}
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
              border-black/[0.10]
              bg-white
              shadow-[0_10px_24px_rgba(0,0,0,0.05)]
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

          {/* CLIENT NODES */}
          {clients.map((client, index) => {
            const { angle, radius } =
              CLIENT_POSITIONS[index];
            const position =
              getNodePosition(angle, radius);
            const active = activeIndex === index;

            return (
              <div
                key={client.name}
                className="
                  absolute
                  z-20
                  -translate-x-1/2
                  -translate-y-1/2
                "
                style={{
                  left: `${position.left}%`,
                  top: `${position.top}%`,
                }}
              >
                <button
                  type="button"
                  aria-label={`Select ${client.name}`}
                  aria-pressed={active}
                  onClick={() => handleSelect(index)}
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
                  <div
                    ref={(element) => {
                      logoRefs.current[index] = element;
                    }}
                    className={`
                      relative
                      h-full
                      w-full
                      rounded-full
                      transition-[opacity,transform]
                      duration-75
                      ease-out
                      ${
                        active
                          ? "opacity-100"
                          : "opacity-58 group-hover:opacity-78"
                      }
                    `}
                  >
                    <ClientLogo
                      index={index}
                      mark={client.mark}
                      active={active}
                    />
                  </div>

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
                      duration-100
                      md:text-[12px]
                      ${
                        active
                          ? "translate-x-0 text-brand opacity-100"
                          : "-translate-x-1 text-brand/42 opacity-80 group-hover:translate-x-0 group-hover:text-brand/65"
                      }
                    `}
                  >
                    {client.name}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* MOBILE FOOTER */}
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
          {clients[targetIndex].name}
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
          0{targetIndex + 1} / 0{clients.length}
        </p>
      </div>
    </section>
  );
}