"use client";

import Image from "next/image";
import Link from "next/link";

/* =========================================================
   PROJECT TYPE
   ========================================================= */

export interface WorkProject {
  slug: string;
  client: string;
  title: string;
  tags: string[];
  image: string;
  number: string;

  /*
   * Used by WorkStack for the
   * right-side project description.
   */
  summary?: string;
}

/* =========================================================
   CARD PROPS
   ========================================================= */

interface WorkCardProps {
  project: WorkProject;

  position:
    | "left"
    | "center"
    | "right";

  isActive?: boolean;
}

/* =========================================================
   WORK CARD
   ========================================================= */

export function WorkCard({
  project,
  position,
  isActive = false,
}: WorkCardProps) {
  const transformStyles = {
    left:
      "rotate-y-[18deg] -rotate-z-[4deg] translate-x-[-15%] scale-90 opacity-80 shadow-2xl hover:opacity-100 hover:scale-95",

    center:
      "rotate-y-0 rotate-z-0 translate-x-0 scale-100 opacity-100 shadow-2xl z-20 hover:scale-[1.02]",

    right:
      "rotate-y-[-18deg] rotate-z-[4deg] translate-x-[15%] scale-90 opacity-80 shadow-2xl hover:opacity-100 hover:scale-95",
  };

  return (
    <Link
      href={`/work/${project.slug}`}
      data-cursor="view"
      data-cursor-text="VIEW"
      className={`
        group
        relative

        flex
        aspect-[4/3]

        w-full
        max-w-[460px]

        cursor-pointer

        flex-col
        justify-between

        overflow-hidden

        rounded-[28px]

        border
        border-white/15

        bg-[#0C0E10]

        p-6

        transition-all
        duration-500
        ease-out

        md:p-8

        ${transformStyles[position]}

        ${
          isActive
            ? "z-20"
            : ""
        }
      `}
    >
      {/* IMAGE */}

      <Image
        src={project.image}
        alt={project.title}
        fill
        className="
          object-cover

          transition-transform

          duration-700
          ease-out

          group-hover:scale-105
        "
        sizes="460px"
      />

      {/* OVERLAY */}

      <div
        className="
          pointer-events-none

          absolute
          inset-0

          bg-gradient-to-t

          from-black/80
          via-black/30
          to-black/20
        "
      />

      {/* PROJECT NUMBER */}

      <div
        className="
          relative
          z-10

          flex
          items-center
          justify-between
        "
      >
        <span
          className="
            font-sora

            text-[13px]
            font-medium

            tracking-widest

            text-white/70
          "
        >
          {project.number}
        </span>
      </div>

      {/* CONTENT */}

      <div
        className="
          relative
          z-10

          space-y-4
        "
      >
        <h3
          className="
            font-sora

            text-[28px]
            font-bold

            leading-tight
            tracking-tight

            text-white

            md:text-[34px]
          "
        >
          {project.title}
        </h3>

        <div
          className="
            flex
            items-center
            justify-between

            pt-2
          "
        >
          {/* TAGS */}

          <div
            className="
              flex
              flex-wrap

              items-center

              gap-2
            "
          >
            {project.tags.map(
              (
                tag,
                index
              ) => (
                <span
                  key={`${tag}-${index}`}
                  className="
                    rounded-full

                    border
                    border-white/10

                    bg-white/15

                    px-3
                    py-1

                    font-sora

                    text-[11px]
                    font-medium

                    text-white/90

                    backdrop-blur-md
                  "
                >
                  {tag}
                </span>
              )
            )}
          </div>

          {/* ARROW */}

          <div
            className="
              flex

              h-10
              w-10

              shrink-0

              items-center
              justify-center

              rounded-full

              border
              border-white/20

              bg-white/20

              text-white

              backdrop-blur-md

              transition-all
              duration-300

              group-hover:scale-110
              group-hover:bg-white
              group-hover:text-black
            "
          >
            <svg
              className="
                h-4
                w-4
              "
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0-7 7m7-7H3"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}