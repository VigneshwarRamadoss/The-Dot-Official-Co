"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "./Button";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#F5F5F5] flex flex-col justify-between p-6 md:hidden animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link href="/" onClick={onClose} className="font-sora text-sm font-bold tracking-widest text-[#040404]">
          THE DOT
        </Link>
        <button
          onClick={onClose}
          className="p-2 text-[#040404] hover:text-black focus:outline-none"
          aria-label="Close menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex flex-col gap-6 my-auto text-left">
        {[
          { name: "Work", href: "/work" },
          { name: "Services", href: "/services" },
          { name: "About", href: "/about" },
          { name: "Contact", href: "/contact" },
        ].map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onClick={onClose}
            className="font-sora text-3xl font-bold text-[#040404] hover:text-[#505354] transition-colors"
          >
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Bottom CTA */}
      <div className="flex flex-col gap-4">
        <Button href="/book-a-call" onClick={onClose} className="w-full justify-center">
          Book a discovery call
        </Button>
      </div>
    </div>
  );
}
