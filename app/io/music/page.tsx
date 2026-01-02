"use client";

import Link from "next/link";

export default function MusicAdminPage() {
  return (
    <div className="bg-cream min-h-screen">
      <section className="pt-28 pb-12 md:pt-36 md:pb-16">
        <div className="container-editorial">
          <div className="max-w-2xl">
            <p className="light-bg-label mb-3">Admin</p>
            <h1 className="light-bg-header text-3xl md:text-4xl mb-4">Music Admin</h1>
            <p className="light-bg-body leading-relaxed mb-8">
              Manage playlists, listening history, and music discoveries.
              Curate what shows on the public /music page.
            </p>

            <div className="bg-deep-forest/10 rounded-xl p-6">
              <h3 className="light-bg-header text-lg mb-2">Planned Features</h3>
              <ul className="space-y-2 text-sm text-deep-forest/80">
                <li className="flex items-center gap-2">
                  <span className="text-sage">•</span>
                  Spotify playlist integration
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-sage">•</span>
                  Curate featured playlists
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-sage">•</span>
                  Running playlist builder
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-sage">•</span>
                  Recent discoveries feed
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
