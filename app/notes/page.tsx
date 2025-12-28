import Link from "next/link";

export default function NotesPage() {
  const notes = [
    {
      title: "On Perseverance",
      date: "2024-12-20",
      excerpt: "Just keep going. Don't quit, even when everything feels like it's falling apart.",
      tags: ["values", "running", "life"],
    },
    {
      title: "The Marathon Mindset",
      date: "2024-11-15",
      excerpt: "Running taught me that progress is both measurable and personal. You set a distance, a time—then test yourself against it.",
      tags: ["running", "mindset"],
    },
    {
      title: "On Trajectory",
      date: "2024-10-08",
      excerpt: "The path you're on matters less than the direction you're moving. Instability taught me to orient toward something—to build momentum even when the ground shifts.",
      tags: ["identity", "growth"],
    },
  ];

  const allTags = Array.from(new Set(notes.flatMap(n => n.tags)));

  return (
    <div className="bg-cream">
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container-editorial">
          <div className="max-w-2xl">
            <p className="section-label mb-4">Notes</p>
            <h1 className="font-display text-charcoal mb-6">
              Thoughts and ideas.
            </h1>
            <p className="text-lg text-warm-gray leading-relaxed reading-width">
              A collection of reflections, learnings, and things I want to remember.
            </p>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Tags */}
      <section className="py-6 bg-cream-dark">
        <div className="container-editorial">
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <span key={tag} className="tag">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Notes List */}
      <section className="py-16">
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <p className="section-label mb-4">Recent</p>
              <p className="text-warm-gray text-sm leading-relaxed">
                Short reflections and observations.
              </p>
            </div>
            <div className="md:col-span-8">
              <div className="space-y-0">
                {notes.map((note) => (
                  <div key={note.title} className="race-card">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="font-display text-xl text-charcoal">{note.title}</h3>
                      <span className="text-xs text-warm-gray flex-shrink-0">
                        {new Date(note.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                    <p className="text-warm-gray leading-relaxed mb-4 reading-width">{note.excerpt}</p>
                    <div className="flex flex-wrap gap-2">
                      {note.tags.map((tag) => (
                        <span key={tag} className="text-xs text-olive">#{tag}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Link to Journal */}
          <div className="mt-16 pt-8 border-t border-sand">
            <div className="grid md:grid-cols-12 gap-12">
              <div className="md:col-span-4">
                <p className="section-label mb-4">Longer form</p>
              </div>
              <div className="md:col-span-8">
                <Link href="/journal" className="block group">
                  <div className="process-panel group-hover:border-olive transition-colors">
                    <h3 className="font-display text-xl text-charcoal mb-2">Journal</h3>
                    <p className="text-warm-gray text-sm">
                      Essays and deeper explorations. Ideas that needed more space.
                    </p>
                  </div>
                </Link>
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
