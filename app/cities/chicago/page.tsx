import Link from "next/link";

export default function ChicagoPage() {
  return (
    <div className="bg-cream">
      {/* Hero */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(ellipse at 30% 70%, rgba(212,237,57,0.2) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(151,169,124,0.3) 0%, transparent 50%)'
          }}
        />
        <div className="container-editorial relative">
          <div className="max-w-2xl">
            <p
              className="text-xs uppercase tracking-widest mb-4"
              style={{ color: '#546e40' }}
            >
              City Guide
            </p>
            <h1
              className="text-5xl md:text-6xl mb-6 tracking-tight"
              style={{
                fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                color: '#2a3c24'
              }}
            >
              Chicago
            </h1>
            <p
              className="text-lg leading-relaxed max-w-xl"
              style={{ color: 'rgba(42,60,36,0.7)' }}
            >
              College, marathon, business school. Coming back in 2026.
            </p>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* The Marathon */}
      <section className="py-16" style={{ background: 'linear-gradient(180deg, #F7E5DA 0%, #EFE4D6 100%)' }}>
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <p
                className="text-xs uppercase tracking-widest mb-4"
                style={{ color: '#546e40' }}
              >
                Chicago 2026
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'rgba(42,60,36,0.7)' }}
              >
                Second World Major. Back where I went to college.
              </p>
            </div>
            <div className="md:col-span-8">
              <div
                className="rounded-2xl p-8"
                style={{ background: 'linear-gradient(135deg, #2a3c24 0%, #4e6041 100%)' }}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h3
                    className="text-2xl md:text-3xl"
                    style={{
                      fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                      color: '#fff5eb'
                    }}
                  >
                    Chicago Marathon
                  </h3>
                  <span
                    className="text-xs uppercase tracking-widest px-3 py-1 rounded-full"
                    style={{ backgroundColor: '#d4ed39', color: '#2a3c24' }}
                  >
                    Registered
                  </span>
                </div>
                <p className="text-sm mb-4" style={{ color: 'rgba(255,245,235,0.7)' }}>
                  October 11, 2026 · Grant Park
                </p>
                <p className="leading-relaxed" style={{ color: 'rgba(255,245,235,0.85)' }}>
                  Flat course through 29 neighborhoods. Running it after Boston.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* UChicago */}
      <section className="py-16">
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <p
                className="text-xs uppercase tracking-widest mb-4"
                style={{ color: '#546e40' }}
              >
                UChicago
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'rgba(42,60,36,0.7)' }}
              >
                Four years in Hyde Park. Returning for Booth in 2026.
              </p>
            </div>
            <div className="md:col-span-8">
              <div
                className="rounded-2xl p-8"
                style={{ background: 'linear-gradient(135deg, #97a97c 0%, #cbad8c 100%)' }}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h3
                    className="text-xl"
                    style={{
                      fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                      color: '#2a3c24'
                    }}
                  >
                    University of Chicago
                  </h3>
                  <a
                    href="https://www.questbridge.org/high-school-students/national-college-match"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-all hover:scale-105"
                    style={{ backgroundColor: '#2a3c24', color: '#d4ed39' }}
                    title="QuestBridge matches high-achieving, low-income students with full scholarships to top colleges"
                  >
                    <span>QuestBridge</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </a>
                </div>
                <p className="leading-relaxed mb-6" style={{ color: 'rgba(42,60,36,0.8)' }}>
                  Sociology and HIPS. Match Scholar for undergrad and MBA.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div
                    className="rounded-xl p-4"
                    style={{ backgroundColor: 'rgba(42,60,36,0.1)' }}
                  >
                    <p
                      className="text-2xl mb-1"
                      style={{
                        fontFamily: 'var(--font-instrument), Georgia, serif',
                        color: '#2a3c24'
                      }}
                    >
                      2021
                    </p>
                    <p className="text-xs uppercase tracking-wider" style={{ color: '#546e40' }}>Graduated</p>
                  </div>
                  <div
                    className="rounded-xl p-4"
                    style={{ backgroundColor: 'rgba(42,60,36,0.1)' }}
                  >
                    <p
                      className="text-2xl mb-1"
                      style={{
                        fontFamily: 'var(--font-instrument), Georgia, serif',
                        color: '#2a3c24'
                      }}
                    >
                      Booth
                    </p>
                    <p className="text-xs uppercase tracking-wider" style={{ color: '#546e40' }}>Sept 2026</p>
                  </div>
                  <div
                    className="rounded-xl p-4"
                    style={{ backgroundColor: 'rgba(42,60,36,0.1)' }}
                  >
                    <p
                      className="text-2xl mb-1"
                      style={{
                        fontFamily: 'var(--font-instrument), Georgia, serif',
                        color: '#2a3c24'
                      }}
                    >
                      Hallowed Grounds
                    </p>
                    <p className="text-xs uppercase tracking-wider" style={{ color: '#546e40' }}>Fav cafe</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Places to Explore */}
      <section className="py-16" style={{ background: 'linear-gradient(180deg, #EFE4D6 0%, #F7E5DA 100%)' }}>
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-12 mb-10">
            <div className="md:col-span-4">
              <p
                className="text-xs uppercase tracking-widest mb-4"
                style={{ color: '#546e40' }}
              >
                Exploring
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'rgba(42,60,36,0.7)' }}
              >
                Restaurants and spots from my college years and beyond.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name: 'Restaurants', desc: 'Hyde Park favorites and city-wide picks', color: '#ffcb69', soon: true },
              { name: 'Running Routes', desc: 'Lakefront Trail, the Midway', color: '#ffeac4', soon: true },
              { name: 'Things to Do', desc: 'Art Institute, neighborhoods, spots', color: '#d4ed39', soon: true },
            ].map((item) => (
              <div
                key={item.name}
                className="rounded-xl p-6"
                style={{ backgroundColor: item.color }}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3
                    className="text-lg"
                    style={{
                      fontFamily: 'var(--font-instrument), Georgia, serif',
                      color: '#2a3c24'
                    }}
                  >
                    {item.name}
                  </h3>
                  {item.soon && (
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(42,60,36,0.1)', color: '#546e40' }}>
                      Soon
                    </span>
                  )}
                </div>
                <p className="text-sm" style={{ color: 'rgba(42,60,36,0.7)' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Back Link */}
      <section className="py-12 bg-cream">
        <div className="container-editorial">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm transition-colors"
            style={{ color: '#546e40' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Back to home
          </Link>
        </div>
      </section>
    </div>
  );
}
