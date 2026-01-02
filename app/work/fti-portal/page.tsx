"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const portalStats = {
  totalPages: 30,
  tools: 10,
  trainingCategories: 8,
  rManualChapters: 14,
};

const tools = [
  { name: "Damages Theory Builder", desc: "Guided framework for damages analysis with case precedent mapping", color: "#E0503D" },
  { name: "Market Definition Scratchpad", desc: "Brown Shoe factors, SSNIP calculator, evidence checklists", color: "#8B5CF6" },
  { name: "Timeline Generator", desc: "Professional case timelines with party color-coding", color: "#00C9D4" },
  { name: "QC Checklist Builder", desc: "Custom quality control with progress tracking", color: "#1BB680" },
  { name: "Citation Reformatter", desc: "Convert between citation formats with templates", color: "#0067B1" },
  { name: "Source Library", desc: "Searchable database of data sources and references", color: "#003763" },
  { name: "Excel Standards Guide", desc: "Visual do/don't examples with quick check tool", color: "#1BB680" },
  { name: "Project Folder Generator", desc: "Standardized folder structures with shell scripts", color: "#008FBE" },
  { name: "Document Templates", desc: "Expert report structures with click-to-copy sections", color: "#E0503D" },
  { name: "Methodology Diagrams", desc: "Interactive visualization of economic methodologies", color: "#003763" },
];

const hubs = [
  { name: "Standards Hub", items: ["Best Practices Manual", "Excel QC Standards", "Copyediting Guide", "Version Control"], icon: "shield" },
  { name: "R Manual", items: ["14 chapters", "Data manipulation", "Visualization", "Econometrics"], icon: "code" },
  { name: "Technical Training", items: ["Stata", "Excel", "VBA Automation", "SQL Basics"], icon: "terminal" },
  { name: "Consultant Roadmap", items: ["New Hire Journey", "Time Entry Guide", "Communication Skills"], icon: "map" },
  { name: "Case Studies", items: ["IP/Pharma", "Antitrust", "Securities", "Class Actions"], icon: "briefcase" },
  { name: "Economics Deep Dives", items: ["IP Damages", "Hatch-Waxman", "Business Valuation"], icon: "chart" },
  { name: "Templates Hub", items: ["Excel", "PowerPoint", "Word", "Project Folders"], icon: "file" },
  { name: "AI & Automation", items: ["Best Practices", "Prompt Bank", "Automation Guide"], icon: "sparkle" },
];

// Bar graph navigation items from the actual FTI portal
const barGraphItems = [
  { name: "Library", height: 140, color: "from-[#e86855] via-[#E0503D] to-[#c94030]" },
  { name: "Tools", height: 170, color: "from-[#004a80] via-[#003763] to-[#002847]" },
  { name: "Economics", height: 200, color: "from-[#28c990] via-[#1BB680] to-[#15996b]" },
  { name: "R Manual", height: 180, color: "from-[#00a8d8] via-[#008FBE] to-[#0076a0]" },
  { name: "Standards", height: 155, color: "from-[#00d4d4] via-[#00C9D4] to-[#00b0b0]" },
  { name: "Team", height: 125, color: "from-[#a78bfa] via-[#8B5CF6] to-[#7c3aed]" },
];

