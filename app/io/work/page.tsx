"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Types
type JournalCategory = "ideas" | "peopleProblems" | "forgottenTasks";
type EmailTag = "data" | "interesting" | "update" | "template" | "good-examples";

interface JournalEntry {
  id: string;
  category: JournalCategory;
  content: string;
  priority: boolean;
  createdAt: string;
}

interface Person {
  id: string;
  name: string;
  type: "work" | "personal";
  role?: string;
  relationship?: string;
  communicationStyle: string;
  notes: string;
  interactions: Interaction[];
}

interface Interaction {
  id: string;
  date: string;
  context: string;
  notes: string;
  sentiment: "positive" | "neutral" | "challenging";
}

interface Email {
  id: string;
  subject: string;
  content: string;
  tags: EmailTag[];
  extractedDate?: string;
  keyInfo?: string;
  actionItems?: string[];
  createdAt: string;
}

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

// Default people
const defaultPeople: Person[] = [
  { id: "matt", name: "Matt", type: "personal", relationship: "Family", communicationStyle: "", notes: "", interactions: [] },
  { id: "scott", name: "Scott", type: "personal", relationship: "Family", communicationStyle: "", notes: "", interactions: [] },
  { id: "sam", name: "Sam", type: "personal", relationship: "Family", communicationStyle: "", notes: "", interactions: [] }
];

const categoryLabels: Record<JournalCategory, { label: string; icon: string }> = {
  ideas: { label: "Ideas", icon: "💡" },
  peopleProblems: { label: "People Problems", icon: "👥" },
  forgottenTasks: { label: "Keep Forgetting", icon: "🔄" }
};

const emailTagColors: Record<EmailTag, string> = {
  data: "bg-blue-100 text-blue-800",
  interesting: "bg-purple-100 text-purple-800",
  update: "bg-green-100 text-green-800",
  template: "bg-amber-100 text-amber-800",
  "good-examples": "bg-pink-100 text-pink-800"
};

