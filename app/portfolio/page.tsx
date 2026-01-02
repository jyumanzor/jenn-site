"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

// Feature data for Jenn's Site
const jennsSiteFeatures = [
  {
    id: "running",
    title: "Running Dashboard",
    description: "Pfitzinger 18/70 training plan with interactive schedule, race history with gradient timelines, and World Major Marathon tracker.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: "health",
    title: "Health Metrics",
    description: "Integration with Oura Ring, Renpho scale, and Apple Watch. Real-time sleep, recovery, and training data visualization.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    id: "travel",
    title: "Travel Gallery",
    description: "Photography galleries organized by city with smooth carousels. Japan, France, Vietnam, and more with editorial layouts.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: "culture",
    title: "Culture Tracker",
    description: "Oscar and Pulitzer lists, Nobel Economics winners, film ratings, and book tracking with rich data visualization.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
      </svg>
    ),
  },
  {
    id: "tattoos",
    title: "Tattoo Timeline",
    description: "Interactive body map with 15 tattoos. Click-to-explore details, line art renders, and chronological timeline view.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
      </svg>
    ),
  },
  {
    id: "sandbox",
    title: "Design Sandbox",
    description: "Brand builder with color palette generator, prompt library for Claude, and experimental design tools.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    id: "io",
    title: "IO Admin Dashboard",
    description: "Private control center with therapy journal, work notes, music admin, and health tracking integration.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
];

// Skills data
const skillCategories = [
  {
    title: "Frontend",
    color: "deep",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
  },
  {
    title: "Design",
    color: "olive",
    skills: ["Figma", "UI/UX", "Editorial Style", "Brand Systems", "Typography"],
  },
  {
    title: "Data Viz",
    color: "sage",
    skills: ["Charts", "Dashboards", "D3.js", "Interactive Maps", "Timelines"],
  },
  {
    title: "Backend",
    color: "forest",
    skills: ["APIs", "Data Integration", "Node.js", "Vercel", "Supabase"],
  },
];

// Color palette for showcase
const colorPalette = [
  { name: "Deep Forest", hex: "#3B412D", category: "Primary" },
  { name: "Olive", hex: "#546E40", category: "Primary" },
  { name: "Sage", hex: "#97A97C", category: "Accent" },
  { name: "Lime", hex: "#d4ed39", category: "Accent" },
  { name: "Gold", hex: "#FABF34", category: "Highlight" },
  { name: "Honey", hex: "#FFCB69", category: "Highlight" },
  { name: "Tan", hex: "#CBAD8C", category: "Warm" },
  { name: "Cream", hex: "#F7E5DA", category: "Neutral" },
  { name: "Ivory", hex: "#FFF5EB", category: "Neutral" },
  { name: "Charcoal", hex: "#2F2F2C", category: "Text" },
];

