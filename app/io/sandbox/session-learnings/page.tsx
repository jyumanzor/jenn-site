'use client';

import { useState, useEffect } from 'react';
import sessionData from '@/data/session-learnings.json';

interface Learning {
  id: string;
  date: string;
  category: string;
  context: string;
  learning: string;
  tags: string[];
}

interface ForceCommand {
  trigger: string;
  response: string;
}

interface Pattern {
  problem: string;
  solution: string;
}

export default function SessionLearningsPage() {
  const [learnings, setLearnings] = useState<Learning[]>(sessionData.learnings);
  const [forceCommands, setForceCommands] = useState<ForceCommand[]>(sessionData.forceCommands);
  const [patterns, setPatterns] = useState<Pattern[]>(sessionData.patterns);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'learnings' | 'commands' | 'patterns'>('learnings');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // New learning form state
  const [newLearning, setNewLearning] = useState({
    category: 'design',
    context: '',
    learning: '',
    tags: ''
  });

  const categories = ['all', 'design', 'technical', 'content', 'layout', 'debug'];
  const categoryColors: Record<string, string> = {
    design: '#97A97C',
    technical: '#FABF34',
    layout: '#546E40',
    content: '#CBAD8C',
    debug: '#D4A853',
  };

  const filteredLearnings = filterCategory === 'all'
    ? learnings
    : learnings.filter(l => l.category === filterCategory);

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyAllLearnings = async () => {
    const text = learnings.map(l =>
      `[${l.category.toUpperCase()}] ${l.context}\n${l.learning}\nTags: ${l.tags.join(', ')}`
    ).join('\n\n---\n\n');
    await copyToClipboard(text, 'all');
  };

  const addLearning = () => {
    if (!newLearning.learning.trim()) return;

    const learning: Learning = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      category: newLearning.category,
      context: newLearning.context,
      learning: newLearning.learning,
      tags: newLearning.tags.split(',').map(t => t.trim()).filter(Boolean)
    };

    setLearnings([learning, ...learnings]);
    setNewLearning({ category: 'design', context: '', learning: '', tags: '' });

    // Note: In production, this would save to a database or API
    // For now, learnings are session-only (localStorage could be added)
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="container-editorial py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#97A97C' }}>
            IO / Sandbox
          </p>
          <h1 className="text-3xl md:text-4xl mb-2" style={{ color: '#3B412D', fontFamily: 'var(--font-instrument)' }}>
            <span className="italic">Session</span> Learnings
          </h1>
          <p style={{ color: '#546E40' }}>
            Patterns and preferences discovered during Claude Code sessions
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl p-4 text-center" style={{ background: '#FFF5EB', border: '1px solid #CBAD8C' }}>
            <span className="block text-3xl font-mono mb-1" style={{ color: '#FABF34' }}>
              {learnings.length}
            </span>
            <span className="text-xs uppercase tracking-wider" style={{ color: '#97A97C' }}>
              Learnings
            </span>
          </div>
          <div className="rounded-xl p-4 text-center" style={{ background: '#FFF5EB', border: '1px solid #CBAD8C' }}>
            <span className="block text-3xl font-mono mb-1" style={{ color: '#FABF34' }}>
              {forceCommands.length}
            </span>
            <span className="text-xs uppercase tracking-wider" style={{ color: '#97A97C' }}>
              Auto-Responses
            </span>
          </div>
          <div className="rounded-xl p-4 text-center" style={{ background: '#FFF5EB', border: '1px solid #CBAD8C' }}>
            <span className="block text-3xl font-mono mb-1" style={{ color: '#FABF34' }}>
              {patterns.length}
            </span>
            <span className="text-xs uppercase tracking-wider" style={{ color: '#97A97C' }}>
              Patterns
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b pb-4" style={{ borderColor: '#97A97C' }}>
          {(['learnings', 'commands', 'patterns'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all capitalize"
              style={{
                background: activeTab === tab ? '#546E40' : 'transparent',
                color: activeTab === tab ? '#FFF5EB' : '#3B412D',
                border: activeTab === tab ? 'none' : '1px solid #97A97C',
              }}
            >
              {tab === 'commands' ? 'Auto-Responses' : tab}
            </button>
          ))}
          <button
            onClick={copyAllLearnings}
            className="ml-auto px-4 py-2 rounded-full text-sm font-medium transition-all"
            style={{ background: '#3B412D', color: '#FFF5EB' }}
          >
            {copiedId === 'all' ? 'Copied!' : 'Copy All for Claude'}
          </button>
        </div>

        {/* Learnings Tab */}
        {activeTab === 'learnings' && (
          <div className="space-y-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className="px-3 py-1.5 rounded-full text-xs capitalize"
                  style={{
                    background: filterCategory === cat ? (categoryColors[cat] || '#546E40') : '#3C422E',
                    color: filterCategory === cat ? '#FFF5EB' : '#97A97C',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Add New Learning */}
            <div className="rounded-xl p-4" style={{ background: '#3B412D', border: '1px solid #546E40' }}>
              <h3 className="text-sm uppercase tracking-wider mb-4" style={{ color: '#CBAD8C' }}>
                Add Session Learning
              </h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: '#97A97C' }}>
                    Category
                  </label>
                  <select
                    value={newLearning.category}
                    onChange={(e) => setNewLearning({...newLearning, category: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg text-sm"
                    style={{ background: '#EFE4D6', color: '#3B412D', border: '1px solid #546E40' }}
                  >
                    {categories.filter(c => c !== 'all').map(cat => (
                      <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: '#97A97C' }}>
                    Context (what page/component)
                  </label>
                  <input
                    type="text"
                    value={newLearning.context}
                    onChange={(e) => setNewLearning({...newLearning, context: e.target.value})}
                    placeholder="e.g., FTI Portal, Nav Component..."
                    className="w-full px-3 py-2 rounded-lg text-sm"
                    style={{ background: '#EFE4D6', color: '#3B412D', border: '1px solid #546E40' }}
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: '#97A97C' }}>
                  Learning
                </label>
                <textarea
                  value={newLearning.learning}
                  onChange={(e) => setNewLearning({...newLearning, learning: e.target.value})}
                  placeholder="What did you learn or what preference was established?"
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg text-sm resize-none"
                  style={{ background: '#EFE4D6', color: '#3B412D', border: '1px solid #546E40' }}
                />
              </div>
              <div className="mb-4">
                <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: '#97A97C' }}>
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={newLearning.tags}
                  onChange={(e) => setNewLearning({...newLearning, tags: e.target.value})}
                  placeholder="color, typography, responsive..."
                  className="w-full px-3 py-2 rounded-lg text-sm"
                  style={{ background: '#EFE4D6', color: '#3B412D', border: '1px solid #546E40' }}
                />
              </div>
              <button
                onClick={addLearning}
                disabled={!newLearning.learning.trim()}
                className="w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: newLearning.learning.trim() ? '#546E40' : '#3C422E',
                  color: newLearning.learning.trim() ? '#FFF5EB' : '#97A97C',
                  cursor: newLearning.learning.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                + Add Learning
              </button>
            </div>

            {/* Learnings List */}
            <div className="space-y-3">
              {filteredLearnings.map((learning) => (
                <div
                  key={learning.id}
                  className="rounded-xl p-4 group cursor-pointer transition-all hover:translate-x-1"
                  style={{ background: '#FFF5EB', border: '1px solid #CBAD8C' }}
                  onClick={() => copyToClipboard(learning.learning, learning.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span
                          className="px-2 py-0.5 rounded text-xs uppercase"
                          style={{ background: categoryColors[learning.category] || '#3C422E', color: '#FFF5EB' }}
                        >
                          {learning.category}
                        </span>
                        <span className="text-xs" style={{ color: '#97A97C' }}>
                          {learning.context}
                        </span>
                        <span className="text-xs" style={{ color: '#CBAD8C' }}>
                          {learning.date}
                        </span>
                      </div>
                      <p className="text-sm mb-2" style={{ color: '#3B412D' }}>
                        {learning.learning}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {learning.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-full text-xs"
                            style={{ background: '#EFE4D6', color: '#97A97C' }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span
                      className="text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: copiedId === learning.id ? '#97A97C' : '#3B412D', color: '#FFF5EB' }}
                    >
                      {copiedId === learning.id ? 'Copied!' : 'Click to copy'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Auto-Responses Tab */}
        {activeTab === 'commands' && (
          <div className="space-y-4">
            <p className="text-sm mb-4" style={{ color: '#97A97C' }}>
              When you say these trigger phrases, Claude should respond with the solution
            </p>
            {forceCommands.map((cmd, i) => (
              <div
                key={i}
                className="rounded-xl p-4 cursor-pointer transition-all hover:translate-x-1"
                style={{ background: '#FFF5EB', border: '1px solid #CBAD8C' }}
                onClick={() => copyToClipboard(cmd.response, `cmd-${i}`)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs uppercase tracking-wider" style={{ color: '#CBAD8C' }}>
                    Trigger
                  </span>
                  <span className="text-sm font-medium" style={{ color: '#3B412D' }}>
                    &ldquo;{cmd.trigger}&rdquo;
                  </span>
                </div>
                <div className="pl-4 border-l-2" style={{ borderColor: '#FABF34' }}>
                  <span className="text-sm" style={{ color: '#546E40' }}>
                    {cmd.response}
                  </span>
                </div>
                {copiedId === `cmd-${i}` && (
                  <span className="text-xs mt-2 block" style={{ color: '#97A97C' }}>Copied!</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Patterns Tab */}
        {activeTab === 'patterns' && (
          <div className="space-y-4">
            <p className="text-sm mb-4" style={{ color: '#97A97C' }}>
              Common problems and their solutions
            </p>
            {patterns.map((pattern, i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden cursor-pointer transition-all hover:translate-x-1"
                style={{ border: '1px solid #CBAD8C' }}
                onClick={() => copyToClipboard(`Problem: ${pattern.problem}\nSolution: ${pattern.solution}`, `pattern-${i}`)}
              >
                <div className="p-4" style={{ background: '#3B412D' }}>
                  <span className="text-xs uppercase tracking-wider" style={{ color: '#CBAD8C' }}>
                    Problem
                  </span>
                  <p className="text-sm mt-1" style={{ color: '#FFF5EB' }}>
                    {pattern.problem}
                  </p>
                </div>
                <div className="p-4" style={{ background: '#FFF5EB' }}>
                  <span className="text-xs uppercase tracking-wider" style={{ color: '#97A97C' }}>
                    Solution
                  </span>
                  <p className="text-sm mt-1" style={{ color: '#3B412D' }}>
                    {pattern.solution}
                  </p>
                </div>
                {copiedId === `pattern-${i}` && (
                  <div className="px-4 py-2 text-xs" style={{ background: '#546E40', color: '#FFF5EB' }}>
                    Copied!
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 rounded-xl p-4" style={{ background: '#3B412D', border: '1px solid #546E40' }}>
          <h3 className="text-sm uppercase tracking-wider mb-2" style={{ color: '#FABF34' }}>
            How This Works
          </h3>
          <p className="text-sm" style={{ color: '#97A97C' }}>
            Learnings from Claude Code sessions are stored in <code className="px-1 rounded" style={{ background: '#2F2F2C', color: '#FABF34' }}>data/session-learnings.json</code>.
            Copy the &quot;Copy All for Claude&quot; content and paste it at the start of new sessions to give Claude context about your preferences.
          </p>
        </div>
      </div>
    </div>
  );
}
