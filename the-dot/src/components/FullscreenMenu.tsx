"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";

export interface NavItemData {
  id: string;
  num: string;
  label: string;
  previewImage?: string;
  previewCategory?: string;
}

// HOME / HERO is intentionally NOT part of the menu list.
// Clicking THE DOT in the menu header returns to Hero instead.
const navItems: NavItemData[] = [
  {
    id: "about",
    num: "01",
    label: "ABOUT",
    previewImage: "/images/about-landscape.jpg",
    previewCategory: "More than a studio",
  },
  {
    id: "services",
    num: "02",
    label: "SERVICES",
    previewImage: "/images/hero-facade.jpg",
    previewCategory: "Brand, Web, Product, Growth",
  },
  {
    id: "work",
    num: "03",
    label: "WORK",
    previewImage: "/images/work-office.jpg",
    previewCategory: "Featured Case Studies",
  },
  {
    id: "approach",
    num: "04",
    label: "APPROACH",
    previewImage: "/images/why-strategy.jpg",
    previewCategory: "How we partner",
  },
  {
    id: "why-us",
    num: "05",
    label: "WHY US",
    previewImage: "/images/why-problem.jpg",
    previewCategory: "Problem-first execution",
  },
  {
    id: "team",
    num: "06",
    label: "TEAM",
    previewImage: "/images/team-01.jpg",
    previewCategory: "Designers & Problem Solvers",
  },
  {
    id: "contact",
    num: "07",
    label: "CONTACT",
    previewImage: "/images/why-launch.jpg",
    previewCategory: "Book a discovery call",
  },
];

interface FullscreenMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  onSelectSection: (id: string) => void;
}

