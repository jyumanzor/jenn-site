"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import IOAuthGate from "@/components/IOAuthGate";

// ============================================
// TYPES
// ============================================

type RelationshipCategory = "personal" | "work" | "consultants";

interface Person {
  name: string;
  category: RelationshipCategory;
  patterns: string[];
  notes: string;
  lastInteraction: string;
  connectionStrength: 1 | 2 | 3 | 4 | 5;
  tailoredAdvice: string;
}

interface JournalEntry {
  id: string;
  date: string;
  prompt: string;
  response: string;
  emotions: string[];
  createdAt: string;
}

interface TherapistQuestion {
  id: string;
  question: string;
  context: string;
  answered: boolean;
  createdAt: string;
}

type EmotionIntensity = 1 | 2 | 3 | 4 | 5;

interface EmotionLog {
  id: string;
  date: string;
  emotions: { name: string; intensity: EmotionIntensity }[];
  triggers: string;
  bodyLocation: string;
  createdAt: string;
}

// ============================================
// CONSTANTS
// ============================================

const initialPeople: Person[] = [
  // Personal
  { name: "Max", category: "personal", patterns: [], notes: "", lastInteraction: "", connectionStrength: 3, tailoredAdvice: "" },
  { name: "Sam", category: "personal", patterns: [], notes: "", lastInteraction: "", connectionStrength: 3, tailoredAdvice: "" },
  { name: "Scott", category: "personal", patterns: [], notes: "", lastInteraction: "", connectionStrength: 3, tailoredAdvice: "" },
  // Work
  { name: "Matt", category: "work", patterns: [], notes: "", lastInteraction: "", connectionStrength: 3, tailoredAdvice: "" },
  { name: "Cameron", category: "work", patterns: [], notes: "", lastInteraction: "", connectionStrength: 3, tailoredAdvice: "" },
  { name: "David", category: "work", patterns: [], notes: "", lastInteraction: "", connectionStrength: 3, tailoredAdvice: "" },
  // Consultants
  { name: "Tess", category: "consultants", patterns: [], notes: "", lastInteraction: "", connectionStrength: 3, tailoredAdvice: "" },
  { name: "Inbar", category: "consultants", patterns: [], notes: "", lastInteraction: "", connectionStrength: 3, tailoredAdvice: "" },
  { name: "Alli", category: "consultants", patterns: [], notes: "", lastInteraction: "", connectionStrength: 3, tailoredAdvice: "" },
  { name: "Kristen", category: "consultants", patterns: [], notes: "", lastInteraction: "", connectionStrength: 3, tailoredAdvice: "" },
  { name: "Kavya", category: "consultants", patterns: [], notes: "", lastInteraction: "", connectionStrength: 3, tailoredAdvice: "" },
  { name: "Selvin", category: "consultants", patterns: [], notes: "", lastInteraction: "", connectionStrength: 3, tailoredAdvice: "" },
  { name: "Randy", category: "consultants", patterns: [], notes: "", lastInteraction: "", connectionStrength: 3, tailoredAdvice: "" },
];

const cbtPrompts = [
  { category: "Thought Challenging", prompts: [
    "What evidence supports this thought? What evidence contradicts it?",
    "Am I confusing a thought with a fact?",
    "What would I tell a friend who had this thought?",
    "Is this thought helpful? Does it serve me?",
    "What's the worst that could happen? How likely is it?",
  ]},
  { category: "Cognitive Distortions", prompts: [
    "Am I catastrophizing or imagining the worst-case scenario?",
    "Am I thinking in all-or-nothing terms?",
    "Am I mind-reading or assuming I know what others think?",
    "Am I discounting the positive things in this situation?",
    "Am I 'should-ing' myself?",
  ]},
  { category: "Behavioral Activation", prompts: [
    "What small action could I take right now to improve my mood?",
    "What activity used to bring me joy that I've stopped doing?",
    "Who could I reach out to for connection?",
    "What's one thing I'm avoiding that would help if I faced it?",
    "How can I break this task into smaller, manageable steps?",
  ]},
  { category: "Self-Compassion", prompts: [
    "What would I say to a dear friend in this situation?",
    "How can I acknowledge my suffering without judgment?",
    "What do I need right now to feel supported?",
    "What are three things I appreciate about myself today?",
    "How can I treat myself with kindness in this moment?",
  ]},
];

