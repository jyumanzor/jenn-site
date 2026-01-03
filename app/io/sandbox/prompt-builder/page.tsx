'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import IOAuthGate from "@/components/IOAuthGate";

// Types
interface LoggedIssue {
  id: string;
  project: string;
  category: string;
  description: string;
  timestamp: string;
  resolved: boolean;
  fix?: string;
  fixSource?: 'chat' | 'cc' | 'manual';
  fixTimestamp?: string;
}

interface ProjectConfig {
  name: string;
  icon: string;
  description: string;
  colors: Record<string, { name: string; hex: string; use: string }>;
  forbidden: string[];
  typography: { headers: string; body: string; stats: string };
  quickCommands: Record<string, string>;
  commonIssues: { problem: string; fix: string }[];
  rules: string[];
}

interface SessionContext {
  lastProject: string;
  lastCategory: string;
  recentIssues: string[];
  lastUpdated: string;
}

// Issue categories (generic)
const issueCategories = {
  color: { label: "Colors wrong", icon: "color" },
  contrast: { label: "Can't read text", icon: "contrast" },
  layout: { label: "Layout broken", icon: "layout" },
  scroll: { label: "Scroll stuck", icon: "scroll" },
  typography: { label: "Wrong fonts", icon: "type" },
  behavior: { label: "Not listening", icon: "behavior" },
  technical: { label: "Code errors", icon: "code" },
};

// Simple SVG icons (drawn, not emoji)
const icons: Record<string, JSX.Element> = {
  color: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>,
  contrast: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20"/><path d="M12 2a10 10 0 0 0 0 20" fill="currentColor" opacity="0.3"/></svg>,
  layout: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
  scroll: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><rect x="6" y="3" width="12" height="18" rx="2"/><path d="M12 8v4M12 16v.01"/></svg>,
  type: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>,
  behavior: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><path d="M8 15s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></svg>,
  code: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/></svg>,
  capture: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M20 6L9 17l-5-5"/></svg>,
  copy: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  fix: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  link: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
};

// Jenn Logo Component - matches brand logo (J with gold dot)
const JennLogo = ({ size = 32, variant = 'dark' }: { size?: number; variant?: 'light' | 'dark' }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
    <rect width="120" height="120" rx="24" fill={variant === 'dark' ? '#3B412D' : '#FFF5EB'}/>
    <path
      d="M45 28H75V78C75 92 65 102 50 102C38 102 30 94 30 82"
      stroke={variant === 'dark' ? '#FFF5EB' : '#3B412D'}
      strokeWidth="12"
      strokeLinecap="round"
      fill="none"
    />
    <circle cx="88" cy="32" r="8" fill="#FABF34"/>
  </svg>
);

