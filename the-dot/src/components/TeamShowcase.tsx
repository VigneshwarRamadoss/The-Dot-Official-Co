"use client";

import { useState } from "react";
import Image from "next/image";

export function TeamShowcase() {
  const [activeMember, setActiveMember] = useState(0);

  const team = [
    {
      name: "Rohan Varma",
      role: "Founder & Product Lead",
      image: "/images/team-01.jpg",
    },
    {
      name: "Ananya Iyer",
      role: "Design Director",
      image: "/images/team-02.jpg",
    },
    {
      name: "David Chen",
      role: "Strategy Director",
      image: "/images/team-03.jpg",
    },
    {
      name: "Sarah Jenkins",
      role: "Engineering Lead",
      image: "/images/team-01.jpg",
    },
  ];

  const current = team[activeMember];

  return (
    <div className="relative w-full bg-[#F4F5F5] rounded-[32px] md:rounded-[40px] p-6 md:p-12 lg:p-14 border border-[#E5E6E9] shadow-xs">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Vertical Avatar Selector Rail + Featured Portrait Image */}
        <div className="lg:col-span-6 flex items-center gap-6">
          {/* Vertical Avatar Selector Dock */}
          <div className="flex flex-col gap-4">
            {team.map((member, idx) => (
              <button
                key={idx}
                onClick={() => setActiveMember(idx)}
                className={`relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden transition-all duration-300 border-2 ${
                  idx === activeMember
                    ? "border-[#040404] scale-110 shadow-md ring-2 ring-black/10"
                    : "border-transparent opacity-60 hover:opacity-100 hover:scale-105"
                }`}
                aria-label={`Select ${member.name}`}
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </button>
            ))}
          </div>

          {/* Main Featured Portrait Frame */}
          <div className="relative w-full aspect-[4/5] max-w-[380px] rounded-[24px] overflow-hidden bg-[#D9D9D9] shadow-md border border-black/5" data-cursor="hover">
            <Image
              src={current.image}
              alt={current.name}
              fill
              className="object-cover transition-all duration-500"
              sizes="380px"
              priority
            />
            {/* Subtle name badge overlay */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md text-white p-3 rounded-xl">
              <p className="font-sora text-sm font-bold">{current.name}</p>
              <p className="font-sora text-xs text-[#9F9FA2]">{current.role}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Credibility Headline + Stats Column */}
        <div className="lg:col-span-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Headline & Subtitle (approx 8 cols) */}
          <div className="md:col-span-8 space-y-4">
            <h2 className="font-sora text-[32px] sm:text-[40px] lg:text-[48px] font-bold text-[#040404] leading-[1.08] tracking-tight">
              Designers, <br />
              builders and <br />
              problem solvers.
            </h2>

            <p className="font-sora text-[15px] md:text-[16px] text-[#818084] leading-relaxed max-w-[320px]">
              A small team with a big focus on meaningful work.
            </p>
          </div>

          {/* Stats Column (approx 4 cols) matching reference image */}
          <div className="md:col-span-4 border-l border-[#DADBDC] pl-6 py-2 space-y-6">
            <div>
              <span className="font-sora text-[32px] md:text-[38px] font-bold text-[#040404] block leading-none">
                5+
              </span>
              <span className="font-sora text-[13px] text-[#818084] font-medium">
                Years
              </span>
            </div>

            <div>
              <span className="font-sora text-[32px] md:text-[38px] font-bold text-[#040404] block leading-none">
                50+
              </span>
              <span className="font-sora text-[13px] text-[#818084] font-medium">
                Projects
              </span>
            </div>

            <div>
              <span className="font-sora text-[32px] md:text-[38px] font-bold text-[#040404] block leading-none">
                10+
              </span>
              <span className="font-sora text-[13px] text-[#818084] font-medium">
                Industries
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
