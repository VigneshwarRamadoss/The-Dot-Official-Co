"use client";

import Link from "next/link";

/* =========================================================
   FOOTER
   ========================================================= */

export function Footer() {
  /* =======================================================
     BACK TO TOP
     ======================================================= */

  const scrollToTop = () => {
    const activeScroller =
      document.querySelector<HTMLElement>(
        '[data-scene-scroll][data-active="true"]'
      ) ??
      document.querySelector<HTMLElement>(
        "[data-scene-scroll]"
      );

    if (activeScroller) {
      activeScroller.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =======================================================
     INTERNAL SECTION NAVIGATION
     ======================================================= */

  const scrollToSection = (
    id: string
  ) => {
    const target =
      document.getElementById(id);

    if (!target) {
      return;
    }

    const activeScroller =
      document.querySelector<HTMLElement>(
        '[data-scene-scroll][data-active="true"]'
      ) ??
      document.querySelector<HTMLElement>(
        "[data-scene-scroll]"
      );

    if (!activeScroller) {
      target.scrollIntoView({
        behavior: "smooth",
      });

      return;
    }

    const targetRect =
      target.getBoundingClientRect();

    const scrollerRect =
      activeScroller.getBoundingClientRect();

    const targetTop =
      activeScroller.scrollTop +
      targetRect.top -
      scrollerRect.top;

    activeScroller.scrollTo({
      top: targetTop,
      behavior: "smooth",
    });
  };

  /* =======================================================
     JSX
     ======================================================= */

  return (
    <footer
      className="
        relative
        z-20

        w-full

        overflow-hidden

        border-t
        border-black/[0.07]

        bg-white

        text-[#181818]

        md:h-[100svh]
      "
    >
      <div
        className="
          mx-auto

          flex
          min-h-[100svh]
          w-full
          max-w-[1440px]

          flex-col

          px-6

          md:h-[100svh]
          md:min-h-0
          md:px-12
        "
      >
        {/* =================================================
            TOP

            Compact CTA + navigation.
           ================================================= */}

        <div
          className="
            grid

            shrink-0

            gap-10

            border-b
            border-black/[0.07]

            pb-9
            pt-10

            md:h-[38%]
            md:grid-cols-12
            md:gap-8
            md:pb-8
            md:pt-8

            lg:pt-9
          "
        >
          {/* ===============================================
              CTA
             =============================================== */}

          <div
            className="
              flex
              flex-col
              justify-center

              md:col-span-8
            "
          >
            <p
              className="
                font-sora

                text-[9px]
                font-semibold

                uppercase

                tracking-[0.25em]

                text-black/35

                md:text-[10px]
              "
            >
              Start a conversation
            </p>

            <h2
              className="
                mt-4

                max-w-[800px]

                font-sora

                text-[38px]
                font-bold

                leading-[0.93]

                tracking-[-0.06em]

                text-[#181818]

                sm:text-[46px]

                md:text-[50px]

                lg:text-[58px]
              "
            >
              Have something worth building?
            </h2>

            <div
              className="
                mt-5

                flex
                flex-wrap

                items-center
                gap-6
              "
            >
              <p
                className="
                  max-w-[470px]

                  font-sora

                  text-[13px]

                  leading-[1.6]

                  text-black/50

                  md:text-[14px]
                "
              >
                Tell us what you&apos;re trying to solve.
                We&apos;ll start there.
              </p>

              <Link
                href="/book-a-call"
                className="
                  group

                  inline-flex

                  shrink-0

                  items-center
                  gap-3

                  rounded-full

                  bg-[#181818]

                  py-1.5
                  pl-5
                  pr-1.5

                  font-sora

                  text-[12px]
                  font-semibold

                  text-white

                  transition-transform

                  duration-500

                  ease-[cubic-bezier(.16,1,.3,1)]

                  hover:scale-[1.025]
                "
              >
                <span>
                  Contact us
                </span>

                <span
                  className="
                    grid

                    h-9
                    w-9

                    place-items-center

                    rounded-full

                    bg-white

                    text-[#181818]

                    transition-transform

                    duration-500

                    ease-[cubic-bezier(.16,1,.3,1)]

                    group-hover:translate-x-[2px]
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
                      d="
                        M5 12H19
                        M14 7L19 12L14 17
                      "
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </Link>
            </div>
          </div>

          {/* ===============================================
              NAVIGATION
             =============================================== */}

          <div
            className="
              grid

              grid-cols-2
              gap-8

              md:col-span-4
              md:content-center
            "
          >
            <div>
              <p
                className="
                  mb-4

                  font-sora

                  text-[8px]
                  font-semibold

                  uppercase

                  tracking-[0.22em]

                  text-black/30
                "
              >
                Navigate
              </p>

              <nav
                className="
                  flex
                  flex-col

                  items-start

                  gap-2.5
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    scrollToSection(
                      "about"
                    )
                  }
                  className="
                    cursor-pointer

                    font-sora

                    text-[13px]

                    text-black/55

                    transition-colors

                    duration-300

                    hover:text-black
                  "
                >
                  About
                </button>

                <button
                  type="button"
                  onClick={() =>
                    scrollToSection(
                      "trusted-clients"
                    )
                  }
                  className="
                    cursor-pointer

                    font-sora

                    text-[13px]

                    text-black/55

                    transition-colors

                    duration-300

                    hover:text-black
                  "
                >
                  Trusted clients
                </button>

                <button
                  type="button"
                  onClick={() =>
                    scrollToSection(
                      "why-us"
                    )
                  }
                  className="
                    cursor-pointer

                    font-sora

                    text-[13px]

                    text-black/55

                    transition-colors

                    duration-300

                    hover:text-black
                  "
                >
                  Why us
                </button>

                <Link
                  href="/book-a-call"
                  className="
                    font-sora

                    text-[13px]

                    text-black/55

                    transition-colors

                    duration-300

                    hover:text-black
                  "
                >
                  Contact
                </Link>
              </nav>
            </div>

            {/* =============================================
                RETURN
               ============================================= */}

            <div>
              <p
                className="
                  mb-4

                  font-sora

                  text-[8px]
                  font-semibold

                  uppercase

                  tracking-[0.22em]

                  text-black/30
                "
              >
                Return
              </p>

              <button
                type="button"
                onClick={
                  scrollToTop
                }
                className="
                  group

                  flex

                  cursor-pointer

                  items-center
                  gap-3

                  font-sora

                  text-[13px]

                  text-black/55

                  transition-colors

                  duration-300

                  hover:text-black
                "
              >
                Back to top

                <span
                  className="
                    grid

                    h-7
                    w-7

                    place-items-center

                    rounded-full

                    border
                    border-black/10

                    transition-transform

                    duration-500

                    group-hover:-translate-y-[2px]
                  "
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="
                      h-3
                      w-3
                    "
                  >
                    <path
                      d="
                        M12 18V6
                        M7.5 10.5L12 6L16.5 10.5
                      "
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* =================================================
            WORDMARK

            This now consumes the centre of the SAME viewport.
           ================================================= */}

        <Link
          href="/"
          aria-label="THE DOT home"
          className="
            group

            relative

            flex
            min-h-[250px]
            flex-1

            items-center

            overflow-hidden

            border-b
            border-black/[0.07]

            py-8

            md:min-h-0
            md:py-3
          "
        >
          <span
            className="
              block

              whitespace-nowrap

              font-sora

              text-[20vw]
              font-bold

              leading-[0.72]

              tracking-[-0.09em]

              text-[#181818]

              transition-transform

              duration-700

              ease-[cubic-bezier(.16,1,.3,1)]

              group-hover:translate-x-[0.6vw]

              md:text-[14vw]

              xl:text-[200px]
            "
          >
            THE DOT
          </span>

          {/* ARROW */}

          <span
            aria-hidden="true"
            className="
              absolute

              bottom-5
              right-0

              hidden

              h-11
              w-11

              place-items-center

              rounded-full

              border
              border-black/10

              text-[#181818]

              transition-all

              duration-500

              group-hover:rotate-45
              group-hover:bg-[#181818]
              group-hover:text-white

              md:grid
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
                d="
                  M5 19L19 5
                  M10 5H19V14
                "
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </Link>

        {/* =================================================
            BOTTOM
           ================================================= */}

        <div
          className="
            flex

            shrink-0

            flex-col

            gap-2

            py-5

            sm:flex-row
            sm:items-center
            sm:justify-between

            md:h-[10%]
            md:min-h-[52px]
            md:py-0
          "
        >
          <p
            className="
              font-sora

              text-[9px]

              tracking-[0.04em]

              text-black/34

              md:text-[10px]
            "
          >
            ©{" "}
            {new Date().getFullYear()}{" "}
            THE DOT. All rights reserved.
          </p>

          <p
            className="
              font-editorial

              text-[12px]
              italic

              text-black/38

              md:text-[13px]
            "
          >
            Built around the problem, not the template.
          </p>
        </div>
      </div>
    </footer>
  );
}