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

interface NavItemData {
  id: string;
  num: string;
  label: string;
  href?: string;
}

const navItems: NavItemData[] = [
  {
    id: "services",
    num: "01",
    label: "SERVICES",
  },
  {
    id: "work",
    num: "02",
    label: "WORK",
  },
  {
    id: "team",
    num: "03",
    label: "TEAM",
  },
  {
    id: "contact",
    num: "04",
    label: "CONTACT",
    href: "/book-a-call",
  },
];

interface FullscreenMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  onSelectSection: (id: string) => void;
}

export function FullscreenMenu({
  isOpen,
  onClose,
  activeSection,
  onSelectSection,
}: FullscreenMenuProps) {
  const overlayRef =
    useRef<HTMLDivElement>(null);

  const linksRef =
    useRef<HTMLDivElement>(null);

  const closeTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null
    );

  const [
    shouldRender,
    setShouldRender,
  ] = useState(isOpen);

  const [
    hoveredIndex,
    setHoveredIndex,
  ] = useState<number | null>(null);

  const [
    closePressed,
    setClosePressed,
  ] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    }
  }, [isOpen]);

  /*
   * Menu open / close animation.
   */
  useEffect(() => {
    if (
      !shouldRender ||
      !overlayRef.current
    ) {
      return;
    }

    const overlay =
      overlayRef.current;

    const reduced =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

    const links =
      linksRef.current?.querySelectorAll(
        ".menu-link-item"
      );

    if (reduced) {
      if (isOpen) {
        gsap.set(overlay, {
          clipPath:
            "inset(0% 0% 0% 0%)",
          opacity: 1,
        });

        gsap.set(
          links ?? [],
          {
            opacity: 1,
            x: 0,
          }
        );
      } else {
        setShouldRender(false);
      }

      return;
    }

    const ctx = gsap.context(() => {
      if (isOpen) {
        gsap.set(overlay, {
          clipPath:
            "inset(0% 0% 0% 100%)",
          opacity: 1,
        });

        gsap.set(
          links ?? [],
          {
            opacity: 0,
            x: -50,
          }
        );

        const tl = gsap.timeline();

        tl.to(overlay, {
          clipPath:
            "inset(0% 0% 0% 0%)",
          duration: 0.7,
          ease: "power4.inOut",
        });

        tl.to(
          links ?? [],
          {
            opacity: 1,
            x: 0,
            duration: 0.52,
            stagger: 0.07,
            ease: "power3.out",
          },
          "-=0.3"
        );
      } else {
        const tl = gsap.timeline({
          onComplete: () => {
            setShouldRender(false);
            setHoveredIndex(null);
          },
        });

        tl.to(
          links ?? [],
          {
            opacity: 0,
            x: 26,
            duration: 0.18,

            stagger: {
              each: 0.025,
              from: "end",
            },

            ease: "power2.in",
          }
        );

        tl.to(
          overlay,
          {
            clipPath:
              "inset(0% 0% 0% 100%)",
            duration: 0.48,
            ease: "power3.inOut",
          },
          "-=0.05"
        );
      }
    }, overlay);

    return () => {
      ctx.revert();
    };
  }, [isOpen, shouldRender]);

  /*
   * ESC closes menu.
   */
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
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
  }, [isOpen, onClose]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(
          closeTimerRef.current
        );
      }
    };
  }, []);

  if (!shouldRender) {
    return null;
  }

  const selectItem = (
    item: NavItemData
  ) => {
    if (item.href) {
      window.location.assign(
        item.href
      );

      return;
    }

    onSelectSection(item.id);
    onClose();
  };

  /*
   * Logo → Home
   */
  const returnHome = () => {
    onSelectSection("hero");
    onClose();
  };

  /*
   * Small fluid motion before close.
   */
  const handleClose = () => {
    if (closeTimerRef.current) {
      return;
    }

    setClosePressed(true);

    closeTimerRef.current =
      setTimeout(() => {
        setClosePressed(false);
        closeTimerRef.current = null;

        onClose();
      }, 140);
  };

  return (
    <div
      ref={overlayRef}
      id="fullscreen-menu"

      role="dialog"
      aria-modal="true"
      aria-label="Section navigation"

      className="
        fixed
        inset-0

        z-[100]

        flex

        overflow-hidden

        bg-[#0B0C0D]
        text-white
      "

      style={{
        willChange: "clip-path",
      }}
    >
      {/* Main area */}
      <div
        className="
          flex
          min-h-full
          flex-1
          flex-col

          px-8
          py-9

          md:px-12
          md:py-10

          lg:px-16
          lg:py-12
        "
        style={{
          paddingRight:
            `${EDGE_CURVE_WIDTH + 56}px`,
        }}
      >
        {/* ============================================================
            LOGO — TOP LEFT
           ============================================================ */}

        <div
          className="
            flex
            items-center
          "
        >
          <button
            type="button"
            onClick={returnHome}
            aria-label="Return to home"

            className="
              font-sora

              text-[15px]
              font-bold

              tracking-[0.2em]

              text-white

              cursor-pointer

              transition-opacity

              hover:opacity-60

              focus:outline-none
            "
          >
            THE DOT
          </button>
        </div>

        {/* ============================================================
            MENU BLOCK — PUSHED TO RIGHT
           ============================================================ */}

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
              Empty left area creates the same spatial feeling
              as the reference.
            */}
            <div
              className="
                hidden
                lg:block
                lg:col-span-6
              "
            />

            <div
              ref={linksRef}

              className="
                col-span-12

                flex
                flex-col
                items-start

                gap-3

                md:col-span-8
                md:col-start-5

                lg:col-span-5
                lg:col-start-7

                xl:col-span-4
                xl:col-start-8
              "
            >
              {navItems.map(
                (item, index) => {
                  const isActive =
                    activeSection ===
                    item.id;

                  const isHovered =
                    hoveredIndex ===
                    index;

                  const anotherHovered =
                    hoveredIndex !==
                      null &&
                    hoveredIndex !==
                      index;

                  return (
                    <button
                      key={item.id}
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
                        selectItem(item)
                      }

                      className="
                        menu-link-item
                        group

                        flex
                        w-fit

                        items-baseline

                        gap-5

                        bg-transparent

                        p-1

                        text-left

                        cursor-pointer

                        outline-none
                      "
                    >
                      {/* Number remains LEFT */}
                      <span
                        className={`
                          w-[30px]
                          shrink-0

                          font-sora

                          text-[11px]
                          md:text-[12px]

                          font-medium

                          transition-colors
                          duration-300

                          ${
                            isHovered ||
                            isActive
                              ? "text-white"
                              : "text-[#67686D]"
                          }
                        `}
                      >
                        {item.num}
                      </span>

                      {/* Label */}
                      <span
                        className={`
                          font-sora

                          text-[40px]
                          sm:text-[50px]
                          lg:text-[58px]
                          xl:text-[62px]

                          font-bold

                          leading-[1.08]

                          tracking-[-0.045em]

                          transition-all
                          duration-300

                          ${
                            isHovered
                              ? `
                                translate-x-3
                                text-white
                              `
                              : anotherHovered
                              ? `
                                text-white/23
                              `
                              : isActive
                              ? `
                                text-white
                              `
                              : `
                                text-white/72
                              `
                          }
                        `}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="
            flex
            flex-col

            items-start
            justify-between

            gap-4

            pt-6

            text-[12px]
            text-[#9F9FA2]

            sm:flex-row
            sm:items-center
          "
        >
          <p>
            © {new Date().getFullYear()} THE DOT.
            All rights reserved.
          </p>

          <Link
            href="/book-a-call"

            className="
              font-sora
              font-semibold

              text-white

              transition-opacity

              hover:opacity-65
            "
          >
            Book a discovery call →
          </Link>
        </div>
      </div>

      {/* ============================================================
          WIDER WHITE CURVE
         ============================================================ */}

      <div
        className="
          absolute
          right-0
          top-0

          h-full

          pointer-events-none
        "

        style={{
          width:
            `${EDGE_CURVE_WIDTH}px`,
        }}
      >
        <EdgeCurve
          tone="light"
          pressed={closePressed}
        />
      </div>

      {/* ============================================================
          CLOSE ICON INSIDE CURVE
         ============================================================ */}

      <button
        type="button"

        aria-label="Close navigation"

        onClick={handleClose}

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

          text-[#0B0C0D]

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

            h-[24px]
            w-[24px]
          "

          /*
           * Shift slightly toward the outside half
           * of the visible white curve.
           */
          style={{
            transform:
              "translateX(19px)",
          }}
        >
          <span
            className="
              absolute
              left-1/2
              top-1/2

              h-[2px]
              w-[22px]

              -translate-x-1/2
              -translate-y-1/2

              rotate-45

              rounded-full

              bg-current

              transition-transform
              duration-300

              group-hover:rotate-[38deg]
            "
          />

          <span
            className="
              absolute
              left-1/2
              top-1/2

              h-[2px]
              w-[22px]

              -translate-x-1/2
              -translate-y-1/2

              -rotate-45

              rounded-full

              bg-current

              transition-transform
              duration-300

              group-hover:-rotate-[38deg]
            "
          />
        </span>
      </button>
    </div>
  );
}