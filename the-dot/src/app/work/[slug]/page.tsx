import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ContactCTA } from "@/components/ContactCTA";

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

/* =========================================================
   STATIC ROUTES
   ========================================================= */

export function generateStaticParams() {
  return Object.keys(projectsData).map((slug) => ({
    slug,
  }));
}

/* =========================================================
   CASE STUDY PAGE
   ========================================================= */

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } = await params;

  const project =
    projectsData[slug];

  if (!project) {
    notFound();
  }

  return (
    <main
      className="
        flex
        min-h-screen
        flex-col
        bg-[#F5F5F5]
        text-[#040404]
      "
    >
      <Navigation />

      {/* =================================================
          CASE STUDY HERO
         ================================================= */}

      <section
        className="
          mx-auto
          w-full
          max-w-[1440px]

          px-4
          pb-12
          pt-32

          md:px-8
        "
      >
        <div
          className="
            mb-8
            max-w-[900px]
            space-y-6
          "
        >
          <Link
            href="/work"
            className="
              inline-flex
              items-center
              gap-2

              font-sora
              text-[13px]
              font-medium

              text-[#818084]

              transition-colors

              hover:text-[#040404]
            "
          >
            ← Back to Work
          </Link>

          <span
            className="
              block

              font-sora
              text-[12px]
              font-semibold

              uppercase
              tracking-widest

              text-[#818084]
            "
          >
            {project.category}
          </span>

          <h1
            className="
              font-sora

              text-[40px]
              font-bold

              leading-[1.05]
              tracking-tight

              text-[#040404]

              sm:text-[56px]

              lg:text-[68px]
            "
          >
            {project.title}
          </h1>
        </div>

        {/* =================================================
            HERO MEDIA
           ================================================= */}

        <div
          className="
            relative

            my-8

            aspect-[16/9]
            w-full
            max-h-[620px]

            overflow-hidden

            rounded-[32px]

            border
            border-black/10

            shadow-2xl
          "
        >
          <Image
            src={project.heroImage}
            alt={project.title}
            fill
            priority
            className="object-cover"
            sizes="1440px"
          />
        </div>

        {/* =================================================
            METADATA
           ================================================= */}

        <div
          className="
            my-8

            grid
            grid-cols-2

            gap-6

            border-y
            border-[#E5E6E9]

            py-8

            font-sora
            text-[14px]

            md:grid-cols-4
          "
        >
          <div>
            <span
              className="
                block
                text-[12px]
                font-medium
                text-[#818084]
              "
            >
              Client
            </span>

            <span
              className="
                font-semibold
                text-[#040404]
              "
            >
              {project.client}
            </span>
          </div>

          <div>
            <span
              className="
                block
                text-[12px]
                font-medium
                text-[#818084]
              "
            >
              Role
            </span>

            <span
              className="
                font-semibold
                text-[#040404]
              "
            >
              {project.role}
            </span>
          </div>

          <div>
            <span
              className="
                block
                text-[12px]
                font-medium
                text-[#818084]
              "
            >
              Year
            </span>

            <span
              className="
                font-semibold
                text-[#040404]
              "
            >
              {project.year}
            </span>
          </div>

          <div>
            <span
              className="
                block
                text-[12px]
                font-medium
                text-[#818084]
              "
            >
              Category
            </span>

            <span
              className="
                font-semibold
                text-[#040404]
              "
            >
              {project.category}
            </span>
          </div>
        </div>

        {/* =================================================
            CASE STUDY CONTENT
           ================================================= */}

        <div
          className="
            mx-auto

            max-w-[840px]

            space-y-16

            py-12
          "
        >
          {/* =================================================
              CONTEXT + CHALLENGE
             ================================================= */}

          <div className="space-y-4">
            <h2
              className="
                font-sora

                text-[24px]
                font-bold

                text-[#040404]

                md:text-[30px]
              "
            >
              Context & Challenge
            </h2>

            <p
              className="
                font-sora

                text-[16px]

                leading-relaxed

                text-[#505354]

                md:text-[18px]
              "
            >
              {project.context}
            </p>

            <p
              className="
                font-sora

                text-[16px]

                leading-relaxed

                text-[#505354]

                md:text-[18px]
              "
            >
              {project.challenge}
            </p>
          </div>

          {/* =================================================
              STRATEGIC INSIGHT
             ================================================= */}

          <div
            className="
              space-y-4

              rounded-[24px]

              border
              border-[#22252A]

              bg-[#0B0C0D]

              p-8

              text-white

              md:p-12
            "
          >
            <span
              className="
                font-sora

                text-[12px]
                font-semibold

                uppercase
                tracking-widest

                text-[#9F9FA2]
              "
            >
              Strategic Insight
            </span>

            <blockquote
              className="
                font-sora

                text-[22px]
                font-bold

                leading-snug

                md:text-[28px]
              "
            >
              “{project.insight}”
            </blockquote>
          </div>

          {/* =================================================
              STRATEGY
             ================================================= */}

          <div className="space-y-4">
            <h2
              className="
                font-sora

                text-[24px]
                font-bold

                text-[#040404]

                md:text-[30px]
              "
            >
              Strategy & Execution
            </h2>

            <p
              className="
                font-sora

                text-[16px]

                leading-relaxed

                text-[#505354]

                md:text-[18px]
              "
            >
              {project.strategy}
            </p>
          </div>

          {/* =================================================
              OUTCOME
             ================================================= */}

          <div
            className="
              space-y-4

              border-t
              border-[#E5E6E9]

              pt-8
            "
          >
            <h2
              className="
                font-sora

                text-[24px]
                font-bold

                text-[#040404]

                md:text-[30px]
              "
            >
              Outcome & Impact
            </h2>

            <p
              className="
                font-sora

                text-[16px]

                leading-relaxed

                text-[#505354]

                md:text-[18px]
              "
            >
              {project.outcome}
            </p>
          </div>

          {/* =================================================
              NEXT PROJECT
             ================================================= */}

          <div
            className="
              flex

              items-center
              justify-between

              border-t
              border-[#E5E6E9]

              pt-12
            "
          >
            <span
              className="
                font-sora

                text-[13px]

                text-[#818084]
              "
            >
              Next Project
            </span>

            <Link
              href={`/work/${project.nextSlug}`}
              className="
                group

                flex
                items-center
                gap-2

                font-sora

                text-[20px]
                font-bold

                text-[#040404]

                transition-colors

                hover:text-[#505354]

                md:text-[24px]
              "
            >
              {project.nextTitle}

              <span
                className="
                  transition-transform
                  duration-200

                  group-hover:translate-x-1
                "
              >
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* =================================================
          CONTACT CTA
         ================================================= */}

      <ContactCTA />

      {/* =================================================
          FOOTER
         ================================================= */}

      <Footer />
    </main>
  );
}