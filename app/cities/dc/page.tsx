import Link from "next/link";

export default function DCPage() {
  return (
    <div className="bg-cream">
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container-editorial">
          <div className="max-w-2xl">
            <p className="section-label mb-4">City Guide</p>
            <h1 className="font-display text-charcoal mb-6">
              Washington, DC
            </h1>
            <p className="text-lg text-warm-gray leading-relaxed reading-width">
              Home base. Where I work, run, and eat. This is the city I know best.
            </p>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Quick Stats */}
      <section className="py-16">
        <div className="container-editorial">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <p className="stat-large">149</p>
              <p className="stat-label">Restaurants ranked</p>
            </div>
            <div>
              <p className="stat-large">4</p>
              <p className="stat-label">Years living here</p>
            </div>
            <div>
              <p className="stat-large">50+</p>
              <p className="stat-label">Running routes</p>
            </div>
            <div>
              <p className="stat-large">H St</p>
              <p className="stat-label">Neighborhood</p>
            </div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Dining */}
      <section className="py-16">
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <p className="section-label mb-4">Dining</p>
              <p className="text-warm-gray text-sm leading-relaxed mb-6">
                Every restaurant I&apos;ve been to, ranked. From quick bites to special occasions.
              </p>
              <Link href="/dining" className="link-editorial text-sm">
                View full guide →
              </Link>
            </div>
            <div className="md:col-span-8">
              <div className="space-y-4">
                <div className="process-panel">
                  <span className="numbered-label mb-4 block w-fit">1</span>
                  <h3 className="font-display text-xl text-charcoal mb-2">Favorites</h3>
                  <p className="text-warm-gray text-sm">
                    The places I return to again and again. Reliable, excellent, worth the trip.
                  </p>
                </div>
                <div className="process-panel">
                  <span className="numbered-label mb-4 block w-fit">2</span>
                  <h3 className="font-display text-xl text-charcoal mb-2">By Neighborhood</h3>
                  <p className="text-warm-gray text-sm">
                    H Street, Capitol Hill, Shaw, Adams Morgan, Georgetown, and beyond.
                  </p>
                </div>
                <div className="process-panel">
                  <span className="numbered-label mb-4 block w-fit">3</span>
                  <h3 className="font-display text-xl text-charcoal mb-2">By Occasion</h3>
                  <p className="text-warm-gray text-sm">
                    Date night, work dinner, casual lunch, late-night food.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Running */}
      <section className="py-16 bg-cream-dark">
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <p className="section-label mb-4">Running</p>
              <p className="text-warm-gray text-sm leading-relaxed">
                The routes, the trails, the tracks. DC is a great running city.
              </p>
            </div>
            <div className="md:col-span-8">
              <div className="space-y-6">
                <div className="flex items-baseline justify-between py-4 border-b border-sand">
                  <div>
                    <h3 className="font-display text-lg text-charcoal">Mall Loop</h3>
                    <p className="text-warm-gray text-sm">Capitol → Lincoln → Jefferson</p>
                  </div>
                  <span className="text-charcoal">4.5 mi</span>
                </div>
                <div className="flex items-baseline justify-between py-4 border-b border-sand">
                  <div>
                    <h3 className="font-display text-lg text-charcoal">Rock Creek Trail</h3>
                    <p className="text-warm-gray text-sm">Shaded, peaceful, endless</p>
                  </div>
                  <span className="text-charcoal">Variable</span>
                </div>
                <div className="flex items-baseline justify-between py-4 border-b border-sand">
                  <div>
                    <h3 className="font-display text-lg text-charcoal">Anacostia Trail</h3>
                    <p className="text-warm-gray text-sm">East side, river views</p>
                  </div>
                  <span className="text-charcoal">12+ mi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Things I Like */}
      <section className="py-16">
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <p className="section-label mb-4">Things I like</p>
              <p className="text-warm-gray text-sm leading-relaxed">
                Spots, places, experiences worth noting.
              </p>
            </div>
            <div className="md:col-span-8">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="card">
                  <h3 className="font-display text-lg text-charcoal mb-2">Coffee</h3>
                  <p className="text-warm-gray text-sm">The Wydown, Compass, A Baked Joint</p>
                </div>
                <div className="card">
                  <h3 className="font-display text-lg text-charcoal mb-2">Bookstores</h3>
                  <p className="text-warm-gray text-sm">Politics & Prose, Kramers, Capitol Hill Books</p>
                </div>
                <div className="card">
                  <h3 className="font-display text-lg text-charcoal mb-2">Museums</h3>
                  <p className="text-warm-gray text-sm">Hirshhorn, National Gallery, Phillips Collection</p>
                </div>
                <div className="card">
                  <h3 className="font-display text-lg text-charcoal mb-2">Parks</h3>
                  <p className="text-warm-gray text-sm">Kingman Island, Meridian Hill, Theodore Roosevelt</p>
                </div>
              </div>
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
