"use client";

import { useState } from "react";
import Link from "next/link";
import races from "@/data/races.json";
import RunningSchedule from "@/components/RunningSchedule";

type Marathon = typeof races.marathons[0];
type Ultra = typeof races.ultras[0];
type Upcoming = typeof races.upcoming[0];

type WorldMajor = {
  city: string;
  fullName: string;
  status: "completed" | "registered" | "qualified" | "lottery" | "special";
  date?: string;
  myTime?: string;
  facts: string[];
  timeStandard: {
    women1839: string;
    description: string;
  };
  myQualification: {
    qualified: boolean;
    note: string;
  };
  entryInfo: string;
};

const worldMajors: WorldMajor[] = [
  {
    city: "Boston",
    fullName: "Boston Marathon",
    status: "registered",
    date: "April 2026",
    facts: [
      "Oldest annual marathon (since 1897)",
      "Only major requiring qualification time",
      "Point-to-point course with net downhill",
      "Heartbreak Hill at mile 20"
    ],
    timeStandard: {
      women1839: "3:30:00",
      description: "Must run a qualifying time at a certified marathon"
    },
    myQualification: {
      qualified: true,
      note: "Qualified with 3:09 PR at Geneva"
    },
    entryInfo: "Qualification + lottery cutoff (times often need to be faster than standard)"
  },
  {
    city: "Chicago",
    fullName: "Chicago Marathon",
    status: "registered",
    date: "October 2026",
    facts: [
      "One of the fastest courses in the world",
      "Flat, fast, and scenic through 29 neighborhoods",
      "Over 45,000 runners annually",
      "Great crowd support throughout"
    ],
    timeStandard: {
      women1839: "3:35:00",
      description: "Guaranteed entry with qualifying time"
    },
    myQualification: {
      qualified: true,
      note: "Qualified with 3:09 PR"
    },
    entryInfo: "Time qualifier or lottery entry"
  },
  {
    city: "NYC",
    fullName: "New York City Marathon",
    status: "qualified",
    facts: [
      "Largest marathon in the world (50,000+ runners)",
      "Five boroughs, one incredible finish in Central Park",
      "Most competitive time qualifier cutoffs",
      "Started in 1970 with 127 runners"
    ],
    timeStandard: {
      women1839: "3:13:00",
      description: "Extremely competitive—often need to be 10-15 min faster"
    },
    myQualification: {
      qualified: true,
      note: "3:09 qualifies, but cutoff can be very tight"
    },
    entryInfo: "Lottery, time qualifier (limited spots), charity, or 9+1 program"
  },
  {
    city: "Berlin",
    fullName: "Berlin Marathon",
    status: "qualified",
    facts: [
      "World record course—fastest marathon in the world",
      "Flat and fast through historic Berlin",
      "Finish at Brandenburg Gate",
      "Current WR: 2:00:35 (Kelvin Kiptum, 2023)"
    ],
    timeStandard: {
      women1839: "3:20:00",
      description: "Based on previous marathon performance"
    },
    myQualification: {
      qualified: true,
      note: "3:09 qualifies for time-based entry"
    },
    entryInfo: "Lottery or time qualification"
  },
  {
    city: "Tokyo",
    fullName: "Tokyo Marathon",
    status: "lottery",
    facts: [
      "One of the most difficult to enter",
      "Incredible Japanese hospitality and organization",
      "Flat, fast course through Tokyo",
      "Lottery acceptance rate under 10%"
    ],
    timeStandard: {
      women1839: "3:30:00",
      description: "Elite/sub-elite program for fast runners"
    },
    myQualification: {
      qualified: true,
      note: "3:09 qualifies for sub-elite, but spots are very limited"
    },
    entryInfo: "Primarily lottery—time qualification spots extremely limited"
  },
  {
    city: "London",
    fullName: "London Marathon",
    status: "special",
    facts: [
      "Most money raised for charity of any marathon",
      "Iconic course past Big Ben, Tower Bridge, Buckingham Palace",
      "Championship and mass race on same day",
      "Good For Age program for qualified runners"
    ],
    timeStandard: {
      women1839: "3:15:00",
      description: "Good For Age (GFA) guaranteed entry"
    },
    myQualification: {
      qualified: true,
      note: "3:09 qualifies for GFA"
    },
    entryInfo: "UK residents prioritized for GFA. International runners: lottery or charity"
  }
];

