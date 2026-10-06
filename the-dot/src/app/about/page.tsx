import { Navigation } from "@/components/Navigation";
import { About } from "@/components/About";
import { Team } from "@/components/Team";
import { ContactCTA } from "@/components/ContactCTA";
import { Footer } from "@/components/Footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#F5F5F5] text-[#040404]">
      <Navigation />

      <section className="pt-32 pb-8 px-4 md:px-8 max-w-[1440px] mx-auto w-full">
        <div className="max-w-[760px] mb-8 space-y-4">
          <span className="font-sora text-[12px] font-semibold tracking-widest text-[#818084] uppercase">
            About THE DOT
          </span>
          <h1 className="font-sora text-[44px] md:text-[64px] font-bold tracking-tight text-[#040404] leading-tight">
            More than a <span className="font-editorial italic font-normal text-[#505354]">studio.</span>
          </h1>
          <p className="font-sora text-[16px] md:text-[18px] text-[#505354] leading-relaxed">
            A team that turns business problems into digital products, brands, and experiences. Strategy driven. Design led. Built for what’s next.
          </p>
        </div>
      </section>

      <About />
      <Team />

      <ContactCTA />
      <Footer />
    </main>
  );
}
