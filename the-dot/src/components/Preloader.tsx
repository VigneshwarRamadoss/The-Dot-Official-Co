"use client";

import {
  useEffect,
  useRef,
} from "react";

import gsap from "gsap";

import { ParticleLogo } from "./ParticleLogo";

interface PreloaderProps {
  onComplete: () => void;
}

interface PixelDistance {
  element: SVGRectElement;
  distance: number;
}

export function Preloader({
  onComplete,
}: PreloaderProps) {
  const rootRef =
    useRef<HTMLDivElement>(null);

  const contentRef =
    useRef<HTMLDivElement>(null);

  const wordmarkRef =
    useRef<HTMLDivElement>(null);

  const completedRef =
    useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    const content = contentRef.current;
    const wordmark = wordmarkRef.current;

    if (
      !root ||
      !content ||
      !wordmark
    ) {
      return;
    }

    const pixels = Array.from(
      content.querySelectorAll<SVGRectElement>(
        "[data-logo-pixel]"
      )
    );

    if (!pixels.length) {
      onComplete();
      return;
    }

    const reduced =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

    document.documentElement.classList.add(
      "is-preloading"
    );

    const finish = () => {
      if (
        completedRef.current
      ) {
        return;
      }

      completedRef.current = true;

      document.documentElement.classList.remove(
        "is-preloading"
      );

      onComplete();
    };

    /*
     * ParticleLogo:
     * viewBox="0 0 1095 1095"
     */

    const centerX = 547.5;
    const centerY = 547.5;

    const pixelDistances:
      PixelDistance[] =
      pixels.map((pixel) => {
        const x = Number(
          pixel.getAttribute("x") ?? 0
        );

        const y = Number(
          pixel.getAttribute("y") ?? 0
        );

        const width = Number(
          pixel.getAttribute("width") ?? 0
        );

        const height = Number(
          pixel.getAttribute("height") ?? 0
        );

        const pixelCenterX =
          x + width / 2;

        const pixelCenterY =
          y + height / 2;

        return {
          element: pixel,

          distance: Math.hypot(
            pixelCenterX - centerX,
            pixelCenterY - centerY
          ),
        };
      });

    /*
     * OUTER → CENTRE
     */

    pixelDistances.sort(
      (a, b) =>
        b.distance - a.distance
    );

    /*
     * Build calm concentric rings.
     */

    const ringCount = 6;

    const rings: SVGRectElement[][] =
      Array.from(
        {
          length: ringCount,
        },
        () => []
      );

    const distances =
      pixelDistances.map(
        (pixel) => pixel.distance
      );

    const maxDistance =
      Math.max(...distances);

    const minDistance =
      Math.min(...distances);

    pixelDistances.forEach(
      ({
        element,
        distance,
      }) => {
        const normalized =
          maxDistance === minDistance
            ? 0
            : (maxDistance - distance) /
              (maxDistance - minDistance);

        const ringIndex =
          Math.min(
            ringCount - 1,
            Math.floor(
              normalized * ringCount
            )
          );

        rings[ringIndex].push(
          element
        );
      }
    );

    const activeRings =
      rings.filter(
        (ring) =>
          ring.length > 0
      );

    const ctx = gsap.context(
      () => {
        /*
         * ===============================================
         * REDUCED MOTION
         * ===============================================
         */

        if (reduced) {
          gsap.set(root, {
            opacity: 1,

            clipPath:
              "inset(0% 0% 0% 0%)",
          });

          gsap.set(content, {
            opacity: 0,

            scale: 0.9,

            transformOrigin:
              "50% 50%",
          });

          gsap.set(wordmark, {
            opacity: 1,
            y: 0,
          });

          gsap.set(pixels, {
            opacity: 1,
          });

          const reducedTimeline =
            gsap.timeline({
              onComplete: finish,
            });

          reducedTimeline.to(
            content,
            {
              opacity: 1,

              scale: 1,

              duration: 0.4,

              ease:
                "power2.out",
            }
          );

          reducedTimeline.to(
            {},
            {
              duration: 0.28,
            }
          );

          reducedTimeline.to(
            content,
            {
              opacity: 0,

              scale: 1.03,

              duration: 0.3,

              ease:
                "power2.inOut",
            }
          );

          reducedTimeline.to(
            root,
            {
              clipPath:
                "inset(0% 0% 100% 0%)",

              duration: 0.52,

              ease:
                "power3.inOut",
            },
            "-=0.15"
          );

          return;
        }

        /*
         * ===============================================
         * INITIAL STATE
         * ===============================================
         */

        gsap.set(root, {
          opacity: 1,

          clipPath:
            "inset(0% 0% 0% 0%)",
        });

        /*
         * Logo + THE DOT begin smaller.
         */

        gsap.set(content, {
          opacity: 0,

          scale: 0.68,

          transformOrigin:
            "50% 50%",
        });

        /*
         * Pixel geometry stays intact.
         */

        gsap.set(pixels, {
          opacity: 1,
        });

        /*
         * Company name enters after symbol.
         */

        gsap.set(wordmark, {
          opacity: 0,
          y: 6,
        });

        /*
         * ===============================================
         * MASTER TIMELINE
         * ===============================================
         */

        const timeline =
          gsap.timeline({
            onComplete: finish,
          });

        /*
         * 01 — SYMBOL APPEARS
         */

        timeline.to(content, {
          opacity: 1,

          duration: 0.42,

          ease:
            "power3.out",
        });

        /*
         * 02 — THE DOT APPEARS
         */

        timeline.to(
          wordmark,
          {
            opacity: 1,
            y: 0,

            duration: 0.36,

            ease:
              "power3.out",
          },
          "-=0.1"
        );

        /*
         * Short pause.
         */

        timeline.to(
          {},
          {
            duration: 0.12,
          }
        );

        timeline.addLabel(
          "waveStart"
        );

        /*
         * 03 — STEADY EXPANSION
         *
         * Logo + wordmark scale together
         * while the light wave moves inward.
         */

        timeline.to(
          content,
          {
            scale: 1.52,

            duration: 1.72,

            ease:
              "power1.inOut",
          },
          "waveStart"
        );

        /*
         * 04 — OUTER → CENTRE
         *
         * Whole concentric rings breathe
         * instead of random pixels.
         */

        activeRings.forEach(
          (
            ring,
            index
          ) => {
            const start =
              index * 0.24;

            /*
             * Dim.
             */

            timeline.to(
              ring,
              {
                opacity: 0.42,

                duration: 0.32,

                ease:
                  "sine.inOut",
              },
              `waveStart+=${start}`
            );

            /*
             * Restore.
             */

            timeline.to(
              ring,
              {
                opacity: 1,

                duration: 0.38,

                ease:
                  "sine.inOut",
              },
              `waveStart+=${start + 0.18}`
            );
          }
        );

        /*
         * Calculate when centre receives
         * the light wave.
         */

        const centerArrival =
          Math.max(
            0,

            (activeRings.length - 1) *
              0.24 +
              0.2
          );

        /*
         * 05 — CENTRE ARRIVAL = HERO REVEAL
         *
         * No final blink.
         * No pause.
         * No hard stop.
         */

        timeline.to(
          root,
          {
            clipPath:
              "inset(0% 0% 100% 0%)",

            duration: 0.84,

            ease:
              "power4.inOut",
          },
          `waveStart+=${centerArrival}`
        );

        /*
         * Continue moving gently toward
         * the viewer as the Hero appears.
         */

        timeline.to(
          content,
          {
            opacity: 0,

            scale: 1.62,

            duration: 0.6,

            ease:
              "power2.in",
          },
          `waveStart+=${centerArrival + 0.05}`
        );
      },
      root
    );

    return () => {
      ctx.revert();

      document.documentElement.classList.remove(
        "is-preloading"
      );
    };
  }, [onComplete]);

  return (
    <div
      ref={rootRef}
      data-preloader-root
      role="status"
      aria-label="Loading THE DOT"
      className="
        fixed
        inset-0

        z-[1000]

        flex

        items-center
        justify-center

        overflow-hidden

        bg-white
        text-brand
      "
    >
      <div
        ref={contentRef}
        data-preloader-logo
        className="
          flex

          flex-col

          items-center
          justify-center

          will-change-transform
        "
      >
        <div
          className="
            relative

            aspect-square

            w-[116px]

            sm:w-[132px]

            md:w-[148px]
          "
        >
          <ParticleLogo
            className="
              h-full
              w-full
            "
          />
        </div>

        <div
          ref={wordmarkRef}
          className="
            mt-5

            whitespace-nowrap

            font-sora

            text-[14px]
            font-semibold

            uppercase

            leading-none

            tracking-[0.3em]

            text-brand

            sm:mt-6
            sm:text-[15px]

            md:text-[16px]
          "
        >
          THE DOT
        </div>
      </div>

      <span className="sr-only">
        Loading THE DOT
      </span>
    </div>
  );
}