"use client";

import {
  useEffect,
  useRef,
} from "react";

import Image from "next/image";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* =========================================================
   CONTENT
   ========================================================= */

const REASONS = [
  {
    number: "01",
    heading:
      "We understand before we build.",
    description:
      "We begin with the business, the customer, the constraint and the real problem underneath the brief. The solution comes after we understand what truly needs to change.",
    image: "/why-us/why-01.jpg",
  },

  {
    number: "02",
    heading:
      "One team. Fewer disconnected decisions.",
    description:
      "Strategy, design and technology move together from the beginning. That means fewer handoffs, less translation loss and a clearer product from idea to execution.",
    image: "/why-us/why-02.jpg",
  },

  {
    number: "03",
    heading:
      "We design for real behaviour.",
    description:
      "The work is shaped around how real customers discover, understand and use the experience — not around what simply looks impressive inside a presentation.",
    image: "/why-us/why-03.jpg",
  },

  {
    number: "04",
    heading:
      "We refine until it feels inevitable.",
    description:
      "Good work usually comes from removing what does not belong. We iterate on hierarchy, interaction, content and details until the experience feels simple and intentional.",
    image: "/why-us/why-04.jpg",
  },

  {
    number: "05",
    heading:
      "The work has to perform after launch.",
    description:
      "A website or product is not finished when it ships. We care about whether people understand it, trust it, use it and whether it creates the business outcome it was built for.",
    image: "/why-us/why-05.jpg",
  },
];

/* =========================================================
   CURVED ROUTE

   Starts inside first content region.
   Ends inside fifth content region.
   ========================================================= */

const ROUTE_PATH = `
  M 645 330

  C 720 455,
    710 610,
    610 720

  C 520 820,
    420 900,
    365 1040

  C 315 1175,
    345 1305,
    455 1415

  C 565 1525,
    660 1635,
    670 1775

  C 680 1915,
    610 2035,
    510 2145

  C 410 2255,
    345 2375,
    365 2515

  C 388 2660,
    485 2760,
    600 2875

  C 705 2980,
    730 3110,
    670 3245

  C 620 3355,
    555 3410,
    520 3470
`;

/* =========================================================
   WHY US
   ========================================================= */

