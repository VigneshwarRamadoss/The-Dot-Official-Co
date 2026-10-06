"use client";

interface ServiceCardProps {
  title: string;
  items: string[];
  isDark?: boolean;
  artworkType: "brand" | "experience" | "product" | "growth";
}

export function ServiceCard({
  title,
  items,
  isDark = false,
  artworkType,
}: ServiceCardProps) {
  return (
    <div
      className={`group relative rounded-[24px] p-6 md:p-8 flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-2 cursor-pointer border ${
        isDark
          ? "bg-[#0C0E10] text-white border-[#22252A] shadow-xl"
          : "bg-[#E4E6E8] text-[#040404] border-[#D9DCE0] hover:bg-[#DADDE0] shadow-xs hover:shadow-md"
      }`}
      data-cursor="hover"
    >
      {/* Top Artwork Area */}
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mb-8 relative overflow-hidden transition-transform duration-300 group-hover:scale-110">
        {artworkType === "brand" && (
          <div className="w-full h-full bg-[#0C0E10] rounded-2xl relative flex items-center justify-center border border-white/10">
            {/* Warm radial lens flare blur artwork sampled directly from template */}
            <div className="w-10 h-10 rounded-full bg-radial from-[#988169] via-[#6E5D48] to-transparent blur-xs opacity-90 animate-pulse" />
            <div className="w-4 h-4 rounded-full bg-[#F5EAEC]/80 blur-2xs" />
          </div>
        )}

        {artworkType === "experience" && (
          <div className="w-full h-full bg-white/60 rounded-2xl flex items-center justify-center p-3 border border-black/5">
            <svg className="w-10 h-10 text-[#040404]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        )}

        {artworkType === "product" && (
          <div className="w-full h-full bg-white/60 rounded-2xl flex items-center justify-center p-3 border border-black/5">
            <svg className="w-10 h-10 text-[#040404]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
          </div>
        )}

        {artworkType === "growth" && (
          <div className="w-full h-full bg-white/60 rounded-2xl flex items-center justify-center p-3 border border-black/5">
            <svg className="w-10 h-10 text-[#040404]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        )}
      </div>

      {/* Title & Items */}
      <div className="space-y-4">
        <h3 className="font-sora text-[22px] md:text-[26px] font-bold tracking-tight">
          {title}
        </h3>

        <ul className="space-y-1.5 font-sora text-[13px] md:text-[14px]">
          {items.map((item, idx) => (
            <li
              key={idx}
              className={isDark ? "text-[#9F9FA2]" : "text-[#505354]"}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom corner reaction arrow */}
      <div className="mt-8 flex justify-end">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:translate-x-0.5 ${
            isDark ? "bg-white/10 text-white" : "bg-black/5 text-[#040404]"
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </div>
    </div>
  );
}
