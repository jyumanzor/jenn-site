import Link from "next/link";
import Image from "next/image";

const dashboardSections = [
  {
    id: "journal",
    title: "Therapy Journal",
    description: "Track sessions, patterns, and insights",
    href: "/io/journal",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    color: "panel-gradient-sage"
  },
  {
    id: "work",
    title: "Work Journal",
    description: "Ideas, tasks, people profiles, emails",
    href: "/io/work",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    color: "panel-gradient-deep"
  },
  {
    id: "sandbox",
    title: "Jenn's Sandbox",
    description: "Prompt library and builder for Claude",
    href: "/io/sandbox",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    color: "panel-gradient-olive"
  },
  {
    id: "running",
    title: "Running Admin",
    description: "Manage races, training schedules",
    href: "/io/running",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    color: "panel-gradient-forest"
  },
  {
    id: "music",
    title: "Music Admin",
    description: "Playlists and listening data",
    href: "/io/music",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
    color: "panel-gradient-deep"
  },
  {
    id: "health",
    title: "Health Dashboard",
    description: "Apple Watch, Oura, nutrition data",
    href: "/io/health",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    color: "panel-gradient-sage"
  },
  {
    id: "nutrition",
    title: "Nutrition Log",
    description: "Food logging, macros, runner fuel guide",
    href: "/io/nutrition",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    color: "panel-gradient-honey"
  },
  {
    id: "agents",
    title: "Agent Command",
    description: "Track agents, probabilities, redundancy",
    href: "/io/agents",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    color: "panel-gradient-forest",
    isNew: true
  }
];

export default function IODashboardPage() {
  return (
    <div className="bg-cream min-h-screen">
      {/* Header */}
      <section className="pt-8 pb-12 md:pt-16 md:pb-16">
        <div className="container-editorial">
          <div className="flex items-start gap-6">
            <Image
              src="/images/brand/jenn-logo.svg"
              alt="Jenn Logo"
              width={80}
              height={80}
              className="rounded-2xl shadow-md hidden md:block"
            />
            <div className="max-w-2xl">
              <p className="light-bg-label mb-3">Backend</p>
              <h1
                className="text-4xl md:text-5xl mb-4 tracking-tight"
                style={{ fontFamily: "var(--font-instrument), Instrument Serif, Georgia, serif", color: "#3B412D" }}
              >
                Control Center
              </h1>
              <p className="light-bg-body leading-relaxed">
                Private dashboard for managing site content, tracking personal data, and building tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Dashboard Grid */}
      <section className="py-12">
        <div className="container-editorial">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardSections.map((section) => (
              <Link
                key={section.id}
                href={section.href}
                className={`${section.color} transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group relative overflow-hidden`}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-bl-full" />
                {'isNew' in section && section.isNew && (
                  <span
                    className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-bold z-20"
                    style={{ background: '#D4ED39', color: '#2A3C24' }}
                  >
                    NEW
                  </span>
                )}
                <div className="relative z-10">
                  <div className="mb-4 text-cream/80 group-hover:text-gold transition-colors">
                    {section.icon}
                  </div>
                  <h3 className="dark-bg-header text-xl mb-2 group-hover:text-gold transition-colors">
                    {section.title}
                  </h3>
                  <p className="dark-bg-body text-sm">
                    {section.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-cream/60 group-hover:text-cream text-sm">
                    <span>Open</span>
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Back Link */}
      <section className="py-12 bg-cream">
        <div className="container-editorial">
          <Link href="/" className="link-editorial text-sm">
            &larr; Back to home
          </Link>
        </div>
      </section>
    </div>
  );
}
