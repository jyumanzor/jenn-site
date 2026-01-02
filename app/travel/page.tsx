"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import travel from "@/data/travel.json";
import TravelTimeline from "@/components/TravelTimeline";

// Scroll reveal hook
function useScrollReveal() {
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
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isRevealed };
}

// Animated counter hook
function useAnimatedCounter(end: number, duration: number = 1500, start: boolean = true) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [end, duration, start]);

  return count;
}

// Image Modal Component
function ImageModal({
  images,
  currentIndex,
  city,
  onClose,
  onNext,
  onPrev
}: {
  images: string[];
  currentIndex: number;
  city: string;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose, onNext, onPrev]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(42, 60, 36, 0.95)' }}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
        style={{ backgroundColor: 'rgba(255, 245, 235, 0.1)' }}
      >
        <svg className="w-6 h-6" style={{ color: '#FFF5EB' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ backgroundColor: 'rgba(255, 245, 235, 0.1)' }}
          >
            <svg className="w-6 h-6" style={{ color: '#FFF5EB' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ backgroundColor: 'rgba(255, 245, 235, 0.1)' }}
          >
            <svg className="w-6 h-6" style={{ color: '#FFF5EB' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Main image */}
      <div
        className="relative w-full h-full max-w-5xl max-h-[85vh] mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={`/images/travel/${images[currentIndex]}`}
          alt={`${city} photo ${currentIndex + 1}`}
          fill
          className="object-contain"
          sizes="(max-width: 1280px) 100vw, 1280px"
          priority
        />
      </div>

      {/* Counter */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-sm font-medium"
        style={{ backgroundColor: 'rgba(255, 245, 235, 0.1)', color: '#FFF5EB' }}
      >
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}

// Photo Carousel Component with horizontal scroll and modal
function PhotoCarousel({ images, city }: { images: string[]; city: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const goToNext = useCallback(() => {
    if (isTransitioning || images.length <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [isTransitioning, images.length]);

  const goToPrev = useCallback(() => {
    if (isTransitioning || images.length <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [isTransitioning, images.length]);

  const goToIndex = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const openModal = (index: number) => {
    setModalIndex(index);
    setModalOpen(true);
  };

  const modalNext = useCallback(() => {
    setModalIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const modalPrev = useCallback(() => {
    setModalIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  if (!images || images.length === 0) {
    return (
      <div className="rounded-lg p-12 text-center" style={{ backgroundColor: 'rgba(255, 245, 235, 0.1)' }}>
        <p style={{ color: '#FFF5EB' }}>Photos coming soon</p>
      </div>
    );
  }

  return (
    <>
      {modalOpen && (
        <ImageModal
          images={images}
          currentIndex={modalIndex}
          city={city}
          onClose={() => setModalOpen(false)}
          onNext={modalNext}
          onPrev={modalPrev}
        />
      )}

      <div className="space-y-4">
        {/* Main Image with Navigation */}
        <div
          className="relative aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer"
          onClick={() => openModal(currentIndex)}
        >
          <Image
            src={`/images/travel/${images[currentIndex]}`}
            alt={`${city} photo ${currentIndex + 1}`}
            fill
            className="object-cover transition-all duration-300 group-hover:scale-105"
            style={{ opacity: isTransitioning ? 0.7 : 1 }}
          />

          {/* Hover overlay with expand icon */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(42, 60, 36, 0.3)' }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(255, 245, 235, 0.9)' }}
            >
              <svg className="w-6 h-6" style={{ color: '#2A3C24' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                style={{ backgroundColor: 'rgba(42,60,36,0.8)' }}
              >
                <svg className="w-5 h-5" style={{ color: '#FFF5EB' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                style={{ backgroundColor: 'rgba(42,60,36,0.8)' }}
              >
                <svg className="w-5 h-5" style={{ color: '#FFF5EB' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Counter */}
          <div
            className="absolute bottom-3 right-3 px-3 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: 'rgba(42,60,36,0.8)', color: '#97A97C' }}
          >
            {currentIndex + 1} / {images.length}
          </div>
        </div>

        {/* Horizontal scroll thumbnail strip */}
        {images.length > 1 && (
          <div className="overflow-x-auto pb-2" ref={scrollRef}>
            <div className="flex gap-2" style={{ minWidth: 'min-content' }}>
              {images.map((img, index) => (
                <button
                  key={img}
                  onClick={() => goToIndex(index)}
                  className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all duration-200 ${
                    currentIndex === index
                      ? 'ring-2 ring-offset-2 scale-105'
                      : 'opacity-60 hover:opacity-100 hover:scale-105'
                  }`}
                  style={{
                    ['--tw-ring-color' as string]: '#97A97C',
                    ['--tw-ring-offset-color' as string]: '#3B412D'
                  }}
                >
                  <Image
                    src={`/images/travel/${img}`}
                    alt={`${city} thumb ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

interface Location {
  id: string;
  city: string;
  country: string;
  coordinates: { lat: number; lng: number };
  type: string;
  visits: string;
  notes: string;
  highlights: string[];
  images?: string[];
  extendedNotes?: string;
  facts?: Record<string, string[]>;
  essay?: {
    id: string;
    title: string;
    excerpt: string;
  };
}

// Detail Panel Component - fixed overlay at bottom of viewport
function LocationDetail({ location, onClose }: { location: Location; onClose: () => void }) {
  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-deep-forest/60 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative w-full max-w-5xl mx-4 mb-4 rounded-2xl overflow-hidden animate-in slide-in-from-bottom-4 max-h-[85vh] overflow-y-auto"
        style={{ background: 'linear-gradient(to right, #3B412D, #546E40)' }}
        onClick={(e) => e.stopPropagation()}
      >
      <div className="p-6 md:p-8">
        {/* Header Row */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <span className="dark-bg-label">{location.country}</span>
            <h2 className="dark-bg-header text-3xl md:text-4xl mt-2">{location.city}</h2>
            <p className="text-gold text-sm mt-1">{location.visits}</p>
          </div>
          <button
            onClick={onClose}
            className="text-cream/70 hover:text-white transition-colors flex items-center gap-2 text-sm bg-white/10 px-3 py-1.5 rounded-full"
          >
            <span>Close</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid md:grid-cols-12 gap-6">
          {/* Left: Info & Facts */}
          <div className="md:col-span-5 space-y-4">
            {/* Trip Details */}
            <div className="bg-white/10 backdrop-blur rounded-xl p-5">
              <h3 className="text-xs uppercase tracking-wider mb-3" style={{ color: '#97A97C' }}>Trip Details</h3>
              <p className="dark-bg-body text-sm leading-relaxed">
                {location.extendedNotes || location.notes}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {location.highlights.map((highlight: string) => (
                  <span
                    key={highlight}
                    className="text-xs px-2 py-1 rounded-full bg-white/20 text-cream"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </div>

            {/* Essay Link */}
            {location.essay && (
              <Link
                href={`/journal/${location.essay.id}`}
                className="block bg-white/10 backdrop-blur rounded-xl p-5 transition-all hover:bg-white/15 group"
              >
                <h3 className="text-xs uppercase tracking-wider mb-2" style={{ color: '#97A97C' }}>
                  Related Essay
                </h3>
                <p className="text-cream font-medium group-hover:text-white transition-colors">
                  {location.essay.title}
                </p>
                <p className="text-cream/70 text-sm mt-1 italic">
                  &ldquo;{location.essay.excerpt}&rdquo;
                </p>
                <span className="inline-flex items-center gap-1 mt-3 text-xs" style={{ color: '#97A97C' }}>
                  Read essay
                  <svg className="w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            )}

            {/* Facts */}
            {location.facts && (
              <div className="space-y-3">
                {Object.entries(location.facts)
                  .filter(([category]) => !category.toLowerCase().includes('food'))
                  .map(([category, items]) => (
                  <div key={category} className="bg-white/10 backdrop-blur rounded-xl p-5">
                    <h3 className="text-xs uppercase tracking-wider mb-3" style={{ color: '#97A97C' }}>{category}</h3>
                    <ul className="space-y-2">
                      {items.map((item, idx) => (
                        <li key={idx} className="dark-bg-body text-sm flex gap-2">
                          <span style={{ color: 'rgba(151, 169, 124, 0.7)' }}>•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Photo Gallery with Carousel */}
          <div className="md:col-span-7">
            <PhotoCarousel images={location.images || []} city={location.city} />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

// Location Tile Component with enhanced hover effects
function LocationTile({
  location,
  style,
  isSelected,
  onSelect,
  index = 0
}: {
  location: Location;
  style: { bg: string; isDark: boolean };
  isSelected: boolean;
  onSelect: () => void;
  index?: number;
}) {
  const hasImages = location.images && location.images.length > 0;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={() => hasImages && onSelect()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`${style.bg} rounded-xl p-4 text-left transition-all duration-300 ${hasImages ? "cursor-pointer" : "cursor-default"} ${
        isSelected ? "ring-2 ring-gold shadow-lg" : ""
      }`}
      style={{
        transform: isHovered && hasImages ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: isHovered && hasImages
          ? '0 20px 40px rgba(42, 60, 36, 0.15), 0 8px 16px rgba(42, 60, 36, 0.1)'
          : '0 4px 6px rgba(42, 60, 36, 0.05)',
        animationDelay: `${index * 50}ms`
      }}
    >
      <div className="relative">
        <h3
          className={`text-lg tracking-tight transition-colors duration-300 ${style.isDark ? "text-cream" : "text-deep-forest"}`}
          style={{
            fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
            textShadow: isHovered && hasImages ? '0 0 20px rgba(212, 237, 57, 0.3)' : 'none'
          }}
        >
          {location.city.split(",")[0]}
        </h3>
        {/* Subtle glow effect on hover */}
        {isHovered && hasImages && (
          <div
            className="absolute -inset-2 rounded-xl opacity-50 blur-xl transition-opacity duration-300 -z-10"
            style={{ background: 'radial-gradient(circle, rgba(212, 237, 57, 0.3) 0%, transparent 70%)' }}
          />
        )}
      </div>
      <p className={`text-xs mt-2 leading-relaxed transition-colors duration-300 ${style.isDark ? "text-cream/70" : "text-deep-forest/70"}`}>
        {location.notes}
      </p>
      {hasImages && (
        <span
          className="inline-flex items-center gap-1.5 mt-3 px-2.5 py-1 rounded-full text-xs transition-all duration-300"
          style={{
            backgroundColor: isHovered ? '#D4ED39' : '#97A97C',
            color: '#2A3C24',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)'
          }}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {location.images!.length} photos
        </span>
      )}
    </button>
  );
}

// Extended Location Tile (for larger cards) with enhanced hover effects
function LocationTileExtended({
  location,
  style,
  isSelected,
  onSelect,
  index = 0
}: {
  location: Location;
  style: { bg: string; isDark: boolean };
  isSelected: boolean;
  onSelect: () => void;
  index?: number;
}) {
  const hasImages = location.images && location.images.length > 0;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={() => hasImages && onSelect()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`${style.bg} rounded-xl p-5 text-left transition-all duration-300 ${hasImages ? "cursor-pointer" : "cursor-default"} ${
        isSelected ? "ring-2 ring-gold shadow-lg" : ""
      }`}
      style={{
        transform: isHovered && hasImages ? 'translateY(-6px) scale(1.01)' : 'translateY(0) scale(1)',
        boxShadow: isHovered && hasImages
          ? '0 24px 48px rgba(42, 60, 36, 0.2), 0 12px 24px rgba(42, 60, 36, 0.1)'
          : '0 4px 6px rgba(42, 60, 36, 0.05)',
      }}
    >
      <div className="flex items-start justify-between gap-4 mb-1 relative">
        <h3
          className={`text-xl tracking-tight transition-all duration-300 ${style.isDark ? "text-cream" : "text-deep-forest"}`}
          style={{
            fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
            textShadow: isHovered && hasImages ? '0 0 20px rgba(212, 237, 57, 0.3)' : 'none'
          }}
        >
          {location.city}
        </h3>
        <span
          className={`text-[11px] px-2 py-1 rounded transition-all duration-300 ${style.isDark ? "bg-white/20 text-cream/70" : "bg-olive/20 text-charcoal/70"}`}
          style={{
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            backgroundColor: isHovered && style.isDark ? 'rgba(255, 255, 255, 0.3)' : undefined
          }}
        >
          {location.country}
        </span>
      </div>
      <p className={`text-xs leading-relaxed mb-4 transition-colors duration-300 ${style.isDark ? "text-cream/70" : "text-charcoal/70"}`}>
        {location.notes}
      </p>
      <div className="flex flex-wrap gap-2">
        {location.highlights.map((highlight: string, idx: number) => (
          <span
            key={highlight}
            className={`text-xs px-2 py-0.5 rounded transition-all duration-300 ${style.isDark ? "bg-white/20 text-cream/80" : "bg-sage/30 text-charcoal/70"}`}
            style={{
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              transitionDelay: `${idx * 30}ms`,
              backgroundColor: isHovered && !style.isDark ? 'rgba(151, 169, 124, 0.5)' : undefined
            }}
          >
            {highlight}
          </span>
        ))}
      </div>
      {hasImages && (
        <span
          className="inline-flex items-center gap-1.5 mt-3 px-2.5 py-1 rounded-full text-xs transition-all duration-300"
          style={{
            backgroundColor: isHovered ? '#D4ED39' : '#97A97C',
            color: '#2A3C24',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            boxShadow: isHovered ? '0 4px 12px rgba(212, 237, 57, 0.3)' : 'none'
          }}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {location.images!.length} photos
        </span>
      )}
    </button>
  );
}

export default function TravelPage() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['us']));

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const handleSelectLocation = (location: Location, section: string) => {
    if (selectedLocation?.id === location.id) {
      setSelectedLocation(null);
      setSelectedSection(null);
    } else {
      setSelectedLocation(location);
      setSelectedSection(section);
    }
  };

  const handleClose = () => {
    setSelectedLocation(null);
    setSelectedSection(null);
  };

  // Group by region
  const usLocations = travel.locations.filter(l => l.country === "United States") as Location[];
  const americasLocations = travel.locations.filter(l =>
    ["Canada", "Mexico"].includes(l.country)
  ) as Location[];
  const asiaLocations = travel.locations.filter(l =>
    ["Japan", "Vietnam", "Thailand", "India", "Nepal", "Sri Lanka"].includes(l.country)
  ) as Location[];
  const europeLocations = travel.locations.filter(l =>
    ["France", "United Kingdom", "Italy", "Spain", "Switzerland"].includes(l.country)
  ) as Location[];

  const tileStyles = [
    { bg: "panel-gradient-sage", isDark: false },
    { bg: "panel-gradient-olive", isDark: true },
    { bg: "panel-gradient-warm-neutral", isDark: false }
  ];

  const asiaStyles = [
    { bg: "panel-gradient-sage", isDark: false },
    { bg: "panel-gradient-warm-neutral", isDark: false },
    { bg: "panel-gradient-olive", isDark: true },
    { bg: "panel-gradient-olive", isDark: true },
    { bg: "panel-gradient-sage", isDark: false },
    { bg: "panel-gradient-warm-neutral", isDark: false },
    { bg: "panel-gradient-warm-neutral", isDark: false },
    { bg: "panel-gradient-olive", isDark: true },
    { bg: "panel-gradient-sage", isDark: false },
  ];

  return (
    <div className="bg-cream">
      {/* Hero */}
      <section className="pt-8 pb-12 md:pt-16 md:pb-16">
        <div className="container-editorial">
          <div className="max-w-2xl">
            <p className="light-bg-label mb-3">Travel</p>
            <h1
              className="text-4xl md:text-5xl mb-4 tracking-tight"
              style={{ fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif', color: '#3B412D' }}
            >
              Favorite places
            </h1>
            <p className="light-bg-body leading-relaxed reading-width">
              {travel.stats.cities} cities across {travel.stats.countries} countries. Trips since 2018.
            </p>
            <p className="text-xs text-olive/60 mt-3 italic">Click any city with photos to see more.</p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-8 md:py-12">
        <div className="container-editorial">
          <div className="mb-6">
            <p className="light-bg-label mb-2">Timeline</p>
            <p className="text-sm text-charcoal/60">Where I&apos;ve visited, in order.</p>
          </div>
          <TravelTimeline />
        </div>
      </section>

      <hr className="rule" />

      {/* United States */}
      <section className="py-12">
        <div className="container-editorial">
          <button
            onClick={() => toggleSection('us')}
            className="w-full flex items-center justify-between mb-8 group"
          >
            <div className="text-left">
              <h2 className="light-bg-header text-2xl mb-2 group-hover:text-olive transition-colors">
                United States
              </h2>
              <p className="light-bg-body text-sm leading-relaxed">
                {usLocations.filter(l => l.type === "travel" || l.type === "race").length} cities.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(42,60,36,0.1)', color: '#2a3c24' }}>
                {usLocations.filter(l => l.type === "travel" || l.type === "race").length} places
              </span>
              <svg
                className="w-5 h-5 transition-transform duration-200"
                style={{ color: '#2a3c24', transform: expandedSections.has('us') ? 'rotate(180deg)' : 'rotate(0deg)' }}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          <div
            className="overflow-hidden transition-all duration-300 ease-in-out"
            style={{ maxHeight: expandedSections.has('us') ? '3000px' : '0px', opacity: expandedSections.has('us') ? 1 : 0 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {usLocations
                .filter(l => l.type === "travel" || l.type === "race")
                .map((location, index) => (
                  <LocationTile
                    key={location.id}
                    location={location}
                    style={tileStyles[index % 3]}
                    isSelected={selectedLocation?.id === location.id}
                    onSelect={() => handleSelectLocation(location, 'us')}
                  />
                ))}
            </div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Asia */}
      <section className="py-12 bg-cream">
        <div className="container-editorial">
          <button
            onClick={() => toggleSection('asia')}
            className="w-full flex items-center justify-between mb-8 group"
          >
            <div className="text-left">
              <h2 className="light-bg-header text-2xl mb-2 group-hover:text-olive transition-colors">
                Asia
              </h2>
              <p className="light-bg-body text-sm leading-relaxed">
                Japan. Vietnam. Thailand. India. Nepal.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(42,60,36,0.1)', color: '#2a3c24' }}>
                {asiaLocations.length} places
              </span>
              <svg
                className="w-5 h-5 transition-transform duration-200"
                style={{ color: '#2a3c24', transform: expandedSections.has('asia') ? 'rotate(180deg)' : 'rotate(0deg)' }}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          <div
            className="overflow-hidden transition-all duration-300 ease-in-out"
            style={{ maxHeight: expandedSections.has('asia') ? '3000px' : '0px', opacity: expandedSections.has('asia') ? 1 : 0 }}
          >
            <div className="grid md:grid-cols-3 gap-4">
              {asiaLocations.map((location, index) => (
                <LocationTileExtended
                  key={location.id}
                  location={location}
                  style={asiaStyles[index % asiaStyles.length]}
                  isSelected={selectedLocation?.id === location.id}
                  onSelect={() => handleSelectLocation(location, 'asia')}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Americas */}
      {americasLocations.length > 0 && (
        <>
          <section className="py-12">
            <div className="container-editorial">
              <button
                onClick={() => toggleSection('americas')}
                className="w-full flex items-center justify-between mb-8 group"
              >
                <div className="text-left">
                  <h2 className="light-bg-header text-2xl mb-2 group-hover:text-olive transition-colors">
                    Americas
                  </h2>
                  <p className="light-bg-body text-sm leading-relaxed">
                    Canada, Mexico.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(42,60,36,0.1)', color: '#2a3c24' }}>
                    {americasLocations.length} places
                  </span>
                  <svg
                    className="w-5 h-5 transition-transform duration-200"
                    style={{ color: '#2a3c24', transform: expandedSections.has('americas') ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{ maxHeight: expandedSections.has('americas') ? '3000px' : '0px', opacity: expandedSections.has('americas') ? 1 : 0 }}
              >
                <div className="grid md:grid-cols-2 gap-4">
                  {americasLocations.map((location, index) => (
                    <LocationTileExtended
                      key={location.id}
                      location={location}
                      style={tileStyles[index % 3]}
                      isSelected={selectedLocation?.id === location.id}
                      onSelect={() => handleSelectLocation(location, 'americas')}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
          <hr className="rule" />
        </>
      )}

      {/* Europe */}
      <section className="py-12 bg-ivory">
        <div className="container-editorial">
          <button
            onClick={() => toggleSection('europe')}
            className="w-full flex items-center justify-between mb-8 group"
          >
            <div className="text-left">
              <h2 className="light-bg-header text-2xl mb-2 group-hover:text-olive transition-colors">
                Europe
              </h2>
              <p className="light-bg-body text-sm leading-relaxed">
                France, UK, Spain, Switzerland.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(42,60,36,0.1)', color: '#2a3c24' }}>
                {europeLocations.length} places
              </span>
              <svg
                className="w-5 h-5 transition-transform duration-200"
                style={{ color: '#2a3c24', transform: expandedSections.has('europe') ? 'rotate(180deg)' : 'rotate(0deg)' }}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          <div
            className="overflow-hidden transition-all duration-300 ease-in-out"
            style={{ maxHeight: expandedSections.has('europe') ? '3000px' : '0px', opacity: expandedSections.has('europe') ? 1 : 0 }}
          >
            <div className="grid md:grid-cols-2 gap-4">
              {europeLocations.map((location, index) => (
                <LocationTileExtended
                  key={location.id}
                  location={location}
                  style={tileStyles[index % 3]}
                  isSelected={selectedLocation?.id === location.id}
                  onSelect={() => handleSelectLocation(location, 'europe')}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Links */}
      <section className="py-12">
        <div className="container-editorial">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link href="/" className="link-editorial text-sm">
              ← Back to home
            </Link>
            <Link
              href="/dining"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm transition-colors"
              style={{ backgroundColor: '#546E40', color: '#FFF5EB' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#FFCB69';
                e.currentTarget.style.color = '#3B412D';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#546E40';
                e.currentTarget.style.color = '#FFF5EB';
              }}
            >
              <span style={{ fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif' }}>
                Where to eat in DC
              </span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Fixed Location Detail Overlay */}
      {selectedLocation && (
        <LocationDetail location={selectedLocation} onClose={handleClose} />
      )}
    </div>
  );
}
