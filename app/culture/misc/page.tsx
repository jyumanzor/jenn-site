"use client";

import Link from "next/link";

const miscCategories = [
  {
    id: "nobel-economics",
    title: "Nobel Prize in Economics",
    description: "Sveriges Riksbank Prize winners from 2000-2024 with accessible explainers of their contributions.",
    icon: "📊",
    href: "/culture/misc/nobel-economics",
    color: "#ffcb69",
    count: "25 laureates"
  },
];

export default function MiscPage() {
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
              Archives
            </p>
            <h1
              className="text-5xl md:text-6xl lg:text-7xl mb-6 tracking-tight leading-[0.9]"
              style={{
                fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                color: '#2a3c24'
              }}
            >
              Miscellaneous<br />
              <span style={{ color: '#97a97c' }}>Collections.</span>
            </h1>
            <p
              className="text-lg md:text-xl leading-relaxed max-w-xl"
              style={{ color: 'rgba(42,60,36,0.7)' }}
            >
              Curated lists and archives of notable achievements across fields.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12">
        <div className="container-editorial">
          <div className="grid md:grid-cols-2 gap-6">
            {miscCategories.map((category) => (
              <Link
                key={category.id}
                href={category.href}
                className="group rounded-xl p-6 transition-all hover:shadow-lg"
                style={{
                  backgroundColor: 'white',
                  border: `2px solid ${category.color}40`
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ backgroundColor: `${category.color}30` }}
                  >
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <h3
                      className="text-xl mb-2 group-hover:underline"
                      style={{
                        fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                        color: '#2a3c24'
                      }}
                    >
                      {category.title}
                    </h3>
                    <p className="text-sm mb-3" style={{ color: 'rgba(42,60,36,0.6)' }}>
                      {category.description}
                    </p>
                    <span
                      className="text-xs px-2 py-1 rounded-full"
                      style={{ backgroundColor: `${category.color}30`, color: '#2a3c24' }}
                    >
                      {category.count}
                    </span>
                  </div>
                  <svg
                    className="w-5 h-5 flex-shrink-0 transition-transform group-hover:translate-x-1"
                    style={{ color: category.color }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          {/* Coming Soon */}
          <div className="mt-12 p-8 rounded-xl text-center" style={{ backgroundColor: 'rgba(42,60,36,0.05)' }}>
            <p className="text-sm" style={{ color: 'rgba(42,60,36,0.5)' }}>
              More collections coming soon...
            </p>
          </div>
        </div>
      </section>

      {/* Back Link */}
      <section className="py-12">
        <div className="container-editorial">
          <Link href="/culture" className="link-editorial text-sm">
            ← Back to Culture
          </Link>
        </div>
      </section>
    </div>
  );
}
