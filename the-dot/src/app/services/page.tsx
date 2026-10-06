import { Navigation } from "@/components/Navigation";
import { Services } from "@/components/Services";
import { ContactCTA } from "@/components/ContactCTA";
import { Footer } from "@/components/Footer";

export default function ServicesPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#F5F5F5] text-[#040404]">
      <Navigation />

      <section className="pt-32 pb-12 px-4 md:px-8 max-w-[1440px] mx-auto w-full">
        <div className="max-w-[760px] mb-12 space-y-4">
          <span className="font-sora text-[12px] font-semibold tracking-widest text-[#818084] uppercase">
            Services & Capabilities
          </span>
          <h1 className="font-sora text-[44px] md:text-[64px] font-bold tracking-tight text-[#040404] leading-tight">
            Capabilities built for <br />
            <span className="font-editorial italic font-normal text-[#505354]">ambitious teams.</span>
          </h1>
          <p className="font-sora text-[16px] md:text-[18px] text-[#505354] leading-relaxed">
            We partner with B2B founders, product leaders, and marketing heads across four core disciplines.
          </p>
        </div>
      </section>

      <Services />

      <ContactCTA />
      <Footer />
    </main>
  );
}
