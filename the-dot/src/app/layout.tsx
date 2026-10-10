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
  variable: "--font-sora-next",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: [
    "normal",
    "italic",
  ],
  variable: "--font-instrument-next",
  display: "swap",
});

export const metadata: Metadata = {
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

          bg-white
          text-brand

          selection:bg-accent
          selection:text-white
        "
      >
        {children}
      </body>
    </html>
  );
}