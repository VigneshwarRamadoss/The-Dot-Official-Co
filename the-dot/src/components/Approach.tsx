"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Approach() {
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  const steps = [
    {
      num: "01",
      title: "Understand",
      desc: "Business + customer + problem",
    },
    {
      num: "02",
      title: "Define",
      desc: "Opportunity + strategy",
    },
    {
      num: "03",
      title: "Build",
      desc: "Brand + product + experience",
    },
    {
      num: "04",
      title: "Learn",
      desc: "Launch + observe + improve",
    },
  ];

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !pathRef.current) return;

    const ctx = gsap.context(() => {
      const pathLength = pathRef.current?.getTotalLength() || 1000;

      gsap.set(pathRef.current, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      });

      gsap.to(pathRef.current, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 72%",
          end: "bottom 52%",
          scrub: 0.8,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="approach"
      ref={sectionRef}
      className="mx-auto max-w-[1440px] px-4 py-12 md:px-8 md:py-20"
    >
      <div className="relative overflow-hidden rounded-[32px] border border-[#22252A] bg-[#0E1212] p-8 text-white shadow-2xl md:rounded-[40px] md:p-16">
        <div className="mb-12">
          <span className="font-sora text-[12px] font-medium uppercase tracking-widest text-[#9F9FA2]">
            Approach
          </span>
          <h2 className="mt-1 font-sora text-[28px] font-bold tracking-tight text-white md:text-[36px]">
            How we partner
          </h2>
        </div>

        <div className="relative w-full py-12 md:py-20">
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 1000 200"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              d="M 50 100 Q 250 20 400 130 T 750 70 T 950 110"
              stroke="#22252A"
              strokeWidth="2"
              fill="none"
            />
            <path
              ref={pathRef}
              d="M 50 100 Q 250 20 400 130 T 750 70 T 950 110"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </svg>

          <div className="relative z-10 grid grid-cols-1 gap-8 sm:grid-cols-2 md:gap-4 lg:grid-cols-4">
            {steps.map((step) => (
              <div
                key={step.num}
                className="flex flex-col space-y-2 rounded-2xl p-4 transition-all duration-300 hover:bg-white/5 lg:pt-16"
              >
                <div className="mb-4 h-3.5 w-3.5 rounded-full border-2 border-[#0E1212] bg-white shadow-sm" />
                <span className="font-sora text-[20px] font-bold text-white md:text-[24px]">
                  {step.num}
                </span>
                <h3 className="font-sora text-[18px] font-bold text-white md:text-[20px]">
                  {step.title}
                </h3>
                <p className="font-sora text-[13px] leading-relaxed text-[#9F9FA2] md:text-[14px]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
