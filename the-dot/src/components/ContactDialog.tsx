"use client";

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

interface ContactDialogProps {
  open: boolean;
  onClose: () => void;
}

type ContactFieldDetail = {
  target: string;

  thought: string;

  animation:
    | "curious"
    | "thinking"
    | "playful"
    | "proud";
};

export function ContactDialog({
  open,
  onClose,
}: ContactDialogProps) {
  const dialogRef =
    useRef<HTMLDivElement>(null);

  const firstInputRef =
    useRef<HTMLInputElement>(null);

  const [
    submitted,
    setSubmitted,
  ] = useState(false);

  /* =========================================================
     DOT FIELD MESSAGE
     ========================================================= */

  const sendFieldFocus = (
    detail: ContactFieldDetail
  ) => {
    window.dispatchEvent(
      new CustomEvent(
        "dot:contact-field",
        {
          detail,
        }
      )
    );
  };

  /* =========================================================
     CLOSE
     ========================================================= */

  const closeDialog = () => {
    window.dispatchEvent(
      new Event(
        "dot:contact-dialog-close"
      )
    );

    onClose();
  };

  /* =========================================================
     DIALOG OPEN
     ========================================================= */

  useEffect(() => {
    if (!open) return;

    setSubmitted(false);

    const previousActive =
      document.activeElement as
        | HTMLElement
        | null;

    const timer =
      window.setTimeout(
        () => {
          window.dispatchEvent(
            new CustomEvent(
              "dot:contact-dialog-open",
              {
                detail: {
                  target:
                    "[data-dot-contact-dialog-home]",

                  thought:
                    "Give me the messy version. We can make sense of it together.",

                  animation:
                    "curious",
                },
              }
            )
          );

          firstInputRef.current?.focus();
        },
        60
      );

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (
        event.key === "Escape"
      ) {
        closeDialog();
        return;
      }

      if (
        event.key !== "Tab" ||
        !dialogRef.current
      ) {
        return;
      }

      const focusable =
        dialogRef.current.querySelectorAll<HTMLElement>(
          'input, textarea, button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

      if (!focusable.length) {
        return;
      }

      const first =
        focusable[0];

      const last =
        focusable[
          focusable.length - 1
        ];

      if (
        event.shiftKey &&
        document.activeElement ===
          first
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement ===
          last
      ) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.clearTimeout(timer);

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

      previousActive?.focus?.();
    };
  }, [
    open,
    onClose,
  ]);

  if (!open) {
    return null;
  }

  /* =========================================================
     SUBMIT
     ========================================================= */

  const handleSubmit = (
    event:
      FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSubmitted(true);

    window.dispatchEvent(
      new CustomEvent(
        "dot:contact-success",
        {
          detail: {
            target:
              "[data-dot-contact-success]",

            thought:
              "Nice. We’ll take it from here.",

            animation:
              "celebrate",
          },
        }
      )
    );
  };

  return (
    <div
      className="
        fixed
        inset-0

        z-[200]

        flex

        items-center
        justify-center

        bg-[#0B0C0D]/65

        p-4

        backdrop-blur-md
      "
      data-cursor-theme="dark"
      onMouseDown={(
        event
      ) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          closeDialog();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-dialog-title"
        data-cursor-theme="light"
        className="
          relative

          w-full
          max-w-[680px]

          rounded-[30px]

          border
          border-[#E5E6E9]

          bg-[#F5F5F5]

          p-6

          shadow-2xl

          md:p-9
        "
      >
        {/* =================================================
            GENERAL DIALOG DOT POSITION
           ================================================= */}

        <span
          data-dot-contact-dialog-home
          aria-hidden="true"
          className="
            pointer-events-none

            absolute

            -left-5
            top-[112px]

            h-px
            w-px

            md:-left-10
          "
        />

        {/* =================================================
            HEADER
           ================================================= */}

        <div
          className="
            mb-8

            flex

            items-start
            justify-between

            gap-6
          "
        >
          <div>
            <p
              className="
                mb-2

                font-sora

                text-[11px]
                font-semibold

                uppercase
                tracking-[0.16em]

                text-[#818084]
              "
            >
              Start a conversation
            </p>

            <h2
              id="contact-dialog-title"
              className="
                max-w-[520px]

                font-sora

                text-[30px]
                font-bold

                leading-tight

                tracking-[-0.03em]

                text-[#040404]

                md:text-[40px]
              "
            >
              Tell us what you are
              trying to build.
            </h2>
          </div>

          <button
            type="button"
            onClick={closeDialog}
            aria-label="Close contact dialog"
            className="
              grid

              h-10
              w-10

              shrink-0

              place-items-center

              rounded-full

              border
              border-[#D7D8DA]

              font-sora

              text-[18px]

              text-[#040404]

              transition-colors

              hover:bg-[#0B0D0E]
              hover:text-white

              focus:outline-none

              focus-visible:ring-2
              focus-visible:ring-[#0B0D0E]
            "
          >
            ×
          </button>
        </div>

        {/* =================================================
            SUCCESS
           ================================================= */}

        {submitted ? (
          <div
            className="
              relative

              rounded-[22px]

              border
              border-[#D7D8DA]

              bg-white

              p-7
            "
          >
            <span
              data-dot-contact-success
              aria-hidden="true"
              className="
                pointer-events-none

                absolute

                -left-8
                top-1/2

                h-px
                w-px

                -translate-y-1/2
              "
            />

            <p
              className="
                font-sora

                text-[18px]
                font-semibold

                text-[#040404]
              "
            >
              Prototype submitted.
            </p>

            <p
              className="
                mt-2

                font-sora

                text-[14px]

                leading-relaxed

                text-[#505354]
              "
            >
              This form is UI-only for
              now, so no message has
              been sent yet.
            </p>

            <button
              type="button"
              onClick={closeDialog}
              className="
                mt-6

                rounded-full

                bg-[#0B0D0E]

                px-5
                py-3

                font-sora

                text-[13px]
                font-semibold

                text-white
              "
            >
              Close
            </button>
          </div>
        ) : (
          /* =================================================
             FORM
             ================================================= */

          <form
            onSubmit={handleSubmit}
            className="
              grid
              gap-4
            "
          >
            <div
              className="
                grid
                gap-4

                md:grid-cols-2
              "
            >
              {/* NAME */}

              <label
                className="
                  relative

                  grid
                  gap-2

                  font-sora

                  text-[12px]
                  font-semibold

                  uppercase
                  tracking-[0.08em]

                  text-[#505354]
                "
              >
                <span
                  data-dot-contact-name
                  aria-hidden="true"
                  className="
                    pointer-events-none

                    absolute

                    -left-7
                    top-[42px]

                    h-px
                    w-px
                  "
                />

                Name

                <input
                  ref={
                    firstInputRef
                  }
                  required
                  name="name"
                  autoComplete="name"
                  onFocus={() =>
                    sendFieldFocus({
                      target:
                        "[data-dot-contact-name]",

                      thought:
                        "What should we call you?",

                      animation:
                        "curious",
                    })
                  }
                  className="
                    h-12

                    rounded-[14px]

                    border
                    border-[#D7D8DA]

                    bg-white

                    px-4

                    font-sora

                    text-[14px]
                    font-normal

                    normal-case
                    tracking-normal

                    text-[#040404]

                    outline-none

                    transition

                    focus:border-[#0B0D0E]
                  "
                />
              </label>

              {/* EMAIL */}

              <label
                className="
                  relative

                  grid
                  gap-2

                  font-sora

                  text-[12px]
                  font-semibold

                  uppercase
                  tracking-[0.08em]

                  text-[#505354]
                "
              >
                <span
                  data-dot-contact-email
                  aria-hidden="true"
                  className="
                    pointer-events-none

                    absolute

                    -right-7
                    top-[42px]

                    h-px
                    w-px
                  "
                />

                Email

                <input
                  required
                  type="email"
                  name="email"
                  autoComplete="email"
                  onFocus={() =>
                    sendFieldFocus({
                      target:
                        "[data-dot-contact-email]",

                      thought:
                        "Where should we reply?",

                      animation:
                        "playful",
                    })
                  }
                  className="
                    h-12

                    rounded-[14px]

                    border
                    border-[#D7D8DA]

                    bg-white

                    px-4

                    font-sora

                    text-[14px]
                    font-normal

                    normal-case
                    tracking-normal

                    text-[#040404]

                    outline-none

                    transition

                    focus:border-[#0B0D0E]
                  "
                />
              </label>
            </div>

            {/* COMPANY */}

            <label
              className="
                relative

                grid
                gap-2

                font-sora

                text-[12px]
                font-semibold

                uppercase
                tracking-[0.08em]

                text-[#505354]
              "
            >
              <span
                data-dot-contact-company
                aria-hidden="true"
                className="
                  pointer-events-none

                  absolute

                  -left-7
                  top-[42px]

                  h-px
                  w-px
                "
              />

              Company

              <input
                required
                name="company"
                autoComplete="organization"
                onFocus={() =>
                  sendFieldFocus({
                    target:
                      "[data-dot-contact-company]",

                    thought:
                      "Who are we building this for?",

                    animation:
                      "thinking",
                  })
                }
                className="
                  h-12

                  rounded-[14px]

                  border
                  border-[#D7D8DA]

                  bg-white

                  px-4

                  font-sora

                  text-[14px]
                  font-normal

                  normal-case
                  tracking-normal

                  text-[#040404]

                  outline-none

                  transition

                  focus:border-[#0B0D0E]
                "
              />
            </label>

            {/* PROJECT */}

            <label
              className="
                relative

                grid
                gap-2

                font-sora

                text-[12px]
                font-semibold

                uppercase
                tracking-[0.08em]

                text-[#505354]
              "
            >
              <span
                data-dot-contact-project
                aria-hidden="true"
                className="
                  pointer-events-none

                  absolute

                  -left-7
                  top-[76px]

                  h-px
                  w-px
                "
              />

              What are you looking to
              build?

              <textarea
                required
                name="project"
                rows={5}
                onFocus={() =>
                  sendFieldFocus({
                    target:
                      "[data-dot-contact-project]",

                    thought:
                      "Example: Our B2B site gets traffic, but very few qualified enquiries.",

                    animation:
                      "thinking",
                  })
                }
                className="
                  resize-none

                  rounded-[14px]

                  border
                  border-[#D7D8DA]

                  bg-white

                  px-4
                  py-3

                  font-sora

                  text-[14px]
                  font-normal

                  normal-case
                  tracking-normal

                  text-[#040404]

                  outline-none

                  transition

                  focus:border-[#0B0D0E]
                "
              />
            </label>

            <div
              className="
                mt-2

                flex

                items-center
                justify-between

                gap-4
              "
            >
              <span
                className="
                  font-sora

                  text-[11px]

                  text-[#818084]
                "
              >
                Prototype only — no data
                is sent.
              </span>

              <button
                type="submit"
                className="
                  rounded-full

                  bg-[#0B0D0E]

                  px-6
                  py-3

                  font-sora

                  text-[13px]
                  font-semibold

                  text-white

                  transition-transform

                  hover:scale-[1.02]
                  active:scale-[0.98]
                "
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}