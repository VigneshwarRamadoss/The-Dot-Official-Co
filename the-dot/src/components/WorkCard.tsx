"use client";

import Image from "next/image";
import Link from "next/link";

export interface WorkProject {
  slug: string;
  client: string;
  title: string;
  tags: string[];
  image: string;
  number: string;
}

interface WorkCardProps {
  project: WorkProject;
  position: "left" | "center" | "right";
  isActive?: boolean;
}

export function WorkCard({ project, position, isActive = false }: WorkCardProps) {
  const transformStyles = {
    left: "rotate-y-[18deg] -rotate-z-[4deg] translate-x-[-15%] scale-90 opacity-80 shadow-2xl hover:opacity-100 hover:scale-95",
    center: "rotate-y-0 rotate-z-0 translate-x-0 scale-100 opacity-100 shadow-2xl z-20 hover:scale-[1.02]",
    right: "rotate-y-[-18deg] rotate-z-[4deg] translate-x-[15%] scale-90 opacity-80 shadow-2xl hover:opacity-100 hover:scale-95",
  };

  return (
    <Link
      href={`/work/${project.slug}`}
      className={`relative w-full max-w-[460px] aspect-[4/3] rounded-[28px] overflow-hidden border border-white/15 bg-[#0C0E10] transition-all duration-500 ease-out cursor-pointer group flex flex-col justify-between p-6 md:p-8 ${transformStyles[position]}`}
      data-cursor="view"
      data-cursor-text="VIEW"
    >
      {/* Background Image */}
      <Image
        src={project.image}
        alt={project.title}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        sizes="460px"
      />

      {/* Dark gradient overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20 pointer-events-none" />

      {/* Top Header: Project Number */}
      <div className="relative z-10 flex justify-between items-center">
        <span className="font-sora text-[13px] font-medium text-white/70 tracking-widest">
          {project.number}
        </span>
      </div>

      {/* Bottom Content: Title, Tags, Arrow */}
      <div className="relative z-10 space-y-4">
        <h3 className="font-sora text-[28px] md:text-[34px] font-bold text-white leading-tight tracking-tight">
          {project.title}
        </h3>

        <div className="flex items-center justify-between pt-2">
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2">
            {project.tags.map((tag, idx) => (
              <span
                key={idx}
                className="font-sora text-[11px] font-medium text-white/90 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full border border-white/10"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Action Arrow Button */}
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center border border-white/20 transition-transform duration-300 group-hover:scale-110 group-hover:bg-white group-hover:text-black">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
