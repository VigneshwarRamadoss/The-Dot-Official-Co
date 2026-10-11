"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import Link from "next/link";

import {
  motion,
  type PanInfo,
} from "motion/react";

import {
  ServiceCard,
  type ServiceArtworkType,
} from "./ServiceCard";

interface Service {
  title: string;
  shortTitle: string;
  description: string;
  items: string[];
  artworkType: ServiceArtworkType;
  isDark?: boolean;
}

const SERVICES: Service[] = [
  {
    title: "Brand Strategy",
    shortTitle: "Brand",
    description:
      "Build a memorable brand with a clear position, identity and reason to choose you.",
    items: [
      "Strategy",
      "Identity",
      "Positioning",
    ],
    artworkType: "brand",
    isDark: true,
  },

  {
    title: "Digital Experience",
    shortTitle: "Digital",
    description:
      "High-performing websites and commerce experiences designed around how people actually decide.",
    items: [
      "Websites",
      "E-commerce",
      "Interactive",
    ],
    artworkType: "experience",
  },

  {
    title: "Product Design",
    shortTitle: "Product",
    description:
      "Digital products that make complex systems easier to understand, use and scale.",
    items: [
      "UI/UX",
      "Web Apps",
      "Design Systems",
    ],
    artworkType: "product",
  },

  {
    title: "Growth Systems",
    shortTitle: "Growth",
    description:
      "Connect conversion, automation and optimisation into a system that supports growth.",
    items: [
      "Conversion",
      "Automation",
      "Optimization",
    ],
    artworkType: "growth",
  },
];

/* =========================================================
   AUTOPLAY

   2000ms = 2 seconds
   ========================================================= */

const AUTO_PLAY_DELAY = 2000;

