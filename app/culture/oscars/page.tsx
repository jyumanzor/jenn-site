"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import oscars from "@/data/oscars.json";

type Nominee = typeof oscars.nominees[0] & { genre?: string; summary?: string };

// Category color mapping
const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  "Best Picture": { bg: '#ffcb69', text: '#2a3c24', border: '#ffcb69' },
  "Best Director": { bg: '#d4ed39', text: '#2a3c24', border: '#d4ed39' },
  "Best Actor": { bg: '#546e40', text: '#fff5eb', border: '#546e40' },
  "Best Actress": { bg: '#97a97c', text: '#2a3c24', border: '#97a97c' },
  "Best Animated Feature": { bg: '#ff9f7a', text: '#2a3c24', border: '#ff9f7a' },
  "Best International Feature": { bg: '#5cb8e8', text: '#1a3a4a', border: '#5cb8e8' },
  "Best Cinematography": { bg: '#cbad8c', text: '#2a3c24', border: '#cbad8c' },
  "Best Production Design": { bg: '#c49bd4', text: '#2a3c24', border: '#c49bd4' },
  "Best Original Score": { bg: '#f0b8b8', text: '#2a3c24', border: '#f0b8b8' },
};

export default function OscarsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [winnersOnly, setWinnersOnly] = useState(false);

  const uniqueYears = useMemo(() => {
    const years = new Set<number>();
    oscars.nominees.forEach((n: Nominee) => years.add(n.year));
    return Array.from(years).sort((a, b) => b - a);
  }, []);

  const filteredNominees = useMemo(() => {
    return oscars.nominees.filter((n: Nominee) => {
      if (selectedCategory !== "all" && n.category !== selectedCategory) return false;
      if (selectedYear !== "all" && n.year !== parseInt(selectedYear)) return false;
      if (winnersOnly && !n.winner) return false;
      return true;
    });
  }, [selectedCategory, selectedYear, winnersOnly]);

  // Group by year
  const groupedByYear = useMemo(() => {
    const groups: Record<number, Nominee[]> = {};
    filteredNominees.forEach((n: Nominee) => {
      if (!groups[n.year]) groups[n.year] = [];
      groups[n.year].push(n);
    });
    return groups;
  }, [filteredNominees]);

  const sortedYears = Object.keys(groupedByYear)
    .map(Number)
    .sort((a, b) => b - a);

  const totalNominees = oscars.nominees.length;
  const totalWinners = oscars.nominees.filter((n: Nominee) => n.winner).length;

  const getCategoryStyle = (category: string) => {
    return categoryColors[category] || { bg: '#97a97c', text: '#2a3c24', border: '#97a97c' };
  };

  return (
    <div className="bg-cream min-h-screen">
      {/* Hero */}
      <section className="pt-8 pb-16 md:pt-16 md:pb-20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(ellipse at 70% 20%, rgba(255,203,105,0.3) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(212,237,57,0.15) 0%, transparent 40%)'
          }}
        />
        <div className="container-editorial relative">
          <Link
            href="/culture"
            className="inline-flex items-center gap-2 text-sm mb-6 transition-colors"
            style={{ color: '#546e40' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Culture
          </Link>
          <div className="max-w-3xl">
            <p
              className="text-xs uppercase tracking-widest mb-4"
              style={{ color: '#546e40' }}
            >
              Film Archive
            </p>
            <h1
              className="text-5xl md:text-6xl lg:text-7xl mb-6 tracking-tight leading-[0.9]"
              style={{
                fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                color: '#2a3c24'
              }}
            >
              Oscar<br />
              <span style={{ color: '#ffcb69' }}>Nominees.</span>
            </h1>
            <p
              className="text-lg md:text-xl leading-relaxed max-w-xl"
              style={{ color: 'rgba(42,60,36,0.7)' }}
            >
              Academy Award nominees and winners from 2015-2025 across major categories.
            </p>

            {/* Category Legend */}
            <div className="flex flex-wrap gap-2 mt-6">
              {oscars.categories.map((cat: string) => {
                const style = getCategoryStyle(cat);
                return (
                  <span
                    key={cat}
                    className="px-2 py-1 rounded text-[9px] font-medium"
                    style={{ backgroundColor: style.bg, color: style.text }}
                  >
                    {cat}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-4 bg-sand sticky top-16 z-40">
        <div className="container-editorial">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex flex-wrap gap-2 items-center">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1.5 bg-white rounded-full text-xs border border-sand focus:outline-none focus:border-olive"
              >
                <option value="all">All Categories</option>
                {oscars.categories.map((cat: string) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {/* Year Filter */}
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3 py-1.5 bg-white rounded-full text-xs border border-sand focus:outline-none focus:border-olive"
              >
                <option value="all">All Years</option>
                {uniqueYears.map((year: number) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>

              {/* Winners Only */}
              <button
                onClick={() => setWinnersOnly(!winnersOnly)}
                className={`px-3 py-1.5 rounded-full text-xs transition-colors flex items-center gap-1 ${
                  winnersOnly
                    ? "bg-gold text-deep-forest"
                    : "bg-white text-dark-brown hover:bg-stone"
                }`}
              >
                <span>🏆</span>
                <span>Winners Only</span>
              </button>

              {/* Clear Filters */}
              {(selectedCategory !== "all" || selectedYear !== "all" || winnersOnly) && (
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedYear("all");
                    setWinnersOnly(false);
                  }}
                  className="px-3 py-1.5 rounded-full text-xs text-olive hover:text-deep-forest transition-colors underline"
                >
                  Clear filters
                </button>
              )}
            </div>

            <span className="text-xs" style={{ color: 'rgba(42,60,36,0.5)' }}>
              {filteredNominees.length} of {totalNominees} nominees
            </span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8">
        <div className="container-editorial">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 text-center border border-sand/30">
              <p
                className="text-3xl"
                style={{
                  fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                  color: '#ffcb69'
                }}
              >
                {totalWinners}
              </p>
              <p className="text-xs text-olive/60 mt-1">Winners</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center border border-sand/30">
              <p
                className="text-3xl"
                style={{
                  fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                  color: '#2a3c24'
                }}
              >
                {totalNominees}
              </p>
              <p className="text-xs text-olive/60 mt-1">Nominees</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center border border-sand/30">
              <p
                className="text-3xl"
                style={{
                  fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                  color: '#546e40'
                }}
              >
                {oscars.categories.length}
              </p>
              <p className="text-xs text-olive/60 mt-1">Categories</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center border border-sand/30">
              <p
                className="text-3xl"
                style={{
                  fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                  color: '#97a97c'
                }}
              >
                {uniqueYears.length}
              </p>
              <p className="text-xs text-olive/60 mt-1">Years</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 pb-20">
        <div className="container-editorial">
          {sortedYears.map((year) => (
            <div key={year} className="mb-12">
              {/* Year Header - lime/cream styling */}
              <div
                className="rounded-xl px-6 py-4 mb-6 flex items-center justify-between"
                style={{ backgroundColor: '#2a3c24' }}
              >
                <h2
                  className="text-3xl tracking-tight"
                  style={{
                    fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                    color: '#d4ed39'
                  }}
                >
                  {year}
                </h2>
                <span style={{ color: 'rgba(212,237,57,0.7)' }} className="text-xs">
                  {groupedByYear[year].filter((n: Nominee) => n.winner).length} winners · {groupedByYear[year].length} nominees
                </span>
              </div>

              {/* Nominees Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedByYear[year].map((nominee: Nominee, idx: number) => {
                  const catStyle = getCategoryStyle(nominee.category);

                  return (
                    <div
                      key={`${nominee.title}-${nominee.category}-${idx}`}
                      className="rounded-xl p-5 transition-all bg-white"
                      style={{
                        borderLeft: `4px solid ${catStyle.border}`,
                        borderTop: '1px solid rgba(0,0,0,0.05)',
                        borderRight: '1px solid rgba(0,0,0,0.05)',
                        borderBottom: '1px solid rgba(0,0,0,0.05)',
                        boxShadow: nominee.winner ? `0 0 0 2px ${catStyle.border}40` : 'none'
                      }}
                    >
                      {/* Winner Badge */}
                      {nominee.winner && (
                        <div className="flex items-center gap-1.5 mb-3">
                          <span className="text-lg">🏆</span>
                          <span
                            className="text-xs font-medium uppercase tracking-wider"
                            style={{ color: '#b8860b' }}
                          >
                            Winner
                          </span>
                        </div>
                      )}

                      {/* Category Tag */}
                      <span
                        className="inline-block px-2.5 py-1 rounded text-[10px] font-medium uppercase tracking-wide mb-3"
                        style={{ backgroundColor: catStyle.bg, color: catStyle.text }}
                      >
                        {nominee.category}
                      </span>

                      {/* Genre Tag (if available) */}
                      {nominee.genre && (
                        <span
                          className="inline-block ml-2 px-2 py-0.5 rounded text-[9px] uppercase tracking-wide"
                          style={{ backgroundColor: 'rgba(42,60,36,0.1)', color: 'rgba(42,60,36,0.6)' }}
                        >
                          {nominee.genre}
                        </span>
                      )}

                      {/* Title */}
                      <h3
                        className="text-lg tracking-tight mb-1"
                        style={{
                          fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                          color: '#2a3c24'
                        }}
                      >
                        {nominee.title}
                      </h3>

                      {/* Credits */}
                      <p className="text-xs mb-2" style={{ color: 'rgba(42,60,36,0.6)' }}>
                        {nominee.credits}
                      </p>

                      {/* Summary (if available) */}
                      {nominee.summary && (
                        <p className="text-xs leading-relaxed" style={{ color: 'rgba(42,60,36,0.5)' }}>
                          {nominee.summary}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {filteredNominees.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg" style={{ color: 'rgba(42,60,36,0.5)' }}>
                No nominees match your filters.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedYear("all");
                  setWinnersOnly(false);
                }}
                className="mt-4 text-sm underline"
                style={{ color: '#546e40' }}
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Back Link */}
      <section className="py-12 bg-sand/30">
        <div className="container-editorial">
          <Link href="/culture" className="link-editorial text-sm">
            ← Back to Culture
          </Link>
        </div>
      </section>
    </div>
  );
}