export default function WorkJournalPage() {
  const [activeTab, setActiveTab] = useState<"journal" | "people" | "emails">("journal");
  const [entries, setEntries] = useLocalStorage<JournalEntry[]>("work-journal-entries", []);
  const [people, setPeople] = useLocalStorage<Person[]>("work-people", defaultPeople);
  const [emails, setEmails] = useLocalStorage<Email[]>("work-emails", []);

  const [showNewEntry, setShowNewEntry] = useState(false);
  const [showNewPerson, setShowNewPerson] = useState(false);
  const [showNewEmail, setShowNewEmail] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  // New entry form
  const [newEntry, setNewEntry] = useState({ category: "ideas" as JournalCategory, content: "", priority: false });
  // New person form
  const [newPerson, setNewPerson] = useState({ name: "", type: "work" as "work" | "personal", role: "", relationship: "", communicationStyle: "", notes: "" });
  // New email form
  const [newEmail, setNewEmail] = useState({ subject: "", content: "", tags: [] as EmailTag[] });

  const priorityEntries = entries.filter(e => e.priority && e.category === "forgottenTasks");
  const todayStr = new Date().toISOString().split("T")[0];

  const handleSaveEntry = () => {
    const entry: JournalEntry = {
      id: Date.now().toString(),
      category: newEntry.category,
      content: newEntry.content,
      priority: newEntry.priority,
      createdAt: new Date().toISOString()
    };
    setEntries(prev => [entry, ...prev]);
    setNewEntry({ category: "ideas", content: "", priority: false });
    setShowNewEntry(false);
  };

  const handleSavePerson = () => {
    const person: Person = {
      id: Date.now().toString(),
      name: newPerson.name,
      type: newPerson.type,
      role: newPerson.type === "work" ? newPerson.role : undefined,
      relationship: newPerson.type === "personal" ? newPerson.relationship : undefined,
      communicationStyle: newPerson.communicationStyle,
      notes: newPerson.notes,
      interactions: []
    };
    setPeople(prev => [person, ...prev]);
    setNewPerson({ name: "", type: "work", role: "", relationship: "", communicationStyle: "", notes: "" });
    setShowNewPerson(false);
  };

  const handleSaveEmail = () => {
    const email: Email = {
      id: Date.now().toString(),
      subject: newEmail.subject,
      content: newEmail.content,
      tags: newEmail.tags,
      createdAt: new Date().toISOString()
    };
    setEmails(prev => [email, ...prev]);
    setNewEmail({ subject: "", content: "", tags: [] });
    setShowNewEmail(false);
  };

  const toggleEmailTag = (tag: EmailTag) => {
    setNewEmail(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag]
    }));
  };

  return (
    <div className="bg-cream min-h-screen">
      {/* Header */}
      <section className="pt-28 pb-8 md:pt-36 md:pb-12">
        <div className="container-editorial">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="light-bg-label mb-3">Backend Tool</p>
              <h1 className="light-bg-header text-3xl md:text-4xl mb-2">Work Journal</h1>
              <p className="light-bg-body">Ideas, tasks, people, and email archive</p>
            </div>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Today's Priority */}
      {priorityEntries.length > 0 && (
        <>
          <section className="py-6 bg-gold/20">
            <div className="container-editorial">
              <p className="light-bg-label mb-3">🎯 Today&apos;s Priority - Things You Keep Forgetting</p>
              <div className="grid gap-2">
                {priorityEntries.slice(0, 3).map(entry => (
                  <div key={entry.id} className="bg-white rounded-lg p-4 flex items-center justify-between">
                    <span className="light-bg-body">{entry.content}</span>
                    <button
                      onClick={() => setEntries(prev => prev.map(e => e.id === entry.id ? { ...e, priority: false } : e))}
                      className="text-xs px-3 py-1 bg-deep-forest text-cream rounded-full"
                    >
                      Done
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <hr className="rule" />
        </>
      )}

      {/* Tabs */}
      <section className="py-4 bg-ivory">
        <div className="container-editorial">
          <div className="flex gap-2">
            {(["journal", "people", "emails"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all capitalize ${activeTab === tab ? "bg-deep-forest text-cream" : "bg-sand text-deep-forest hover:bg-sage/30"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Content */}
      <section className="py-8">
        <div className="container-editorial">
          {activeTab === "journal" && (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="light-bg-label">Journal Entries</p>
                <button onClick={() => setShowNewEntry(true)} className="px-4 py-2 bg-deep-forest text-cream rounded-full text-sm font-medium hover:bg-olive transition-colors">
                  + Add Entry
                </button>
              </div>
              {entries.length === 0 ? (
                <div className="text-center py-16 bg-ivory rounded-xl">
                  <p className="light-bg-body">No entries yet. Start journaling your work thoughts.</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {entries.map(entry => (
                    <div key={entry.id} className="bg-white rounded-xl p-4">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <span className="text-lg">{categoryLabels[entry.category].icon}</span>
                        <span className="text-xs text-deep-forest/50">{new Date(entry.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="light-bg-body">{entry.content}</p>
                      {entry.priority && <span className="inline-block mt-2 px-2 py-0.5 bg-gold/30 text-deep-forest rounded text-xs">Priority</span>}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === "people" && (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="light-bg-label">People Profiles</p>
                <button onClick={() => setShowNewPerson(true)} className="px-4 py-2 bg-deep-forest text-cream rounded-full text-sm font-medium hover:bg-olive transition-colors">
                  + Add Person
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {people.map(person => (
                  <button key={person.id} onClick={() => setSelectedPerson(person)} className="bg-white rounded-xl p-5 text-left hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="light-bg-header text-lg">{person.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${person.type === "work" ? "bg-deep-forest/20 text-deep-forest" : "bg-sage/30 text-deep-forest"}`}>
                        {person.type === "work" ? person.role || "Work" : person.relationship || "Personal"}
                      </span>
                    </div>
                    {person.communicationStyle && <p className="text-sm text-deep-forest/70 mb-2">{person.communicationStyle}</p>}
                    <p className="text-xs text-deep-forest/50">{person.interactions.length} interactions logged</p>
                  </button>
                ))}
              </div>
            </>
          )}

          {activeTab === "emails" && (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="light-bg-label">Email Archive</p>
                <button onClick={() => setShowNewEmail(true)} className="px-4 py-2 bg-deep-forest text-cream rounded-full text-sm font-medium hover:bg-olive transition-colors">
                  + Add Email
                </button>
              </div>
              {emails.length === 0 ? (
                <div className="text-center py-16 bg-ivory rounded-xl">
                  <p className="light-bg-body">No emails saved yet. Paste interesting emails here.</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {emails.map(email => (
                    <div key={email.id} className="bg-white rounded-xl p-5">
                      <h3 className="light-bg-header text-lg mb-2">{email.subject}</h3>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {email.tags.map(tag => (
                          <span key={tag} className={`px-2 py-0.5 rounded-full text-xs ${emailTagColors[tag]}`}>{tag}</span>
                        ))}
                      </div>
                      <p className="light-bg-body text-sm line-clamp-3">{email.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Back Link */}
      <section className="py-8 bg-ivory">
        <div className="container-editorial">
          <Link href="/io" className="link-editorial text-sm">← Back to dashboard</Link>
        </div>
      </section>

      {/* Modals */}
      {showNewEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-deep-forest/80 backdrop-blur-sm" onClick={() => setShowNewEntry(false)} />
          <div className="relative bg-cream rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <h2 className="light-bg-header text-xl mb-4">New Entry</h2>
            <div className="mb-4">
              <label className="light-bg-label text-sm mb-2 block">Category</label>
              <div className="flex gap-2">
                {(Object.keys(categoryLabels) as JournalCategory[]).map(cat => (
                  <button key={cat} onClick={() => setNewEntry(prev => ({ ...prev, category: cat }))} className={`px-3 py-1.5 rounded-full text-sm ${newEntry.category === cat ? "bg-deep-forest text-cream" : "bg-sand text-deep-forest"}`}>
                    {categoryLabels[cat].icon} {categoryLabels[cat].label}
                  </button>
                ))}
              </div>
            </div>
            <textarea value={newEntry.content} onChange={e => setNewEntry(prev => ({ ...prev, content: e.target.value }))} placeholder="What's on your mind?" rows={4} className="w-full px-4 py-3 border border-sand rounded-lg mb-4" />
            <label className="flex items-center gap-2 mb-4">
              <input type="checkbox" checked={newEntry.priority} onChange={e => setNewEntry(prev => ({ ...prev, priority: e.target.checked }))} className="w-4 h-4" />
              <span className="text-sm text-deep-forest">Mark as priority reminder</span>
            </label>
            <button onClick={handleSaveEntry} disabled={!newEntry.content.trim()} className="w-full py-3 bg-deep-forest text-cream rounded-lg font-medium disabled:opacity-50">Save</button>
          </div>
        </div>
      )}

      {showNewPerson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-deep-forest/80 backdrop-blur-sm" onClick={() => setShowNewPerson(false)} />
          <div className="relative bg-cream rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="light-bg-header text-xl mb-4">Add Person</h2>
            <input type="text" value={newPerson.name} onChange={e => setNewPerson(prev => ({ ...prev, name: e.target.value }))} placeholder="Name" className="w-full px-4 py-3 border border-sand rounded-lg mb-4" />
            <div className="flex gap-2 mb-4">
              <button onClick={() => setNewPerson(prev => ({ ...prev, type: "work" }))} className={`flex-1 py-2 rounded-lg ${newPerson.type === "work" ? "bg-deep-forest text-cream" : "bg-sand"}`}>Work</button>
              <button onClick={() => setNewPerson(prev => ({ ...prev, type: "personal" }))} className={`flex-1 py-2 rounded-lg ${newPerson.type === "personal" ? "bg-deep-forest text-cream" : "bg-sand"}`}>Personal</button>
            </div>
            {newPerson.type === "work" ? (
              <input type="text" value={newPerson.role} onChange={e => setNewPerson(prev => ({ ...prev, role: e.target.value }))} placeholder="Role/Title" className="w-full px-4 py-3 border border-sand rounded-lg mb-4" />
            ) : (
              <input type="text" value={newPerson.relationship} onChange={e => setNewPerson(prev => ({ ...prev, relationship: e.target.value }))} placeholder="Relationship" className="w-full px-4 py-3 border border-sand rounded-lg mb-4" />
            )}
            <input type="text" value={newPerson.communicationStyle} onChange={e => setNewPerson(prev => ({ ...prev, communicationStyle: e.target.value }))} placeholder="Communication style notes" className="w-full px-4 py-3 border border-sand rounded-lg mb-4" />
            <textarea value={newPerson.notes} onChange={e => setNewPerson(prev => ({ ...prev, notes: e.target.value }))} placeholder="General notes" rows={3} className="w-full px-4 py-3 border border-sand rounded-lg mb-4" />
            <button onClick={handleSavePerson} disabled={!newPerson.name.trim()} className="w-full py-3 bg-deep-forest text-cream rounded-lg font-medium disabled:opacity-50">Save</button>
          </div>
        </div>
      )}

      {showNewEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-deep-forest/80 backdrop-blur-sm" onClick={() => setShowNewEmail(false)} />
          <div className="relative bg-cream rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <h2 className="light-bg-header text-xl mb-4">Save Email</h2>
            <input type="text" value={newEmail.subject} onChange={e => setNewEmail(prev => ({ ...prev, subject: e.target.value }))} placeholder="Subject" className="w-full px-4 py-3 border border-sand rounded-lg mb-4" />
            <textarea value={newEmail.content} onChange={e => setNewEmail(prev => ({ ...prev, content: e.target.value }))} placeholder="Paste email content" rows={6} className="w-full px-4 py-3 border border-sand rounded-lg mb-4" />
            <div className="mb-4">
              <label className="light-bg-label text-sm mb-2 block">Tags</label>
              <div className="flex flex-wrap gap-2">
                {(["data", "interesting", "update", "template", "good-examples"] as EmailTag[]).map(tag => (
                  <button key={tag} onClick={() => toggleEmailTag(tag)} className={`px-3 py-1.5 rounded-full text-sm ${newEmail.tags.includes(tag) ? "bg-deep-forest text-cream" : emailTagColors[tag]}`}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={handleSaveEmail} disabled={!newEmail.subject.trim() || !newEmail.content.trim()} className="w-full py-3 bg-deep-forest text-cream rounded-lg font-medium disabled:opacity-50">Save</button>
          </div>
        </div>
      )}

      {selectedPerson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-deep-forest/80 backdrop-blur-sm" onClick={() => setSelectedPerson(null)} />
          <div className="relative bg-cream rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button onClick={() => setSelectedPerson(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-deep-forest/10 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h2 className="light-bg-header text-2xl mb-2">{selectedPerson.name}</h2>
            <span className={`inline-block px-3 py-1 rounded-full text-sm mb-4 ${selectedPerson.type === "work" ? "bg-deep-forest/20 text-deep-forest" : "bg-sage/30 text-deep-forest"}`}>
              {selectedPerson.type === "work" ? selectedPerson.role || "Work" : selectedPerson.relationship || "Personal"}
            </span>
            {selectedPerson.communicationStyle && (
              <div className="mb-4">
                <p className="light-bg-label text-sm mb-1">Communication Style</p>
                <p className="light-bg-body">{selectedPerson.communicationStyle}</p>
              </div>
            )}
            {selectedPerson.notes && (
              <div className="mb-4">
                <p className="light-bg-label text-sm mb-1">Notes</p>
                <p className="light-bg-body">{selectedPerson.notes}</p>
              </div>
            )}
            <div className="mt-6 p-4 bg-sage/10 rounded-lg">
              <p className="text-sm text-deep-forest/70 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                AI analysis coming soon - Claude will help you navigate interactions
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
