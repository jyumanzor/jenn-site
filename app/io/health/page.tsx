"use client";

import Link from "next/link";

export default function HealthDashboardPage() {
  return (
    <div className="bg-cream min-h-screen">
      <section className="pt-28 pb-12 md:pt-36 md:pb-16">
        <div className="container-editorial">
          <div className="max-w-2xl">
            <p className="light-bg-label mb-3">Coming Soon</p>
            <h1 className="light-bg-header text-3xl md:text-4xl mb-4">Health Dashboard</h1>
            <p className="light-bg-body leading-relaxed mb-8">
              Unified view of health data from Apple Watch, Oura Ring, and nutrition tracking.
              Upload data, visualize trends, and get AI-powered insights.
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-ivory rounded-xl p-5 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-sage/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-deep-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="light-bg-header text-lg mb-1">Apple Watch</h3>
                <p className="text-sm text-deep-forest/60">Activity, heart rate, workouts</p>
              </div>
              <div className="bg-ivory rounded-xl p-5 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-sage/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-deep-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                </div>
                <h3 className="light-bg-header text-lg mb-1">Oura Ring</h3>
                <p className="text-sm text-deep-forest/60">Sleep, readiness, HRV</p>
              </div>
              <div className="bg-ivory rounded-xl p-5 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-sage/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-deep-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="light-bg-header text-lg mb-1">Nutrition</h3>
                <p className="text-sm text-deep-forest/60">Calories, macros, meals</p>
              </div>
            </div>

            <div className="bg-deep-forest/10 rounded-xl p-6">
              <h3 className="light-bg-header text-lg mb-2">Planned Features</h3>
              <ul className="space-y-2 text-sm text-deep-forest/80">
                <li className="flex items-center gap-2">
                  <span className="text-sage">•</span>
                  Upload CSV exports from health apps
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-sage">•</span>
                  Daily/weekly/monthly trend visualizations
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-sage">•</span>
                  AI-powered correlation insights
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-sage">•</span>
                  Recovery recommendations based on training load
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      <section className="py-12 bg-cream">
        <div className="container-editorial">
          <Link href="/io" className="link-editorial text-sm">&larr; Back to dashboard</Link>
        </div>
      </section>
    </div>
  );
}
