import { Navigation } from "@/components/Navigation";
import { ContactCTA } from "@/components/ContactDialog";
import { Footer } from "@/components/Footer";

export default function ContactPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#F5F5F5] text-[#040404]">
      <Navigation />

      <section className="pt-32 pb-8 px-4 md:px-8 max-w-[1440px] mx-auto w-full">
        <div className="max-w-[760px] mb-8 space-y-4">
          <span className="font-sora text-[12px] font-semibold tracking-widest text-[#818084] uppercase">
            Contact
          </span>
          <h1 className="font-sora text-[44px] md:text-[64px] font-bold tracking-tight text-[#040404] leading-tight">
            Start a project with <br />
            <span className="font-editorial italic font-normal text-[#505354]">THE DOT.</span>
          </h1>
          <p className="font-sora text-[16px] md:text-[18px] text-[#505354] leading-relaxed">
            Have something worth building? Bring us the messy version. We’ll start with the problem.
          </p>
        </div>
      </section>

      <ContactCTA />
      <Footer />
    </main>
  );
}
