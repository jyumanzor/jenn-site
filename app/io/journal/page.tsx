"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Types
type TopicCategory = "family" | "sister" | "mom" | "money" | "anxieties" | "relationships" | "boys" | "work" | "performance" | "habits" | "community" | "other";
type MoodLevel = 1 | 2 | 3 | 4 | 5;

interface TherapySession {
  id: string;
  date: string;
  topics: TopicCategory[];
  mood: MoodLevel;
  notes: string;
  insights: string;
  createdAt: string;
}

// Password gate
const DEFAULT_PASSWORD = "jenn2024";

// Topic colors
const topicColors: Record<TopicCategory, string> = {
  family: "bg-sage/30 text-deep-forest",
  sister: "bg-rose-100 text-rose-800",
  mom: "bg-amber-100 text-amber-800",
  money: "bg-emerald-100 text-emerald-800",
  anxieties: "bg-purple-100 text-purple-800",
  relationships: "bg-pink-100 text-pink-800",
  boys: "bg-blue-100 text-blue-800",
  work: "bg-deep-forest/20 text-deep-forest",
  performance: "bg-gold/30 text-deep-forest",
  habits: "bg-teal-100 text-teal-800",
  community: "bg-indigo-100 text-indigo-800",
  other: "bg-gray-100 text-gray-800"
};

const allTopics: TopicCategory[] = ["family", "sister", "mom", "money", "anxieties", "relationships", "boys", "work", "performance", "habits", "community", "other"];

// localStorage hook
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(error);
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

  return [storedValue, setValue];
}

