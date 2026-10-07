"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      tl.fromTo(
        headlineRef.current,
        {
          opacity: 0,
          y: 28,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay: 0.15,
        }
      ).fromTo(
        ctaRef.current,
        {
          opacity: 0,
          y: 14,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
        },
        "-=0.4"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="
        relative
        flex
        min-h-[100svh]
        w-full

        items-center
        justify-center

        overflow-hidden

        bg-[#F5F5F5]

        px-6
        py-24

        md:px-12
      "
    >
      {/* Home logo */}
      <Link
        href="/"
        className="
          absolute
          left-6
          top-7

          z-10

          font-sora

          text-[14px]
          font-bold

          tracking-[0.2em]

          text-[#040404]

          transition-opacity
          hover:opacity-60

          md:left-12
          md:top-9
        "
      >
        THE DOT
      </Link>

      {/* Centered Hero */}
      <div
        className="
          mx-auto

          flex
          w-full
          max-w-[1120px]

          flex-col
          items-center
          justify-center

          text-center
        "
      >
        <h1
          ref={headlineRef}
          className="
            max-w-[1080px]

            font-sora

            text-[42px]
            font-bold

            leading-[0.98]
            tracking-[-0.055em]

            text-[#040404]

            sm:text-[52px]
            md:text-[60px]
            lg:text-[68px]
            xl:text-[72px]
          "
        >
          We turn{" "}
          <span
            className="
              font-instrument
              font-normal
              italic

              tracking-[-0.035em]
            "
          >
            business problems
          </span>{" "}
          into digital experiences people choose.
        </h1>

        <Link
          ref={ctaRef}
          href="/book-a-call"
          className="
            group

            mt-12

            inline-flex
            min-h-[74px]
            min-w-[210px]

            items-center
            justify-between

            gap-8

            border
            border-[#040404]/65

            px-7
            py-5

            font-sora

            text-[13px]
            font-semibold

            uppercase
            tracking-[0.16em]

            text-[#040404]

            transition-all
            duration-300

            hover:bg-[#040404]
            hover:text-white

            md:mt-14
          "
        >
          <span>Contact Us</span>

          <span
            aria-hidden="true"
            className="
              text-[18px]

              transition-transform
              duration-300

              group-hover:translate-x-1
              group-hover:-translate-y-1
            "
          >
            ↗
          </span>
        </Link>
      </div>
    </section>
  );
}