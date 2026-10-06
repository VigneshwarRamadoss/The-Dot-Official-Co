import Link from "next/link";
import Image from "next/image";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ContactCTA } from "@/components/ContactCTA";

const allProjects = [
  {
    slug: "swastik-corporation",
    client: "Swastik Corporation",
    title: "Swastik Corporation ERP & Digital Platform",
    category: "Product Design",
    tags: ["ERP", "Product Design", "Web App"],
    image: "/images/work-office.jpg",
    number: "01",
    description: "End-to-end digital transformation and ERP platform design for enterprise architecture.",
  },
  {
    slug: "orbit-studio",
    client: "Orbit Studio",
    title: "Orbit Studio Brand Identity & Flagship Website",
    category: "Brand & Web",
    tags: ["Brand", "Web Design", "Systems"],
    image: "/images/work-interior.jpg",
    number: "02",
    description: "Cinematic brand strategy, design system, and digital presence for high-growth studio.",
  },
  {
    slug: "skydic-outdoor",
    client: "Skydic Outdoor",
    title: "Skydic Outdoor Showcase & Product Ecosystem",
    category: "Design System",
    tags: ["Design System", "Product", "Growth"],
    image: "/images/work-tower.jpg",
    number: "03",
    description: "Integrated digital product ecosystem and modular component architecture.",
  },
];

export default function WorkPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#F5F5F5] text-[#040404]">
      <Navigation />

      <section className="pt-32 pb-16 px-4 md:px-8 max-w-[1440px] mx-auto w-full">
        {/* Page Header */}
        <div className="max-w-[720px] mb-16 space-y-4">
          <span className="font-sora text-[12px] font-semibold tracking-widest text-[#818084] uppercase">
            Work
          </span>
          <h1 className="font-sora text-[44px] md:text-[64px] font-bold tracking-tight text-[#040404] leading-tight">
            Selected Work <span className="font-editorial italic font-normal text-[#505354]">& Case Studies</span>
          </h1>
          <p className="font-sora text-[16px] md:text-[18px] text-[#505354] leading-relaxed">
            A showcase of digital products, brand identities, and web platforms built for ambitious teams.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {allProjects.map((project) => (
            <Link
              key={project.slug}
              href={`/work/${project.slug}`}
              className="group relative bg-[#080A0B] rounded-[28px] overflow-hidden border border-[#22252A] shadow-xl flex flex-col justify-between p-6 md:p-8 min-h-[440px] text-white transition-transform duration-300 hover:-translate-y-2"
              data-cursor="view"
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
                sizes="(max-width: 768px) 100vw, 600px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 pointer-events-none" />

              <div className="relative z-10 flex justify-between items-center">
                <span className="font-sora text-[13px] font-medium text-white/70">
                  {project.number}
                </span>
                <span className="font-sora text-[12px] font-semibold text-white/90 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                  {project.category}
                </span>
              </div>

              <div className="relative z-10 space-y-3">
                <h2 className="font-sora text-[28px] md:text-[34px] font-bold text-white tracking-tight leading-snug">
                  {project.title}
                </h2>
                <p className="font-sora text-[14px] text-white/80 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex items-center gap-2 pt-2">
                  {project.tags.map((tag, i) => (
                    <span key={i} className="font-sora text-[11px] text-white/60">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <ContactCTA />
      <Footer />
    </main>
  );
}
