"use client";

import type {
  FormEvent,
} from "react";

import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/Button";

import type {
  AnimationName,
} from "@/components/mascot/GrokBot";

type ContactDotDetail = {
  target: string;
  thought: string;
  animation: AnimationName;
};

function sendContactDot(
  detail: ContactDotDetail
) {
  window.dispatchEvent(
    new CustomEvent(
      "dot:contact-field",
      {
        detail,
      }
    )
  );
}

export default function BookACallPage() {
  const handleSubmit = (
    event:
      FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    window.dispatchEvent(
      new CustomEvent(
        "dot:contact-success",
        {
          detail: {
            target:
              "[data-dot-contact-submit]",

            thought:
              "Nice. We’ll take it from here.",

            animation:
              "celebrate" as AnimationName,
          },
        }
      )
    );
  };

  return (
    <main
      className="
        min-h-screen

        flex
        flex-col

        bg-[#F5F5F5]

        text-[#040404]
      "
    >
      <Navigation />

      <section
        className="
          pt-32
          pb-20

          px-4
          md:px-8

          max-w-[1440px]

          mx-auto

          w-full

          flex-1

          flex
          flex-col

          justify-center
        "
      >
        <div
          className="
            relative

            max-w-[720px]

            mx-auto

            text-center

            space-y-8

            bg-white

            p-8
            md:p-14

            rounded-[32px]

            border
            border-[#E5E6E9]

            shadow-xl
          "
        >
          {/* =========================================
              DEFAULT DOT RESTING POINT
             ========================================= */}

          <span
            data-dot-contact-home
            aria-hidden="true"
            className="
              pointer-events-none

              absolute

              left-[18px]
              top-[58%]

              h-px
              w-px

              md:-left-[54px]
            "
          />

          <span
            className="
              font-sora

              text-[12px]
              font-semibold

              tracking-widest

              text-[#818084]

              uppercase
            "
          >
            Book a Discovery Call
          </span>

          <h1
            className="
              font-sora

              text-[36px]
              sm:text-[48px]
              md:text-[54px]

              font-bold

              tracking-tight

              text-[#040404]

              leading-tight
            "
          >
            Let’s discuss your
            <br />

            <span
              className="
                font-editorial

                italic

                font-normal

                text-[#505354]
              "
            >
              next project.
            </span>
          </h1>

          <p
            className="
              font-sora

              text-[15px]
              md:text-[17px]

              text-[#505354]

              leading-relaxed

              max-w-[540px]

              mx-auto
            "
          >
            30-minute strategic
            introduction call with
            THE DOT founders. Bring
            us the messy version—we’ll
            start with the problem.
          </p>

          <form
            onSubmit={
              handleSubmit
            }
            className="
              space-y-4

              text-left

              max-w-[480px]

              mx-auto

              pt-4
            "
          >
            {/* =========================================
                NAME
               ========================================= */}

            <div
              className="
                relative
              "
            >
              <span
                data-dot-contact-name
                aria-hidden="true"
                className="
                  pointer-events-none

                  absolute

                  left-[-2px]
                  top-[43px]

                  h-px
                  w-px

                  md:-left-[48px]
                "
              />

              <label
                className="
                  block

                  font-sora

                  text-xs
                  font-semibold

                  text-[#040404]

                  mb-1.5
                "
              >
                Your Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Jane Doe"
                onFocus={() =>
                  sendContactDot({
                    target:
                      "[data-dot-contact-name]",

                    thought:
                      "What should we call you?",

                    animation:
                      "curious",
                  })
                }
                className="
                  w-full

                  bg-[#F5F5F5]

                  border
                  border-[#E5E6E9]

                  rounded-xl

                  px-4
                  py-3

                  font-sora

                  text-sm

                  text-[#040404]

                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#0B0D0E]
                "
                required
              />
            </div>

            {/* =========================================
                EMAIL
               ========================================= */}

            <div
              className="
                relative
              "
            >
              <span
                data-dot-contact-email
                aria-hidden="true"
                className="
                  pointer-events-none

                  absolute

                  left-[-2px]
                  top-[43px]

                  h-px
                  w-px

                  md:-left-[48px]
                "
              />

              <label
                className="
                  block

                  font-sora

                  text-xs
                  font-semibold

                  text-[#040404]

                  mb-1.5
                "
              >
                Work Email
              </label>

              <input
                type="email"
                name="email"
                placeholder="jane@company.com"
                onFocus={() =>
                  sendContactDot({
                    target:
                      "[data-dot-contact-email]",

                    thought:
                      "Where should we reply?",

                    animation:
                      "playful",
                  })
                }
                className="
                  w-full

                  bg-[#F5F5F5]

                  border
                  border-[#E5E6E9]

                  rounded-xl

                  px-4
                  py-3

                  font-sora

                  text-sm

                  text-[#040404]

                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#0B0D0E]
                "
                required
              />
            </div>

            {/* =========================================
                PROJECT
               ========================================= */}

            <div
              className="
                relative
              "
            >
              <span
                data-dot-contact-project
                aria-hidden="true"
                className="
                  pointer-events-none

                  absolute

                  left-[-2px]
                  top-[72px]

                  h-px
                  w-px

                  md:-left-[48px]
                "
              />

              <label
                className="
                  block

                  font-sora

                  text-xs
                  font-semibold

                  text-[#040404]

                  mb-1.5
                "
              >
                Tell us about the
                project
              </label>

              <textarea
                rows={3}
                name="project"
                placeholder="What business problem are you looking to solve?"
                onFocus={() =>
                  sendContactDot({
                    target:
                      "[data-dot-contact-project]",

                    thought:
                      "Example: Our B2B site gets traffic, but very few qualified enquiries.",

                    animation:
                      "thinking",
                  })
                }
                className="
                  w-full

                  bg-[#F5F5F5]

                  border
                  border-[#E5E6E9]

                  rounded-xl

                  px-4
                  py-3

                  font-sora

                  text-sm

                  text-[#040404]

                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#0B0D0E]

                  resize-none
                "
                required
              />
            </div>

            {/* =========================================
                SUBMIT
               ========================================= */}

            <div
              className="
                relative
              "
            >
              <span
                data-dot-contact-submit
                aria-hidden="true"
                className="
                  pointer-events-none

                  absolute

                  left-[-2px]
                  top-1/2

                  h-px
                  w-px

                  -translate-y-1/2

                  md:-left-[48px]
                "
              />

              <Button
                variant="primary"
                showArrow={true}
                className="
                  w-full

                  justify-center

                  text-sm

                  py-3.5

                  mt-2
                "
              >
                Submit &amp;
                Schedule Call
              </Button>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}