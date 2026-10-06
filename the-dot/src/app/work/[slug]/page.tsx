import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ContactCTA } from "@/components/ContactCTA";
import { Button } from "@/components/Button";

interface ProjectDetail {
  slug: string;
  client: string;
  title: string;
  category: string;
  year: string;
  role: string;
  heroImage: string;
  context: string;
  challenge: string;
  insight: string;
  strategy: string;
  outcome: string;
  nextSlug: string;
  nextTitle: string;
}

const projectsData: Record<string, ProjectDetail> = {
  "swastik-corporation": {
    slug: "swastik-corporation",
    client: "Swastik Corporation",
    title: "Swastik Corporation ERP & Digital Platform",
    category: "Product Design & Web App",
    year: "2025",
    role: "Product Strategy, UI/UX, Design System",
    heroImage: "/images/work-office.jpg",
    context:
      "Swastik Corporation needed to modernize its legacy operations into a unified enterprise SaaS suite for real-time analytics and workflows.",
    challenge:
      "Complex operational data was fragmented across multiple tools, slowing decision-making and creating friction for internal teams.",
    insight:
      "Simplifying workflow hierarchy while preserving dense power-user tools leads to 3x faster task completion.",
    strategy:
      "We restructured the design system into a modular workspace canvas, streamlining primary operations into contextual panels.",
    outcome:
      "Unified digital platform deployed across enterprise teams, setting a modern product benchmark.",
    nextSlug: "orbit-studio",
    nextTitle: "Orbit Studio Brand Identity",
  },
  "orbit-studio": {
    slug: "orbit-studio",
    client: "Orbit Studio",
    title: "Orbit Studio Brand Identity & Flagship Website",
    category: "Brand & Digital Experience",
    year: "2025",
    role: "Brand Strategy, Visual Identity, Web Development",
    heroImage: "/images/work-interior.jpg",
    context:
      "Orbit Studio required a high-impact brand identity and modern web experience to match their growing international client roster.",
    challenge:
      "Translating a sophisticated physical design studio philosophy into a fast, fluid digital experience.",
    insight:
      "High-contrast editorial typography paired with restrained motion creates immediate international authority.",
    strategy:
      "Crafted an editorial visual language with custom micro-interactions and smooth scroll motion physics.",
    outcome:
      "Established Orbit Studio as a tier-one creative agency with record inbound client inquiries.",
    nextSlug: "skydic-outdoor",
    nextTitle: "Skydic Outdoor Showcase",
  },
  "skydic-outdoor": {
    slug: "skydic-outdoor",
    client: "Skydic Outdoor",
    title: "Skydic Outdoor Showcase & Product Ecosystem",
    category: "Design System & Product",
    year: "2024",
    role: "Design Architecture & Component System",
    heroImage: "/images/work-tower.jpg",
    context:
      "Skydic Outdoor expanding into new digital channels needed a cohesive component library and digital product ecosystem.",
    challenge:
      "Maintaining brand visual consistency across web, mobile apps, and physical retail displays.",
    insight:
      "Modular design tokens rooted in physical architecture textures provide seamless cross-medium continuity.",
    strategy:
      "Built a unified cross-platform token system and interactive web showcase.",
    outcome:
      "Scaled brand across 10+ digital products with zero visual tech debt.",
    nextSlug: "swastik-corporation",
    nextTitle: "Swastik Corporation ERP",
  },
};

