"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import watching from "@/data/watching.json";

type Film = typeof watching.films[0];
type Book = typeof watching.books[0];
type Playlist = typeof watching.playlists[0];

export default function WatchingPage() {
  const [activeTab, setActiveTab] = useState<"films" | "books" | "music">("films");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedDirector, setSelectedDirector] = useState<string>("all");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [suggestion, setSuggestion] = useState("");
  const [suggestionSubmitted, setSuggestionSubmitted] = useState(false);

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
            <div className="space-y-12">
              {/* Group playlists by vibe */}
              {["Running", "Focus", "Mood", "Social"].map((vibe) => {
                const vibePlaylists = watching.playlists.filter((p: Playlist) => p.vibe === vibe);
                if (vibePlaylists.length === 0) return null;

                return (
                  <div key={vibe}>
                    <div className="flex items-center gap-3 mb-6">
                      <h3
                        className="text-2xl tracking-tight"
                        style={{
                          fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                          color: '#2a3c24'
                        }}
                      >
                        {vibe}
                      </h3>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: 'rgba(212,237,57,0.3)', color: '#2a3c24' }}
                      >
                        {vibePlaylists.length} playlists
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {vibePlaylists.map((playlist: Playlist) => {
                        const colorLower = playlist.color.toLowerCase();
                        const isDark = ['#2a3c24', '#3b412d', '#4e6041', '#546e40', '#677955'].includes(colorLower);
                        return (
                          <div
                            key={playlist.id}
                            className="rounded-xl p-5 transition-transform hover:scale-[1.02]"
                            style={{ backgroundColor: playlist.color }}
                          >
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <h4
                                className="text-lg tracking-tight"
                                style={{
                                  fontFamily: 'var(--font-instrument), Instrument Serif, Georgia, serif',
                                  color: isDark ? '#fff5eb' : '#2a3c24'
                                }}
                              >
                                {playlist.title}
                              </h4>
                              <span
                                className="text-[10px] px-2 py-0.5 rounded-full flex-shrink-0"
                                style={{
                                  backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(42,60,36,0.15)',
                                  color: isDark ? '#fff5eb' : '#2a3c24'
                                }}
                              >
                                {playlist.mood}
                              </span>
                            </div>
                            <p
                              className="text-sm leading-relaxed mb-3"
                              style={{ color: isDark ? 'rgba(255,245,235,0.8)' : 'rgba(42,60,36,0.7)' }}
                            >
                              {playlist.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span
                                className="text-xs"
                                style={{ color: isDark ? 'rgba(255,245,235,0.6)' : 'rgba(42,60,36,0.5)' }}
                              >
                                {playlist.trackCount} tracks
                              </span>
                              {playlist.appleMusicUrl && (
                                <a
                                  href={playlist.appleMusicUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs transition-opacity hover:opacity-70"
                                  style={{ color: isDark ? '#d4ed39' : '#546e40' }}
                                >
                                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M23.997 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.988c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.193.4-1.336.53-2.3 1.452-2.865 2.78-.192.448-.292.925-.363 1.408-.056.392-.088.785-.1 1.18 0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.815.154 1.624.497 2.373.65 1.42 1.738 2.353 3.234 2.801.42.127.856.187 1.293.228.555.053 1.11.06 1.667.06h11.03c.525 0 1.048-.034 1.57-.1.823-.106 1.597-.35 2.296-.81.84-.553 1.472-1.287 1.88-2.208.186-.42.293-.87.37-1.324.113-.675.138-1.358.137-2.04-.002-3.8 0-7.595-.003-11.393zm-6.423 3.99v5.712c0 .417-.058.827-.244 1.206-.29.59-.76.962-1.388 1.14-.35.1-.706.157-1.07.173-.95.042-1.785-.455-2.07-1.36-.296-.94.1-1.913 1.03-2.372.37-.182.77-.282 1.17-.348.37-.06.74-.1 1.11-.16.36-.06.52-.24.56-.6 0-.05.01-.11.01-.16V8.27c0-.25-.13-.4-.38-.34l-.02.01-4.74 1.13c-.06.01-.12.03-.19.05-.1.03-.2.1-.23.2-.03.07-.04.15-.04.23V14.05v2.57c0 .44-.06.87-.25 1.27-.3.64-.81 1.03-1.49 1.2-.34.08-.68.14-1.03.16-.94.05-1.76-.4-2.07-1.28-.34-1 .08-2.01 1.04-2.49.38-.19.8-.29 1.22-.36.38-.06.76-.11 1.14-.17.32-.05.49-.22.54-.54.01-.05.01-.1.01-.16V7.62c0-.31.1-.54.36-.71.13-.08.27-.14.41-.18 1.32-.36 2.64-.7 3.96-1.06l2.85-.77c.08-.02.16-.04.24-.05.33-.05.55.14.55.48v4.75z"/>
                                  </svg>
                                  <span>Listen</span>
                                </a>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              <p className="text-center text-sm" style={{ color: 'rgba(42,60,36,0.5)' }}>
                Add your Apple Music playlist URLs to enable listening links
              </p>
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
                onSubmit={(e) => {
                  e.preventDefault();
                  if (suggestion.trim()) {
                    setSuggestionSubmitted(true);
                    // In a real implementation, this would:
                    // 1. Search TMDB/Google Books/Apple Music API
                    // 2. Validate the result exists
                    // 3. Store the validated suggestion
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
