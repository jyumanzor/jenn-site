"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-cream">
      {/* Editorial Hero */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-20 relative overflow-hidden">
        <div className="container-editorial relative z-10">
          <div className="max-w-3xl">
            <h1 className="light-bg-header text-4xl md:text-5xl mb-5 tracking-tight">
              Hi, I&apos;m Jenn.
            </h1>
            <p className="text-olive text-lg leading-relaxed font-light">
              Economic consultant at FTI. Marathon runner. Based in Washington, DC.
            </p>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* What I do */}
      <section className="py-14">
        <div className="container-editorial">
          <p className="light-bg-label mb-8">What I do</p>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Dark green panel */}
            <Link href="/work" className="group">
              <div className="panel-gradient-olive group-hover:scale-[1.02] transition-transform">
                <span className="dark-bg-label mb-3 block">01</span>
                <h3 className="dark-bg-header text-lg mb-2">Build</h3>
                <p className="dark-bg-body text-sm leading-snug">
                  Damages models for commercial litigation.
                </p>
              </div>
            </Link>

            {/* Sage panel */}
            <Link href="/running" className="group">
              <div className="panel-gradient-sage group-hover:scale-[1.02] transition-transform">
                <span className="light-bg-label mb-3 block">02</span>
                <h3 className="light-bg-header text-lg mb-2">Run</h3>
                <p className="light-bg-body text-sm leading-snug">
                  Marathons. Seven World Majors. Sub-3:00.
                </p>
              </div>
            </Link>

            {/* Lime accent panel */}
            <Link href="/watching" className="group">
              <div className="rounded-xl p-6 relative overflow-hidden group-hover:scale-[1.02] transition-transform" style={{ background: 'linear-gradient(135deg, #d4ed39 0%, #b5c4a0 100%)' }}>
                <span className="mb-3 block text-xs uppercase tracking-wider font-medium" style={{ color: '#2a3c24' }}>03</span>
                <h3 className="text-lg mb-2" style={{ fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif', color: '#2a3c24' }}>Explore</h3>
                <p className="text-sm leading-snug" style={{ color: 'rgba(42,60,36,0.8)' }}>
                  Cities, restaurants, films.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* About */}
      <section className="py-14">
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-4">
              <p className="light-bg-label mb-3">About</p>
            </div>
            <div className="md:col-span-8">
              <p className="light-bg-header text-xl mb-3 leading-relaxed">
                Economic consultant focused on damages analysis in commercial litigation.
              </p>
              <p className="light-bg-body text-sm leading-relaxed">
                Boston and Chicago marathons in 2026. Sub-3:00 goal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Running Stats */}
      <section className="py-14 bg-cream">
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-4">
              <p className="light-bg-label mb-3">Running</p>
              <p className="light-bg-body text-sm leading-snug mb-4">
                Seven World Majors. Boston and Chicago in 2026.
              </p>
              <Link
                href="/running"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 group"
                style={{
                  background: 'linear-gradient(135deg, #2a3c24 0%, #4e6041 100%)',
                  color: '#d4ed39',
                  boxShadow: '0 2px 8px rgba(42,60,36,0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #d4ed39 0%, #b29e56 100%)';
                  e.currentTarget.style.color = '#2a3c24';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(212,237,57,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #2a3c24 0%, #4e6041 100%)';
                  e.currentTarget.style.color = '#d4ed39';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(42,60,36,0.3)';
                }}
              >
                <span>Race history</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="md:col-span-8">
              <div className="grid grid-cols-3 gap-3">
                <div className="panel-gradient-deep p-4 text-center flex flex-col justify-center">
                  <p className="dark-bg-header text-3xl">3:09</p>
                  <p className="dark-bg-label mt-1">PR</p>
                </div>
                <div className="panel-gradient-sage p-4 text-center flex flex-col justify-center">
                  <p className="light-bg-header text-3xl">6</p>
                  <p className="light-bg-label mt-1">Marathons</p>
                </div>
                <div className="rounded-xl p-4 text-center flex flex-col justify-center" style={{ background: 'linear-gradient(135deg, #d4ed39 0%, #c5d654 100%)' }}>
                  <p className="text-3xl" style={{ fontFamily: 'var(--font-instrument), Georgia, serif', color: '#2a3c24' }}>0/7</p>
                  <p className="text-xs uppercase tracking-wider mt-1" style={{ color: '#3B412D' }}>Majors</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* City Guides */}
      <section className="py-14">
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-8 mb-8">
            <div className="md:col-span-4">
              <p className="light-bg-label mb-3">City guides</p>
              <p className="light-bg-body text-sm leading-snug">
                Restaurants, spots, and notes.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/cities/dc" className="group">
              <div className="panel-gradient-deep group-hover:scale-[1.01] transition-transform">
                <span className="dark-bg-label">Home</span>
                <h3 className="dark-bg-header text-xl mt-1 mb-1">Washington, DC</h3>
                <p className="dark-bg-body text-sm">Six years of discovering corners and routines</p>
              </div>
            </Link>

            <Link href="/cities/chicago" className="group">
              <div className="panel-gradient-olive group-hover:scale-[1.01] transition-transform">
                <span className="dark-bg-label">Roots</span>
                <h3 className="dark-bg-header text-xl mt-1 mb-1">Chicago</h3>
                <p className="dark-bg-body text-sm">UChicago years and marathon 2026</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Travel */}
      <section className="py-14 bg-cream">
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-8 mb-8">
            <div className="md:col-span-4">
              <p className="light-bg-label mb-3">Travel</p>
              <p className="light-bg-body text-sm leading-snug mb-4">
                11 countries visited.
              </p>
              <Link
                href="/travel"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 group"
                style={{
                  background: 'linear-gradient(135deg, #2a3c24 0%, #4e6041 100%)',
                  color: '#d4ed39',
                  boxShadow: '0 2px 8px rgba(42,60,36,0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #d4ed39 0%, #b29e56 100%)';
                  e.currentTarget.style.color = '#2a3c24';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(212,237,57,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #2a3c24 0%, #4e6041 100%)';
                  e.currentTarget.style.color = '#d4ed39';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(42,60,36,0.3)';
                }}
              >
                <span>View all</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="md:col-span-8">
              <div className="grid grid-cols-3 gap-3">
                <div className="panel-gradient-deep">
                  <span className="dark-bg-label">Asia</span>
                  <h3 className="dark-bg-header text-lg mt-1">Japan</h3>
                  <p className="dark-bg-body text-xs mt-1">Tokyo, Kyoto</p>
                </div>
                <div className="panel-gradient-olive">
                  <span className="dark-bg-label">Europe</span>
                  <h3 className="dark-bg-header text-lg mt-1">France</h3>
                  <p className="dark-bg-body text-xs mt-1">Paris</p>
                </div>
                <div className="panel-gradient-forest">
                  <span className="dark-bg-label">Asia</span>
                  <h3 className="dark-bg-header text-lg mt-1">Vietnam</h3>
                  <p className="dark-bg-body text-xs mt-1">Hanoi, HCMC</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Explore */}
      <section className="py-14 bg-ivory">
        <div className="container-editorial">
          <p className="light-bg-label mb-8">Explore</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href="/running" className="group">
              <div className="panel-gradient-deep group-hover:scale-[1.01] transition-transform h-full">
                <span className="dark-bg-label">Training</span>
                <h3 className="dark-bg-header text-lg mt-1">Running</h3>
              </div>
            </Link>

            <Link href="/dining" className="group">
              <div className="panel-gradient-olive group-hover:scale-[1.01] transition-transform h-full">
                <span className="dark-bg-label">149 spots</span>
                <h3 className="dark-bg-header text-lg mt-1">Dining</h3>
              </div>
            </Link>

            <Link href="/watching" className="group">
              <div className="panel-gradient-forest group-hover:scale-[1.01] transition-transform h-full">
                <span className="dark-bg-label">Lists</span>
                <h3 className="dark-bg-header text-lg mt-1">Culture</h3>
              </div>
            </Link>

            <Link href="/travel" className="group">
              <div className="panel-gradient-sage group-hover:scale-[1.01] transition-transform h-full">
                <span className="light-bg-label">11 countries</span>
                <h3 className="light-bg-header text-lg mt-1">Travel</h3>
              </div>
            </Link>

            <Link href="/work" className="group">
              <div className="panel-gradient-sage group-hover:scale-[1.01] transition-transform h-full">
                <span className="light-bg-label">FTI</span>
                <h3 className="light-bg-header text-lg mt-1">Work</h3>
              </div>
            </Link>

            <Link href="/tattoos" className="group">
              <div className="panel-gradient-deep group-hover:scale-[1.01] transition-transform h-full">
                <span className="dark-bg-label">15</span>
                <h3 className="dark-bg-header text-lg mt-1">Tattoos</h3>
              </div>
            </Link>

            <Link href="/journal" className="group col-span-2">
              <div className="panel-gradient-olive group-hover:scale-[1.01] transition-transform h-full">
                <span className="dark-bg-label">Writing</span>
                <h3 className="dark-bg-header text-lg mt-1">Journal</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>


    </div>
  );
}
