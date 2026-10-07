import type { Metadata } from "next";

import {
  Sora,
  Instrument_Serif,
} from "next/font/google";

import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: [
    "400",
    "500",
    "600",
    "700",
  ],
  variable: "--font-sora",
  display: "swap",
});

const instrumentSerif =
  Instrument_Serif({
    subsets: ["latin"],
    weight: "400",
    style: [
      "italic",
      "normal",
    ],
    variable:
      "--font-instrument-serif",
    display: "swap",
  });

export const metadata: Metadata =
  {
    title:
      "THE DOT — Strategy, Design & Digital Product Studio",

    description:
      "We build brand identities, websites, and digital products for ambitious teams.",
  };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`
        ${sora.variable}
        ${instrumentSerif.variable}
        h-full
        antialiased
      `}
    >
      <body
        className="
          min-h-full

          bg-[#F5F5F5]
          text-[#040404]

          selection:bg-[#0B0D0E]
          selection:text-white
        "
      >
        {children}
      </body>
    </html>
  );
}