export function FullscreenMenu({
  isOpen,
  onClose,
  activeSection,
  onSelectSection,
}: FullscreenMenuProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const [shouldRender, setShouldRender] = useState(isOpen);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Keep component mounted while the close animation finishes.
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    }
  }, [isOpen]);

  // Open from the right edge / close back toward the right edge.
  useEffect(() => {
    if (!shouldRender || !overlayRef.current) return;

    const overlay = overlayRef.current;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const linkElements = linksRef.current?.querySelectorAll(".menu-link-item");

    if (prefersReducedMotion) {
      if (isOpen) {
        gsap.set(overlay, {
          clipPath: "inset(0% 0% 0% 0%)",
          opacity: 1,
        });
        gsap.set(linkElements || [], {
          opacity: 1,
          x: 0,
        });
        closeRef.current?.focus();
      } else {
        setShouldRender(false);
      }
      return;
    }

    const ctx = gsap.context(() => {
      if (isOpen) {
        gsap.set(overlay, {
          clipPath: "inset(0% 0% 0% 100%)",
          opacity: 1,
        });

        if (linkElements) {
          gsap.set(linkElements, {
            opacity: 0,
            x: 26,
          });
        }

        const timeline = gsap.timeline();

        timeline.to(overlay, {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.78,
          ease: "power4.inOut",
        });

        if (linkElements) {
          timeline.to(
            linkElements,
            {
              opacity: 1,
              x: 0,
              duration: 0.42,
              stagger: 0.045,
              ease: "power3.out",
            },
            "-=0.28"
          );
        }

        timeline.call(() => {
          closeRef.current?.focus();
        });
      } else {
        const timeline = gsap.timeline({
          onComplete: () => {
            setShouldRender(false);
            setHoveredIndex(null);
          },
        });

        if (linkElements) {
          timeline.to(linkElements, {
            opacity: 0,
            x: 18,
            duration: 0.18,
            stagger: {
              each: 0.018,
              from: "end",
            },
            ease: "power2.in",
          });
        }

        timeline.to(
          overlay,
          {
            clipPath: "inset(0% 0% 0% 100%)",
            duration: 0.52,
            ease: "power3.inOut",
          },
          "-=0.06"
        );
      }
    }, overlay);

    return () => ctx.revert();
  }, [isOpen, shouldRender]);

  // ESC + focus trap.
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !overlayRef.current) return;

      const elements = overlayRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

      if (elements.length === 0) return;

      const first = elements[0];
      const last = elements[elements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!shouldRender) return null;

  const handleNavClick = (id: string) => {
    onSelectSection(id);
    onClose();
  };

  const activePreview =
    hoveredIndex !== null ? navItems[hoveredIndex] : null;

  return (
    <div
      ref={overlayRef}
      id="fullscreen-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Section navigation"
      data-cursor-theme="dark"
      className="fixed inset-0 z-[100] bg-[#0B0C0D] text-white flex flex-col justify-between p-6 md:p-12 lg:p-16 overflow-y-auto will-change-[clip-path]"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        {/* THE DOT now acts as the Home / Hero control. */}
        <button
          type="button"
          onClick={() => handleNavClick("hero")}
          data-cursor="hover"
          aria-label="Return to Hero"
          className="font-sora text-[15px] font-bold tracking-[0.2em] text-white hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          THE DOT
        </button>

        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="font-sora text-[12px] font-semibold tracking-[0.18em] text-[#9F9FA2] hover:text-white transition-colors p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          CLOSE
        </button>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto py-6">
        {/* Navigation links */}
        <div
          ref={linksRef}
          className="lg:col-span-7 flex flex-col space-y-1.5 md:space-y-2"
        >
          {navItems.map((item, index) => {
            const isActive = activeSection === item.id;
            const isHovered = hoveredIndex === index;
            const otherHovered = hoveredIndex !== null && hoveredIndex !== index;

            return (
              <button
                key={item.id}
                type="button"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onFocus={() => setHoveredIndex(index)}
                onBlur={() => setHoveredIndex(null)}
                onClick={() => handleNavClick(item.id)}
                data-cursor="hover"
                data-cursor-text="GO"
                className="menu-link-item group text-left flex items-center gap-4 p-1 rounded-xl cursor-pointer transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                {/* Active indicator */}
                <span
                  className={`w-2.5 h-2.5 rounded-full shrink-0 transition-all duration-300 ${
                    isActive
                      ? "bg-[#E6C5D7] scale-125"
                      : "bg-white/20 group-hover:bg-white"
                  }`}
                />

                {/* Number */}
                <span className="font-sora text-[13px] font-medium text-[#9F9FA2] w-6 shrink-0">
                  {item.num}
                </span>

                {/* Label */}
                <span
                  className={`font-sora text-[28px] sm:text-[38px] lg:text-[46px] font-bold tracking-tight transition-all duration-300 ${
                    isHovered
                      ? "translate-x-3 text-white"
                      : otherHovered
                      ? "opacity-35 text-[#9F9FA2]"
                      : isActive
                      ? "text-white"
                      : "text-white/80"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Preview */}
        <div className="hidden lg:block lg:col-span-5 relative w-full aspect-[4/3] rounded-[28px] overflow-hidden border border-white/10 bg-[#15171B] shadow-2xl">
          {activePreview?.previewImage ? (
            <div key={activePreview.id} className="relative w-full h-full">
              <Image
                src={activePreview.previewImage}
                alt={activePreview.label}
                fill
                className="object-cover"
                sizes="500px"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

              <div className="absolute bottom-6 left-6 right-6">
                <span className="font-sora text-[11px] font-semibold tracking-widest uppercase text-[#E6C5D7] block mb-1">
                  {activePreview.num} / {activePreview.label}
                </span>

                <p className="font-sora text-[18px] font-bold text-white">
                  {activePreview.previewCategory}
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-center p-8">
              <span className="font-sora text-[12px] font-medium text-[#9F9FA2] uppercase tracking-widest">
                Hover a section to preview
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-[#9F9FA2]">
        <p>© {new Date().getFullYear()} THE DOT. All rights reserved.</p>

        <Link
          href="/book-a-call"
          onClick={onClose}
          className="font-sora font-semibold text-white hover:text-[#E6C5D7] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Book a discovery call →
        </Link>
      </div>
    </div>
  );
}
