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

type ServiceDotAnimation =
  | "playful"
  | "excited"
  | "thinking"
  | "proud";

interface Service {
  title: string;
  shortTitle: string;
  description: string;
  items: string[];
  artworkType: ServiceArtworkType;
  isDark?: boolean;
  dotThought: string;
  dotAnimation: ServiceDotAnimation;
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
    dotThought:
      "Give it a personality people remember.",
    dotAnimation: "playful",
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
    dotThought:
      "Smooth clicks. Happy humans.",
    dotAnimation: "excited",
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
    dotThought:
      "Complex stuff, made weirdly simple.",
    dotAnimation: "thinking",
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
    dotThought:
      "Small wins stacking up. I like this.",
    dotAnimation: "proud",
  },
];

const AUTO_PLAY_DELAY = 5000;

const EXPLORE_THOUGHT =
  "Curious about everything we can build?";

export function Services() {
  const sectionRef =
    useRef<HTMLElement>(null);

  const [
    activeIndex,
    setActiveIndex,
  ] = useState(1);

  const [
    isVisible,
    setIsVisible,
  ] = useState(false);

  const [
    isTabVisible,
    setIsTabVisible,
  ] = useState(true);

  const [
    isExploreHovered,
    setIsExploreHovered,
  ] = useState(false);

  /* =======================================================
     CAROUSEL
     ======================================================= */

  const goTo = useCallback(
    (index: number) => {
      const total =
        SERVICES.length;

      setActiveIndex(
        (index + total) %
          total
      );
    },
    []
  );

  const previous =
    useCallback(() => {
      setActiveIndex(
        (previousIndex) =>
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
        (previousIndex) =>
          (
            previousIndex +
            1
          ) %
          SERVICES.length
      );
    }, []);

  /* =======================================================
     SECTION VISIBILITY
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

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  /* =======================================================
     TAB VISIBILITY
     ======================================================= */

  useEffect(() => {
    const handleVisibilityChange =
      () => {
        setIsTabVisible(
          !document.hidden
        );
      };

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
     AUTOPLAY — 5 SECONDS
     ======================================================= */

  useEffect(() => {
    if (
      !isVisible ||
      !isTabVisible ||
      isExploreHovered
    ) {
      return;
    }

    const timer =
      window.setTimeout(
        () => {
          setActiveIndex(
            (previousIndex) =>
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
    isExploreHovered,
  ]);

  /* =======================================================
     ACTIVE SERVICE → DOT
     ======================================================= */

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const service =
      SERVICES[activeIndex];

    window.dispatchEvent(
      new CustomEvent(
        "dot:services-change",
        {
          detail: {
            index:
              activeIndex,
            title:
              service.title,
            animation:
              service.dotAnimation,
            thought:
              service.dotThought,
          },
        }
      )
    );
  }, [
    activeIndex,
    isVisible,
  ]);

  /* =======================================================
     EXPLORE INTERACTION
     ======================================================= */

  const handleExploreEnter =
    useCallback(() => {
      setIsExploreHovered(
        true
      );

      window.dispatchEvent(
        new CustomEvent(
          "dot:services-explore",
          {
            detail: {
              active: true,
              thought:
                EXPLORE_THOUGHT,
            },
          }
        )
      );
    }, []);

  const handleExploreLeave =
    useCallback(() => {
      setIsExploreHovered(
        false
      );

      window.dispatchEvent(
        new CustomEvent(
          "dot:services-explore",
          {
            detail: {
              active: false,
            },
          }
        )
      );
    }, []);

  /* =======================================================
     CAROUSEL HOVER

     If DOT previously returned into navigation,
     intentionally entering the carousel brings
     it back out.
     ======================================================= */

  const handleCarouselEnter =
    useCallback(() => {
      const service =
        SERVICES[activeIndex];

      window.dispatchEvent(
        new CustomEvent(
          "dot:services-carousel",
          {
            detail: {
              animation:
                service.dotAnimation,
              thought:
                service.dotThought,
            },
          }
        )
      );
    }, [activeIndex]);

  /* =======================================================
     DRAG / SWIPE
     ======================================================= */

  const handleDragEnd = (
    _event:
      | MouseEvent
      | TouchEvent
      | PointerEvent,
    info: PanInfo
  ) => {
    const distance =
      info.offset.x;

    const velocity =
      info.velocity.x;

    if (
      distance < -70 ||
      velocity < -500
    ) {
      next();
      return;
    }

    if (
      distance > 70 ||
      velocity > 500
    ) {
      previous();
    }
  };

  /* =======================================================
     RELATIVE POSITION
     ======================================================= */

  const getRelativeIndex = (
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
          grid-rows-[auto_minmax(0,1fr)]
        "
      >
        {/* =================================================
            HEADER
           ================================================= */}

        <div
          className="
            relative
            z-20
            pt-10
            md:pt-12
            lg:pt-14
          "
        >
          <div
            className="
              max-w-[650px]
              text-left
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
              End-to-end digital
              solutions built to
              strengthen your brand,
              product and growth.
            </p>
          </div>

          {/* =================================================
              EXPLORE ALL SERVICES
             ================================================= */}

          <div
            className="
              absolute
              right-[-24px]
              top-7
              z-30
              hidden
              p-6
              sm:block
              md:top-9
            "
            onPointerEnter={
              handleExploreEnter
            }
            onPointerLeave={
              handleExploreLeave
            }
          >
            <Link
              href="/services"
              onFocus={
                handleExploreEnter
              }
              onBlur={
                handleExploreLeave
              }
              className="
                group
                relative
                inline-flex
                items-center
                gap-2
                whitespace-nowrap
                font-sora
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.14em]
                text-black/38
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

              <span
                data-dot-services-explore-anchor
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  -left-[44px]
                  top-1/2
                  h-px
                  w-px
                  -translate-y-1/2
                "
              />
            </Link>
          </div>
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
          onPointerEnter={
            handleCarouselEnter
          }
          className="
            relative
            mx-auto
            min-h-0
            w-full
            max-w-[1380px]
            cursor-grab
            touch-pan-y
            select-none
            active:cursor-grabbing
          "
        >
          {/* =================================================
              SMALLER CAROUSEL
             ================================================= */}

          <div
            className="
              absolute
              inset-0
              origin-center
              -translate-y-[18px]
              scale-[0.82]
              sm:scale-[0.84]
              md:scale-[0.86]
              lg:scale-[0.88]
              xl:scale-[0.9]
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
                      goTo(index)
                    }
                  />
                );
              }
            )}
          </div>

          {/* =================================================
              DOT HOME

              Raised from the previous position.
             ================================================= */}

          <span
            data-dot-services-home
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              bottom-[54px]
              left-1/2
              h-px
              w-px
              -translate-x-1/2
              md:bottom-[58px]
            "
          />
        </motion.div>
      </div>
    </section>
  );
}