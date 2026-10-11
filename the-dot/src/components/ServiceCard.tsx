"use client";

import {
  motion,
} from "motion/react";

export type ServiceArtworkType =
  | "brand"
  | "experience"
  | "product"
  | "growth";

interface ServiceCardProps {
  index: number;

  title: string;

  shortTitle: string;

  description: string;

  items: string[];

  isDark?: boolean;

  artworkType:
    ServiceArtworkType;

  relativeIndex: number;

  isActive: boolean;

  onClick: () => void;
}

/* =========================================================
   CAROUSEL GEOMETRY

              LEFT        ACTIVE       RIGHT

               ╲             │           ╱
                ╲            │          ╱
                 ╲           │         ╱

   Side cards face inward toward active card.
   ========================================================= */

function getCardPosition(
  relativeIndex: number
) {
  /* ACTIVE */

  if (
    relativeIndex === 0
  ) {
    return {
      x: "0%",

      y: 0,

      scale: 1,

      rotateY: 0,

      rotateZ: 0,

      opacity: 1,

      zIndex: 30,
    };
  }

  /* LEFT */

  if (
    relativeIndex === -1
  ) {
    return {
      x: "-79%",

      y: 10,

      scale: 0.84,

      rotateY: 19,

      rotateZ: 1.8,

      opacity: 0.48,

      zIndex: 20,
    };
  }

  /* RIGHT */

  if (
    relativeIndex === 1
  ) {
    return {
      x: "79%",

      y: 10,

      scale: 0.84,

      rotateY: -19,

      rotateZ: -1.8,

      opacity: 0.48,

      zIndex: 20,
    };
  }

  /* FAR LEFT */

  if (
    relativeIndex < -1
  ) {
    return {
      x: "-126%",

      y: 18,

      scale: 0.68,

      rotateY: 26,

      rotateZ: 2.4,

      opacity: 0,

      zIndex: 5,
    };
  }

  /* FAR RIGHT */

  return {
    x: "126%",

    y: 18,

    scale: 0.68,

    rotateY: -26,

    rotateZ: -2.4,

    opacity: 0,

    zIndex: 5,
  };
}

