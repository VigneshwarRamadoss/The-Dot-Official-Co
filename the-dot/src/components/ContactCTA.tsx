"use client";

import { Button } from "./Button";

export function ContactCTA() {
  return (
    <section id="contact" className="py-12 md:py-20 px-4 md:px-8 max-w-[1440px] mx-auto">
      <div className="relative w-full bg-[#F1F2F3] rounded-[32px] md:rounded-[40px] p-8 md:p-14 lg:p-16 border border-[#E5E6E9] shadow-xs overflow-hidden">
        
        {/* Soft Pink-Blue Ambient Glow Aura sampled directly from template reference */}
        <div className="absolute right-[5%] top-1/2 -translate-y-1/2 w-[350px] h-[250px] glow-contact pointer-events-none opacity-80" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Left Headline & Subtext */}
          <div className="lg:col-span-6 space-y-4">
            <h2 className="font-sora text-[36px] sm:text-[48px] lg:text-[56px] font-bold text-[#040404] leading-[1.05] tracking-tight">
              Have something <br />
              worth building?
            </h2>

            <p className="font-sora text-[15px] md:text-[17px] text-[#505354] leading-relaxed max-w-[360px]">
              Bring us the messy version. <br />
              We’ll start with the problem.
            </p>
          </div>

          {/* Right S-Curve Connecting Line + Dot + Primary CTA Button */}
          <div className="lg:col-span-6 flex flex-col md:flex-row items-center justify-end gap-8 relative py-4">
            
            {/* SVG S-Curve Line with Black Dot matching template */}
            <div className="relative w-full md:w-auto flex-1 flex items-center justify-center">
              <svg
                className="w-full h-24 max-w-[280px] overflow-visible"
                viewBox="0 0 200 80"
                fill="none"
              >
                <path
                  d="M 10 70 C 60 70 80 10 130 10 C 170 10 190 40 200 40"
                  stroke="#818084"
                  strokeWidth="1.5"
                  strokeOpacity="0.4"
                  fill="none"
                />
                {/* Black Dot on curve */}
                <circle cx="100" cy="40" r="6" fill="#040506" className="shadow-sm" />
              </svg>
            </div>

            {/* Primary CTA Button */}
            <div className="shrink-0 relative z-10">
              <Button href="/book-a-call" variant="primary" className="text-[15px] px-8 py-4 shadow-lg">
                Book a discovery call
              </Button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}