const emotionWheel = [
  { core: "Joy", variations: ["Happy", "Content", "Grateful", "Hopeful", "Playful", "Proud"] },
  { core: "Sadness", variations: ["Lonely", "Disappointed", "Grief", "Hopeless", "Empty", "Melancholic"] },
  { core: "Anger", variations: ["Frustrated", "Irritated", "Resentful", "Defensive", "Bitter", "Annoyed"] },
  { core: "Fear", variations: ["Anxious", "Worried", "Insecure", "Overwhelmed", "Panicked", "Nervous"] },
  { core: "Surprise", variations: ["Amazed", "Confused", "Startled", "Curious", "Shocked", "Intrigued"] },
  { core: "Disgust", variations: ["Disappointed", "Judgmental", "Embarrassed", "Uncomfortable", "Aversion", "Revulsion"] },
  { core: "Love", variations: ["Affectionate", "Tender", "Connected", "Caring", "Trusting", "Warm"] },
  { core: "Peace", variations: ["Calm", "Relaxed", "Centered", "Grounded", "Serene", "Present"] },
];

const categoryColors: Record<RelationshipCategory, { bg: string; text: string; border: string }> = {
  personal: { bg: "bg-[#FFF5EB]", text: "text-[#2A3C24]", border: "border-[#FABF34]" },
  work: { bg: "bg-[#97A97C]/10", text: "text-[#2A3C24]", border: "border-[#97A97C]" },
  consultants: { bg: "bg-[#2A3C24]/5", text: "text-[#2A3C24]", border: "border-[#2A3C24]" },
};

// ============================================
// HOOKS
// ============================================

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

// ============================================
// COMPONENTS
// ============================================