export function ServiceCard({
  index,
  title,
  description,
  items,
  artworkType,
  relativeIndex,
  isActive,
  onClick,
}: ServiceCardProps) {
  const state =
    getCardPosition(
      relativeIndex
    );

  return (
    <motion.button
      type="button"

      onClick={
        onClick
      }

      initial={false}

      animate={{
        x:
          state.x,

        y:
          state.y,

        scale:
          state.scale,

        rotateY:
          state.rotateY,

        rotateZ:
          state.rotateZ,

        opacity:
          state.opacity,

        transformPerspective:
          1100,
      }}

      transition={{
        type:
          "spring",

        stiffness:
          105,

        damping:
          22,

        mass:
          0.9,
      }}

      className="
        absolute

        left-1/2
        top-1/2

        h-[clamp(360px,52svh,500px)]

        w-[76vw]
        max-w-[560px]

        -translate-x-1/2
        -translate-y-1/2

        overflow-hidden

        rounded-[22px]

        text-left

        outline-none

        [backface-visibility:hidden]
        [transform-style:preserve-3d]

        sm:w-[62vw]

        md:w-[48vw]

        lg:w-[39vw]
        lg:max-w-[560px]

        xl:w-[38vw]
      "

      style={{
        zIndex:
          state.zIndex,

        pointerEvents:
          Math.abs(
            relativeIndex
          ) <= 1
            ? "auto"
            : "none",

        boxShadow:
          isActive
            ? "0 28px 70px rgba(0,0,0,0.14)"
            : "0 20px 45px rgba(0,0,0,0.07)",

        transformOrigin:
          relativeIndex < 0
            ? "right center"
            : relativeIndex > 0
            ? "left center"
            : "center center",
      }}
    >
      {/* =================================================
          VISUAL
         ================================================= */}

      <div
        className="
          absolute
          inset-0
        "
      >
        <ServiceVisual
          type={
            artworkType
          }

          active={
            isActive
          }
        />
      </div>

      {/* =================================================
          SIDE WASH
         ================================================= */}

      <motion.div
        className="
          pointer-events-none

          absolute
          inset-0

          z-10

          bg-[#F8F7F4]
        "

        animate={{
          opacity:
            isActive
              ? 0
              : 0.42,
        }}

        transition={{
          duration:
            0.45,
        }}
      />

      {/* =================================================
          BOTTOM GRADIENT
         ================================================= */}

      <div
        className="
          pointer-events-none

          absolute

          inset-x-0
          bottom-0

          z-20

          h-[58%]

          bg-gradient-to-t

          from-black/85
          via-black/35
          to-transparent
        "
      />

      {/* =================================================
          NUMBER
         ================================================= */}

      <div
        className="
          absolute

          left-5
          top-5

          z-30

          font-sora

          text-[8px]
          font-semibold

          tracking-[0.2em]

          text-white/55

          md:left-6
          md:top-6
        "
      >
        {String(
          index + 1
        ).padStart(
          2,
          "0"
        )}
      </div>

      {/* =================================================
          CONTENT
         ================================================= */}

      <div
        className="
          absolute

          bottom-0
          left-0
          right-0

          z-30

          p-5

          text-white

          md:p-7
        "
      >
        <h3
          className="
            max-w-[390px]

            font-sora

            text-[25px]
            font-semibold

            leading-[1]

            tracking-[-0.045em]

            sm:text-[28px]

            md:text-[31px]

            xl:text-[34px]
          "
        >
          {title}
        </h3>

        <p
          className="
            mt-2.5

            max-w-[370px]

            font-sora

            text-[11px]

            leading-[1.55]

            text-white/65

            md:text-[12px]

            xl:text-[13px]
          "
        >
          {description}
        </p>

        {/* ITEMS */}

        <div
          className="
            mt-4

            flex

            flex-wrap

            gap-x-2.5
            gap-y-1.5
          "
        >
          {items.map(
            (
              item,
              itemIndex
            ) => (
              <span
                key={
                  item
                }

                className="
                  font-sora

                  text-[8px]
                  font-semibold

                  uppercase

                  tracking-[0.1em]

                  text-white/42

                  md:text-[9px]
                "
              >
                {item}

                {itemIndex <
                  items.length -
                    1 && (
                  <span
                    className="
                      ml-2.5

                      text-white/18
                    "
                  >
                    /
                  </span>
                )}
              </span>
            )
          )}
        </div>

        {/* =================================================
            ACTIVE ARROW
           ================================================= */}

        <motion.div
          animate={{
            opacity:
              isActive
                ? 1
                : 0,

            scale:
              isActive
                ? 1
                : 0.75,
          }}

          transition={{
            duration:
              0.35,
          }}

          className="
            absolute

            bottom-5
            right-5

            grid

            h-10
            w-10

            place-items-center

            rounded-full

            border
            border-white/50

            text-white

            backdrop-blur-sm

            md:bottom-7
            md:right-7

            md:h-12
            md:w-12
          "
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="
              h-4
              w-4

              md:h-5
              md:w-5
            "
          >
            <path
              d="M5 12H19M14 7L19 12L14 17"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </div>
    </motion.button>
  );
}

/* =========================================================
   VISUALS
   ========================================================= */

interface ServiceVisualProps {
  type:
    ServiceArtworkType;

  active:
    boolean;
}

function ServiceVisual({
  type,
  active,
}: ServiceVisualProps) {
  /* =======================================================
     BRAND
     ======================================================= */

  if (
    type === "brand"
  ) {
    return (
      <div
        className="
          absolute
          inset-0

          overflow-hidden

          bg-[#D8D0C5]
        "
      >
        <div
          className="
            absolute

            -left-[10%]
            top-[6%]

            h-[62%]
            w-[80%]

            rotate-[-8deg]

            rounded-[22px]

            bg-[#F2EEE7]

            shadow-[0_30px_80px_rgba(0,0,0,0.12)]
          "
        />

        <div
          className="
            absolute

            right-[5%]
            top-[23%]

            h-[54%]
            w-[66%]

            rotate-[7deg]

            rounded-[18px]

            bg-[#B5AA9B]

            shadow-[0_25px_65px_rgba(0,0,0,0.12)]
          "
        />

        <div
          className="
            absolute

            left-[18%]
            top-[25%]

            font-sora

            text-[20px]
            font-semibold

            tracking-[0.2em]

            text-black/38

            md:text-[25px]
          "
        >
          BRAND
        </div>

        <div
          className="
            absolute
            inset-0

            bg-gradient-to-br

            from-white/20
            via-transparent
            to-black/[0.08]
          "
        />
      </div>
    );
  }

  /* =======================================================
     DIGITAL EXPERIENCE
     ======================================================= */

  if (
    type ===
    "experience"
  ) {
    return (
      <div
        className="
          absolute
          inset-0

          overflow-hidden

          bg-[#B8AA98]
        "
      >
        <div
          className="
            absolute

            -right-[15%]
            -top-[18%]

            h-[70%]
            w-[70%]

            rounded-full

            bg-[#E8D6BA]/70

            blur-[65px]
          "
        />

        <div
          className="
            absolute

            bottom-[8%]
            left-[-10%]

            h-[28%]
            w-[120%]

            rotate-[-2deg]

            bg-[#4F443A]
          "
        />

        <motion.div
          animate={{
            y:
              active
                ? 0
                : 7,

            scale:
              active
                ? 1
                : 0.96,
          }}

          transition={{
            duration:
              0.65,

            ease: [
              0.16,
              1,
              0.3,
              1,
            ],
          }}

          className="
            absolute

            left-[19%]
            top-[15%]

            h-[55%]
            w-[65%]

            rounded-[14px]

            border-[6px]
            border-[#171717]

            bg-[#F4F0E8]

            shadow-[0_30px_60px_rgba(0,0,0,0.25)]
          "
        >
          <div
            className="
              flex

              h-full

              flex-col

              p-[9%]
            "
          >
            <div
              className="
                flex

                items-center
                justify-between
              "
            >
              <span
                className="
                  h-[4px]
                  w-[14%]

                  rounded-full

                  bg-black/15
                "
              />

              <div
                className="
                  flex

                  gap-1.5
                "
              >
                <span className="h-[3px] w-4 rounded-full bg-black/10" />
                <span className="h-[3px] w-4 rounded-full bg-black/10" />
                <span className="h-[3px] w-4 rounded-full bg-black/10" />
              </div>
            </div>

            <div
              className="
                mt-[15%]

                grid

                flex-1

                grid-cols-[0.9fr_1.1fr]

                gap-[8%]
              "
            >
              <div>
                <p
                  className="
                    font-serif

                    text-[18px]

                    leading-[0.92]

                    text-black/80

                    md:text-[24px]
                  "
                >
                  Digital
                  <br />
                  Experiences
                  <br />
                  That Matter
                </p>

                <span
                  className="
                    mt-4

                    block

                    h-6
                    w-[65%]

                    rounded-full

                    bg-black/85
                  "
                />
              </div>

              <div
                className="
                  rounded-[9px]

                  bg-[#AAB4B1]
                "
              />
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  /* =======================================================
     PRODUCT
     ======================================================= */

  if (
    type === "product"
  ) {
    return (
      <div
        className="
          absolute
          inset-0

          overflow-hidden

          bg-[#D9D8D2]
        "
      >
        <div
          className="
            absolute

            left-[8%]
            top-[12%]

            h-[70%]
            w-[84%]

            rounded-[26px]

            bg-[#EEEEEA]

            shadow-[0_24px_60px_rgba(0,0,0,0.11)]
          "
        />

        <div
          className="
            absolute

            left-[18%]
            top-[23%]

            h-[45%]
            w-[30%]

            rounded-[20px]

            bg-white

            shadow-[0_15px_35px_rgba(0,0,0,0.08)]
          "
        />

        <motion.div
          animate={{
            y:
              active
                ? -4
                : 0,
          }}

          transition={{
            duration:
              0.65,

            ease: [
              0.16,
              1,
              0.3,
              1,
            ],
          }}

          className="
            absolute

            right-[17%]
            top-[28%]

            grid

            h-[96px]
            w-[96px]

            place-items-center

            rounded-[24px]

            bg-[#1C1C1C]

            text-white

            shadow-[0_20px_45px_rgba(0,0,0,0.16)]

            md:h-[110px]
            md:w-[110px]
          "
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="
              h-8
              w-8
            "
          >
            <path
              d="M8 5L18 12L8 19V5Z"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </div>
    );
  }

  /* =======================================================
     GROWTH
     ======================================================= */

  return (
    <div
      className="
        absolute
        inset-0

        overflow-hidden

        bg-[#D7D7D1]
      "
    >
      <div
        className="
          absolute

          left-[17%]
          top-[11%]

          h-[72%]
          w-[64%]

          rotate-[6deg]

          rounded-[34px]

          bg-[#EFEFEA]

          shadow-[0_24px_60px_rgba(0,0,0,0.12)]
        "
      />

      <div
        className="
          absolute

          left-[24%]
          top-[23%]

          h-[48%]
          w-[50%]

          rounded-[22px]

          bg-[#FAFAF7]

          p-5
        "
      >
        <div
          className="
            flex

            items-center
            justify-between
          "
        >
          <span
            className="
              font-sora

              text-[8px]
              font-semibold

              uppercase

              tracking-[0.12em]

              text-black/30
            "
          >
            Analytics
          </span>

          <span
            className="
              rounded-full

              bg-black/[0.06]

              px-2
              py-1

              font-sora

              text-[7px]

              text-black/45
            "
          >
            +12%
          </span>
        </div>

        <svg
          viewBox="0 0 200 100"
          fill="none"
          className="
            mt-6

            h-[75px]
            w-full
          "
        >
          <motion.path
            d="
              M5 82
              C28 79 35 60 53 61
              C73 61 76 72 94 58
              C115 41 125 56 145 34
              C162 16 177 22 195 8
            "

            stroke="#181818"

            strokeWidth="3"

            strokeLinecap="round"

            initial={{
              pathLength: 0,
            }}

            animate={{
              pathLength:
                active
                  ? 1
                  : 0.65,
            }}

            transition={{
              duration:
                1,

              ease:
                "easeOut",
            }}
          />
        </svg>
      </div>
    </div>
  );
}