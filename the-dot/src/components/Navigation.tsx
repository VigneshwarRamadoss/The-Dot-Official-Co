"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "./Button";
import { MobileMenu } from "./MobileMenu";

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-[#F5F5F5]/85 backdrop-blur-md py-4 border-b border-[#E5E6E9]/60 shadow-xs"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="font-sora text-[15px] font-bold tracking-[0.2em] text-[#040404] hover:opacity-80 transition-opacity"
          >
            THE DOT
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/work"
              className="font-sora text-[13px] font-medium text-[#505354] hover:text-[#040404] transition-colors"
            >
              Work
            </Link>
            <Link
              href="/services"
              className="font-sora text-[13px] font-medium text-[#505354] hover:text-[#040404] transition-colors"
            >
              Services
            </Link>
            <Link
              href="/about"
              className="font-sora text-[13px] font-medium text-[#505354] hover:text-[#040404] transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="font-sora text-[13px] font-medium text-[#505354] hover:text-[#040404] transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Button href="/book-a-call" variant="primary" showArrow={false} className="text-[13px] px-5 py-2.5">
              Book a discovery call
            </Button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 text-[#040404] focus:outline-none"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
