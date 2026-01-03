"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import tattoos from "@/data/tattoos.json";
import journal from "@/data/journal.json";

// Map tattoo IDs to line art image filenames (V3 SVG RENDERS)
const lineArtMap: Record<string, string> = {
  "umbrella": "jenn_umbrella_panel.svg",
  "anatomical-heart": "jenn_anatomical_heart_panel.svg",
  "so-it-goes": "jenn_so_it_goes_panel.svg",
  "es-muss-sein": "jenn_es_muss_sein_panel.svg",
  "little-prince": "jenn_california_bear_panel.svg",
  "volcano": "jenn_volcano_panel.svg",
  "410": "07_410.png", // No SVG render available
  "cowboy-hat": "jenn_cowboy_hat_panel.svg",
  "spoon": "jenn_spoon_panel.svg",
  "bike-lane": "jenn_bicycle_panel.svg",
  "marathon-clock": "jenn_marathon_time_panel.svg",
  "disco-ball": "jenn_disco_ball_panel.svg",
  "squirrel": "jenn_squirrel_panel.svg",
  "honey-pot": "jenn_honey_jar_panel.svg",
  "hummingbird": "jenn_hummingbird_panel.svg",
};

// Color tattoos (umbrella and hummingbird)
const colorTattoos = ["umbrella", "hummingbird"];

// Timeline data with accurate dates/locations from JSON
const timelineData = [
  { year: "2017", city: "Dallas/Austin", tattoos: ["umbrella", "anatomical-heart"], color: '#FABF34', months: ["Mar", "Sep"] },
  { year: "2018", city: "Chicago", tattoos: ["so-it-goes", "es-muss-sein", "little-prince"], color: '#D4ED39', months: ["Jan", "Sep", "Oct"] },
  { year: "2019", city: "Chicago", tattoos: ["volcano"], color: '#97A97C', months: ["Jan"] },
  { year: "2022", city: "Dallas", tattoos: ["410", "cowboy-hat"], color: '#FABF34', months: ["Sep", "Sep"] },
  { year: "2023", city: "Dallas", tattoos: ["spoon", "bike-lane", "marathon-clock"], color: '#D4ED39', months: ["Dec", "Dec", "Dec"] },
  { year: "2024", city: "NYC/Dallas", tattoos: ["disco-ball", "squirrel", "honey-pot"], color: '#97A97C', months: ["Jan", "Jan", "Dec"] },
  { year: "2025", city: "DC", tattoos: ["hummingbird"], color: '#D4ED39', months: ["Jul"] },
];

// Gallery order
const galleryOrder = [
  'umbrella', 'anatomical-heart', 'so-it-goes', 'es-muss-sein', 'little-prince',
  'volcano', '410', 'cowboy-hat', 'spoon', 'bike-lane',
  'marathon-clock', 'disco-ball', 'squirrel', 'honey-pot', 'hummingbird'
];

type Tattoo = typeof tattoos.tattoos[0] & {
  quote?: string;
  source?: string;
  date?: string;
  city?: string;
  shop?: string | null;
  order?: number;
};

