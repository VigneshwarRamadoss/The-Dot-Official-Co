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
      x: 15,
      y: 45,
    },
    {
      num: "02",
      title: "Define",
      desc: "Opportunity + strategy",
      x: 38,
      y: 65,
    },
    {
      num: "03",
      title: "Build",
      desc: "Brand + product + experience",
      x: 62,
      y: 35,
    },
    {
      num: "04",
      title: "Learn",
      desc: "Launch + observe + improve",
      x: 85,
      y: 55,
    },
  ];

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
          start: "top 70%",
          end: "bottom 50%",
          scrub: 0.8,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-12 md:py-20 px-4 md:px-8 max-w-[1440px] mx-auto"
    >
      <div className="bg-[#0E1212] rounded-[32px] md:rounded-[40px] p-8 md:p-16 border border-[#22252A] shadow-2xl relative overflow-hidden text-white">
        
        {/* Section Heading */}
        <div className="mb-12">
          <span className="font-sora text-[12px] font-medium tracking-widest text-[#9F9FA2] uppercase">
            05 / Approach
          </span>
          <h2 className="font-sora text-[28px] md:text-[36px] font-bold tracking-tight text-white mt-1">
            How we partner
          </h2>
        </div>

        {/* Interactive Sine Wave Line Container */}
        <div className="relative w-full py-12 md:py-20">
          {/* Connecting SVG Sine-wave Line matching visual reference image */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 1000 200"
            preserveAspectRatio="none"
            fill="none"
          >
            {/* Background static faint guide path */}
            <path
              d="M 50 100 Q 250 20 400 130 T 750 70 T 950 110"
              stroke="#22252A"
              strokeWidth="2"
              fill="none"
            />
            {/* Animated drawing path */}
            <path
              ref={pathRef}
              d="M 50 100 Q 250 20 400 130 T 750 70 T 950 110"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </svg>

          {/* 4 Process Step Nodes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-4 relative z-10">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="flex flex-col space-y-2 lg:pt-16 p-4 rounded-2xl transition-all duration-300 hover:bg-white/5"
              >
                {/* Node Dot Marker matching reference */}
                <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-[#0E1212] shadow-sm mb-4" />

                <span className="font-sora text-[20px] md:text-[24px] font-bold text-white">
                  {step.num}
                </span>
                <h3 className="font-sora text-[18px] md:text-[20px] font-bold text-white">
                  {step.title}
                </h3>
                <p className="font-sora text-[13px] md:text-[14px] text-[#9F9FA2] leading-relaxed">
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
