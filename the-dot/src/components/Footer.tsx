"use client";

import Link from "next/link";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#F5F5F5] border-t border-[#E5E6E9] py-12 px-4 md:px-8 max-w-[1440px] mx-auto text-[#505354]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 py-4">
        
        {/* Left Brand info */}
        <div className="space-y-2">
          <Link href="/" className="font-sora text-[15px] font-bold tracking-[0.2em] text-[#040404]">
            THE DOT
          </Link>
          <p className="font-sora text-[13px] text-[#818084]">
            Strategy, Design & Digital Product Studio.
          </p>
        </div>

        {/* Right Links & Back to Top */}
        <div className="flex flex-wrap items-center gap-8">
          <Link href="/work" className="font-sora text-[13px] text-[#505354] hover:text-[#040404] transition-colors">
            Work
          </Link>
          <Link href="/services" className="font-sora text-[13px] text-[#505354] hover:text-[#040404] transition-colors">
            Services
          </Link>
          <Link href="/about" className="font-sora text-[13px] text-[#505354] hover:text-[#040404] transition-colors">
            About
          </Link>
          <Link href="/contact" className="font-sora text-[13px] text-[#505354] hover:text-[#040404] transition-colors">
            Contact
          </Link>

          <button
            onClick={scrollToTop}
            className="font-sora text-[13px] text-[#040404] hover:text-[#505354] font-semibold flex items-center gap-1.5 transition-colors ml-auto md:ml-4"
          >
            Back to top
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>

      </div>

      <div className="pt-8 border-t border-[#E5E6E9]/60 flex flex-col sm:flex-row items-center justify-between text-[12px] text-[#818084] gap-4">
        <p>© {new Date().getFullYear()} THE DOT. All rights reserved.</p>
        <p className="font-editorial italic">Where great brands begin.</p>
      </div>
    </footer>
  );
}
