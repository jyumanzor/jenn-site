import Link from "next/link";

export default function BostonPage() {
  return (
    <div className="bg-cream">
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container-editorial">
          <div className="max-w-2xl">
            <p className="section-label mb-4">City Guide</p>
            <h1 className="font-display text-charcoal mb-6">
              Boston
            </h1>
            <p className="text-lg text-warm-gray leading-relaxed reading-width">
              Marathon 2026. The race every runner dreams about. Building this guide
              as I explore the city.
            </p>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* The Marathon */}
      <section className="py-16">
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <p className="section-label mb-4">Boston 2026</p>
              <p className="text-warm-gray text-sm leading-relaxed">
                Running Boston for the first time. Registered and ready.
              </p>
            </div>
            <div className="md:col-span-8">
              <div className="panel-gradient-olive">
                <div className="flex items-baseline justify-between mb-4">
                  <h3 className="font-display text-2xl text-ivory">Boston Marathon</h3>
                  <span className="px-2 py-0.5 bg-gold/80 text-deep-forest text-xs rounded-full">Registered</span>
                </div>
                <p className="text-cream/80 mb-4">April 20, 2026 · Hopkinton to Boston</p>
                <p className="text-cream/70 text-sm leading-relaxed">
                  26.2 miles from Hopkinton to Boylston Street. The race that started it all.
                  Heartbreak Hill. The crowds on Comm Ave. The finish on Boylston.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Places to Explore */}
      <section className="py-16 bg-cream-dark">
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <p className="section-label mb-4">Exploring</p>
              <p className="text-warm-gray text-sm leading-relaxed">
                Building this guide. Restaurants, runs, and spots to discover.
              </p>
            </div>
            <div className="md:col-span-8">
              <div className="space-y-6">
                <div className="flex items-baseline justify-between py-4 border-b border-sand">
                  <div>
                    <h3 className="font-display text-lg text-charcoal">Restaurants</h3>
                    <p className="text-warm-gray text-sm">Starting the list</p>
                  </div>
                  <span className="text-warm-gray text-sm">Coming soon</span>
                </div>
                <div className="flex items-baseline justify-between py-4 border-b border-sand">
                  <div>
                    <h3 className="font-display text-lg text-charcoal">Running Routes</h3>
                    <p className="text-warm-gray text-sm">Charles River, Esplanade</p>
                  </div>
                  <span className="text-warm-gray text-sm">Coming soon</span>
                </div>
                <div className="flex items-baseline justify-between py-4 border-b border-sand">
                  <div>
                    <h3 className="font-display text-lg text-charcoal">Things to Do</h3>
                    <p className="text-warm-gray text-sm">Museums, neighborhoods, spots</p>
                  </div>
                  <span className="text-warm-gray text-sm">Coming soon</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Notes */}
      <section className="py-16">
        <div className="container-editorial">
          <div className="max-w-2xl">
            <p className="section-label mb-4">Notes</p>
            <p className="text-warm-gray leading-relaxed">
              This guide is a work in progress. I&apos;ll be adding restaurants, routes, and
              recommendations as I explore Boston before and after the marathon.
            </p>
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