const statusColors = {
  completed: { bg: "panel-gradient-deep", text: "text-ivory", badge: "bg-gold text-deep-forest", label: "Completed" },
  registered: { bg: "panel-gradient-olive", text: "text-ivory", badge: "bg-[#d4ed39] text-deep-forest", label: "Registered" },
  qualified: { bg: "panel-gradient-sage", text: "text-deep-forest", badge: "bg-deep-forest text-cream", label: "Qualified" },
  lottery: { bg: "panel-gradient-warm-neutral", text: "text-deep-forest", badge: "bg-olive text-cream", label: "Lottery" },
  special: { bg: "panel-gradient-warm-neutral", text: "text-deep-forest", badge: "bg-terracotta text-cream", label: "Special Entry" }
};

export default function RunningPage() {
  const [selectedMajor, setSelectedMajor] = useState<WorldMajor | null>(null);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <div className="bg-cream">
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-cream">
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-7">
              <p className="light-bg-label mb-4">Running</p>
              <h1 className="font-display text-4xl md:text-5xl text-deep-forest mb-6 leading-tight">
                The pursuit of measurable progress.
              </h1>
              <p className="text-base text-olive leading-relaxed reading-width font-light">
                Every race is a test. Every finish line is data. Working toward all seven
                World Marathon Majors—Boston and Chicago in 2026.
              </p>
            </div>
            <div className="md:col-span-5">
              <div className="panel-gradient-deep p-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-gold font-display text-5xl">3:09</span>
                  <span className="text-cream/60 text-sm">marathon PR</span>
                </div>
                <p className="text-cream/80 text-sm mt-3">
                  Geneva 2025. Sub-3 next.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Stats Panels */}
      <section className="py-16 bg-ivory">
        <div className="container-editorial">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="panel-gradient-deep">
              <p className="font-display text-4xl text-ivory">{races.stats.marathonPR}</p>
              <p className="text-tan text-xs uppercase tracking-wide mt-2">Marathon PR</p>
            </div>
            <div className="panel-gradient-olive">
              <p className="font-display text-4xl text-gold">{races.stats.totalMarathons}</p>
              <p className="text-cream/90 text-xs uppercase tracking-wide mt-2">Marathons</p>
            </div>
            <div className="panel-gradient-sage">
              <p className="font-display text-4xl text-deep-forest">{races.stats.bostonQualifications}</p>
              <p className="text-deep-forest/80 text-xs uppercase tracking-wide mt-2">Boston Qualifiers</p>
            </div>
            <div className="panel-gradient-forest">
              <p className="font-display text-4xl text-ivory">{races.worldMajors.completed.length}/{races.worldMajors.goal}</p>
              <p className="text-tan text-xs uppercase tracking-wide mt-2">World Majors</p>
            </div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Training Schedule */}
      <section className="py-16 bg-deep-forest">
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <p className="dark-bg-label mb-4">Training</p>
              <h2 className="dark-bg-header text-2xl mb-4">The weekly structure.</h2>
              <p className="dark-bg-body text-sm leading-relaxed">
                Pfitzinger 18/70 plan. Click any day to adjust run type. Miles and paces update automatically.
              </p>
            </div>
            <div className="md:col-span-8">
              <RunningSchedule />
            </div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Upcoming */}
      <section className="py-16 bg-cream">
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <p className="light-bg-label mb-3">2026</p>
              <h2 className="light-bg-header text-2xl mb-4">Upcoming races</h2>
              <p className="light-bg-body text-sm leading-relaxed">
                Registered for Boston and Chicago. Two more majors.
              </p>
            </div>
            <div className="md:col-span-8">
              <div className="space-y-4">
                {races.upcoming.map((race: Upcoming, index: number) => (
                  <div key={race.id} className={`rounded-xl p-6 shadow-sm border ${
                    index === 0 ? 'bg-ivory border-gold/40' : 'bg-ivory border-olive/30'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-display text-xl text-deep-forest">{race.name}</h3>
                        <p className="text-deep-forest/70 text-sm mt-1">{race.location} · {formatDate(race.date)}</p>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        index === 0 ? 'bg-gold text-deep-forest' : 'bg-deep-forest text-ivory'
                      }`}>Registered</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Race History - Marathons */}
      <section className="py-16 bg-ivory">
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <p className="light-bg-label mb-4">Race history</p>
              <h2 className="light-bg-header text-2xl mb-4">Marathons completed.</h2>
              <p className="light-bg-body text-sm leading-relaxed">
                Chronological journey. Each finish line is data.
              </p>
            </div>
            <div className="md:col-span-8">
              <div className="space-y-4">
                {[...races.marathons]
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map((race: Marathon, index: number, sortedArr) => {
                    // Gradient from deep forest (oldest) → olive → sage → cream (newest)
                    const gradients = [
                      { bg: 'linear-gradient(135deg, #2a3c24 0%, #3B412D 100%)', isDark: true },
                      { bg: 'linear-gradient(135deg, #3B412D 0%, #4a5539 100%)', isDark: true },
                      { bg: 'linear-gradient(135deg, #4a5539 0%, #546E40 100%)', isDark: true },
                      { bg: 'linear-gradient(135deg, #546E40 0%, #6b8a53 100%)', isDark: true },
                      { bg: 'linear-gradient(135deg, #6b8a53 0%, #97a97c 100%)', isDark: false },
                      { bg: 'linear-gradient(135deg, #97a97c 0%, #b5c4a0 100%)', isDark: false },
                      { bg: 'linear-gradient(135deg, #b5c4a0 0%, #F7E5DA 100%)', isDark: false },
                      { bg: 'linear-gradient(135deg, #F7E5DA 0%, #FFF5EB 100%)', isDark: false },
                    ];
                    const gradientIndex = Math.floor((index / sortedArr.length) * gradients.length);
                    const style = gradients[Math.min(gradientIndex, gradients.length - 1)];

                    return (
                      <div
                        key={race.id}
                        className="rounded-xl p-6"
                        style={{ background: style.bg }}
                      >
                        <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h3
                                className="font-display text-xl"
                                style={{ color: style.isDark ? '#fff5eb' : '#2a3c24' }}
                              >
                                {race.name}
                              </h3>
                              {race.isPR && (
                                <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: '#d4ed39', color: '#2a3c24' }}>
                                  PR
                                </span>
                              )}
                              {race.bostonQualifier && (
                                <span
                                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                                  style={{
                                    backgroundColor: style.isDark ? 'rgba(255,245,235,0.2)' : 'rgba(42,60,36,0.15)',
                                    color: style.isDark ? '#fff5eb' : '#2a3c24'
                                  }}
                                >
                                  BQ
                                </span>
                              )}
                            </div>
                            <p
                              className="text-sm"
                              style={{ color: style.isDark ? 'rgba(255,245,235,0.8)' : 'rgba(42,60,36,0.7)' }}
                            >
                              {race.location} · {formatDate(race.date)}
                            </p>
                            {/* Weather badge */}
                            {race.temp && (
                              <div
                                className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full text-xs"
                                style={{
                                  backgroundColor: style.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(42,60,36,0.1)',
                                  color: style.isDark ? 'rgba(255,245,235,0.9)' : 'rgba(42,60,36,0.8)'
                                }}
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                                </svg>
                                <span>{race.temp}</span>
                                <span className="opacity-60">·</span>
                                <span>{race.conditions}</span>
                              </div>
                            )}
                          </div>
                          <div className="text-left md:text-right">
                            <p
                              className="font-display text-3xl"
                              style={{ color: race.isPR ? '#d4ed39' : (style.isDark ? '#ffcb69' : '#2a3c24') }}
                            >
                              {race.time}
                            </p>
                            <p
                              className="text-sm"
                              style={{ color: style.isDark ? 'rgba(255,245,235,0.7)' : 'rgba(42,60,36,0.6)' }}
                            >
                              {race.pace}
                            </p>
                          </div>
                        </div>
                        {race.notes && (
                          <p
                            className="text-sm mt-4 italic"
                            style={{ color: style.isDark ? 'rgba(255,245,235,0.7)' : 'rgba(42,60,36,0.6)' }}
                          >
                            {race.notes}
                          </p>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Ultras */}
      <section className="py-16 bg-cream">
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <p className="light-bg-label mb-4">Beyond 26.2</p>
              <h2 className="light-bg-header text-2xl mb-4">Ultras.</h2>
              <p className="light-bg-body text-sm leading-relaxed">
                When marathons aren&apos;t enough.
              </p>
            </div>
            <div className="md:col-span-8 space-y-4">
              {races.ultras.map((race: Ultra) => (
                <div
                  key={race.id}
                  className="rounded-xl p-6 panel-gradient-sage"
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-display text-xl text-deep-forest">
                          {race.name}
                        </h3>
                        <span className="px-2 py-0.5 text-xs rounded-full font-semibold bg-deep-forest text-sage">{race.distance}</span>
                      </div>
                      <p className="text-sm text-deep-forest/70">
                        {race.location} · {formatDate(race.date)}
                      </p>
                      {/* Weather badge */}
                      {race.temp && (
                        <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full text-xs bg-deep-forest/10 text-deep-forest">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                          </svg>
                          <span>{race.temp}</span>
                          <span className="opacity-60">·</span>
                          <span>{race.conditions}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-left md:text-right">
                      <p className="font-display text-3xl text-deep-forest">{race.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* World Major Detail Pop-out */}
      {selectedMajor && (
        <section className="py-12" style={{ background: 'linear-gradient(to right, #3B412D, #546E40)' }}>
          <div className="container-editorial">
            <div className="max-w-5xl">
              <div className="grid md:grid-cols-12 gap-8">
                {/* Left: Info */}
                <div className="md:col-span-5">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${statusColors[selectedMajor.status].badge}`}>
                    {statusColors[selectedMajor.status].label}
                  </span>
                  <h2 className="dark-bg-header text-3xl mb-2">{selectedMajor.fullName}</h2>
                  {selectedMajor.date && (
                    <p className="dark-bg-label mb-4">{selectedMajor.date} {selectedMajor.myTime && `· ${selectedMajor.myTime}`}</p>
                  )}
                  <p className="dark-bg-body text-sm leading-relaxed mb-6">
                    {selectedMajor.entryInfo}
                  </p>
                  <button
                    onClick={() => setSelectedMajor(null)}
                    className="dark-bg-body text-sm hover:text-cream transition-colors"
                  >
                    ← Back to all majors
                  </button>
                </div>

                {/* Right: Details */}
                <div className="md:col-span-7 space-y-4">
                  {/* Cool Facts */}
                  <div className="bg-white/10 backdrop-blur rounded-xl p-5">
                    <p className="dark-bg-label mb-3">Cool facts</p>
                    <ul className="space-y-2">
                      {selectedMajor.facts.map((fact, i) => (
                        <li key={i} className="dark-bg-body text-sm flex gap-2">
                          <span className="text-gold">•</span>
                          {fact}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Qualification */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 backdrop-blur rounded-xl p-5">
                      <p className="dark-bg-label mb-2">Time standard (W 18-39)</p>
                      <p className="font-display text-2xl text-gold">{selectedMajor.timeStandard.women1839}</p>
                      <p className="dark-bg-body text-xs mt-2">{selectedMajor.timeStandard.description}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur rounded-xl p-5">
                      <p className="dark-bg-label mb-2">My status</p>
                      <p className={`font-display text-2xl ${selectedMajor.myQualification.qualified ? "text-gold" : "text-cream/50"}`}>
                        {selectedMajor.myQualification.qualified ? "✓ Qualified" : "Not yet"}
                      </p>
                      <p className="dark-bg-body text-xs mt-2">{selectedMajor.myQualification.note}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* World Majors Progress */}
      <section className="py-16 bg-ivory">
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-12 mb-8">
            <div className="md:col-span-4">
              <p className="light-bg-label mb-4">World Majors</p>
              <h2 className="light-bg-header text-2xl mb-4">The checklist.</h2>
              <p className="light-bg-body text-sm leading-relaxed">
                Seven races. 0 down, 7 to go.
              </p>
              <p className="text-xs text-olive/60 mt-2 italic">Click any race for details.</p>
            </div>
            <div className="md:col-span-8">
              {/* Status Legend */}
              <div className="flex flex-wrap gap-3 justify-end">
                {Object.entries(statusColors).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${value.badge.split(' ')[0]}`}></span>
                    <span className="text-xs text-olive">{value.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {worldMajors.map((major) => {
              const colors = statusColors[major.status];
              return (
                <button
                  key={major.city}
                  onClick={() => setSelectedMajor(major)}
                  className={`${colors.bg} p-6 rounded-xl text-center transition-transform hover:scale-[1.02] ${
                    selectedMajor?.city === major.city ? "ring-2 ring-gold" : ""
                  }`}
                >
                  <h3 className={`font-display text-xl mb-2 ${colors.text}`}>
                    {major.city}
                  </h3>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${colors.badge}`}>
                    {colors.label}
                  </span>
                  {major.myTime && (
                    <p className={`text-xs mt-2 ${colors.text} opacity-80`}>{major.myTime}</p>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Marathon Stats */}
      <section className="py-16 bg-cream">
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <p className="light-bg-label mb-4">Performance</p>
              <h2 className="light-bg-header text-2xl mb-4">By the numbers.</h2>
              <p className="light-bg-body text-sm leading-relaxed">
                Stats from completed marathons. Age division rankings coming soon.
              </p>
            </div>
            <div className="md:col-span-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="panel-gradient-deep">
                  <p className="dark-bg-label mb-1">Current PR</p>
                  <p className="font-display text-3xl text-gold">3:09</p>
                  <p className="dark-bg-body text-xs mt-1">Geneva 2025</p>
                </div>
                <div className="panel-gradient-olive">
                  <p className="dark-bg-label mb-1">Avg Pace</p>
                  <p className="font-display text-3xl text-ivory">7:14</p>
                  <p className="dark-bg-body text-xs mt-1">min/mile</p>
                </div>
                <div className="panel-gradient-sage">
                  <p className="light-bg-label mb-1">BQ Times</p>
                  <p className="font-display text-3xl text-deep-forest">4</p>
                  <p className="light-bg-body text-xs mt-1">Boston qualifiers</p>
                </div>
                <div className="panel-gradient-warm-neutral">
                  <p className="light-bg-label mb-1">Improvement</p>
                  <p className="font-display text-3xl text-deep-forest">38:49</p>
                  <p className="light-bg-body text-xs mt-1">from first to PR</p>
                </div>
              </div>

              {/* Age Division Placeholder */}
              <div className="mt-6 rounded-xl p-6" style={{ backgroundColor: '#F5E6D3' }}>
                <p className="light-bg-label mb-4">Age Division Rankings</p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-lg p-4 text-center" style={{ backgroundColor: 'rgba(255,245,235,0.7)' }}>
                    <p className="font-display text-2xl text-deep-forest">—</p>
                    <p className="light-bg-body text-xs mt-1">Best Overall</p>
                  </div>
                  <div className="rounded-lg p-4 text-center" style={{ backgroundColor: 'rgba(255,245,235,0.7)' }}>
                    <p className="font-display text-2xl text-deep-forest">—</p>
                    <p className="light-bg-body text-xs mt-1">Best in Division</p>
                  </div>
                  <div className="rounded-lg p-4 text-center" style={{ backgroundColor: 'rgba(255,245,235,0.7)' }}>
                    <p className="font-display text-2xl text-deep-forest">—</p>
                    <p className="light-bg-body text-xs mt-1">Avg Percentile</p>
                  </div>
                </div>
                <p className="text-deep-forest/50 text-xs mt-4 italic">Add your age division rankings to fill in these stats</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-20 bg-deep-forest">
        <div className="container-editorial">
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-gold text-6xl font-display leading-none">&ldquo;</span>
            <blockquote className="font-display text-2xl md:text-3xl text-ivory leading-relaxed mt-4">
              Using only your heart, mind, and soul, you are responsible for seeing
              how fast you can get your body to travel 26.2.
            </blockquote>
            <p className="text-cream/60 text-sm mt-6">— Why I run</p>
          </div>
        </div>
      </section>

      {/* Back Link */}
      <section className="py-12 bg-ivory">
        <div className="container-editorial">
          <Link href="/" className="inline-flex items-center gap-2 text-deep-forest hover:text-olive transition-colors text-sm font-medium">
            <span>←</span>
            <span>Back to home</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