export function WhyUs() {
  const sectionRef =
    useRef<HTMLElement>(null);

  const contentRef =
    useRef<HTMLDivElement>(null);

  const progressPathRef =
    useRef<SVGPathElement>(null);

  const reasonRefs =
    useRef<
      Array<HTMLDivElement | null>
    >([]);

  /* =======================================================
     SCROLL ANIMATION
     ======================================================= */

  useEffect(() => {
    const section =
      sectionRef.current;

    const content =
      contentRef.current;

    const progressPath =
      progressPathRef.current;

    if (
      !section ||
      !content ||
      !progressPath
    ) {
      return;
    }

    const reduced =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

    const scroller =
      section.closest<HTMLElement>(
        '[data-scene-scroll][data-active="true"]'
      ) ??
      section.closest<HTMLElement>(
        "[data-scene-scroll]"
      ) ??
      undefined;

    const pathLength =
      progressPath.getTotalLength();

    /* =====================================================
       INITIAL BLACK FILL
       ===================================================== */

    gsap.set(progressPath, {
      strokeDasharray:
        `${pathLength} ${pathLength}`,

      strokeDashoffset:
        reduced
          ? 0
          : pathLength,
    });

    const ctx =
      gsap.context(() => {
        /* ===============================================
           BLACK FILL MOVES WITH SCROLL
           =============================================== */

        if (!reduced) {
          ScrollTrigger.create({
            trigger: content,

            scroller,

            start:
              "top 70%",

            end:
              "bottom 76%",

            scrub: 0.2,

            invalidateOnRefresh:
              true,

            onUpdate:
              (self) => {
                gsap.set(
                  progressPath,
                  {
                    strokeDashoffset:
                      pathLength *
                      (1 -
                        self.progress),
                  }
                );
              },
          });
        }

        /* ===============================================
           CONTENT REVEALS
           =============================================== */

        reasonRefs.current.forEach(
          (
            reason
          ) => {
            if (!reason) {
              return;
            }

            const image =
              reason.querySelector(
                "[data-why-image]"
              );

            const copy =
              reason.querySelector(
                "[data-why-copy]"
              );

            if (
              !image ||
              !copy
            ) {
              return;
            }

            if (reduced) {
              gsap.set(
                [
                  image,
                  copy,
                ],
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }
              );

              return;
            }

            gsap.fromTo(
              image,
              {
                opacity: 0,

                y: 50,

                scale: 0.975,
              },
              {
                opacity: 1,

                y: 0,

                scale: 1,

                ease:
                  "power3.out",

                scrollTrigger: {
                  trigger:
                    reason,

                  scroller,

                  start:
                    "top 82%",

                  end:
                    "top 50%",

                  scrub: 0.42,
                },
              }
            );

            gsap.fromTo(
              copy,
              {
                opacity: 0,

                y: 38,
              },
              {
                opacity: 1,

                y: 0,

                ease:
                  "power3.out",

                scrollTrigger: {
                  trigger:
                    reason,

                  scroller,

                  start:
                    "top 78%",

                  end:
                    "top 52%",

                  scrub: 0.42,
                },
              }
            );
          }
        );
      }, section);

    const frame =
      requestAnimationFrame(
        () => {
          ScrollTrigger.refresh();
        }
      );

    return () => {
      cancelAnimationFrame(
        frame
      );

      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="why-us"
      className="
        relative
        w-full
        overflow-hidden
        bg-white
        text-[#111111]
      "
    >
      {/* =================================================
          INTRO
         ================================================= */}

      <div
        className="
          relative
          z-20

          mx-auto
          max-w-[1440px]

          px-6

          pb-[8svh]
          pt-[10svh]

          md:px-10
          lg:px-12
        "
      >
        <p
          className="
            font-sora

            text-[10px]
            font-semibold

            uppercase

            tracking-[0.28em]

            text-black/35
          "
        >
          The Dot
        </p>

        {/* Smaller WHY US */}

        <h2
          className="
            mt-4

            font-sora

            text-[44px]
            font-bold

            uppercase

            leading-[0.9]

            tracking-[-0.06em]

            text-[#111111]

            sm:text-[54px]

            md:text-[68px]

            lg:text-[80px]
          "
        >
          Why us
        </h2>
      </div>

      {/* =================================================
          CONTENT
         ================================================= */}

      <div
        ref={contentRef}

        className="
          relative
          z-10

          mx-auto

          w-full
          max-w-[1440px]

          px-6
          pb-[7svh]

          md:px-10
          lg:px-12
        "
      >
        {/* =================================================
            CURVED ROUTE
           ================================================= */}

        <svg
          aria-hidden="true"

          viewBox="0 0 1000 3800"

          preserveAspectRatio="none"

          className="
            pointer-events-none

            absolute
            inset-0

            z-[1]

            h-full
            w-full

            overflow-hidden
          "
        >
          <defs>
            {/* =========================================
                GLOW

                Glow follows EXACTLY the same
                curved border.
               ========================================= */}

            <filter
              id="why-route-glow"
              x="-100%"
              y="-100%"
              width="300%"
              height="300%"
            >
              <feGaussianBlur
                stdDeviation="18"
              />
            </filter>

            <filter
              id="why-route-soft-glow"
              x="-100%"
              y="-100%"
              width="300%"
              height="300%"
            >
              <feGaussianBlur
                stdDeviation="7"
              />
            </filter>
          </defs>

          {/* =================================================
              LARGE ATMOSPHERIC GLOW

              Same path as route.
              No separate swirl anymore.
             ================================================= */}

          <path
            d={
              ROUTE_PATH
            }

            fill="none"

            stroke="#000000"

            strokeOpacity="0.10"

            strokeWidth="76"

            strokeLinecap="round"

            strokeLinejoin="round"

            filter="url(#why-route-glow)"

            vectorEffect="non-scaling-stroke"
          />

          {/* =================================================
              CLOSER SECONDARY GLOW

              Adds density directly around border.
             ================================================= */}

          <path
            d={
              ROUTE_PATH
            }

            fill="none"

            stroke="#000000"

            strokeOpacity="0.10"

            strokeWidth="46"

            strokeLinecap="round"

            strokeLinejoin="round"

            filter="url(#why-route-soft-glow)"

            vectorEffect="non-scaling-stroke"
          />

          {/* =================================================
              OUTER BORDER
             ================================================= */}

          <path
            d={
              ROUTE_PATH
            }

            fill="none"

            stroke="#000000"

            strokeOpacity="0.13"

            strokeWidth="28"

            strokeLinecap="round"

            strokeLinejoin="round"

            vectorEffect="non-scaling-stroke"
          />

          {/* =================================================
              EMPTY INNER CHANNEL
             ================================================= */}

          <path
            d={
              ROUTE_PATH
            }

            fill="none"

            stroke="#FFFFFF"

            strokeWidth="18"

            strokeLinecap="round"

            strokeLinejoin="round"

            vectorEffect="non-scaling-stroke"
          />

          {/* =================================================
              BLACK SCROLL FILL

              This is the ONLY animated flow now.

              It occupies the complete inside channel.
             ================================================= */}

          <path
            ref={
              progressPathRef
            }

            d={
              ROUTE_PATH
            }

            fill="none"

            stroke="#111111"

            strokeWidth="18"

            strokeLinecap="round"

            strokeLinejoin="round"

            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* =================================================
            REASONS
           ================================================= */}

        {REASONS.map(
          (
            reason,
            index
          ) => {
            const imageRight =
              index % 2 ===
              0;

            return (
              <div
                key={
                  reason.number
                }

                ref={(el) => {
                  reasonRefs.current[
                    index
                  ] =
                    el;
                }}

                className="
                  relative

                  z-20

                  grid

                  min-h-[75svh]

                  items-center

                  gap-12

                  py-[8svh]

                  md:grid-cols-12

                  md:gap-10

                  lg:min-h-[78svh]
                "
              >
                {/* =======================================
                    COPY
                   ======================================= */}

                <div
                  data-why-copy

                  className={`
                    relative

                    ${
                      imageRight
                        ? `
                          md:order-1
                          md:col-start-1
                          md:col-span-4
                        `
                        : `
                          md:order-2
                          md:col-start-9
                          md:col-span-4
                        `
                    }
                  `}
                >
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

                        text-[13px]
                        font-semibold

                        tracking-[0.12em]

                        text-black/38
                      "
                    >
                      {
                        reason.number
                      }
                    </span>

                    <span
                      className="
                        h-px
                        w-11

                        bg-black/14
                      "
                    />
                  </div>

                  <h3
                    className="
                      max-w-[520px]

                      font-sora

                      text-[40px]
                      font-bold

                      leading-[0.97]

                      tracking-[-0.055em]

                      text-[#111111]

                      sm:text-[46px]

                      md:text-[56px]

                      lg:text-[64px]
                    "
                  >
                    {
                      reason.heading
                    }
                  </h3>

                  <p
                    className="
                      mt-6

                      max-w-[475px]

                      font-sora

                      text-[15px]

                      leading-[1.7]

                      text-black/58

                      md:text-[17px]

                      lg:text-[18px]
                    "
                  >
                    {
                      reason.description
                    }
                  </p>
                </div>

                {/* =======================================
                    IMAGE
                   ======================================= */}

                <div
                  data-why-image

                  className={`
                    relative

                    ${
                      imageRight
                        ? `
                          md:order-2
                          md:col-start-6
                          md:col-span-7
                        `
                        : `
                          md:order-1
                          md:col-start-1
                          md:col-span-7
                        `
                    }
                  `}
                >
                  <div
                    className="
                      relative

                      aspect-[1.48/1]

                      w-full

                      overflow-hidden

                      rounded-[28px]

                      border
                      border-black/[0.04]

                      bg-[#F3F3F3]

                      shadow-[0_24px_60px_rgba(0,0,0,0.08)]
                    "
                  >
                    <Image
                      src={
                        reason.image
                      }

                      alt={
                        reason.heading
                      }

                      fill

                      className="
                        object-cover
                      "

                      sizes="
                        (max-width: 768px) 100vw,
                        58vw
                      "
                    />

                    {/* NUMBER */}

                    <div
                      className="
                        absolute

                        left-5
                        top-5

                        grid
                        h-12
                        w-12

                        place-items-center

                        rounded-full

                        border
                        border-black/[0.06]

                        bg-white/95

                        shadow-[0_8px_24px_rgba(0,0,0,0.08)]
                      "
                    >
                      <span
                        className="
                          font-sora

                          text-[10px]
                          font-semibold

                          tracking-[0.14em]

                          text-[#111111]
                        "
                      >
                        {
                          reason.number
                        }
                      </span>
                    </div>

                    {/* CONNECTION NODE */}

                    <div
                      className={`
                        absolute

                        top-1/2

                        z-30

                        grid
                        h-6
                        w-6

                        -translate-y-1/2

                        place-items-center

                        rounded-full

                        border
                        border-black/15

                        bg-white

                        shadow-[0_7px_18px_rgba(0,0,0,0.08)]

                        ${
                          imageRight
                            ? "-left-3"
                            : "-right-3"
                        }
                      `}
                    >
                      <span
                        className="
                          h-2.5
                          w-2.5

                          rounded-full

                          bg-black
                        "
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        )}
      </div>
    </section>
  );
}