export function generateStaticParams() {
  return Object.keys(projectsData).map((slug) => ({ slug }));
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projectsData[slug];

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen flex flex-col bg-[#F5F5F5] text-[#040404]">
      <Navigation />

      {/* Case Study Hero */}
      <section className="pt-32 pb-12 px-4 md:px-8 max-w-[1440px] mx-auto w-full">
        <div className="space-y-6 max-w-[900px] mb-8">
          <Link
            href="/work"
            className="font-sora text-[13px] font-medium text-[#818084] hover:text-[#040404] transition-colors inline-flex items-center gap-2"
          >
            ← Back to Work
          </Link>

          <span className="block font-sora text-[12px] font-semibold tracking-widest text-[#818084] uppercase">
            {project.category}
          </span>

          <h1 className="font-sora text-[40px] sm:text-[56px] lg:text-[68px] font-bold tracking-tight text-[#040404] leading-[1.05]">
            {project.title}
          </h1>
        </div>

        {/* Hero Shared Media Frame */}
        <div className="relative w-full aspect-[16/9] max-h-[620px] rounded-[32px] overflow-hidden shadow-2xl border border-black/10 my-8">
          <Image
            src={project.heroImage}
            alt={project.title}
            fill
            className="object-cover"
            priority
            sizes="1440px"
          />
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-[#E5E6E9] my-8 font-sora text-[14px]">
          <div>
            <span className="block text-[12px] text-[#818084] font-medium">Client</span>
            <span className="font-semibold text-[#040404]">{project.client}</span>
          </div>
          <div>
            <span className="block text-[12px] text-[#818084] font-medium">Role</span>
            <span className="font-semibold text-[#040404]">{project.role}</span>
          </div>
          <div>
            <span className="block text-[12px] text-[#818084] font-medium">Year</span>
            <span className="font-semibold text-[#040404]">{project.year}</span>
          </div>
          <div>
            <span className="block text-[12px] text-[#818084] font-medium">Category</span>
            <span className="font-semibold text-[#040404]">{project.category}</span>
          </div>
        </div>

        {/* Case Study Content Sections */}
        <div className="max-w-[840px] mx-auto py-12 space-y-16">
          {/* Context & Challenge */}
          <div className="space-y-4">
            <h2 className="font-sora text-[24px] md:text-[30px] font-bold text-[#040404]">
              Context & Challenge
            </h2>
            <p className="font-sora text-[16px] md:text-[18px] text-[#505354] leading-relaxed">
              {project.context}
            </p>
            <p className="font-sora text-[16px] md:text-[18px] text-[#505354] leading-relaxed">
              {project.challenge}
            </p>
          </div>

          {/* Strategic Insight */}
          <div className="bg-[#0B0C0D] text-white p-8 md:p-12 rounded-[24px] space-y-4 border border-[#22252A]">
            <span className="font-sora text-[12px] font-semibold text-[#9F9FA2] uppercase tracking-widest">
              Strategic Insight
            </span>
            <blockquote className="font-sora text-[22px] md:text-[28px] font-bold leading-snug">
              “{project.insight}”
            </blockquote>
          </div>

          {/* Strategy & Execution */}
          <div className="space-y-4">
            <h2 className="font-sora text-[24px] md:text-[30px] font-bold text-[#040404]">
              Strategy & Execution
            </h2>
            <p className="font-sora text-[16px] md:text-[18px] text-[#505354] leading-relaxed">
              {project.strategy}
            </p>
          </div>

          {/* Outcome */}
          <div className="space-y-4 border-t border-[#E5E6E9] pt-8">
            <h2 className="font-sora text-[24px] md:text-[30px] font-bold text-[#040404]">
              Outcome & Impact
            </h2>
            <p className="font-sora text-[16px] md:text-[18px] text-[#505354] leading-relaxed">
              {project.outcome}
            </p>
          </div>

          {/* Next Project Link */}
          <div className="pt-12 border-t border-[#E5E6E9] flex justify-between items-center">
            <span className="font-sora text-[13px] text-[#818084]">Next Project</span>
            <Link
              href={`/work/${project.nextSlug}`}
              className="font-sora text-[20px] md:text-[24px] font-bold text-[#040404] hover:text-[#505354] transition-colors flex items-center gap-2 group"
            >
              {project.nextTitle}
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </section>

      <ContactCTA />
      <Footer />
    </main>
  );
}
