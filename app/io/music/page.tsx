"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import playlistsData from "@/data/playlists.json";

// Types
interface Track {
  title: string;
  artist: string;
  isHighlighted: boolean;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  vibe: string;
  isHighFrequency: boolean;
  tracks: Track[];
}

interface SongOfTheDay {
  song: string;
  date: string;
  playlist?: string;
}

interface SongScore {
  title: string;
  artist: string;
  fullName: string;
  score: number;
  playlistCount: number;
  playlists: string[];
  isHighlighted: boolean;
  isFromHighFrequencyPlaylist: boolean;
}

interface SearchSuggestion {
  title: string;
  artist: string;
  fullName: string;
  playlists: string[];
  isHighlighted: boolean;
}

// Get playlists from data file
const playlists: Playlist[] = playlistsData.playlists;

// Helper to format song name
function formatSongName(title: string, artist: string): string {
  return `${title} - ${artist}`;
}

// localStorage hook
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
      setIsLoaded(true);
    } catch (error) {
      console.error(error);
      setIsLoaded(true);
    }
  }, [key]);

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue, isLoaded];
}

// Custom hook for debouncing
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function MusicAdminPage() {
  const [songOfTheDay, setSongOfTheDay, isLoaded] = useLocalStorage<SongOfTheDay | null>("song-of-the-day", null);
  const [favorites, setFavorites, favoritesLoaded] = useLocalStorage<string[]>("music-favorites", []);
  const [newSong, setNewSong] = useState("");
  const [expandedPlaylist, setExpandedPlaylist] = useState<string | null>(null);
  const [showAllFeatured, setShowAllFeatured] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(newSong, 150);

  const today = new Date().toISOString().split("T")[0];
  const isTodaysSong = songOfTheDay?.date === today;

  // Build a searchable song index from all playlists
  const allSongs = useMemo((): SearchSuggestion[] => {
    const songMap = new Map<string, SearchSuggestion>();

    playlists.forEach((playlist) => {
      playlist.tracks.forEach((track) => {
        const fullName = formatSongName(track.title, track.artist);
        const key = fullName.toLowerCase();
        const existing = songMap.get(key);

        if (existing) {
          existing.playlists.push(playlist.name);
          if (track.isHighlighted) {
            existing.isHighlighted = true;
          }
        } else {
          songMap.set(key, {
            title: track.title,
            artist: track.artist,
            fullName,
            playlists: [playlist.name],
            isHighlighted: track.isHighlighted
          });
        }
      });
    });

    return Array.from(songMap.values());
  }, []);

  // Search suggestions with fuzzy matching
  const searchSuggestions = useMemo((): SearchSuggestion[] => {
    if (!debouncedSearch.trim() || debouncedSearch.length < 2) return [];

    const query = debouncedSearch.toLowerCase();
    const results = allSongs
      .filter((song) => {
        const titleMatch = song.title.toLowerCase().includes(query);
        const artistMatch = song.artist.toLowerCase().includes(query);
        const fullMatch = song.fullName.toLowerCase().includes(query);
        return titleMatch || artistMatch || fullMatch;
      })
      .sort((a, b) => {
        const aExact = a.title.toLowerCase().startsWith(query) ? 1 : 0;
        const bExact = b.title.toLowerCase().startsWith(query) ? 1 : 0;
        if (aExact !== bExact) return bExact - aExact;

        if (a.isHighlighted !== b.isHighlighted) {
          return a.isHighlighted ? -1 : 1;
        }
        return b.playlists.length - a.playlists.length;
      })
      .slice(0, 8);

    return results;
  }, [debouncedSearch, allSongs]);

  // Calculate song scores - prioritize highlighted songs from high frequency playlists
  const scoredSongs = useMemo((): SongScore[] => {
    const songMap = new Map<string, SongScore>();

    playlists.forEach((playlist) => {
      playlist.tracks.forEach((track) => {
        const fullName = formatSongName(track.title, track.artist);
        const key = fullName.toLowerCase();
        const existing = songMap.get(key);
        const isFav = favorites.includes(fullName);

        if (existing) {
          existing.playlistCount += 1;
          existing.playlists.push(playlist.name);
          existing.score += 20;
          if (playlist.isHighFrequency) {
            existing.isFromHighFrequencyPlaylist = true;
            existing.score += 15;
          }
          if (track.isHighlighted) {
            existing.isHighlighted = true;
          }
        } else {
          let score = 0;
          if (track.isHighlighted) score += 30;
          if (playlist.isHighFrequency) score += 25;
          if (isFav) score += 50;

          songMap.set(key, {
            title: track.title,
            artist: track.artist,
            fullName,
            score,
            playlistCount: 1,
            playlists: [playlist.name],
            isHighlighted: track.isHighlighted,
            isFromHighFrequencyPlaylist: playlist.isHighFrequency
          });
        }
      });
    });

    songMap.forEach((song) => {
      const isFav = favorites.includes(song.fullName);
      if (isFav && song.score < 50) {
        song.score += 50;
      }
    });

    return Array.from(songMap.values())
      .filter(song => song.isHighlighted || song.isFromHighFrequencyPlaylist || song.playlistCount > 1)
      .sort((a, b) => b.score - a.score);
  }, [favorites]);

  const featuredSongs = useMemo(() => {
    return scoredSongs.slice(0, showAllFeatured ? 24 : 8);
  }, [scoredSongs, showAllFeatured]);

  const toggleFavorite = (track: string) => {
    setFavorites((prev) => {
      if (prev.includes(track)) {
        return prev.filter((t) => t !== track);
      }
      return [...prev, track];
    });
  };

  const handleSaveSong = useCallback((songName?: string) => {
    const songToSave = songName || newSong.trim();
    if (songToSave) {
      const matchingSong = allSongs.find(
        s => s.fullName.toLowerCase() === songToSave.toLowerCase()
      );

      setSongOfTheDay({
        song: matchingSong ? matchingSong.fullName : songToSave,
        date: today,
        playlist: matchingSong?.playlists[0]
      });
      setNewSong("");
      setSearchFocused(false);
      setSelectedIndex(-1);
    }
  }, [newSong, allSongs, today, setSongOfTheDay]);

  const handleClearSong = () => {
    setSongOfTheDay(null);
  };

  const handleSelectSuggestion = (suggestion: SearchSuggestion) => {
    handleSaveSong(suggestion.fullName);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!searchSuggestions.length) {
      if (e.key === "Enter") {
        handleSaveSong();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < searchSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && searchSuggestions[selectedIndex]) {
          handleSelectSuggestion(searchSuggestions[selectedIndex]);
        } else {
          handleSaveSong();
        }
        break;
      case "Escape":
        setSearchFocused(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleRandomSong = () => {
    const highlightedSongs = allSongs.filter(s => s.isHighlighted);
    if (highlightedSongs.length > 0) {
      const randomIndex = Math.floor(Math.random() * highlightedSongs.length);
      const randomSong = highlightedSongs[randomIndex];
      handleSaveSong(randomSong.fullName);
    }
  };

  const togglePlaylist = (id: string) => {
    setExpandedPlaylist(expandedPlaylist === id ? null : id);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target as Node)
      ) {
        setSearchFocused(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isValidSong = useMemo(() => {
    if (!newSong.trim()) return null;
    const match = allSongs.find(
      s => s.fullName.toLowerCase() === newSong.toLowerCase().trim()
    );
    return match !== undefined;
  }, [newSong, allSongs]);

  if (!isLoaded || !favoritesLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FFF5EB" }}>
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full animate-pulse" style={{ background: "linear-gradient(135deg, #97A97C, #2A3C24)" }} />
          <p className="text-sm" style={{ color: "rgba(42,60,36,0.6)" }}>Loading your music...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFF5EB" }}>
      {/* Header */}
      <section className="pt-8 pb-12 md:pt-16 md:pb-16">
        <div className="container-editorial">
          <div className="max-w-2xl">
            <p className="light-bg-label mb-3">Admin</p>
            <h1 className="light-bg-header text-3xl md:text-4xl mb-4">Music Admin</h1>
            <p className="light-bg-body leading-relaxed">
              Search from {allSongs.length} songs across {playlists.length} curated playlists.
              Song of the Day pulls from your highlighted tracks.
            </p>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Song of the Day Section */}
      <section className="py-10">
        <div className="container-editorial">
          <div className="max-w-2xl">
            <h2 className="light-bg-header text-xl md:text-2xl mb-6">Song of the Day</h2>

            {/* Current Song Display */}
            {songOfTheDay && (
              <div className="relative overflow-hidden rounded-2xl mb-6" style={{ background: "linear-gradient(135deg, #2A3C24 0%, #97A97C 100%)" }}>
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}></div>
                </div>
                <div className="relative p-6 md:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #FABF34 0%, #D4ED39 100%)" }}>
                        <svg className="w-8 h-8" style={{ color: "#2A3C24" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs mb-1 uppercase tracking-wider font-medium" style={{ color: "rgba(255,245,235,0.7)" }}>
                          {isTodaysSong ? "Today's Pick" : `Set on ${new Date(songOfTheDay.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
                        </p>
                        <p className="text-xl md:text-2xl font-semibold" style={{ color: "#FFF5EB" }}>{songOfTheDay.song}</p>
                        {songOfTheDay.playlist && (
                          <p className="text-sm mt-1" style={{ color: "rgba(255,245,235,0.6)" }}>from {songOfTheDay.playlist}</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={handleClearSong}
                      className="p-2 rounded-full transition-colors"
                      style={{ color: "rgba(255,245,235,0.5)" }}
                      title="Clear song"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Spotify-style Search */}
            <div className="rounded-2xl p-6 md:p-8" style={{ backgroundColor: "white", border: "1px solid #E8E0D5" }}>
              <label className="light-bg-label text-sm mb-4 block">
                {songOfTheDay ? "Update Song of the Day" : "Set Song of the Day"}
              </label>

              <div className="relative">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5" style={{ color: "rgba(42,60,36,0.4)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={newSong}
                    onChange={(e) => {
                      setNewSong(e.target.value);
                      setSelectedIndex(-1);
                    }}
                    onFocus={() => setSearchFocused(true)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search for a song or artist..."
                    className="w-full pl-12 pr-28 py-4 rounded-full focus:outline-none transition-all"
                    style={{
                      backgroundColor: "#FAF5EF",
                      border: searchFocused ? "2px solid #97A97C" : "2px solid #E8E0D5",
                      color: "#2A3C24"
                    }}
                  />
                  <div className="absolute inset-y-0 right-2 flex items-center gap-2">
                    {isValidSong !== null && newSong.trim() && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{
                        backgroundColor: isValidSong ? "rgba(151,169,124,0.3)" : "rgba(250,191,52,0.2)",
                        color: "#2A3C24"
                      }}>
                        {isValidSong ? "Valid" : "Custom"}
                      </span>
                    )}
                    <button
                      onClick={() => handleSaveSong()}
                      disabled={!newSong.trim()}
                      className="px-5 py-2.5 rounded-full font-medium text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: newSong.trim() ? "#2A3C24" : "#97A97C",
                        color: "#FFF5EB"
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>

                {/* Search Suggestions Dropdown */}
                {searchFocused && searchSuggestions.length > 0 && (
                  <div
                    ref={suggestionsRef}
                    className="absolute z-50 w-full mt-2 rounded-xl shadow-2xl overflow-hidden"
                    style={{ backgroundColor: "white", border: "1px solid #E8E0D5" }}
                  >
                    <div className="p-2">
                      <p className="px-3 py-2 text-xs uppercase tracking-wider font-medium" style={{ color: "rgba(42,60,36,0.5)" }}>
                        Suggestions from your playlists
                      </p>
                      {searchSuggestions.map((suggestion, index) => (
                        <button
                          key={suggestion.fullName}
                          onClick={() => handleSelectSuggestion(suggestion)}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors"
                          style={{
                            backgroundColor: selectedIndex === index ? "rgba(151,169,124,0.2)" : "transparent"
                          }}
                        >
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{
                            background: suggestion.isHighlighted
                              ? "linear-gradient(135deg, #FABF34 0%, #D4ED39 100%)"
                              : "rgba(151,169,124,0.2)"
                          }}>
                            <svg className="w-5 h-5" style={{ color: "#2A3C24" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate" style={{ color: "#2A3C24" }}>{suggestion.title}</p>
                            <p className="text-sm truncate" style={{ color: "rgba(42,60,36,0.6)" }}>{suggestion.artist}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {suggestion.isHighlighted && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ backgroundColor: "rgba(250,191,52,0.2)", color: "#2A3C24" }}>
                                Peak Jenn
                              </span>
                            )}
                            {suggestion.playlists.length > 1 && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ backgroundColor: "rgba(151,169,124,0.2)", color: "#2A3C24" }}>
                                {suggestion.playlists.length} playlists
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-3 mt-5">
                <button
                  onClick={handleRandomSong}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all hover:scale-105"
                  style={{ backgroundColor: "#D4ED39", color: "#2A3C24" }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Random Pick
                </button>
                <span className="text-xs" style={{ color: "rgba(42,60,36,0.5)" }}>
                  Picks from {allSongs.filter(s => s.isHighlighted).length} highlighted songs
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Featured Songs Section */}
      <section className="py-10">
        <div className="container-editorial">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="light-bg-header text-xl md:text-2xl mb-2">Featured Songs</h2>
              <p className="light-bg-body text-sm">
                Highlighted tracks from Joy Aligned, I'm Hot, FJY26, and more. Songs that are very "Jenn."
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs" style={{ color: "rgba(42,60,36,0.6)" }}>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ backgroundColor: "rgba(250,191,52,0.2)" }}>
                <svg className="w-3.5 h-3.5" style={{ color: "#FABF34" }} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Favorite
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ backgroundColor: "rgba(212,237,57,0.2)" }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#D4ED39" }}></span>
                Highlighted
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {featuredSongs.map((song, index) => {
              const isFav = favorites.includes(song.fullName);
              return (
                <div
                  key={song.fullName}
                  className="relative group rounded-xl p-4 cursor-pointer"
                  style={{
                    background: isFav
                      ? "linear-gradient(135deg, rgba(250,191,52,0.2) 0%, rgba(212,237,57,0.15) 50%, rgba(151,169,124,0.1) 100%)"
                      : song.isHighlighted
                      ? "linear-gradient(135deg, rgba(212,237,57,0.2) 0%, rgba(151,169,124,0.1) 100%)"
                      : "white",
                    border: isFav ? "2px solid rgba(250,191,52,0.3)" : "1px solid #E8E0D5",
                    opacity: 0,
                    animation: `fadeInUp 0.4s ease-out ${index * 40}ms forwards`,
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(42, 60, 36, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  onClick={() => handleSaveSong(song.fullName)}
                >
                  <div
                    className="absolute -top-2 -left-2 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shadow-md"
                    style={{ backgroundColor: index < 3 ? "#FABF34" : "#2A3C24", color: index < 3 ? "#2A3C24" : "#FFF5EB" }}
                  >
                    {index + 1}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(song.fullName);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full transition-colors"
                    title={isFav ? "Remove from favorites" : "Add to favorites"}
                  >
                    <svg
                      className="w-5 h-5 transition-colors"
                      style={{ color: isFav ? "#FABF34" : "rgba(42,60,36,0.3)" }}
                      fill={isFav ? "currentColor" : "none"}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                  </button>

                  <div className="pr-8 pt-1">
                    <p className="font-medium text-sm mb-0.5 line-clamp-1" style={{ color: "#2A3C24" }}>{song.title}</p>
                    <p className="text-xs mb-2.5 line-clamp-1" style={{ color: "rgba(42,60,36,0.6)" }}>{song.artist}</p>

                    <div className="flex items-center gap-2 flex-wrap">
                      {song.isHighlighted && (
                        <span
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium"
                          style={{ backgroundColor: "rgba(212,237,57,0.3)", color: "#2A3C24" }}
                        >
                          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Peak Jenn
                        </span>
                      )}
                      {song.playlistCount > 1 && (
                        <span
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium"
                          style={{ backgroundColor: "rgba(151,169,124,0.2)", color: "#2A3C24" }}
                        >
                          {song.playlistCount} playlists
                        </span>
                      )}
                    </div>
                  </div>

                  {song.playlistCount > 1 && (
                    <div
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-lg"
                      style={{ backgroundColor: "#2A3C24", color: "#FFF5EB" }}
                    >
                      In: {song.playlists.join(", ")}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {scoredSongs.length > 8 && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowAllFeatured(!showAllFeatured)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm transition-colors"
                style={{ color: "#2A3C24" }}
              >
                {showAllFeatured ? "Show less" : `Show all ${Math.min(scoredSongs.length, 24)} top songs`}
                <svg
                  className={`w-4 h-4 transition-transform ${showAllFeatured ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}

          {/* Stats */}
          <div className="mt-8 p-5 rounded-xl" style={{ backgroundColor: "white", border: "1px solid #E8E0D5" }}>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-semibold" style={{ color: "#FABF34" }}>{favorites.length}</p>
                <p className="text-xs" style={{ color: "rgba(42,60,36,0.6)" }}>Favorites</p>
              </div>
              <div>
                <p className="text-2xl font-semibold" style={{ color: "#D4ED39" }}>
                  {allSongs.filter(s => s.isHighlighted).length}
                </p>
                <p className="text-xs" style={{ color: "rgba(42,60,36,0.6)" }}>Highlighted</p>
              </div>
              <div>
                <p className="text-2xl font-semibold" style={{ color: "#97A97C" }}>
                  {playlists.filter(p => p.isHighFrequency).length}
                </p>
                <p className="text-xs" style={{ color: "rgba(42,60,36,0.6)" }}>Core Playlists</p>
              </div>
              <div>
                <p className="text-2xl font-semibold" style={{ color: "#2A3C24" }}>
                  {allSongs.filter(s => s.playlists.length > 1).length}
                </p>
                <p className="text-xs" style={{ color: "rgba(42,60,36,0.6)" }}>Cross-Playlist</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Playlists Section */}
      <section className="py-10">
        <div className="container-editorial">
          <h2 className="light-bg-header text-xl md:text-2xl mb-6">Jenn's Playlists</h2>

          <div className="grid gap-4 md:grid-cols-2">
            {playlists.map((playlist, index) => (
              <div
                key={playlist.id}
                className="rounded-xl overflow-hidden"
                style={{
                  background: playlist.isHighFrequency
                    ? index % 2 === 0
                      ? "linear-gradient(135deg, rgba(151,169,124,0.3) 0%, rgba(212,237,57,0.15) 100%)"
                      : "linear-gradient(135deg, rgba(42,60,36,0.1) 0%, rgba(151,169,124,0.2) 100%)"
                    : "white",
                  border: "1px solid #E8E0D5",
                  opacity: 0,
                  animation: `fadeInUp 0.5s ease-out ${index * 60}ms forwards`,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(42, 60, 36, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <button
                  onClick={() => togglePlaylist(playlist.id)}
                  className="w-full p-5 text-left transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          background: playlist.isHighFrequency
                            ? "linear-gradient(135deg, #FABF34 0%, #D4ED39 100%)"
                            : "rgba(151,169,124,0.25)"
                        }}
                      >
                        <svg className="w-6 h-6" style={{ color: "#2A3C24" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg" style={{ color: "#2A3C24" }}>{playlist.name}</h3>
                          {playlist.isHighFrequency && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ backgroundColor: "rgba(212,237,57,0.5)", color: "#2A3C24" }}>
                              CORE
                            </span>
                          )}
                        </div>
                        <p className="text-sm mb-1" style={{ color: "rgba(42,60,36,0.7)" }}>{playlist.description}</p>
                        <p className="text-xs italic" style={{ color: "rgba(42,60,36,0.5)" }}>{playlist.vibe}</p>
                      </div>
                    </div>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-transform"
                      style={{
                        backgroundColor: "rgba(42,60,36,0.1)",
                        transform: expandedPlaylist === playlist.id ? "rotate(180deg)" : "rotate(0deg)"
                      }}
                    >
                      <svg className="w-4 h-4" style={{ color: "#2A3C24" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </button>

                {expandedPlaylist === playlist.id && (
                  <div className="px-5 pb-5">
                    <div className="rounded-lg p-4" style={{ backgroundColor: "rgba(255,255,255,0.6)" }}>
                      <p className="text-xs mb-3 uppercase tracking-wider font-medium" style={{ color: "rgba(42,60,36,0.5)" }}>
                        {playlist.tracks.length} tracks - {playlist.tracks.filter(t => t.isHighlighted).length} highlighted
                      </p>
                      <ul className="space-y-1">
                        {playlist.tracks.map((track, idx) => {
                          const fullName = formatSongName(track.title, track.artist);
                          const isFav = favorites.includes(fullName);
                          return (
                            <li
                              key={idx}
                              className="flex items-center gap-3 text-sm rounded-lg px-2 py-2.5 -mx-2 transition-colors cursor-pointer group/track"
                              style={{
                                backgroundColor: isFav ? "rgba(250,191,52,0.1)" : "transparent",
                                color: "#2A3C24"
                              }}
                              onClick={() => handleSaveSong(fullName)}
                            >
                              <span
                                className="w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0"
                                style={{
                                  backgroundColor: track.isHighlighted ? "rgba(212,237,57,0.5)" : "rgba(42,60,36,0.1)",
                                  color: "rgba(42,60,36,0.6)"
                                }}
                              >
                                {idx + 1}
                              </span>
                              <div className="flex-1 min-w-0">
                                <span className="font-medium">{track.title}</span>
                                <span style={{ color: "rgba(42,60,36,0.5)" }}> - {track.artist}</span>
                              </div>
                              {track.isHighlighted && (
                                <span className="shrink-0 w-4 h-4" style={{ color: "#D4ED39" }} title="Highlighted">
                                  <svg fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                </span>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(fullName);
                                }}
                                className="shrink-0 p-1 rounded-full transition-colors opacity-0 group-hover/track:opacity-100"
                                title={isFav ? "Remove from favorites" : "Add to favorites"}
                              >
                                <svg
                                  className="w-4 h-4 transition-colors"
                                  style={{ color: isFav ? "#FABF34" : "rgba(42,60,36,0.3)" }}
                                  fill={isFav ? "currentColor" : "none"}
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                  />
                                </svg>
                              </button>
                              <span
                                className="opacity-0 group-hover/track:opacity-100 text-xs px-2 py-1 rounded-full transition-opacity"
                                style={{ backgroundColor: "#2A3C24", color: "#FFF5EB" }}
                              >
                                Set SOTD
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Footer */}
      <section className="py-12">
        <div className="container-editorial">
          <Link href="/io" className="link-editorial text-sm">&larr; Back to dashboard</Link>
        </div>
      </section>
    </div>
  );
}
