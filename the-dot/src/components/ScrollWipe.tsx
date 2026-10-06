"use client";

import { useState } from "react";
import Image from "next/image";

export function ScrollWipe() {
  const [activeIndex, setActiveIndex] = useState(0);

  const reasons = [
    {
      index: "01 / 03",
      title: "We start with the problem.",
      subtitle: "Not the interface.",
      image: "/images/why-problem.jpg",
    },
    {
      index: "02 / 03",
      title: "Strategy and execution stay connected.",
      subtitle: "No hand-offs, no dilution.",
      image: "/images/why-strategy.jpg",
    },
    {
      index: "03 / 03",
      title: "We design for what happens after launch.",
      subtitle: "Built for scaling and real business impact.",
      image: "/images/why-launch.jpg",
    },
  ];

  const current = reasons[activeIndex];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % reasons.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + reasons.length) % reasons.length);
  };

  return (
    <div className="relative w-full bg-[#F7F8F8] rounded-[32px] md:rounded-[40px] p-6 md:p-12 lg:p-14 border border-[#E5E6E9] shadow-xs overflow-hidden min-h-[420px] md:min-h-[500px] flex flex-col justify-between">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full my-auto">
        
        {/* Left Column: Index, Headline, Subtitle, Step Indicators */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-8 z-10">
          <div className="space-y-6">
            <span className="font-sora text-[15px] md:text-[18px] font-medium text-[#818084]">
              {current.index}
            </span>

            <h2 className="font-sora text-[36px] sm:text-[46px] lg:text-[54px] font-bold text-[#040404] leading-[1.05] tracking-tight">
              {current.title}
            </h2>

            <p className="font-sora text-[16px] md:text-[18px] font-normal text-[#818084]">
              {current.subtitle}
            </p>
          </div>

          {/* 3 Step Indicator dashes matching reference image */}
          <div className="flex items-center gap-2 pt-4">
            {reasons.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === activeIndex
                    ? "w-8 bg-[#040404]"
                    : "w-4 bg-[#818084]/30 hover:bg-[#818084]/60"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Visual Mask Wipe Image + Circular Arrow Controls */}
        <div className="lg:col-span-6 relative w-full aspect-[4/3] rounded-[24px] overflow-hidden shadow-lg border border-black/5" data-cursor="hover">
          <Image
            src={current.image}
            alt={current.title}
            fill
            className="object-cover transition-opacity duration-500 ease-out"
            sizes="(max-width: 1024px) 100vw, 600px"
            priority
          />

          {/* Organic curved shape mask recreating the exact cutout visual in the template */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-[#F7F8F8] rounded-br-[80px] pointer-events-none hidden lg:block" />

          {/* Circular Arrow Navigation Controls matching template */}
          <div className="absolute bottom-6 right-6 flex items-center gap-3 z-20">
            <button
              onClick={handlePrev}
              className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-all border border-white/20"
              aria-label="Previous reason"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="w-12 h-12 rounded-full bg-black/70 backdrop-blur-md text-white flex items-center justify-center hover:bg-black transition-all border border-white/30 shadow-md"
              aria-label="Next reason"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