export default function PortfolioPage() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="bg-cream min-h-screen">
      {/* Hero Section - Editorial with Gradient */}
      <section className="pt-8 pb-20 md:pt-20 md:pb-28 relative overflow-hidden">
        {/* Background gradient mesh */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: `
              radial-gradient(ellipse at 20% 30%, rgba(151,169,124,0.3) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 70%, rgba(212,237,57,0.15) 0%, transparent 40%),
              radial-gradient(ellipse at 50% 100%, rgba(84,110,64,0.2) 0%, transparent 50%)
            `,
          }}
        />

        <div className="container-editorial relative z-10">
          <div
            className={`max-w-3xl transition-all duration-1000 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <p
              className="text-xs uppercase tracking-[0.2em] mb-6"
              style={{ color: "#546E40" }}
            >
              Portfolio
            </p>
            <h1
              className="text-5xl md:text-7xl mb-8 leading-[1.05] tracking-tight"
              style={{
                fontFamily: "var(--font-instrument), Instrument Serif, Georgia, serif",
                color: "#2a3c24",
              }}
            >
              Designing with
              <br />
              <span
                className="italic"
                style={{
                  background: "linear-gradient(135deg, #546E40 0%, #97A97C 50%, #d4ed39 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                intention.
              </span>
            </h1>
            <p
              className="text-lg md:text-xl leading-relaxed max-w-2xl"
              style={{ color: "rgba(42,60,36,0.7)" }}
            >
              Building interfaces that feel considered. Every gradient, every interaction, every detail serves a purpose.
            </p>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Jenn's Site Showcase */}
      <section className="py-20" style={{ background: "linear-gradient(180deg, #FFF5EB 0%, #F7E5DA 100%)" }}>
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-12 items-start">
            {/* Left: Project Info */}
            <div className="md:col-span-5">
              <div className="sticky top-32">
                <p className="light-bg-label mb-4">Featured Project</p>
                <h2
                  className="text-4xl md:text-5xl mb-6 leading-tight"
                  style={{
                    fontFamily: "var(--font-instrument)",
                    color: "#2a3c24",
                  }}
                >
                  Jenn&apos;s Site
                </h2>
                <p className="text-base leading-relaxed mb-8" style={{ color: "rgba(42,60,36,0.75)" }}>
                  A personal digital space built with editorial precision. Running dashboards, travel galleries, culture tracking, and more—all unified under a warm, Graza-inspired aesthetic.
                </p>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {["Next.js", "TypeScript", "Tailwind CSS", "Vercel"].map((tech) => (
                    <span
                      key={tech}
                      className="px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
                      style={{
                        background: "linear-gradient(135deg, #2a3c24 0%, #4e6041 100%)",
                        color: "#d4ed39",
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Browser Mockup */}
                <div
                  className="rounded-xl overflow-hidden shadow-2xl"
                  style={{ background: "#2a3c24" }}
                >
                  {/* Browser Chrome */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                      <div className="w-3 h-3 rounded-full bg-green-400/80" />
                    </div>
                    <div
                      className="flex-1 mx-4 px-3 py-1 rounded text-xs"
                      style={{ background: "rgba(255,255,255,0.1)", color: "#97A97C" }}
                    >
                      jennumanzor.com
                    </div>
                  </div>
                  {/* Content Preview */}
                  <div className="p-6" style={{ background: "#F7E5DA" }}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full" style={{ background: "linear-gradient(135deg, #97A97C, #d4ed39)" }} />
                      <div>
                        <div className="h-4 w-24 rounded mb-1" style={{ background: "#2a3c24" }} />
                        <div className="h-3 w-32 rounded" style={{ background: "rgba(42,60,36,0.3)" }} />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="h-16 rounded-lg" style={{ background: "linear-gradient(135deg, #3B412D, #546E40)" }} />
                      <div className="h-16 rounded-lg" style={{ background: "linear-gradient(135deg, #546E40, #97A97C)" }} />
                      <div className="h-16 rounded-lg" style={{ background: "linear-gradient(135deg, #97A97C, #d4ed39)" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Features Grid */}
            <div className="md:col-span-7">
              <p className="light-bg-label mb-6">Key Features</p>
              <div className="space-y-4">
                {jennsSiteFeatures.map((feature, index) => (
                  <button
                    key={feature.id}
                    onClick={() => setActiveFeature(activeFeature === feature.id ? null : feature.id)}
                    className="w-full text-left rounded-xl p-6 transition-all duration-300 group"
                    style={{
                      background: activeFeature === feature.id
                        ? "linear-gradient(135deg, #2a3c24 0%, #4e6041 100%)"
                        : "#FFFFFF",
                      boxShadow: activeFeature === feature.id
                        ? "0 20px 40px rgba(42,60,36,0.2)"
                        : "0 2px 8px rgba(42,60,36,0.05)",
                      transform: activeFeature === feature.id ? "scale(1.02)" : "scale(1)",
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors"
                        style={{
                          background: activeFeature === feature.id
                            ? "rgba(212,237,57,0.2)"
                            : "linear-gradient(135deg, #97A97C 0%, #d4ed39 100%)",
                          color: activeFeature === feature.id ? "#d4ed39" : "#2a3c24",
                        }}
                      >
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3
                            className="text-lg font-medium transition-colors"
                            style={{
                              fontFamily: "var(--font-instrument)",
                              color: activeFeature === feature.id ? "#FFF5EB" : "#2a3c24",
                            }}
                          >
                            {feature.title}
                          </h3>
                          <svg
                            className={`w-5 h-5 transition-transform duration-300 ${
                              activeFeature === feature.id ? "rotate-180" : ""
                            }`}
                            style={{ color: activeFeature === feature.id ? "#d4ed39" : "#97A97C" }}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                        <div
                          className={`overflow-hidden transition-all duration-300 ${
                            activeFeature === feature.id ? "max-h-32 opacity-100 mt-3" : "max-h-0 opacity-0"
                          }`}
                        >
                          <p
                            className="text-sm leading-relaxed"
                            style={{ color: activeFeature === feature.id ? "rgba(255,245,235,0.8)" : "rgba(42,60,36,0.6)" }}
                          >
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* FTI Training Portal Showcase */}
      <section className="py-20" style={{ background: "linear-gradient(135deg, #003763 0%, #0067B1 50%, #00C9D4 100%)" }}>
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            {/* Left: Project Info */}
            <div className="md:col-span-6">
              <p className="text-xs uppercase tracking-wider mb-4" style={{ color: "#00C9D4" }}>Professional Work</p>
              <h2 className="text-4xl md:text-5xl mb-6 text-white" style={{ fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif' }}>
                FTI LDR Training Portal
              </h2>
              <p className="text-base leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.8)" }}>
                A comprehensive internal training platform built for FTI Consulting&apos;s Litigation &amp; Dispute Resolution practice. 71 pages, 14 interactive tools, and a 14-chapter R programming manual.
              </p>

              {/* Key Stats */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                {[
                  { value: "71", label: "Pages" },
                  { value: "14", label: "Tools" },
                  { value: "12", label: "Hubs" },
                  { value: "14", label: "R Chapters" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-instrument)' }}>{stat.value}</p>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>{stat.label}</p>
                  </div>
                ))}
              </div>

              <Link
                href="/work/fti-portal"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all hover:gap-3"
                style={{ background: "#1BB680", color: "white" }}
              >
                View Case Study
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {/* Right: Visual Representation - Bar Graph Navigation Mockup */}
            <div className="md:col-span-6">
              <div className="relative">
                {/* Floating shadow effect */}
                <div
                  className="absolute -top-4 -left-4 w-full h-full rounded-2xl opacity-30"
                  style={{ background: "linear-gradient(135deg, #00C9D4, #1BB680)", transform: "rotate(-2deg)" }}
                />
                <div
                  className="relative rounded-2xl p-6"
                  style={{ background: "#FFF8F0" }}
                >
                  {/* Mini header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#003763" }}>
                      <span className="text-white font-bold text-xs">FTI</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "#0067B1" }}>FTI Consulting</p>
                      <p className="text-xs font-semibold" style={{ color: "#003763" }}>Training Portal</p>
                    </div>
                  </div>

                  {/* Bar graph navigation mockup */}
                  <div className="grid grid-cols-6 gap-2 items-end mb-4">
                    {[
                      { height: 100, color: "#E0503D" },
                      { height: 130, color: "#003763" },
                      { height: 160, color: "#1BB680" },
                      { height: 140, color: "#008FBE" },
                      { height: 110, color: "#00C9D4" },
                      { height: 90, color: "#8B5CF6" },
                    ].map((bar, i) => (
                      <div key={i} className="rounded-t-lg" style={{ height: `${bar.height}px`, background: bar.color }} />
                    ))}
                  </div>

                  {/* Tool icons row */}
                  <div className="flex gap-2">
                    {["#003763", "#0067B1", "#00C9D4", "#1BB680"].map((color, i) => (
                      <div key={i} className="flex-1 h-12 rounded-lg" style={{ background: color, opacity: 0.2 }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Skills Section */}
      <section className="py-20" style={{ background: "#FFF5EB" }}>
        <div className="container-editorial">
          <div className="text-center mb-16">
            <p className="light-bg-label mb-4">Capabilities</p>
            <h2
              className="text-4xl md:text-5xl mb-6"
              style={{ fontFamily: "var(--font-instrument)", color: "#2a3c24" }}
            >
              Skills & Tools
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: "rgba(42,60,36,0.7)" }}>
              A focused toolkit for building thoughtful digital experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {skillCategories.map((category, idx) => {
              const gradients = {
                deep: "linear-gradient(160deg, #3B412D 0%, #3C422E 50%, #546E40 100%)",
                olive: "linear-gradient(160deg, #546E40 0%, #6B8B4E 50%, #97A97C 100%)",
                sage: "linear-gradient(160deg, #97A97C 0%, #A8B98D 50%, #B8C9A0 100%)",
                forest: "linear-gradient(160deg, #2a3c24 0%, #3B412D 50%, #4e6041 100%)",
              };
              const isLight = category.color === "sage";

              return (
                <div
                  key={category.title}
                  className="rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                  style={{
                    background: gradients[category.color as keyof typeof gradients],
                    animationDelay: `${idx * 100}ms`,
                  }}
                >
                  <h3
                    className="text-xl mb-6"
                    style={{
                      fontFamily: "var(--font-instrument)",
                      color: isLight ? "#2a3c24" : "#FFF5EB",
                    }}
                  >
                    {category.title}
                  </h3>
                  <div className="space-y-2">
                    {category.skills.map((skill) => (
                      <div
                        key={skill}
                        className="px-3 py-2 rounded-lg text-sm transition-all duration-200 cursor-default"
                        style={{
                          background: hoveredSkill === skill
                            ? isLight ? "rgba(42,60,36,0.15)" : "rgba(255,255,255,0.15)"
                            : isLight ? "rgba(42,60,36,0.08)" : "rgba(255,255,255,0.08)",
                          color: isLight ? "#2a3c24" : "rgba(255,245,235,0.9)",
                        }}
                        onMouseEnter={() => setHoveredSkill(skill)}
                        onMouseLeave={() => setHoveredSkill(null)}
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Design Philosophy */}
      <section className="py-20" style={{ background: "linear-gradient(180deg, #F7E5DA 0%, #EDE5D8 100%)" }}>
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-12">
            {/* Left: Philosophy Text */}
            <div className="md:col-span-5">
              <p className="light-bg-label mb-4">Philosophy</p>
              <h2
                className="text-4xl md:text-5xl mb-8 leading-tight"
                style={{ fontFamily: "var(--font-instrument)", color: "#2a3c24" }}
              >
                Editorial
                <br />
                Aesthetic
              </h2>
              <div className="space-y-6">
                <p className="leading-relaxed" style={{ color: "rgba(42,60,36,0.75)" }}>
                  Inspired by the warmth of Graza olive oil&apos;s branding—where playful meets refined. Every color choice, every gradient transition, every typographic decision serves the experience.
                </p>
                <p className="leading-relaxed" style={{ color: "rgba(42,60,36,0.75)" }}>
                  The palette moves from deep forest greens through sage accents to warm creams, creating spaces that feel both grounded and inviting.
                </p>
                <div className="pt-4">
                  <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#546E40" }}>Typography</p>
                  <div className="space-y-2">
                    <p style={{ fontFamily: "var(--font-instrument)", fontSize: "1.5rem", color: "#2a3c24" }}>
                      Instrument Serif
                    </p>
                    <p className="text-sm" style={{ color: "rgba(42,60,36,0.6)" }}>
                      DM Sans for body text
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Color Palette Grid */}
            <div className="md:col-span-7">
              <p className="light-bg-label mb-6">The Palette</p>
              <div className="grid grid-cols-5 gap-3">
                {colorPalette.map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => copyToClipboard(color.hex)}
                    className="group relative aspect-square rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg"
                    style={{ background: color.hex }}
                  >
                    {/* Tooltip on hover */}
                    <div
                      className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-xs"
                      style={{ background: "#2a3c24", color: "#FFF5EB" }}
                    >
                      {copiedColor === color.hex ? "Copied!" : color.name}
                      <div
                        className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent"
                        style={{ borderTopColor: "#2a3c24" }}
                      />
                    </div>
                    {/* Hex on the swatch */}
                    <div className="absolute bottom-2 left-0 right-0 text-center">
                      <span
                        className="text-[8px] font-mono opacity-0 group-hover:opacity-100 transition-opacity px-1.5 py-0.5 rounded"
                        style={{
                          background: "rgba(0,0,0,0.2)",
                          color: ["#FFF5EB", "#F7E5DA", "#CBAD8C", "#d4ed39", "#FFCB69"].includes(color.hex)
                            ? "#2a3c24"
                            : "#FFF5EB",
                        }}
                      >
                        {color.hex}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Gradient Examples */}
              <div className="mt-8 space-y-4">
                <p className="text-xs uppercase tracking-widest" style={{ color: "#546E40" }}>Gradient Panels</p>
                <div className="grid grid-cols-3 gap-3">
                  <div
                    className="h-20 rounded-xl"
                    style={{ background: "linear-gradient(160deg, #3B412D 0%, #3C422E 50%, #546E40 100%)" }}
                  />
                  <div
                    className="h-20 rounded-xl"
                    style={{ background: "linear-gradient(160deg, #97A97C 0%, #546E40 60%, #3C422E 100%)" }}
                  />
                  <div
                    className="h-20 rounded-xl"
                    style={{ background: "linear-gradient(160deg, #CBAD8C 0%, #97A97C 60%, #546E40 100%)" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Call to Action */}
      <section className="py-20" style={{ background: "linear-gradient(180deg, #2a3c24 0%, #3B412D 100%)" }}>
        <div className="container-editorial text-center">
          <h2 className="dark-bg-header text-3xl md:text-4xl mb-6">
            Let&apos;s build something together.
          </h2>
          <p className="dark-bg-body text-base mb-10 max-w-lg mx-auto">
            I&apos;m always interested in thoughtful projects that prioritize design and user experience.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:j.umanzor@ymail.com"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-medium transition-all hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #d4ed39 0%, #97A97C 100%)",
                color: "#2a3c24",
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Get in Touch
            </a>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-medium transition-all hover:scale-105"
              style={{
                background: "rgba(255,255,255,0.1)",
                color: "#FFF5EB",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="py-8" style={{ background: "#2a3c24" }}>
        <div className="container-editorial">
          <p className="text-center text-xs" style={{ color: "rgba(255,245,235,0.4)" }}>
            Built with Next.js, TypeScript, and Tailwind CSS. Designed with intention.
          </p>
        </div>
      </section>
    </div>
  );
}