export default function PromptBuilder() {
  // State
  const [activeView, setActiveView] = useState<'fix' | 'codes' | 'log' | 'os'>('fix');
  const [projectConfigs, setProjectConfigs] = useState<Record<string, ProjectConfig>>({});
  const [activeProject, setActiveProject] = useState<string>('jenns-site');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [issues, setIssues] = useState<LoggedIssue[]>([]);
  const [quickNote, setQuickNote] = useState('');
  const [showCaptureModal, setShowCaptureModal] = useState(false);
  const [showFixModal, setShowFixModal] = useState(false);
  const [selectedIssueForFix, setSelectedIssueForFix] = useState<string | null>(null);
  const [fixText, setFixText] = useState('');
  const [fixSource, setFixSource] = useState<'chat' | 'cc' | 'manual'>('chat');
  const [session, setSession] = useState<SessionContext | null>(null);

  // Load project configs
  useEffect(() => {
    fetch('/data/project-configs.json')
      .then(res => res.json())
      .then(data => setProjectConfigs(data))
      .catch(() => {
        // Fallback to inline config if fetch fails
        setProjectConfigs({
          'jenns-site': {
            name: "Jenn's Site",
            icon: 'J',
            description: 'Personal website',
            colors: {
              primary: { name: 'Deep Forest', hex: '#3B412D', use: 'Dark backgrounds' },
              accent: { name: 'Sage', hex: '#97A97C', use: 'Secondary text' },
              gold: { name: 'Gold', hex: '#FABF34', use: 'Numbers only' },
              background: { name: 'Ivory', hex: '#FFF5EB', use: 'Light backgrounds' },
              warm: { name: 'Terracotta', hex: '#C76B4A', use: 'Replaces dark blue' },
              neutral: { name: 'Tan', hex: '#CBAD8C', use: 'Labels' },
            },
            forbidden: ['dark blue', 'purple', 'bright red'],
            typography: { headers: 'Instrument Serif', body: 'system-ui', stats: 'font-mono gold' },
            quickCommands: {
              DC: 'Fix colors. Use only: Deep Forest #3B412D, Sage #97A97C, Terracotta #C76B4A, Gold #FABF34, Ivory #FFF5EB, Tan #CBAD8C. NO dark blue.',
              TC: 'Fix text contrast. Dark bg needs light text (#FFF5EB). Light bg needs dark text (#3B412D).',
              GR: 'Gold #FABF34 is ONLY for numbers, icons, small badges. NEVER for body text.',
              SC: 'Fix scroll. Add pt-20 to content or scroll-mt-20 to target elements.',
            },
            commonIssues: [
              { problem: 'Dark blue appeared', fix: 'Replace with terracotta #C76B4A' },
              { problem: 'Text unreadable', fix: 'Use #FFF5EB on dark bg, #3B412D on light bg' },
              { problem: 'Page scroll stuck', fix: 'Add pt-20 or scroll-mt-20' },
              { problem: 'Emoji icons', fix: 'Use drawn SVG icons instead' },
            ],
            rules: ['Gold ONLY for accents', 'No dark blue', 'Drawn icons over emoji', 'Check contrast'],
          },
          'fti-portal': {
            name: 'FTI Portal',
            icon: 'F',
            description: 'Internal FTI tools',
            colors: {
              primary: { name: 'Navy', hex: '#1B2B4B', use: 'Headers' },
              secondary: { name: 'Steel Blue', hex: '#4A6FA5', use: 'Links' },
              accent: { name: 'Teal', hex: '#2A9D8F', use: 'Success states' },
              background: { name: 'Light Gray', hex: '#F8F9FA', use: 'Page bg' },
            },
            forbidden: ['bright colors', 'playful fonts', 'large rounded corners'],
            typography: { headers: 'Inter', body: 'Inter', stats: 'font-mono' },
            quickCommands: {
              DC: 'Fix colors. Use only: Navy #1B2B4B, Steel Blue #4A6FA5, Teal #2A9D8F, Light Gray #F8F9FA.',
              TC: 'Fix text contrast. Dark bg needs white text. Light bg needs dark text (#333333).',
              SP: 'Professional layout. Use 4px, 8px, 16px, 24px spacing increments.',
            },
            commonIssues: [
              { problem: 'Too casual/playful', fix: 'Keep professional, use rounded-md max (8px)' },
            ],
            rules: ['Professional aesthetic', 'Max 8px corners', 'Compact layouts'],
          },
          'general': {
            name: 'General',
            icon: 'G',
            description: 'Default rules',
            colors: {},
            forbidden: [],
            typography: { headers: 'system-ui', body: 'system-ui', stats: 'font-mono' },
            quickCommands: {
              DC: 'Check color palette and use only approved colors.',
              TC: 'Ensure text has 4.5:1 minimum contrast ratio.',
            },
            commonIssues: [],
            rules: ['Read files before editing', 'Only change what asked'],
          },
        });
      });
  }, []);

  // Load issues and session from localStorage
  useEffect(() => {
    const savedIssues = localStorage.getItem('jenn-logged-issues-v2');
    if (savedIssues) setIssues(JSON.parse(savedIssues));

    const savedSession = localStorage.getItem('jenn-session-context');
    if (savedSession) setSession(JSON.parse(savedSession));
  }, []);

  // Save session context (uses functional update to avoid dependency issues)
  const saveSession = useCallback((updates: Partial<SessionContext>) => {
    setSession(prev => {
      const newSession = {
        ...prev,
        ...updates,
        lastUpdated: new Date().toISOString(),
      } as SessionContext;
      localStorage.setItem('jenn-session-context', JSON.stringify(newSession));
      return newSession;
    });
  }, []);

  // Update session when project changes (only on user action, not on mount)
  const handleProjectChange = useCallback((projectKey: string) => {
    setActiveProject(projectKey);
    saveSession({ lastProject: projectKey });
  }, [saveSession]);

  // Save issues
  const saveIssues = (updated: LoggedIssue[]) => {
    setIssues(updated);
    localStorage.setItem('jenn-logged-issues-v2', JSON.stringify(updated));
  };

  // Copy to clipboard
  const copyText = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  // Quick capture issue
  const captureIssue = (description?: string) => {
    const note = description || quickNote;
    if (!note.trim()) return;

    const newIssue: LoggedIssue = {
      id: Date.now().toString(),
      project: activeProject,
      category: selectedCategory || 'general',
      description: note,
      timestamp: new Date().toISOString(),
      resolved: false,
    };
    saveIssues([newIssue, ...issues]);
    saveSession({
      recentIssues: [note, ...(session?.recentIssues || []).slice(0, 4)],
      lastCategory: selectedCategory || 'general',
    });
    setQuickNote('');
    setShowCaptureModal(false);
  };

  // Log a fix for an existing issue
  const logFix = () => {
    if (!selectedIssueForFix || !fixText.trim()) return;

    const updated = issues.map(issue => {
      if (issue.id === selectedIssueForFix) {
        return {
          ...issue,
          fix: fixText,
          fixSource: fixSource,
          fixTimestamp: new Date().toISOString(),
          resolved: true,
        };
      }
      return issue;
    });
    saveIssues(updated);
    setFixText('');
    setSelectedIssueForFix(null);
    setShowFixModal(false);
  };

  // Get unresolved issues for current project
  const unresolvedIssues = issues.filter(i => i.project === activeProject && !i.resolved);

  // Get current project config
  const config = projectConfigs[activeProject] || projectConfigs['general'];

  // Get issue stats for current project
  const projectIssues = issues.filter(i => i.project === activeProject);
  const issueStats = projectIssues.reduce((acc, issue) => {
    acc[issue.category] = (acc[issue.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (!config) return null;

  return (
    <IOAuthGate>
      <div className="min-h-screen relative" style={{ background: '#0F0F0F' }}>
        {/* Floating Action Buttons */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
          {unresolvedIssues.length > 0 && (
            <button
              onClick={() => setShowFixModal(true)}
              className="flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all hover:scale-105"
              style={{ background: '#546E40', color: '#FFF5EB' }}
            >
              {icons.fix}
              <span className="font-medium text-sm">Log Fix</span>
              <span className="px-1.5 py-0.5 rounded text-xs font-mono" style={{ background: '#FABF34', color: '#1A1A1A' }}>
                {unresolvedIssues.length}
              </span>
            </button>
          )}
          <button
            onClick={() => setShowCaptureModal(true)}
            className="flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all hover:scale-105"
            style={{ background: '#FABF34', color: '#1A1A1A' }}
          >
            {icons.capture}
            <span className="font-medium text-sm">Capture</span>
          </button>
        </div>

        {/* Capture Modal */}
        {showCaptureModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowCaptureModal(false)}>
            <div
              className="w-full max-w-md mx-4 rounded-xl p-6"
              style={{ background: '#1A1A1A' }}
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-lg mb-4" style={{ color: '#FFF5EB', fontFamily: 'var(--font-instrument)' }}>
                Quick Capture
              </h3>
              <input
                type="text"
                autoFocus
                value={quickNote}
                onChange={e => setQuickNote(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && captureIssue()}
                placeholder="What went wrong?"
                className="w-full px-4 py-3 rounded-lg text-sm mb-4"
                style={{ background: '#252525', color: '#FFF5EB', border: '1px solid #3a3a3a' }}
              />
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.entries(issueCategories).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all"
                    style={{
                      background: selectedCategory === key ? '#546E40' : '#252525',
                      color: selectedCategory === key ? '#FFF5EB' : '#97A97C',
                    }}
                  >
                    <span className="opacity-70">{icons[val.icon]}</span>
                    {val.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCaptureModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg text-sm"
                  style={{ background: '#252525', color: '#808080' }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => captureIssue()}
                  disabled={!quickNote.trim()}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                  style={{ background: '#FABF34', color: '#1A1A1A' }}
                >
                  Capture
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Fix Modal */}
        {showFixModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowFixModal(false)}>
            <div
              className="w-full max-w-lg mx-4 rounded-xl p-6"
              style={{ background: '#1A1A1A' }}
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-lg mb-4" style={{ color: '#FFF5EB', fontFamily: 'var(--font-instrument)' }}>
                Log a Fix
              </h3>

              {/* Select Issue */}
              <div className="mb-4">
                <p className="text-xs uppercase tracking-wider mb-2" style={{ color: '#CBAD8C' }}>
                  Which issue did you fix?
                </p>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {unresolvedIssues.map(issue => (
                    <button
                      key={issue.id}
                      onClick={() => setSelectedIssueForFix(issue.id)}
                      className="w-full p-3 rounded-lg text-left text-sm transition-all"
                      style={{
                        background: selectedIssueForFix === issue.id ? '#546E40' : '#252525',
                        border: selectedIssueForFix === issue.id ? '1px solid #97A97C' : '1px solid transparent',
                        color: '#FFF5EB',
                      }}
                    >
                      <div className="flex items-start gap-2">
                        <span className="shrink-0 mt-0.5" style={{ color: selectedIssueForFix === issue.id ? '#FABF34' : '#97A97C' }}>
                          {icons[issueCategories[issue.category as keyof typeof issueCategories]?.icon || 'code']}
                        </span>
                        <span>{issue.description}</span>
                      </div>
                    </button>
                  ))}
                  {unresolvedIssues.length === 0 && (
                    <p className="text-sm text-center py-4" style={{ color: '#808080' }}>
                      No open issues. Capture an issue first!
                    </p>
                  )}
                </div>
              </div>

              {/* Fix Source */}
              <div className="mb-4">
                <p className="text-xs uppercase tracking-wider mb-2" style={{ color: '#CBAD8C' }}>
                  Where did you find the fix?
                </p>
                <div className="flex gap-2">
                  {[
                    { id: 'chat', label: 'Claude Chat' },
                    { id: 'cc', label: 'Claude Code' },
                    { id: 'manual', label: 'Figured it out' },
                  ].map(source => (
                    <button
                      key={source.id}
                      onClick={() => setFixSource(source.id as typeof fixSource)}
                      className="px-3 py-2 rounded-lg text-xs transition-all"
                      style={{
                        background: fixSource === source.id ? '#546E40' : '#252525',
                        color: fixSource === source.id ? '#FFF5EB' : '#97A97C',
                      }}
                    >
                      {source.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fix Text */}
              <div className="mb-4">
                <p className="text-xs uppercase tracking-wider mb-2" style={{ color: '#CBAD8C' }}>
                  What was the fix? (paste command/code/explanation)
                </p>
                <textarea
                  value={fixText}
                  onChange={e => setFixText(e.target.value)}
                  placeholder="Paste the fix that worked..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg text-sm resize-none"
                  style={{ background: '#252525', color: '#FFF5EB', border: '1px solid #3a3a3a' }}
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowFixModal(false);
                    setSelectedIssueForFix(null);
                    setFixText('');
                  }}
                  className="flex-1 px-4 py-2 rounded-lg text-sm"
                  style={{ background: '#252525', color: '#808080' }}
                >
                  Cancel
                </button>
                <button
                  onClick={logFix}
                  disabled={!selectedIssueForFix || !fixText.trim()}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                  style={{ background: '#546E40', color: '#FFF5EB' }}
                >
                  Save Fix
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <header className="border-b px-6 py-4" style={{ borderColor: '#2a2a2a', background: '#171717' }}>
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Link href="/io/sandbox" className="text-xs transition-colors hover:opacity-70" style={{ color: '#97A97C' }}>
                  ← Sandbox
                </Link>
                <div className="flex items-center gap-3">
                  <JennLogo size={28} />
                  <h1 className="text-xl italic" style={{ color: '#FFF5EB', fontFamily: 'var(--font-instrument)' }}>
                    Prompt Builder
                  </h1>
                </div>
              </div>

              {/* Project Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: '#808080' }}>Project:</span>
                {Object.entries(projectConfigs).map(([key, proj]) => (
                  <button
                    key={key}
                    onClick={() => handleProjectChange(key)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all"
                    style={{
                      background: activeProject === key ? '#546E40' : '#252525',
                      color: activeProject === key ? '#FFF5EB' : '#808080',
                      border: activeProject === key ? '1px solid #97A97C' : '1px solid transparent',
                    }}
                  >
                    <span className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold"
                          style={{ background: activeProject === key ? '#FABF34' : '#3a3a3a', color: '#1A1A1A' }}>
                      {proj.icon}
                    </span>
                    <span className="hidden sm:inline">{proj.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex gap-1 p-1 rounded-lg w-fit" style={{ background: '#252525' }}>
              {[
                { id: 'fix', label: 'Fix Issue' },
                { id: 'codes', label: 'Quick Codes' },
                { id: 'log', label: 'Issue Log' },
                { id: 'os', label: 'Jenn OS' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id as typeof activeView)}
                  className="px-4 py-2 rounded-md text-sm font-medium transition-all"
                  style={{
                    background: activeView === tab.id ? '#546E40' : 'transparent',
                    color: activeView === tab.id ? '#FFF5EB' : '#808080',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-6 py-6">
          {/* === FIX ISSUE VIEW === */}
          {activeView === 'fix' && (
            <div className="grid grid-cols-12 gap-6">
              {/* Left: What went wrong */}
              <div className="col-span-4 space-y-4">
                <div className="rounded-xl p-5" style={{ background: '#1A1A1A' }}>
                  <h2 className="text-xs uppercase tracking-wider mb-4" style={{ color: '#CBAD8C' }}>
                    What went wrong?
                  </h2>
                  <div className="space-y-2">
                    {Object.entries(issueCategories).map(([key, val]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
                        className="w-full p-3 rounded-lg text-left transition-all hover:scale-[1.02] flex items-center gap-3"
                        style={{
                          background: selectedCategory === key ? '#546E40' : '#252525',
                          border: selectedCategory === key ? '1px solid #97A97C' : '1px solid transparent',
                        }}
                      >
                        <span style={{ color: selectedCategory === key ? '#FABF34' : '#97A97C' }}>
                          {icons[val.icon]}
                        </span>
                        <span style={{ color: '#FFF5EB' }}>{val.label}</span>
                        {issueStats[key] && (
                          <span
                            className="ml-auto px-2 py-0.5 rounded text-xs font-mono"
                            style={{ background: '#FABF34', color: '#1A1A1A' }}
                          >
                            {issueStats[key]}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Project Colors Reference */}
                {Object.keys(config.colors).length > 0 && (
                  <div className="rounded-xl p-4" style={{ background: '#1A1A1A' }}>
                    <h3 className="text-xs uppercase tracking-wider mb-3" style={{ color: '#CBAD8C' }}>
                      {config.name} Colors
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(config.colors).map(([key, color]) => (
                        <button
                          key={key}
                          onClick={() => copyText(color.hex, `color-${key}`)}
                          className="text-center group"
                        >
                          <div
                            className="aspect-square rounded-lg mb-1 transition-transform group-hover:scale-110"
                            style={{ background: color.hex }}
                          />
                          <p className="text-[9px] truncate" style={{ color: copied === `color-${key}` ? '#FABF34' : '#808080' }}>
                            {copied === `color-${key}` ? 'Copied!' : color.name}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Suggested Fix */}
              <div className="col-span-8 space-y-4">
                {selectedCategory ? (
                  <>
                    {/* Common Issues for this category */}
                    <div className="rounded-xl p-5" style={{ background: '#1A1A1A' }}>
                      <h2 className="text-xs uppercase tracking-wider mb-4" style={{ color: '#CBAD8C' }}>
                        Common {issueCategories[selectedCategory as keyof typeof issueCategories]?.label} Issues
                      </h2>
                      <div className="space-y-3">
                        {config.commonIssues
                          .filter(i => {
                            // Filter by category relevance
                            const lower = i.problem.toLowerCase();
                            if (selectedCategory === 'color') return lower.includes('color') || lower.includes('blue') || lower.includes('palette');
                            if (selectedCategory === 'contrast') return lower.includes('text') || lower.includes('read') || lower.includes('contrast');
                            if (selectedCategory === 'scroll') return lower.includes('scroll') || lower.includes('stuck');
                            if (selectedCategory === 'typography') return lower.includes('font') || lower.includes('icon') || lower.includes('emoji');
                            return true;
                          })
                          .map((issue, i) => (
                            <div
                              key={i}
                              className="p-4 rounded-lg"
                              style={{ background: '#252525' }}
                            >
                              <p className="text-sm font-medium mb-2" style={{ color: '#FFF5EB' }}>
                                {issue.problem}
                              </p>
                              <button
                                onClick={() => copyText(issue.fix, `issue-${i}`)}
                                className="flex items-center gap-2 px-3 py-2 rounded text-xs transition-all hover:scale-105"
                                style={{
                                  background: copied === `issue-${i}` ? '#546E40' : '#1A1A1A',
                                  color: copied === `issue-${i}` ? '#FFF5EB' : '#97A97C',
                                  border: '1px solid #3a3a3a',
                                }}
                              >
                                {copied === `issue-${i}` ? icons.check : icons.copy}
                                <span>{copied === `issue-${i}` ? 'Copied!' : issue.fix}</span>
                              </button>
                            </div>
                          ))}
                        {config.commonIssues.length === 0 && (
                          <p className="text-sm" style={{ color: '#808080' }}>
                            No specific issues documented for this project yet.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Relevant Quick Commands */}
                    <div className="rounded-xl p-5" style={{ background: '#1A1A1A' }}>
                      <h2 className="text-xs uppercase tracking-wider mb-4" style={{ color: '#CBAD8C' }}>
                        Quick Commands for {config.name}
                      </h2>
                      <div className="space-y-2">
                        {Object.entries(config.quickCommands)
                          .filter(([code]) => {
                            // Show relevant commands for category
                            if (selectedCategory === 'color' || selectedCategory === 'contrast') return ['DC', 'TC', 'GR'].includes(code);
                            if (selectedCategory === 'scroll') return code === 'SC';
                            if (selectedCategory === 'layout') return ['SP', 'SC'].includes(code);
                            return true;
                          })
                          .map(([code, text]) => (
                            <button
                              key={code}
                              onClick={() => copyText(text, `cmd-${code}`)}
                              className="w-full p-4 rounded-lg text-left transition-all hover:scale-[1.01] flex items-start gap-3"
                              style={{ background: '#252525' }}
                            >
                              <span
                                className="px-2 py-1 rounded text-xs font-mono font-bold shrink-0"
                                style={{ background: '#FABF34', color: '#1A1A1A' }}
                              >
                                {code}
                              </span>
                              <span className="text-sm" style={{ color: copied === `cmd-${code}` ? '#FABF34' : '#97A97C' }}>
                                {copied === `cmd-${code}` ? 'Copied!' : text}
                              </span>
                            </button>
                          ))}
                      </div>
                    </div>

                    {/* Project Rules */}
                    <div className="rounded-xl p-5" style={{ background: '#1A1A1A' }}>
                      <h2 className="text-xs uppercase tracking-wider mb-4" style={{ color: '#CBAD8C' }}>
                        {config.name} Rules
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {config.rules.map((rule, i) => (
                          <button
                            key={i}
                            onClick={() => copyText(rule, `rule-${i}`)}
                            className="px-3 py-2 rounded-lg text-xs transition-all hover:scale-105"
                            style={{
                              background: copied === `rule-${i}` ? '#546E40' : '#252525',
                              color: copied === `rule-${i}` ? '#FFF5EB' : '#97A97C',
                            }}
                          >
                            {copied === `rule-${i}` ? 'Copied!' : rule}
                          </button>
                        ))}
                      </div>
                      {config.forbidden.length > 0 && (
                        <div className="mt-4 pt-4 border-t" style={{ borderColor: '#3a3a3a' }}>
                          <p className="text-xs mb-2" style={{ color: '#E07850' }}>Never use:</p>
                          <p className="text-sm" style={{ color: '#808080' }}>
                            {config.forbidden.join(', ')}
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="rounded-xl p-12 text-center" style={{ background: '#1A1A1A', border: '2px dashed #3a3a3a' }}>
                    <p className="text-lg mb-2" style={{ color: '#FFF5EB' }}>
                      Select an issue category
                    </p>
                    <p className="text-sm mb-6" style={{ color: '#808080' }}>
                      Get project-specific fixes for {config.name}
                    </p>
                    {session?.lastCategory && (
                      <button
                        onClick={() => setSelectedCategory(session.lastCategory)}
                        className="px-4 py-2 rounded-lg text-sm"
                        style={{ background: '#252525', color: '#97A97C' }}
                      >
                        Continue from: {issueCategories[session.lastCategory as keyof typeof issueCategories]?.label || session.lastCategory}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* === QUICK CODES VIEW === */}
          {activeView === 'codes' && (
            <div className="space-y-6">
              <div className="rounded-xl p-5" style={{ background: '#1A1A1A' }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xs uppercase tracking-wider" style={{ color: '#CBAD8C' }}>
                    {config.name} Quick Codes
                  </h2>
                  <span className="text-xs" style={{ color: '#808080' }}>
                    Click any code to copy
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(config.quickCommands).map(([code, text]) => (
                    <button
                      key={code}
                      onClick={() => copyText(text, `qc-${code}`)}
                      className="p-4 rounded-lg text-left transition-all hover:scale-[1.02]"
                      style={{ background: '#252525' }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className="px-3 py-1.5 rounded text-sm font-mono font-bold"
                          style={{ background: '#FABF34', color: '#1A1A1A' }}
                        >
                          {code}
                        </span>
                        <span className="text-xs" style={{ color: copied === `qc-${code}` ? '#FABF34' : '#808080' }}>
                          {copied === `qc-${code}` ? 'Copied!' : 'Click to copy'}
                        </span>
                      </div>
                      <p className="text-sm" style={{ color: '#97A97C' }}>{text}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Force Commands (project-agnostic) */}
              <div className="rounded-xl p-5" style={{ background: '#1A1A1A' }}>
                <h2 className="text-xs uppercase tracking-wider mb-4" style={{ color: '#CBAD8C' }}>
                  Force Commands (When Claude Won't Listen)
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Stop. Re-read the requirements I gave you.",
                    "You're not paying attention to what I'm asking.",
                    "Go back to the original file and start over.",
                    "DO NOT change anything else. ONLY change what I specified.",
                    "Read the entire file before making changes.",
                    "Explain what you think I want, then I'll confirm before you proceed.",
                    "Keep the exact same structure, just change [specific thing].",
                    "No extras. No comments. No refactoring. Just what I asked.",
                  ].map((cmd, i) => (
                    <button
                      key={i}
                      onClick={() => copyText(cmd, `force-${i}`)}
                      className="p-3 rounded-lg text-left text-sm transition-all hover:scale-[1.01]"
                      style={{
                        background: copied === `force-${i}` ? '#546E40' : '#252525',
                        color: copied === `force-${i}` ? '#FFF5EB' : '#97A97C',
                      }}
                    >
                      {copied === `force-${i}` ? 'Copied!' : cmd}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* === ISSUE LOG VIEW === */}
          {activeView === 'log' && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-6 gap-4">
                <div className="rounded-xl p-4 text-center" style={{ background: '#1A1A1A' }}>
                  <span className="block text-2xl font-mono" style={{ color: '#FABF34' }}>{projectIssues.length}</span>
                  <span className="text-xs" style={{ color: '#808080' }}>Total</span>
                </div>
                <div className="rounded-xl p-4 text-center" style={{ background: '#1A1A1A' }}>
                  <span className="block text-2xl font-mono" style={{ color: '#E07850' }}>
                    {projectIssues.filter(i => !i.resolved).length}
                  </span>
                  <span className="text-xs" style={{ color: '#808080' }}>Open</span>
                </div>
                {Object.entries(issueStats).slice(0, 4).map(([cat, count]) => (
                  <div key={cat} className="rounded-xl p-4 text-center" style={{ background: '#1A1A1A' }}>
                    <span className="block text-2xl font-mono" style={{ color: '#97A97C' }}>{count}</span>
                    <span className="text-xs capitalize" style={{ color: '#808080' }}>{cat}</span>
                  </div>
                ))}
              </div>

              {/* Issue List */}
              <div className="rounded-xl p-5" style={{ background: '#1A1A1A' }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xs uppercase tracking-wider" style={{ color: '#CBAD8C' }}>
                    {config.name} Issues
                  </h2>
                  {projectIssues.length > 0 && (
                    <button
                      onClick={() => saveIssues(issues.filter(i => i.project !== activeProject))}
                      className="text-xs px-2 py-1 rounded"
                      style={{ color: '#E07850' }}
                    >
                      Clear all
                    </button>
                  )}
                </div>
                {projectIssues.length === 0 ? (
                  <p className="text-center py-8 text-sm" style={{ color: '#808080' }}>
                    No issues logged for {config.name}. Use the Capture button to log problems.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {projectIssues.map(issue => (
                      <div
                        key={issue.id}
                        className="p-4 rounded-lg flex items-start gap-4"
                        style={{ background: '#252525', opacity: issue.resolved ? 0.5 : 1 }}
                      >
                        <button
                          onClick={() => {
                            const updated = issues.map(i =>
                              i.id === issue.id ? { ...i, resolved: !i.resolved } : i
                            );
                            saveIssues(updated);
                          }}
                          className="w-5 h-5 rounded flex items-center justify-center mt-0.5 shrink-0"
                          style={{ background: issue.resolved ? '#546E40' : '#3a3a3a' }}
                        >
                          {issue.resolved && <span style={{ color: '#FFF5EB' }}>{icons.check}</span>}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm mb-1"
                            style={{ color: '#FFF5EB', textDecoration: issue.resolved ? 'line-through' : 'none' }}
                          >
                            {issue.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className="px-2 py-0.5 rounded text-[10px] capitalize"
                                  style={{ background: '#3a3a3a', color: '#97A97C' }}>
                              {issue.category}
                            </span>
                            <span className="text-[10px]" style={{ color: '#808080' }}>
                              {new Date(issue.timestamp).toLocaleDateString()}
                            </span>
                            {issue.fixSource && (
                              <span className="px-2 py-0.5 rounded text-[10px]"
                                    style={{
                                      background: issue.fixSource === 'chat' ? '#1B2B4B' : issue.fixSource === 'cc' ? '#546E40' : '#3a3a3a',
                                      color: '#FFF5EB'
                                    }}>
                                {issue.fixSource === 'chat' ? 'via Chat' : issue.fixSource === 'cc' ? 'via CC' : 'Manual'}
                              </span>
                            )}
                          </div>
                          {/* Show fix if exists */}
                          {issue.fix && (
                            <button
                              onClick={() => copyText(issue.fix!, `fix-${issue.id}`)}
                              className="w-full p-2 rounded text-xs text-left transition-all hover:scale-[1.01]"
                              style={{
                                background: copied === `fix-${issue.id}` ? '#546E40' : '#1A1A1A',
                                color: copied === `fix-${issue.id}` ? '#FFF5EB' : '#97A97C',
                                border: '1px solid #3a3a3a'
                              }}
                            >
                              <span className="flex items-center gap-1 mb-1" style={{ color: '#FABF34' }}>
                                {icons.fix} <span className="text-[10px] uppercase">Fix:</span>
                              </span>
                              <span className="block" style={{ color: copied === `fix-${issue.id}` ? '#FFF5EB' : '#97A97C' }}>
                                {copied === `fix-${issue.id}` ? 'Copied!' : issue.fix.length > 100 ? issue.fix.slice(0, 100) + '...' : issue.fix}
                              </span>
                            </button>
                          )}
                        </div>
                        <div className="flex flex-col gap-1 shrink-0">
                          {!issue.resolved && (
                            <button
                              onClick={() => {
                                setSelectedIssueForFix(issue.id);
                                setShowFixModal(true);
                              }}
                              className="text-xs px-2 py-1 rounded"
                              style={{ background: '#546E40', color: '#FFF5EB' }}
                            >
                              + Fix
                            </button>
                          )}
                          <button
                            onClick={() => saveIssues(issues.filter(i => i.id !== issue.id))}
                            className="text-xs px-2 py-1 rounded"
                            style={{ color: '#E07850' }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pattern Analysis */}
              {projectIssues.length >= 3 && (
                <div className="rounded-xl p-5" style={{ background: '#1A1A1A' }}>
                  <h2 className="text-xs uppercase tracking-wider mb-4" style={{ color: '#CBAD8C' }}>
                    Pattern Analysis
                  </h2>
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(issueStats)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 3)
                      .map(([cat, count]) => {
                        const pct = Math.round((count / projectIssues.length) * 100);
                        return (
                          <div key={cat}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs capitalize" style={{ color: '#97A97C' }}>{cat}</span>
                              <span className="text-xs font-mono" style={{ color: '#FABF34' }}>{pct}%</span>
                            </div>
                            <div className="h-2 rounded-full overflow-hidden" style={{ background: '#3a3a3a' }}>
                              <div
                                className="h-full rounded-full"
                                style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #546E40, #97A97C)' }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                  {Object.keys(issueStats).length > 0 && (
                    <p className="mt-4 text-xs" style={{ color: '#808080' }}>
                      Most common issue: <span style={{ color: '#FABF34' }}>{Object.entries(issueStats).sort((a, b) => b[1] - a[1])[0]?.[0]}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* === JENN OS VIEW === */}
          {activeView === 'os' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="rounded-xl p-8" style={{ background: 'linear-gradient(135deg, #3B412D 0%, #546E40 100%)' }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <JennLogo size={48} />
                    <div>
                      <h2 className="text-3xl mb-1" style={{ fontFamily: 'var(--font-instrument)', color: '#FFF5EB' }}>
                        Jenn OS
                      </h2>
                      <p className="text-sm" style={{ color: '#97A97C' }}>
                        Operating system for AI collaboration
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: '#CBAD8C' }}>Version</p>
                    <p className="font-mono" style={{ color: '#FABF34' }}>2.2.0</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Philosophy */}
                <div className="rounded-xl p-6" style={{ background: '#1A1A1A' }}>
                  <h3 className="text-xs uppercase tracking-wider mb-4" style={{ color: '#CBAD8C' }}>Core Philosophy</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs mb-2" style={{ color: '#808080' }}>On Running</p>
                      <ul className="space-y-1">
                        {[
                          "Running is the one place with no luck, no shortcuts",
                          "Effort compounds. Setbacks aren't permanent",
                          "Choose hard things on purpose",
                        ].map((item, i) => (
                          <li key={i} className="text-sm" style={{ color: '#97A97C' }}>"{item}"</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs mb-2" style={{ color: '#808080' }}>On Work</p>
                      <ul className="space-y-1">
                        {[
                          "Effort dictates how well you weather tough moments",
                          "Joy, even in the mundane, becomes infectious",
                          "Rituals create culture; culture creates trust",
                        ].map((item, i) => (
                          <li key={i} className="text-sm" style={{ color: '#97A97C' }}>"{item}"</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Profile */}
                <div className="rounded-xl p-6" style={{ background: '#1A1A1A' }}>
                  <h3 className="text-xs uppercase tracking-wider mb-4" style={{ color: '#CBAD8C' }}>Profile</h3>
                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="text-xs" style={{ color: '#808080' }}>Role</p>
                      <p style={{ color: '#FFF5EB' }}>Senior Consultant, Economics</p>
                      <p className="text-xs" style={{ color: '#97A97C' }}>FTI Consulting</p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: '#808080' }}>Running</p>
                      <p style={{ color: '#FFF5EB' }}>Marathon PR: 3:09 | Pursuing sub-3:00</p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: '#808080' }}>Education</p>
                      <p style={{ color: '#FFF5EB' }}>BA Sociology & HIPS, UChicago</p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: '#808080' }}>Languages</p>
                      <p style={{ color: '#97A97C' }}>Spanish, French, Hindi</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Instructions */}
              <div className="rounded-xl p-6" style={{ background: '#1A1A1A' }}>
                <h3 className="text-xs uppercase tracking-wider mb-4" style={{ color: '#CBAD8C' }}>AI Collaboration Rules</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs mb-2" style={{ color: '#808080' }}>Communication</p>
                    <ul className="space-y-1 text-sm">
                      {["Direct, no pleasantries", "Functional over decorative", "Remember context", "Efficiency over perfection"].map((item, i) => (
                        <li key={i} style={{ color: '#97A97C' }}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs mb-2" style={{ color: '#808080' }}>Do</p>
                    <ul className="space-y-1 text-sm">
                      {["Read files before editing", "Only change what's asked", "Use palette colors only", "Check text contrast"].map((item, i) => (
                        <li key={i} style={{ color: '#97A97C' }}>+ {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs mb-2" style={{ color: '#808080' }}>Don't</p>
                    <ul className="space-y-1 text-sm">
                      {["Add unsolicited changes", "Use off-palette colors", "Use emoji icons", "Over-engineer"].map((item, i) => (
                        <li key={i} style={{ color: '#E07850' }}>- {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </IOAuthGate>
  );
}
