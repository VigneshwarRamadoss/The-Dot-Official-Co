"use client";

import Link from "next/link";
import { useRef, useState } from "react";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "darkContext";
  className?: string;
  showArrow?: boolean;
  onClick?: () => void;
}

export function Button({
  children,
  href,
  variant = "primary",
  className = "",
  showArrow = true,
  onClick,
}: ButtonProps) {
  const btnRef = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    // Magnetic pull (max 8px)
    setPosition({ x: x * 0.15, y: y * 0.15 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const baseStyles =
    "relative inline-flex items-center justify-center gap-2 font-sora text-[14px] font-semibold tracking-tight transition-all duration-300 rounded-full px-6 py-3 select-none group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0B0D0E]";

  const variantStyles = {
    primary:
      "bg-[#0B0D0E] text-white hover:bg-[#222426] shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]",
    secondary:
      "bg-transparent text-[#040404] hover:text-[#505354] hover:bg-black/5",
    darkContext:
      "bg-white text-[#0B0D0E] hover:bg-[#F1F2F2] shadow-sm hover:scale-[1.02] active:scale-[0.98]",
  };

  const content = (
    <>
      <span className="relative z-10">{children}</span>
      {showArrow && (
        <svg
          className="w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-1 relative z-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
          />
        </svg>
      )}
    </>
  );

  const styleObj = {
    transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
  };

  if (href) {
    return (
      <Link
        href={href}
        ref={btnRef as React.RefObject<HTMLAnchorElement>}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={styleObj}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      ref={btnRef as React.RefObject<HTMLButtonElement>}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={styleObj}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {content}
    </button>
  );
}
