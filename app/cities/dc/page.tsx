import Link from "next/link";

export default function DCPage() {
  return (
    <div className="bg-cream">
      {/* Hero */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(ellipse at 70% 30%, rgba(212,237,57,0.2) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(151,169,124,0.3) 0%, transparent 50%)'
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
              Washington, DC
            </h1>
            <p
              className="text-lg leading-relaxed max-w-xl"
              style={{ color: 'rgba(42,60,36,0.7)' }}
            >
              My first city. Five years of discovering corners, routines, and places that feel like mine.
            </p>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Running Routes */}
      <section className="py-16" style={{ background: 'linear-gradient(180deg, #F7E5DA 0%, #EFE4D6 100%)' }}>
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <p
                className="text-xs uppercase tracking-widest mb-4"
                style={{ color: '#546e40' }}
              >
                Running
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'rgba(42,60,36,0.7)' }}
              >
                The routes I actually run. Nothing fancy, just reliable miles.
              </p>
            </div>
            <div className="md:col-span-8">
              <div className="grid md:grid-cols-2 gap-4">
                <div
                  className="rounded-xl p-5"
                  style={{ background: 'linear-gradient(135deg, #2a3c24 0%, #4e6041 100%)' }}
                >
                  <h3
                    className="text-lg mb-2"
                    style={{
                      fontFamily: 'var(--font-instrument), Georgia, serif',
                      color: '#fff5eb'
                    }}
                  >
                    Connecticut Ave
                  </h3>
                  <p className="text-sm" style={{ color: 'rgba(255,245,235,0.7)' }}>
                    Straight shot north, perfect for tempo days
                  </p>
                </div>
                <div
                  className="rounded-xl p-5"
                  style={{ background: 'linear-gradient(135deg, #4e6041 0%, #677955 100%)' }}
                >
                  <h3
                    className="text-lg mb-2"
                    style={{
                      fontFamily: 'var(--font-instrument), Georgia, serif',
                      color: '#fff5eb'
                    }}
                  >
                    Down to the Mall
                  </h3>
                  <p className="text-sm" style={{ color: 'rgba(255,245,235,0.7)' }}>
                    Monuments, tourists, wide open space
                  </p>
                </div>
                <div
                  className="rounded-xl p-5"
                  style={{ background: 'linear-gradient(135deg, #677955 0%, #97a97c 100%)' }}
                >
                  <h3
                    className="text-lg mb-2"
                    style={{
                      fontFamily: 'var(--font-instrument), Georgia, serif',
                      color: '#fff5eb'
                    }}
                  >
                    Mt Vernon Trail
                  </h3>
                  <p className="text-sm" style={{ color: 'rgba(255,245,235,0.8)' }}>
                    Along the Potomac to Alexandria
                  </p>
                </div>
                <div
                  className="rounded-xl p-5"
                  style={{ background: 'linear-gradient(135deg, #97a97c 0%, #cbad8c 100%)' }}
                >
                  <h3
                    className="text-lg mb-2"
                    style={{
                      fontFamily: 'var(--font-instrument), Georgia, serif',
                      color: '#2a3c24'
                    }}
                  >
                    C&O to Capital Crescent
                  </h3>
                  <p className="text-sm" style={{ color: 'rgba(42,60,36,0.7)' }}>
                    Canal path, shaded, long run territory
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Museums & Galleries */}
      <section className="py-16">
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-12 mb-12">
            <div className="md:col-span-4">
              <p
                className="text-xs uppercase tracking-widest mb-4"
                style={{ color: '#546e40' }}
              >
                Museums & Galleries
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'rgba(42,60,36,0.7)' }}
              >
                The art and culture that keeps me coming back.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name: 'Hirshhorn', desc: 'Modern art, the sculpture garden', color: '#2a3c24' },
              { name: 'National Gallery East Wing', desc: 'The I.M. Pei building alone', color: '#36482e' },
              { name: 'The Renwick', desc: 'Craft and decorative arts', color: '#425438' },
              { name: 'Phillips Collection', desc: 'Intimate, personal, Rothko room', color: '#4e6041' },
              { name: 'Hillwood Estate', desc: 'Hidden gem, beautiful gardens', color: '#5a6c4b' },
              { name: 'Botanic Garden', desc: 'Free, peaceful, always blooming', color: '#677955' },
            ].map((spot, idx) => (
              <div
                key={spot.name}
                className="rounded-xl p-5 transition-all hover:scale-[1.02]"
                style={{ background: `linear-gradient(135deg, ${spot.color} 0%, ${idx % 2 === 0 ? '#4e6041' : '#677955'} 100%)` }}
              >
                <h3
                  className="text-lg mb-2"
                  style={{
                    fontFamily: 'var(--font-instrument), Georgia, serif',
                    color: '#fff5eb'
                  }}
                >
                  {spot.name}
                </h3>
                <p className="text-sm" style={{ color: 'rgba(255,245,235,0.7)' }}>
                  {spot.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Hangouts & Rituals */}
      <section className="py-16" style={{ background: 'linear-gradient(180deg, #EFE4D6 0%, #F7E5DA 100%)' }}>
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-12 mb-12">
            <div className="md:col-span-4">
              <p
                className="text-xs uppercase tracking-widest mb-4"
                style={{ color: '#546e40' }}
              >
                Hangouts & Rituals
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'rgba(42,60,36,0.7)' }}
              >
                The routines and spots that make DC feel like home.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name: 'Malcolm X Park', desc: 'Sunday drums, city views', bg: '#ffcb69' },
              { name: 'Dupont Farmers Market', desc: 'Sunday morning ritual', bg: '#ffeac4' },
              { name: 'Georgetown Waterfront', desc: 'Walking, sitting, watching boats', bg: '#d4ed39' },
              { name: 'National Cathedral', desc: 'The grounds, the quiet', bg: '#cbad8c' },
              { name: 'REI + La Colombe', desc: 'Gear browsing, coffee after', bg: '#97a97c' },
              { name: 'Crumbs & Whiskers', desc: 'Cat cafe in Georgetown', bg: '#ffd475' },
              { name: 'All Fired Up', desc: 'Paint your own pottery', bg: '#ffe5b0' },
              { name: 'Water Taxi to Alexandria', desc: 'Best way to get there', bg: '#8b9d72' },
              { name: 'Brentwood Warehouses', desc: 'Raves, if you know', bg: '#5a6c4b' },
            ].map((spot) => {
              const isDark = ['#97a97c', '#8b9d72', '#5a6c4b'].includes(spot.bg);
              return (
                <div
                  key={spot.name}
                  className="rounded-xl p-5 transition-all hover:scale-[1.02]"
                  style={{ backgroundColor: spot.bg }}
                >
                  <h3
                    className="text-lg mb-2"
                    style={{
                      fontFamily: 'var(--font-instrument), Georgia, serif',
                      color: isDark ? '#fff5eb' : '#2a3c24'
                    }}
                  >
                    {spot.name}
                  </h3>
                  <p className="text-sm" style={{ color: isDark ? 'rgba(255,245,235,0.7)' : 'rgba(42,60,36,0.7)' }}>
                    {spot.desc}
                  </p>
                </div>
              );
            })}
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
