"use client";

import Link from "next/link";
import { WorkStack } from "./WorkStack";
import { WorkProject } from "./WorkCard";

export function SelectedWork() {
  const sampleProjects: WorkProject[] = [
    {
      slug: "orbit-studio",
      client: "Orbit Studio",
      title: "Orbit Studio",
      tags: ["Brand", "Web Design"],
      image: "/images/work-interior.jpg",
      number: "01",
    },
    {
      slug: "swastik-corporation",
      client: "Swastik Corporation",
      title: "Swastik Corporation",
      tags: ["ERP", "Product Design", "Web App"],
      image: "/images/work-office.jpg",
      number: "02",
    },
    {
      slug: "skydic-outdoor",
      client: "Skydic Outdoor",
      title: "Skydic Outdoor Showcase",
      tags: ["Design System", "Product"],
      image: "/images/work-tower.jpg",
      number: "03",
    },
  ];

  return (
    <section className="py-12 md:py-20 px-4 md:px-8 max-w-[1440px] mx-auto">
      {/* Dark section frame matching approved reference image */}
      <div className="bg-[#080A0B] rounded-[32px] md:rounded-[40px] p-6 md:p-12 lg:p-16 border border-[#22252A] shadow-2xl relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <div className="space-y-1">
            <span className="font-sora text-[12px] font-medium tracking-widest text-[#9F9FA2] uppercase">
              Selected Work
            </span>
            <h2 className="font-sora text-[28px] md:text-[36px] font-bold text-white tracking-tight">
              Featured Case Studies
            </h2>
          </div>

          <Link
            href="/work"
            className="font-sora text-[13px] md:text-[14px] font-medium text-[#9F9FA2] hover:text-white transition-colors flex items-center gap-1 group"
          >
            All projects
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

        {/* 3D Work Stack Fan */}
        <WorkStack projects={sampleProjects} />
      </div>
    </section>
  );
}
