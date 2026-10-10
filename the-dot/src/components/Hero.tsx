"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import Link from "next/link";
import gsap from "gsap";

const HERO_VIDEOS = [
  "/video/hero.mp4",
  "/video/hero.mp4",
  "/video/hero.mp4",
];

interface HeroProps {
  isReady: boolean;
  onMenuReady?: () => void;
}

/* =========================================================
   CAROUSEL GEOMETRY
   ========================================================= */

/*
 * The old carousel used viewport width to decide
 * how far apart the side cards should sit.
 *
 * But the card itself is height-constrained.
 *
 * That creates gaps on short/wide screens.
 *
 * We now calculate spacing from the ACTUAL card width.
 *
 * Center card = 100%
 * Side card   = 72%
 *
 * Perfect edge touching would be about 86%.
 * We use 82%, creating a tiny premium overlap.
 */
function getSideDistance(
  card:
    | HTMLDivElement
    | null
    | undefined
) {
  if (!card) {
    return Math.min(
      window.innerWidth * 0.26,
      380
    );
  }

  return card.offsetWidth * 0.82;
}

export function Hero({
  isReady,
  onMenuReady,
}: HeroProps) {
  const sectionRef =
    useRef<HTMLElement>(null);

  const logoRef =
    useRef<HTMLAnchorElement>(null);

  const introFrameRef =
    useRef<HTMLDivElement>(null);

  const introVideoRef =
    useRef<HTMLVideoElement>(null);

  const headlineRef =
    useRef<HTMLHeadingElement>(null);

  const carouselStageRef =
    useRef<HTMLDivElement>(null);

  const carouselCardsRef =
    useRef<
      Array<HTMLDivElement | null>
    >([]);

  const carouselVideosRef =
    useRef<
      Array<HTMLVideoElement | null>
    >([]);

  const ctaRef =
    useRef<HTMLAnchorElement>(null);

  const indicatorsRef =
    useRef<HTMLDivElement>(null);

  const [
    activeIndex,
    setActiveIndex,
  ] = useState(0);

  const [
    carouselReady,
    setCarouselReady,
  ] = useState(false);

  const hasPlayedRef =
    useRef(false);

  const menuSentRef =
    useRef(false);

  /* =======================================================
     HERO INTRO
     ======================================================= */

  useEffect(() => {
    const section =
      sectionRef.current;

    const logo =
      logoRef.current;

    const introFrame =
      introFrameRef.current;

    const introVideo =
      introVideoRef.current;

    const headline =
      headlineRef.current;

    const carouselStage =
      carouselStageRef.current;

    const cta =
      ctaRef.current;

    const indicators =
      indicatorsRef.current;

    const cards =
      carouselCardsRef.current.filter(
        (
          card
        ): card is HTMLDivElement =>
          card !== null
      );

    if (
      !section ||
      !logo ||
      !introFrame ||
      !introVideo ||
      !headline ||
      !carouselStage ||
      !cta ||
      !indicators ||
      cards.length !==
        HERO_VIDEOS.length
    ) {
      return;
    }

    const reduced =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

    const sendMenuReady = () => {
      if (
        menuSentRef.current
      ) {
        return;
      }

      menuSentRef.current =
        true;

      onMenuReady?.();
    };

    /* =====================================================
       CAROUSEL
       ===================================================== */

    gsap.set(cards, {
      xPercent: -50,
      yPercent: -50,

      transformOrigin:
        "50% 50%",
    });

    /*
     * IMPORTANT:
     *
     * Spacing now comes from the card width,
     * not viewport width.
     */

    const sideDistance =
      getSideDistance(
        cards[0]
      );

    gsap.set(
      cards[0],
      {
        x: 0,

        scale: 1,

        opacity: 0,

        zIndex: 30,
      }
    );

    gsap.set(
      cards[1],
      {
        x:
          -sideDistance,

        scale: 0.72,

        opacity: 0,

        zIndex: 10,
      }
    );

    gsap.set(
      cards[2],
      {
        x:
          sideDistance,

        scale: 0.72,

        opacity: 0,

        zIndex: 10,
      }
    );

    /* =====================================================
       RETURNING HOME
       ===================================================== */

    if (
      hasPlayedRef.current
    ) {
      gsap.set(
        introFrame,
        {
          opacity: 0,

          pointerEvents:
            "none",
        }
      );

      gsap.set(
        [
          logo,
          headline,
          carouselStage,
          cta,
          indicators,
        ],
        {
          opacity: 1,
        }
      );

      gsap.set(
        headline,
        {
          y: 0,
        }
      );

      gsap.set(
        cta,
        {
          scale: 1,
        }
      );

      gsap.set(
        indicators,
        {
          scale: 1,
        }
      );

      gsap.set(
        cards[0],
        {
          opacity: 1,
        }
      );

      gsap.set(
        [
          cards[1],
          cards[2],
        ],
        {
          opacity: 0.34,
        }
      );

      setCarouselReady(
        true
      );

      sendMenuReady();

      return;
    }

    /* =====================================================
       INITIAL STATE
       ===================================================== */

    gsap.set(
      logo,
      {
        opacity: 0,
        y: -8,
      }
    );

    gsap.set(
      headline,
      {
        opacity: 0,
        y: 22,
      }
    );

    /*
     * CTA remains physically in place.
     * Only opacity + scale animate.
     */

    gsap.set(
      cta,
      {
        opacity: 0,

        scale: 0.94,

        transformOrigin:
          "50% 50%",
      }
    );

    gsap.set(
      indicators,
      {
        opacity: 0,

        scale: 0.9,

        transformOrigin:
          "50% 50%",
      }
    );

    gsap.set(
      carouselStage,
      {
        opacity: 1,
      }
    );

    /* =====================================================
       FULLSCREEN INTRO
       ===================================================== */

    gsap.set(
      introFrame,
      {
        left: 0,
        top: 0,

        width:
          window.innerWidth,

        height:
          window.innerHeight,

        opacity: 1,

        borderRadius: 0,
      }
    );

    if (!isReady) {
      introVideo.pause();

      return;
    }

    try {
      introVideo.currentTime =
        0;
    } catch {
      // metadata may not yet be ready
    }

    introVideo
      .play()
      .catch(() => {});

    const targetRect =
      cards[0].getBoundingClientRect();

    /* =====================================================
       REDUCED MOTION
       ===================================================== */

    if (reduced) {
      gsap.set(
        introFrame,
        {
          opacity: 0,
          pointerEvents:
            "none",
        }
      );

      gsap.set(
        [
          logo,
          headline,
          cta,
          indicators,
        ],
        {
          opacity: 1,
        }
      );

      gsap.set(
        headline,
        {
          y: 0,
        }
      );

      gsap.set(
        cta,
        {
          scale: 1,
        }
      );

      gsap.set(
        indicators,
        {
          scale: 1,
        }
      );

      gsap.set(
        cards[0],
        {
          opacity: 1,
        }
      );

      gsap.set(
        [
          cards[1],
          cards[2],
        ],
        {
          opacity: 0.34,
        }
      );

      setCarouselReady(
        true
      );

      hasPlayedRef.current =
        true;

      sendMenuReady();

      return;
    }

    /* =====================================================
       MASTER TIMELINE
       ===================================================== */

    const ctx =
      gsap.context(
        () => {
          const timeline =
            gsap.timeline({
              onComplete:
                () => {
                  hasPlayedRef.current =
                    true;

                  setCarouselReady(
                    true
                  );
                },
            });

          /*
           * Fullscreen hold.
           */

          timeline.to(
            {},
            {
              duration: 0.75,
            }
          );

          /*
           * Fullscreen → carousel.
           */

          timeline.to(
            introFrame,
            {
              left:
                targetRect.left,

              top:
                targetRect.top,

              width:
                targetRect.width,

              height:
                targetRect.height,

              borderRadius: 18,

              duration: 2.3,

              ease:
                "power3.inOut",
            }
          );

          /*
           * THE DOT.
           */

          timeline.to(
            logo,
            {
              opacity: 1,

              y: 0,

              duration: 0.55,

              ease:
                "power3.out",
            },
            "-=0.6"
          );

          /*
           * Side cards appear already sitting
           * tightly beside center.
           */

          timeline.to(
            [
              cards[1],
              cards[2],
            ],
            {
              opacity: 0.34,

              duration: 0.75,

              ease:
                "power2.out",
            },
            "-=0.55"
          );

          /* VIDEO HANDOFF */

          timeline.call(
            () => {
              const centerVideo =
                carouselVideosRef
                  .current[0];

              if (
                centerVideo
              ) {
                try {
                  centerVideo.currentTime =
                    introVideo.currentTime;
                } catch {
                  // safe fallback
                }

                centerVideo
                  .play()
                  .catch(
                    () => {}
                  );
              }

              gsap.set(
                cards[0],
                {
                  opacity: 1,
                }
              );

              gsap.set(
                introFrame,
                {
                  opacity: 0,

                  pointerEvents:
                    "none",
                }
              );
            }
          );

          /* HEADLINE */

          timeline.to(
            headline,
            {
              opacity: 1,

              y: 0,

              duration: 0.8,

              ease:
                "power3.out",
            },
            "+=0.08"
          );

          timeline.to(
            {},
            {
              duration: 0.18,
            }
          );

          /* CONTACT */

          timeline.to(
            cta,
            {
              opacity: 1,

              scale: 1,

              duration: 0.58,

              ease:
                "power3.out",
            }
          );

          timeline.to(
            {},
            {
              duration: 0.12,
            }
          );

          /* INDICATORS */

          timeline.to(
            indicators,
            {
              opacity: 1,

              scale: 1,

              duration: 0.35,

              ease:
                "power2.out",
            }
          );

          timeline.to(
            {},
            {
              duration: 0.18,
            }
          );

          timeline.call(
            sendMenuReady
          );
        },
        section
      );

    return () => {
      ctx.revert();
    };
  }, [
    isReady,
    onMenuReady,
  ]);

  /* =======================================================
     AUTO LOOP
     ======================================================= */

  useEffect(() => {
    if (
      !carouselReady ||
      !isReady
    ) {
      return;
    }

    const timer =
      window.setInterval(
        () => {
          setActiveIndex(
            (current) =>
              (
                current +
                1
              ) %
              HERO_VIDEOS.length
          );
        },
        4600
      );

    return () => {
      window.clearInterval(
        timer
      );
    };
  }, [
    carouselReady,
    isReady,
  ]);

  /* =======================================================
     CAROUSEL MOVEMENT
     ======================================================= */

  useEffect(() => {
    if (
      !carouselReady
    ) {
      return;
    }

    const cards =
      carouselCardsRef.current;

    const videos =
      carouselVideosRef.current;

    /*
     * Recalculate against the real card width.
     *
     * This keeps spacing correct even after
     * responsive resizing.
     */

    const sideDistance =
      getSideDistance(
        cards[0]
      );

    cards.forEach(
      (
        card,
        index
      ) => {
        if (!card) {
          return;
        }

        const relative =
          (
            index -
            activeIndex +
            HERO_VIDEOS.length
          ) %
          HERO_VIDEOS.length;

        const slot =
          relative === 0
            ? 0
            : relative === 1
            ? 1
            : -1;

        const center =
          slot === 0;

        gsap.to(
          card,
          {
            x:
              slot *
              sideDistance,

            scale:
              center
                ? 1
                : 0.72,

            opacity:
              center
                ? 1
                : 0.34,

            duration: 1,

            ease:
              "power3.inOut",

            overwrite:
              "auto",

            onStart: () => {
              card.style.zIndex =
                center
                  ? "30"
                  : "10";
            },
          }
        );

        const video =
          videos[index];

        if (!video) {
          return;
        }

        if (
          center &&
          isReady
        ) {
          video
            .play()
            .catch(
              () => {}
            );
        } else {
          video.pause();
        }
      }
    );
  }, [
    activeIndex,
    carouselReady,
    isReady,
  ]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="
        relative
        h-[100svh]
        w-full
        overflow-hidden
        bg-white
        text-brand
      "
    >
      {/* THE DOT */}

      <Link
        ref={logoRef}
        href="/"
        aria-label="THE DOT — Home"
        className="
          absolute
          left-6
          top-7
          z-[60]

          font-sora
          text-[13px]
          font-bold
          uppercase
          tracking-[0.24em]
          text-brand

          transition-opacity
          duration-300
          hover:opacity-50

          md:left-12
          md:top-9
          md:text-[14px]
        "
      >
        THE DOT
      </Link>

      {/* FULLSCREEN INTRO */}

      <div
        ref={introFrameRef}
        className="
          absolute
          z-50
          overflow-hidden
          bg-black

          will-change-[left,top,width,height,border-radius]
        "
      >
        <video
          ref={introVideoRef}
          src={
            HERO_VIDEOS[0]
          }
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          className="
            h-full
            w-full
            object-contain
            bg-black
          "
        />
      </div>

      {/* FINAL HERO */}

      <div
        className="
          absolute
          inset-0

          flex
          flex-col
          items-center

          px-5
          pb-5
          pt-[78px]

          sm:px-7

          md:px-10
          md:pb-7
          md:pt-[90px]
        "
      >
        {/* HEADLINE */}

        <h1
          ref={headlineRef}
          className="
            relative
            z-20

            mx-auto
            max-w-[930px]

            text-center

            font-sora
            text-[31px]
            font-bold
            leading-[0.98]
            tracking-[-0.05em]
            text-brand

            sm:text-[37px]
            md:text-[43px]
            lg:text-[48px]
            xl:text-[52px]
          "
        >
          We turn{" "}

          <span
            className="
              font-instrument
              font-normal
              italic
              tracking-[-0.03em]
            "
          >
            business problems
          </span>{" "}

          into digital experiences
          people choose.
        </h1>

        {/* CAROUSEL */}

        <div
          ref={
            carouselStageRef
          }
          className="
            relative

            mt-6
            h-[38svh]
            w-full

            shrink-0

            overflow-visible

            md:mt-7
          "
        >
          {HERO_VIDEOS.map(
            (
              src,
              index
            ) => (
              <div
                key={`${src}-${index}`}

                ref={(
                  element
                ) => {
                  carouselCardsRef.current[
                    index
                  ] =
                    element;
                }}

                className="
                  absolute

                  left-1/2
                  top-1/2

                  aspect-video

                  overflow-hidden

                  rounded-[18px]

                  border
                  border-black/10

                  bg-brand

                  shadow-[0_22px_65px_rgba(24,24,24,0.11)]

                  will-change-transform
                "

                style={{
                  width:
                    "min(65vw, 760px, 64svh)",
                }}
              >
                <video
                  ref={(
                    element
                  ) => {
                    carouselVideosRef.current[
                      index
                    ] =
                      element;
                  }}

                  src={src}

                  muted
                  loop
                  playsInline

                  preload={
                    index === 0
                      ? "auto"
                      : "metadata"
                  }

                  aria-hidden="true"
                  tabIndex={-1}

                  className="
                    absolute
                    inset-0

                    h-full
                    w-full

                    object-cover
                  "
                />

                <div
                  aria-hidden="true"
                  className="
                    pointer-events-none

                    absolute
                    inset-0

                    rounded-[inherit]

                    ring-1
                    ring-inset
                    ring-white/10
                  "
                />
              </div>
            )
          )}
        </div>

        {/* CTA + INDICATORS */}

        <div
          className="
            relative
            z-20

            mt-7

            flex
            flex-col
            items-center
          "
        >
          <Link
            ref={ctaRef}
            href="/book-a-call"
            className="
              group

              inline-flex
              items-center

              gap-5

              rounded-full

              bg-brand

              py-[7px]
              pl-6
              pr-[7px]

              font-sora

              text-[11px]
              font-semibold

              uppercase

              tracking-[0.15em]

              text-white

              transition-all
              duration-300

              hover:bg-accent

              md:text-[12px]
            "
          >
            <span>
              Contact us
            </span>

            <span
              aria-hidden="true"
              className="
                grid

                h-10
                w-10

                place-items-center

                rounded-full

                bg-white

                text-[17px]
                text-brand

                transition-transform
                duration-300

                group-hover:translate-x-[2px]
                group-hover:-translate-y-[2px]
              "
            >
              ↗
            </span>
          </Link>

          <div
            ref={indicatorsRef}
            className="
              mt-[18px]

              flex
              items-center
              justify-center

              gap-[7px]
            "
          >
            {HERO_VIDEOS.map(
              (
                _,
                index
              ) => (
                <button
                  key={
                    index
                  }
                  type="button"

                  aria-label={`Show video ${index + 1}`}

                  onClick={() =>
                    setActiveIndex(
                      index
                    )
                  }

                  className={`
                    h-[5px]

                    rounded-full

                    transition-all
                    duration-500

                    ${
                      activeIndex ===
                      index
                        ? "w-7 bg-brand"
                        : "w-[5px] bg-brand/20 hover:bg-brand/40"
                    }
                  `}
                />
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}