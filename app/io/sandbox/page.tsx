"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Types
type PromptCategory = "design" | "content" | "technical" | "voice" | "restructure" | "debug" | "other";
type FrustrationCode = "DC" | "RP" | "SL" | "IG" | "OT"; // Distrust Claude, Repeated Prompt, Slow, Ignoring, Other

interface SavedPrompt {
  id: string;
  title: string;
  prompt: string;
  category: PromptCategory;
  frustrationCode?: FrustrationCode;
  tags: string[];
  usageCount: number;
  lastUsed: string | null;
  createdAt: string;
}

interface HotKey {
  id: string;
  label: string;
  command: string;
  description: string;
}

// Default hot keys
const defaultHotKeys: HotKey[] = [
  { id: "1", label: "Focus", command: "You're not paying attention to my request. Let me be more specific:", description: "When Claude misses the point" },
  { id: "2", label: "Start Over", command: "Let's start fresh. Forget previous context. Here's what I need:", description: "Reset the conversation" },
  { id: "3", label: "Be Specific", command: "I need you to be more specific and detailed. Instead of general suggestions, give me:", description: "Get detailed answers" },
  { id: "4", label: "Step by Step", command: "Walk me through this step by step, explaining each decision:", description: "Get detailed walkthrough" },
  { id: "5", label: "Keep Current", command: "Don't change anything else. Only modify exactly what I specify:", description: "Prevent scope creep" },
  { id: "6", label: "Code Only", command: "Just give me the code. No explanations needed:", description: "Skip the explanation" }
];

const categoryColors: Record<PromptCategory, string> = {
  design: "bg-pink-100 text-pink-800",
  content: "bg-blue-100 text-blue-800",
  technical: "bg-purple-100 text-purple-800",
  voice: "bg-amber-100 text-amber-800",
  restructure: "bg-emerald-100 text-emerald-800",
  debug: "bg-red-100 text-red-800",
  other: "bg-gray-100 text-gray-800"
};

const frustrationLabels: Record<FrustrationCode, string> = {
  DC: "Distrust Claude",
  RP: "Repeated Prompt",
  SL: "Too Slow",
  IG: "Ignoring Request",
  OT: "Other"
};

// localStorage hook
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) setStoredValue(JSON.parse(item));
    } catch (e) { console.error(e); }
  }, [key]);

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (e) { console.error(e); }
  };

  return [storedValue, setValue];
}

