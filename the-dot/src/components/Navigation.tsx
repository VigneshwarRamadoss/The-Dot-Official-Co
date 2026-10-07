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
      window.location.href = id === "hero" ? "/" : `/#${id}`;
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-transparent py-6 px-6 md:px-12 pointer-events-none">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between pointer-events-auto">
          {/* Brand Logo */}
          <Link
            href="/"
            className="font-sora text-[15px] font-bold tracking-[0.2em] text-[#040404] hover:opacity-80 transition-opacity bg-[#F5F5F5]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-black/5"
          >
            THE DOT
          </Link>

          {/* Minimal Navigation Trigger (<< / >>) */}
          <NavigationTrigger
            isOpen={menuOpen}
            onToggle={() => setMenuOpen((prev) => !prev)}
          />
        </div>
      </header>

      {/* Full-Screen Navigation Overlay Layer */}
      <FullscreenMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
      />
    </>
  );
}
