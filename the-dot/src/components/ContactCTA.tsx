"use client";

import { useEffect, useRef } from "react";
import { Button } from "./Button";

export function ContactCTA() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        window.dispatchEvent(
          new CustomEvent("dot:contact-visible", {
            detail: {
              visible:
                entry.isIntersecting &&
                entry.intersectionRatio >= 0.35,
            },
          })
        );
      },
      {
        threshold: [0, 0.2, 0.35, 0.6],
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();

      window.dispatchEvent(
        new CustomEvent("dot:contact-visible", {
          detail: {
            visible: false,
          },
        })
      );
    };
  }, []);

  const handleCTAHover = (
    active: boolean
  ) => {
    window.dispatchEvent(
      new CustomEvent(
        "dot:contact-cta-hover",
        {
          detail: {
            active,
            thought: active
              ? "Messy is fine. Start with the problem."
              : "Tell me what you're trying to build.",
          },
        }
      )
    );
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="
        mx-auto
        max-w-[1440px]

        px-4
        py-12

        md:px-8
        md:py-20
      "
    >
      <div
        className="
          relative

          w-full

          overflow-hidden

          rounded-[32px]

          border
          border-[#E5E6E9]

          bg-[#F1F2F3]

          p-8

          shadow-xs

          md:rounded-[40px]
          md:p-14

          lg:p-16
        "
      >
        {/* Ambient glow */}

        <div
          className="
            glow-contact

            pointer-events-none

            absolute

            right-[5%]
            top-1/2

            h-[250px]
            w-[350px]

            -translate-y-1/2

            opacity-80
          "
        />

        <div
          className="
            relative
            z-10

            grid
            grid-cols-1

            items-center

            gap-8

            lg:grid-cols-12
          "
        >
          {/* LEFT */}

          <div
            className="
              space-y-4

              lg:col-span-6
            "
          >
            <h2
              className="
                font-sora

                text-[36px]
                font-bold

                leading-[1.05]

                tracking-tight

                text-[#040404]

                sm:text-[48px]

                lg:text-[56px]
              "
            >
              Have something <br />
              worth building?
            </h2>

            <p
              className="
                max-w-[360px]

                font-sora

                text-[15px]

                leading-relaxed

                text-[#505354]

                md:text-[17px]
              "
            >
              Bring us the messy version.
              <br />
              We’ll start with the problem.
            </p>
          </div>

          {/* RIGHT */}

          <div
            className="
              relative

              flex
              flex-col

              items-center
              justify-end

              gap-8

              py-4

              md:flex-row

              lg:col-span-6
            "
          >
            {/* S CURVE */}

            <div
              className="
                relative

                flex
                w-full
                flex-1

                items-center
                justify-center

                md:w-auto
              "
            >
              <svg
                className="
                  h-24
                  w-full

                  max-w-[280px]

                  overflow-visible
                "
                viewBox="0 0 200 80"
                fill="none"
              >
                <path
                  d="M 10 70 C 60 70 80 10 130 10 C 170 10 190 40 200 40"
                  stroke="#818084"
                  strokeWidth="1.5"
                  strokeOpacity="0.4"
                  fill="none"
                />
              </svg>

              {/*
                DOT RESTING POSITION

                The original static black circle is removed.
                The interactive DOT now occupies this point.
              */}

              <span
                data-dot-contact-home
                aria-hidden="true"
                className="
                  pointer-events-none

                  absolute

                  left-1/2
                  top-1/2

                  h-px
                  w-px

                  -translate-x-1/2
                  -translate-y-1/2
                "
              />
            </div>

            {/* CTA */}

            <div
              className="
                relative
                z-10

                shrink-0
              "
              onPointerEnter={() =>
                handleCTAHover(true)
              }
              onPointerLeave={() =>
                handleCTAHover(false)
              }
            >
              <Button
                href="/book-a-call"
                variant="primary"
                className="
                  px-8
                  py-4

                  text-[15px]

                  shadow-lg
                "
              >
                Book a discovery call
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}