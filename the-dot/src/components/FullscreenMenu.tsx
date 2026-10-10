"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import Link from "next/link";
import gsap from "gsap";

import {
  EdgeCurve,
  EDGE_CURVE_WIDTH,
} from "./EdgeCurve";

/* =========================================================
   CONFIG
   ========================================================= */

const CURVE_DURATION = 1.4;

interface NavItemData {
  id: string;
  num: string;
  label: string;
  href?: string;
}

const navItems: NavItemData[] = [
  {
    id: "work",
    num: "01",
    label: "WORK",
  },
  {
    id: "services",
    num: "02",
    label: "SERVICES",
  },
  {
    id: "contact",
    num: "03",
    label: "CONTACT",
    href: "/book-a-call",
  },
  {
    id: "team",
    num: "04",
    label: "TEAM",
  },
];

interface FullscreenMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;

  onSelectSection: (
    id: string
  ) => void;
}

export function FullscreenMenu({
  isOpen,
  onClose,
  activeSection,
  onSelectSection,
}: FullscreenMenuProps) {
  const rootRef =
    useRef<HTMLDivElement>(null);

  const surfaceRef =
    useRef<HTMLDivElement>(null);

  const contentRef =
    useRef<HTMLDivElement>(null);

  const linksRef =
    useRef<HTMLDivElement>(null);

  const closeControlRef =
    useRef<HTMLDivElement>(null);

  const returnHomeAfterCloseRef =
    useRef(false);

  const [
    shouldRender,
    setShouldRender,
  ] = useState(isOpen);

  const [
    hoveredIndex,
    setHoveredIndex,
  ] =
    useState<number | null>(
      null
    );

  /* =======================================================
     MOUNT
     ======================================================= */

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    }
  }, [isOpen]);

  /* =======================================================
     OPEN / CLOSE
     ======================================================= */

  useEffect(() => {
    const root =
      rootRef.current;

    const surface =
      surfaceRef.current;

    const content =
      contentRef.current;

    const closeControl =
      closeControlRef.current;

    if (
      !shouldRender ||
      !root ||
      !surface ||
      !content ||
      !closeControl
    ) {
      return;
    }

    const links =
      linksRef.current?.querySelectorAll(
        ".menu-link-item"
      ) ?? [];

    const reduced =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

    const fullWidth =
      window.innerWidth +
      EDGE_CURVE_WIDTH * 2;

    /* =====================================================
       REDUCED MOTION
       ===================================================== */

    if (reduced) {
      if (isOpen) {
        gsap.set(root, {
          display: "block",
          pointerEvents: "auto",
        });

        gsap.set(surface, {
          width: fullWidth,
        });

        gsap.set(content, {
          opacity: 1,
        });

        gsap.set(links, {
          opacity: 1,
          x: 0,
          y: 0,
        });

        gsap.set(
          closeControl,
          {
            opacity: 1,
          }
        );
      } else {
        setShouldRender(false);

        if (
          returnHomeAfterCloseRef.current
        ) {
          returnHomeAfterCloseRef.current =
            false;

          onSelectSection(
            "hero"
          );
        }
      }

      return;
    }

    const ctx =
      gsap.context(
        () => {
          /* ===============================================
             OPEN
             =============================================== */

          if (isOpen) {
            returnHomeAfterCloseRef.current =
              false;

            gsap.set(root, {
              display: "block",

              pointerEvents:
                "auto",
            });

            gsap.set(surface, {
              width: 0,
            });

            gsap.set(content, {
              opacity: 0,
            });

            gsap.set(links, {
              opacity: 0,

              x: -18,
              y: 18,
            });

            gsap.set(
              closeControl,
              {
                opacity: 0,
                x: 8,
              }
            );

            const timeline =
              gsap.timeline();

            /*
             * CURVE
             * RIGHT → LEFT
             */

            timeline.to(
              surface,
              {
                width:
                  fullWidth,

                duration:
                  CURVE_DURATION,

                ease:
                  "power3.inOut",
              }
            );

            timeline.to(
              content,
              {
                opacity: 1,

                duration: 0.38,

                ease:
                  "power2.out",
              },
              `-=${CURVE_DURATION * 0.3}`
            );

            timeline.to(
              links,
              {
                opacity: 1,

                x: 0,
                y: 0,

                duration: 0.58,

                stagger: 0.075,

                ease:
                  "power3.out",
              },
              "-=0.22"
            );

            timeline.to(
              closeControl,
              {
                opacity: 1,

                x: 0,

                duration: 0.42,

                ease:
                  "power3.out",
              },
              "-=0.36"
            );

            return;
          }

          /* ===============================================
             CLOSE
             =============================================== */

          gsap.set(root, {
            pointerEvents:
              "none",
          });

          gsap.set(surface, {
            width: fullWidth,
          });

          const timeline =
            gsap.timeline({
              onComplete:
                () => {
                  setHoveredIndex(
                    null
                  );

                  setShouldRender(
                    false
                  );

                  if (
                    returnHomeAfterCloseRef.current
                  ) {
                    returnHomeAfterCloseRef.current =
                      false;

                    onSelectSection(
                      "hero"
                    );
                  }
                },
            });

          timeline.to(
            closeControl,
            {
              opacity: 0,

              duration: 0.18,

              ease:
                "power2.out",
            },
            0
          );

          timeline.to(
            links,
            {
              opacity: 0,

              x: 14,

              duration: 0.38,

              stagger: {
                each: 0.025,

                from: "end",
              },

              ease:
                "power2.in",
            },
            0
          );

          timeline.to(
            content,
            {
              opacity: 0,

              duration: 0.34,

              ease:
                "power2.in",
            },
            0.08
          );

          /*
           * SAME CURVE
           * LEFT → RIGHT
           */

          timeline.to(
            surface,
            {
              width: 0,

              duration:
                CURVE_DURATION,

              ease:
                "power3.inOut",
            },
            0
          );
        },
        root
      );

    return () => {
      ctx.revert();
    };
  }, [
    isOpen,
    shouldRender,
    onSelectSection,
  ]);

  /* =======================================================
     ESC
     ======================================================= */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (
        event.key ===
        "Escape"
      ) {
        returnHomeAfterCloseRef.current =
          true;

        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    isOpen,
    onClose,
  ]);

  if (!shouldRender) {
    return null;
  }

  /* =======================================================
     MENU SELECTION
     ======================================================= */

  const selectItem = (
    item: NavItemData
  ) => {
    returnHomeAfterCloseRef.current =
      false;

    if (item.href) {
      window.location.assign(
        item.href
      );

      return;
    }

    onSelectSection(
      item.id
    );

    onClose();
  };

  /* =======================================================
     THE DOT → HOME
     ======================================================= */

  const returnHome = () => {
    returnHomeAfterCloseRef.current =
      false;

    onSelectSection(
      "hero"
    );

    onClose();
  };

  /* =======================================================
     X
     ======================================================= */

  const handleClose = () => {
    returnHomeAfterCloseRef.current =
      true;

    onClose();
  };

  return (
    <div
      ref={rootRef}

      id="fullscreen-menu"

      role="dialog"

      aria-modal="true"

      aria-label="Section navigation"

      className="
        fixed
        inset-0

        z-[100]

        overflow-hidden
      "
    >
      {/* =================================================
          DARK SURFACE
         ================================================= */}

      <div
        ref={surfaceRef}

        className="
          fixed

          right-0
          top-0

          h-[100svh]

          overflow-visible

          will-change-[width]
        "

        style={{
          width: 0,
        }}
      >
        {/* =================================================
            BODY
           ================================================= */}

        <div
          className="
            absolute

            inset-y-0
            right-0

            h-full
            w-full

            overflow-hidden

            bg-brand
          "
        >
          {/* ===============================================
              CONTENT
             =============================================== */}

          <div
            ref={contentRef}

            className="
              absolute

              right-0
              top-0

              flex

              h-[100svh]
              w-[100vw]

              flex-col

              px-7
              py-8

              text-white

              sm:px-10
              sm:py-9

              md:px-12
              md:py-10

              lg:px-16
              lg:py-12
            "

            style={{
              paddingRight:
                `${EDGE_CURVE_WIDTH + 54}px`,
            }}
          >
            {/* ===========================================
                THE DOT
               =========================================== */}

            <button
              type="button"

              onClick={
                returnHome
              }

              aria-label="THE DOT — Home"

              className="
                w-fit

                cursor-pointer

                font-sora

                text-[13px]
                font-bold

                uppercase

                tracking-[0.24em]

                text-white

                transition-opacity
                duration-300

                hover:opacity-55

                focus:outline-none

                md:text-[14px]
              "
            >
              THE DOT
            </button>

            {/* ===========================================
                MENU
               =========================================== */}

            <div
              className="
                flex
                flex-1

                items-center
              "
            >
              <div
                className="
                  grid

                  w-full

                  grid-cols-12
                "
              >
                {/* 
                  ORIGINAL SPATIAL ALIGNMENT.

                  Menu pushed back toward
                  the right side like before.
                */}

                <div
                  className="
                    hidden

                    lg:col-span-6
                    lg:block
                  "
                />

                <div
                  ref={linksRef}

                  className="
                    col-span-12

                    flex
                    flex-col

                    items-start

                    md:col-span-8
                    md:col-start-5

                    lg:col-span-5
                    lg:col-start-7

                    xl:col-span-4
                    xl:col-start-8
                  "
                >
                  {navItems.map(
                    (
                      item,
                      index
                    ) => {
                      const active =
                        activeSection ===
                        item.id;

                      const hovered =
                        hoveredIndex ===
                        index;

                      const anotherHovered =
                        hoveredIndex !==
                          null &&
                        hoveredIndex !==
                          index;

                      return (
                        <button
                          key={
                            item.id
                          }

                          type="button"

                          onMouseEnter={() =>
                            setHoveredIndex(
                              index
                            )
                          }

                          onMouseLeave={() =>
                            setHoveredIndex(
                              null
                            )
                          }

                          onFocus={() =>
                            setHoveredIndex(
                              index
                            )
                          }

                          onBlur={() =>
                            setHoveredIndex(
                              null
                            )
                          }

                          onClick={() =>
                            selectItem(
                              item
                            )
                          }

                          /*
                           * =====================================
                           * LARGE CLICK / HOVER RECTANGLE
                           * =====================================
                           *
                           * Visual alignment remains untouched.
                           *
                           * But interaction extends:
                           *
                           * 96px LEFT
                           * 56px RIGHT
                           * more vertical room
                           */

                          className="
                            menu-link-item

                            group

                            -ml-24

                            flex

                            w-[calc(100%+9.5rem)]

                            items-center

                            gap-5

                            bg-transparent

                            py-[13px]

                            pl-24
                            pr-14

                            text-left

                            cursor-pointer

                            outline-none
                          "
                        >
                          {/* ===============================
                              NUMBER
                             =============================== */}

                          <span
                            className={`
                              w-[30px]

                              shrink-0

                              font-sora

                              text-[10px]
                              font-medium

                              tracking-[0.1em]

                              transition-colors
                              duration-300

                              md:text-[11px]

                              ${
                                hovered ||
                                active
                                  ? "text-white/75"
                                  : "text-white/25"
                              }
                            `}
                          >
                            {
                              item.num
                            }
                          </span>

                          {/* ===============================
                              LABEL

                              BACK TO SORA
                              + SMALLER SIZE
                             =============================== */}

                          <span
                            className={`
                              font-sora

                              text-[34px]

                              font-bold

                              leading-[1]

                              tracking-[-0.045em]

                              transition-all

                              duration-300

                              sm:text-[40px]

                              lg:text-[46px]

                              xl:text-[50px]

                              ${
                                hovered
                                  ? "translate-x-2.5 text-white"
                                  : anotherHovered
                                  ? "text-white/20"
                                  : active
                                  ? "text-white"
                                  : "text-white/72"
                              }
                            `}
                          >
                            {
                              item.label
                            }
                          </span>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            </div>

            {/* ===========================================
                FOOTER
               =========================================== */}

            <div
              className="
                flex

                flex-col

                items-start
                justify-between

                gap-4

                border-t
                border-white/10

                pt-5

                font-sora

                text-[10px]

                uppercase

                tracking-[0.1em]

                text-white/40

                sm:flex-row
                sm:items-center

                md:text-[11px]
              "
            >
              <p>
                ©{" "}
                {new Date().getFullYear()}{" "}
                THE DOT
              </p>

              <Link
                href="/book-a-call"

                className="
                  font-semibold

                  normal-case

                  tracking-normal

                  text-white

                  transition-colors
                  duration-300

                  hover:text-[#C9A09D]
                "
              >
                Book a discovery call ↗
              </Link>
            </div>
          </div>
        </div>

        {/* =================================================
            SAME DARK CURVE

            OPEN:
            RIGHT → LEFT

            CLOSE:
            LEFT → RIGHT
           ================================================= */}

        <div
          className="
            absolute

            left-0
            top-0

            h-full

            -translate-x-full
          "

          style={{
            width:
              `${EDGE_CURVE_WIDTH}px`,
          }}
        >
          <EdgeCurve
            tone="dark"
          />
        </div>
      </div>

      {/* =================================================
          CLOSE CONTROL
         ================================================= */}

      <div
        ref={closeControlRef}

        className="
          absolute

          right-0
          top-0

          z-[20]

          h-[100svh]
        "

        style={{
          width:
            `${EDGE_CURVE_WIDTH}px`,
        }}
      >
        <EdgeCurve
          tone="light"
        />

        <button
          type="button"

          aria-label="Close navigation"

          onClick={
            handleClose
          }

          className="
            group

            absolute

            right-0
            top-1/2

            z-[2]

            flex

            -translate-y-1/2

            items-center
            justify-center

            border-0
            bg-transparent

            text-brand

            cursor-pointer

            outline-none
          "

          style={{
            width:
              `${EDGE_CURVE_WIDTH}px`,

            height:
              "150px",
          }}
        >
          <span
            aria-hidden="true"

            className="
              relative

              block

              h-[26px]
              w-[26px]

              transition-transform
              duration-300

              group-hover:scale-[1.06]
            "

            style={{
              transform:
                "translateX(16px)",
            }}
          >
            <span
              className="
                absolute

                left-1/2
                top-1/2

                h-[1.75px]
                w-[24px]

                -translate-x-1/2
                -translate-y-1/2

                rotate-45

                rounded-full

                bg-brand

                transition-transform
                duration-300

                group-hover:rotate-[39deg]
              "
            />

            <span
              className="
                absolute

                left-1/2
                top-1/2

                h-[1.75px]
                w-[24px]

                -translate-x-1/2
                -translate-y-1/2

                -rotate-45

                rounded-full

                bg-brand

                transition-transform
                duration-300

                group-hover:-rotate-[39deg]
              "
            />
          </span>
        </button>
      </div>
    </div>
  );
}