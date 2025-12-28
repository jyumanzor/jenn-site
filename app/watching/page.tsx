"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import watching from "@/data/watching.json";

type Film = typeof watching.films[0];
type Book = typeof watching.books[0];
type Playlist = typeof watching.playlists[0];
type Track = { artist: string; track: string; album: string; genre: string };

export default function WatchingPage() {
  const [activeTab, setActiveTab] = useState<"films" | "books" | "music">("films");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedDirector, setSelectedDirector] = useState<string>("all");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [suggestion, setSuggestion] = useState("");
  const [suggestionSubmitted, setSuggestionSubmitted] = useState(false);
  const [expandedPlaylist, setExpandedPlaylist] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredFilms = useMemo(() => {
    return watching.films.filter((f: Film) => {
      if (selectedStatus !== "all" && f.status !== selectedStatus) return false;
      if (selectedDirector !== "all" && f.director !== selectedDirector) return false;
      if (selectedGenre !== "all" && f.genre !== selectedGenre) return false;
      return true;
    });
  }, [selectedStatus, selectedDirector, selectedGenre]);

  const watchedCount = watching.films.filter((f: Film) => f.status === "watched").length;
  const wantToWatchCount = watching.films.filter((f: Film) => f.status === "want-to-watch").length;

  return (
    <div className="bg-cream min-h-screen">
      {/* Hero */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-20 relative overflow-hidden">
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
              <span style={{ color: '#d4ed39' }}>music.</span>
            </h1>
            <p
              className="text-lg md:text-xl leading-relaxed max-w-xl"
              style={{ color: 'rgba(42,60,36,0.7)' }}
            >
              What I watch, read, and listen to.
            </p>
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
              <div className="flex flex-wrap gap-2">
                {/* Status Filter */}
                <button
                  onClick={() => setSelectedStatus(selectedStatus === "watched" ? "all" : "watched")}
                  className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                    selectedStatus === "watched"
                      ? "bg-olive text-warm-beige"
                      : "bg-white text-dark-brown hover:bg-stone"
                  }`}
                >
                  Watched
                </button>
                <button
                  onClick={() => setSelectedStatus(selectedStatus === "want-to-watch" ? "all" : "want-to-watch")}
                  className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                    selectedStatus === "want-to-watch"
                      ? "bg-olive text-warm-beige"
                      : "bg-white text-dark-brown hover:bg-stone"
                  }`}
                >
                  Want to Watch
                </button>

                {/* Director Filter */}
                <select
                  value={selectedDirector}
                  onChange={(e) => setSelectedDirector(e.target.value)}
                  className="px-3 py-1.5 bg-white rounded-full text-xs border border-sand focus:outline-none focus:border-olive"
                >
                  <option value="all">All Directors</option>
                  {watching.filters.directors.map((d: string) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
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
                {filteredFilms.map((film: Film, index: number) => {
                  const isFavorite = film.rating === 5;
                  return (
                    <div
                      key={film.id}
                      className={`rounded-xl p-6 transition-all ${
                        isFavorite
                          ? "bg-ivory border-2 border-gold/30"
                          : "bg-white/80 border border-sand/50"
                      }`}
                    >
                      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                        {/* Rank */}
                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                            isFavorite ? "bg-gold text-deep-forest" : "bg-sage/20 text-deep-forest"
                          }`}>
                            {index + 1}
                          </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3
                                className="text-xl text-deep-forest tracking-tight"
                                style={{ fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif' }}
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
                                  className={`text-2xl ${isFavorite ? "text-gold" : "text-olive"}`}
                                  style={{ fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif' }}
                                >
                                  {film.rating}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mt-3">
                            <span className="px-2 py-0.5 bg-sage/20 rounded text-xs text-deep-forest">
                              {film.genre || film.country}
                            </span>
                            {film.status === "watched" ? (
                              <span className="px-2 py-0.5 bg-olive/20 rounded text-xs text-deep-forest font-medium">
                                Watched
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-sand rounded text-xs text-deep-forest/60">
                                Want to Watch
                              </span>
                            )}
                          </div>

                          {film.accolades && (
                            <p className="text-xs text-gold/80 mt-3">{film.accolades}</p>
                          )}

                          {film.notes && (
                            <p className="text-sm text-deep-forest/60 mt-3 leading-relaxed">
                              {film.notes}
                            </p>
                          )}

                          {film.themes && (
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {film.themes.map((theme: string) => (
                                <span
                                  key={theme}
                                  className="px-2 py-0.5 bg-sage/15 text-deep-forest/50 text-xs rounded"
                                >
                                  {theme}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "books" && (
            <div>
              {/* Group by category */}
              {watching.filters.bookCategories.map((category: string) => {
                const categoryBooks = watching.books.filter((b: Book) => b.category === category);
                if (categoryBooks.length === 0) return null;

                return (
                  <div key={category} className="mb-12">
                    <h2
                      className="text-2xl text-deep-forest mb-6 tracking-tight"
                      style={{ fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif' }}
                    >
                      {category}
                    </h2>
                    <div className="space-y-4">
                      {categoryBooks.map((book: Book, index: number) => (
                        <div
                          key={book.title}
                          className="bg-white/80 border border-sand/50 rounded-xl p-6"
                        >
                          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                            {/* Number */}
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center text-sm font-medium text-deep-forest">
                                {index + 1}
                              </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <h3
                                className="text-xl text-deep-forest tracking-tight"
                                style={{ fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif' }}
                              >
                                {book.title}
                              </h3>
                              <p className="text-[11px] uppercase tracking-wide text-deep-forest/40 mt-1">
                                {book.author}
                              </p>
                              {book.notes && (
                                <p className="text-sm text-deep-forest/60 mt-3 leading-relaxed">
                                  {book.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === "music" && (
            <div className="space-y-6">
              {/* Stats bar */}
              <div className="flex flex-wrap gap-3 mb-8">
                <span className="text-sm" style={{ color: 'rgba(42,60,36,0.6)' }}>
                  {watching.playlists.length} vibes · {watching.playlists.reduce((acc: number, p: Playlist) => acc + p.trackCount, 0).toLocaleString()} tracks
                </span>
              </div>

              {/* Vibe playlists */}
              <div className="space-y-4">
                {watching.playlists.map((playlist: Playlist) => {
                  const colorLower = playlist.color.toLowerCase();
                  const isDark = ['#2a3c24', '#3b412d', '#4e6041', '#546e40', '#677955'].includes(colorLower);
                  const isExpanded = expandedPlaylist === playlist.id;
                  const tracks = (playlist as Playlist & { tracks?: Track[] }).tracks || [];

                  return (
                    <div key={playlist.id} className="rounded-xl overflow-hidden">
                      {/* Header - clickable */}
                      <button
                        onClick={() => setExpandedPlaylist(isExpanded ? null : playlist.id)}
                        className="w-full text-left p-5 transition-all"
                        style={{ backgroundColor: playlist.color }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3
                                className="text-xl tracking-tight"
                                style={{
                                  fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                                  color: isDark ? '#fff5eb' : '#2a3c24'
                                }}
                              >
                                {playlist.title}
                              </h3>
                              <span
                                className="text-xs px-2 py-0.5 rounded-full"
                                style={{
                                  backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(42,60,36,0.15)',
                                  color: isDark ? '#fff5eb' : '#2a3c24'
                                }}
                              >
                                {playlist.trackCount} tracks
                              </span>
                            </div>
                            <p
                              className="text-sm leading-relaxed"
                              style={{ color: isDark ? 'rgba(255,245,235,0.8)' : 'rgba(42,60,36,0.7)' }}
                            >
                              {playlist.description}
                            </p>
                          </div>
                          <svg
                            className="w-5 h-5 flex-shrink-0 ml-4 transition-transform"
                            style={{
                              color: isDark ? '#fff5eb' : '#2a3c24',
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

                      {/* Expanded track list */}
                      {isExpanded && tracks.length > 0 && (
                        <div className="bg-white border-x border-b border-sand/30 max-h-96 overflow-y-auto">
                          <div className="divide-y divide-sand/20">
                            {tracks.slice(0, 100).map((track: Track, idx: number) => (
                              <div
                                key={`${track.artist}-${track.track}-${idx}`}
                                className="px-5 py-3 hover:bg-sand/10 transition-colors"
                              >
                                <div className="flex items-start gap-3">
                                  <span className="text-xs text-olive/40 w-6 flex-shrink-0 pt-0.5">
                                    {idx + 1}
                                  </span>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm text-deep-forest truncate">
                                      {track.track}
                                    </p>
                                    <p className="text-xs text-olive/60 truncate">
                                      {track.artist}
                                      {track.album && <span> · {track.album}</span>}
                                    </p>
                                  </div>
                                  {track.genre && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-sage/10 text-olive/50 flex-shrink-0">
                                      {track.genre}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                            {tracks.length > 100 && (
                              <div className="px-5 py-3 text-center text-xs text-olive/50">
                                + {tracks.length - 100} more tracks
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
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
