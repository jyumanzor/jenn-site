"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// Scroll reveal hook for editorial animations
function useScrollReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '50px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isRevealed };
}

// Animated counter for stats
function AnimatedStat({ value, suffix = "", delay = 0 }: { value: string; suffix?: string; delay?: number }) {
  const [displayValue, setDisplayValue] = useState("0");
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          // Parse numeric value
          const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
          const isTime = value.includes(':');

          setTimeout(() => {
            if (isTime) {
              // For time format like 3:09
              setDisplayValue(value);
            } else {
              let start = 0;
              const duration = 1500;
              const startTime = performance.now();

              const animate = (currentTime: number) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
                const current = Math.floor(eased * numericValue);
                setDisplayValue(current.toString());

                if (progress < 1) {
                  requestAnimationFrame(animate);
                } else {
                  setDisplayValue(value);
                }
              };

              requestAnimationFrame(animate);
            }
          }, delay);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value, delay, hasAnimated]);

  return <span ref={ref}>{displayValue}{suffix}</span>;
}

export default function Home() {
  const heroReveal = useScrollReveal();
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    // Trigger hero animation after mount
    const timer = setTimeout(() => setHeroLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-cream">
      {/* Editorial Hero - Magazine Quality */}
      <section className="pt-16 pb-12 md:pt-24 md:pb-16 relative overflow-hidden">
        {/* Subtle gradient orb for depth */}
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] opacity-30 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(212,237,57,0.15) 0%, transparent 60%)',
            transform: 'translate(30%, -30%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] opacity-20 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(151,169,124,0.2) 0%, transparent 60%)',
            transform: 'translate(-30%, 30%)',
          }}
        />

        <div className="container-editorial relative z-10">
          <div className="max-w-4xl">
            {/* Editorial issue number - magazine detail */}
            <div
              className="flex items-center gap-3 mb-8 transition-all duration-700"
              style={{
                opacity: heroLoaded ? 1 : 0,
                transform: heroLoaded ? 'translateY(0)' : 'translateY(20px)',
              }}
            >
              <span className="text-xs uppercase tracking-[0.2em] font-medium" style={{ color: '#97A97C' }}>
                Personal Site
              </span>
              <div className="w-12 h-px" style={{ backgroundColor: '#97A97C' }} />
              <span className="text-xs" style={{ color: 'rgba(59,65,45,0.5)' }}>
                Est. 2025
              </span>
            </div>

            <h1
              className="light-bg-header text-5xl md:text-7xl lg:text-8xl mb-8 tracking-tight leading-[0.95] transition-all duration-1000"
              style={{
                opacity: heroLoaded ? 1 : 0,
                transform: heroLoaded ? 'translateY(0)' : 'translateY(30px)',
                transitionDelay: '150ms',
              }}
            >
              Hi, I&apos;m{' '}
              <span className="relative inline-block">
                Jenn
                <span
                  className="absolute -bottom-2 left-0 w-full h-1 rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #D4ED39, #FABF34)',
                    transform: heroLoaded ? 'scaleX(1)' : 'scaleX(0)',
                    transformOrigin: 'left',
                    transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                    transitionDelay: '800ms',
                  }}
                />
              </span>
              <span style={{ color: '#D4ED39' }}>.</span>
            </h1>

            <p
              className="text-base md:text-lg leading-relaxed font-light max-w-2xl transition-all duration-1000"
              style={{
                color: 'rgba(59,65,45,0.8)',
                opacity: heroLoaded ? 1 : 0,
                transform: heroLoaded ? 'translateY(0)' : 'translateY(20px)',
                transitionDelay: '300ms',
              }}
            >
              Economic consultant at FTI. Marathon runner pursuing sub-3:00.
              Based in Washington, DC.
            </p>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* What I do - Editorial Card Grid */}
      <section className="py-20">
        <div className="container-editorial">
          {/* Section header with editorial flourish */}
          <div className="flex items-center gap-4 mb-12">
            <p className="light-bg-label">What I do</p>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(151,169,124,0.4), transparent)' }} />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Build - Dark panel with enhanced hover */}
            <Link href="/work" className="group h-full block">
              <div
                className="panel-gradient-olive h-full relative overflow-hidden transition-all duration-500 ease-out group-hover:shadow-2xl"
                style={{
                  transform: 'translateY(0)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 25px 50px rgba(42,60,36,0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                {/* Animated gradient overlay on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'radial-gradient(circle at 80% 20%, rgba(212,237,57,0.15) 0%, transparent 50%)',
                  }}
                />
                <div className="relative z-10">
                  <span
                    className="text-2xl font-light mb-4 block transition-all duration-300 group-hover:translate-x-1"
                    style={{ fontFamily: 'var(--font-instrument)', color: '#FABF34' }}
                  >
                    01
                  </span>
                  <h3 className="dark-bg-header text-2xl mb-3 transition-all duration-300 group-hover:translate-x-1">Build</h3>
                  <p className="dark-bg-body text-sm leading-relaxed transition-all duration-300 group-hover:translate-x-1">
                    Economic damages models for commercial litigation at FTI Consulting.
                  </p>
                  {/* Arrow indicator */}
                  <div className="mt-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-2">
                    <span className="text-xs" style={{ color: '#D4ED39' }}>Explore</span>
                    <svg className="w-4 h-4" style={{ color: '#D4ED39' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>

            {/* Run - Sage panel */}
            <Link href="/running" className="group h-full block">
              <div
                className="panel-gradient-sage h-full relative overflow-hidden transition-all duration-500 ease-out"
                style={{
                  transform: 'translateY(0)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 25px 50px rgba(42,60,36,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'radial-gradient(circle at 80% 20%, rgba(250,191,52,0.15) 0%, transparent 50%)',
                  }}
                />
                <div className="relative z-10">
                  <span
                    className="text-2xl font-light mb-4 block transition-all duration-300 group-hover:translate-x-1"
                    style={{ fontFamily: 'var(--font-instrument)', color: '#FABF34' }}
                  >
                    02
                  </span>
                  <h3 className="dark-bg-header text-2xl mb-3 transition-all duration-300 group-hover:translate-x-1">Run</h3>
                  <p className="dark-bg-body text-sm leading-relaxed transition-all duration-300 group-hover:translate-x-1">
                    Marathon training. Boston and Chicago 2026. Sub-3:00 goal.
                  </p>
                  <div className="mt-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-2">
                    <span className="text-xs" style={{ color: '#D4ED39' }}>Race history</span>
                    <svg className="w-4 h-4" style={{ color: '#D4ED39' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>

            {/* Explore - Lime accent panel */}
            <Link href="/culture" className="group h-full block">
              <div
                className="rounded-xl p-6 relative overflow-hidden h-full transition-all duration-500 ease-out"
                style={{
                  background: 'linear-gradient(135deg, #d4ed39 0%, #b5c4a0 100%)',
                  transform: 'translateY(0)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 25px 50px rgba(212,237,57,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'radial-gradient(circle at 80% 20%, rgba(250,191,52,0.2) 0%, transparent 50%)',
                  }}
                />
                <div className="relative z-10">
                  <span
                    className="text-2xl font-light mb-4 block transition-all duration-300 group-hover:translate-x-1"
                    style={{ fontFamily: 'var(--font-instrument)', color: '#2a3c24' }}
                  >
                    03
                  </span>
                  <h3
                    className="text-2xl mb-3 transition-all duration-300 group-hover:translate-x-1"
                    style={{ fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif', color: '#2a3c24' }}
                  >
                    Explore
                  </h3>
                  <p className="text-sm leading-relaxed transition-all duration-300 group-hover:translate-x-1" style={{ color: 'rgba(42,60,36,0.8)' }}>
                    Films, books, music. City guides and restaurant recommendations.
                  </p>
                  <div className="mt-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-2">
                    <span className="text-xs" style={{ color: '#2a3c24' }}>Discover</span>
                    <svg className="w-4 h-4" style={{ color: '#2a3c24' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* About */}
      <section className="py-14">
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-4">
              <p className="light-bg-label mb-3">About</p>
            </div>
            <div className="md:col-span-8">
              <p className="light-bg-header text-xl mb-3 leading-relaxed">
                Economic consultant focused on damages analysis in commercial litigation.
              </p>
              <p className="light-bg-body text-sm leading-relaxed">
                Boston and Chicago marathons in 2026. Sub-3:00 goal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Running Stats */}
      <section className="py-14 bg-cream">
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-4">
              <p className="light-bg-label mb-3">Running</p>
              <p className="light-bg-body text-sm leading-snug mb-4">
                Seven World Majors. Boston and Chicago in 2026.
              </p>
              <Link
                href="/running"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 group"
                style={{
                  background: 'linear-gradient(135deg, #2a3c24 0%, #4e6041 100%)',
                  color: '#d4ed39',
                  boxShadow: '0 2px 8px rgba(42,60,36,0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #d4ed39 0%, #b29e56 100%)';
                  e.currentTarget.style.color = '#2a3c24';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(212,237,57,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #2a3c24 0%, #4e6041 100%)';
                  e.currentTarget.style.color = '#d4ed39';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(42,60,36,0.3)';
                }}
              >
                <span>Race history</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="md:col-span-8">
              <div className="grid grid-cols-3 gap-3">
                <div className="panel-gradient-deep p-4 text-center flex flex-col justify-center">
                  <p className="text-3xl text-gold" style={{ fontFamily: 'var(--font-instrument), Georgia, serif' }}>3:09</p>
                  <p className="dark-bg-label mt-1">PR</p>
                </div>
                <div className="panel-gradient-sage p-4 text-center flex flex-col justify-center">
                  <p className="light-bg-header text-3xl">6</p>
                  <p className="light-bg-label mt-1">Marathons</p>
                </div>
                <div className="rounded-xl p-4 text-center flex flex-col justify-center" style={{ background: 'linear-gradient(135deg, #d4ed39 0%, #c5d654 100%)' }}>
                  <p className="text-3xl" style={{ fontFamily: 'var(--font-instrument), Georgia, serif', color: '#2a3c24' }}>0/7</p>
                  <p className="text-xs uppercase tracking-wider mt-1" style={{ color: '#3B412D' }}>Majors</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* City Guides */}
      <section className="py-14">
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-8 mb-8">
            <div className="md:col-span-4">
              <p className="light-bg-label mb-3">City guides</p>
              <p className="light-bg-body text-sm leading-snug">
                Restaurants, spots, and notes.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/cities/dc" className="group">
              <div className="panel-gradient-deep group-hover:scale-[1.01] transition-transform">
                <span className="dark-bg-label">Home</span>
                <h3 className="dark-bg-header text-xl mt-1 mb-1">Washington, DC</h3>
                <p className="dark-bg-body text-sm">Six years of discovering corners and routines</p>
              </div>
            </Link>

            <Link href="/cities/chicago" className="group">
              <div className="panel-gradient-olive group-hover:scale-[1.01] transition-transform">
                <span className="dark-bg-label">Roots</span>
                <h3 className="dark-bg-header text-xl mt-1 mb-1">Chicago</h3>
                <p className="dark-bg-body text-sm">UChicago years and marathon 2026</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Travel */}
      <section className="py-14 bg-cream">
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-8 mb-8">
            <div className="md:col-span-4">
              <p className="light-bg-label mb-3">Travel</p>
              <p className="light-bg-body text-sm leading-snug mb-4">
                11 countries visited.
              </p>
              <Link
                href="/travel"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 group"
                style={{
                  background: 'linear-gradient(135deg, #2a3c24 0%, #4e6041 100%)',
                  color: '#d4ed39',
                  boxShadow: '0 2px 8px rgba(42,60,36,0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #d4ed39 0%, #b29e56 100%)';
                  e.currentTarget.style.color = '#2a3c24';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(212,237,57,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #2a3c24 0%, #4e6041 100%)';
                  e.currentTarget.style.color = '#d4ed39';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(42,60,36,0.3)';
                }}
              >
                <span>View all</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="md:col-span-8">
              <div className="grid grid-cols-3 gap-3">
                <div className="panel-gradient-deep">
                  <span className="dark-bg-label">Asia</span>
                  <h3 className="dark-bg-header text-lg mt-1">Japan</h3>
                  <p className="dark-bg-body text-xs mt-1">Tokyo, Kyoto</p>
                </div>
                <div className="panel-gradient-olive">
                  <span className="dark-bg-label">Europe</span>
                  <h3 className="dark-bg-header text-lg mt-1">France</h3>
                  <p className="dark-bg-body text-xs mt-1">Paris</p>
                </div>
                <div className="panel-gradient-forest">
                  <span className="dark-bg-label">Asia</span>
                  <h3 className="dark-bg-header text-lg mt-1">Vietnam</h3>
                  <p className="dark-bg-body text-xs mt-1">Hanoi, HCMC</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Explore - Editorial Grid with Staggered Animations */}
      <ExploreSection />
    </div>
  );
}

// Explore section with scroll-triggered staggered animations
function ExploreSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const exploreItems = [
    { href: "/running", label: "Training", title: "Running", panel: "panel-gradient-deep", isDark: true },
    { href: "/dining", label: "149 spots", title: "Dining", panel: "panel-gradient-olive", isDark: true },
    { href: "/culture", label: "Lists", title: "Culture", panel: "panel-gradient-forest", isDark: true },
    { href: "/travel", label: "11 countries", title: "Travel", panel: "panel-gradient-sage", isDark: false },
    { href: "/work", label: "FTI", title: "Work", panel: "panel-gradient-sage", isDark: false },
    { href: "/tattoos", label: "15", title: "Tattoos", panel: "panel-gradient-deep", isDark: true },
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-ivory">
      <div className="container-editorial">
        {/* Section header with editorial flourish */}
        <div className="flex items-center gap-4 mb-12">
          <p className="light-bg-label">Explore</p>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(151,169,124,0.4), transparent)' }} />
          <span className="text-xs" style={{ color: 'rgba(59,65,45,0.4)' }}>8 sections</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {exploreItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className="group block"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 80}ms`,
              }}
            >
              <div
                className={`${item.panel} h-full relative overflow-hidden transition-all duration-500 ease-out`}
                style={{ minHeight: '120px' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(42,60,36,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                {/* Hover glow effect */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: item.isDark
                      ? 'radial-gradient(circle at 80% 20%, rgba(212,237,57,0.2) 0%, transparent 60%)'
                      : 'radial-gradient(circle at 80% 20%, rgba(250,191,52,0.15) 0%, transparent 60%)',
                  }}
                />
                <div className="relative z-10">
                  <span className={`${item.isDark ? 'dark-bg-label' : 'light-bg-label'} transition-all duration-300 group-hover:translate-x-1 inline-block`}>
                    {item.label}
                  </span>
                  <h3 className={`${item.isDark ? 'dark-bg-header' : 'light-bg-header'} text-xl mt-2 transition-all duration-300 group-hover:translate-x-1`}>
                    {item.title}
                  </h3>
                  {/* Arrow on hover */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <svg
                      className="w-5 h-5"
                      style={{ color: item.isDark ? '#D4ED39' : '#2A3C24' }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {/* Journal - spans 2 columns */}
          <Link
            href="/journal"
            className="group col-span-2 block"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 560ms',
            }}
          >
            <div
              className="panel-gradient-olive h-full relative overflow-hidden transition-all duration-500 ease-out"
              style={{ minHeight: '120px' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px) scale(1.01)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(42,60,36,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'radial-gradient(circle at 90% 30%, rgba(212,237,57,0.2) 0%, transparent 60%)',
                }}
              />
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <span className="dark-bg-label transition-all duration-300 group-hover:translate-x-1 inline-block">Writing</span>
                  <h3 className="dark-bg-header text-xl mt-2 transition-all duration-300 group-hover:translate-x-1">Journal</h3>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <svg
                    className="w-6 h-6"
                    style={{ color: '#D4ED39' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
