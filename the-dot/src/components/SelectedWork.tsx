"use client";

import Link from "next/link";

import { WorkStack } from "./WorkStack";
import type { WorkProject } from "./WorkCard";

export function SelectedWork() {
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

  return (
    <section
      id="work"
      className="
        relative

        w-full

        bg-white

        px-4
        py-16

        md:px-8
        md:py-20
      "
    >
      <div
        className="
          mx-auto

          w-full
          max-w-[1440px]
        "
      >
        {/* ===============================================
            HEADER

            No dark outer frame anymore.
           =============================================== */}

        <div
          className="
            mb-4

            flex
            items-start
            justify-between

            gap-8

            md:mb-6
          "
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
                mt-3

                font-sora

                text-[36px]
                font-bold

                leading-[0.95]

                tracking-[-0.055em]

                text-[#181818]

                sm:text-[44px]

                md:text-[54px]
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

              text-[13px]
              font-medium

              text-black/48

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

        {/* ===============================================
            CUBE + DETAILS
           =============================================== */}

        <WorkStack
          projects={sampleProjects}
        />

        {/* MOBILE ALL PROJECTS */}

        <div className="mt-6 md:hidden">
          <Link
            href="/work"
            className="
              inline-flex
              items-center
              gap-2

              font-sora

              text-[14px]
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