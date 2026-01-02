"use client";

import { useState } from "react";
import Link from "next/link";

const portfolioData = {
  projects: [
    {
      id: "personal-website",
      title: "Personal Website",
      slug: "personal-website",
      description: "My digital home - a curated space showcasing running, travel, dining, and professional work. Built with Next.js and Tailwind CSS with a warm, editorial aesthetic inspired by Graza olive oil.",
      shortDescription: "Digital mental palace with warm editorial design",
      category: "web",
      status: "live",
      visibility: "public" as const,
      featured: true,
      year: "2024",
      techStack: ["Next.js", "React", "Tailwind CSS", "TypeScript", "Vercel"],
      features: [
        "Interactive running schedule and race history",
        "Restaurant guide with ratings and recommendations",
        "Travel timeline with maps",
        "Oscar and Pulitzer tracking lists",
        "Journal with personal essays"
      ],
      images: [] as { src: string; alt: string; caption: string }[],
      highlights: [
        "Custom Graza-inspired color palette",
        "Responsive editorial layouts",
        "Interactive data visualizations"
      ],
      collaboration: "Built with Claude Code assistance"
    },
    {
      id: "fti-consulting-site",
      title: "FTI Consulting Project",
      slug: "fti-project",
      description: "A professional web project developed for FTI Consulting. Clean, authoritative design that communicates expertise and trust.",
      shortDescription: "Professional consulting web presence",
      category: "web",
      status: "live",
      visibility: "restricted" as const,
      featured: true,
      year: "2024",
      techStack: ["Next.js", "React", "Tailwind CSS"],
      features: [
        "Clean professional aesthetic",
        "Responsive design",
        "Optimized performance"
      ],
      images: [] as { src: string; alt: string; caption: string }[],
      highlights: [
        "Corporate design language",
        "Accessibility compliance",
        "Fast load times"
      ],
      collaboration: "Built with Claude Code assistance",
      accessNote: "Details restricted - please request access"
    },
    {
      id: "economic-dashboard",
      title: "Economic Analysis Dashboard",
      slug: "economic-dashboard",
      description: "Interactive dashboard for visualizing economic damages calculations and modeling scenarios. Used for internal litigation support.",
      shortDescription: "Internal damages visualization tool",
      category: "data",
      status: "internal",
      visibility: "restricted" as const,
      featured: false,
      year: "2024",
      techStack: ["Python", "Stata", "Excel VBA", "R"],
      features: [
        "Dynamic damages calculations",
        "Scenario modeling",
        "Visual reporting"
      ],
      images: [] as { src: string; alt: string; caption: string }[],
      highlights: [
        "Reduced analysis time by 40%",
        "Standardized reporting format"
      ],
      collaboration: null,
      accessNote: "Client confidential - details available upon request"
    }
  ],
  meta: {
    tagline: "Things I've built",
    description: "A collection of projects I'm proud of - from personal websites to professional tools. Built with curiosity and care."
  }
};

type Project = typeof portfolioData.projects[0];

function AccessBadge({ visibility }: { visibility: "public" | "restricted" }) {
  if (visibility === "public") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-sage/20 text-deep-forest rounded-full text-xs font-medium">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        Public
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gold/20 text-deep-forest rounded-full text-xs font-medium">
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
      </svg>
      Restricted
    </span>
  );
}

