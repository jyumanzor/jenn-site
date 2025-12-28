import Link from "next/link";
import { notFound } from "next/navigation";
import journal from "@/data/journal.json";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function JournalEntryPage({ params }: Props) {
  const { id } = await params;
  const entry = journal.entries.find((e) => e.id === id);

  if (!entry) {
    notFound();
  }

  // Split content by ## headers for section rendering
  const sections = entry.content.split(/\n\n(?=## )/);

  return (
    <div className="bg-cream">
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container-editorial">
          <div className="max-w-3xl">
            <Link href="/journal" className="link-editorial text-sm mb-8 inline-block">
              ← Back to journal
            </Link>
            <p className="section-label mb-4">{entry.category}</p>
            <h1 className="font-display text-3xl md:text-4xl text-charcoal mb-6 leading-tight">
              {entry.title}
            </h1>
            <p className="text-warm-gray">{entry.date}</p>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Content */}
      <section className="py-16">
        <div className="container-editorial">
          <div className="max-w-3xl">
            <article className="prose-editorial">
              {sections.map((section, index) => {
                // Check if this section starts with a header
                const headerMatch = section.match(/^## (.+)\n\n/);
                if (headerMatch) {
                  const header = headerMatch[1];
                  const content = section.replace(/^## .+\n\n/, "");
                  return (
                    <div key={index} className="mb-10">
                      <h2 className="font-display text-xl text-charcoal mb-4">{header}</h2>
                      {content.split("\n\n").map((para, pIndex) => (
                        <p key={pIndex} className="text-charcoal leading-relaxed mb-4 reading-width">
                          {para}
                        </p>
                      ))}
                    </div>
                  );
                }
                // Regular paragraph
                return section.split("\n\n").map((para, pIndex) => (
                  <p key={`${index}-${pIndex}`} className="text-charcoal leading-relaxed mb-4 reading-width">
                    {para}
                  </p>
                ));
              })}
            </article>

            {/* References */}
            {entry.references && entry.references.length > 0 && (
              <div className="mt-16 pt-8 border-t border-sand">
                <p className="section-label mb-4">References</p>
                <ul className="text-warm-gray text-sm space-y-1">
                  {entry.references.map((ref, index) => (
                    <li key={index}>{ref}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Back Link */}
      <section className="py-12">
        <div className="container-editorial">
          <Link href="/journal" className="link-editorial text-sm">
            ← Back to journal
          </Link>
        </div>
      </section>
    </div>
  );
}
