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

      {/* Entries - gradient flow from deep green to gold */}
      <section className="py-12">
        <div className="container-editorial">
          {journal.entries.map((entry, index) => {
            // Top-to-bottom gradient flow: deep greens → mid greens → golds
            const styles = [
              { bg: 'linear-gradient(135deg, #2a3c24 0%, #36482e 100%)', isDark: true },      // 1. Deepest forest
              { bg: 'linear-gradient(135deg, #36482e 0%, #4e6041 100%)', isDark: true },      // 2. Forest to olive
              { bg: 'linear-gradient(135deg, #4e6041 0%, #677955 100%)', isDark: true },      // 3. Olive to moss
              { bg: 'linear-gradient(135deg, #677955 0%, #8b9d72 100%)', isDark: true },      // 4. Moss to sage
              { bg: 'linear-gradient(135deg, #8b9d72 0%, #97a97c 100%)', isDark: false },     // 5. Sage blend
            ];
            const style = styles[index % styles.length];
            return (
              <article key={entry.id} className="mb-4">
                <div className="rounded-xl p-6" style={{ background: style.bg }}>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span
                      className="text-xs uppercase tracking-wider px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: style.isDark ? 'rgba(255,255,255,0.15)' : 'rgba(42,60,36,0.12)',
                        color: style.isDark ? '#fff5eb' : '#2a3c24'
                      }}
                    >
                      {entry.category}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: style.isDark ? 'rgba(255,245,235,0.5)' : 'rgba(42,60,36,0.5)' }}
                    >
                      {entry.date}
                    </span>
                  </div>
                  <h2
                    className="font-display text-xl mb-3"
                    style={{ color: style.isDark ? '#fff5eb' : '#2a3c24' }}
                  >
                    {entry.title}
                  </h2>
                  <p
                    className="text-sm leading-relaxed mb-4 reading-width"
                    style={{ color: style.isDark ? 'rgba(255,245,235,0.8)' : 'rgba(42,60,36,0.7)' }}
                  >
                    {entry.excerpt}
                  </p>
                  <Link
                    href={`/journal/${entry.id}`}
                    className="inline-flex items-center gap-1.5 text-sm transition-opacity hover:opacity-70"
                    style={{ color: style.isDark ? '#d4ed39' : '#546e40' }}
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
              // Continues the gradient: olive-yellows → golds → warm creams (8 quotes)
              const gradients = [
                { bg: 'linear-gradient(135deg, #9f9251 0%, #b29e56 100%)' },   // 1. Olive-gold
                { bg: 'linear-gradient(135deg, #b29e56 0%, #c5a95b 100%)' },   // 2. Bronze
                { bg: 'linear-gradient(135deg, #c5a95b 0%, #d9b45f 100%)' },   // 3. Antique gold
                { bg: 'linear-gradient(135deg, #d9b45f 0%, #ecc064 100%)' },   // 4. Gold
                { bg: 'linear-gradient(135deg, #ecc064 0%, #ffcb69 100%)' },   // 5. Bright gold
                { bg: 'linear-gradient(135deg, #ffcb69 0%, #ffd475 100%)' },   // 6. Light gold
                { bg: 'linear-gradient(135deg, #ffd475 0%, #ffdf9c 100%)' },   // 7. Pale gold
                { bg: 'linear-gradient(135deg, #ffdf9c 0%, #fff5eb 100%)' },   // 8. Cream
              ];
              const style = gradients[index % gradients.length];
              return (
                <div
                  key={index}
                  className="rounded-xl p-5"
                  style={{ background: style.bg }}
                >
                  <div className="flex gap-3">
                    <span
                      className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs"
                      style={{
                        backgroundColor: 'rgba(42,60,36,0.15)',
                        color: '#2a3c24'
                      }}
                    >
                      {index + 1}
                    </span>
                    <blockquote
                      className="text-sm leading-relaxed"
                      style={{ color: '#2a3c24' }}
                    >
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
