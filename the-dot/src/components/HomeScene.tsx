"use client";

import { Hero } from "./Hero";
import { About } from "./About";
import { TrustedClients } from "./TrustedClients";
import { WhyUs } from "./WhyUs";
import { Footer } from "./Footer";

interface HomeSceneProps {
  heroReady: boolean;
  onHeroMenuReady: () => void;
}

export function HomeScene({
  heroReady,
  onHeroMenuReady,
}: HomeSceneProps) {
  return (
    <div
      className="
        min-h-screen

        overflow-x-clip

        bg-white
        text-brand
      "
    >
      <Hero
        isReady={
          heroReady
        }

        onMenuReady={
          onHeroMenuReady
        }
      />

      <About />

      <TrustedClients />

      <WhyUs />

      <Footer />
    </div>
  );
}