function ProjectCard({ project, onSelect }: { project: Project; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className="panel-gradient-deep text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-xl w-full group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-bl-full" />
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className="dark-bg-label">{project.year}</span>
          <AccessBadge visibility={project.visibility} />
        </div>
        <h3 className="dark-bg-header text-xl mb-2 group-hover:text-gold transition-colors">
          {project.title}
        </h3>
        <p className="dark-bg-body text-sm leading-relaxed mb-4 line-clamp-2">
          {project.shortDescription}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.techStack.slice(0, 4).map((tech) => (
            <span key={tech} className="text-[10px] px-2 py-0.5 bg-white/15 rounded-full text-cream/80">
              {tech}
            </span>
          ))}
          {project.techStack.length > 4 && (
            <span className="text-[10px] px-2 py-0.5 bg-white/15 rounded-full text-cream/80">
              +{project.techStack.length - 4}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

function ProjectDetail({ project, onClose }: { project: Project; onClose: () => void }) {
  const isRestricted = project.visibility === "restricted";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-deep-forest/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-cream rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-deep-forest/10 text-deep-forest flex items-center justify-center hover:bg-deep-forest/20 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="p-6 md:p-8">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="light-bg-label">{project.year}</span>
              <AccessBadge visibility={project.visibility} />
              {project.featured && (
                <span className="text-[10px] px-2 py-0.5 bg-gold rounded-full text-deep-forest font-medium">Featured</span>
              )}
            </div>
            <h2 className="light-bg-header text-3xl mb-2">{project.title}</h2>
            <p className="light-bg-body text-base leading-relaxed">{project.description}</p>
          </div>

          {isRestricted ? (
            <div className="bg-ivory rounded-xl p-8 text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-deep-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="light-bg-header text-xl mb-2">Restricted Access</h3>
              <p className="light-bg-body text-sm mb-4">
                {(project as typeof project & { accessNote?: string }).accessNote || "This project contains confidential information."}
              </p>
              <a href="mailto:j.umanzor@ymail.com?subject=Portfolio%20Access%20Request" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-deep-forest text-cream hover:bg-olive transition-colors">
                Request Access
              </a>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-ivory rounded-xl p-5">
                <h4 className="light-bg-label mb-3">Features</h4>
                <ul className="space-y-2">
                  {project.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm light-bg-body">
                      <span className="text-sage mt-1">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-ivory rounded-xl p-5">
                <h4 className="light-bg-label mb-3">Highlights</h4>
                <ul className="space-y-2">
                  {project.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm light-bg-body">
                      <span className="text-gold mt-1">★</span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="mb-6">
            <h4 className="light-bg-label mb-3">Tech Stack</h4>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span key={tech} className="px-3 py-1.5 bg-deep-forest/10 text-deep-forest rounded-lg text-sm font-medium">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {project.collaboration && (
            <div className="flex items-center gap-2 text-sm text-deep-forest/60 bg-sage/10 rounded-lg px-4 py-3">
              {project.collaboration}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PortfolioPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<"all" | "public" | "restricted">("all");

  const filteredProjects = portfolioData.projects.filter((project) => {
    if (filter === "all") return true;
    return project.visibility === filter;
  });

  const featuredProjects = filteredProjects.filter((p) => p.featured);
  const otherProjects = filteredProjects.filter((p) => !p.featured);

  return (
    <div className="bg-cream min-h-screen">
      <section className="pt-28 pb-12 md:pt-36 md:pb-16">
        <div className="container-editorial">
          <div className="max-w-2xl">
            <p className="light-bg-label mb-3">Portfolio</p>
            <h1 className="text-4xl md:text-5xl mb-4 tracking-tight" style={{ fontFamily: "var(--font-instrument), Instrument Serif, Georgia, serif", color: "#3B412D" }}>
              {portfolioData.meta.tagline}
            </h1>
            <p className="light-bg-body leading-relaxed reading-width">
              {portfolioData.meta.description}
            </p>
          </div>
        </div>
      </section>

      <hr className="rule" />

      <section className="py-6 bg-ivory">
        <div className="container-editorial">
          <div className="flex items-center gap-3">
            <span className="light-bg-label text-xs">Filter:</span>
            <div className="flex gap-2">
              {[{ key: "all", label: "All" }, { key: "public", label: "Public" }, { key: "restricted", label: "Restricted" }].map((option) => (
                <button
                  key={option.key}
                  onClick={() => setFilter(option.key as typeof filter)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === option.key ? "bg-deep-forest text-cream" : "bg-sand text-deep-forest hover:bg-sage/30"}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {featuredProjects.length > 0 && (
        <section className="py-12">
          <div className="container-editorial">
            <p className="light-bg-label mb-6">Featured</p>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} onSelect={() => setSelectedProject(project)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {otherProjects.length > 0 && (
        <section className="py-12 bg-ivory">
          <div className="container-editorial">
            <p className="light-bg-label mb-6">More Projects</p>
            <div className="grid md:grid-cols-3 gap-4">
              {otherProjects.map((project) => (
                <ProjectCard key={project.id} project={project} onSelect={() => setSelectedProject(project)} />
              ))}
            </div>
          </div>
        </section>
      )}

      <hr className="rule" />

      <section className="py-12 bg-cream">
        <div className="container-editorial">
          <Link href="/" className="link-editorial text-sm">&larr; Back to home</Link>
        </div>
      </section>

      {selectedProject && <ProjectDetail project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </div>
  );
}
