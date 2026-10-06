import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { SelectedWork } from "@/components/SelectedWork";
import { Approach } from "@/components/Approach";
import { WhyUs } from "@/components/WhyUs";
import { Team } from "@/components/Team";
import { ContactCTA } from "@/components/ContactCTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-[#F5F5F5] text-[#040404]">
      {/* 01 Navigation */}
      <Navigation />

      {/* 01 Hero */}
      <Hero />

      {/* 02 About */}
      <About />

      {/* 03 Services */}
      <Services />

      {/* 04 Selected Work */}
      <SelectedWork />

      {/* 05 Approach */}
      <Approach />

      {/* 06 Why Us */}
      <WhyUs />

      {/* 07 Team + Credibility */}
      <Team />

      {/* 08 Contact */}
      <ContactCTA />

      {/* Footer */}
      <Footer />
    </main>
  );
}
