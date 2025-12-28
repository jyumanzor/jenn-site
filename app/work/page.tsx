"use client";

import { useState } from "react";
import Link from "next/link";
import work from "@/data/work.json";

type Position = typeof work.positions[0];

export default function WorkPage() {
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [showAllPositions, setShowAllPositions] = useState(false);

  // Category colors and labels
  const categoryStyles: Record<string, { panel: string; isDark: boolean; label: string }> = {
    retail: { panel: "panel-gradient-sage", isDark: false, label: "Retail" },
    research: { panel: "panel-gradient-deep", isDark: true, label: "Research" },
    consulting: { panel: "panel-gradient-olive", isDark: true, label: "Consulting" },
    data: { panel: "panel-gradient-forest", isDark: true, label: "Data" },
    fitness: { panel: "panel-gradient-warm-neutral", isDark: false, label: "Fitness" },
    education: { panel: "panel-gradient-sage", isDark: false, label: "Education" },
  };

  // Quirky/fun positions to highlight
  const quirkyPositions = work.positions.filter(p =>
    ["lululemon", "solidcore", "barista"].includes(p.id)
  );

  // Professional positions
  const professionalPositions = work.positions.filter(p =>
    !["lululemon", "solidcore", "barista"].includes(p.id)
  );

  const displayedPositions = showAllPositions ? professionalPositions : professionalPositions.slice(0, 6);

  return (
    <div className="bg-cream">
      {/* Hero */}
      <section className="pt-28 pb-12 md:pt-36 md:pb-16">
        <div className="container-editorial">
          <div className="max-w-2xl">
            <p className="light-bg-label mb-3">Work</p>
            <h1
              className="text-4xl md:text-5xl mb-4 tracking-tight"
              style={{ fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif', color: '#3B412D' }}
            >
              Hi, I&apos;m Jenn.
            </h1>
            <p className="light-bg-body leading-relaxed reading-width">
              Economic consultant at FTI Consulting. Damages analysis for commercial litigation.
            </p>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Current Role */}
      <section className="py-12 bg-ivory">
        <div className="container-editorial">
          <p className="light-bg-label mb-8">Current role</p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="panel-gradient-deep">
              <span className="w-6 h-6 rounded-full bg-white/20 text-white text-xs flex items-center justify-center mb-4">1</span>
              <h3 className="dark-bg-header text-xl leading-tight mb-3">{work.current.company}</h3>
              <p className="dark-bg-body text-sm leading-relaxed">
                {work.current.location} · {work.current.timeline}
              </p>
            </div>

            <div className="panel-gradient-sage">
              <span className="w-6 h-6 rounded-full bg-olive/20 text-olive text-xs flex items-center justify-center mb-4">2</span>
              <h3 className="light-bg-header text-xl leading-tight mb-3">{work.current.title}</h3>
              <p className="light-bg-body text-sm leading-relaxed">
                {work.current.description}
              </p>
            </div>

            <div className="panel-gradient-warm-neutral">
              <span className="w-6 h-6 rounded-full bg-olive/20 text-olive text-xs flex items-center justify-center mb-4">3</span>
              <h3 className="light-bg-header text-xl leading-tight mb-3">Key Focus</h3>
              <p className="light-bg-body text-sm leading-relaxed">
                Economic modeling, damages estimation, team leadership, expert reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Selected Position Detail */}
      {selectedPosition && (
        <section className="py-12" style={{ background: 'linear-gradient(to left, #3B412D, #546E40)' }}>
          <div className="container-editorial">
            <div className="max-w-4xl">
              <div className="grid md:grid-cols-12 gap-8">
                <div className="md:col-span-5">
                  <span className="dark-bg-label">{selectedPosition.company}</span>
                  <h2 className="dark-bg-header text-2xl leading-tight mt-2 mb-2">{selectedPosition.title}</h2>
                  <p className="dark-bg-body text-sm mb-2">{selectedPosition.location}</p>
                  <p className="dark-bg-label mb-4">{selectedPosition.timeline} · {selectedPosition.duration}</p>
                  <span className="inline-block px-2 py-1 bg-white/20 rounded text-xs dark-bg-body mb-6">
                    {selectedPosition.type}
                  </span>
                  <button
                    onClick={() => setSelectedPosition(null)}
                    className="block dark-bg-body text-sm hover:text-white transition-colors"
                  >
                    ← Close
                  </button>
                </div>
                <div className="md:col-span-7">
                  <div className="bg-white/10 rounded-lg p-6">
                    <p className="dark-bg-label mb-4">Responsibilities</p>
                    <ul className="space-y-2">
                      {selectedPosition.responsibilities.map((resp, i) => (
                        <li key={i} className="dark-bg-body text-sm leading-relaxed flex gap-2">
                          <span className="text-white/50">·</span>
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* The Quirky Jobs */}
      <section className="py-12 bg-cream">
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-12 mb-8">
            <div className="md:col-span-4">
              <p className="light-bg-label mb-4">The side quests</p>
              <p className="light-bg-body text-sm leading-relaxed">
                Not everything fits in a consulting box.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {quirkyPositions.map((position, index) => {
              const style = categoryStyles[position.category] || categoryStyles.retail;
              return (
                <button
                  key={position.id}
                  onClick={() => setSelectedPosition(position)}
                  className={`${style.panel} text-left transition-transform hover:scale-[1.02] ${
                    selectedPosition?.id === position.id ? "ring-2 ring-gold" : ""
                  }`}
                >
                  <span className={style.isDark ? "dark-bg-label" : "light-bg-label"}>
                    {style.label}
                  </span>
                  <h3 className={`${style.isDark ? "dark-bg-header" : "light-bg-header"} text-lg mt-1 mb-1`}>
                    {position.company}
                  </h3>
                  <p className={`${style.isDark ? "dark-bg-body" : "light-bg-body"} text-sm mb-2`}>
                    {position.title}
                  </p>
                  <p className={`${style.isDark ? "dark-bg-label" : "light-bg-label"} text-xs`}>
                    {position.timeline}
                  </p>
                  <p className={`${style.isDark ? "dark-bg-body" : "light-bg-body"} text-xs mt-2 italic`}>
                    {position.shortDescription}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Professional Timeline */}
      <section className="py-12">
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-12 mb-8">
            <div className="md:col-span-4">
              <p className="light-bg-label mb-4">Professional journey</p>
              <p className="light-bg-body text-sm leading-relaxed">
                Research, consulting, data analysis. Click to explore.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedPositions.map((position, index) => {
              const style = categoryStyles[position.category] || categoryStyles.research;
              return (
                <button
                  key={position.id}
                  onClick={() => setSelectedPosition(position)}
                  className={`${style.panel} text-left transition-transform hover:scale-[1.02] ${
                    selectedPosition?.id === position.id ? "ring-2 ring-gold" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className={style.isDark ? "dark-bg-label" : "light-bg-label"}>
                      {position.timeline.split(" - ")[0]}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded ${style.isDark ? "bg-white/20 dark-bg-body" : "bg-olive/20 light-bg-body"}`}>
                      {position.duration}
                    </span>
                  </div>
                  <h3 className={`${style.isDark ? "dark-bg-header" : "light-bg-header"} text-base mb-1`}>
                    {position.company}
                  </h3>
                  <p className={`${style.isDark ? "dark-bg-body" : "light-bg-body"} text-sm`}>
                    {position.title}
                  </p>
                  <p className={`${style.isDark ? "dark-bg-body" : "light-bg-body"} text-xs mt-2 opacity-80`}>
                    {position.shortDescription}
                  </p>
                </button>
              );
            })}
          </div>

          {professionalPositions.length > 6 && (
            <div className="text-center mt-8">
              <button
                onClick={() => setShowAllPositions(!showAllPositions)}
                className="btn-secondary text-sm"
              >
                {showAllPositions ? "Show less" : `Show all ${professionalPositions.length} positions`}
              </button>
            </div>
          )}
        </div>
      </section>

      <hr className="rule" />

      {/* Skills */}
      <section className="py-12 bg-cream">
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <p className="light-bg-label mb-4">What I do</p>
              <p className="light-bg-body text-sm leading-relaxed">
                Core competencies built through rigorous training and real-world application.
              </p>
            </div>
            <div className="md:col-span-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { skill: "Economic Analysis", isDark: true },
                  { skill: "Damages Modeling", isDark: false },
                  { skill: "Litigation Support", isDark: false },
                  { skill: "Data Analysis", isDark: true },
                  { skill: "Financial Modeling", isDark: false },
                  { skill: "Expert\nReports", isDark: true },
                  { skill: "Deposition Support", isDark: false },
                  { skill: "Statistical Analysis", isDark: true }
                ].map((item, index) => {
                  const panels = [
                    "panel-gradient-deep",
                    "panel-gradient-sage",
                    "panel-gradient-warm-neutral",
                    "panel-gradient-olive",
                    "panel-gradient-sage",
                    "panel-gradient-forest",
                    "panel-gradient-warm-neutral",
                    "panel-gradient-deep"
                  ];
                  const isDark = index === 0 || index === 3 || index === 5 || index === 7;
                  return (
                    <div key={item.skill} className={panels[index]}>
                      <span className={isDark ? "dark-bg-label" : "light-bg-label"}>{String(index + 1).padStart(2, '0')}</span>
                      <p className={`text-sm mt-0.5 whitespace-pre-line ${isDark ? "dark-bg-body" : "light-bg-body"}`}>{item.skill}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Languages */}
      <section className="py-12">
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <p className="light-bg-label mb-4">Languages</p>
            </div>
            <div className="md:col-span-8">
              <div className="grid grid-cols-3 gap-4">
                {work.languages.map((lang, index) => {
                  const panels = ["panel-gradient-deep", "panel-gradient-sage", "panel-gradient-warm-neutral"];
                  const isDark = index === 0;
                  return (
                    <div key={lang.language} className={panels[index]}>
                      <h3 className={isDark ? "dark-bg-header text-lg leading-tight" : "light-bg-header text-lg leading-tight"}>
                        {lang.language}
                      </h3>
                      <p className={`text-[11px] mt-1 font-light ${isDark ? "text-cream/60" : "text-olive/70"}`}>
                        {lang.level}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Education */}
      <section className="py-12 bg-cream">
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-12 mb-8">
            <div className="md:col-span-4">
              <p className="light-bg-label mb-4">Education</p>
              <p className="light-bg-body text-sm leading-relaxed">
                Chicago roots. Texas beginnings.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Booth MBA - Upcoming */}
            <div
              className="rounded-xl p-6 relative overflow-hidden"
              style={{ backgroundColor: 'rgba(212, 237, 57, 0.15)', border: '3px solid #d4ed39' }}
            >
              <span
                className="absolute top-3 right-3 text-[10px] uppercase tracking-wide font-medium"
                style={{ color: '#4e6041' }}
              >
                Upcoming
              </span>
              <span className="mb-2 block text-xs uppercase tracking-wider" style={{ color: '#4e6041' }}>2026</span>
              <h3
                className="text-lg leading-tight mb-1"
                style={{ fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif', color: '#2a3c24' }}
              >
                Chicago Booth
              </h3>
              <p className="text-xs mb-3" style={{ color: 'rgba(42, 60, 36, 0.6)' }}>MBA</p>
              <p className="text-sm leading-snug" style={{ color: 'rgba(42, 60, 36, 0.7)' }}>
                Returning to Chicago for business school.
              </p>
            </div>

            {/* UChicago - Main */}
            <div className="panel-gradient-deep">
              <span className="dark-bg-label mb-2 block">2017–2021</span>
              <h3 className="dark-bg-header text-lg leading-tight mb-1">University of Chicago</h3>
              <p className="text-cream/60 text-xs mb-3">BA in Sociology & HIPS</p>
              <p className="text-cream/70 text-sm leading-snug mb-4">
                The College. Hyde Park.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {["Dean's List", "Kimpton Fellow", "Model UN", "WPSP"].map(item => (
                  <span key={item} className="text-[10px] px-2 py-0.5 bg-white/15 rounded text-cream/70">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Princeton - Summer */}
            <div className="panel-gradient-sage">
              <span className="light-bg-label mb-2 block">2016</span>
              <h3 className="light-bg-header text-lg leading-tight mb-1">Princeton</h3>
              <p className="text-deep-forest/60 text-xs mb-3">Summer Program</p>
              <p className="text-deep-forest/70 text-sm leading-snug">
                International relations, gender studies, environmental politics.
              </p>
            </div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Connect */}
      <section className="py-14" style={{ backgroundColor: '#fff8e7' }}>
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            {/* Left column: headline + copy */}
            <div className="md:col-span-5">
              <h2
                className="text-deep-forest mb-4 tracking-tight leading-none"
                style={{ fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
              >
                Let&apos;s connect
              </h2>
              <p className="text-base text-deep-forest/70 leading-relaxed">
                Whether it&apos;s about work, running, or grabbing coffee in DC.
              </p>
            </div>

            {/* Right column: contact cards */}
            <div className="md:col-span-7">
              <div className="grid grid-cols-2 gap-5">
                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/jennifer-umanzor-1072a7176/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center gap-3 px-6 py-6 bg-ivory rounded-xl hover:bg-white transition-colors"
                >
                  <svg className="w-11 h-11 text-deep-forest" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <span
                    className="text-base text-deep-forest/70"
                    style={{ fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif' }}
                  >
                    LinkedIn
                  </span>
                </a>

                {/* Email */}
                <a
                  href="mailto:j.umanzor@ymail.com"
                  className="flex flex-col items-center justify-center gap-3 px-6 py-6 bg-ivory rounded-xl hover:bg-white transition-colors"
                >
                  <svg className="w-11 h-11 text-deep-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span
                    className="text-base text-deep-forest/70"
                    style={{ fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif' }}
                  >
                    Email
                  </span>
                </a>

                {/* Strava */}
                <a
                  href="https://www.strava.com/athletes/181780869"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center gap-3 px-6 py-6 bg-ivory rounded-xl hover:bg-white transition-colors"
                >
                  <svg className="w-11 h-11 text-deep-forest" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
                  </svg>
                  <span
                    className="text-base text-deep-forest/70"
                    style={{ fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif' }}
                  >
                    Strava
                  </span>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/jennumanzor/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center gap-3 px-6 py-6 bg-ivory rounded-xl hover:bg-white transition-colors"
                >
                  <svg className="w-11 h-11 text-deep-forest" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  <span
                    className="text-base text-deep-forest/70"
                    style={{ fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif' }}
                  >
                    Instagram
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back Link */}
      <section className="py-12">
        <div className="container-editorial">
          <Link href="/" className="link-editorial text-sm">
            ← Back to home
          </Link>
        </div>
      </section>
    </div>
  );
}
