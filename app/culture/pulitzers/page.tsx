"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import pulitzers from "@/data/pulitzers.json";

type Entry = typeof pulitzers.entries[0];

// Category color mapping
const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  "Fiction": { bg: '#97a97c', text: '#fff5eb', border: '#97a97c' },
  "General Nonfiction": { bg: '#cbad8c', text: '#2a3c24', border: '#cbad8c' },
};

export default function PulitzersPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [winnersOnly, setWinnersOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const uniqueYears = useMemo(() => {
    const years = new Set<number>();
    pulitzers.entries.forEach((e: Entry) => years.add(e.year));
    return Array.from(years).sort((a, b) => b - a);
  }, []);

  const filteredEntries = useMemo(() => {
    return pulitzers.entries.filter((e: Entry) => {
      if (selectedCategory !== "all" && e.category !== selectedCategory) return false;
      if (selectedYear !== "all" && e.year !== parseInt(selectedYear)) return false;
      if (winnersOnly && !e.winner) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = e.title.toLowerCase().includes(query);
        const matchesAuthor = e.author.toLowerCase().includes(query);
        if (!matchesTitle && !matchesAuthor) return false;
      }
      return true;
    });
  }, [selectedCategory, selectedYear, winnersOnly, searchQuery]);

  // Group by year
  const groupedByYear = useMemo(() => {
    const groups: Record<number, Entry[]> = {};
    filteredEntries.forEach((e: Entry) => {
      if (!groups[e.year]) groups[e.year] = [];
      groups[e.year].push(e);
    });
    return groups;
  }, [filteredEntries]);

  const sortedYears = Object.keys(groupedByYear)
    .map(Number)
    .sort((a, b) => b - a);

  const totalEntries = pulitzers.entries.length;
  const totalWinners = pulitzers.entries.filter((e: Entry) => e.winner && e.title !== "No Award").length;
  const totalFinalists = pulitzers.entries.filter((e: Entry) => !e.winner).length;

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
            background: 'radial-gradient(ellipse at 70% 20%, rgba(151,169,124,0.3) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(203,173,140,0.25) 0%, transparent 40%)'
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
              Book Archive
            </p>
            <h1
              className="text-5xl md:text-6xl lg:text-7xl mb-6 tracking-tight leading-[0.9]"
              style={{
                fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                color: '#2a3c24'
              }}
            >
              Pulitzer Prize<br />
              <span style={{ color: '#cbad8c' }}>Winners & Finalists.</span>
            </h1>
            <p
              className="text-lg md:text-xl leading-relaxed max-w-xl"
              style={{ color: 'rgba(42,60,36,0.7)' }}
            >
              Pulitzer Prize for Fiction and General Nonfiction from 2010-2025.
            </p>

            {/* Category Legend */}
            <div className="flex flex-wrap gap-2 mt-6">
              {pulitzers.categories.map((cat: string) => {
                const style = getCategoryStyle(cat);
                return (
                  <span
                    key={cat}
                    className="px-3 py-1 rounded text-xs font-medium"
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
              {/* Search */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search title or author..."
                className="px-4 py-1.5 bg-white rounded-full text-xs border border-sand focus:outline-none focus:border-olive w-48"
              />

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1.5 bg-white rounded-full text-xs border border-sand focus:outline-none focus:border-olive"
              >
                <option value="all">All Categories</option>
                {pulitzers.categories.map((cat: string) => (
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
              {(selectedCategory !== "all" || selectedYear !== "all" || winnersOnly || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedYear("all");
                    setWinnersOnly(false);
                    setSearchQuery("");
                  }}
                  className="px-3 py-1.5 rounded-full text-xs text-olive hover:text-deep-forest transition-colors underline"
                >
                  Clear filters
                </button>
              )}
            </div>

            <span className="text-xs" style={{ color: 'rgba(42,60,36,0.5)' }}>
              {filteredEntries.length} of {totalEntries} entries
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
                  color: '#cbad8c'
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
                {totalFinalists}
              </p>
              <p className="text-xs text-olive/60 mt-1">Finalists</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center border border-sand/30">
              <p
                className="text-3xl"
                style={{
                  fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                  color: '#97a97c'
                }}
              >
                {pulitzers.categories.length}
              </p>
              <p className="text-xs text-olive/60 mt-1">Categories</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center border border-sand/30">
              <p
                className="text-3xl"
                style={{
                  fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                  color: '#546e40'
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
              {/* Year Header */}
              <div
                className="rounded-xl px-6 py-4 mb-6 flex items-center justify-between"
                style={{ backgroundColor: '#2a3c24' }}
              >
                <h2
                  className="text-3xl tracking-tight"
                  style={{
                    fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                    color: '#cbad8c'
                  }}
                >
                  {year}
                </h2>
                <span style={{ color: 'rgba(203,173,140,0.7)' }} className="text-xs">
                  {groupedByYear[year].filter((e: Entry) => e.winner).length} winners · {groupedByYear[year].length} entries
                </span>
              </div>

              {/* Entries Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                {groupedByYear[year].map((entry: Entry, idx: number) => {
                  const catStyle = getCategoryStyle(entry.category);
                  const isNoAward = entry.title === "No Award";

                  return (
                    <div
                      key={`${entry.title}-${entry.category}-${idx}`}
                      className={`rounded-xl p-5 transition-all bg-white ${isNoAward ? 'opacity-50' : ''}`}
                      style={{
                        borderLeft: `4px solid ${catStyle.border}`,
                        borderTop: '1px solid rgba(0,0,0,0.05)',
                        borderRight: '1px solid rgba(0,0,0,0.05)',
                        borderBottom: '1px solid rgba(0,0,0,0.05)',
                        boxShadow: entry.winner ? `0 0 0 2px ${catStyle.border}40` : 'none'
                      }}
                    >
                      {/* Winner Badge */}
                      {entry.winner && !isNoAward && (
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
                        {entry.category}
                      </span>

                      {/* Title */}
                      <h3
                        className="text-lg tracking-tight mb-1"
                        style={{
                          fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                          color: '#2a3c24'
                        }}
                      >
                        {entry.title}
                      </h3>

                      {!isNoAward && (
                        <>
                          {/* Author & Publisher */}
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-sm" style={{ color: '#546e40' }}>
                              {entry.author}
                            </span>
                            <span className="text-xs" style={{ color: 'rgba(42,60,36,0.4)' }}>•</span>
                            <span className="text-xs" style={{ color: 'rgba(42,60,36,0.5)' }}>
                              {entry.publisher}
                            </span>
                          </div>

                          {/* Description */}
                          <p className="text-xs leading-relaxed" style={{ color: 'rgba(42,60,36,0.6)' }}>
                            {entry.description}
                          </p>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {filteredEntries.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg" style={{ color: 'rgba(42,60,36,0.5)' }}>
                No entries match your filters.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedYear("all");
                  setWinnersOnly(false);
                  setSearchQuery("");
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