export default function SandboxPage() {
  const [hotKeys] = useState<HotKey[]>(defaultHotKeys);
  const [prompts, setPrompts] = useLocalStorage<SavedPrompt[]>("sandbox-prompts", []);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showNewPrompt, setShowNewPrompt] = useState(false);
  const [filterCategory, setFilterCategory] = useState<PromptCategory | "all">("all");
  const [freeformPrompt, setFreeformPrompt] = useState("");

  // New prompt form
  const [newPrompt, setNewPrompt] = useState({
    title: "",
    prompt: "",
    category: "other" as PromptCategory,
    frustrationCode: undefined as FrustrationCode | undefined,
    tags: ""
  });

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSavePrompt = () => {
    const prompt: SavedPrompt = {
      id: Date.now().toString(),
      title: newPrompt.title,
      prompt: newPrompt.prompt,
      category: newPrompt.category,
      frustrationCode: newPrompt.frustrationCode,
      tags: newPrompt.tags.split(",").map(t => t.trim()).filter(Boolean),
      usageCount: 0,
      lastUsed: null,
      createdAt: new Date().toISOString()
    };
    setPrompts((prev) => [prompt, ...prev]);
    setNewPrompt({ title: "", prompt: "", category: "other", frustrationCode: undefined, tags: "" });
    setShowNewPrompt(false);
  };

  const usePrompt = async (prompt: SavedPrompt) => {
    await copyToClipboard(prompt.prompt, prompt.id);
    setPrompts((prev) =>
      prev.map((p) =>
        p.id === prompt.id
          ? { ...p, usageCount: p.usageCount + 1, lastUsed: new Date().toISOString() }
          : p
      )
    );
  };

  const filteredPrompts = filterCategory === "all"
    ? prompts
    : prompts.filter((p) => p.category === filterCategory);

  const allCategories: PromptCategory[] = ["design", "content", "technical", "voice", "restructure", "debug", "other"];

  return (
    <div className="bg-cream min-h-screen">
      {/* Header */}
      <section className="pt-28 pb-8 md:pt-36 md:pb-12">
        <div className="container-editorial">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="light-bg-label mb-3">Backend Tool</p>
              <h1 className="light-bg-header text-3xl md:text-4xl mb-2">Jenn&apos;s Sandbox</h1>
              <p className="light-bg-body">Prompt library and builder for Claude</p>
            </div>
            <button
              onClick={() => setShowNewPrompt(true)}
              className="px-5 py-2.5 bg-deep-forest text-cream rounded-full font-medium hover:bg-olive transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Save Prompt
            </button>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Hot Keys Section */}
      <section className="py-8 bg-deep-forest">
        <div className="container-editorial">
          <p className="dark-bg-label mb-4">Quick Commands</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {hotKeys.map((key) => (
              <button
                key={key.id}
                onClick={() => copyToClipboard(key.command, `hotkey-${key.id}`)}
                className="bg-white/10 hover:bg-white/20 rounded-lg p-4 text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-cream font-medium text-sm">{key.label}</span>
                  {copiedId === `hotkey-${key.id}` ? (
                    <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-cream/50 group-hover:text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                <p className="text-cream/60 text-xs">{key.description}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Freeform Builder */}
      <section className="py-8 bg-ivory">
        <div className="container-editorial">
          <p className="light-bg-label mb-4">Freeform Prompt Builder</p>
          <div className="bg-white rounded-xl p-4">
            <textarea
              value={freeformPrompt}
              onChange={(e) => setFreeformPrompt(e.target.value)}
              placeholder="Build your prompt here... describe what you're trying to do and I'll help format it."
              rows={4}
              className="w-full px-4 py-3 border border-sand rounded-lg focus:outline-none focus:border-sage resize-none mb-3"
            />
            <div className="flex items-center gap-3">
              <button
                onClick={() => copyToClipboard(freeformPrompt, "freeform")}
                disabled={!freeformPrompt.trim()}
                className="px-4 py-2 bg-deep-forest text-cream rounded-lg font-medium hover:bg-olive transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {copiedId === "freeform" ? "Copied!" : "Copy to Clipboard"}
              </button>
              <button
                onClick={() => setFreeformPrompt("")}
                className="px-4 py-2 bg-sand text-deep-forest rounded-lg font-medium hover:bg-sage/30 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Category Filter */}
      <section className="py-4 bg-cream">
        <div className="container-editorial">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <span className="light-bg-label text-xs shrink-0">Category:</span>
            <button
              onClick={() => setFilterCategory("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${filterCategory === "all" ? "bg-deep-forest text-cream" : "bg-sand text-deep-forest"}`}
            >
              All ({prompts.length})
            </button>
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all capitalize shrink-0 ${filterCategory === cat ? "bg-deep-forest text-cream" : categoryColors[cat]}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Saved Prompts */}
      <section className="py-8">
        <div className="container-editorial">
          <p className="light-bg-label mb-4">Saved Prompts</p>
          {filteredPrompts.length === 0 ? (
            <div className="text-center py-16 bg-ivory rounded-xl">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sage/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-deep-forest/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="light-bg-header text-lg mb-2">No saved prompts yet</h3>
              <p className="light-bg-body text-sm">Save prompts you keep repeating</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredPrompts.map((prompt) => (
                <div key={prompt.id} className="bg-white rounded-xl p-5 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="light-bg-header text-lg">{prompt.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${categoryColors[prompt.category]}`}>
                          {prompt.category}
                        </span>
                        {prompt.frustrationCode && (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-800">
                            {frustrationLabels[prompt.frustrationCode]}
                          </span>
                        )}
                        <span className="text-xs text-deep-forest/50">
                          Used {prompt.usageCount}x
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => usePrompt(prompt)}
                      className="px-4 py-2 bg-deep-forest text-cream rounded-lg text-sm font-medium hover:bg-olive transition-colors flex items-center gap-2"
                    >
                      {copiedId === prompt.id ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <p className="light-bg-body text-sm line-clamp-3 bg-ivory rounded-lg p-3 font-mono">
                    {prompt.prompt}
                  </p>
                  {prompt.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {prompt.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 bg-sage/20 text-deep-forest rounded text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
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

      {/* New Prompt Modal */}
      {showNewPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-deep-forest/80 backdrop-blur-sm" onClick={() => setShowNewPrompt(false)} />
          <div className="relative bg-cream rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <button onClick={() => setShowNewPrompt(false)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-deep-forest/10 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="p-6 md:p-8">
              <h2 className="light-bg-header text-2xl mb-6">Save a Prompt</h2>

              <div className="mb-4">
                <label className="light-bg-label text-sm mb-2 block">Title</label>
                <input
                  type="text"
                  value={newPrompt.title}
                  onChange={(e) => setNewPrompt((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Fix Layout Issues"
                  className="w-full px-4 py-3 border border-sand rounded-lg focus:outline-none focus:border-sage"
                />
              </div>

              <div className="mb-4">
                <label className="light-bg-label text-sm mb-2 block">Category</label>
                <div className="flex flex-wrap gap-2">
                  {allCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setNewPrompt((prev) => ({ ...prev, category: cat }))}
                      className={`px-3 py-1.5 rounded-full text-sm capitalize transition-all ${newPrompt.category === cat ? "bg-deep-forest text-cream" : categoryColors[cat]}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="light-bg-label text-sm mb-2 block">Frustration Code (optional)</label>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(frustrationLabels) as FrustrationCode[]).map((code) => (
                    <button
                      key={code}
                      onClick={() => setNewPrompt((prev) => ({ ...prev, frustrationCode: prev.frustrationCode === code ? undefined : code }))}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${newPrompt.frustrationCode === code ? "bg-red-600 text-white" : "bg-red-100 text-red-800"}`}
                    >
                      {code}: {frustrationLabels[code]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="light-bg-label text-sm mb-2 block">Prompt</label>
                <textarea
                  value={newPrompt.prompt}
                  onChange={(e) => setNewPrompt((prev) => ({ ...prev, prompt: e.target.value }))}
                  placeholder="The full prompt text you want to save..."
                  rows={6}
                  className="w-full px-4 py-3 border border-sand rounded-lg focus:outline-none focus:border-sage resize-none font-mono text-sm"
                />
              </div>

              <div className="mb-6">
                <label className="light-bg-label text-sm mb-2 block">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={newPrompt.tags}
                  onChange={(e) => setNewPrompt((prev) => ({ ...prev, tags: e.target.value }))}
                  placeholder="e.g., layout, css, responsive"
                  className="w-full px-4 py-3 border border-sand rounded-lg focus:outline-none focus:border-sage"
                />
              </div>

              <button
                onClick={handleSavePrompt}
                disabled={!newPrompt.title.trim() || !newPrompt.prompt.trim()}
                className="w-full px-5 py-3 bg-deep-forest text-cream rounded-lg font-medium hover:bg-olive transition-colors disabled:opacity-50"
              >
                Save Prompt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