export default function FTIPortalPage() {
  const [activeHub, setActiveHub] = useState(0);
  const [activeToolIndex, setActiveToolIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // Auto-rotate tools showcase
  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveToolIndex((prev) => (prev + 1) % tools.length);
        setIsAnimating(false);
      }, 300);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFF5EB' }}>
      {/* Hero */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-24 relative overflow-hidden">
        {/* Background gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #003763 0%, #0067B1 50%, #00C9D4 100%)',
          }}
        />
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="dots" width="4" height="4" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="0.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#dots)" />
          </svg>
        </div>

        <div className="container-editorial relative z-10">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Work
          </Link>

          <div className="grid md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-7">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#1BB680]/20 text-[#1BB680]">
                  Internal Tool
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/80">
                  Next.js + TypeScript
                </span>
              </div>
              <h1
                className="text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight"
                style={{ fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif' }}
              >
                FTI LDR Training Portal
              </h1>
              <p className="text-white/80 text-lg md:text-xl leading-relaxed max-w-2xl">
                A comprehensive internal training platform built for FTI Consulting&apos;s
                Litigation &amp; Dispute Resolution practice. 30+ pages, 10 interactive tools,
                and an 14-chapter R programming manual.
              </p>
            </div>

            {/* Stats */}
            <div className="md:col-span-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur rounded-2xl p-5 text-center border border-white/10">
                  <p className="text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-instrument)' }}>
                    {portalStats.totalPages}+
                  </p>
                  <p className="text-white/60 text-xs uppercase tracking-wider mt-1">Pages Built</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-2xl p-5 text-center border border-white/10">
                  <p className="text-4xl font-bold" style={{ fontFamily: 'var(--font-instrument)', color: '#1BB680' }}>
                    {portalStats.tools}
                  </p>
                  <p className="text-white/60 text-xs uppercase tracking-wider mt-1">Interactive Tools</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-2xl p-5 text-center border border-white/10">
                  <p className="text-4xl font-bold" style={{ fontFamily: 'var(--font-instrument)', color: '#00C9D4' }}>
                    {portalStats.trainingCategories}
                  </p>
                  <p className="text-white/60 text-xs uppercase tracking-wider mt-1">Training Hubs</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-2xl p-5 text-center border border-white/10">
                  <p className="text-4xl font-bold" style={{ fontFamily: 'var(--font-instrument)', color: '#E8A847' }}>
                    {portalStats.rManualChapters}
                  </p>
                  <p className="text-white/60 text-xs uppercase tracking-wider mt-1">R Manual Chapters</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== VISUAL MOCKUP: Bar Graph Navigation ========== */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="container-editorial">
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#E0503D' }}>
              Signature Design Element
            </p>
            <h2
              className="text-3xl md:text-4xl mb-4"
              style={{ fontFamily: 'var(--font-instrument)', color: '#003763' }}
            >
              Data-Viz Inspired Navigation
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(59,65,45,0.8)' }}>
              Quick access styled as a bar graph—each section&apos;s height varies creating visual rhythm and hierarchy.
            </p>
          </div>

          {/* Interactive Bar Graph Mockup */}
          <div className="relative max-w-4xl mx-auto px-4">
            {/* Mockup Container with Browser Chrome */}
            <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-200">
              {/* Browser Chrome */}
              <div className="bg-gray-100 px-4 py-3 flex items-center gap-3 border-b">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-white px-4 py-1 rounded-lg text-sm text-gray-500 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    fti-training-portal.vercel.app
                  </div>
                </div>
              </div>

              {/* Portal Content */}
              <div className="bg-[#FFF8F0] p-8">
                {/* Mini Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#003763] flex items-center justify-center">
                      <span className="text-white font-bold text-sm">FTI</span>
                    </div>
                    <div>
                      <p className="text-[#0067B1] text-[10px] font-medium uppercase tracking-wider">FTI Consulting</p>
                      <p className="text-[#003763] text-sm font-semibold">Training Portal</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-8 bg-white rounded-lg border border-gray-200 flex items-center px-3">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span className="text-gray-400 text-xs ml-2">Search...</span>
                    </div>
                  </div>
                </div>

                {/* Bar Graph Navigation - Actual Render */}
                <div className="relative pb-4">
                  {/* Y-axis hint lines */}
                  <div className="absolute bottom-0 left-0 right-0 h-[220px] pointer-events-none">
                    <div className="absolute bottom-[25%] left-0 right-0 h-[1px] bg-[#003763]/5" />
                    <div className="absolute bottom-[50%] left-0 right-0 h-[1px] bg-[#003763]/5" />
                    <div className="absolute bottom-[75%] left-0 right-0 h-[1px] bg-[#003763]/5" />
                  </div>

                  {/* X-axis baseline */}
                  <div className="absolute bottom-0 left-0 right-0 flex items-center">
                    <div className="w-2 h-2 border-l border-b border-gray-300 rotate-45 -ml-1" />
                    <div className="flex-1 h-[1px] bg-gray-300" />
                    <div className="w-2 h-2 border-r border-t border-gray-300 rotate-45 -mr-1" />
                  </div>

                  {/* Bars */}
                  <div className="grid grid-cols-6 gap-3 items-end relative z-10">
                    {barGraphItems.map((bar, i) => (
                      <div
                        key={bar.name}
                        className="group cursor-pointer"
                        onMouseEnter={() => setHoveredBar(i)}
                        onMouseLeave={() => setHoveredBar(null)}
                      >
                        <div
                          className={`rounded-t-xl bg-gradient-to-b ${bar.color} transition-all duration-300 flex flex-col justify-between p-3 relative overflow-hidden ${
                            hoveredBar === i ? 'shadow-xl -translate-y-2' : 'shadow-lg'
                          }`}
                          style={{ height: `${bar.height}px` }}
                        >
                          {/* Glossy overlay */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-white/5 to-black/20 pointer-events-none" />
                          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.3)_0%,_transparent_50%)] pointer-events-none" />

                          {/* Icon */}
                          <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center relative z-10">
                            <div className="w-3 h-3 rounded-full bg-white/80" />
                          </div>

                          {/* Label */}
                          <span className="text-white text-sm font-medium relative z-10" style={{ fontFamily: 'var(--font-instrument)' }}>
                            {bar.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-center text-xs text-gray-400 mt-4">
                  Hover to interact • Each bar links to a different training hub
                </p>
              </div>
            </div>

            {/* Floating annotation */}
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 translate-x-full hidden lg:block">
              <div className="bg-[#003763] text-white px-4 py-3 rounded-xl shadow-xl max-w-[200px] relative">
                <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#003763] rotate-45" />
                <p className="text-xs leading-relaxed">
                  <span className="text-[#00C9D4] font-medium">Heights vary</span> to create visual interest and hierarchy—breaking from standard nav patterns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== VISUAL MOCKUP: Team Dashboard ========== */}
      <section className="py-16" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-5">
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#8B5CF6' }}>
                Admin Feature
              </p>
              <h2
                className="text-3xl md:text-4xl mb-4"
                style={{ fontFamily: 'var(--font-instrument)', color: '#003763' }}
              >
                Team Dashboard
              </h2>
              <p className="text-lg mb-6" style={{ color: 'rgba(59,65,45,0.8)' }}>
                Birthdays, PTO tracking, time entry codes, and team directory—all in one place.
              </p>
              <div className="space-y-3">
                {[
                  { icon: "🎂", text: "Upcoming birthday alerts" },
                  { icon: "📅", text: "In-office calendar view" },
                  { icon: "⏱️", text: "Common time entry codes" },
                  { icon: "👥", text: "Team expertise directory" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <span style={{ color: 'rgba(59,65,45,0.8)' }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dashboard Mockup */}
            <div className="md:col-span-7">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                {/* Gradient Header */}
                <div
                  className="p-6 relative overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #003763 0%, #0067B1 100%)' }}
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#00C9D4]/10 rounded-full blur-3xl" />
                  <div className="relative z-10">
                    <p className="text-[#00C9D4] text-xs font-medium uppercase tracking-wider mb-1">Team & Admin</p>
                    <h3 className="text-white text-xl" style={{ fontFamily: 'var(--font-instrument)' }}>Team Dashboard</h3>
                  </div>
                </div>

                {/* Dashboard Content */}
                <div className="bg-white p-6 grid grid-cols-2 gap-4">
                  {/* Time Entry Codes Card */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-[#0067B1]/10 flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#0067B1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-sm font-semibold text-[#003763]">Time Codes</span>
                    </div>
                    <div className="space-y-1.5 text-[10px]">
                      <div className="flex justify-between items-center p-1.5 bg-white rounded-lg">
                        <span className="font-mono font-medium text-[#003763]">500000.1USA-100</span>
                        <span className="text-gray-500">PTO</span>
                      </div>
                      <div className="flex justify-between items-center p-1.5 bg-[#1BB680]/10 rounded-lg">
                        <span className="font-mono font-medium text-[#1BB680]">005012.0354-100</span>
                        <span className="text-gray-500">Training</span>
                      </div>
                      <div className="flex justify-between items-center p-1.5 bg-[#0067B1]/10 rounded-lg">
                        <span className="font-mono font-medium text-[#0067B1]">500001.8481-100</span>
                        <span className="text-gray-500">Professional</span>
                      </div>
                    </div>
                  </div>

                  {/* Upcoming Events Card */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-[#E8A847]/10 flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#E8A847]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                      </div>
                      <span className="text-sm font-semibold text-[#003763]">Upcoming</span>
                    </div>
                    <div className="space-y-2">
                      {[
                        { initials: "TM", name: "Tess M.", date: "Jan 5", color: "#003763" },
                        { initials: "GS", name: "Guilherme S.", date: "Jan 7", color: "#0067B1" },
                        { initials: "KM", name: "Kristen M.", date: "Jan 16", color: "#1BB680" },
                      ].map((person, i) => (
                        <div key={i} className="flex items-center gap-2 p-1.5 bg-white rounded-lg border-l-2" style={{ borderColor: '#E8A847' }}>
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[8px] font-semibold"
                            style={{ backgroundColor: person.color }}
                          >
                            {person.initials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-medium text-gray-800 truncate">{person.name}&apos;s Birthday</p>
                            <p className="text-[8px] text-gray-500">{person.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Links Row */}
                  <div className="col-span-2 flex gap-3">
                    {[
                      { label: "Directory", color: "#8B5CF6" },
                      { label: "In-Office", color: "#00C9D4" },
                      { label: "PTO", color: "#1BB680" },
                      { label: "Birthdays", color: "#E8A847" },
                    ].map((link) => (
                      <div
                        key={link.label}
                        className="flex-1 p-3 rounded-xl bg-white border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div
                          className="w-8 h-8 rounded-lg mb-2 flex items-center justify-center"
                          style={{ backgroundColor: `${link.color}15` }}
                        >
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: link.color }} />
                        </div>
                        <p className="text-xs font-medium text-[#003763]">{link.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== VISUAL: Animated Tool Showcase ========== */}
      <section className="py-16 bg-white">
        <div className="container-editorial">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#1BB680' }}>
              Purpose-Built Utilities
            </p>
            <h2
              className="text-3xl md:text-4xl mb-4"
              style={{ fontFamily: 'var(--font-instrument)', color: '#003763' }}
            >
              10 Interactive Tools
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(59,65,45,0.8)' }}>
              Each tool was designed to solve a specific workflow problem.
            </p>
          </div>

          {/* Animated Tool Display */}
          <div className="max-w-4xl mx-auto">
            {/* Main Featured Tool */}
            <div
              className={`relative rounded-2xl p-8 mb-6 transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
              style={{
                background: `linear-gradient(135deg, ${tools[activeToolIndex].color}15 0%, ${tools[activeToolIndex].color}05 100%)`,
                borderLeft: `4px solid ${tools[activeToolIndex].color}`,
              }}
            >
              <div className="flex items-start gap-6">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: tools[activeToolIndex].color }}
                >
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{ backgroundColor: tools[activeToolIndex].color, color: 'white' }}
                    >
                      Tool {activeToolIndex + 1} of 10
                    </span>
                  </div>
                  <h3 className="text-2xl font-semibold mb-2" style={{ color: '#003763' }}>
                    {tools[activeToolIndex].name}
                  </h3>
                  <p className="text-lg" style={{ color: 'rgba(59,65,45,0.8)' }}>
                    {tools[activeToolIndex].desc}
                  </p>
                </div>
              </div>

              {/* Animated Progress Bar */}
              <div className="mt-6 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-[3000ms] ease-linear"
                  style={{
                    backgroundColor: tools[activeToolIndex].color,
                    width: isAnimating ? '0%' : '100%',
                  }}
                />
              </div>
            </div>

            {/* Tool Grid */}
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {tools.map((tool, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setIsAnimating(true);
                    setTimeout(() => {
                      setActiveToolIndex(i);
                      setIsAnimating(false);
                    }, 300);
                  }}
                  className={`p-3 rounded-xl transition-all ${
                    activeToolIndex === i
                      ? 'ring-2 ring-offset-2 scale-110 shadow-lg'
                      : 'hover:scale-105 opacity-60 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: `${tool.color}15`,
                    ringColor: tool.color,
                  }}
                >
                  <div
                    className="w-full aspect-square rounded-lg"
                    style={{ backgroundColor: tool.color }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== VISUAL: Architecture Diagram ========== */}
      <section className="py-16" style={{ backgroundColor: '#003763' }}>
        <div className="container-editorial">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#00C9D4' }}>
              Technical Architecture
            </p>
            <h2
              className="text-3xl md:text-4xl text-white mb-4"
              style={{ fontFamily: 'var(--font-instrument)' }}
            >
              Built to Scale
            </h2>
            <p className="text-lg max-w-2xl mx-auto text-white/70">
              A modular architecture that makes it easy to add new training content and tools.
            </p>
          </div>

          {/* Architecture Diagram */}
          <div className="max-w-4xl mx-auto">
            <svg viewBox="0 0 800 400" className="w-full" style={{ fontFamily: 'system-ui' }}>
              {/* Background */}
              <defs>
                <linearGradient id="nodeGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00C9D4" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#1BB680" stopOpacity="0.2"/>
                </linearGradient>
                <linearGradient id="nodeGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0067B1" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#003763" stopOpacity="0.2"/>
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Connection Lines */}
              <path d="M 400 80 L 400 140" stroke="#00C9D4" strokeWidth="2" strokeDasharray="5,5" opacity="0.5"/>
              <path d="M 400 200 L 200 280" stroke="#1BB680" strokeWidth="2" strokeDasharray="5,5" opacity="0.5"/>
              <path d="M 400 200 L 400 280" stroke="#0067B1" strokeWidth="2" strokeDasharray="5,5" opacity="0.5"/>
              <path d="M 400 200 L 600 280" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="5,5" opacity="0.5"/>

              {/* Central Hub */}
              <rect x="300" y="140" width="200" height="60" rx="12" fill="url(#nodeGradient1)" stroke="#00C9D4" strokeWidth="2"/>
              <text x="400" y="175" textAnchor="middle" fill="white" fontSize="14" fontWeight="600">Next.js App Router</text>

              {/* Top Node */}
              <rect x="325" y="20" width="150" height="50" rx="10" fill="url(#nodeGradient2)" stroke="#0067B1" strokeWidth="2"/>
              <text x="400" y="50" textAnchor="middle" fill="white" fontSize="12" fontWeight="500">TypeScript + Tailwind</text>

              {/* Bottom Nodes */}
              <g filter="url(#glow)">
                {/* Training Hubs */}
                <rect x="100" y="280" width="160" height="80" rx="10" fill="url(#nodeGradient1)" stroke="#1BB680" strokeWidth="2"/>
                <text x="180" y="310" textAnchor="middle" fill="#1BB680" fontSize="10" fontWeight="600">TRAINING HUBS</text>
                <text x="180" y="330" textAnchor="middle" fill="white" fontSize="11">8 Categories</text>
                <text x="180" y="348" textAnchor="middle" fill="white/70" fontSize="10">R Manual • Econ • AI</text>

                {/* Interactive Tools */}
                <rect x="320" y="280" width="160" height="80" rx="10" fill="url(#nodeGradient2)" stroke="#0067B1" strokeWidth="2"/>
                <text x="400" y="310" textAnchor="middle" fill="#00C9D4" fontSize="10" fontWeight="600">INTERACTIVE TOOLS</text>
                <text x="400" y="330" textAnchor="middle" fill="white" fontSize="11">10 Utilities</text>
                <text x="400" y="348" textAnchor="middle" fill="white/70" fontSize="10">QC • Citation • Timeline</text>

                {/* Team Dashboard */}
                <rect x="540" y="280" width="160" height="80" rx="10" fill="url(#nodeGradient1)" stroke="#8B5CF6" strokeWidth="2"/>
                <text x="620" y="310" textAnchor="middle" fill="#8B5CF6" fontSize="10" fontWeight="600">TEAM FEATURES</text>
                <text x="620" y="330" textAnchor="middle" fill="white" fontSize="11">Dashboard + Admin</text>
                <text x="620" y="348" textAnchor="middle" fill="white/70" fontSize="10">PTO • Birthdays • Dir</text>
              </g>

              {/* Floating Stats */}
              <circle cx="100" cy="150" r="35" fill="#1BB680" opacity="0.2"/>
              <text x="100" y="145" textAnchor="middle" fill="#1BB680" fontSize="18" fontWeight="700">30+</text>
              <text x="100" y="162" textAnchor="middle" fill="white" fontSize="9">pages</text>

              <circle cx="700" cy="150" r="35" fill="#E0503D" opacity="0.2"/>
              <text x="700" y="145" textAnchor="middle" fill="#E0503D" fontSize="18" fontWeight="700">14</text>
              <text x="700" y="162" textAnchor="middle" fill="white" fontSize="9">R chapters</text>
            </svg>
          </div>

          {/* Tech Stack Pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {['Next.js 15', 'TypeScript', 'Tailwind CSS', 'React Hooks', 'LocalStorage', 'Vercel'].map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 rounded-full text-sm bg-white/10 border border-white/20 text-white"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Training Hubs */}
      <section className="py-16 bg-white">
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-4">
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#0067B1' }}>
                Comprehensive Coverage
              </p>
              <h2
                className="text-2xl md:text-3xl mb-4"
                style={{ fontFamily: 'var(--font-instrument)', color: '#003763' }}
              >
                8 Training Hubs
              </h2>
              <p className="mb-6" style={{ color: 'rgba(59,65,45,0.8)' }}>
                From onboarding new hires to deep-dive economics training, each hub
                provides structured learning paths.
              </p>

              {/* Hub selector */}
              <div className="space-y-2">
                {hubs.map((hub, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveHub(i)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      activeHub === i
                        ? 'bg-[#003763] text-white shadow-lg'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    style={{ color: activeHub === i ? '#FFF5EB' : '#003763' }}
                  >
                    <span className="font-medium">{hub.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-8">
              <div
                className="rounded-2xl p-8 h-full"
                style={{
                  background: 'linear-gradient(135deg, #003763 0%, #0067B1 100%)',
                }}
              >
                <h3
                  className="text-2xl text-white mb-6"
                  style={{ fontFamily: 'var(--font-instrument)' }}
                >
                  {hubs[activeHub].name}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {hubs[activeHub].items.map((item, i) => (
                    <div
                      key={i}
                      className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/10"
                    >
                      <span className="text-white/90">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== VISUAL: Color Palette Showcase ========== */}
      <section className="py-16" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="container-editorial">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#0067B1' }}>
              Brand Extension
            </p>
            <h2
              className="text-3xl md:text-4xl mb-4"
              style={{ fontFamily: 'var(--font-instrument)', color: '#003763' }}
            >
              FTI Brand System
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(59,65,45,0.8)' }}>
              Extended FTI&apos;s corporate colors into a functional design system with gradients,
              functional variants, and accessible combinations.
            </p>
          </div>

          {/* Color System */}
          <div className="max-w-4xl mx-auto">
            {/* Primary Colors */}
            <div className="flex gap-4 mb-8">
              {[
                { color: '#003763', name: 'FTI Navy', role: 'Primary', textColor: 'white' },
                { color: '#0067B1', name: 'FTI Blue', role: 'Secondary', textColor: 'white' },
                { color: '#00C9D4', name: 'Cyan', role: 'Accent', textColor: '#003763' },
                { color: '#1BB680', name: 'Green', role: 'Success', textColor: 'white' },
              ].map((c) => (
                <div key={c.color} className="flex-1">
                  <div
                    className="aspect-square rounded-2xl shadow-lg mb-3 flex flex-col justify-end p-4"
                    style={{ backgroundColor: c.color }}
                  >
                    <span className="text-sm font-medium" style={{ color: c.textColor }}>{c.name}</span>
                    <span className="text-xs opacity-70" style={{ color: c.textColor }}>{c.role}</span>
                  </div>
                  <p className="text-xs text-center font-mono text-gray-500">{c.color}</p>
                </div>
              ))}
            </div>

            {/* Accent Colors */}
            <div className="flex gap-4">
              {[
                { color: '#E0503D', name: 'Coral' },
                { color: '#8B5CF6', name: 'Purple' },
                { color: '#E8A847', name: 'Gold' },
                { color: '#008FBE', name: 'Teal' },
              ].map((c) => (
                <div key={c.color} className="flex-1">
                  <div
                    className="h-16 rounded-xl shadow-md mb-2 flex items-center justify-center"
                    style={{ backgroundColor: c.color }}
                  >
                    <span className="text-white text-sm font-medium">{c.name}</span>
                  </div>
                  <p className="text-xs text-center font-mono text-gray-500">{c.color}</p>
                </div>
              ))}
            </div>

            {/* Gradient Showcase */}
            <div className="mt-12 grid grid-cols-3 gap-4">
              <div className="rounded-xl p-6 text-center" style={{ background: 'linear-gradient(135deg, #003763 0%, #0067B1 100%)' }}>
                <span className="text-white text-sm font-medium">Navy → Blue</span>
              </div>
              <div className="rounded-xl p-6 text-center" style={{ background: 'linear-gradient(135deg, #00C9D4 0%, #1BB680 100%)' }}>
                <span className="text-white text-sm font-medium">Cyan → Green</span>
              </div>
              <div className="rounded-xl p-6 text-center" style={{ background: 'linear-gradient(135deg, #E0503D 0%, #E8A847 100%)' }}>
                <span className="text-white text-sm font-medium">Coral → Gold</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features + Impact */}
      <section className="py-16 bg-white">
        <div className="container-editorial">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#1BB680' }}>
                Features
              </p>
              <h2
                className="text-2xl md:text-3xl mb-6"
                style={{ fontFamily: 'var(--font-instrument)', color: '#003763' }}
              >
                What Makes It Special
              </h2>
              <ul className="space-y-4">
                {[
                  'Team Dashboard with birthday tracking, PTO calendar, and time entry codes',
                  'Searchable document library with tag filtering',
                  'Interactive QC checklists that save progress locally',
                  'Citation tool supporting multiple academic formats',
                  'R Manual with 14 comprehensive chapters',
                  'Case study archive organized by practice area',
                  'AI training resources and prompt bank',
                  'Visual methodology diagrams with interactive nodes',
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#1BB680' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span style={{ color: 'rgba(59,65,45,0.8)' }}>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#0067B1' }}>
                Impact
              </p>
              <h2
                className="text-2xl md:text-3xl mb-6"
                style={{ fontFamily: 'var(--font-instrument)', color: '#003763' }}
              >
                Real Results
              </h2>
              <div className="space-y-6">
                <div className="p-5 rounded-xl" style={{ backgroundColor: '#F8FAFC' }}>
                  <p className="text-3xl font-bold mb-1" style={{ color: '#1BB680' }}>80%</p>
                  <p className="text-sm" style={{ color: 'rgba(59,65,45,0.8)' }}>
                    Reduction in time spent searching for training materials
                  </p>
                </div>
                <div className="p-5 rounded-xl" style={{ backgroundColor: '#F8FAFC' }}>
                  <p className="text-3xl font-bold mb-1" style={{ color: '#0067B1' }}>15+</p>
                  <p className="text-sm" style={{ color: 'rgba(59,65,45,0.8)' }}>
                    Team members actively using the portal daily
                  </p>
                </div>
                <div className="p-5 rounded-xl" style={{ backgroundColor: '#F8FAFC' }}>
                  <p className="text-3xl font-bold mb-1" style={{ color: '#E8A847' }}>3x</p>
                  <p className="text-sm" style={{ color: 'rgba(59,65,45,0.8)' }}>
                    Faster onboarding for new analysts and consultants
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 border-t" style={{ borderColor: 'rgba(59,65,45,0.1)' }}>
        <div className="container-editorial">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-sm mb-1" style={{ color: 'rgba(59,65,45,0.6)' }}>
                Want to see more work?
              </p>
              <p className="font-medium" style={{ color: '#003763' }}>
                Check out my other projects and case studies.
              </p>
            </div>
            <Link
              href="/work"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all hover:gap-3"
              style={{ backgroundColor: '#003763', color: '#FFF5EB' }}
            >
              View All Work
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
