'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import journal from "@/data/journal.json";

const CORRECT_PASSWORD = 'jenn.io';

export default function JournalPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const auth = localStorage.getItem('jenn-journal-auth');
    if (auth === 'true') setIsAuthenticated(true);
  }, []);

  const handleLogin = () => {
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('jenn-journal-auth', 'true');
      setError('');
    } else {
      setError('Wrong password');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <h1 className="text-2xl mb-2 italic" style={{ color: '#3B412D', fontFamily: 'var(--font-instrument)' }}>
            Journal
          </h1>
          <p className="text-sm mb-6" style={{ color: '#97A97C' }}>Private entries</p>
          <div className="flex flex-col gap-3 items-center">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="Password"
              className="px-4 py-3 rounded-lg text-center text-sm"
              style={{ background: '#FFF5EB', color: '#3B412D', border: '1px solid #97A97C', width: '200px' }}
              autoFocus
            />
            <button
              onClick={handleLogin}
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: '#546E40', color: '#FFF5EB' }}
            >
              Enter
            </button>
            {error && <p className="text-sm" style={{ color: '#CC7722' }}>{error}</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream">
      {/* Hero */}
      <section className="pt-8 pb-12 md:pt-16 md:pb-16">
        <div className="container-editorial">
          <div className="max-w-2xl">
            <p className="section-label mb-3">Journal</p>
            <h1 className="font-display text-charcoal mb-4">
              Ideas and observations.
            </h1>
            <p className="text-warm-gray leading-relaxed reading-width">
              Essays, thoughts, and explorations.
            </p>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Entries */}
      <section className="py-12">
        <div className="container-editorial">
          {journal.entries.map((entry, index) => {
            // Extended palette with more variety - neutrals, greens, warm tones
            const styles = [
              { bg: 'linear-gradient(135deg, #97A97C 0%, #546E40 60%, #3C422E 100%)', isDark: true },
              { bg: 'linear-gradient(135deg, #F7E5DA 0%, #EFE4D6 50%, #CBAD8C 100%)', isDark: false },
              { bg: 'linear-gradient(135deg, #3B412D 0%, #3C422E 50%, #546E40 100%)', isDark: true },
              { bg: 'linear-gradient(135deg, #CBAD8C 0%, #97A97C 60%, #546E40 100%)', isDark: true },
              { bg: 'linear-gradient(135deg, #EFE4D6 0%, #E7D8C6 50%, #CBAD8C 100%)', isDark: false },
              { bg: 'linear-gradient(135deg, #546E40 0%, #3C422E 60%, #3B412D 100%)', isDark: true },
            ];
            const style = styles[index % styles.length];
            return (
              <article key={entry.id} className="mb-4">
                <div className="rounded-xl p-6" style={{ background: style.bg }}>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span
                      className="text-xs uppercase tracking-wider px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: style.isDark ? 'rgba(255,255,255,0.15)' : 'rgba(59,65,45,0.12)',
                        color: style.isDark ? '#FFF5EB' : '#3B412D'
                      }}
                    >
                      {entry.category}
                    </span>
                    {entry.tags?.includes('MBA') && (
                      <span
                        className="text-xs uppercase tracking-wider px-2 py-0.5 rounded font-medium"
                        style={{
                          backgroundColor: '#d4ed39',
                          color: '#2A3C24'
                        }}
                      >
                        MBA
                      </span>
                    )}
                    {entry.tags?.includes('thesis') && (
                      <span
                        className="text-xs uppercase tracking-wider px-2 py-0.5 rounded font-medium"
                        style={{
                          backgroundColor: style.isDark ? 'rgba(255,255,255,0.25)' : 'rgba(59,65,45,0.2)',
                          color: style.isDark ? '#FFF5EB' : '#3B412D'
                        }}
                      >
                        Thesis
                      </span>
                    )}
                    {/* Year tag - always last */}
                    <span
                      className="text-xs px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: style.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(59,65,45,0.08)',
                        color: style.isDark ? 'rgba(255,245,235,0.6)' : 'rgba(59,65,45,0.5)'
                      }}
                    >
                      {entry.date}
                    </span>
                  </div>
                  <h2
                    className="text-xl mb-2"
                    style={{
                      fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                      color: style.isDark ? '#FFF5EB' : '#3B412D'
                    }}
                  >
                    {entry.title}
                  </h2>
                  {entry.context && (
                    <p
                      className="text-xs leading-relaxed mb-3 italic"
                      style={{ color: style.isDark ? 'rgba(255,245,235,0.5)' : 'rgba(59,65,45,0.5)' }}
                    >
                      {entry.context}
                    </p>
                  )}
                  <p
                    className="text-sm leading-relaxed mb-4 reading-width"
                    style={{ color: style.isDark ? 'rgba(255,245,235,0.7)' : 'rgba(59,65,45,0.7)' }}
                  >
                    {entry.excerpt}
                  </p>
                  <Link
                    href={`/journal/${entry.id}`}
                    className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-full transition-all bg-deep-forest hover:bg-olive"
                    style={{ color: '#d4ed39' }}
                  >
                    Read more
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <hr className="rule" />

      {/* Quotes Section - continues gradient flow into golds/creams */}
      <section className="py-12 bg-cream relative overflow-hidden">
        <div className="container-editorial relative">
          <div className="grid md:grid-cols-12 gap-8 mb-8">
            <div className="md:col-span-4">
              <p className="section-label mb-3">On living</p>
              <p className="text-warm-gray text-sm leading-snug">
                Quotes from How I Met Your Mother.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            {journal.himymQuotes.map((quote, index) => {
              // Mixed pattern to avoid color blocking on left/right columns
              // For 2-col grid: 0=sage, 1=warm, 2=olive, 3=sage, 4=warm, 5=olive, 6=sage, 7=warm
              const styles = [
                { bg: "panel-gradient-sage", isDark: false },
                { bg: "panel-gradient-warm-neutral", isDark: false },
                { bg: "panel-gradient-olive", isDark: true },
                { bg: "panel-gradient-sage", isDark: false },
                { bg: "panel-gradient-warm-neutral", isDark: false },
                { bg: "panel-gradient-olive", isDark: true },
                { bg: "panel-gradient-sage", isDark: false },
                { bg: "panel-gradient-warm-neutral", isDark: false }
              ];
              const style = styles[index % styles.length];
              return (
                <div
                  key={index}
                  className={`rounded-xl p-5 ${style.bg}`}
                >
                  <div className="flex gap-3">
                    <span
                      className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs ${style.isDark ? "bg-white/20 text-cream" : "bg-deep-forest/15 text-deep-forest"}`}
                    >
                      {index + 1}
                    </span>
                    <blockquote className={`text-sm leading-relaxed ${style.isDark ? "text-cream" : "text-deep-forest"}`}>
                      &ldquo;{quote}&rdquo;
                    </blockquote>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Back Link */}
      <section className="py-10">
        <div className="container-editorial">
          <Link href="/" className="link-editorial text-sm">
            ← Back to home
          </Link>
        </div>
      </section>
    </div>
  );
}
