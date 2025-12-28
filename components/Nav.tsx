"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/", label: "Home", description: "Start here" },
  { href: "/running", label: "Running", description: "Races & training" },
  { href: "/dining", label: "Dining", description: "Restaurant guides" },
  { href: "/travel", label: "Travel", description: "Places & memories" },
  { href: "/watching", label: "Culture", description: "Films, books & music" },
  { href: "/tattoos", label: "Tattoos", description: "Stories on skin" },
  { href: "/journal", label: "Journal", description: "Essays & notes" },
  { href: "/work", label: "Work", description: "Professional" },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  return (
    <>
      {/* Top Nav Bar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-cream/95 backdrop-blur-md py-4 shadow-sm"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container-editorial">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="group relative">
              <span
                className="font-display text-3xl tracking-tight text-charcoal transition-colors group-hover:text-terracotta"
                style={{ fontStyle: "italic" }}
              >
                Jenn
              </span>
              <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-terracotta transition-all duration-300 group-hover:w-full" />
            </Link>

            {/* Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="relative flex items-center gap-2 px-4 py-2 rounded-full text-cream transition-colors"
              style={{ backgroundColor: '#546E40' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3B412D'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#546E40'}
              aria-label="Toggle menu"
            >
              <span className="text-sm font-medium">Menu</span>
              <div className="relative w-5 h-4 flex flex-col justify-center gap-1">
                <span
                  className={`h-[2px] w-5 bg-cream transition-all duration-300 ${
                    sidebarOpen ? "rotate-45 translate-y-[3px]" : ""
                  }`}
                />
                <span
                  className={`h-[2px] bg-cream transition-all duration-300 ${
                    sidebarOpen ? "-rotate-45 -translate-y-[3px] w-5" : "w-3"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-charcoal/50 backdrop-blur-sm transition-opacity duration-300 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-80 shadow-2xl transform transition-transform duration-300 ease-out ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ backgroundColor: '#546E40' }}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-cream/10">
          <span
            className="text-2xl text-cream"
            style={{ fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif' }}
          >
            Navigate
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center text-cream hover:bg-cream/20 transition-colors"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav Links */}
        <div className="p-6 space-y-2">
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block p-4 rounded-xl transition-all duration-200 ${
                pathname === link.href
                  ? "bg-gold text-deep-forest"
                  : "bg-cream/10 text-cream"
              }`}
              style={{
                transitionDelay: sidebarOpen ? `${index * 50}ms` : "0ms",
              }}
              onMouseEnter={(e) => {
                if (pathname !== link.href) {
                  e.currentTarget.style.backgroundColor = '#FFCB69';
                  e.currentTarget.style.color = '#3B412D';
                }
              }}
              onMouseLeave={(e) => {
                if (pathname !== link.href) {
                  e.currentTarget.style.backgroundColor = 'rgba(250, 243, 232, 0.1)';
                  e.currentTarget.style.color = '#FAF3E8';
                }
              }}
            >
              <span
                className="block text-lg font-medium"
                style={{ fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif' }}
              >
                {link.label}
              </span>
              <span className={`text-xs mt-0.5 block ${
                pathname === link.href ? "text-deep-forest/70" : "text-cream/70"
              }`}>
                {link.description}
              </span>
            </Link>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-cream/10">
          <div className="flex items-center gap-4 mb-4">
            <a
              href="https://www.linkedin.com/in/jennifer-umanzor-1072a7176/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center text-cream/70 hover:bg-cream/20 hover:text-cream transition-all"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a
              href="https://www.strava.com/athletes/181780869"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center text-cream/70 hover:bg-cream/20 hover:text-cream transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/jennumanzor/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center text-cream/70 hover:bg-cream/20 hover:text-cream transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>
          <p className="text-cream/40 text-xs">
            Washington, DC
          </p>
        </div>
      </div>
    </>
  );
}
