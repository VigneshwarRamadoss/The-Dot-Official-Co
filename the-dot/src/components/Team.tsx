"use client";

import { TeamShowcase } from "./TeamShowcase";

export function Team() {
  return (
    <section
      id="team"
      className="
        relative

        h-[100svh]
        min-h-[680px]

        w-full

        overflow-hidden

        bg-white

        px-4
        md:px-8
      "
    >
      <TeamShowcase />
    </section>
  );
}