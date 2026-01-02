"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import watching from "@/data/culture.json";

// Animated number counter
function AnimatedNumber({ value, duration = 1000 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start: number | null = null;
          const step = (timestamp: number) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            setDisplayValue(Math.floor(progress * value));
            if (progress < 1) {
              requestAnimationFrame(step);
            }
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value, duration, hasAnimated]);

  return <span ref={ref}>{displayValue}</span>;
}

// Interactive film card with hover effects
function FilmCard({ film, index, isFavorite }: { film: Film; index: number; isFavorite: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`rounded-xl p-6 transition-all duration-300 cursor-pointer ${
        isFavorite
          ? "bg-ivory border-2 border-gold/30"
          : "bg-white/80 border border-sand/50"
      }`}
      style={{
        transform: isHovered ? 'translateY(-4px) scale(1.005)' : 'translateY(0) scale(1)',
        boxShadow: isHovered
          ? '0 20px 40px rgba(42, 60, 36, 0.12), 0 8px 16px rgba(42, 60, 36, 0.08)'
          : '0 2px 8px rgba(42, 60, 36, 0.04)',
        opacity: 0,
        animation: `fadeInUp 0.5s ease-out ${index * 50}ms forwards`
      }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Rank with animation */}
        <div className="flex-shrink-0">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
              isFavorite ? "bg-gold text-deep-forest" : "bg-sage/20 text-deep-forest"
            }`}
            style={{
              transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)',
              boxShadow: isHovered && isFavorite ? '0 4px 12px rgba(250, 191, 52, 0.4)' : 'none'
            }}
          >
            {index + 1}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3
                className="text-xl text-deep-forest tracking-tight transition-colors duration-300"
                style={{
                  fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                  color: isHovered ? '#546e40' : '#2a3c24'
                }}
              >
                {film.title}
              </h3>
              <p className="text-[11px] uppercase tracking-wide text-deep-forest/40 mt-1">
                {film.director} · {film.year}
              </p>
            </div>
            {film.rating && (
              <div className="text-right flex-shrink-0">
                <p
                  className={`text-2xl transition-all duration-300 ${isFavorite ? "text-gold" : "text-olive"}`}
                  style={{
                    fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                    textShadow: isHovered && isFavorite ? '0 0 20px rgba(250, 191, 52, 0.5)' : 'none'
                  }}
                >
                  {film.rating}
                </p>
              </div>
            )}
          </div>

          {/* Tags with staggered hover animation */}
          <div className="flex flex-wrap gap-2 mt-3">
            <span
              className="px-2.5 py-1 rounded text-xs font-medium transition-all duration-200"
              style={{
                backgroundColor: isHovered ? '#7f9168' : '#97a97c',
                color: '#2a3c24',
                transform: isHovered ? 'translateX(2px)' : 'translateX(0)'
              }}
            >
              {film.genre || film.country}
            </span>
            {film.status === "watched" ? (
              <span
                className="px-2.5 py-1 rounded text-xs font-medium transition-all duration-200"
                style={{
                  backgroundColor: isHovered ? '#1f2a1a' : '#2a3c24',
                  color: '#d4ed39',
                  transform: isHovered ? 'translateX(2px)' : 'translateX(0)',
                  transitionDelay: '50ms'
                }}
              >
                Watched
              </span>
            ) : (
              <span
                className="px-2.5 py-1 rounded text-xs font-medium transition-all duration-200"
                style={{
                  backgroundColor: isHovered ? '#b99d7d' : '#cbad8c',
                  color: '#2a3c24',
                  transform: isHovered ? 'translateX(2px)' : 'translateX(0)',
                  transitionDelay: '50ms'
                }}
              >
                Watchlist
              </span>
            )}
            {film.accolades?.toLowerCase().includes('oscar') && (
              <span
                className="px-2.5 py-1 rounded text-xs font-medium transition-all duration-200"
                style={{
                  backgroundColor: isHovered ? '#e8b85f' : '#ffcb69',
                  color: '#2a3c24',
                  transform: isHovered ? 'translateX(2px) scale(1.05)' : 'translateX(0) scale(1)',
                  transitionDelay: '100ms',
                  boxShadow: isHovered ? '0 2px 8px rgba(255, 203, 105, 0.4)' : 'none'
                }}
              >
                Oscar
              </span>
            )}
          </div>

          {film.accolades && (
            <p
              className="text-xs text-gold/80 mt-3 transition-all duration-300"
              style={{
                opacity: isHovered ? 1 : 0.8,
                transform: isHovered ? 'translateX(4px)' : 'translateX(0)'
              }}
            >
              {film.accolades}
            </p>
          )}

          {/* Expandable notes section */}
          <div
            className="overflow-hidden transition-all duration-400 ease-out"
            style={{
              maxHeight: isExpanded ? '200px' : film.notes ? '60px' : '0px',
              opacity: isExpanded ? 1 : 0.7
            }}
          >
            {film.notes && (
              <p className="text-sm text-deep-forest/60 mt-3 leading-relaxed">
                {film.notes}
              </p>
            )}

            {film.themes && isExpanded && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {film.themes.map((theme: string, idx: number) => (
                  <span
                    key={theme}
                    className="px-2 py-0.5 bg-sage/15 text-deep-forest/50 text-xs rounded transition-all duration-200"
                    style={{
                      opacity: 0,
                      animation: `fadeInUp 0.3s ease-out ${idx * 50}ms forwards`
                    }}
                  >
                    {theme}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Expand indicator */}
          {(film.notes || film.themes) && (
            <div
              className="mt-2 text-xs flex items-center gap-1 transition-all duration-200"
              style={{ color: isHovered ? '#546e40' : '#97a97c' }}
            >
              <svg
                className="w-3 h-3 transition-transform duration-300"
                style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              <span>{isExpanded ? 'Less' : 'More'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Interactive book card
function BookCard({ book, index, bookStyle }: { book: Book; index: number; bookStyle: { bg: string; border: string } }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="rounded-xl p-5 transition-all duration-300"
      style={{
        backgroundColor: bookStyle.bg,
        border: `1px solid ${bookStyle.border}40`,
        transform: isHovered ? 'translateY(-3px) scale(1.005)' : 'translateY(0) scale(1)',
        boxShadow: isHovered
          ? '0 16px 32px rgba(42, 60, 36, 0.1), 0 6px 12px rgba(42, 60, 36, 0.06)'
          : '0 2px 8px rgba(42, 60, 36, 0.02)',
        opacity: 0,
        animation: `fadeInUp 0.5s ease-out ${index * 80}ms forwards`
      }}
    >
      <div className="flex flex-col md:flex-row gap-4 md:gap-5">
        {/* Number */}
        <div className="flex-shrink-0">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300"
            style={{
              backgroundColor: '#97A97C30',
              color: '#3B412D',
              transform: isHovered ? 'scale(1.1) rotate(-5deg)' : 'scale(1) rotate(0deg)'
            }}
          >
            {index + 1}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3
            className="text-lg tracking-tight transition-colors duration-300"
            style={{
              fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
              color: isHovered ? '#546e40' : '#3B412D'
            }}
          >
            {book.title}
          </h3>
          <p
            className="text-[11px] uppercase tracking-wide mt-1 transition-all duration-300"
            style={{
              color: '#546E40',
              transform: isHovered ? 'translateX(4px)' : 'translateX(0)'
            }}
          >
            {book.author}
          </p>
          {book.notes && (
            <p
              className="text-sm mt-2 leading-relaxed transition-all duration-300"
              style={{
                color: 'rgba(59,65,45,0.65)',
                opacity: isHovered ? 1 : 0.85
              }}
            >
              {book.notes}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Interactive playlist card with smooth expand animation
function PlaylistCard({ playlist, isExpanded, onToggle }: { playlist: Playlist; isExpanded: boolean; onToggle: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const colorLower = playlist.color.toLowerCase();
  const isDark = ['#546e40', '#3c422e', '#3b412d'].includes(colorLower);
  const tracks = (playlist as Playlist & { tracks?: Track[] }).tracks || [];

  const gradientMap: Record<string, string> = {
    '#fff5eb': 'linear-gradient(135deg, #FFF5EB 0%, #F7E5DA 50%, #CBAD8C 100%)',
    '#faf1e8': 'linear-gradient(135deg, #FAF1E8 0%, #EFE4D6 50%, #E7D8C6 100%)',
    '#f7e5da': 'linear-gradient(135deg, #F7E5DA 0%, #EFE4D6 60%, #CBAD8C 100%)',
    '#efe4d6': 'linear-gradient(135deg, #EFE4D6 0%, #E7D8C6 50%, #CBAD8C 100%)',
    '#e7d8c6': 'linear-gradient(135deg, #E7D8C6 0%, #CBAD8C 60%, #97A97C 100%)',
    '#cbad8c': 'linear-gradient(135deg, #CBAD8C 0%, #97A97C 60%, #546E40 100%)',
    '#97a97c': 'linear-gradient(135deg, #97A97C 0%, #546E40 60%, #3C422E 100%)',
    '#546e40': 'linear-gradient(135deg, #546E40 0%, #3C422E 60%, #3B412D 100%)',
    '#3c422e': 'linear-gradient(135deg, #3C422E 0%, #3B412D 60%, #2a3c24 100%)',
    '#3b412d': 'linear-gradient(135deg, #3B412D 0%, #2a3c24 60%, #1f2a1a 100%)',
  };
  const bgStyle = gradientMap[colorLower] || `linear-gradient(135deg, ${playlist.color} 0%, ${playlist.color} 100%)`;

  const genreColors: Record<string, { bg: string; text: string }> = {
    'house': { bg: '#d4ed39', text: '#2a3c24' },
    'disco': { bg: '#ffcb69', text: '#2a3c24' },
    'electronic': { bg: '#c5a95b', text: '#2a3c24' },
    'techno': { bg: '#546e40', text: '#fff5eb' },
    'hip-hop': { bg: '#5a6c4b', text: '#fff5eb' },
    'rap': { bg: '#425438', text: '#fff5eb' },
    'r&b': { bg: '#73855f', text: '#fff5eb' },
    'soul': { bg: '#8b9d72', text: '#2a3c24' },
    'indie': { bg: '#97a97c', text: '#2a3c24' },
    'alternative': { bg: '#7f9168', text: '#fff5eb' },
    'rock': { bg: '#657043', text: '#fff5eb' },
    'pop': { bg: '#ffeac4', text: '#2a3c24' },
    'jazz': { bg: '#cbad8c', text: '#2a3c24' },
    'classical': { bg: '#f7e5da', text: '#2a3c24' },
    'ambient': { bg: '#ffe5b0', text: '#2a3c24' },
    'folk': { bg: '#b29e56', text: '#2a3c24' },
    'country': { bg: '#9f9251', text: '#2a3c24' },
    'latin': { bg: '#ecc064', text: '#2a3c24' },
    'reggaeton': { bg: '#fabf34', text: '#2a3c24' },
    'default': { bg: '#efe4d6', text: '#3b412d' }
  };

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-300"
      style={{
        boxShadow: isHovered
          ? '0 16px 40px rgba(42, 60, 36, 0.15), 0 6px 16px rgba(42, 60, 36, 0.08)'
          : '0 4px 12px rgba(42, 60, 36, 0.06)'
      }}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-full text-left p-5 transition-all duration-300"
        style={{
          background: bgStyle,
          transform: isHovered ? 'scale(1.005)' : 'scale(1)'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3
                className="text-xl tracking-tight transition-all duration-300"
                style={{
                  fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                  color: isDark ? '#fff5eb' : '#2a3c24',
                  textShadow: isHovered ? '0 2px 10px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                {playlist.title}
              </h3>
              <span
                className="text-xs px-2 py-0.5 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(42,60,36,0.15)',
                  color: isDark ? '#fff5eb' : '#2a3c24',
                  transform: isHovered ? 'scale(1.05)' : 'scale(1)'
                }}
              >
                {playlist.trackCount} tracks
              </span>
            </div>
            <p
              className="text-sm leading-relaxed transition-all duration-300"
              style={{
                color: isDark ? 'rgba(255,245,235,0.8)' : 'rgba(42,60,36,0.7)',
                transform: isHovered ? 'translateX(4px)' : 'translateX(0)'
              }}
            >
              {playlist.description}
            </p>
          </div>
          <svg
            className="w-5 h-5 flex-shrink-0 ml-4 transition-all duration-300"
            style={{
              color: isDark ? '#fff5eb' : '#2a3c24',
              transform: isExpanded ? 'rotate(180deg) scale(1.1)' : isHovered ? 'rotate(0deg) scale(1.1)' : 'rotate(0deg) scale(1)'
            }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expanded track list with smooth animation */}
      <div
        className="transition-all duration-400 ease-out overflow-hidden"
        style={{
          maxHeight: isExpanded ? '600px' : '0px',
          opacity: isExpanded ? 1 : 0
        }}
      >
        {tracks.length > 0 && (
          <div className="bg-white border-x border-b border-sand/30 overflow-y-auto" style={{ maxHeight: '580px' }}>
            <div className="divide-y divide-sand/20">
              {tracks.map((track: Track, idx: number) => {
                const genre = track.genre?.toLowerCase() || '';
                const genreColor = Object.entries(genreColors).find(([key]) =>
                  genre.includes(key)
                )?.[1] || genreColors.default;

                return (
                  <TrackRow
                    key={`${track.artist}-${track.track}-${idx}`}
                    track={track}
                    idx={idx}
                    genreColor={genreColor}
                    isVisible={isExpanded}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Individual track row with hover effects
function TrackRow({ track, idx, genreColor, isVisible }: { track: Track; idx: number; genreColor: { bg: string; text: string }; isVisible: boolean }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="px-5 py-2.5 transition-all duration-200"
      style={{
        backgroundColor: isHovered ? 'rgba(151, 169, 124, 0.08)' : 'transparent',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : 'translateX(-10px)',
        transitionDelay: `${Math.min(idx * 20, 200)}ms`
      }}
    >
      <div className="flex items-center gap-3">
        <span
          className="text-[10px] w-5 flex-shrink-0 text-right transition-all duration-200"
          style={{
            color: isHovered ? '#546e40' : 'rgba(84, 110, 64, 0.4)'
          }}
        >
          {idx + 1}
        </span>
        <div className="flex-1 min-w-0">
          <p
            className="text-sm truncate leading-tight transition-all duration-200"
            style={{
              color: isHovered ? '#2a3c24' : '#3b412d',
              transform: isHovered ? 'translateX(2px)' : 'translateX(0)'
            }}
          >
            {track.track}
          </p>
          <p className="text-[11px] text-olive/60 truncate">
            {track.artist}
          </p>
        </div>
        {track.genre && (
          <span
            className="text-[9px] px-1.5 py-0.5 rounded-full flex-shrink-0 font-medium transition-all duration-200"
            style={{
              backgroundColor: genreColor.bg,
              color: genreColor.text,
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              boxShadow: isHovered ? `0 2px 8px ${genreColor.bg}40` : 'none'
            }}
          >
            {track.genre}
          </span>
        )}
      </div>
    </div>
  );
}

type Film = typeof watching.films[0];
type Book = typeof watching.books[0];
type Playlist = typeof watching.playlists[0];
type Track = { artist: string; track: string; album: string; genre: string };

export default function WatchingPage() {
  const [activeTab, setActiveTab] = useState<"films" | "books" | "music">("films");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedDirector, setSelectedDirector] = useState<string>("all");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [oscarOnly, setOscarOnly] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [suggestionSubmitted, setSuggestionSubmitted] = useState(false);
  const [expandedPlaylist, setExpandedPlaylist] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMusicGenre, setSelectedMusicGenre] = useState<string>("all");

  // Build unique music genres from all tracks across playlists
  const allTracks = useMemo(() => {
    const tracks: (Track & { playlistTitle: string })[] = [];
    watching.playlists.forEach((playlist: Playlist) => {
      const playlistTracks = (playlist as Playlist & { tracks?: Track[] }).tracks || [];
      playlistTracks.forEach((track: Track) => {
        tracks.push({ ...track, playlistTitle: playlist.title });
      });
    });
    return tracks;
  }, []);

  const uniqueMusicGenres = useMemo(() => {
    const genres = new Set<string>();
    allTracks.forEach((track) => {
      if (track.genre) genres.add(track.genre);
    });
    return Array.from(genres).sort();
  }, [allTracks]);

  const filteredTracks = useMemo(() => {
    if (selectedMusicGenre === "all") return [];
    return allTracks.filter((track) =>
      track.genre?.toLowerCase() === selectedMusicGenre.toLowerCase()
    );
  }, [allTracks, selectedMusicGenre]);

  // Build unique genres and directors from actual data
  const uniqueGenres = useMemo(() => {
    const genres = new Set<string>();
    watching.films.forEach((f: Film) => {
      if (f.genre) genres.add(f.genre);
    });
    return Array.from(genres).sort();
  }, []);

  const uniqueDirectors = useMemo(() => {
    const directors = new Set<string>();
    watching.films.forEach((f: Film) => {
      if (f.director) directors.add(f.director);
    });
    return Array.from(directors).sort();
  }, []);

  const filteredFilms = useMemo(() => {
    return watching.films.filter((f: Film) => {
      if (selectedStatus !== "all" && f.status !== selectedStatus) return false;
      if (selectedDirector !== "all" && f.director !== selectedDirector) return false;
      if (selectedGenre !== "all" && f.genre !== selectedGenre) return false;
      if (oscarOnly && (!f.accolades || !f.accolades.toLowerCase().includes('oscar'))) return false;
      return true;
    });
  }, [selectedStatus, selectedDirector, selectedGenre, oscarOnly]);

  const watchedCount = watching.films.filter((f: Film) => f.status === "watched").length;
  const watchlistCount = watching.films.filter((f: Film) => f.status === "watchlist").length;

  return (
    <div className="bg-cream min-h-screen">
      {/* Hero */}
      <section className="pt-8 pb-16 md:pt-16 md:pb-20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(ellipse at 70% 20%, rgba(212,237,57,0.2) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(255,203,105,0.15) 0%, transparent 40%)'
          }}
        />
        <div className="container-editorial relative">
          <div className="max-w-3xl">
            <p
              className="text-xs uppercase tracking-widest mb-4"
              style={{ color: '#546e40' }}
            >
              Culture
            </p>
            <h1
              className="text-5xl md:text-6xl lg:text-7xl mb-6 tracking-tight leading-[0.9]"
              style={{
                fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                color: '#2a3c24'
              }}
            >
              Films, books &<br />
              <span style={{ color: '#ffcb69' }}>music.</span>
            </h1>
            <p
              className="text-lg md:text-xl leading-relaxed max-w-xl"
              style={{ color: 'rgba(42,60,36,0.7)' }}
            >
              What I watch, read, and listen to.
            </p>

            {/* Archive Links */}
            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                href="/culture/oscars"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all"
                style={{ backgroundColor: '#ffcb69', color: '#2a3c24' }}
              >
                <span>🏆</span>
                <span>Explore Oscar Nominees</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/culture/pulitzers"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all"
                style={{ backgroundColor: '#cbad8c', color: '#2a3c24' }}
              >
                <span>📚</span>
                <span>Explore Pulitzer Winners</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/culture/misc"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all"
                style={{ backgroundColor: '#97a97c', color: '#2a3c24' }}
              >
                <span>📊</span>
                <span>Explore Misc Archives</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-4 bg-sand sticky top-16 z-40">
        <div className="container-editorial">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("films")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === "films"
                    ? "bg-deep-forest text-warm-beige"
                    : "bg-white text-dark-brown hover:bg-stone"
                }`}
              >
                Films ({watching.films.length})
              </button>
              <button
                onClick={() => setActiveTab("books")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === "books"
                    ? "bg-deep-forest text-warm-beige"
                    : "bg-white text-dark-brown hover:bg-stone"
                }`}
              >
                Books ({watching.books.length})
              </button>
              <button
                onClick={() => setActiveTab("music")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === "music"
                    ? "bg-deep-forest text-warm-beige"
                    : "bg-white text-dark-brown hover:bg-stone"
                }`}
              >
                Music ({watching.playlists.length})
              </button>
            </div>

            {activeTab === "films" && (
              <div className="flex flex-wrap gap-2 items-center">
                {/* Status Filter */}
                <button
                  onClick={() => setSelectedStatus(selectedStatus === "watched" ? "all" : "watched")}
                  className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                    selectedStatus === "watched"
                      ? "bg-olive text-warm-beige"
                      : "bg-white text-dark-brown hover:bg-stone"
                  }`}
                >
                  Watched ({watchedCount})
                </button>
                <button
                  onClick={() => setSelectedStatus(selectedStatus === "watchlist" ? "all" : "watchlist")}
                  className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                    selectedStatus === "watchlist"
                      ? "bg-olive text-warm-beige"
                      : "bg-white text-dark-brown hover:bg-stone"
                  }`}
                >
                  Watchlist ({watchlistCount})
                </button>

                {/* Divider */}
                <span className="text-sand">|</span>

                {/* Oscar Filter */}
                <button
                  onClick={() => setOscarOnly(!oscarOnly)}
                  className={`px-3 py-1.5 rounded-full text-xs transition-colors flex items-center gap-1 ${
                    oscarOnly
                      ? "bg-gold text-deep-forest"
                      : "bg-white text-dark-brown hover:bg-stone"
                  }`}
                >
                  <span>🏆</span>
                  <span>Oscar</span>
                </button>

                {/* Genre Filter */}
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="px-3 py-1.5 bg-white rounded-full text-xs border border-sand focus:outline-none focus:border-olive"
                >
                  <option value="all">All Genres</option>
                  {uniqueGenres.map((g: string) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>

                {/* Director Filter */}
                <select
                  value={selectedDirector}
                  onChange={(e) => setSelectedDirector(e.target.value)}
                  className="px-3 py-1.5 bg-white rounded-full text-xs border border-sand focus:outline-none focus:border-olive"
                >
                  <option value="all">All Directors</option>
                  {uniqueDirectors.map((d: string) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>

                {/* Clear Filters */}
                {(selectedStatus !== "all" || selectedGenre !== "all" || selectedDirector !== "all" || oscarOnly) && (
                  <button
                    onClick={() => {
                      setSelectedStatus("all");
                      setSelectedGenre("all");
                      setSelectedDirector("all");
                      setOscarOnly(false);
                    }}
                    className="px-3 py-1.5 rounded-full text-xs text-olive hover:text-deep-forest transition-colors underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container-editorial">
          {activeTab === "films" && (
            <div>
              <p className="text-sm text-warm-gray mb-6">
                {filteredFilms.length} of {watching.films.length} films
              </p>

              <div className="space-y-4">
                {filteredFilms.map((film: Film, index: number) => (
                  <FilmCard
                    key={film.id}
                    film={film}
                    index={index}
                    isFavorite={film.rating === 5}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === "books" && (
            <div>
              {/* Group by category */}
              {watching.filters.bookCategories.map((category: string, catIndex: number) => {
                const categoryBooks = watching.books.filter((b: Book) => b.category === category);
                if (categoryBooks.length === 0) return null;

                // Category header gradients
                const categoryGradients = [
                  'linear-gradient(135deg, #3B412D 0%, #546E40 100%)',
                  'linear-gradient(135deg, #546E40 0%, #97A97C 100%)',
                  'linear-gradient(135deg, #97A97C 0%, #CBAD8C 100%)',
                  'linear-gradient(135deg, #CBAD8C 0%, #E7D8C6 100%)',
                ];

                // Alternate book card backgrounds for variety
                const bookBgs = [
                  { bg: '#FFF5EB', border: '#CBAD8C' },
                  { bg: '#FAF1E8', border: '#E7D8C6' },
                  { bg: '#F7E5DA', border: '#CBAD8C' },
                  { bg: '#EFE4D6', border: '#97A97C' },
                ];

                return (
                  <div key={category} className="mb-12">
                    <div
                      className="rounded-xl px-6 py-4 mb-6 transition-all duration-300 hover:shadow-lg cursor-default"
                      style={{
                        background: categoryGradients[catIndex % categoryGradients.length],
                        opacity: 0,
                        animation: `fadeInUp 0.6s ease-out ${catIndex * 100}ms forwards`
                      }}
                    >
                      <h2
                        className="text-2xl tracking-tight"
                        style={{
                          fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                          color: catIndex < 2 ? '#FFF5EB' : '#3B412D'
                        }}
                      >
                        {category}
                      </h2>
                    </div>
                    <div className="space-y-3">
                      {categoryBooks.map((book: Book, index: number) => (
                        <BookCard
                          key={book.title}
                          book={book}
                          index={index}
                          bookStyle={bookBgs[index % bookBgs.length]}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === "music" && (
            <div className="space-y-6">
              {/* Stats bar and Genre Filter */}
              <div className="flex flex-wrap gap-3 mb-8 items-center justify-between">
                <span className="text-sm" style={{ color: 'rgba(42,60,36,0.6)' }}>
                  {watching.playlists.length} vibes · {watching.playlists.reduce((acc: number, p: Playlist) => acc + p.trackCount, 0).toLocaleString()} tracks
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: 'rgba(42,60,36,0.5)' }}>Filter by genre:</span>
                  <select
                    value={selectedMusicGenre}
                    onChange={(e) => setSelectedMusicGenre(e.target.value)}
                    className="px-3 py-1.5 bg-white rounded-full text-xs border border-sand focus:outline-none focus:border-olive"
                  >
                    <option value="all">All Genres</option>
                    {uniqueMusicGenres.map((g: string) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                  {selectedMusicGenre !== "all" && (
                    <button
                      onClick={() => setSelectedMusicGenre("all")}
                      className="text-xs text-olive hover:text-deep-forest transition-colors underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Filtered Tracks View (when genre selected) */}
              {selectedMusicGenre !== "all" && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3
                      className="text-xl"
                      style={{
                        fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                        color: '#2a3c24'
                      }}
                    >
                      {selectedMusicGenre} tracks
                    </h3>
                    <span className="text-sm" style={{ color: 'rgba(42,60,36,0.6)' }}>
                      {filteredTracks.length} tracks found
                    </span>
                  </div>
                  <div className="bg-white rounded-xl border border-sand/30 overflow-hidden max-h-[500px] overflow-y-auto">
                    <div className="divide-y divide-sand/20">
                      {filteredTracks.map((track, idx) => {
                        const genreColors: Record<string, { bg: string; text: string }> = {
                          'house': { bg: '#d4ed39', text: '#2a3c24' },
                          'disco': { bg: '#ffcb69', text: '#2a3c24' },
                          'electronic': { bg: '#c5a95b', text: '#2a3c24' },
                          'techno': { bg: '#546e40', text: '#fff5eb' },
                          'hip-hop': { bg: '#5a6c4b', text: '#fff5eb' },
                          'rap': { bg: '#425438', text: '#fff5eb' },
                          'r&b': { bg: '#73855f', text: '#fff5eb' },
                          'soul': { bg: '#8b9d72', text: '#2a3c24' },
                          'indie': { bg: '#97a97c', text: '#2a3c24' },
                          'alternative': { bg: '#7f9168', text: '#fff5eb' },
                          'rock': { bg: '#657043', text: '#fff5eb' },
                          'pop': { bg: '#ffeac4', text: '#2a3c24' },
                          'jazz': { bg: '#cbad8c', text: '#2a3c24' },
                          'classical': { bg: '#f7e5da', text: '#2a3c24' },
                          'ambient': { bg: '#ffe5b0', text: '#2a3c24' },
                          'folk': { bg: '#b29e56', text: '#2a3c24' },
                          'country': { bg: '#9f9251', text: '#2a3c24' },
                          'latin': { bg: '#ecc064', text: '#2a3c24' },
                          'reggaeton': { bg: '#fabf34', text: '#2a3c24' },
                          'default': { bg: '#efe4d6', text: '#3b412d' }
                        };
                        const genre = track.genre?.toLowerCase() || '';
                        const genreColor = Object.entries(genreColors).find(([key]) =>
                          genre.includes(key)
                        )?.[1] || genreColors.default;

                        return (
                          <div
                            key={`filtered-${track.artist}-${track.track}-${idx}`}
                            className="px-5 py-3 hover:bg-sand/10 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] text-olive/40 w-5 flex-shrink-0 text-right">
                                {idx + 1}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-deep-forest truncate leading-tight">
                                  {track.track}
                                </p>
                                <p className="text-[11px] text-olive/60 truncate">
                                  {track.artist}
                                </p>
                              </div>
                              <span
                                className="text-[9px] px-2 py-0.5 rounded-full flex-shrink-0 font-medium"
                                style={{ backgroundColor: genreColor.bg, color: genreColor.text }}
                              >
                                {track.genre}
                              </span>
                              <span className="text-[9px] px-2 py-0.5 rounded-full bg-sand/30 text-olive/70 flex-shrink-0">
                                {track.playlistTitle}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Vibe playlists with enhanced animations */}
              <div className="space-y-4">
                {watching.playlists.map((playlist: Playlist, idx: number) => (
                  <div
                    key={playlist.id}
                    style={{
                      opacity: 0,
                      animation: `fadeInUp 0.5s ease-out ${idx * 60}ms forwards`
                    }}
                  >
                    <PlaylistCard
                      playlist={playlist}
                      isExpanded={expandedPlaylist === playlist.id}
                      onToggle={() => setExpandedPlaylist(expandedPlaylist === playlist.id ? null : playlist.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Suggestion Section */}
      <section className="py-12" style={{ backgroundColor: 'rgba(212,237,57,0.1)' }}>
        <div className="container-editorial">
          <div className="max-w-xl mx-auto text-center">
            <h3
              className="text-2xl mb-3"
              style={{
                fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                color: '#2a3c24'
              }}
            >
              Suggest a {activeTab === "films" ? "film" : activeTab === "books" ? "book" : "playlist"}
            </h3>
            <p className="text-sm mb-6" style={{ color: 'rgba(42,60,36,0.6)' }}>
              Recommendations welcome.
            </p>

            {!suggestionSubmitted ? (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (suggestion.trim() && !isSubmitting) {
                    setIsSubmitting(true);
                    try {
                      await fetch('/api/suggestions', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          type: activeTab,
                          suggestion: suggestion.trim(),
                          timestamp: new Date().toISOString()
                        })
                      });
                      setSuggestionSubmitted(true);
                    } catch (error) {
                      console.error('Failed to submit suggestion:', error);
                    } finally {
                      setIsSubmitting(false);
                    }
                  }
                }}
                className="flex gap-3"
              >
                <input
                  type="text"
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  placeholder={
                    activeTab === "films"
                      ? "Search for a film title..."
                      : activeTab === "books"
                      ? "Search for a book title..."
                      : "Search for a playlist or artist..."
                  }
                  className="flex-1 px-4 py-3 rounded-full border text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{
                    borderColor: 'rgba(42,60,36,0.2)',
                    backgroundColor: '#fff5eb'
                  }}
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-full text-sm font-medium transition-all"
                  style={{
                    backgroundColor: '#2a3c24',
                    color: '#d4ed39'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#d4ed39';
                    e.currentTarget.style.color = '#2a3c24';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#2a3c24';
                    e.currentTarget.style.color = '#d4ed39';
                  }}
                >
                  Suggest
                </button>
              </form>
            ) : (
              <div
                className="rounded-xl p-6"
                style={{ backgroundColor: 'rgba(42,60,36,0.1)' }}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <svg className="w-5 h-5" style={{ color: '#546e40' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-medium" style={{ color: '#2a3c24' }}>Thanks for the suggestion!</span>
                </div>
                <p className="text-sm" style={{ color: 'rgba(42,60,36,0.6)' }}>
                  I&apos;ll check out &ldquo;{suggestion}&rdquo; and maybe add it to my list.
                </p>
                <button
                  onClick={() => {
                    setSuggestion("");
                    setSuggestionSubmitted(false);
                  }}
                  className="text-sm mt-4 underline"
                  style={{ color: '#546e40' }}
                >
                  Suggest another
                </button>
              </div>
            )}

            <p className="text-xs mt-4" style={{ color: 'rgba(42,60,36,0.4)' }}>
              Suggestions are validated against {activeTab === "films" ? "TMDB" : activeTab === "books" ? "Google Books" : "Apple Music"} to keep things clean.
            </p>
          </div>
        </div>
      </section>

      {/* Back Link */}
      <section className="py-12">
        <div className="container-editorial">
          <Link href="/" className="link-editorial text-sm">
            ← Back to home
          </Link>
        </div>
      </section>
    </div>
  );
}
