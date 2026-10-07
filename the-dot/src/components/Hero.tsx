"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Button } from "./Button";
import { HeroWheel } from "./HeroWheel";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        headlineRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.0, delay: 0.2 }
      )
        .fromTo(
          bodyRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.6"
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.5"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-[100svh] pt-20 pb-8 md:pt-24 md:pb-12 px-4 md:px-8 max-w-[1440px] mx-auto flex flex-col justify-center overflow-hidden"
    >
      {/* Outer rounded card frame container matching reference composition */}
      <div className="bg-[#F1F2F2] rounded-[32px] md:rounded-[40px] p-6 md:p-12 lg:p-14 border border-[#E5E6E9]/80 shadow-xs relative overflow-hidden flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto">
          
          {/* Left Text Column (approx 50% width) */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6 md:space-y-8 z-10">
            <h1
              ref={headlineRef}
              className="font-sora text-[42px] sm:text-[56px] lg:text-[72px] font-bold leading-[0.95] tracking-tight text-[#040404]"
            >
              Ideas <br />
              <span>into impact</span>
              {/* Accent dot matching template */}
              <span className="inline-block w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-[#444D67] ml-2 align-baseline shadow-xs" />
            </h1>

            <p
              ref={bodyRef}
              className="font-sora text-[15px] sm:text-[17px] md:text-[18px] font-normal text-[#505354] max-w-[480px] leading-relaxed"
            >
              We design and build digital products for ambitious businesses.
            </p>

            <div
              ref={ctaRef}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <Button href="/book-a-call" variant="primary" showArrow={false}>
                Book a discovery call
              </Button>
              <Button href="/work" variant="secondary" showArrow={true}>
                Explore work
              </Button>
            </div>
          </div>

          {/* Right Visual Orbit Wheel Column (approx 50% width) */}
          <div className="lg:col-span-6 w-full flex items-center justify-center">
            <HeroWheel />
          </div>

        </div>
      </div>
    </section>
  );
}
