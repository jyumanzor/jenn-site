"use client";

import { useState } from "react";
import Link from "next/link";
import tattoos from "@/data/tattoos.json";

type Tattoo = typeof tattoos.tattoos[0] & {
  quote?: string;
  source?: string;
};

export default function TattoosPage() {
  const [selectedTattoo, setSelectedTattoo] = useState<Tattoo | null>(null);
  const [hoveredTattoo, setHoveredTattoo] = useState<string | null>(null);

  // Group by theme/inspiration
  const literaryTattoos = tattoos.tattoos.filter(t =>
    ['little-prince', 'volcano', 'es-muss-sein', 'so-it-goes', 'umbrella'].includes(t.id)
  );
  const personalTattoos = tattoos.tattoos.filter(t =>
    ['marathon-clock', '410', 'hummingbird', 'cowboy-hat', 'disco-ball'].includes(t.id)
  );
  const whimsicalTattoos = tattoos.tattoos.filter(t =>
    ['squirrel', 'bike-lane', 'honey-pot', 'anatomical-heart', 'spoon'].includes(t.id)
  );

  return (
    <div className="bg-ivory">
      {/* Hero */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(ellipse at 30% 50%, rgba(151,169,124,0.3) 0%, transparent 50%)'
          }}
        />
        <div className="container-editorial relative">
          <div className="max-w-2xl">
            <p
              className="text-xs uppercase tracking-widest mb-4"
              style={{ color: '#546e40' }}
            >
              Tattoos
            </p>
            <h1
              className="text-5xl md:text-6xl mb-6 tracking-tight"
              style={{
                fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                color: '#2a3c24'
              }}
            >
              Stories on skin.
            </h1>
            <p
              className="text-lg leading-relaxed max-w-xl"
              style={{ color: 'rgba(42,60,36,0.7)' }}
            >
              {tattoos.stats.total} fine line tattoos. Each one marks something—a book, a person, a moment, a belief.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Body Map */}
      <section className="py-12" style={{ backgroundColor: '#f7e5da' }}>
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-8 items-start">
            {/* Body Silhouette */}
            <div className="md:col-span-5 relative flex justify-center">
              <div className="relative w-64 h-[500px]">
                {/* Simple body outline SVG */}
                <svg
                  viewBox="0 0 100 200"
                  className="w-full h-full"
                  style={{ filter: 'drop-shadow(0 4px 20px rgba(42,60,36,0.1))' }}
                >
                  {/* Body silhouette */}
                  <ellipse cx="50" cy="18" rx="12" ry="14" fill="#97a97c" opacity="0.3" />
                  <path
                    d="M38 32 L35 55 L25 48 L15 70 L20 72 L28 60 L32 75 L30 130 L35 180 L42 180 L45 130 L50 130 L55 130 L58 180 L65 180 L70 130 L68 75 L72 60 L80 72 L85 70 L75 48 L65 55 L62 32 Z"
                    fill="#97a97c"
                    opacity="0.3"
                  />
                </svg>

                {/* Tattoo markers */}
                {tattoos.tattoos.map((tattoo) => (
                  <button
                    key={tattoo.id}
                    onClick={() => setSelectedTattoo(tattoo as Tattoo)}
                    onMouseEnter={() => setHoveredTattoo(tattoo.id)}
                    onMouseLeave={() => setHoveredTattoo(null)}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200"
                    style={{
                      left: `${tattoo.position.x}%`,
                      top: `${tattoo.position.y / 2}%`,
                      zIndex: hoveredTattoo === tattoo.id || selectedTattoo?.id === tattoo.id ? 20 : 10
                    }}
                  >
                    <div
                      className={`rounded-full transition-all duration-200 flex items-center justify-center ${
                        selectedTattoo?.id === tattoo.id
                          ? 'w-6 h-6 ring-2 ring-offset-2'
                          : hoveredTattoo === tattoo.id
                          ? 'w-5 h-5'
                          : 'w-3 h-3'
                      }`}
                      style={{
                        backgroundColor: selectedTattoo?.id === tattoo.id ? '#d4ed39' : '#2a3c24',
                        ringColor: '#d4ed39'
                      }}
                    />
                    {(hoveredTattoo === tattoo.id && selectedTattoo?.id !== tattoo.id) && (
                      <div
                        className="absolute left-1/2 -translate-x-1/2 -top-8 whitespace-nowrap px-2 py-1 rounded text-xs"
                        style={{ backgroundColor: '#2a3c24', color: '#fff5eb' }}
                      >
                        {tattoo.name}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Detail Panel */}
            <div className="md:col-span-7">
              {selectedTattoo ? (
                <div
                  className="rounded-2xl p-8"
                  style={{ background: 'linear-gradient(135deg, #2a3c24 0%, #4e6041 100%)' }}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#d4ed39' }}>
                        {selectedTattoo.location.replace(/-/g, " ")}
                      </p>
                      <h3
                        className="text-2xl md:text-3xl"
                        style={{
                          fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                          color: '#fff5eb'
                        }}
                      >
                        {selectedTattoo.name}
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedTattoo(null)}
                      className="text-sm px-3 py-1 rounded-full transition-colors"
                      style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff5eb' }}
                    >
                      Close
                    </button>
                  </div>
                  <p className="text-sm mb-4" style={{ color: 'rgba(255,245,235,0.6)' }}>
                    {selectedTattoo.style}
                  </p>
                  <p className="mb-6" style={{ color: 'rgba(255,245,235,0.9)' }}>
                    {selectedTattoo.description}
                  </p>
                  <div
                    className="rounded-xl p-5"
                    style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                  >
                    <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#d4ed39' }}>
                      The meaning
                    </p>
                    <p className="leading-relaxed" style={{ color: 'rgba(255,245,235,0.85)' }}>
                      {selectedTattoo.meaning}
                    </p>
                  </div>
                  {(selectedTattoo as Tattoo).quote && (
                    <div
                      className="rounded-xl p-5 mt-4"
                      style={{ backgroundColor: 'rgba(212,237,57,0.1)' }}
                    >
                      <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#d4ed39' }}>
                        The full text
                      </p>
                      <blockquote
                        className="text-sm italic leading-relaxed"
                        style={{ color: 'rgba(255,245,235,0.8)' }}
                      >
                        &ldquo;{(selectedTattoo as Tattoo).quote}&rdquo;
                      </blockquote>
                      {(selectedTattoo as Tattoo).source && (
                        <p className="text-xs mt-4" style={{ color: 'rgba(255,245,235,0.5)' }}>
                          — {(selectedTattoo as Tattoo).source}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div
                    className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(42,60,36,0.1)' }}
                  >
                    <svg className="w-8 h-8" style={{ color: '#546e40' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                  </div>
                  <p
                    className="text-xl mb-2"
                    style={{
                      fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                      color: '#2a3c24'
                    }}
                  >
                    Click a dot to explore
                  </p>
                  <p className="text-sm" style={{ color: 'rgba(42,60,36,0.6)' }}>
                    Each point on the silhouette represents a tattoo
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* By Theme/Inspiration */}
      <section className="py-16">
        <div className="container-editorial">
          <h2
            className="text-3xl mb-12 tracking-tight"
            style={{
              fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
              color: '#2a3c24'
            }}
          >
            By inspiration
          </h2>

          {/* Literary */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span
                className="text-xs uppercase tracking-widest"
                style={{ color: '#546e40' }}
              >
                Literary
              </span>
              <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(42,60,36,0.15)' }} />
              <span className="text-xs" style={{ color: 'rgba(42,60,36,0.4)' }}>
                {literaryTattoos.length} tattoos
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              {literaryTattoos.map((tattoo, index) => {
                const colors = ['#2a3c24', '#4e6041', '#546e40', '#677955', '#8b9d72'];
                return (
                  <button
                    key={tattoo.id}
                    onClick={() => setSelectedTattoo(tattoo as Tattoo)}
                    className="px-5 py-3 rounded-full transition-all hover:scale-105"
                    style={{
                      backgroundColor: colors[index % colors.length],
                      color: '#fff5eb'
                    }}
                  >
                    <span className="font-medium">{tattoo.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Personal */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span
                className="text-xs uppercase tracking-widest"
                style={{ color: '#546e40' }}
              >
                Personal
              </span>
              <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(42,60,36,0.15)' }} />
              <span className="text-xs" style={{ color: 'rgba(42,60,36,0.4)' }}>
                {personalTattoos.length} tattoos
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              {personalTattoos.map((tattoo, index) => {
                const colors = ['#ecc064', '#ffcb69', '#ffd475', '#d4ed39', '#b29e56'];
                const isDark = index === 4;
                return (
                  <button
                    key={tattoo.id}
                    onClick={() => setSelectedTattoo(tattoo as Tattoo)}
                    className="px-5 py-3 rounded-full transition-all hover:scale-105"
                    style={{
                      backgroundColor: colors[index % colors.length],
                      color: isDark ? '#fff5eb' : '#2a3c24'
                    }}
                  >
                    <span className="font-medium">{tattoo.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Whimsical */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span
                className="text-xs uppercase tracking-widest"
                style={{ color: '#546e40' }}
              >
                Whimsical
              </span>
              <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(42,60,36,0.15)' }} />
              <span className="text-xs" style={{ color: 'rgba(42,60,36,0.4)' }}>
                {whimsicalTattoos.length} tattoos
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              {whimsicalTattoos.map((tattoo, index) => {
                const colors = ['#97a97c', '#8b9d72', '#73855f', '#677955', '#5a6c4b'];
                return (
                  <button
                    key={tattoo.id}
                    onClick={() => setSelectedTattoo(tattoo as Tattoo)}
                    className="px-5 py-3 rounded-full transition-all hover:scale-105"
                    style={{
                      backgroundColor: colors[index % colors.length],
                      color: '#fff5eb'
                    }}
                  >
                    <span className="font-medium">{tattoo.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Quick Stats */}
      <section className="py-12" style={{ backgroundColor: 'rgba(212,237,57,0.1)' }}>
        <div className="container-editorial">
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div>
              <p
                className="text-4xl mb-1"
                style={{
                  fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                  color: '#2a3c24'
                }}
              >
                {tattoos.stats.total}
              </p>
              <p className="text-xs uppercase tracking-widest" style={{ color: '#546e40' }}>Total</p>
            </div>
            <div className="w-px" style={{ backgroundColor: 'rgba(42,60,36,0.2)' }} />
            <div>
              <p
                className="text-4xl mb-1"
                style={{
                  fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                  color: '#2a3c24'
                }}
              >
                Fine Line
              </p>
              <p className="text-xs uppercase tracking-widest" style={{ color: '#546e40' }}>Style</p>
            </div>
            <div className="w-px" style={{ backgroundColor: 'rgba(42,60,36,0.2)' }} />
            <div>
              <p
                className="text-4xl mb-1"
                style={{
                  fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                  color: '#2a3c24'
                }}
              >
                5
              </p>
              <p className="text-xs uppercase tracking-widest" style={{ color: '#546e40' }}>Literary</p>
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
