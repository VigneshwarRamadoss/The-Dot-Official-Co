"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import { WorkStack } from "./WorkStack";
import type { WorkProject } from "./WorkCard";

export function SelectedWork() {
  const [headerVisible, setHeaderVisible] =
    useState(false);

  const sampleProjects: WorkProject[] = [
    {
      slug: "orbit-studio",
      client: "Orbit Studio",
      title: "Orbit Studio",
      tags: ["Brand", "Web Design"],
      image: "/images/work-interior.jpg",
      number: "01",
      summary:
        "A brand and digital experience designed to translate Orbit Studio's physical design philosophy into a more distinctive and internationally credible online presence.",
    },
    {
      slug: "swastik-corporation",
      client: "Swastik Corporation",
      title: "Swastik Corporation",
      tags: [
        "ERP",
        "Product Design",
        "Web App",
      ],
      image: "/images/work-office.jpg",
      number: "02",
      summary:
        "A unified enterprise product experience created to simplify complex operations, improve visibility and reduce friction across everyday workflows.",
    },
    {
      slug: "skydic-outdoor",
      client: "Skydic Outdoor",
      title: "Skydic Outdoor Showcase",
      tags: [
        "Design System",
        "Product",
      ],
      image: "/images/work-tower.jpg",
      number: "03",
      summary:
        "A scalable digital system that gives the brand a consistent product language across interfaces, platforms and future digital touchpoints.",
    },
  ];

  /* =========================================================
     WORK INTRO HEADER

     NavigationTrigger controls the opening mascot journey.

     When DOT reaches its left-centre position:
       dot:work-header-show

     When leaving Work:
       dot:work-reset
     ========================================================= */

  useEffect(() => {
    const showHeader = () => {
      setHeaderVisible(true);
    };

    const resetHeader = () => {
      setHeaderVisible(false);
    };

    window.addEventListener(
      "dot:work-header-show",
      showHeader
    );

    window.addEventListener(
      "dot:work-reset",
      resetHeader
    );

    return () => {
      window.removeEventListener(
        "dot:work-header-show",
        showHeader
      );

      window.removeEventListener(
        "dot:work-reset",
        resetHeader
      );
    };
  }, []);

  return (
    <section
      id="work"
      className="
        relative
        h-[100svh]
        min-h-[720px]
        w-full
        overflow-hidden
        bg-white
        px-4
        py-9
        md:px-8
        md:py-11
        xl:py-12
      "
    >
      <div
        className="
          mx-auto
          flex
          h-full
          w-full
          max-w-[1440px]
          flex-col
        "
      >
        {/* =================================================
            HEADER

            Hidden until DOT finishes:
            NAV → CENTRE → LEFT-CENTRE
           ================================================= */}

        <div
          className="
            relative
            z-20
            flex
            shrink-0
            items-start
            justify-between
            gap-8
            transition-[opacity,transform]
            duration-700
            ease-[cubic-bezier(.16,1,.3,1)]
          "
          style={{
            opacity:
              headerVisible
                ? 1
                : 0,

            transform:
              headerVisible
                ? "translateY(0px)"
                : "translateY(14px)",

            pointerEvents:
              headerVisible
                ? "auto"
                : "none",
          }}
        >
          <div>
            <p
              className="
                font-sora
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.22em]
                text-black/38
                md:text-[11px]
              "
            >
              Selected work
            </p>

            <h2
              className="
                mt-2.5
                font-sora
                text-[34px]
                font-bold
                leading-[0.95]
                tracking-[-0.055em]
                text-[#181818]
                sm:text-[40px]
                md:text-[48px]
                xl:text-[52px]
              "
            >
              Featured Case Studies
            </h2>
          </div>

          <Link
            href="/work"
            className="
              group
              mt-1
              hidden
              items-center
              gap-2
              font-sora
              text-[12px]
              font-medium
              text-black/42
              transition-colors
              duration-300
              hover:text-black
              md:flex
            "
          >
            All projects

            <span
              className="
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            >
              →
            </span>
          </Link>
        </div>

        {/* =================================================
            WORK STAGE
           ================================================= */}

        <div
          className="
            min-h-0
            flex-1
          "
        >
          <WorkStack
            projects={sampleProjects}
          />
        </div>

        {/* MOBILE CTA */}

        <div
          className="
            mt-4
            shrink-0
            md:hidden
          "
          style={{
            opacity:
              headerVisible
                ? 1
                : 0,
          }}
        >
          <Link
            href="/work"
            className="
              inline-flex
              items-center
              gap-2
              font-sora
              text-[13px]
              font-semibold
              text-black/55
            "
          >
            All projects
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}