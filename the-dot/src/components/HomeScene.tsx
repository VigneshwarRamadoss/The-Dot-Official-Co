"use client";

import { useState } from "react";
import { Hero } from "./Hero";
import { TrustedClients } from "./TrustedClients";
import { About } from "./About";
import { Approach } from "./Approach";
import { WhyUs } from "./WhyUs";
import { Footer } from "./Footer";
import { ContactDialog } from "./ContactDialog";

export function HomeScene() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Hero onOpenContact={() => setContactOpen(true)} />
      <TrustedClients />
      <About />
      <Approach />
      <WhyUs />
      <Footer onOpenContact={() => setContactOpen(true)} />

      <ContactDialog
        open={contactOpen}
        onClose={() => setContactOpen(false)}
      />
    </div>
  );
}