// Detail panel component for inline expansion
function DetailPanel({
  tattoo,
  onClose,
  variant = 'light',
  isExpanded
}: {
  tattoo: Tattoo;
  onClose: () => void;
  variant?: 'light' | 'dark';
  isExpanded: boolean;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const isColor = colorTattoos.includes(tattoo.id);

  useEffect(() => {
    if (isExpanded && panelRef.current) {
      setTimeout(() => {
        panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 150);
    }
  }, [isExpanded]);

  const isDark = variant === 'dark';

  return (
    <div
      ref={panelRef}
      className={`overflow-hidden transition-all duration-500 ease-out ${
        isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
      }`}
    >
      <div
        className="rounded-2xl p-6 md:p-8 mt-4 transform transition-all duration-500"
        style={{
          backgroundColor: isDark ? '#2A3C24' : '#FFF5EB',
          boxShadow: isDark
            ? '0 12px 40px rgba(42,60,36,0.4), inset 0 1px 0 rgba(255,255,255,0.05)'
            : '0 12px 40px rgba(42,60,36,0.15), inset 0 1px 0 rgba(255,255,255,0.8)',
          transform: isExpanded ? 'translateY(0)' : 'translateY(-20px)',
        }}
      >
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Image */}
          <div
            className="w-28 h-28 md:w-36 md:h-36 flex-shrink-0 rounded-xl flex items-center justify-center transition-transform duration-300 hover:scale-105"
            style={{
              backgroundColor: isDark ? '#FFF5EB' : 'rgba(42,60,36,0.05)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
          >
            <Image
              src={`/images/tattoos/${lineArtMap[tattoo.id]}`}
              alt={tattoo.name}
              width={120}
              height={120}
              className="object-contain"
            />
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3
                    className="text-xl md:text-2xl"
                    style={{
                      fontFamily: 'var(--font-instrument)',
                      color: isDark ? '#FFF5EB' : '#2A3C24'
                    }}
                  >
                    {tattoo.name}
                  </h3>
                  {isColor && (
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full animate-pulse"
                      style={{ backgroundColor: '#FABF34', color: '#2A3C24' }}
                    >
                      Color
                    </span>
                  )}
                </div>
                <p className="text-xs" style={{ color: isDark ? '#D4ED39' : '#97A97C' }}>
                  {tattoo.location.replace(/-/g, " ")}
                  {tattoo.city && ` | ${tattoo.city}`}
                  {tattoo.date && ` | ${new Date(tattoo.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                  {tattoo.shop && ` @ ${tattoo.shop}`}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-xs px-3 py-1.5 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg"
                style={{
                  backgroundColor: isDark ? '#D4ED39' : '#2A3C24',
                  color: isDark ? '#2A3C24' : '#FFF5EB'
                }}
              >
                Close
              </button>
            </div>

            <p
              className="text-sm mb-4 leading-relaxed"
              style={{ color: isDark ? 'rgba(255,245,235,0.8)' : 'rgba(42,60,36,0.8)' }}
            >
              {tattoo.description}
            </p>

            <div
              className="rounded-lg p-4 transition-all duration-300 hover:shadow-md"
              style={{ backgroundColor: isDark ? 'rgba(212,237,57,0.1)' : 'rgba(151,169,124,0.15)' }}
            >
              <p className="text-xs uppercase tracking-widest mb-2" style={{ color: isDark ? '#D4ED39' : '#97A97C' }}>
                The meaning
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: isDark ? 'rgba(255,245,235,0.9)' : '#2A3C24' }}
              >
                {tattoo.meaning}
              </p>
            </div>

            {tattoo.quote && (
              <div
                className="mt-4 rounded-lg p-4"
                style={{ backgroundColor: isDark ? 'rgba(250,191,52,0.1)' : 'rgba(212,237,57,0.15)' }}
              >
                <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#FABF34' }}>
                  The full text
                </p>
                <blockquote
                  className="text-xs italic leading-relaxed"
                  style={{ color: isDark ? 'rgba(255,245,235,0.8)' : 'rgba(42,60,36,0.8)' }}
                >
                  &ldquo;{tattoo.quote}&rdquo;
                </blockquote>
                {tattoo.source && (
                  <cite
                    className="block text-[10px] mt-3 not-italic"
                    style={{ color: isDark ? 'rgba(255,245,235,0.5)' : 'rgba(42,60,36,0.5)' }}
                  >
                    - {tattoo.source}
                  </cite>
                )}
              </div>
            )}

            {/* HIMYM Quotes for Umbrella tattoo */}
            {tattoo.id === 'umbrella' && journal.himymQuotes && (
              <div
                className="mt-4 rounded-lg p-4"
                style={{ backgroundColor: isDark ? 'rgba(250,191,52,0.15)' : 'rgba(250,191,52,0.1)' }}
              >
                <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#FABF34' }}>
                  Favorite HIMYM Quotes
                </p>
                <div className="space-y-3">
                  {journal.himymQuotes.slice(0, 4).map((quote, i) => (
                    <blockquote
                      key={i}
                      className="text-xs italic leading-relaxed pl-3 border-l-2"
                      style={{
                        color: isDark ? 'rgba(255,245,235,0.8)' : 'rgba(42,60,36,0.8)',
                        borderColor: '#FABF34'
                      }}
                    >
                      &ldquo;{quote}&rdquo;
                    </blockquote>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Timeline pill component with its own hover state
function TimelinePill({
  tattooId,
  tattooName,
  isSelected,
  isColor,
  periodColor,
  month,
  onClick
}: {
  tattooId: string;
  tattooName: string;
  isSelected: boolean;
  isColor: boolean;
  periodColor: string;
  month?: string;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="text-[10px] md:text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-all duration-300"
      style={{
        backgroundColor: isSelected ? '#2A3C24' : periodColor,
        color: isSelected ? '#FFF5EB' : '#2A3C24',
        boxShadow: isSelected
          ? `0 4px 15px rgba(42,60,36,0.4), 0 0 20px ${periodColor}40`
          : isHovered
          ? `0 4px 12px rgba(42,60,36,0.25), 0 0 15px ${periodColor}30`
          : '0 2px 8px rgba(42,60,36,0.15)',
        border: isColor ? '2px solid #FABF34' : 'none',
        transform: isSelected
          ? 'scale(1.1) translateX(4px)'
          : isHovered
          ? 'scale(1.08) translateX(2px)'
          : 'scale(1)',
      }}
    >
      {tattooName}
      {month && (
        <span className="ml-1 opacity-60">({month})</span>
      )}
    </button>
  );
}

export default function TattoosPage() {
  const [selectedTattoo, setSelectedTattoo] = useState<Tattoo | null>(null);
  const [hoveredTattoo, setHoveredTattoo] = useState<string | null>(null);
  const [detailLocation, setDetailLocation] = useState<'gallery' | 'timeline' | 'body' | null>(null);
  const [selectedGalleryRow, setSelectedGalleryRow] = useState<number | null>(null);
  const [selectedTimelineYear, setSelectedTimelineYear] = useState<string | null>(null);
  const [hoveredTimelineYear, setHoveredTimelineYear] = useState<string | null>(null);

  // Calculate which row a gallery item is in (5 items per row on desktop)
  const getRowForIndex = (index: number, itemsPerRow: number) => Math.floor(index / itemsPerRow);

  // Get items per row based on screen size (approximation for SSR)
  const itemsPerRow = 8; // md:grid-cols-8

  // Group gallery items by row
  const galleryRows = useMemo(() => {
    const rows: { items: string[]; rowIndex: number }[] = [];
    for (let i = 0; i < galleryOrder.length; i += itemsPerRow) {
      rows.push({
        items: galleryOrder.slice(i, i + itemsPerRow),
        rowIndex: Math.floor(i / itemsPerRow)
      });
    }
    return rows;
  }, []);

  const handleGalleryClick = (tattoo: Tattoo, index: number) => {
    const row = getRowForIndex(index, itemsPerRow);
    if (selectedTattoo?.id === tattoo.id && detailLocation === 'gallery') {
      setSelectedTattoo(null);
      setDetailLocation(null);
      setSelectedGalleryRow(null);
    } else {
      setSelectedTattoo(tattoo);
      setDetailLocation('gallery');
      setSelectedGalleryRow(row);
    }
  };

  const handleTimelineClick = (tattooId: string, year: string) => {
    const tattoo = tattoos.tattoos.find(t => t.id === tattooId) as Tattoo;
    if (tattoo) {
      if (selectedTattoo?.id === tattoo.id && detailLocation === 'timeline') {
        setSelectedTattoo(null);
        setDetailLocation(null);
        setSelectedTimelineYear(null);
      } else {
        setSelectedTattoo(tattoo);
        setDetailLocation('timeline');
        setSelectedTimelineYear(year);
      }
    }
  };

  const handleBodyClick = (tattoo: Tattoo) => {
    setSelectedTattoo(tattoo);
    setDetailLocation('body');
  };

  // Check if tattoo is color
  const isColorTattoo = (id: string) => colorTattoos.includes(id);

  return (
    <div className="bg-cream min-h-screen">
      {/* Hero */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-16 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(ellipse at 30% 50%, rgba(212,237,57,0.3) 0%, transparent 50%)'
          }}
        />
        <div className="container-editorial relative">
          <div className="max-w-2xl">
            <p
              className="text-xs uppercase tracking-widest mb-4"
              style={{ color: '#97A97C' }}
            >
              Tattoos
            </p>
            <h1
              className="text-5xl md:text-6xl mb-6 tracking-tight"
              style={{
                fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                color: '#2A3C24'
              }}
            >
              Stories on skin.
            </h1>
            <p
              className="text-lg leading-relaxed max-w-xl"
              style={{ color: 'rgba(42,60,36,0.7)' }}
            >
              {tattoos.stats.total} fine line tattoos. Each one marks something - a book, a person, a moment, a belief.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Body Map */}
      <section className="py-12" style={{ backgroundColor: '#FFF5EB' }}>
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-8 items-start">
            {/* Body Silhouette */}
            <div className="md:col-span-5 relative flex justify-center">
              <div className="relative w-48 h-[480px]">
                {/* Athletic body silhouette SVG */}
                <svg
                  viewBox="0 0 200 480"
                  className="w-full h-full"
                  style={{ filter: 'drop-shadow(0 4px 20px rgba(42,60,36,0.1))' }}
                >
                  {/* Head */}
                  <ellipse cx="100" cy="32" rx="20" ry="26" fill="#97A97C" opacity="0.4" />
                  {/* Neck */}
                  <path d="M94 56 Q100 58 106 56 L105 72 Q100 74 95 72 Z" fill="#97A97C" opacity="0.4" />
                  {/* Chest */}
                  <path d="M72 74 Q100 70 128 74 L126 118 Q100 124 74 118 Z" fill="#97A97C" opacity="0.4" />
                  {/* Left Upper Arm */}
                  <path d="M72 75 L62 78 Q56 82 55 88 L52 132 Q54 136 58 134 L66 118 L72 118 Z" fill="#97A97C" opacity="0.4" />
                  {/* Right Upper Arm */}
                  <path d="M128 75 L138 78 Q144 82 145 88 L148 132 Q146 136 142 134 L134 118 L128 118 Z" fill="#97A97C" opacity="0.4" />
                  {/* Left Forearm */}
                  <path d="M52 136 L48 188 Q46 196 50 200 L56 198 L60 136 Z" fill="#97A97C" opacity="0.4" />
                  {/* Right Forearm */}
                  <path d="M148 136 L152 188 Q154 196 150 200 L144 198 L140 136 Z" fill="#97A97C" opacity="0.4" />
                  {/* Left Hand */}
                  <ellipse cx="50" cy="212" rx="7" ry="13" fill="#97A97C" opacity="0.4" />
                  {/* Right Hand */}
                  <ellipse cx="150" cy="212" rx="7" ry="13" fill="#97A97C" opacity="0.4" />
                  {/* Torso */}
                  <path d="M74 120 Q100 126 126 120 L122 165 Q100 170 78 165 Z" fill="#97A97C" opacity="0.4" />
                  {/* Waist */}
                  <path d="M78 167 Q100 172 122 167 L120 200 Q100 204 80 200 Z" fill="#97A97C" opacity="0.4" />
                  {/* Hips */}
                  <path d="M80 202 Q100 206 120 202 L122 240 Q100 245 78 240 Z" fill="#97A97C" opacity="0.4" />
                  {/* Left Thigh */}
                  <path d="M78 242 Q86 246 97 244 L95 320 Q88 323 82 320 L76 245 Z" fill="#97A97C" opacity="0.4" />
                  {/* Right Thigh */}
                  <path d="M103 244 Q114 246 122 242 L124 245 L118 320 Q112 323 105 320 Z" fill="#97A97C" opacity="0.4" />
                  {/* Left Calf */}
                  <path d="M82 322 Q89 328 95 322 L93 400 Q88 404 84 400 Z" fill="#97A97C" opacity="0.4" />
                  {/* Right Calf */}
                  <path d="M105 322 Q111 328 118 322 L116 400 Q112 404 107 400 Z" fill="#97A97C" opacity="0.4" />
                  {/* Left Ankle */}
                  <path d="M84 402 Q88 406 93 402 L92 425 Q88 428 85 425 Z" fill="#97A97C" opacity="0.4" />
                  {/* Right Ankle */}
                  <path d="M107 402 Q112 406 116 402 L115 425 Q112 428 108 425 Z" fill="#97A97C" opacity="0.4" />
                  {/* Left Foot */}
                  <ellipse cx="88" cy="440" rx="10" ry="16" fill="#97A97C" opacity="0.4" />
                  {/* Right Foot */}
                  <ellipse cx="112" cy="440" rx="10" ry="16" fill="#97A97C" opacity="0.4" />
                </svg>

                {/* Tattoo markers */}
                {tattoos.tattoos.map((tattoo) => (
                  <button
                    key={tattoo.id}
                    onClick={() => handleBodyClick(tattoo as Tattoo)}
                    onMouseEnter={() => setHoveredTattoo(tattoo.id)}
                    onMouseLeave={() => setHoveredTattoo(null)}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out"
                    style={{
                      left: `${tattoo.position.x}%`,
                      top: `${tattoo.position.y}%`,
                      zIndex: hoveredTattoo === tattoo.id || selectedTattoo?.id === tattoo.id ? 20 : 10
                    }}
                  >
                    <div
                      className={`rounded-full transition-all duration-300 flex items-center justify-center ${
                        selectedTattoo?.id === tattoo.id && detailLocation === 'body'
                          ? 'w-7 h-7'
                          : hoveredTattoo === tattoo.id
                          ? 'w-5 h-5'
                          : 'w-3 h-3'
                      }`}
                      style={{
                        backgroundColor: selectedTattoo?.id === tattoo.id && detailLocation === 'body'
                          ? '#D4ED39'
                          : hoveredTattoo === tattoo.id
                          ? '#FABF34'
                          : '#2A3C24',
                        boxShadow: selectedTattoo?.id === tattoo.id && detailLocation === 'body'
                          ? '0 0 0 3px #FFF5EB, 0 0 0 5px #D4ED39, 0 0 20px rgba(212,237,57,0.5)'
                          : hoveredTattoo === tattoo.id
                          ? '0 0 0 2px #FFF5EB, 0 0 15px rgba(250,191,52,0.7)'
                          : '0 2px 8px rgba(42,60,36,0.3)',
                        transform: hoveredTattoo === tattoo.id ? 'scale(1.2)' : 'scale(1)',
                      }}
                    />
                    {(hoveredTattoo === tattoo.id && !(selectedTattoo?.id === tattoo.id && detailLocation === 'body')) && (
                      <div
                        className="absolute left-1/2 -translate-x-1/2 -top-10 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs animate-fade-in"
                        style={{
                          backgroundColor: '#2A3C24',
                          color: '#FFF5EB',
                          boxShadow: '0 4px 12px rgba(42,60,36,0.3)'
                        }}
                      >
                        {tattoo.name}
                        <div
                          className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0"
                          style={{
                            borderLeft: '6px solid transparent',
                            borderRight: '6px solid transparent',
                            borderTop: '6px solid #2A3C24'
                          }}
                        />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Detail Panel */}
            <div className="md:col-span-7">
              {selectedTattoo && detailLocation === 'body' ? (
                <div
                  className="rounded-2xl p-8 animate-slide-in"
                  style={{
                    background: 'linear-gradient(135deg, #2A3C24 0%, #3d5235 100%)',
                    boxShadow: '0 20px 60px rgba(42,60,36,0.3)'
                  }}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-xs uppercase tracking-widest" style={{ color: '#D4ED39' }}>
                          {selectedTattoo.location.replace(/-/g, " ")}
                        </p>
                        {isColorTattoo(selectedTattoo.id) && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full animate-pulse" style={{ backgroundColor: '#FABF34', color: '#2A3C24' }}>
                            Color
                          </span>
                        )}
                      </div>
                      <h3
                        className="text-2xl md:text-3xl"
                        style={{
                          fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                          color: '#FFF5EB'
                        }}
                      >
                        {selectedTattoo.name}
                      </h3>
                    </div>
                    <button
                      onClick={() => { setSelectedTattoo(null); setDetailLocation(null); }}
                      className="text-sm px-4 py-2 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg"
                      style={{ backgroundColor: '#D4ED39', color: '#2A3C24' }}
                    >
                      Close
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3 mb-4">
                    <span className="text-sm" style={{ color: 'rgba(255,245,235,0.6)' }}>
                      {selectedTattoo.style}
                    </span>
                    {(selectedTattoo as Tattoo).date && (
                      <>
                        <span style={{ color: 'rgba(255,245,235,0.3)' }}>|</span>
                        <span className="text-sm" style={{ color: 'rgba(255,245,235,0.6)' }}>
                          {new Date((selectedTattoo as Tattoo).date!).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </span>
                      </>
                    )}
                    {(selectedTattoo as Tattoo).city && (
                      <>
                        <span style={{ color: 'rgba(255,245,235,0.3)' }}>|</span>
                        <span className="text-sm" style={{ color: 'rgba(255,245,235,0.6)' }}>
                          {(selectedTattoo as Tattoo).city}
                          {(selectedTattoo as Tattoo).shop && ` @ ${(selectedTattoo as Tattoo).shop}`}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="mb-6" style={{ color: 'rgba(255,245,235,0.9)' }}>
                    {selectedTattoo.description}
                  </p>
                  <div
                    className="rounded-xl p-5 transition-all duration-300 hover:shadow-lg"
                    style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                  >
                    <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#D4ED39' }}>
                      The meaning
                    </p>
                    <p className="leading-relaxed" style={{ color: 'rgba(255,245,235,0.85)' }}>
                      {selectedTattoo.meaning}
                    </p>
                  </div>
                  {(selectedTattoo as Tattoo).quote && (
                    <div
                      className="rounded-xl p-5 mt-4"
                      style={{ backgroundColor: 'rgba(212,237,57,0.1)' }}
                    >
                      <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#D4ED39' }}>
                        The full text
                      </p>
                      <blockquote
                        className="text-sm italic leading-relaxed"
                        style={{ color: 'rgba(255,245,235,0.8)' }}
                      >
                        &ldquo;{(selectedTattoo as Tattoo).quote}&rdquo;
                      </blockquote>
                      {(selectedTattoo as Tattoo).source && (
                        <p className="text-xs mt-4" style={{ color: 'rgba(255,245,235,0.5)' }}>
                          - {(selectedTattoo as Tattoo).source}
                        </p>
                      )}
                    </div>
                  )}
                  {/* HIMYM Quotes for Umbrella tattoo */}
                  {selectedTattoo.id === 'umbrella' && journal.himymQuotes && (
                    <div
                      className="rounded-xl p-5 mt-4"
                      style={{ backgroundColor: 'rgba(250,191,52,0.15)' }}
                    >
                      <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#FABF34' }}>
                        Favorite HIMYM Quotes
                      </p>
                      <div className="space-y-3">
                        {journal.himymQuotes.slice(0, 4).map((quote, i) => (
                          <blockquote
                            key={i}
                            className="text-sm italic leading-relaxed pl-3 border-l-2"
                            style={{
                              color: 'rgba(255,245,235,0.8)',
                              borderColor: '#FABF34'
                            }}
                          >
                            &ldquo;{quote}&rdquo;
                          </blockquote>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Line Art Render */}
                  {lineArtMap[selectedTattoo.id] && (
                    <div className="mt-6 flex justify-center">
                      <div
                        className="relative w-32 h-32 rounded-xl overflow-hidden transition-transform duration-300 hover:scale-110"
                        style={{ background: 'linear-gradient(160deg, #FFF5EB 0%, #EDE5D8 100%)' }}
                      >
                        <Image
                          src={`/images/tattoos/${lineArtMap[selectedTattoo.id]}`}
                          alt={`${selectedTattoo.name} line art`}
                          fill
                          className="object-contain p-3"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div
                    className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center transition-all duration-500 hover:scale-110 hover:shadow-lg"
                    style={{ backgroundColor: 'rgba(151,169,124,0.2)' }}
                  >
                    <svg className="w-8 h-8 animate-pulse" style={{ color: '#97A97C' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                  </div>
                  <p
                    className="text-xl mb-2"
                    style={{
                      fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                      color: '#2A3C24'
                    }}
                  >
                    Click a dot to explore
                  </p>
                  <p className="text-sm" style={{ color: 'rgba(42,60,36,0.6)' }}>
                    Each point on the silhouette represents a tattoo
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Line Art Gallery - Compact Grid */}
      <section className="py-12" style={{ backgroundColor: '#2A3C24' }}>
        <div className="container-editorial">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-xs uppercase tracking-widest" style={{ color: '#D4ED39' }}>
              The Collection
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(212,237,57,0.3)' }} />
            <span className="text-xs" style={{ color: 'rgba(255,245,235,0.4)' }}>
              {Object.keys(lineArtMap).length} designs
            </span>
          </div>

          {/* Gallery Grid with inline row details */}
          {galleryRows.map((row) => (
            <div key={row.rowIndex}>
              <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2 mb-2">
                {row.items.map((id) => {
                  const tattoo = tattoos.tattoos.find(t => t.id === id);
                  const globalIndex = galleryOrder.indexOf(id);
                  if (!tattoo || !lineArtMap[id]) return null;
                  const isSelected = selectedTattoo?.id === id && detailLocation === 'gallery';
                  const isHovered = hoveredTattoo === id;
                  const isColor = isColorTattoo(id);

                  return (
                    <button
                      key={id}
                      onClick={() => handleGalleryClick(tattoo as Tattoo, globalIndex)}
                      onMouseEnter={() => setHoveredTattoo(id)}
                      onMouseLeave={() => setHoveredTattoo(null)}
                      className="group relative aspect-square rounded-lg overflow-hidden transition-all duration-300"
                      style={{
                        backgroundColor: '#FFF5EB',
                        boxShadow: isSelected
                          ? '0 0 0 3px #D4ED39, 0 20px 50px rgba(212,237,57,0.4)'
                          : isHovered
                          ? '0 0 0 2px #FABF34, 0 15px 40px rgba(250,191,52,0.3)'
                          : '0 4px 12px rgba(0,0,0,0.2)',
                        transform: isSelected
                          ? 'scale(1.08)'
                          : isHovered
                          ? 'scale(1.05) translateY(-4px)'
                          : 'scale(1)',
                        zIndex: isSelected || isHovered ? 10 : 1,
                      }}
                    >
                      {/* Color indicator badge */}
                      {isColor && (
                        <div
                          className="absolute top-2 right-2 z-10 w-3 h-3 rounded-full animate-pulse"
                          style={{
                            backgroundColor: '#FABF34',
                            boxShadow: '0 0 8px rgba(250,191,52,0.6)'
                          }}
                        />
                      )}

                      <div
                        className="absolute inset-0 flex items-center justify-center p-2 transition-all duration-300"
                        style={{
                          transform: isHovered ? 'scale(1.1) rotate(2deg)' : 'scale(1)',
                        }}
                      >
                        <Image
                          src={`/images/tattoos/${lineArtMap[id]}`}
                          alt={tattoo.name}
                          width={80}
                          height={80}
                          className="object-contain w-full h-full"
                        />
                      </div>

                      {/* Hover overlay with name */}
                      <div
                        className="absolute inset-0 flex items-end justify-center pb-3 transition-all duration-300"
                        style={{
                          background: isHovered || isSelected
                            ? 'linear-gradient(to top, rgba(42,60,36,0.95) 0%, rgba(42,60,36,0.3) 50%, transparent 100%)'
                            : 'linear-gradient(to top, rgba(42,60,36,0.7) 0%, transparent 40%)',
                          opacity: isHovered || isSelected ? 1 : 0,
                        }}
                      >
                        <span
                          className="text-[10px] md:text-xs font-medium text-center px-2 transition-all duration-300"
                          style={{
                            color: '#FFF5EB',
                            transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
                            opacity: isHovered || isSelected ? 1 : 0,
                          }}
                        >
                          {tattoo.name}
                        </span>
                      </div>

                      {/* Selection indicator */}
                      {isSelected && (
                        <div
                          className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
                          style={{ backgroundColor: '#D4ED39' }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Inline detail panel for this row */}
              {selectedGalleryRow === row.rowIndex && selectedTattoo && detailLocation === 'gallery' && (
                <DetailPanel
                  tattoo={selectedTattoo}
                  onClose={() => {
                    setSelectedTattoo(null);
                    setDetailLocation(null);
                    setSelectedGalleryRow(null);
                  }}
                  variant="light"
                  isExpanded={true}
                />
              )}
            </div>
          ))}

          <p className="text-center text-xs mt-6" style={{ color: 'rgba(255,245,235,0.4)' }}>
            Click any design to see its story
          </p>
        </div>
      </section>

      {/* Colorful Timeline with Inline Details */}
      <section className="py-20" style={{ backgroundColor: '#FFF5EB' }}>
        <div className="container-editorial">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#97A97C' }}>
              Timeline
            </p>
            <h2 className="text-3xl md:text-4xl" style={{ fontFamily: 'var(--font-instrument)', color: '#2A3C24' }}>
              The journey so far
            </h2>
          </div>

          {/* Colorful Timeline with Jenn's palette */}
          <div className="relative max-w-5xl mx-auto">
            {/* Gradient connecting line */}
            <div
              className="absolute top-10 left-0 right-0 h-2 rounded-full hidden md:block"
              style={{
                background: 'linear-gradient(90deg, #FABF34 0%, #D4ED39 25%, #97A97C 50%, #FABF34 75%, #D4ED39 100%)',
                boxShadow: '0 2px 8px rgba(212,237,57,0.3)'
              }}
            />

            <div className="flex flex-col">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-4 md:gap-2 relative">
                {timelineData.map((period) => {
                  const isActive = selectedTimelineYear === period.year;
                  const isHovered = hoveredTimelineYear === period.year;
                  return (
                    <div key={period.year} className="flex flex-col items-center">
                      {/* Year circle */}
                      <button
                        onClick={() => handleTimelineClick(period.tattoos[0], period.year)}
                        onMouseEnter={() => setHoveredTimelineYear(period.year)}
                        onMouseLeave={() => setHoveredTimelineYear(null)}
                        className="relative z-10 transition-all duration-500 ease-out group"
                        style={{
                          width: isActive ? '5.5rem' : isHovered ? '5rem' : '4rem',
                          height: isActive ? '5.5rem' : isHovered ? '5rem' : '4rem',
                        }}
                      >
                        <div
                          className="w-full h-full rounded-full flex items-center justify-center transition-all duration-500"
                          style={{
                            backgroundColor: period.color,
                            boxShadow: isActive
                              ? `0 0 0 4px #FFF5EB, 0 0 0 7px ${period.color}, 0 10px 30px rgba(42,60,36,0.4), 0 0 40px ${period.color}40`
                              : isHovered
                              ? `0 0 0 3px #FFF5EB, 0 0 0 5px ${period.color}, 0 8px 25px rgba(42,60,36,0.3), 0 0 25px ${period.color}30`
                              : '0 4px 16px rgba(42,60,36,0.2)',
                            transform: isHovered && !isActive ? 'rotate(-5deg)' : 'rotate(0deg)',
                          }}
                        >
                          <span
                            className="text-base md:text-lg font-bold transition-all duration-300"
                            style={{
                              color: '#2A3C24',
                              transform: isActive ? 'scale(1.1)' : 'scale(1)',
                            }}
                          >
                            &apos;{period.year.slice(2)}
                          </span>
                        </div>

                        {/* Floating count badge */}
                        <div
                          className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300"
                          style={{
                            backgroundColor: '#2A3C24',
                            color: '#FFF5EB',
                            transform: isHovered || isActive ? 'scale(1.2)' : 'scale(1)',
                            opacity: isHovered || isActive ? 1 : 0.7,
                          }}
                        >
                          {period.tattoos.length}
                        </div>
                      </button>

                      {/* City */}
                      <p
                        className="text-xs mt-3 font-medium transition-all duration-300"
                        style={{
                          color: '#2A3C24',
                          transform: isHovered || isActive ? 'scale(1.05)' : 'scale(1)',
                        }}
                      >
                        {period.city}
                      </p>

                      {/* Tattoo pills */}
                      <div className="flex flex-col items-center gap-1.5 mt-3">
                        {period.tattoos.map((tattooId, idx) => (
                          <TimelinePill
                            key={tattooId}
                            tattooId={tattooId}
                            tattooName={tattoos.tattoos.find(t => t.id === tattooId)?.name || tattooId}
                            isSelected={selectedTattoo?.id === tattooId && detailLocation === 'timeline'}
                            isColor={isColorTattoo(tattooId)}
                            periodColor={period.color}
                            month={period.months[idx]}
                            onClick={() => handleTimelineClick(tattooId, period.year)}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Timeline inline detail panel */}
              {timelineData.map((period) => (
                selectedTimelineYear === period.year && selectedTattoo && detailLocation === 'timeline' && (
                  <div key={`detail-${period.year}`} className="mt-8 max-w-3xl mx-auto">
                    <DetailPanel
                      tattoo={selectedTattoo}
                      onClose={() => {
                        setSelectedTattoo(null);
                        setDetailLocation(null);
                        setSelectedTimelineYear(null);
                      }}
                      variant="dark"
                      isExpanded={true}
                    />
                  </div>
                )
              ))}
            </div>
          </div>

          <p className="text-center text-xs mt-10" style={{ color: 'rgba(42,60,36,0.4)' }}>
            Click any year or tattoo to explore
          </p>
        </div>
      </section>

      {/* Color Legend */}
      <section className="py-8" style={{ backgroundColor: 'rgba(151,169,124,0.1)' }}>
        <div className="container-editorial">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2 transition-all duration-300 hover:scale-105">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#2A3C24' }} />
              <span className="text-xs" style={{ color: '#2A3C24' }}>Black/Gray Ink</span>
            </div>
            <div className="flex items-center gap-2 transition-all duration-300 hover:scale-105">
              <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: '#FABF34' }} />
              <span className="text-xs" style={{ color: '#2A3C24' }}>Color Ink (Umbrella, Hummingbird)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Back Link */}
      <section className="py-12" style={{ backgroundColor: '#FFF5EB' }}>
        <div className="container-editorial">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm transition-all duration-300 hover:gap-4 group"
            style={{ color: '#2A3C24' }}
          >
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </Link>
        </div>
      </section>

      {/* Custom animations */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slide-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }

        .animate-slide-in {
          animation: slide-in 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
