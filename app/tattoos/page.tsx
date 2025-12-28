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
            <p className="text-xs mt-3 italic" style={{ color: 'rgba(84,110,64,0.6)' }}>Click body or buttons to explore.</p>
          </div>
        </div>
      </section>

      {/* Interactive Body Map */}
      <section className="py-12" style={{ backgroundColor: '#f7e5da' }}>
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-8 items-start">
            {/* Body Silhouette */}
            <div className="md:col-span-5 relative flex justify-center">
              <div className="relative w-48 h-[480px]">
                {/* Athletic body silhouette SVG */}
                <svg
                  viewBox="0 0 200 480"
                  className="w-full h-full"
                  style={{ filter: 'drop-shadow(0 4px 20px rgba(42,60,36,0.1))' }}
                >
                  {/* Head */}
                  <ellipse cx="100" cy="32" rx="20" ry="26" fill="#97a97c" opacity="0.4" />
                  {/* Neck */}
                  <path d="M94 56 Q100 58 106 56 L105 72 Q100 74 95 72 Z" fill="#97a97c" opacity="0.4" />
                  {/* Chest */}
                  <path d="M72 74 Q100 70 128 74 L126 118 Q100 124 74 118 Z" fill="#97a97c" opacity="0.4" />
                  {/* Left Upper Arm */}
                  <path d="M72 75 L62 78 Q56 82 55 88 L52 132 Q54 136 58 134 L66 118 L72 118 Z" fill="#97a97c" opacity="0.4" />
                  {/* Right Upper Arm */}
                  <path d="M128 75 L138 78 Q144 82 145 88 L148 132 Q146 136 142 134 L134 118 L128 118 Z" fill="#97a97c" opacity="0.4" />
                  {/* Left Forearm */}
                  <path d="M52 136 L48 188 Q46 196 50 200 L56 198 L60 136 Z" fill="#97a97c" opacity="0.4" />
                  {/* Right Forearm */}
                  <path d="M148 136 L152 188 Q154 196 150 200 L144 198 L140 136 Z" fill="#97a97c" opacity="0.4" />
                  {/* Left Hand */}
                  <ellipse cx="50" cy="212" rx="7" ry="13" fill="#97a97c" opacity="0.4" />
                  {/* Right Hand */}
                  <ellipse cx="150" cy="212" rx="7" ry="13" fill="#97a97c" opacity="0.4" />
                  {/* Torso */}
                  <path d="M74 120 Q100 126 126 120 L122 165 Q100 170 78 165 Z" fill="#97a97c" opacity="0.4" />
                  {/* Waist */}
                  <path d="M78 167 Q100 172 122 167 L120 200 Q100 204 80 200 Z" fill="#97a97c" opacity="0.4" />
                  {/* Hips */}
                  <path d="M80 202 Q100 206 120 202 L122 240 Q100 245 78 240 Z" fill="#97a97c" opacity="0.4" />
                  {/* Left Thigh */}
                  <path d="M78 242 Q86 246 97 244 L95 320 Q88 323 82 320 L76 245 Z" fill="#97a97c" opacity="0.4" />
                  {/* Right Thigh */}
                  <path d="M103 244 Q114 246 122 242 L124 245 L118 320 Q112 323 105 320 Z" fill="#97a97c" opacity="0.4" />
                  {/* Left Calf */}
                  <path d="M82 322 Q89 328 95 322 L93 400 Q88 404 84 400 Z" fill="#97a97c" opacity="0.4" />
                  {/* Right Calf */}
                  <path d="M105 322 Q111 328 118 322 L116 400 Q112 404 107 400 Z" fill="#97a97c" opacity="0.4" />
                  {/* Left Ankle */}
                  <path d="M84 402 Q88 406 93 402 L92 425 Q88 428 85 425 Z" fill="#97a97c" opacity="0.4" />
                  {/* Right Ankle */}
                  <path d="M107 402 Q112 406 116 402 L115 425 Q112 428 108 425 Z" fill="#97a97c" opacity="0.4" />
                  {/* Left Foot */}
                  <ellipse cx="88" cy="440" rx="10" ry="16" fill="#97a97c" opacity="0.4" />
                  {/* Right Foot */}
                  <ellipse cx="112" cy="440" rx="10" ry="16" fill="#97a97c" opacity="0.4" />
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
                      top: `${tattoo.position.y}%`,
                      zIndex: hoveredTattoo === tattoo.id || selectedTattoo?.id === tattoo.id ? 20 : 10
                    }}
                  >
                    <div
                      className={`rounded-full transition-all duration-200 flex items-center justify-center ${
                        selectedTattoo?.id === tattoo.id
                          ? 'w-6 h-6'
                          : hoveredTattoo === tattoo.id
                          ? 'w-5 h-5'
                          : 'w-3 h-3'
                      }`}
                      style={{
                        backgroundColor: selectedTattoo?.id === tattoo.id ? '#d4ed39' : '#2a3c24',
                        boxShadow: selectedTattoo?.id === tattoo.id ? '0 0 0 2px #fff5eb, 0 0 0 4px #d4ed39' : 'none'
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
              {literaryTattoos.map((tattoo) => (
                <button
                  key={tattoo.id}
                  onClick={() => setSelectedTattoo(tattoo as Tattoo)}
                  className="px-5 py-3 rounded-full transition-all hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #2a3c24 0%, #4e6041 100%)',
                    color: '#fff5eb'
                  }}
                >
                  <span className="font-medium">{tattoo.name}</span>
                </button>
              ))}
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
              {personalTattoos.map((tattoo) => (
                <button
                  key={tattoo.id}
                  onClick={() => setSelectedTattoo(tattoo as Tattoo)}
                  className="px-5 py-3 rounded-full transition-all hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #4e6041 0%, #677955 100%)',
                    color: '#fff5eb'
                  }}
                >
                  <span className="font-medium">{tattoo.name}</span>
                </button>
              ))}
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
              {whimsicalTattoos.map((tattoo) => (
                <button
                  key={tattoo.id}
                  onClick={() => setSelectedTattoo(tattoo as Tattoo)}
                  className="px-5 py-3 rounded-full transition-all hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #677955 0%, #97a97c 100%)',
                    color: '#fff5eb'
                  }}
                >
                  <span className="font-medium">{tattoo.name}</span>
                </button>
              ))}
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
