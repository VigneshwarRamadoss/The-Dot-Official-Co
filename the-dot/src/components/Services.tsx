"use client";

import Link from "next/link";
import { ServiceCard } from "./ServiceCard";

export function Services() {
  const services = [
    {
      title: "Brand",
      items: ["Strategy", "Identity", "Positioning"],
      isDark: true,
      artworkType: "brand" as const,
    },
    {
      title: "Digital Experience",
      items: ["Websites", "E-commerce", "Interactive"],
      isDark: false,
      artworkType: "experience" as const,
    },
    {
      title: "Product",
      items: ["UI/UX", "Web Apps", "Design Systems"],
      isDark: false,
      artworkType: "product" as const,
    },
    {
      title: "Growth Systems",
      items: ["Conversion", "Automation", "Optimization"],
      isDark: false,
      artworkType: "growth" as const,
    },
  ];

  return (
    <section id="services" className="py-12 md:py-20 px-4 md:px-8 max-w-[1440px] mx-auto">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8 md:mb-12 px-2">
        <h2 className="font-sora text-[26px] md:text-[32px] font-bold text-[#040404] tracking-tight">
          What we do
        </h2>
        <Link
          href="/services"
          className="font-sora text-[13px] md:text-[14px] font-medium text-[#505354] hover:text-[#040404] transition-colors flex items-center gap-1 group"
        >
          Explore all services
          <svg
            className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
          </svg>
        </Link>
      </div>

      {/* Grid: 4 cards horizontal on desktop, 2x2 on tablet, 1-col on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {services.map((service, index) => (
          <ServiceCard
            key={index}
            title={service.title}
            items={service.items}
            isDark={service.isDark}
            artworkType={service.artworkType}
          />
        ))}
      </div>
    </section>
  );
}
