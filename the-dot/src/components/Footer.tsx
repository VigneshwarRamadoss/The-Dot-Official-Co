"use client";

import Link from "next/link";

export function Footer() {
  const scrollToTop = () => {
    /*
     * SectionManager uses an internal scroll container,
     * so window.scrollTo() will not move the Home scene.
     */
    const activeScroller =
      document.querySelector<HTMLElement>(
        '[data-scene-scroll][data-active="true"]'
      );

    if (activeScroller) {
      activeScroller.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    /*
     * Fallback for any future normal-scrolling page.
     */
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer
      className="
        bg-[#F5F5F5]
        border-t
        border-[#E5E6E9]

        py-12
        px-4
        md:px-8

        max-w-[1440px]
        mx-auto

        text-[#505354]
      "
    >
      <div
        className="
          flex
          flex-col
          md:flex-row

          items-start
          md:items-center

          justify-between

          gap-8
          py-4
        "
      >
        {/* Brand */}
        <div className="space-y-2">
          <Link
            href="/"
            className="
              font-sora
              text-[15px]
              font-bold

              tracking-[0.2em]

              text-[#040404]
            "
          >
            THE DOT
          </Link>

          <p
            className="
              font-sora
              text-[13px]
              text-[#818084]
            "
          >
            Strategy, Design & Digital Product Studio.
          </p>
        </div>

        {/* Navigation */}
        <div
          className="
            flex
            flex-wrap

            items-center

            gap-8
          "
        >
          <a
            href="#about"
            className="
              font-sora
              text-[13px]

              text-[#505354]

              hover:text-[#040404]

              transition-colors
            "
          >
            About
          </a>

          <a
            href="#approach"
            className="
              font-sora
              text-[13px]

              text-[#505354]

              hover:text-[#040404]

              transition-colors
            "
          >
            Approach
          </a>

          <a
            href="#why-us"
            className="
              font-sora
              text-[13px]

              text-[#505354]

              hover:text-[#040404]

              transition-colors
            "
          >
            Why us
          </a>

          <Link
            href="/book-a-call"
            className="
              font-sora
              text-[13px]
              font-semibold

              text-[#040404]

              hover:text-[#505354]

              transition-colors
            "
          >
            Contact us
          </Link>

          <button
            type="button"
            onClick={scrollToTop}
            className="
              flex
              items-center
              gap-2

              font-sora
              text-[13px]
              font-semibold

              text-[#040404]

              cursor-pointer

              transition-colors

              hover:text-[#505354]
            "
          >
            Back to top

            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M12 19V5m0 0L7 10m5-5 5 5"
              />
            </svg>
          </button>
        </div>
      </div>

      <div
        className="
          pt-8

          border-t
          border-[#E5E6E9]/60

          flex
          flex-col
          sm:flex-row

          items-center
          justify-between

          text-[12px]
          text-[#818084]

          gap-4
        "
      >
        <p>
          © {new Date().getFullYear()} THE DOT. All rights reserved.
        </p>

        <p className="font-editorial italic">
          Built around the problem, not the template.
        </p>
      </div>
    </footer>
  );
}