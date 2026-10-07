"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { NavigationTrigger } from "./NavigationTrigger";
import { FullscreenMenu } from "./FullscreenMenu";
import { Hero } from "./Hero";
import { About } from "./About";
import { Services } from "./Services";
import { SelectedWork } from "./SelectedWork";
import { Approach } from "./Approach";
import { WhyUs } from "./WhyUs";
import { Team } from "./Team";
import { ContactCTA } from "./ContactCTA";
import { Footer } from "./Footer";

export function SectionManager() {
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [prevSection, setPrevSection] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // 1. Read initial URL hash on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash.replace("#", "");
    const validSections = ["hero", "about", "services", "work", "approach", "why-us", "team", "contact"];

    if (hash && validSections.includes(hash)) {
      setActiveSection(hash);
    }
  }, []);

  // 2. Intercept wheel, touchmove, and keyboard scrolling to prevent normal section scrolling
  useEffect(() => {
    if (typeof window === "undefined") return;

    const preventDefaultScroll = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (
        target?.closest("#fullscreen-menu") ||
        target?.closest("textarea") ||
        target?.closest(".allow-scroll")
      ) {
        return;
      }
      e.preventDefault();
    };

    const preventKeyScroll = (e: KeyboardEvent) => {
      const keys = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Space", " "];
      const target = e.target as HTMLElement | null;
      if (
        target?.closest("#fullscreen-menu") ||
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (keys.includes(e.key)) {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", preventDefaultScroll, { passive: false });
    window.addEventListener("touchmove", preventDefaultScroll, { passive: false });
    window.addEventListener("keydown", preventKeyScroll);

    return () => {
      window.removeEventListener("wheel", preventDefaultScroll);
      window.removeEventListener("touchmove", preventDefaultScroll);
      window.removeEventListener("keydown", preventKeyScroll);
    };
  }, []);

  // 3. Handle Direct Section Transitions with GSAP
  const navigateToSection = (targetId: string) => {
    if (targetId === activeSection) return;

    setPrevSection(activeSection);
    setActiveSection(targetId);

    // Update URL Hash without reload
    if (typeof window !== "undefined") {
      const newHash = targetId === "hero" ? "/" : `/#${targetId}`;
      window.history.pushState(null, "", newHash);
    }

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const currentEl = sectionRefs.current[activeSection];
    const targetEl = sectionRefs.current[targetId];

    if (!currentEl || !targetEl) return;

    if (prefersReducedMotion) {
      gsap.set(currentEl, { display: "none" });
      gsap.set(targetEl, { display: "block", opacity: 1 });
    } else {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(currentEl, { display: "none" });
        },
      });

      // Current section exits
      tl.to(currentEl, {
        opacity: 0,
        y: -30,
        scale: 0.98,
        duration: 0.4,
        ease: "power2.inOut",
      })
        // Target section enters into exact approved layout
        .set(targetEl, { display: "block", opacity: 0, y: 40, scale: 0.98 })
        .to(targetEl, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: "power3.out",
        });
    }
  };

  const sectionMap: Record<string, { node: React.ReactNode; theme: "light" | "dark" }> = {
    hero: { node: <Hero />, theme: "light" },
    about: { node: <About />, theme: "dark" },
    services: { node: <Services />, theme: "light" },
    work: { node: <SelectedWork />, theme: "dark" },
    approach: { node: <Approach />, theme: "dark" },
    "why-us": { node: <WhyUs />, theme: "light" },
    team: { node: <Team />, theme: "light" },
    contact: {
      node: (
        <div className="min-h-screen flex flex-col justify-between">
          <ContactCTA />
          <Footer />
        </div>
      ),
      theme: "light",
    },
  };

  const sections = ["hero", "about", "services", "work", "approach", "why-us", "team", "contact"];

  return (
    <div className="relative w-full h-[100svh] overflow-hidden bg-[#F5F5F5] text-[#040404]">
      {/* Right-Center Hero Navigation Glow Trigger (<< / >>) - Hero ONLY */}
      <NavigationTrigger
        isOpen={menuOpen}
        onToggle={() => setMenuOpen((prev) => !prev)}
        activeSection={activeSection}
      />

      {/* Full-Screen Navigation Menu Overlay Layer */}
      <FullscreenMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        activeSection={activeSection}
        onSelectSection={navigateToSection}
      />

      {/* Full-Screen Section Scenes */}
      {sections.map((id) => {
        const isActive = id === activeSection;
        const item = sectionMap[id];

        return (
          <div
            key={id}
            ref={(el) => {
              sectionRefs.current[id] = el;
            }}
            data-cursor-theme={item.theme}
            style={{ display: isActive ? "block" : "none" }}
            className="absolute inset-0 w-full h-[100svh] overflow-y-auto overflow-x-hidden"
          >
            {item.node}
          </div>
        );
      })}
    </div>
  );
}
