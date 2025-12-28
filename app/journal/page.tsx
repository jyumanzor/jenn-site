import Link from "next/link";
import journal from "@/data/journal.json";

export default function JournalPage() {
  return (
    <div className="bg-cream">
      {/* Hero */}
      <section className="pt-28 pb-12 md:pt-36 md:pb-16">
        <div className="container-editorial">
          <div className="max-w-2xl">
            <p className="section-label mb-3">Journal</p>
            <h1 className="font-display text-charcoal mb-4">
              Ideas and observations.
            </h1>
            <p className="text-warm-gray leading-relaxed reading-width">
              Essays, thoughts, and explorations.
            </p>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Entries */}
      <section className="py-12">
        <div className="container-editorial">
          {journal.entries.map((entry, index) => {
            // Cycle through: sage, olive (dark), warm-neutral
            const styles = [
              { bg: "panel-gradient-sage", isDark: false },
              { bg: "panel-gradient-olive", isDark: true },
              { bg: "panel-gradient-warm-neutral", isDark: false }
            ];
            const style = styles[index % 3];
            return (
              <article key={entry.id} className="mb-4">
                <div className={`rounded-xl p-6 ${style.bg}`}>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={`text-xs uppercase tracking-wider px-2 py-0.5 rounded ${style.isDark ? "bg-white/15 text-cream" : "bg-deep-forest/12 text-deep-forest"}`}>
                      {entry.category}
                    </span>
                    <span className={`text-xs ${style.isDark ? "text-cream/50" : "text-deep-forest/50"}`}>
                      {entry.date}
                    </span>
                  </div>
                  <h2 className={`font-display text-xl mb-3 ${style.isDark ? "text-cream" : "text-deep-forest"}`}>
                    {entry.title}
                  </h2>
                  <p className={`text-sm leading-relaxed mb-4 reading-width ${style.isDark ? "text-cream/70" : "text-deep-forest/70"}`}>
                    {entry.excerpt}
                  </p>
                  <Link
                    href={`/journal/${entry.id}`}
                    className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-full transition-all bg-deep-forest hover:bg-olive"
                    style={{ color: '#d4ed39' }}
                  >
                    Read more
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <hr className="rule" />

      {/* Quotes Section - continues gradient flow into golds/creams */}
      <section className="py-12 bg-cream relative overflow-hidden">
        <div className="container-editorial relative">
          <div className="grid md:grid-cols-12 gap-8 mb-8">
            <div className="md:col-span-4">
              <p className="section-label mb-3">On living</p>
              <p className="text-warm-gray text-sm leading-snug">
                Quotes from How I Met Your Mother.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            {journal.himymQuotes.map((quote, index) => {
              // Mixed pattern to avoid color blocking on left/right columns
              // For 2-col grid: 0=sage, 1=warm, 2=olive, 3=sage, 4=warm, 5=olive, 6=sage, 7=warm
              const styles = [
                { bg: "panel-gradient-sage", isDark: false },
                { bg: "panel-gradient-warm-neutral", isDark: false },
                { bg: "panel-gradient-olive", isDark: true },
                { bg: "panel-gradient-sage", isDark: false },
                { bg: "panel-gradient-warm-neutral", isDark: false },
                { bg: "panel-gradient-olive", isDark: true },
                { bg: "panel-gradient-sage", isDark: false },
                { bg: "panel-gradient-warm-neutral", isDark: false }
              ];
              const style = styles[index % styles.length];
              return (
                <div
                  key={index}
                  className={`rounded-xl p-5 ${style.bg}`}
                >
                  <div className="flex gap-3">
                    <span
                      className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs ${style.isDark ? "bg-white/20 text-cream" : "bg-deep-forest/15 text-deep-forest"}`}
                    >
                      {index + 1}
                    </span>
                    <blockquote className={`text-sm leading-relaxed ${style.isDark ? "text-cream" : "text-deep-forest"}`}>
                      &ldquo;{quote}&rdquo;
                    </blockquote>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Back Link */}
      <section className="py-10">
        <div className="container-editorial">
          <Link href="/" className="link-editorial text-sm">
            ← Back to home
          </Link>
        </div>
      </section>
    </div>
  );
}