export default function TherapyJournalPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [sessions, setSessions] = useLocalStorage<TherapySession[]>("therapy-sessions", []);
  const [showNewSession, setShowNewSession] = useState(false);
  const [selectedSession, setSelectedSession] = useState<TherapySession | null>(null);
  const [filterTopic, setFilterTopic] = useState<TopicCategory | "all">("all");

  // New session form
  const [newSession, setNewSession] = useState({
    topics: [] as TopicCategory[],
    mood: 3 as MoodLevel,
    notes: "",
    insights: ""
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === DEFAULT_PASSWORD) {
      setIsAuthenticated(true);
      setPassword("");
    }
  };

  const handleSaveSession = () => {
    const session: TherapySession = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      topics: newSession.topics,
      mood: newSession.mood,
      notes: newSession.notes,
      insights: newSession.insights,
      createdAt: new Date().toISOString()
    };
    setSessions((prev) => [session, ...prev]);
    setNewSession({ topics: [], mood: 3, notes: "", insights: "" });
    setShowNewSession(false);
  };

  const toggleTopic = (topic: TopicCategory) => {
    setNewSession((prev) => ({
      ...prev,
      topics: prev.topics.includes(topic)
        ? prev.topics.filter((t) => t !== topic)
        : [...prev.topics, topic]
    }));
  };

  const filteredSessions = filterTopic === "all"
    ? sessions
    : sessions.filter((s) => s.topics.includes(filterTopic));

  const moodEmojis = ["😔", "😕", "😐", "🙂", "😊"];

  // Password gate
  if (!isAuthenticated) {
    return (
      <div className="bg-cream min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sage/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-deep-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="light-bg-header text-2xl mb-2">Therapy Journal</h1>
            <p className="light-bg-body text-sm">Private space for session notes</p>
          </div>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-3 border border-sand rounded-lg mb-4 focus:outline-none focus:border-sage"
            />
            <button
              type="submit"
              className="w-full px-4 py-3 bg-deep-forest text-cream rounded-lg font-medium hover:bg-olive transition-colors"
            >
              Access Journal
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link href="/io" className="text-sm text-deep-forest/60 hover:text-deep-forest">
              ← Back to dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen">
      {/* Header */}
      <section className="pt-28 pb-8 md:pt-36 md:pb-12">
        <div className="container-editorial">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="light-bg-label mb-3">Private</p>
              <h1 className="light-bg-header text-3xl md:text-4xl mb-2">Therapy Journal</h1>
              <p className="light-bg-body">Track sessions, patterns, and insights</p>
            </div>
            <button
              onClick={() => setShowNewSession(true)}
              className="px-5 py-2.5 bg-deep-forest text-cream rounded-full font-medium hover:bg-olive transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Session
            </button>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Topic Filter */}
      <section className="py-4 bg-ivory">
        <div className="container-editorial">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <span className="light-bg-label text-xs shrink-0">Filter:</span>
            <button
              onClick={() => setFilterTopic("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${filterTopic === "all" ? "bg-deep-forest text-cream" : "bg-sand text-deep-forest"}`}
            >
              All
            </button>
            {allTopics.map((topic) => (
              <button
                key={topic}
                onClick={() => setFilterTopic(topic)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all capitalize shrink-0 ${filterTopic === topic ? "bg-deep-forest text-cream" : topicColors[topic]}`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Sessions List */}
      <section className="py-8">
        <div className="container-editorial">
          {filteredSessions.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sage/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-deep-forest/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="light-bg-header text-lg mb-2">No sessions yet</h3>
              <p className="light-bg-body text-sm">Start logging your therapy sessions</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredSessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => setSelectedSession(session)}
                  className="bg-white rounded-xl p-5 text-left hover:shadow-lg transition-shadow w-full"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <span className="light-bg-label text-xs">{new Date(session.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>
                    </div>
                    <span className="text-2xl">{moodEmojis[session.mood - 1]}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {session.topics.map((topic) => (
                      <span key={topic} className={`px-2 py-0.5 rounded-full text-xs capitalize ${topicColors[topic]}`}>
                        {topic}
                      </span>
                    ))}
                  </div>
                  <p className="light-bg-body text-sm line-clamp-2">{session.notes}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Back Link */}
      <section className="py-8 bg-ivory">
        <div className="container-editorial">
          <Link href="/io" className="link-editorial text-sm">← Back to dashboard</Link>
        </div>
      </section>

      {/* New Session Modal */}
      {showNewSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-deep-forest/80 backdrop-blur-sm" onClick={() => setShowNewSession(false)} />
          <div className="relative bg-cream rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <button onClick={() => setShowNewSession(false)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-deep-forest/10 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="p-6 md:p-8">
              <h2 className="light-bg-header text-2xl mb-6">New Session</h2>

              {/* Topics */}
              <div className="mb-6">
                <label className="light-bg-label text-sm mb-3 block">Topics Discussed</label>
                <div className="flex flex-wrap gap-2">
                  {allTopics.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => toggleTopic(topic)}
                      className={`px-3 py-1.5 rounded-full text-sm capitalize transition-all ${newSession.topics.includes(topic) ? "bg-deep-forest text-cream" : topicColors[topic]}`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mood */}
              <div className="mb-6">
                <label className="light-bg-label text-sm mb-3 block">Overall Mood</label>
                <div className="flex gap-4 justify-center">
                  {moodEmojis.map((emoji, idx) => (
                    <button
                      key={idx}
                      onClick={() => setNewSession((prev) => ({ ...prev, mood: (idx + 1) as MoodLevel }))}
                      className={`text-3xl p-2 rounded-full transition-all ${newSession.mood === idx + 1 ? "bg-gold/30 scale-125" : "opacity-50 hover:opacity-100"}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="light-bg-label text-sm mb-3 block">Session Notes</label>
                <textarea
                  value={newSession.notes}
                  onChange={(e) => setNewSession((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="What did you discuss? How did it feel?"
                  rows={4}
                  className="w-full px-4 py-3 border border-sand rounded-lg focus:outline-none focus:border-sage resize-none"
                />
              </div>

              {/* Insights */}
              <div className="mb-6">
                <label className="light-bg-label text-sm mb-3 block">Key Insights</label>
                <textarea
                  value={newSession.insights}
                  onChange={(e) => setNewSession((prev) => ({ ...prev, insights: e.target.value }))}
                  placeholder="Any breakthroughs, patterns noticed, or homework?"
                  rows={3}
                  className="w-full px-4 py-3 border border-sand rounded-lg focus:outline-none focus:border-sage resize-none"
                />
              </div>

              <button
                onClick={handleSaveSession}
                disabled={newSession.topics.length === 0}
                className="w-full px-5 py-3 bg-deep-forest text-cream rounded-lg font-medium hover:bg-olive transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Session Modal */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-deep-forest/80 backdrop-blur-sm" onClick={() => setSelectedSession(null)} />
          <div className="relative bg-cream rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <button onClick={() => setSelectedSession(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-deep-forest/10 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between mb-4">
                <span className="light-bg-label">{new Date(selectedSession.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>
                <span className="text-3xl">{moodEmojis[selectedSession.mood - 1]}</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedSession.topics.map((topic) => (
                  <span key={topic} className={`px-3 py-1 rounded-full text-sm capitalize ${topicColors[topic]}`}>
                    {topic}
                  </span>
                ))}
              </div>
              <div className="mb-6">
                <h4 className="light-bg-label text-sm mb-2">Notes</h4>
                <p className="light-bg-body whitespace-pre-wrap">{selectedSession.notes}</p>
              </div>
              {selectedSession.insights && (
                <div className="mb-6 bg-ivory rounded-lg p-4">
                  <h4 className="light-bg-label text-sm mb-2">Insights</h4>
                  <p className="light-bg-body whitespace-pre-wrap">{selectedSession.insights}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
