import Link from "next/link";

export default function ChicagoPage() {
  return (
    <div className="bg-cream">
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container-editorial">
          <div className="max-w-2xl">
            <p className="section-label mb-4">City Guide</p>
            <h1 className="font-display text-charcoal mb-6">
              Chicago
            </h1>
            <p className="text-lg text-warm-gray leading-relaxed reading-width">
              Marathon 2026. UChicago roots. A city I know from my college years,
              returning for the marathon.
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
              <p className="section-label mb-4">Chicago 2026</p>
              <p className="text-warm-gray text-sm leading-relaxed">
                Running Chicago for the first time. A World Major in a city I know.
              </p>
            </div>
            <div className="md:col-span-8">
              <div className="process-panel-olive">
                <div className="flex items-baseline justify-between mb-4">
                  <h3 className="font-display text-2xl text-white">Chicago Marathon</h3>
                  <span className="badge bg-white text-olive">Registered</span>
                </div>
                <p className="text-white/80 mb-4">October 11, 2026 · Grant Park</p>
                <p className="text-white/70 text-sm leading-relaxed">
                  Flat, fast, and through 29 neighborhoods. One of the best marathon courses
                  in the world. Returning to the city where I went to college.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* UChicago */}
      <section className="py-16 bg-cream-dark">
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <p className="section-label mb-4">UChicago</p>
              <p className="text-warm-gray text-sm leading-relaxed">
                First-generation college graduate. Four years in Hyde Park.
              </p>
            </div>
            <div className="md:col-span-8">
              <div className="card">
                <h3 className="font-display text-xl text-charcoal mb-4">University of Chicago</h3>
                <p className="text-warm-gray leading-relaxed mb-4">
                  Economics and Public Policy. The place that shaped how I think about problems,
                  data, and rigorous analysis. First in my family to graduate from college.
                </p>
                <div className="flex gap-4">
                  <div>
                    <p className="font-display text-lg text-olive">2021</p>
                    <p className="text-warm-gray text-sm">Graduated</p>
                  </div>
                  <div>
                    <p className="font-display text-lg text-olive">Hyde Park</p>
                    <p className="text-warm-gray text-sm">Neighborhood</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Places to Explore */}
      <section className="py-16">
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <p className="section-label mb-4">Exploring</p>
              <p className="text-warm-gray text-sm leading-relaxed">
                Restaurants and spots from my college years and beyond.
              </p>
            </div>
            <div className="md:col-span-8">
              <div className="space-y-6">
                <div className="flex items-baseline justify-between py-4 border-b border-sand">
                  <div>
                    <h3 className="font-display text-lg text-charcoal">Restaurants</h3>
                    <p className="text-warm-gray text-sm">Hyde Park favorites and city-wide picks</p>
                  </div>
                  <span className="text-warm-gray text-sm">Coming soon</span>
                </div>
                <div className="flex items-baseline justify-between py-4 border-b border-sand">
                  <div>
                    <h3 className="font-display text-lg text-charcoal">Running Routes</h3>
                    <p className="text-warm-gray text-sm">Lakefront Trail, the Midway</p>
                  </div>
                  <span className="text-warm-gray text-sm">Coming soon</span>
                </div>
                <div className="flex items-baseline justify-between py-4 border-b border-sand">
                  <div>
                    <h3 className="font-display text-lg text-charcoal">Things to Do</h3>
                    <p className="text-warm-gray text-sm">Art Institute, neighborhoods, spots</p>
                  </div>
                  <span className="text-warm-gray text-sm">Coming soon</span>
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
