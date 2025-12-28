"use client";

import { useState } from "react";
import Link from "next/link";
import nobelData from "@/data/nobel-economics.json";

type Laureate = typeof nobelData.laureates[0];

export default function NobelEconomicsPage() {
  const [expandedYear, setExpandedYear] = useState<number | null>(null);
  const [selectedLaureate, setSelectedLaureate] = useState<Laureate | null>(null);

  const toggleYear = (year: number) => {
    setExpandedYear(expandedYear === year ? null : year);
  };

  const openExplainer = (laureate: Laureate) => {
    setSelectedLaureate(laureate);
  };

  const closeExplainer = () => {
    setSelectedLaureate(null);
  };

  return (
    <div className="bg-cream min-h-screen">
      {/* Hero */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(ellipse at 70% 20%, rgba(255,203,105,0.3) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(151,169,124,0.2) 0%, transparent 40%)'
          }}
        />
        <div className="container-editorial relative">
          <Link
            href="/watching/misc"
            className="inline-flex items-center gap-2 text-sm mb-6 transition-colors"
            style={{ color: '#546e40' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Archives
          </Link>
          <div className="max-w-3xl">
            <p
              className="text-xs uppercase tracking-widest mb-4"
              style={{ color: '#546e40' }}
            >
              Economics Archive
            </p>
            <h1
              className="text-5xl md:text-6xl lg:text-7xl mb-6 tracking-tight leading-[0.9]"
              style={{
                fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                color: '#2a3c24'
              }}
            >
              Nobel Prize in<br />
              <span style={{ color: '#ffcb69' }}>Economics.</span>
            </h1>
            <p
              className="text-lg md:text-xl leading-relaxed max-w-xl"
              style={{ color: 'rgba(42,60,36,0.7)' }}
            >
              Sveriges Riksbank Prize winners from 2000-2024 with accessible explainers of their contributions to economic theory and practice.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8">
        <div className="container-editorial">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 text-center border border-sand/30">
              <p
                className="text-3xl"
                style={{
                  fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                  color: '#ffcb69'
                }}
              >
                {nobelData.laureates.length}
              </p>
              <p className="text-xs text-olive/60 mt-1">Prize Years</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center border border-sand/30">
              <p
                className="text-3xl"
                style={{
                  fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                  color: '#2a3c24'
                }}
              >
                {nobelData.laureates.reduce((acc, l) => acc + l.names.length, 0)}
              </p>
              <p className="text-xs text-olive/60 mt-1">Laureates</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center border border-sand/30">
              <p
                className="text-3xl"
                style={{
                  fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                  color: '#546e40'
                }}
              >
                25
              </p>
              <p className="text-xs text-olive/60 mt-1">Years</p>
            </div>
          </div>
        </div>
      </section>

      {/* Laureates List */}
      <section className="py-8 pb-20">
        <div className="container-editorial">
          <div className="space-y-4">
            {nobelData.laureates.map((laureate) => (
              <div
                key={laureate.year}
                className="rounded-xl overflow-hidden bg-white border border-sand/30"
              >
                {/* Year Header - Clickable */}
                <button
                  onClick={() => toggleYear(laureate.year)}
                  className="w-full px-6 py-5 flex items-center justify-between transition-colors hover:bg-sand/10"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className="text-2xl"
                      style={{
                        fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                        color: '#ffcb69'
                      }}
                    >
                      {laureate.year}
                    </span>
                    <div className="text-left">
                      <p className="text-sm font-medium" style={{ color: '#2a3c24' }}>
                        {laureate.names.join(", ")}
                      </p>
                      <p className="text-xs" style={{ color: 'rgba(42,60,36,0.5)' }}>
                        {laureate.institution}
                      </p>
                    </div>
                  </div>
                  <svg
                    className={`w-5 h-5 transition-transform ${expandedYear === laureate.year ? 'rotate-180' : ''}`}
                    style={{ color: '#97a97c' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Expanded Content */}
                {expandedYear === laureate.year && (
                  <div className="px-6 pb-6 border-t border-sand/20">
                    <div className="pt-5">
                      {/* Citation */}
                      <p
                        className="text-base italic mb-4"
                        style={{ color: '#546e40' }}
                      >
                        &ldquo;{laureate.citation}&rdquo;
                      </p>

                      {/* Summary */}
                      <p
                        className="text-sm leading-relaxed mb-4"
                        style={{ color: 'rgba(42,60,36,0.7)' }}
                      >
                        {laureate.summary}
                      </p>

                      {/* Key Work & Link */}
                      <div className="flex flex-wrap items-center gap-3 mb-5">
                        <span
                          className="px-3 py-1 rounded-full text-xs"
                          style={{ backgroundColor: 'rgba(255,203,105,0.3)', color: '#2a3c24' }}
                        >
                          Key Work: {laureate.keyWork}
                        </span>
                        <a
                          href={laureate.workLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs underline transition-colors"
                          style={{ color: '#546e40' }}
                        >
                          View Research →
                        </a>
                      </div>

                      {/* Explainer Button */}
                      <button
                        onClick={() => openExplainer(laureate)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all hover:shadow-md"
                        style={{
                          backgroundColor: '#2a3c24',
                          color: '#fff5eb'
                        }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Explain This Concept
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explainer Modal */}
      {selectedLaureate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={closeExplainer}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-deep-forest/80 backdrop-blur-sm" />

          {/* Modal Content */}
          <div
            className="relative max-w-2xl w-full max-h-[85vh] overflow-y-auto rounded-2xl p-8"
            style={{ backgroundColor: '#fff5eb' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeExplainer}
              className="absolute top-4 right-4 p-2 rounded-full transition-colors hover:bg-sand/50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#546e40' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="mb-6">
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3"
                style={{ backgroundColor: '#ffcb69', color: '#2a3c24' }}
              >
                {selectedLaureate.year} Nobel Prize
              </span>
              <h2
                className="text-3xl tracking-tight mb-2"
                style={{
                  fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                  color: '#2a3c24'
                }}
              >
                {selectedLaureate.explainer.concept}
              </h2>
              <p className="text-sm" style={{ color: 'rgba(42,60,36,0.6)' }}>
                {selectedLaureate.names.join(", ")}
              </p>
            </div>

            {/* Simple Explanation */}
            <div className="mb-6">
              <h3
                className="text-sm font-medium uppercase tracking-wider mb-2"
                style={{ color: '#546e40' }}
              >
                The Concept
              </h3>
              <p
                className="text-base leading-relaxed"
                style={{ color: '#2a3c24' }}
              >
                {selectedLaureate.explainer.simpleExplanation}
              </p>
            </div>

            {/* Key Insight */}
            <div
              className="mb-6 p-5 rounded-xl"
              style={{ backgroundColor: 'rgba(255,203,105,0.2)' }}
            >
              <h3
                className="text-sm font-medium uppercase tracking-wider mb-2"
                style={{ color: '#b8860b' }}
              >
                Key Insight
              </h3>
              <p
                className="text-base leading-relaxed"
                style={{ color: '#2a3c24' }}
              >
                {selectedLaureate.explainer.keyInsight}
              </p>
            </div>

            {/* Practical Relevance */}
            <div
              className="p-5 rounded-xl"
              style={{ backgroundColor: 'rgba(84,110,64,0.1)' }}
            >
              <h3
                className="text-sm font-medium uppercase tracking-wider mb-2"
                style={{ color: '#546e40' }}
              >
                Why It Matters (For Practitioners)
              </h3>
              <p
                className="text-base leading-relaxed"
                style={{ color: '#2a3c24' }}
              >
                {selectedLaureate.explainer.relevance}
              </p>
            </div>

            {/* Link to Research */}
            <div className="mt-6 pt-5 border-t border-sand/30">
              <a
                href={selectedLaureate.workLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm transition-colors"
                style={{ color: '#546e40' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Explore Their Research →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Back Link */}
      <section className="py-12 bg-sand/30">
        <div className="container-editorial">
          <Link href="/watching/misc" className="link-editorial text-sm">
            ← Back to Archives
          </Link>
        </div>
      </section>
    </div>
  );
}
