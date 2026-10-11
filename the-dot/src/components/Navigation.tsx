"use client";

import Link from "next/link";
import { useState } from "react";

import { NavigationTrigger } from "./NavigationTrigger";
import { FullscreenMenu } from "./FullscreenMenu";

export function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  const handleSelectSection = (id: string) => {
    setActiveSection(id);

    if (typeof window !== "undefined") {
      window.location.href =
        id === "hero"
          ? "/"
          : `/#${id}`;
    }
  };

  return (
    <>
      <header
        className="
          pointer-events-none
          fixed
          left-0
          right-0
          top-0
          z-40

          bg-transparent

          px-6
          py-6

          md:px-12
        "
      >
        <div
          className="
            pointer-events-auto

            mx-auto

            flex
            max-w-[1440px]

            items-center
            justify-between
          "
        >
          <Link
            href="/"
            className="
              rounded-full

              border
              border-black/5

              bg-[#F5F5F5]/80

              px-3
              py-1.5

              font-sora
              text-[15px]
              font-bold

              tracking-[0.2em]

              text-[#040404]

              backdrop-blur-md

              transition-opacity

              hover:opacity-80
            "
          >
            THE DOT
          </Link>

          <NavigationTrigger
            isOpen={menuOpen}
            activeSection={activeSection}
            onToggle={() => {
              setMenuOpen((previous) => !previous);
            }}
          />
        </div>
      </header>

      <FullscreenMenu
        isOpen={menuOpen}
        onClose={() => {
          setMenuOpen(false);
        }}
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
      />
    </>
  );
}