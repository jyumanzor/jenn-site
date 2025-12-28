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
  {
    href: "#",
    label: "City Guides",
    description: "DC & Chicago",
    sublinks: [
      { href: "/cities/dc", label: "Washington, DC" },
      { href: "/cities/chicago", label: "Chicago" }
    ]
  },
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
              style={{ backgroundColor: '#36482e' }}
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
        className={`fixed top-0 right-0 z-50 h-full w-80 shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ backgroundColor: '#36482e' }}
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

        {/* Nav Links - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-2">
          {navLinks.map((link, index) => (
            <div key={link.href + link.label}>
              {link.sublinks ? (
                <div
                  className="p-4 rounded-xl bg-cream/10 text-cream"
                  style={{
                    transitionDelay: sidebarOpen ? `${index * 50}ms` : "0ms",
                  }}
                >
                  <span
                    className="block text-lg font-medium"
                    style={{ fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif' }}
                  >
                    {link.label}
                  </span>
                  <span className="text-xs mt-0.5 block text-cream/70">
                    {link.description}
                  </span>
                  <div className="mt-3 pl-3 border-l border-cream/20 space-y-2">
                    {link.sublinks.map((sublink) => (
                      <Link
                        key={sublink.href}
                        href={sublink.href}
                        className={`block text-sm py-1 transition-colors ${
                          pathname === sublink.href
                            ? "text-gold"
                            : "text-cream/80 hover:text-gold"
                        }`}
                        style={{ fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif' }}
                      >
                        {sublink.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
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
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
