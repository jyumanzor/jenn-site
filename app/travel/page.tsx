"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import travel from "@/data/travel.json";
import TravelTimeline from "@/components/TravelTimeline";

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
}

export default function TravelPage() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
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

  return (
    <div className="bg-cream">
      {/* Hero */}
      <section className="pt-28 pb-12 md:pt-36 md:pb-16">
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
              {travel.stats.cities} cities across {travel.stats.countries} countries. Trips since 2021.
            </p>
            <p className="text-xs text-olive/60 mt-3 italic">Click any city with photos to see more.</p>
          </div>
        </div>
      </section>

      {/* Timeline - Chronological journey */}
      <section className="py-8 md:py-12">
        <div className="container-editorial">
          <div className="mb-6">
            <p className="light-bg-label mb-2">Timeline</p>
            <p className="text-sm text-charcoal/60">Where I&apos;ve lived, in order.</p>
          </div>
          <TravelTimeline />
        </div>
      </section>

      <hr className="rule" />

      {/* Stats Grid */}
      <section className="py-10 bg-cream">
        <div className="container-editorial">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="panel-gradient-deep text-center">
              <p className="dark-bg-header text-3xl">{travel.stats.countries}</p>
              <p className="dark-bg-label mt-1">Countries</p>
            </div>
            <div className="panel-gradient-sage text-center">
              <p className="light-bg-header text-3xl">{travel.stats.cities}</p>
              <p className="light-bg-label mt-1">Cities</p>
            </div>
            <div className="panel-gradient-warm-neutral text-center">
              <p className="light-bg-header text-3xl">{usLocations.length}</p>
              <p className="light-bg-label mt-1">US</p>
            </div>
            <div className="panel-gradient-olive text-center">
              <p className="dark-bg-header text-3xl">{asiaLocations.length + europeLocations.length}</p>
              <p className="dark-bg-label mt-1">Int&apos;l</p>
            </div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Selected Location Detail Panel */}
      {selectedLocation && (
        <section className="py-12" style={{ background: 'linear-gradient(to right, #3B412D, #546E40)' }}>
          <div className="container-editorial">
            <div className="max-w-6xl">
              {/* Header Row */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <span className="dark-bg-label">{selectedLocation.country}</span>
                  <h2 className="dark-bg-header text-4xl mt-2">{selectedLocation.city}</h2>
                  <p className="text-gold text-sm mt-1">{selectedLocation.visits}</p>
                </div>
                <button
                  onClick={() => setSelectedLocation(null)}
                  className="dark-bg-body text-sm hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>←</span> Back
                </button>
              </div>

              <div className="grid md:grid-cols-12 gap-8">
                {/* Left: Info & Facts */}
                <div className="md:col-span-5 space-y-6">
                  {/* About */}
                  <div className="bg-white/10 backdrop-blur rounded-xl p-5">
                    <h3 className="text-gold text-xs uppercase tracking-wider mb-3">About</h3>
                    <p className="dark-bg-body text-sm leading-relaxed">
                      {(selectedLocation as Location).extendedNotes || selectedLocation.notes}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {selectedLocation.highlights.map((highlight: string) => (
                        <span
                          key={highlight}
                          className="text-xs px-2 py-1 rounded-full bg-white/20 text-cream"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Facts - Scaffolded Headers */}
                  {(selectedLocation as Location).facts && (
                    <div className="space-y-4">
                      {Object.entries((selectedLocation as Location).facts!).map(([category, items]) => (
                        <div key={category} className="bg-white/10 backdrop-blur rounded-xl p-5">
                          <h3 className="text-gold text-xs uppercase tracking-wider mb-3">{category}</h3>
                          <ul className="space-y-2">
                            {items.map((item, idx) => (
                              <li key={idx} className="dark-bg-body text-sm flex gap-2">
                                <span className="text-gold/60">•</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: Photo Gallery */}
                <div className="md:col-span-7">
                  {(selectedLocation as Location).images && (selectedLocation as Location).images!.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {(selectedLocation as Location).images!.slice(0, 6).map((img, index) => (
                        <div
                          key={img}
                          className={`relative aspect-square rounded-lg overflow-hidden ${
                            index === 0 ? "col-span-2 row-span-2" : ""
                          }`}
                        >
                          <Image
                            src={`/images/travel/${img}`}
                            alt={`${selectedLocation.city} photo ${index + 1}`}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white/10 rounded-lg p-12 text-center">
                      <p className="dark-bg-body">Photos coming soon</p>
                    </div>
                  )}
                  {(selectedLocation as Location).images && (selectedLocation as Location).images!.length > 6 && (
                    <p className="dark-bg-label mt-4 text-center">
                      +{(selectedLocation as Location).images!.length - 6} more photos
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

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
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ backgroundColor: 'rgba(42,60,36,0.1)', color: '#2a3c24' }}
              >
                {usLocations.filter(l => l.type === "travel" || l.type === "race").length} places
              </span>
              <svg
                className="w-5 h-5 transition-transform duration-200"
                style={{
                  color: '#2a3c24',
                  transform: expandedSections.has('us') ? 'rotate(180deg)' : 'rotate(0deg)'
                }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          <div
            className="overflow-hidden transition-all duration-300 ease-in-out"
            style={{
              maxHeight: expandedSections.has('us') ? '2000px' : '0px',
              opacity: expandedSections.has('us') ? 1 : 0
            }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {usLocations
                .filter(l => l.type === "travel" || l.type === "race")
                .map((location, index) => {
                  const hasImages = (location as Location).images && (location as Location).images!.length > 0;
                  // Cycle through: sage, olive (dark), warm-neutral
                  const styles = [
                    { bg: "panel-gradient-sage", isDark: false },
                    { bg: "panel-gradient-olive", isDark: true },
                    { bg: "panel-gradient-warm-neutral", isDark: false }
                  ];
                  const style = styles[index % 3];
                  return (
                    <button
                      key={location.id}
                      onClick={() => hasImages ? setSelectedLocation(location as Location) : null}
                      className={`${style.bg} rounded-xl p-4 text-left transition-all ${hasImages ? "hover:scale-[1.02] cursor-pointer" : "cursor-default"} ${
                        selectedLocation?.id === location.id ? "ring-2 ring-gold" : ""
                      }`}
                    >
                      <h3
                        className={`text-lg tracking-tight ${style.isDark ? "text-cream" : "text-deep-forest"}`}
                        style={{ fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif' }}
                      >
                        {location.city.split(",")[0]}
                      </h3>
                      <p className={`text-xs mt-2 leading-relaxed ${style.isDark ? "text-cream/70" : "text-deep-forest/70"}`}>{location.notes}</p>
                      {hasImages && (
                        <span className="inline-flex items-center gap-1.5 mt-3 px-2.5 py-1 rounded-full text-xs" style={{ backgroundColor: '#d4ed39', color: '#2a3c24' }}>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {(location as Location).images!.length} photos
                        </span>
                      )}
                    </button>
                  );
                })}
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
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ backgroundColor: 'rgba(42,60,36,0.1)', color: '#2a3c24' }}
              >
                {asiaLocations.length} places
              </span>
              <svg
                className="w-5 h-5 transition-transform duration-200"
                style={{
                  color: '#2a3c24',
                  transform: expandedSections.has('asia') ? 'rotate(180deg)' : 'rotate(0deg)'
                }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          <div
            className="overflow-hidden transition-all duration-300 ease-in-out"
            style={{
              maxHeight: expandedSections.has('asia') ? '2000px' : '0px',
              opacity: expandedSections.has('asia') ? 1 : 0
            }}
          >
            <div className="grid md:grid-cols-3 gap-4">
              {asiaLocations.map((location, index) => {
                const hasImages = (location as Location).images && (location as Location).images!.length > 0;
                // Mixed pattern to avoid column color blocking in 3-col grid
                const styles = [
                  { bg: "panel-gradient-sage", isDark: false },      // 0
                  { bg: "panel-gradient-warm-neutral", isDark: false }, // 1
                  { bg: "panel-gradient-olive", isDark: true },      // 2
                  { bg: "panel-gradient-olive", isDark: true },      // 3
                  { bg: "panel-gradient-sage", isDark: false },      // 4
                  { bg: "panel-gradient-warm-neutral", isDark: false }, // 5
                  { bg: "panel-gradient-warm-neutral", isDark: false }, // 6
                  { bg: "panel-gradient-olive", isDark: true },      // 7
                  { bg: "panel-gradient-sage", isDark: false },      // 8
                ];
                const style = styles[index % styles.length];
                return (
                  <button
                    key={location.id}
                    onClick={() => hasImages ? setSelectedLocation(location as Location) : null}
                    className={`${style.bg} rounded-xl p-5 text-left transition-all ${hasImages ? "hover:scale-[1.02] cursor-pointer" : "cursor-default"} ${
                      selectedLocation?.id === location.id ? "ring-2 ring-gold" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <h3
                        className={`text-xl tracking-tight ${style.isDark ? "text-cream" : "text-deep-forest"}`}
                        style={{ fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif' }}
                      >
                        {location.city}
                      </h3>
                      <span className={`text-[11px] px-2 py-1 rounded ${style.isDark ? "bg-white/20 text-cream/70" : "bg-olive/20 text-charcoal/70"}`}>
                        {location.country}
                      </span>
                    </div>
                    <p className={`text-xs leading-relaxed mb-4 ${style.isDark ? "text-cream/70" : "text-charcoal/70"}`}>
                      {location.notes}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {location.highlights.map((highlight: string) => (
                        <span
                          key={highlight}
                          className={`text-xs px-2 py-0.5 rounded ${style.isDark ? "bg-white/20 text-cream/80" : "bg-sage/30 text-charcoal/70"}`}
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                    {hasImages && (
                      <span className="inline-flex items-center gap-1.5 mt-3 px-2.5 py-1 rounded-full text-xs" style={{ backgroundColor: '#d4ed39', color: '#2a3c24' }}>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {(location as Location).images!.length} photos
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Americas (outside US) */}
      {americasLocations.length > 0 && (
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
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: 'rgba(42,60,36,0.1)', color: '#2a3c24' }}
                >
                  {americasLocations.length} places
                </span>
                <svg
                  className="w-5 h-5 transition-transform duration-200"
                  style={{
                    color: '#2a3c24',
                    transform: expandedSections.has('americas') ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            <div
              className="overflow-hidden transition-all duration-300 ease-in-out"
              style={{
                maxHeight: expandedSections.has('americas') ? '2000px' : '0px',
                opacity: expandedSections.has('americas') ? 1 : 0
              }}
            >
              <div className="grid md:grid-cols-2 gap-4">
                {americasLocations.map((location, index) => {
                  const hasImages = (location as Location).images && (location as Location).images!.length > 0;
                  // Cycle through: sage, olive (dark), warm-neutral
                  const styles = [
                    { bg: "panel-gradient-sage", isDark: false },
                    { bg: "panel-gradient-olive", isDark: true },
                    { bg: "panel-gradient-warm-neutral", isDark: false }
                  ];
                  const style = styles[index % 3];
                  return (
                    <button
                      key={location.id}
                      onClick={() => hasImages ? setSelectedLocation(location as Location) : null}
                      className={`${style.bg} rounded-xl p-5 text-left transition-all ${hasImages ? "hover:scale-[1.02] cursor-pointer" : "cursor-default"} ${
                        selectedLocation?.id === location.id ? "ring-2 ring-gold" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <h3
                          className={`text-xl tracking-tight ${style.isDark ? "text-cream" : "text-deep-forest"}`}
                          style={{ fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif' }}
                        >
                          {location.city}
                        </h3>
                        <span className={`text-[11px] px-2 py-1 rounded ${style.isDark ? "bg-white/20 text-cream/70" : "bg-olive/20 text-charcoal/70"}`}>
                          {location.country}
                        </span>
                      </div>
                      <p className={`text-xs leading-relaxed mb-4 ${style.isDark ? "text-cream/70" : "text-charcoal/70"}`}>
                        {location.notes}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {location.highlights.map((highlight: string) => (
                          <span
                            key={highlight}
                            className={`text-xs px-2 py-0.5 rounded ${style.isDark ? "bg-white/20 text-cream/80" : "bg-sage/30 text-charcoal/70"}`}
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                      {hasImages && (
                        <span className="inline-flex items-center gap-1.5 mt-3 px-2.5 py-1 rounded-full text-xs" style={{ backgroundColor: '#d4ed39', color: '#2a3c24' }}>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {(location as Location).images!.length} photos
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      <hr className="rule" />

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
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ backgroundColor: 'rgba(42,60,36,0.1)', color: '#2a3c24' }}
              >
                {europeLocations.length} places
              </span>
              <svg
                className="w-5 h-5 transition-transform duration-200"
                style={{
                  color: '#2a3c24',
                  transform: expandedSections.has('europe') ? 'rotate(180deg)' : 'rotate(0deg)'
                }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          <div
            className="overflow-hidden transition-all duration-300 ease-in-out"
            style={{
              maxHeight: expandedSections.has('europe') ? '2000px' : '0px',
              opacity: expandedSections.has('europe') ? 1 : 0
            }}
          >
            <div className="grid md:grid-cols-2 gap-4">
              {europeLocations.map((location, index) => {
                const hasImages = (location as Location).images && (location as Location).images!.length > 0;
                // Cycle through: sage, warm-neutral, olive (dark)
                const styles = [
                  { bg: "panel-gradient-sage", isDark: false },
                  { bg: "panel-gradient-warm-neutral", isDark: false },
                  { bg: "panel-gradient-olive", isDark: true }
                ];
                const style = styles[index % 3];
                return (
                  <button
                    key={location.id}
                    onClick={() => hasImages ? setSelectedLocation(location as Location) : null}
                    className={`${style.bg} rounded-xl p-5 text-left transition-all ${hasImages ? "hover:scale-[1.02] cursor-pointer" : "cursor-default"} ${
                      selectedLocation?.id === location.id ? "ring-2 ring-gold" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <h3
                        className={`text-xl tracking-tight ${style.isDark ? "text-cream" : "text-deep-forest"}`}
                        style={{ fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif' }}
                      >
                        {location.city}
                      </h3>
                      <span className={`text-[11px] px-2 py-1 rounded ${style.isDark ? "bg-white/20 text-cream/70" : "bg-olive/20 text-charcoal/70"}`}>
                        {location.country}
                      </span>
                    </div>
                    <p className={`text-xs leading-relaxed mb-4 ${style.isDark ? "text-cream/70" : "text-charcoal/70"}`}>
                      {location.notes}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {location.highlights.map((highlight: string) => (
                        <span
                          key={highlight}
                          className={`text-xs px-2 py-0.5 rounded ${style.isDark ? "bg-white/20 text-cream/80" : "bg-sage/30 text-charcoal/70"}`}
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                    {hasImages && (
                      <span className="inline-flex items-center gap-1.5 mt-3 px-2.5 py-1 rounded-full text-xs" style={{ backgroundColor: '#d4ed39', color: '#2a3c24' }}>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {(location as Location).images!.length} photos
                      </span>
                    )}
                  </button>
                );
              })}
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
    </div>
  );
}
