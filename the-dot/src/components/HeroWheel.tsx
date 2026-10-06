"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

export function HeroWheel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Subtle ambient floating / gentle rotation loop
      gsap.to(orbitRef.current, {
        rotation: 3,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to([card1Ref.current, card2Ref.current], {
        y: -12,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.5,
      });

      gsap.to(card3Ref.current, {
        y: 8,
        x: -6,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Cursor parallax effect on hero visual
      const handleMouseMove = (e: MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        gsap.to(card1Ref.current, { x: x * 18, y: y * 18, duration: 0.8, ease: "power2.out" });
        gsap.to(card2Ref.current, { x: x * 12, y: y * 12, duration: 0.8, ease: "power2.out" });
        gsap.to(card3Ref.current, { x: x * 24, y: y * 24, duration: 0.8, ease: "power2.out" });
      };

      const container = containerRef.current;
      container?.addEventListener("mousemove", handleMouseMove);

      return () => {
        container?.removeEventListener("mousemove", handleMouseMove);
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/3] max-w-[650px] mx-auto flex items-center justify-center select-none"
    >
      {/* Background Orbit Line */}
      <div
        ref={orbitRef}
        className="absolute w-[80%] aspect-square rounded-full border border-[#DADBDC]/80 pointer-events-none"
      >
        {/* Black accent dot with subtle pink-blue halo on orbit line */}
        <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#E6C5D7] blur-xs opacity-70 animate-pulse" />
          <div className="w-3.5 h-3.5 rounded-full bg-[#040506] relative z-10 shadow-sm" />
        </div>
      </div>

      {/* Orbit Card 1: Top-middle tilted studio interior */}
      <div
        ref={card1Ref}
        className="absolute top-[8%] left-[48%] -translate-x-1/2 w-[34%] aspect-square rounded-2xl overflow-hidden shadow-xl border border-white/40 rotate-[32deg] transform transition-transform duration-300 hover:scale-105"
        data-cursor="view"
      >
        <Image
          src="/images/hero-interior.jpg"
          alt="Studio interior artwork"
          fill
          className="object-cover"
          sizes="240px"
        />
      </div>

      {/* Orbit Card 2: Bottom-left tilted person portrait */}
      <div
        ref={card2Ref}
        className="absolute bottom-[8%] left-[34%] w-[32%] aspect-square rounded-2xl overflow-hidden shadow-lg border border-white/40 rotate-[-12deg] transform transition-transform duration-300 hover:scale-105"
        data-cursor="view"
      >
        <Image
          src="/images/hero-person.jpg"
          alt="Designer portrait"
          fill
          className="object-cover"
          sizes="220px"
        />
      </div>

      {/* Dominant Hero Card 3: Large perspective building facade card on right */}
      <div
        ref={card3Ref}
        className="absolute right-[0%] top-[12%] w-[58%] aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-white/60 rotate-[14deg] perspective-1000 transform transition-transform duration-300 hover:scale-[1.02]"
        data-cursor="view"
      >
        <Image
          src="/images/hero-facade.jpg"
          alt="Architecture building facade"
          fill
          className="object-cover"
          priority
          sizes="400px"
        />
        {/* Subtle glass shimmer overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 pointer-events-none" />
      </div>
    </div>
  );
}
