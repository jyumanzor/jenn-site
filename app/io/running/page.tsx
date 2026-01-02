"use client";

import Link from "next/link";

export default function RunningAdminPage() {
  return (
    <div className="bg-cream min-h-screen">
      <section className="pt-28 pb-12 md:pt-36 md:pb-16">
        <div className="container-editorial">
          <div className="max-w-2xl">
            <p className="light-bg-label mb-3">Admin</p>
            <h1 className="light-bg-header text-3xl md:text-4xl mb-4">Running Admin</h1>
            <p className="light-bg-body leading-relaxed mb-8">
              Manage race entries, training schedules, and mileage data.
              This syncs with the public /running page.
            </p>

            <div className="bg-ivory rounded-xl p-6 mb-6">
              <h3 className="light-bg-header text-lg mb-4">Quick Stats</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-deep-forest">3:09</p>
                  <p className="text-xs text-deep-forest/60">Marathon PR</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-deep-forest">980</p>
                  <p className="text-xs text-deep-forest/60">Miles (2024)</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-deep-forest">7</p>
                  <p className="text-xs text-deep-forest/60">Races</p>
                </div>
              </div>
            </div>

            <div className="bg-deep-forest/10 rounded-xl p-6">
              <h3 className="light-bg-header text-lg mb-2">Coming Soon</h3>
              <ul className="space-y-2 text-sm text-deep-forest/80">
                <li className="flex items-center gap-2">
                  <span className="text-sage">•</span>
                  Add/edit race entries
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-sage">•</span>
                  Training plan builder
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-sage">•</span>
                  Strava/Garmin sync
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-sage">•</span>
                  Weekly mileage tracking
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