export function Services() {
  const sectionRef =
    useRef<HTMLElement>(null);

  const [
    activeIndex,
    setActiveIndex,
  ] = useState(1);

  /*
   * Is the Services section currently
   * visible in the viewport?
   */
  const [
    isVisible,
    setIsVisible,
  ] = useState(false);

  /*
   * Is the browser tab currently active?
   *
   * false:
   * user switched tab / minimized browser
   *
   * true:
   * user is viewing this browser tab
   */
  const [
    isTabVisible,
    setIsTabVisible,
  ] = useState(true);

  /* =======================================================
     CAROUSEL NAVIGATION
     ======================================================= */

  const goTo =
    useCallback(
      (index: number) => {
        const total =
          SERVICES.length;

        setActiveIndex(
          (
            index +
            total
          ) %
            total
        );
      },
      []
    );

  const previous =
    useCallback(() => {
      setActiveIndex(
        (
          previousIndex
        ) =>
          (
            previousIndex -
            1 +
            SERVICES.length
          ) %
          SERVICES.length
      );
    }, []);

  const next =
    useCallback(() => {
      setActiveIndex(
        (
          previousIndex
        ) =>
          (
            previousIndex +
            1
          ) %
          SERVICES.length
      );
    }, []);

  /* =======================================================
     SECTION VISIBILITY

     Autoplay only runs when a meaningful amount
     of the Services section is visible.
     ======================================================= */

  useEffect(() => {
    const section =
      sectionRef.current;

    if (!section) {
      return;
    }

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          setIsVisible(
            entry.isIntersecting &&
              entry.intersectionRatio >
                0.45
          );
        },
        {
          threshold: [
            0,
            0.45,
            0.7,
          ],
        }
      );

    observer.observe(
      section
    );

    return () => {
      observer.disconnect();
    };
  }, []);

  /* =======================================================
     TAB VISIBILITY

     Active tab:
       autoplay can run

     User switches tab:
       autoplay pauses immediately

     User returns:
       fresh 2-second countdown starts
     ======================================================= */

  useEffect(() => {
    const handleVisibilityChange =
      () => {
        setIsTabVisible(
          !document.hidden
        );
      };

    /*
     * Establish correct state immediately.
     */
    handleVisibilityChange();

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, []);

  /* =======================================================
     AUTOPLAY

     Conditions:

     - Services section visible
     - browser tab visible

     Any change to activeIndex restarts
     the two-second countdown.

     This also means manual controls naturally
     reset the autoplay timer.
     ======================================================= */

  useEffect(() => {
    if (
      !isVisible ||
      !isTabVisible
    ) {
      return;
    }

    const timer =
      window.setTimeout(
        () => {
          setActiveIndex(
            (
              previousIndex
            ) =>
              (
                previousIndex +
                1
              ) %
              SERVICES.length
          );
        },
        AUTO_PLAY_DELAY
      );

    return () => {
      window.clearTimeout(
        timer
      );
    };
  }, [
    activeIndex,
    isVisible,
    isTabVisible,
  ]);

  /* =======================================================
     DRAG / SWIPE
     ======================================================= */

  const handleDragEnd =
    (
      _event:
        MouseEvent |
        TouchEvent |
        PointerEvent,

      info:
        PanInfo
    ) => {
      const distance =
        info.offset.x;

      const velocity =
        info.velocity.x;

      /*
       * Swipe left:
       * next service
       */
      if (
        distance < -70 ||
        velocity < -500
      ) {
        next();

        return;
      }

      /*
       * Swipe right:
       * previous service
       */
      if (
        distance > 70 ||
        velocity > 500
      ) {
        previous();
      }
    };

  /* =======================================================
     RELATIVE POSITION

     Converts carousel index into:

     -1 = previous
      0 = active
      1 = next

     Remaining card sits outside the main view.
     ======================================================= */

  const getRelativeIndex =
    (
      index: number
    ) => {
      const total =
        SERVICES.length;

      let difference =
        index -
        activeIndex;

      if (
        difference >
        total / 2
      ) {
        difference -=
          total;
      }

      if (
        difference <
        -total / 2
      ) {
        difference +=
          total;
      }

      return difference;
    };

  return (
    <section
      ref={sectionRef}
      id="services"
      className="
        relative

        h-[100svh]
        min-h-[680px]

        w-full

        overflow-hidden

        bg-[#F8F7F4]

        px-4

        md:px-8
      "
    >
      <div
        className="
          mx-auto

          grid

          h-full
          w-full

          max-w-[1440px]

          grid-rows-[auto_minmax(0,1fr)_auto]
        "
      >
        {/* =================================================
            HEADER — LEFT ALIGNED
           ================================================= */}

        <div
          className="
            relative

            z-20

            max-w-[650px]

            pt-10

            text-left

            md:pt-12

            lg:pt-14
          "
        >
          <p
            className="
              font-sora

              text-[9px]
              font-semibold

              uppercase

              tracking-[0.34em]

              text-black/45

              md:text-[10px]
            "
          >
            Our
          </p>

          <h2
            className="
              mt-1.5

              font-sora

              text-[44px]
              font-bold

              leading-none

              tracking-[-0.06em]

              text-[#171717]

              sm:text-[50px]

              md:text-[58px]

              xl:text-[64px]
            "
          >
            Services
          </h2>

          <p
            className="
              mt-3

              max-w-[560px]

              font-sora

              text-[12px]

              leading-[1.55]

              text-black/42

              sm:text-[13px]

              md:text-[14px]
            "
          >
            End-to-end digital solutions built
            to strengthen your brand, product
            and growth.
          </p>
        </div>

        {/* =================================================
            CAROUSEL
           ================================================= */}

        <motion.div
          drag="x"

          dragConstraints={{
            left: 0,
            right: 0,
          }}

          dragElastic={
            0.12
          }

          onDragEnd={
            handleDragEnd
          }

          className="
            relative

            min-h-0

            w-full

            cursor-grab

            touch-pan-y

            select-none

            active:cursor-grabbing
          "
        >
          {/* =================================================
              CARDS
             ================================================= */}

          <div
            className="
              absolute
              inset-0
            "
          >
            {SERVICES.map(
              (
                service,
                index
              ) => {
                const relative =
                  getRelativeIndex(
                    index
                  );

                return (
                  <ServiceCard
                    key={
                      service.title
                    }

                    index={
                      index
                    }

                    title={
                      service.title
                    }

                    shortTitle={
                      service.shortTitle
                    }

                    description={
                      service.description
                    }

                    items={
                      service.items
                    }

                    artworkType={
                      service.artworkType
                    }

                    isDark={
                      service.isDark
                    }

                    relativeIndex={
                      relative
                    }

                    isActive={
                      relative === 0
                    }

                    onClick={() =>
                      goTo(
                        index
                      )
                    }
                  />
                );
              }
            )}
          </div>

          {/* =================================================
              PREVIOUS
             ================================================= */}

          <button
            type="button"

            aria-label="Previous service"

            onClick={(
              event
            ) => {
              event.stopPropagation();

              previous();
            }}

            className="
              absolute

              left-[2%]
              top-1/2

              z-50

              grid

              h-11
              w-11

              -translate-y-1/2

              place-items-center

              rounded-full

              border
              border-black/10

              bg-white/90

              text-[#181818]

              shadow-[0_8px_28px_rgba(0,0,0,0.06)]

              backdrop-blur-xl

              transition-all

              duration-300

              hover:scale-105
              hover:bg-[#181818]
              hover:text-white

              md:left-[4%]

              md:h-12
              md:w-12
            "
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="
                h-5
                w-5
              "
            >
              <path
                d="M15 5L8 12L15 19"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* =================================================
              NEXT
             ================================================= */}

          <button
            type="button"

            aria-label="Next service"

            onClick={(
              event
            ) => {
              event.stopPropagation();

              next();
            }}

            className="
              absolute

              right-[2%]
              top-1/2

              z-50

              grid

              h-11
              w-11

              -translate-y-1/2

              place-items-center

              rounded-full

              border
              border-black/10

              bg-white/90

              text-[#181818]

              shadow-[0_8px_28px_rgba(0,0,0,0.06)]

              backdrop-blur-xl

              transition-all

              duration-300

              hover:scale-105
              hover:bg-[#181818]
              hover:text-white

              md:right-[4%]

              md:h-12
              md:w-12
            "
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="
                h-5
                w-5
              "
            >
              <path
                d="M9 5L16 12L9 19"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </motion.div>

        {/* =================================================
            BOTTOM CONTROLS
           ================================================= */}

        <div
          className="
            relative

            z-20

            flex

            flex-col

            items-center

            pb-6

            md:pb-7
          "
        >
          {/* DOTS */}

          <div
            className="
              flex

              items-center
              justify-center

              gap-3
            "
          >
            {SERVICES.map(
              (
                service,
                index
              ) => (
                <button
                  key={
                    service.title
                  }

                  type="button"

                  aria-label={`Show ${service.title}`}

                  onClick={() =>
                    goTo(
                      index
                    )
                  }

                  className={`
                    rounded-full

                    transition-all

                    duration-500

                    ${
                      index ===
                      activeIndex
                        ? `
                          h-[7px]
                          w-[7px]

                          bg-[#181818]
                        `
                        : `
                          h-[6px]
                          w-[6px]

                          bg-black/15

                          hover:bg-black/30
                        `
                    }
                  `}
                />
              )
            )}
          </div>

          {/* SERVICES PAGE LINK */}

          <Link
            href="/services"

            className="
              group

              mt-4

              inline-flex

              items-center
              gap-2

              font-sora

              text-[10px]
              font-semibold

              uppercase

              tracking-[0.12em]

              text-black/35

              transition-colors

              duration-300

              hover:text-black
            "
          >
            Explore all services

            <span
              className="
                transition-transform

                duration-300

                group-hover:translate-x-1
              "
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}