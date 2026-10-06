"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function GatefoldReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const centerImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Gatefold reveal animation on scroll entry
      gsap.fromTo(
        leftPanelRef.current,
        { xPercent: 10 },
        {
          xPercent: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            end: "top 30%",
            scrub: 0.8,
          },
        }
      );

      gsap.fromTo(
        rightPanelRef.current,
        { xPercent: -10 },
        {
          xPercent: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            end: "top 30%",
            scrub: 0.8,
          },
        }
      );

      gsap.fromTo(
        centerImageRef.current,
        { scale: 0.9, opacity: 0.8 },
        {
          scale: 1,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            end: "top 25%",
            scrub: 0.8,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-[28px] overflow-hidden bg-[#0B0C0D] min-h-[380px] md:min-h-[460px] grid grid-cols-1 lg:grid-cols-12 border border-[#22252A]"
    >
      {/* Left Gatefold Panel (Light Grey #E2E3E7) */}
      <div
        ref={leftPanelRef}
        className="lg:col-span-4 bg-[#E2E3E7] text-[#040404] p-8 md:p-12 flex flex-col justify-between relative border-r border-[#0B0C0D]/20 z-10"
      >
        {/* Left vertical subtle line */}
        <div className="absolute left-6 top-8 bottom-8 w-[1px] bg-[#040404]/10 hidden md:block" />

        <div className="md:pl-4 space-y-6">
          <h2 className="font-sora text-[32px] sm:text-[40px] lg:text-[48px] font-bold leading-[1.05] tracking-tight text-[#040404]">
            We don’t just <br />
            design screens.
          </h2>

          {/* Decorative process wireframe lines matching reference */}
          <div className="w-24 h-6 opacity-30 flex flex-col justify-between py-1">
            <div className="w-full h-[1px] bg-[#040404]" />
            <div className="w-3/4 h-[1px] bg-[#040404]" />
            <div className="w-1/2 h-[1px] bg-[#040404]" />
          </div>
        </div>

        <div className="md:pl-4 pt-8">
          <span className="font-sora text-[13px] font-medium text-[#818084]">01</span>
        </div>
      </div>

      {/* Center Gatefold Image Reveal Panel */}
      <div className="lg:col-span-4 relative overflow-hidden bg-[#0B0C0D] flex items-center justify-center min-h-[260px] lg:min-h-full">
        <div
          ref={centerImageRef}
          className="relative w-full h-full min-h-[280px] overflow-hidden group"
          data-cursor="view"
        >
          <Image
            src="/images/about-landscape.jpg"
            alt="About landscape gatefold reveal"
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 400px"
          />

          {/* Concave perspective edge vignette overlays recreating the curved panel look */}
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/60 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/60 to-transparent pointer-events-none" />
        </div>

        {/* Center vertical dividing line with black dot anchor */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-white/30 z-20 flex items-center justify-center pointer-events-none">
          <div className="w-4 h-4 rounded-full bg-[#040506] border border-white/60 shadow-md" />
        </div>
      </div>

      {/* Right Gatefold Panel (Dark #0B0C0D) */}
      <div
        ref={rightPanelRef}
        className="lg:col-span-4 bg-[#0B0C0D] text-white p-8 md:p-12 flex flex-col justify-between z-10"
      >
        <div className="flex justify-start pt-2">
          <span className="font-sora text-[13px] font-medium text-[#9F9FA2]">01</span>
        </div>

        <div className="space-y-6 my-auto py-8">
          <h2 className="font-sora text-[32px] sm:text-[40px] lg:text-[48px] font-bold leading-[1.05] tracking-tight text-white">
            We help <br />
            businesses <br />
            <span className="font-editorial italic font-normal text-[#E2E3E7]">create what’s next.</span>
          </h2>

          <p className="font-sora text-[14px] sm:text-[15px] text-[#9F9FA2] leading-relaxed max-w-[320px]">
            A team that turns business problems into digital products, brands, and experiences. Strategy driven. Design led.
          </p>
        </div>
      </div>
    </div>
  );
}
