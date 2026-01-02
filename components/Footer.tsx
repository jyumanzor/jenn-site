import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      {/* Main Footer Content */}
      <div className="py-10" style={{ backgroundColor: '#3A4A2B' }}>
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-10">
            {/* Brand Column */}
            <div className="md:col-span-4">
              <Link
                href="/"
                className="text-3xl mb-3 block transition-colors hover:opacity-70"
                style={{ fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif', color: '#D4ED39' }}
              >
                Jenn
              </Link>
              <p className="text-cream/60 text-sm leading-relaxed mb-5 font-light">
                Economic consultant. Marathon runner. Based in Washington, DC.
              </p>
              <div className="flex gap-3">
                <a
                  href="https://www.strava.com/athletes/181780869"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-70 transition-all"
                  style={{ backgroundColor: 'rgba(212, 237, 57, 0.15)', color: '#D4ED39' }}
                  aria-label="Strava"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/jennumanzor/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-70 transition-all"
                  style={{ backgroundColor: 'rgba(212, 237, 57, 0.15)', color: '#D4ED39' }}
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/in/jennifer-umanzor-1072a7176/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-70 transition-all"
                  style={{ backgroundColor: 'rgba(212, 237, 57, 0.15)', color: '#D4ED39' }}
                  aria-label="LinkedIn"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Navigation Column */}
            <div className="md:col-span-2">
              <p className="text-cream/50 text-xs uppercase tracking-wider mb-3">Explore</p>
              <div className="flex flex-col gap-2">
                <Link
                  href="/running"
                  className="text-base transition-colors hover:opacity-70"
                  style={{ fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif', color: '#D4ED39' }}
                >
                  Running
                </Link>
                <Link
                  href="/dining"
                  className="text-base transition-colors hover:opacity-70"
                  style={{ fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif', color: '#D4ED39' }}
                >
                  Dining
                </Link>
                <Link
                  href="/travel"
                  className="text-base transition-colors hover:opacity-70"
                  style={{ fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif', color: '#D4ED39' }}
                >
                  Travel
                </Link>
                <Link
                  href="/culture"
                  className="text-base transition-colors hover:opacity-70"
                  style={{ fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif', color: '#D4ED39' }}
                >
                  Culture
                </Link>
              </div>
            </div>

            {/* More Navigation */}
            <div className="md:col-span-2">
              <p className="text-cream/50 text-xs uppercase tracking-wider mb-3">More</p>
              <div className="flex flex-col gap-2">
                <Link
                  href="/cities/dc"
                  className="text-base transition-colors hover:opacity-70"
                  style={{ fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif', color: '#D4ED39' }}
                >
                  City Guides
                </Link>
                <Link
                  href="/tattoos"
                  className="text-base transition-colors hover:opacity-70"
                  style={{ fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif', color: '#D4ED39' }}
                >
                  Tattoos
                </Link>
                <Link
                  href="/journal"
                  className="text-base transition-colors hover:opacity-70"
                  style={{ fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif', color: '#D4ED39' }}
                >
                  Journal
                </Link>
                <Link
                  href="/work"
                  className="text-base transition-colors hover:opacity-70"
                  style={{ fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif', color: '#D4ED39' }}
                >
                  Work
                </Link>
                <Link
                  href="/portfolio"
                  className="text-base transition-colors hover:opacity-70"
                  style={{ fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif', color: '#D4ED39' }}
                >
                  Portfolio
                </Link>
              </div>
            </div>

            {/* Stats Column */}
            <div className="md:col-span-4">
              <p className="text-cream/50 text-xs uppercase tracking-wider mb-3">By the numbers</p>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-cream/5 rounded-lg p-3 text-center">
                  <p
                    className="text-xl"
                    style={{ fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif', color: '#D4ED39' }}
                  >
                    3:09
                  </p>
                  <p className="text-cream/60 text-xs mt-0.5">PR</p>
                </div>
                <div className="bg-cream/5 rounded-lg p-3 text-center">
                  <p
                    className="text-xl text-cream"
                    style={{ fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif' }}
                  >
                    6
                  </p>
                  <p className="text-cream/60 text-xs mt-0.5">Marathons</p>
                </div>
                <div className="bg-cream/5 rounded-lg p-3 text-center">
                  <p
                    className="text-xl text-cream"
                    style={{ fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif' }}
                  >
                    0/7
                  </p>
                  <p className="text-cream/60 text-xs mt-0.5">Majors</p>
                </div>
              </div>
              <p className="text-cream/50 text-xs mt-3">
                <span className="uppercase tracking-wider" style={{ color: '#D4ED39' }}>Upcoming</span>
                <span className="text-cream/70 ml-2">Boston & Chicago 2026</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-cream/10 mt-6">
          <div className="container-editorial py-4">
            <div className="flex justify-between items-center pt-2">
              <Link
                href="/io"
                className="text-xs px-3 py-1.5 rounded-full transition-all hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #FABF34 0%, #D4A853 50%, #CC7722 100%)',
                  color: '#2F2F2C',
                  fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                  fontStyle: 'italic',
                }}
              >
                Jenn&apos;s IO
              </Link>
              <p className="text-xs text-cream/50">&copy; {currentYear} Jenn. Washington, DC. <span className="text-cream/30">Est. 2025</span></p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
