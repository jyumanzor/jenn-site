"use client";

import { useState } from "react";
import travel from "@/data/travel.json";

type Location = typeof travel.locations[0] & {
  images?: string[];
};

// Get primary year for sorting
const getPrimaryYear = (visits: string): number => {
  if (visits.includes("present")) return 2025;
  const years = visits.match(/\d{4}/g);
  if (years && years.length > 0) {
    return Math.max(...years.map(y => parseInt(y)));
  }
  return 2024;
};

export default function TravelTimeline() {
  // Get locations with photos or notable trips, sorted by year
  const timelineLocations = travel.locations
    .filter(l => l.type === "travel" || l.type === "race")
    .map(l => ({ ...l, year: getPrimaryYear(l.visits) }))
    .sort((a, b) => b.year - a.year);

  // Group by year
  const years = [...new Set(timelineLocations.map(l => l.year))].sort((a, b) => b - a);

  // Track which years are expanded (default: most recent year expanded)
  const [expandedYears, setExpandedYears] = useState<Set<number>>(new Set([years[0]]));

  const toggleYear = (year: number) => {
    setExpandedYears(prev => {
      const next = new Set(prev);
      if (next.has(year)) {
        next.delete(year);
      } else {
        next.add(year);
      }
      return next;
    });
  };

  // Color gradients for timeline nodes (using the palette)
  const nodeColors = [
    { bg: 'linear-gradient(135deg, #2a3c24 0%, #4e6041 100%)', isDark: true },
    { bg: 'linear-gradient(135deg, #f7e5da 0%, #ffcb69 100%)', isDark: false },
    { bg: 'linear-gradient(135deg, #4e6041 0%, #97a97c 100%)', isDark: true },
    { bg: 'linear-gradient(135deg, #ecc064 0%, #ffd475 100%)', isDark: false },
    { bg: 'linear-gradient(135deg, #52653e 0%, #8b9d72 100%)', isDark: true },
    { bg: 'linear-gradient(135deg, rgba(212, 237, 57, 0.3) 0%, rgba(212, 237, 57, 0.5) 100%)', isDark: false },
  ];

  return (
    <div className="relative">
      {/* Timeline line */}
      <div
        className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5"
        style={{ background: 'linear-gradient(to bottom, #2a3c24, #97a97c, #ffcb69)' }}
      />

      {/* Year sections */}
      <div className="space-y-4">
        {years.map((year, yearIndex) => {
          const yearLocations = timelineLocations.filter(l => l.year === year);
          const isExpanded = expandedYears.has(year);

          return (
            <div key={year} className="relative">
              {/* Year marker - clickable */}
              <button
                onClick={() => toggleYear(year)}
                className="flex items-center gap-4 mb-2 w-full text-left group"
              >
                <div
                  className="w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center z-10 transition-transform group-hover:scale-105"
                  style={{
                    background: yearIndex === 0 ? '#d4ed39' : yearIndex === 1 ? '#ffcb69' : '#97a97c',
                    border: '3px solid #2a3c24'
                  }}
                >
                  <span
                    className="text-xs md:text-sm font-bold"
                    style={{ color: '#2a3c24' }}
                  >
                    {year.toString().slice(-2)}
                  </span>
                </div>
                <span
                  className="text-2xl md:text-3xl tracking-tight flex-1"
                  style={{ fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif', color: '#2a3c24' }}
                >
                  {year}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: 'rgba(42,60,36,0.1)', color: '#2a3c24' }}
                  >
                    {yearLocations.length} {yearLocations.length === 1 ? 'trip' : 'trips'}
                  </span>
                  <svg
                    className="w-5 h-5 transition-transform duration-200"
                    style={{
                      color: '#2a3c24',
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Locations for this year - collapsible */}
              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                  maxHeight: isExpanded ? `${yearLocations.length * 200}px` : '0px',
                  opacity: isExpanded ? 1 : 0
                }}
              >
                <div className="ml-12 md:ml-20 space-y-3 pb-4">
                  {yearLocations.map((location, locIndex) => {
                    const colorStyle = nodeColors[(yearIndex + locIndex) % nodeColors.length];
                    const hasImages = (location as Location).images && (location as Location).images!.length > 0;

                    return (
                      <div
                        key={location.id}
                        className="relative flex items-start gap-3"
                      >
                        {/* Connection dot */}
                        <div
                          className="absolute -left-8 md:-left-12 top-3 w-2 h-2 rounded-full"
                          style={{ backgroundColor: colorStyle.isDark ? '#2a3c24' : '#97a97c' }}
                        />

                        {/* Location card */}
                        <div
                          className="flex-1 rounded-lg p-4 transition-transform hover:scale-[1.01]"
                          style={{ background: colorStyle.bg }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3
                                className="text-base md:text-lg leading-tight"
                                style={{
                                  fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                                  color: colorStyle.isDark ? '#fff5eb' : '#2a3c24'
                                }}
                              >
                                {location.city}
                              </h3>
                              <p
                                className="text-xs mt-0.5"
                                style={{ color: colorStyle.isDark ? 'rgba(255,245,235,0.6)' : 'rgba(42,60,36,0.6)' }}
                              >
                                {location.country} · {location.visits}
                              </p>
                            </div>
                            {location.type === "race" && (
                              <span
                                className="text-[10px] px-2 py-0.5 rounded-full"
                                style={{
                                  backgroundColor: colorStyle.isDark ? 'rgba(212,237,57,0.3)' : 'rgba(42,60,36,0.15)',
                                  color: colorStyle.isDark ? '#d4ed39' : '#2a3c24'
                                }}
                              >
                                Race
                              </span>
                            )}
                          </div>
                          <p
                            className="text-sm mt-2 leading-relaxed"
                            style={{ color: colorStyle.isDark ? 'rgba(255,245,235,0.8)' : 'rgba(42,60,36,0.7)' }}
                          >
                            {location.notes}
                          </p>
                          {hasImages && (
                            <p
                              className="text-xs mt-2"
                              style={{ color: colorStyle.isDark ? '#d4ed39' : '#546e40' }}
                            >
                              {(location as Location).images!.length} photos →
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
