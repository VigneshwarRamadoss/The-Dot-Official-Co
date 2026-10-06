import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/Button";

export default function BookACallPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#F5F5F5] text-[#040404]">
      <Navigation />

      <section className="pt-32 pb-20 px-4 md:px-8 max-w-[1440px] mx-auto w-full flex-1 flex flex-col justify-center">
        <div className="max-w-[720px] mx-auto text-center space-y-8 bg-white p-8 md:p-14 rounded-[32px] border border-[#E5E6E9] shadow-xl">
          <span className="font-sora text-[12px] font-semibold tracking-widest text-[#818084] uppercase">
            Book a Discovery Call
          </span>

          <h1 className="font-sora text-[36px] sm:text-[48px] md:text-[54px] font-bold tracking-tight text-[#040404] leading-tight">
            Let’s discuss your <br />
            <span className="font-editorial italic font-normal text-[#505354]">next project.</span>
          </h1>

          <p className="font-sora text-[15px] md:text-[17px] text-[#505354] leading-relaxed max-w-[540px] mx-auto">
            30-minute strategic introduction call with THE DOT founders. Bring us the messy version—we’ll start with the problem.
          </p>

          <form className="space-y-4 text-left max-w-[480px] mx-auto pt-4">
            <div>
              <label className="block font-sora text-xs font-semibold text-[#040404] mb-1.5">
                Your Name
              </label>
              <input
                type="text"
                placeholder="Jane Doe"
                className="w-full bg-[#F5F5F5] border border-[#E5E6E9] rounded-xl px-4 py-3 font-sora text-sm text-[#040404] focus:outline-none focus:ring-2 focus:ring-[#0B0D0E]"
                required
              />
            </div>

            <div>
              <label className="block font-sora text-xs font-semibold text-[#040404] mb-1.5">
                Work Email
              </label>
              <input
                type="email"
                placeholder="jane@company.com"
                className="w-full bg-[#F5F5F5] border border-[#E5E6E9] rounded-xl px-4 py-3 font-sora text-sm text-[#040404] focus:outline-none focus:ring-2 focus:ring-[#0B0D0E]"
                required
              />
            </div>

            <div>
              <label className="block font-sora text-xs font-semibold text-[#040404] mb-1.5">
                Tell us about the project
              </label>
              <textarea
                rows={3}
                placeholder="What business problem are you looking to solve?"
                className="w-full bg-[#F5F5F5] border border-[#E5E6E9] rounded-xl px-4 py-3 font-sora text-sm text-[#040404] focus:outline-none focus:ring-2 focus:ring-[#0B0D0E] resize-none"
              />
            </div>

            <Button variant="primary" showArrow={true} className="w-full justify-center text-sm py-3.5 mt-2">
              Submit & Schedule Call
            </Button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}
