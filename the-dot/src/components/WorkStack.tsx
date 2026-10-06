"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { WorkCard, WorkProject } from "./WorkCard";

gsap.registerPlugin(ScrollTrigger);

interface WorkStackProps {
  projects: WorkProject[];
}

export function WorkStack({ projects }: WorkStackProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative w-full py-8 overflow-hidden flex items-center justify-center perspective-1200 min-h-[440px] md:min-h-[520px]"
    >
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 lg:-space-x-12 max-w-[1300px] w-full px-4">
        {/* Left Project Card (Angled +18deg) */}
        {projects[0] && (
          <div className="hidden lg:block w-full max-w-[420px] transition-all duration-500">
            <WorkCard project={projects[0]} position="left" />
          </div>
        )}

        {/* Center Active Dominant Project Card (Flat 0deg) */}
        {projects[1] && (
          <div className="w-full max-w-[480px] z-20 transition-all duration-500">
            <WorkCard project={projects[1]} position="center" isActive={true} />
          </div>
        )}

        {/* Right Project Card (Angled -18deg) */}
        {projects[2] && (
          <div className="hidden lg:block w-full max-w-[420px] transition-all duration-500">
            <WorkCard project={projects[2]} position="right" />
          </div>
        )}
      </div>
    </div>
  );
}