// Connection strength visualization
function ConnectionStrengthDots({ strength, onChange }: { strength: number; onChange?: (n: number) => void }) {
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => onChange?.(n)}
          disabled={!onChange}
          className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
            n <= strength
              ? "bg-[#FABF34]"
              : "bg-[#2A3C24]/10"
          } ${onChange ? "hover:scale-125 cursor-pointer" : ""}`}
          aria-label={`Connection strength ${n}`}
        />
      ))}
    </div>
  );
}

// Emotion intensity bar
function EmotionIntensityBar({ intensity, emotion }: { intensity: number; emotion: string }) {
  const colors: Record<string, string> = {
    Joy: "#FABF34",
    Sadness: "#97A97C",
    Anger: "#B4654A",
    Fear: "#2A3C24",
    Surprise: "#D4A853",
    Disgust: "#546E40",
    Love: "#F7E5DA",
    Peace: "#97A97C",
  };
  const color = colors[emotion] || "#97A97C";

  return (
    <div className="h-1.5 bg-[#2A3C24]/10 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500 ease-out"
        style={{ width: `${intensity * 20}%`, backgroundColor: color }}
      />
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function JournalPage() {
  // State
  const [activeTab, setActiveTab] = useState<"relationships" | "journal" | "therapist" | "emotions">("relationships");
  const [people, setPeople] = useLocalStorage<Person[]>("journal-people", initialPeople);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [journalEntries, setJournalEntries] = useLocalStorage<JournalEntry[]>("journal-entries", []);
  const [therapistQuestions, setTherapistQuestions] = useLocalStorage<TherapistQuestion[]>("therapist-questions", []);
  const [emotionLogs, setEmotionLogs] = useLocalStorage<EmotionLog[]>("emotion-logs", []);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [showNewQuestion, setShowNewQuestion] = useState(false);
  const [showEmotionLog, setShowEmotionLog] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // New entry form state
  const [newEntry, setNewEntry] = useState({ prompt: "", response: "", emotions: [] as string[] });
  const [newQuestion, setNewQuestion] = useState({ question: "", context: "" });
  const [newEmotionLog, setNewEmotionLog] = useState<{ emotions: { name: string; intensity: EmotionIntensity }[]; triggers: string; bodyLocation: string }>({
    emotions: [],
    triggers: "",
    bodyLocation: "",
  });

  // Pattern input for person
  const [newPattern, setNewPattern] = useState("");

  // Handlers
  const handleSavePerson = (updatedPerson: Person) => {
    setPeople((prev) => prev.map((p) => p.name === updatedPerson.name ? updatedPerson : p));
    setSelectedPerson(updatedPerson);
  };

  const handleAddPattern = () => {
    if (selectedPerson && newPattern.trim()) {
      const updated = { ...selectedPerson, patterns: [...selectedPerson.patterns, newPattern.trim()] };
      handleSavePerson(updated);
      setNewPattern("");
    }
  };

  const handleRemovePattern = (index: number) => {
    if (selectedPerson) {
      const updated = { ...selectedPerson, patterns: selectedPerson.patterns.filter((_, i) => i !== index) };
      handleSavePerson(updated);
    }
  };

  const handleSaveEntry = () => {
    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      prompt: newEntry.prompt || selectedPrompt,
      response: newEntry.response,
      emotions: newEntry.emotions,
      createdAt: new Date().toISOString(),
    };
    setJournalEntries((prev) => [entry, ...prev]);
    setNewEntry({ prompt: "", response: "", emotions: [] });
    setSelectedPrompt("");
    setShowNewEntry(false);
  };

  const handleSaveQuestion = () => {
    const question: TherapistQuestion = {
      id: Date.now().toString(),
      question: newQuestion.question,
      context: newQuestion.context,
      answered: false,
      createdAt: new Date().toISOString(),
    };
    setTherapistQuestions((prev) => [question, ...prev]);
    setNewQuestion({ question: "", context: "" });
    setShowNewQuestion(false);
  };

  const handleSaveEmotionLog = () => {
    const log: EmotionLog = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      emotions: newEmotionLog.emotions,
      triggers: newEmotionLog.triggers,
      bodyLocation: newEmotionLog.bodyLocation,
      createdAt: new Date().toISOString(),
    };
    setEmotionLogs((prev) => [log, ...prev]);
    setNewEmotionLog({ emotions: [], triggers: "", bodyLocation: "" });
    setShowEmotionLog(false);
  };

  const toggleEmotion = (emotion: string) => {
    setNewEmotionLog((prev) => {
      const exists = prev.emotions.find((e) => e.name === emotion);
      if (exists) {
        return { ...prev, emotions: prev.emotions.filter((e) => e.name !== emotion) };
      }
      return { ...prev, emotions: [...prev.emotions, { name: emotion, intensity: 3 as EmotionIntensity }] };
    });
  };

  const updateEmotionIntensity = (emotion: string, intensity: EmotionIntensity) => {
    setNewEmotionLog((prev) => ({
      ...prev,
      emotions: prev.emotions.map((e) => e.name === emotion ? { ...e, intensity } : e),
    }));
  };

  const toggleJournalEmotion = (emotion: string) => {
    setNewEntry((prev) => ({
      ...prev,
      emotions: prev.emotions.includes(emotion)
        ? prev.emotions.filter((e) => e !== emotion)
        : [...prev.emotions, emotion],
    }));
  };

  // Group people by category
  const groupedPeople = {
    personal: people.filter((p) => p.category === "personal"),
    work: people.filter((p) => p.category === "work"),
    consultants: people.filter((p) => p.category === "consultants"),
  };

  return (
    <IOAuthGate
      password="jenn.uwu"
      authKey="jenn-journal-auth"
      title="Therapy Journal"
      subtitle="Private reflection space"
    >
    <div className="min-h-screen bg-[#FFF5EB]">
      {/* Subtle texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Header */}
      <header className="relative pt-8 pb-12 md:pt-16 md:pb-16">
        <div className="container-editorial">
          <div className="max-w-3xl">
            <p className="text-[#2A3C24]/50 text-xs font-medium tracking-[0.2em] uppercase mb-4">
              Private Space
            </p>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl text-[#2A3C24] mb-4"
              style={{ fontFamily: "var(--font-instrument), 'Instrument Serif', Georgia, serif" }}
            >
              Journal
            </h1>
            <p className="text-[#2A3C24]/70 text-lg md:text-xl leading-relaxed max-w-xl" style={{ fontFamily: "var(--font-cabinet), system-ui, sans-serif" }}>
              A warm corner for reflection, patterns, and gentle self-discovery.
            </p>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="sticky top-20 z-40 bg-[#FFF5EB]/95 backdrop-blur-sm border-y border-[#2A3C24]/10">
        <div className="container-editorial">
          <div className="flex gap-1 py-3 overflow-x-auto">
            {[
              { id: "relationships", label: "Relationships", icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              )},
              { id: "journal", label: "CBT Journal", icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              )},
              { id: "therapist", label: "For Therapy", icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )},
              { id: "emotions", label: "Emotions", icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )},
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-[#2A3C24] text-[#FFF5EB]"
                    : "text-[#2A3C24]/70 hover:bg-[#2A3C24]/5"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-12 relative">
        <div className="container-editorial">

          {/* ========== RELATIONSHIPS TAB ========== */}
          {activeTab === "relationships" && (
            <div className="grid lg:grid-cols-[1fr,400px] gap-8">
              {/* People List */}
              <div className="space-y-8">
                {(["personal", "work", "consultants"] as RelationshipCategory[]).map((category) => (
                  <section key={category}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-3 h-3 rounded-full ${
                        category === "personal" ? "bg-[#FABF34]" :
                        category === "work" ? "bg-[#97A97C]" : "bg-[#2A3C24]"
                      }`} />
                      <h2
                        className="text-lg text-[#2A3C24] capitalize"
                        style={{ fontFamily: "var(--font-instrument), 'Instrument Serif', Georgia, serif" }}
                      >
                        {category}
                      </h2>
                      <span className="text-xs text-[#2A3C24]/40">
                        {groupedPeople[category].length} people
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {groupedPeople[category].map((person) => (
                        <button
                          key={person.name}
                          onClick={() => setSelectedPerson(person)}
                          className={`group text-left p-4 rounded-xl border transition-all duration-300 ${
                            selectedPerson?.name === person.name
                              ? `${categoryColors[category].bg} ${categoryColors[category].border} border-2`
                              : "bg-white/50 border-transparent hover:bg-white hover:shadow-sm"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <span
                              className="text-[#2A3C24] font-medium"
                              style={{ fontFamily: "var(--font-cabinet), system-ui, sans-serif" }}
                            >
                              {person.name}
                            </span>
                            <ConnectionStrengthDots strength={person.connectionStrength} />
                          </div>
                          {person.patterns.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {person.patterns.slice(0, 2).map((pattern, i) => (
                                <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-[#2A3C24]/5 text-[#2A3C24]/60">
                                  {pattern}
                                </span>
                              ))}
                              {person.patterns.length > 2 && (
                                <span className="text-xs px-2 py-0.5 text-[#2A3C24]/40">
                                  +{person.patterns.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                          {person.lastInteraction && (
                            <p className="text-xs text-[#2A3C24]/40 mt-2">
                              Last: {new Date(person.lastInteraction).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </p>
                          )}
                        </button>
                      ))}
                    </div>
                  </section>
                ))}
              </div>

              {/* Person Detail Panel */}
              <aside className="lg:sticky lg:top-36 lg:self-start">
                {selectedPerson ? (
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#2A3C24]/5">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <p className="text-xs text-[#2A3C24]/50 uppercase tracking-wider mb-1">
                          {selectedPerson.category}
                        </p>
                        <h3
                          className="text-2xl text-[#2A3C24]"
                          style={{ fontFamily: "var(--font-instrument), 'Instrument Serif', Georgia, serif" }}
                        >
                          {selectedPerson.name}
                        </h3>
                      </div>
                      <button
                        onClick={() => setSelectedPerson(null)}
                        className="p-2 rounded-full hover:bg-[#2A3C24]/5 transition-colors"
                      >
                        <svg className="w-5 h-5 text-[#2A3C24]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Connection Strength */}
                    <div className="mb-6">
                      <label className="text-xs text-[#2A3C24]/50 uppercase tracking-wider block mb-2">
                        Connection Strength
                      </label>
                      <ConnectionStrengthDots
                        strength={selectedPerson.connectionStrength}
                        onChange={(n) => handleSavePerson({ ...selectedPerson, connectionStrength: n as 1|2|3|4|5 })}
                      />
                    </div>

                    {/* Last Interaction */}
                    <div className="mb-6">
                      <label className="text-xs text-[#2A3C24]/50 uppercase tracking-wider block mb-2">
                        Last Interaction
                      </label>
                      <input
                        type="date"
                        value={selectedPerson.lastInteraction}
                        onChange={(e) => handleSavePerson({ ...selectedPerson, lastInteraction: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-[#2A3C24]/10 rounded-lg focus:outline-none focus:border-[#97A97C] bg-transparent"
                      />
                    </div>

                    {/* Patterns */}
                    <div className="mb-6">
                      <label className="text-xs text-[#2A3C24]/50 uppercase tracking-wider block mb-2">
                        Patterns Noticed
                      </label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {selectedPerson.patterns.map((pattern, i) => (
                          <span
                            key={i}
                            className="group flex items-center gap-1.5 text-sm px-3 py-1 rounded-full bg-[#FABF34]/20 text-[#2A3C24]"
                          >
                            {pattern}
                            <button
                              onClick={() => handleRemovePattern(i)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newPattern}
                          onChange={(e) => setNewPattern(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleAddPattern()}
                          placeholder="Add a pattern..."
                          className="flex-1 px-3 py-2 text-sm border border-[#2A3C24]/10 rounded-lg focus:outline-none focus:border-[#97A97C] bg-transparent"
                        />
                        <button
                          onClick={handleAddPattern}
                          disabled={!newPattern.trim()}
                          className="px-3 py-2 bg-[#2A3C24] text-[#FFF5EB] rounded-lg text-sm disabled:opacity-30"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="mb-6">
                      <label className="text-xs text-[#2A3C24]/50 uppercase tracking-wider block mb-2">
                        Notes
                      </label>
                      <textarea
                        value={selectedPerson.notes}
                        onChange={(e) => handleSavePerson({ ...selectedPerson, notes: e.target.value })}
                        placeholder="General observations, context, history..."
                        rows={3}
                        className="w-full px-3 py-2 text-sm border border-[#2A3C24]/10 rounded-lg focus:outline-none focus:border-[#97A97C] bg-transparent resize-none"
                      />
                    </div>

                    {/* Tailored Advice */}
                    <div className="p-4 rounded-xl bg-[#97A97C]/10 border border-[#97A97C]/20">
                      <label className="text-xs text-[#2A3C24]/50 uppercase tracking-wider block mb-2">
                        Tailored Responses / Advice
                      </label>
                      <textarea
                        value={selectedPerson.tailoredAdvice}
                        onChange={(e) => handleSavePerson({ ...selectedPerson, tailoredAdvice: e.target.value })}
                        placeholder="How to best communicate, what works, what to avoid..."
                        rows={3}
                        className="w-full px-3 py-2 text-sm border border-[#97A97C]/30 rounded-lg focus:outline-none focus:border-[#97A97C] bg-white/50 resize-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/50 rounded-2xl p-8 text-center border border-dashed border-[#2A3C24]/10">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#97A97C]/10 flex items-center justify-center">
                      <svg className="w-8 h-8 text-[#97A97C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <p className="text-[#2A3C24]/60 text-sm">
                      Select a person to view and edit their details
                    </p>
                  </div>
                )}
              </aside>
            </div>
          )}

          {/* ========== CBT JOURNAL TAB ========== */}
          {activeTab === "journal" && (
            <div className="max-w-4xl mx-auto">
              {/* New Entry Button */}
              <div className="flex justify-end mb-8">
                <button
                  onClick={() => setShowNewEntry(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#2A3C24] text-[#FFF5EB] rounded-full font-medium hover:bg-[#2A3C24]/90 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Entry
                </button>
              </div>

              {/* CBT Prompt Categories */}
              <div className="mb-12">
                <h2
                  className="text-2xl text-[#2A3C24] mb-6"
                  style={{ fontFamily: "var(--font-instrument), 'Instrument Serif', Georgia, serif" }}
                >
                  CBT Prompts
                </h2>
                <div className="space-y-3">
                  {cbtPrompts.map((category) => (
                    <div key={category.category} className="bg-white rounded-xl overflow-hidden border border-[#2A3C24]/5">
                      <button
                        onClick={() => setExpandedCategory(expandedCategory === category.category ? null : category.category)}
                        className="w-full flex items-center justify-between p-4 hover:bg-[#FFF5EB]/50 transition-colors"
                      >
                        <span className="font-medium text-[#2A3C24]">{category.category}</span>
                        <svg
                          className={`w-5 h-5 text-[#2A3C24]/40 transition-transform duration-300 ${expandedCategory === category.category ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${expandedCategory === category.category ? "max-h-96" : "max-h-0"}`}>
                        <div className="p-4 pt-0 space-y-2">
                          {category.prompts.map((prompt, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                setSelectedPrompt(prompt);
                                setShowNewEntry(true);
                              }}
                              className="w-full text-left p-3 rounded-lg bg-[#FFF5EB]/50 hover:bg-[#97A97C]/10 transition-colors text-sm text-[#2A3C24]/80 group"
                            >
                              <span className="group-hover:text-[#2A3C24]">{prompt}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Past Entries */}
              <div>
                <h2
                  className="text-2xl text-[#2A3C24] mb-6"
                  style={{ fontFamily: "var(--font-instrument), 'Instrument Serif', Georgia, serif" }}
                >
                  Past Entries
                </h2>
                {journalEntries.length === 0 ? (
                  <div className="text-center py-16 bg-white/50 rounded-2xl border border-dashed border-[#2A3C24]/10">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FABF34]/10 flex items-center justify-center">
                      <svg className="w-8 h-8 text-[#FABF34]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <p className="text-[#2A3C24]/60">No entries yet. Start journaling to see your reflections here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {journalEntries.map((entry) => (
                      <article key={entry.id} className="bg-white rounded-xl p-5 border border-[#2A3C24]/5">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <p className="text-xs text-[#2A3C24]/50 uppercase tracking-wider">
                            {new Date(entry.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {entry.emotions.map((emotion) => (
                              <span key={emotion} className="text-xs px-2 py-0.5 rounded-full bg-[#97A97C]/10 text-[#2A3C24]/70">
                                {emotion}
                              </span>
                            ))}
                          </div>
                        </div>
                        {entry.prompt && (
                          <p className="text-sm text-[#2A3C24]/60 italic mb-3 pl-3 border-l-2 border-[#FABF34]">
                            {entry.prompt}
                          </p>
                        )}
                        <p className="text-[#2A3C24] whitespace-pre-wrap">{entry.response}</p>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========== THERAPIST QUESTIONS TAB ========== */}
          {activeTab === "therapist" && (
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <p className="text-[#2A3C24]/60">
                  Questions to bring up in your next session
                </p>
                <button
                  onClick={() => setShowNewQuestion(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#2A3C24] text-[#FFF5EB] rounded-full font-medium hover:bg-[#2A3C24]/90 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Question
                </button>
              </div>

              {therapistQuestions.length === 0 ? (
                <div className="text-center py-16 bg-white/50 rounded-2xl border border-dashed border-[#2A3C24]/10">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#97A97C]/10 flex items-center justify-center">
                    <svg className="w-8 h-8 text-[#97A97C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-[#2A3C24]/60">No questions logged yet.</p>
                  <p className="text-[#2A3C24]/40 text-sm mt-1">Add questions as they come up between sessions.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {therapistQuestions.map((q) => (
                    <div
                      key={q.id}
                      className={`bg-white rounded-xl p-5 border transition-all ${q.answered ? "border-[#97A97C]/30 opacity-60" : "border-[#2A3C24]/5"}`}
                    >
                      <div className="flex items-start gap-4">
                        <button
                          onClick={() => {
                            setTherapistQuestions((prev) =>
                              prev.map((item) => item.id === q.id ? { ...item, answered: !item.answered } : item)
                            );
                          }}
                          className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            q.answered
                              ? "bg-[#97A97C] border-[#97A97C]"
                              : "border-[#2A3C24]/20 hover:border-[#97A97C]"
                          }`}
                        >
                          {q.answered && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                        <div className="flex-1">
                          <p className={`text-[#2A3C24] font-medium ${q.answered ? "line-through" : ""}`}>
                            {q.question}
                          </p>
                          {q.context && (
                            <p className="text-sm text-[#2A3C24]/60 mt-2">{q.context}</p>
                          )}
                          <p className="text-xs text-[#2A3C24]/40 mt-2">
                            Added {new Date(q.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setTherapistQuestions((prev) => prev.filter((item) => item.id !== q.id));
                          }}
                          className="p-2 rounded-full hover:bg-[#2A3C24]/5 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <svg className="w-4 h-4 text-[#2A3C24]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========== EMOTIONS TAB ========== */}
          {activeTab === "emotions" && (
            <div className="max-w-4xl mx-auto">
              {/* New Log Button */}
              <div className="flex justify-end mb-8">
                <button
                  onClick={() => setShowEmotionLog(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#2A3C24] text-[#FFF5EB] rounded-full font-medium hover:bg-[#2A3C24]/90 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Log Emotions
                </button>
              </div>

              {/* Emotion Wheel Reference */}
              <div className="mb-12 p-6 bg-white rounded-2xl border border-[#2A3C24]/5">
                <h2
                  className="text-xl text-[#2A3C24] mb-6"
                  style={{ fontFamily: "var(--font-instrument), 'Instrument Serif', Georgia, serif" }}
                >
                  Emotion Wheel
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {emotionWheel.map((group) => (
                    <div key={group.core} className="space-y-2">
                      <h3 className="font-medium text-[#2A3C24] text-sm">{group.core}</h3>
                      <div className="flex flex-wrap gap-1">
                        {group.variations.map((v) => (
                          <span key={v} className="text-xs px-2 py-1 rounded-full bg-[#FFF5EB] text-[#2A3C24]/70">
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Past Emotion Logs */}
              <div>
                <h2
                  className="text-2xl text-[#2A3C24] mb-6"
                  style={{ fontFamily: "var(--font-instrument), 'Instrument Serif', Georgia, serif" }}
                >
                  Emotion History
                </h2>
                {emotionLogs.length === 0 ? (
                  <div className="text-center py-16 bg-white/50 rounded-2xl border border-dashed border-[#2A3C24]/10">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FABF34]/10 flex items-center justify-center">
                      <svg className="w-8 h-8 text-[#FABF34]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <p className="text-[#2A3C24]/60">No emotion logs yet.</p>
                    <p className="text-[#2A3C24]/40 text-sm mt-1">Start tracking to notice patterns over time.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {emotionLogs.map((log) => (
                      <article key={log.id} className="bg-white rounded-xl p-5 border border-[#2A3C24]/5">
                        <p className="text-xs text-[#2A3C24]/50 uppercase tracking-wider mb-4">
                          {new Date(log.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                        </p>
                        <div className="space-y-3 mb-4">
                          {log.emotions.map((e) => (
                            <div key={e.name} className="flex items-center gap-3">
                              <span className="text-sm text-[#2A3C24] w-24">{e.name}</span>
                              <div className="flex-1">
                                <EmotionIntensityBar intensity={e.intensity} emotion={e.name.split(" ")[0]} />
                              </div>
                              <span className="text-xs text-[#2A3C24]/40 w-8 text-right">{e.intensity}/5</span>
                            </div>
                          ))}
                        </div>
                        {log.triggers && (
                          <div className="mb-3">
                            <span className="text-xs text-[#2A3C24]/50 uppercase tracking-wider">Triggers: </span>
                            <span className="text-sm text-[#2A3C24]/70">{log.triggers}</span>
                          </div>
                        )}
                        {log.bodyLocation && (
                          <div>
                            <span className="text-xs text-[#2A3C24]/50 uppercase tracking-wider">Body: </span>
                            <span className="text-sm text-[#2A3C24]/70">{log.bodyLocation}</span>
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Back Link */}
      <section className="py-8 border-t border-[#2A3C24]/10">
        <div className="container-editorial">
          <Link href="/io" className="text-sm text-[#2A3C24]/60 hover:text-[#2A3C24] transition-colors">
            ← Back to dashboard
          </Link>
        </div>
      </section>

      {/* ========== MODALS ========== */}

      {/* New Journal Entry Modal */}
      {showNewEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#2A3C24]/60 backdrop-blur-sm" onClick={() => { setShowNewEntry(false); setSelectedPrompt(""); }} />
          <div className="relative bg-[#FFF5EB] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => { setShowNewEntry(false); setSelectedPrompt(""); }}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#2A3C24]/10 flex items-center justify-center hover:bg-[#2A3C24]/20 transition-colors"
            >
              <svg className="w-5 h-5 text-[#2A3C24]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="p-6 md:p-8">
              <h2
                className="text-2xl text-[#2A3C24] mb-6"
                style={{ fontFamily: "var(--font-instrument), 'Instrument Serif', Georgia, serif" }}
              >
                New Journal Entry
              </h2>

              {/* Prompt */}
              {selectedPrompt ? (
                <div className="mb-6 p-4 rounded-xl bg-[#FABF34]/10 border border-[#FABF34]/20">
                  <p className="text-xs text-[#2A3C24]/50 uppercase tracking-wider mb-2">Prompt</p>
                  <p className="text-[#2A3C24] italic">{selectedPrompt}</p>
                </div>
              ) : (
                <div className="mb-6">
                  <label className="text-xs text-[#2A3C24]/50 uppercase tracking-wider block mb-2">
                    Custom Prompt (optional)
                  </label>
                  <input
                    type="text"
                    value={newEntry.prompt}
                    onChange={(e) => setNewEntry((prev) => ({ ...prev, prompt: e.target.value }))}
                    placeholder="What are you reflecting on?"
                    className="w-full px-4 py-3 border border-[#2A3C24]/10 rounded-lg focus:outline-none focus:border-[#97A97C] bg-white"
                  />
                </div>
              )}

              {/* Emotions */}
              <div className="mb-6">
                <label className="text-xs text-[#2A3C24]/50 uppercase tracking-wider block mb-2">
                  How are you feeling?
                </label>
                <div className="flex flex-wrap gap-2">
                  {emotionWheel.flatMap((g) => [g.core, ...g.variations.slice(0, 2)]).map((emotion) => (
                    <button
                      key={emotion}
                      onClick={() => toggleJournalEmotion(emotion)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        newEntry.emotions.includes(emotion)
                          ? "bg-[#2A3C24] text-[#FFF5EB]"
                          : "bg-white text-[#2A3C24]/70 hover:bg-[#97A97C]/10"
                      }`}
                    >
                      {emotion}
                    </button>
                  ))}
                </div>
              </div>

              {/* Response */}
              <div className="mb-6">
                <label className="text-xs text-[#2A3C24]/50 uppercase tracking-wider block mb-2">
                  Your Reflection
                </label>
                <textarea
                  value={newEntry.response}
                  onChange={(e) => setNewEntry((prev) => ({ ...prev, response: e.target.value }))}
                  placeholder="Write freely..."
                  rows={8}
                  className="w-full px-4 py-3 border border-[#2A3C24]/10 rounded-lg focus:outline-none focus:border-[#97A97C] bg-white resize-none"
                  style={{ fontFamily: "var(--font-cabinet), system-ui, sans-serif" }}
                />
              </div>

              <button
                onClick={handleSaveEntry}
                disabled={!newEntry.response.trim()}
                className="w-full px-5 py-3 bg-[#2A3C24] text-[#FFF5EB] rounded-lg font-medium hover:bg-[#2A3C24]/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Save Entry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Therapist Question Modal */}
      {showNewQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#2A3C24]/60 backdrop-blur-sm" onClick={() => setShowNewQuestion(false)} />
          <div className="relative bg-[#FFF5EB] rounded-2xl max-w-lg w-full shadow-2xl">
            <button
              onClick={() => setShowNewQuestion(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#2A3C24]/10 flex items-center justify-center hover:bg-[#2A3C24]/20 transition-colors"
            >
              <svg className="w-5 h-5 text-[#2A3C24]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="p-6 md:p-8">
              <h2
                className="text-2xl text-[#2A3C24] mb-6"
                style={{ fontFamily: "var(--font-instrument), 'Instrument Serif', Georgia, serif" }}
              >
                Question for Therapy
              </h2>

              <div className="mb-6">
                <label className="text-xs text-[#2A3C24]/50 uppercase tracking-wider block mb-2">
                  Question
                </label>
                <textarea
                  value={newQuestion.question}
                  onChange={(e) => setNewQuestion((prev) => ({ ...prev, question: e.target.value }))}
                  placeholder="What do you want to discuss?"
                  rows={3}
                  className="w-full px-4 py-3 border border-[#2A3C24]/10 rounded-lg focus:outline-none focus:border-[#97A97C] bg-white resize-none"
                />
              </div>

              <div className="mb-6">
                <label className="text-xs text-[#2A3C24]/50 uppercase tracking-wider block mb-2">
                  Context (optional)
                </label>
                <textarea
                  value={newQuestion.context}
                  onChange={(e) => setNewQuestion((prev) => ({ ...prev, context: e.target.value }))}
                  placeholder="Any background or why this came up..."
                  rows={2}
                  className="w-full px-4 py-3 border border-[#2A3C24]/10 rounded-lg focus:outline-none focus:border-[#97A97C] bg-white resize-none"
                />
              </div>

              <button
                onClick={handleSaveQuestion}
                disabled={!newQuestion.question.trim()}
                className="w-full px-5 py-3 bg-[#2A3C24] text-[#FFF5EB] rounded-lg font-medium hover:bg-[#2A3C24]/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Add Question
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Emotion Log Modal */}
      {showEmotionLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#2A3C24]/60 backdrop-blur-sm" onClick={() => setShowEmotionLog(false)} />
          <div className="relative bg-[#FFF5EB] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setShowEmotionLog(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#2A3C24]/10 flex items-center justify-center hover:bg-[#2A3C24]/20 transition-colors"
            >
              <svg className="w-5 h-5 text-[#2A3C24]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="p-6 md:p-8">
              <h2
                className="text-2xl text-[#2A3C24] mb-6"
                style={{ fontFamily: "var(--font-instrument), 'Instrument Serif', Georgia, serif" }}
              >
                Log Emotions
              </h2>

              {/* Emotion Selection */}
              <div className="mb-6">
                <label className="text-xs text-[#2A3C24]/50 uppercase tracking-wider block mb-3">
                  Select Emotions
                </label>
                <div className="space-y-4">
                  {emotionWheel.map((group) => (
                    <div key={group.core}>
                      <p className="text-sm font-medium text-[#2A3C24] mb-2">{group.core}</p>
                      <div className="flex flex-wrap gap-2">
                        {[group.core, ...group.variations].map((emotion) => (
                          <button
                            key={emotion}
                            onClick={() => toggleEmotion(emotion)}
                            className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                              newEmotionLog.emotions.find((e) => e.name === emotion)
                                ? "bg-[#2A3C24] text-[#FFF5EB]"
                                : "bg-white text-[#2A3C24]/70 hover:bg-[#97A97C]/10 border border-[#2A3C24]/10"
                            }`}
                          >
                            {emotion}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Intensity Sliders for Selected Emotions */}
              {newEmotionLog.emotions.length > 0 && (
                <div className="mb-6 p-4 rounded-xl bg-white border border-[#2A3C24]/5">
                  <label className="text-xs text-[#2A3C24]/50 uppercase tracking-wider block mb-3">
                    Intensity (1-5)
                  </label>
                  <div className="space-y-4">
                    {newEmotionLog.emotions.map((e) => (
                      <div key={e.name} className="flex items-center gap-4">
                        <span className="text-sm text-[#2A3C24] w-28">{e.name}</span>
                        <div className="flex-1 flex gap-2">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <button
                              key={n}
                              onClick={() => updateEmotionIntensity(e.name, n as EmotionIntensity)}
                              className={`w-8 h-8 rounded-full text-sm font-medium transition-all ${
                                e.intensity === n
                                  ? "bg-[#FABF34] text-[#2A3C24]"
                                  : "bg-[#2A3C24]/5 text-[#2A3C24]/40 hover:bg-[#2A3C24]/10"
                              }`}
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Triggers */}
              <div className="mb-6">
                <label className="text-xs text-[#2A3C24]/50 uppercase tracking-wider block mb-2">
                  Triggers (optional)
                </label>
                <input
                  type="text"
                  value={newEmotionLog.triggers}
                  onChange={(e) => setNewEmotionLog((prev) => ({ ...prev, triggers: e.target.value }))}
                  placeholder="What brought this up?"
                  className="w-full px-4 py-3 border border-[#2A3C24]/10 rounded-lg focus:outline-none focus:border-[#97A97C] bg-white"
                />
              </div>

              {/* Body Location */}
              <div className="mb-6">
                <label className="text-xs text-[#2A3C24]/50 uppercase tracking-wider block mb-2">
                  Where in your body? (optional)
                </label>
                <input
                  type="text"
                  value={newEmotionLog.bodyLocation}
                  onChange={(e) => setNewEmotionLog((prev) => ({ ...prev, bodyLocation: e.target.value }))}
                  placeholder="Chest, stomach, shoulders..."
                  className="w-full px-4 py-3 border border-[#2A3C24]/10 rounded-lg focus:outline-none focus:border-[#97A97C] bg-white"
                />
              </div>

              <button
                onClick={handleSaveEmotionLog}
                disabled={newEmotionLog.emotions.length === 0}
                className="w-full px-5 py-3 bg-[#2A3C24] text-[#FFF5EB] rounded-lg font-medium hover:bg-[#2A3C24]/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Save Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </IOAuthGate>
  );
}
