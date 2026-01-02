'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';

// Types
interface VoiceMemo {
  id: string;
  rawText: string;
  timestamp: string;
  source: 'audio' | 'text' | 'paste';
  fileName?: string;
  duration?: number;
  processed: boolean;
}

interface ParsedPrompt {
  id: string;
  memoId: string;
  title: string;
  description: string;
  project: string;
  category: string;
  priority: string;
  tags: string[];
  status: 'pending' | 'in_progress' | 'completed' | 'archived';
  createdAt: string;
  processedAt?: string;
  addedToTasks?: boolean;
}

interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  docsPath: string | null;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface Priority {
  id: string;
  name: string;
  color: string;
}

// Initial data
const defaultProjects: Project[] = [
  { id: 'jenns-site', name: "Jenn's Site", description: 'Personal website and portfolio', color: '#97A97C', docsPath: '/docs' },
  { id: 'fti-site', name: 'FTI Site', description: 'Work-related site project', color: '#FABF34', docsPath: null },
  { id: 'personal', name: 'Personal', description: 'Personal life, goals, and reflections', color: '#D4ED39', docsPath: null },
  { id: 'work', name: 'Work', description: 'FTI consulting work and career', color: '#546E40', docsPath: null },
  { id: 'running', name: 'Running', description: 'Marathon training and race planning', color: '#2A3C24', docsPath: null },
  { id: 'ideas', name: 'Ideas', description: 'New concepts and creative thoughts', color: '#FFCB69', docsPath: null },
];

const defaultCategories: Category[] = [
  { id: 'task', name: 'Task', icon: 'check-circle' },
  { id: 'idea', name: 'Idea', icon: 'lightbulb' },
  { id: 'bug', name: 'Bug Fix', icon: 'bug' },
  { id: 'feature', name: 'Feature', icon: 'star' },
  { id: 'note', name: 'Note', icon: 'document' },
  { id: 'question', name: 'Question', icon: 'question' },
];

const defaultPriorities: Priority[] = [
  { id: 'p1', name: 'Critical', color: '#B4654A' },
  { id: 'p2', name: 'High', color: '#FABF34' },
  { id: 'p3', name: 'Medium', color: '#97A97C' },
  { id: 'p4', name: 'Low', color: '#CBAD8C' },
];

// Icons
const Icons = {
  microphone: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  ),
  upload: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  ),
  document: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  queue: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  workflow: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  ),
  check: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  trash: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  copy: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  edit: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  arrow: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  plus: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

type TabType = 'input' | 'queue' | 'workflow';
type StatusFilter = 'all' | 'pending' | 'in_progress' | 'completed';

export default function VoiceMemosPage() {
  // State
  const [activeTab, setActiveTab] = useState<TabType>('input');
  const [memos, setMemos] = useState<VoiceMemo[]>([]);
  const [prompts, setPrompts] = useState<ParsedPrompt[]>([]);
  const [projects] = useState<Project[]>(defaultProjects);
  const [categories] = useState<Category[]>(defaultCategories);
  const [priorities] = useState<Priority[]>(defaultPriorities);

  // Input state
  const [inputText, setInputText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Parser state
  const [showParser, setShowParser] = useState(false);
  const [parsingMemo, setParsingMemo] = useState<VoiceMemo | null>(null);
  const [parsedTitle, setParsedTitle] = useState('');
  const [parsedDescription, setParsedDescription] = useState('');
  const [parsedProject, setParsedProject] = useState('jenns-site');
  const [parsedCategory, setParsedCategory] = useState('task');
  const [parsedPriority, setParsedPriority] = useState('p3');
  const [parsedTags, setParsedTags] = useState('');

  // Queue filters
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');

  // UI state
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load from localStorage
  useEffect(() => {
    const storedMemos = localStorage.getItem('jenn-voice-memos');
    const storedPrompts = localStorage.getItem('jenn-voice-prompts');

    if (storedMemos) setMemos(JSON.parse(storedMemos));
    if (storedPrompts) setPrompts(JSON.parse(storedPrompts));
  }, []);

  // Save to localStorage
  const saveMemos = (newMemos: VoiceMemo[]) => {
    localStorage.setItem('jenn-voice-memos', JSON.stringify(newMemos));
    setMemos(newMemos);
  };

  const savePrompts = (newPrompts: ParsedPrompt[]) => {
    localStorage.setItem('jenn-voice-prompts', JSON.stringify(newPrompts));
    setPrompts(newPrompts);
  };

  // Filtered prompts
  const filteredPrompts = useMemo(() => {
    return prompts.filter(p => {
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      const matchesProject = projectFilter === 'all' || p.project === projectFilter;
      return matchesStatus && matchesProject;
    }).sort((a, b) => {
      // Sort by priority first, then by date
      const priorityOrder = { p1: 0, p2: 1, p3: 2, p4: 3 };
      const priorityDiff = (priorityOrder[a.priority as keyof typeof priorityOrder] || 3) -
                           (priorityOrder[b.priority as keyof typeof priorityOrder] || 3);
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [prompts, statusFilter, projectFilter]);

  // Stats
  const stats = useMemo(() => ({
    total: prompts.length,
    pending: prompts.filter(p => p.status === 'pending').length,
    inProgress: prompts.filter(p => p.status === 'in_progress').length,
    completed: prompts.filter(p => p.status === 'completed').length,
  }), [prompts]);

  // Handle text submission
  const handleSubmitText = () => {
    if (!inputText.trim()) return;

    const newMemo: VoiceMemo = {
      id: Date.now().toString(),
      rawText: inputText.trim(),
      timestamp: new Date().toISOString(),
      source: 'text',
      processed: false,
    };

    const updatedMemos = [...memos, newMemo];
    saveMemos(updatedMemos);

    // Open parser
    setParsingMemo(newMemo);
    autoParseTranscription(inputText.trim());
    setShowParser(true);
    setInputText('');
  };

  // Handle file drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    setUploadedFile(file);
    // For now, just show a message that audio needs to be transcribed
    // In a real implementation, this would call Whisper API
  };

  // Auto-parse transcription with simple heuristics
  const autoParseTranscription = (text: string) => {
    const lower = text.toLowerCase();

    // Try to extract title (first sentence or line)
    const firstLine = text.split(/[.\n]/)[0].trim();
    setParsedTitle(firstLine.length > 60 ? firstLine.substring(0, 60) + '...' : firstLine);
    setParsedDescription(text);

    // Auto-detect project
    if (lower.includes("jenn's site") || lower.includes('website') || lower.includes('portfolio')) {
      setParsedProject('jenns-site');
    } else if (lower.includes('fti') || lower.includes('work site')) {
      setParsedProject('fti-site');
    } else if (lower.includes('running') || lower.includes('marathon') || lower.includes('race')) {
      setParsedProject('running');
    } else if (lower.includes('work') || lower.includes('consulting') || lower.includes('case')) {
      setParsedProject('work');
    } else if (lower.includes('idea') || lower.includes('concept')) {
      setParsedProject('ideas');
    } else {
      setParsedProject('personal');
    }

    // Auto-detect category
    if (lower.includes('bug') || lower.includes('fix') || lower.includes('broken')) {
      setParsedCategory('bug');
    } else if (lower.includes('feature') || lower.includes('add') || lower.includes('build')) {
      setParsedCategory('feature');
    } else if (lower.includes('idea') || lower.includes('thought') || lower.includes('maybe')) {
      setParsedCategory('idea');
    } else if (lower.includes('question') || lower.includes('how') || lower.includes('why')) {
      setParsedCategory('question');
    } else if (lower.includes('note') || lower.includes('remember')) {
      setParsedCategory('note');
    } else {
      setParsedCategory('task');
    }

    // Auto-detect priority
    if (lower.includes('urgent') || lower.includes('critical') || lower.includes('asap') || lower.includes('p1')) {
      setParsedPriority('p1');
    } else if (lower.includes('important') || lower.includes('high') || lower.includes('p2')) {
      setParsedPriority('p2');
    } else if (lower.includes('low') || lower.includes('whenever') || lower.includes('p4')) {
      setParsedPriority('p4');
    } else {
      setParsedPriority('p3');
    }

    // Auto-detect tags
    const tagPatterns = ['page', 'component', 'api', 'style', 'data', 'integration'];
    const foundTags = tagPatterns.filter(t => lower.includes(t));
    setParsedTags(foundTags.join(', '));
  };

  // Save parsed prompt
  const handleSavePrompt = () => {
    if (!parsingMemo || !parsedTitle.trim()) return;

    const newPrompt: ParsedPrompt = {
      id: Date.now().toString(),
      memoId: parsingMemo.id,
      title: parsedTitle.trim(),
      description: parsedDescription.trim(),
      project: parsedProject,
      category: parsedCategory,
      priority: parsedPriority,
      tags: parsedTags.split(',').map(t => t.trim()).filter(Boolean),
      status: 'pending',
      createdAt: new Date().toISOString(),
      addedToTasks: false,
    };

    const updatedPrompts = [...prompts, newPrompt];
    savePrompts(updatedPrompts);

    // Mark memo as processed
    const updatedMemos = memos.map(m =>
      m.id === parsingMemo.id ? { ...m, processed: true } : m
    );
    saveMemos(updatedMemos);

    // Reset parser
    setShowParser(false);
    setParsingMemo(null);
    setParsedTitle('');
    setParsedDescription('');
    setParsedTags('');

    // Switch to queue tab
    setActiveTab('queue');
  };

  // Update prompt status
  const updatePromptStatus = (id: string, status: ParsedPrompt['status']) => {
    const updatedPrompts = prompts.map(p =>
      p.id === id ? { ...p, status, processedAt: status === 'completed' ? new Date().toISOString() : p.processedAt } : p
    );
    savePrompts(updatedPrompts);
  };

  // Delete prompt
  const deletePrompt = (id: string) => {
    const updatedPrompts = prompts.filter(p => p.id !== id);
    savePrompts(updatedPrompts);
  };

  // Copy as task markdown
  const copyAsTaskMarkdown = async (prompt: ParsedPrompt) => {
    const priority = priorities.find(p => p.id === prompt.priority);
    const project = projects.find(p => p.id === prompt.project);

    const markdown = `- [ ] [${priority?.name || 'P3'}] ${prompt.title}
  - Project: ${project?.name || 'Unknown'}
  - Category: ${prompt.category}
  - Tags: ${prompt.tags.join(', ') || 'none'}
  - Description: ${prompt.description}
  - Created: ${new Date(prompt.createdAt).toLocaleDateString()}`;

    await navigator.clipboard.writeText(markdown);
    setCopiedId(prompt.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Generate Claude prompt
  const generateClaudePrompt = async (prompt: ParsedPrompt) => {
    const project = projects.find(p => p.id === prompt.project);

    const claudePrompt = `## Task from Voice Memo

**Project:** ${project?.name || 'Unknown'}
**Priority:** ${priorities.find(p => p.id === prompt.priority)?.name || 'Medium'}
**Category:** ${prompt.category}

### Request
${prompt.title}

### Details
${prompt.description}

### Tags
${prompt.tags.join(', ') || 'none'}

---
*Generated from voice memo on ${new Date(prompt.createdAt).toLocaleDateString()}*`;

    await navigator.clipboard.writeText(claudePrompt);
    setCopiedId(`claude-${prompt.id}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'input', label: 'Input', icon: Icons.microphone },
    { id: 'queue', label: 'Queue', icon: Icons.queue },
    { id: 'workflow', label: 'Workflow', icon: Icons.workflow },
  ];

  return (
    <div className="min-h-screen bg-cream">
      <div className="container-editorial pt-8 pb-16 md:pt-12 md:pb-20">
        {/* Header */}
        <div className="mb-8">
          <Link href="/io/sandbox" className="text-xs mb-4 block transition-colors hover:opacity-70" style={{ color: '#546E40' }}>
            &larr; Back to Sandbox
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1
                className="text-3xl md:text-4xl mb-2"
                style={{ fontFamily: 'var(--font-instrument)', color: '#2A3C24' }}
              >
                <span className="italic">Voice</span> Memos
              </h1>
              <p style={{ color: '#546E40' }}>
                Transform voice recordings into actionable prompts
              </p>
            </div>
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="p-2 rounded-lg transition-all hover:scale-105"
              style={{ background: '#FFF5EB', color: '#546E40' }}
              title="Show workflow instructions"
            >
              {Icons.info}
            </button>
          </div>
        </div>

        {/* Instructions Panel */}
        {showInstructions && (
          <div
            className="mb-8 p-6 rounded-xl animate-in"
            style={{ background: 'linear-gradient(160deg, #2A3C24 0%, #3B412D 50%, #546E40 100%)' }}
          >
            <h2 className="text-xl mb-4" style={{ fontFamily: 'var(--font-instrument)', color: '#FFF5EB' }}>
              Voice Recorder Workflow
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Export from Recorder */}
              <div>
                <h3 className="text-sm uppercase tracking-wider mb-3" style={{ color: '#FABF34' }}>
                  1. Export from Recorder
                </h3>
                <div className="space-y-2 text-sm" style={{ color: '#F7E5DA' }}>
                  <p><strong>Device:</strong> 64GB Digital Voice Recorder (B0DZWQ9WWJ)</p>
                  <ol className="list-decimal list-inside space-y-1 ml-2" style={{ color: '#CBAD8C' }}>
                    <li>Connect recorder via USB to computer</li>
                    <li>Access recorder as external drive</li>
                    <li>Find recordings in RECORD folder</li>
                    <li>Copy .WAV or .MP3 files to computer</li>
                    <li>Files are named by date/time</li>
                  </ol>
                </div>
              </div>

              {/* Transcription Options */}
              <div>
                <h3 className="text-sm uppercase tracking-wider mb-3" style={{ color: '#FABF34' }}>
                  2. Transcription Options
                </h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg" style={{ background: 'rgba(255,245,235,0.1)' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded" style={{ background: '#D4ED39', color: '#2A3C24' }}>
                        Recommended
                      </span>
                      <span className="font-medium" style={{ color: '#FFF5EB' }}>OpenAI Whisper API</span>
                    </div>
                    <p className="text-xs" style={{ color: '#CBAD8C' }}>
                      Most accurate. $0.006/minute. Use via API or Whisper desktop app.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ background: 'rgba(255,245,235,0.05)' }}>
                    <span className="font-medium block mb-1" style={{ color: '#FFF5EB' }}>Whisper Local (Free)</span>
                    <p className="text-xs" style={{ color: '#CBAD8C' }}>
                      Install whisper.cpp. Runs on your Mac. Good for privacy.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ background: 'rgba(255,245,235,0.05)' }}>
                    <span className="font-medium block mb-1" style={{ color: '#FFF5EB' }}>Otter.ai / Rev</span>
                    <p className="text-xs" style={{ color: '#CBAD8C' }}>
                      Free tier available. Good for longer recordings.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4" style={{ borderTop: '1px solid rgba(203,173,140,0.2)' }}>
              <h3 className="text-sm uppercase tracking-wider mb-3" style={{ color: '#FABF34' }}>
                3. Processing Workflow
              </h3>
              <div className="flex items-center gap-3 flex-wrap text-sm" style={{ color: '#F7E5DA' }}>
                <span className="px-3 py-1.5 rounded-lg" style={{ background: 'rgba(212,237,57,0.2)' }}>
                  Record memo
                </span>
                <span style={{ color: '#CBAD8C' }}>&rarr;</span>
                <span className="px-3 py-1.5 rounded-lg" style={{ background: 'rgba(212,237,57,0.2)' }}>
                  Transcribe audio
                </span>
                <span style={{ color: '#CBAD8C' }}>&rarr;</span>
                <span className="px-3 py-1.5 rounded-lg" style={{ background: 'rgba(212,237,57,0.2)' }}>
                  Paste text here
                </span>
                <span style={{ color: '#CBAD8C' }}>&rarr;</span>
                <span className="px-3 py-1.5 rounded-lg" style={{ background: 'rgba(212,237,57,0.2)' }}>
                  Parse & categorize
                </span>
                <span style={{ color: '#CBAD8C' }}>&rarr;</span>
                <span className="px-3 py-1.5 rounded-lg" style={{ background: 'rgba(212,237,57,0.2)' }}>
                  Add to TASKS.md
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowInstructions(false)}
              className="mt-4 text-xs transition-opacity hover:opacity-70"
              style={{ color: '#97A97C' }}
            >
              Close instructions
            </button>
          </div>
        )}

        {/* Stats Bar */}
        <div
          className="grid grid-cols-4 gap-4 mb-8 p-4 rounded-xl"
          style={{ background: '#FFF5EB', border: '1px solid rgba(203,173,140,0.3)' }}
        >
          <div className="text-center">
            <span className="block text-2xl font-mono" style={{ color: '#FABF34' }}>{stats.total}</span>
            <span className="text-xs uppercase tracking-wider" style={{ color: '#97A97C' }}>Total</span>
          </div>
          <div className="text-center">
            <span className="block text-2xl font-mono" style={{ color: '#B4654A' }}>{stats.pending}</span>
            <span className="text-xs uppercase tracking-wider" style={{ color: '#97A97C' }}>Pending</span>
          </div>
          <div className="text-center">
            <span className="block text-2xl font-mono" style={{ color: '#546E40' }}>{stats.inProgress}</span>
            <span className="text-xs uppercase tracking-wider" style={{ color: '#97A97C' }}>In Progress</span>
          </div>
          <div className="text-center">
            <span className="block text-2xl font-mono" style={{ color: '#97A97C' }}>{stats.completed}</span>
            <span className="text-xs uppercase tracking-wider" style={{ color: '#97A97C' }}>Complete</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b pb-4" style={{ borderColor: 'rgba(151,169,124,0.3)' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                background: activeTab === tab.id ? '#2A3C24' : 'transparent',
                color: activeTab === tab.id ? '#FFF5EB' : '#3B412D',
                border: activeTab === tab.id ? 'none' : '1px solid rgba(151,169,124,0.3)',
              }}
            >
              {tab.icon}
              {tab.label}
              {tab.id === 'queue' && stats.pending > 0 && (
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full"
                  style={{ background: '#B4654A', color: '#FFF5EB' }}
                >
                  {stats.pending}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-in">
          {/* Input Tab */}
          {activeTab === 'input' && (
            <div className="space-y-6">
              {/* Text Input */}
              <div
                className="p-6 rounded-xl"
                style={{ background: '#FFF5EB', border: '1px solid rgba(203,173,140,0.3)' }}
              >
                <h2
                  className="text-xl mb-4 flex items-center gap-2"
                  style={{ fontFamily: 'var(--font-instrument)', color: '#2A3C24' }}
                >
                  {Icons.document}
                  Paste Transcription
                </h2>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste your voice memo transcription here...

Example: 'For Jenn's Site, I need to add a new page for the running schedule. It should show the Pfitz 18/70 plan with my actual runs compared to planned. Priority is high since Boston is in April.'"
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl text-sm resize-none"
                  style={{
                    background: '#FAF3E8',
                    color: '#2A3C24',
                    border: '1px solid rgba(151,169,124,0.3)',
                    outline: 'none'
                  }}
                />
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs" style={{ color: '#97A97C' }}>
                    {inputText.length} characters
                  </span>
                  <button
                    onClick={handleSubmitText}
                    disabled={!inputText.trim()}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all hover:scale-[1.02]"
                    style={{
                      background: inputText.trim() ? 'linear-gradient(135deg, #97A97C 0%, #546E40 100%)' : '#EDE5D8',
                      color: inputText.trim() ? '#FFF5EB' : '#CBAD8C',
                      cursor: inputText.trim() ? 'pointer' : 'not-allowed'
                    }}
                  >
                    Parse & Categorize
                    {Icons.arrow}
                  </button>
                </div>
              </div>

              {/* File Upload */}
              <div
                className={`p-8 rounded-xl border-2 border-dashed text-center transition-all ${isDragging ? 'scale-[1.01]' : ''}`}
                style={{
                  background: isDragging ? 'rgba(212,237,57,0.1)' : '#FFF5EB',
                  borderColor: isDragging ? '#D4ED39' : 'rgba(203,173,140,0.3)'
                }}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(151,169,124,0.2)', color: '#546E40' }}
                  >
                    {Icons.upload}
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: '#2A3C24' }}>
                      Drop audio file or transcription
                    </p>
                    <p className="text-sm" style={{ color: '#97A97C' }}>
                      Supports .txt, .mp3, .wav, .m4a
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.mp3,.wav,.m4a"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-full text-sm transition-all hover:scale-[1.02]"
                    style={{ background: '#EDE5D8', color: '#546E40' }}
                  >
                    Browse files
                  </button>
                </div>
              </div>

              {uploadedFile && (
                <div
                  className="p-4 rounded-xl flex items-center justify-between"
                  style={{ background: 'rgba(212,237,57,0.1)', border: '1px solid rgba(212,237,57,0.3)' }}
                >
                  <div className="flex items-center gap-3">
                    {Icons.document}
                    <div>
                      <p className="font-medium" style={{ color: '#2A3C24' }}>{uploadedFile.name}</p>
                      <p className="text-xs" style={{ color: '#97A97C' }}>
                        {(uploadedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <p className="text-sm" style={{ color: '#546E40' }}>
                    Audio files need to be transcribed first using Whisper or similar service.
                  </p>
                </div>
              )}

              {/* Recent Memos */}
              {memos.filter(m => !m.processed).length > 0 && (
                <div>
                  <h3 className="text-sm uppercase tracking-wider mb-4" style={{ color: '#CBAD8C' }}>
                    Unprocessed Memos
                  </h3>
                  <div className="space-y-3">
                    {memos.filter(m => !m.processed).map(memo => (
                      <div
                        key={memo.id}
                        className="p-4 rounded-xl group"
                        style={{ background: '#FFF5EB', border: '1px solid rgba(203,173,140,0.3)' }}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <p className="text-sm line-clamp-2" style={{ color: '#2A3C24' }}>
                              {memo.rawText}
                            </p>
                            <p className="text-xs mt-2" style={{ color: '#97A97C' }}>
                              {new Date(memo.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setParsingMemo(memo);
                              autoParseTranscription(memo.rawText);
                              setShowParser(true);
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-[1.02]"
                            style={{ background: '#546E40', color: '#FFF5EB' }}
                          >
                            Process
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Queue Tab */}
          {activeTab === 'queue' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider" style={{ color: '#CBAD8C' }}>Status:</span>
                  <div className="flex gap-1">
                    {(['all', 'pending', 'in_progress', 'completed'] as StatusFilter[]).map(status => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className="px-3 py-1 rounded-full text-xs capitalize transition-all"
                        style={{
                          background: statusFilter === status ? '#546E40' : 'transparent',
                          color: statusFilter === status ? '#FFF5EB' : '#97A97C',
                          border: statusFilter === status ? 'none' : '1px solid rgba(151,169,124,0.3)'
                        }}
                      >
                        {status.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider" style={{ color: '#CBAD8C' }}>Project:</span>
                  <select
                    value={projectFilter}
                    onChange={(e) => setProjectFilter(e.target.value)}
                    className="px-3 py-1 rounded-lg text-sm"
                    style={{ background: '#FFF5EB', color: '#2A3C24', border: '1px solid rgba(151,169,124,0.3)' }}
                  >
                    <option value="all">All Projects</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Prompts List */}
              {filteredPrompts.length === 0 ? (
                <div
                  className="text-center py-16 rounded-xl"
                  style={{ background: '#FFF5EB', border: '1px solid rgba(203,173,140,0.3)' }}
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(151,169,124,0.2)' }}>
                    {Icons.queue}
                  </div>
                  <h3 className="text-lg mb-2" style={{ fontFamily: 'var(--font-instrument)', color: '#2A3C24' }}>
                    No prompts in queue
                  </h3>
                  <p className="text-sm" style={{ color: '#97A97C' }}>
                    Process voice memos to add prompts here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPrompts.map(prompt => {
                    const project = projects.find(p => p.id === prompt.project);
                    const priority = priorities.find(p => p.id === prompt.priority);

                    return (
                      <div
                        key={prompt.id}
                        className="p-5 rounded-xl group transition-all hover:shadow-lg"
                        style={{
                          background: '#FFF5EB',
                          border: '1px solid rgba(203,173,140,0.3)',
                          borderLeft: `4px solid ${project?.color || '#97A97C'}`
                        }}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            {/* Header */}
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <span
                                className="px-2 py-0.5 rounded text-xs font-medium"
                                style={{ background: priority?.color || '#97A97C', color: '#FFF5EB' }}
                              >
                                {priority?.name || 'Medium'}
                              </span>
                              <span
                                className="px-2 py-0.5 rounded text-xs"
                                style={{ background: 'rgba(151,169,124,0.2)', color: '#546E40' }}
                              >
                                {prompt.category}
                              </span>
                              <span
                                className="px-2 py-0.5 rounded text-xs font-medium"
                                style={{ background: project?.color || '#97A97C', color: '#FFF5EB' }}
                              >
                                {project?.name || 'Unknown'}
                              </span>
                            </div>

                            {/* Title */}
                            <h3 className="text-lg font-medium mb-2" style={{ color: '#2A3C24' }}>
                              {prompt.title}
                            </h3>

                            {/* Description */}
                            <p className="text-sm mb-3 line-clamp-2" style={{ color: '#546E40' }}>
                              {prompt.description}
                            </p>

                            {/* Tags */}
                            {prompt.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-3">
                                {prompt.tags.map((tag, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 rounded-full text-xs"
                                    style={{ background: '#EDE5D8', color: '#97A97C' }}
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Meta */}
                            <p className="text-xs" style={{ color: '#CBAD8C' }}>
                              Created {new Date(prompt.createdAt).toLocaleDateString()}
                              {prompt.processedAt && ` / Completed ${new Date(prompt.processedAt).toLocaleDateString()}`}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-2">
                            {/* Status buttons */}
                            <div className="flex gap-1">
                              {prompt.status !== 'completed' && (
                                <>
                                  {prompt.status === 'pending' && (
                                    <button
                                      onClick={() => updatePromptStatus(prompt.id, 'in_progress')}
                                      className="p-2 rounded-lg text-xs transition-all hover:scale-105"
                                      style={{ background: '#546E40', color: '#FFF5EB' }}
                                      title="Start working"
                                    >
                                      {Icons.arrow}
                                    </button>
                                  )}
                                  <button
                                    onClick={() => updatePromptStatus(prompt.id, 'completed')}
                                    className="p-2 rounded-lg text-xs transition-all hover:scale-105"
                                    style={{ background: '#97A97C', color: '#FFF5EB' }}
                                    title="Mark complete"
                                  >
                                    {Icons.check}
                                  </button>
                                </>
                              )}
                            </div>

                            {/* Copy buttons */}
                            <button
                              onClick={() => copyAsTaskMarkdown(prompt)}
                              className="p-2 rounded-lg text-xs transition-all hover:scale-105"
                              style={{ background: '#EDE5D8', color: '#546E40' }}
                              title="Copy as TASKS.md format"
                            >
                              {copiedId === prompt.id ? Icons.check : Icons.copy}
                            </button>
                            <button
                              onClick={() => generateClaudePrompt(prompt)}
                              className="p-2 rounded-lg text-xs transition-all hover:scale-105"
                              style={{ background: '#FABF34', color: '#2A3C24' }}
                              title="Copy as Claude prompt"
                            >
                              {copiedId === `claude-${prompt.id}` ? Icons.check : Icons.document}
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => deletePrompt(prompt.id)}
                              className="p-2 rounded-lg text-xs transition-all hover:scale-105 opacity-0 group-hover:opacity-100"
                              style={{ background: 'rgba(180,101,74,0.1)', color: '#B4654A' }}
                              title="Delete"
                            >
                              {Icons.trash}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Workflow Tab */}
          {activeTab === 'workflow' && (
            <div className="space-y-8">
              {/* Quick Reference */}
              <div
                className="p-6 rounded-xl"
                style={{ background: 'linear-gradient(160deg, #2A3C24 0%, #3B412D 50%, #546E40 100%)' }}
              >
                <h2 className="text-xl mb-6" style={{ fontFamily: 'var(--font-instrument)', color: '#FFF5EB' }}>
                  Complete Workflow Reference
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                  {/* Step 1 */}
                  <div className="p-4 rounded-xl" style={{ background: 'rgba(255,245,235,0.1)' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: '#D4ED39', color: '#2A3C24' }}>
                        1
                      </span>
                      <span className="font-medium" style={{ color: '#FFF5EB' }}>Record</span>
                    </div>
                    <ul className="space-y-2 text-sm" style={{ color: '#CBAD8C' }}>
                      <li>Use voice recorder (B0DZWQ9WWJ)</li>
                      <li>64GB storage = ~1000+ hours</li>
                      <li>Noise cancellation for clarity</li>
                      <li>One-touch recording start</li>
                    </ul>
                  </div>

                  {/* Step 2 */}
                  <div className="p-4 rounded-xl" style={{ background: 'rgba(255,245,235,0.1)' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: '#FABF34', color: '#2A3C24' }}>
                        2
                      </span>
                      <span className="font-medium" style={{ color: '#FFF5EB' }}>Transcribe</span>
                    </div>
                    <ul className="space-y-2 text-sm" style={{ color: '#CBAD8C' }}>
                      <li>Connect recorder via USB</li>
                      <li>Export .WAV/.MP3 files</li>
                      <li>Use Whisper API ($0.006/min)</li>
                      <li>Or run whisper.cpp locally</li>
                    </ul>
                  </div>

                  {/* Step 3 */}
                  <div className="p-4 rounded-xl" style={{ background: 'rgba(255,245,235,0.1)' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: '#97A97C', color: '#2A3C24' }}>
                        3
                      </span>
                      <span className="font-medium" style={{ color: '#FFF5EB' }}>Process</span>
                    </div>
                    <ul className="space-y-2 text-sm" style={{ color: '#CBAD8C' }}>
                      <li>Paste transcription here</li>
                      <li>Auto-parse extracts details</li>
                      <li>Assign project & priority</li>
                      <li>Add to queue</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Transcription Services */}
              <div>
                <h3 className="text-lg mb-4" style={{ fontFamily: 'var(--font-instrument)', color: '#2A3C24' }}>
                  Transcription Service Comparison
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div
                    className="p-5 rounded-xl relative overflow-hidden"
                    style={{ background: '#FFF5EB', border: '2px solid #D4ED39' }}
                  >
                    <span
                      className="absolute top-0 right-0 px-3 py-1 text-xs font-bold"
                      style={{ background: '#D4ED39', color: '#2A3C24' }}
                    >
                      RECOMMENDED
                    </span>
                    <h4 className="text-lg font-medium mb-2" style={{ color: '#2A3C24' }}>OpenAI Whisper API</h4>
                    <p className="text-sm mb-3" style={{ color: '#546E40' }}>
                      Best accuracy, especially for technical content. Works with any audio format.
                    </p>
                    <div className="space-y-1 text-sm" style={{ color: '#97A97C' }}>
                      <p><strong>Cost:</strong> $0.006/minute (~$0.36/hour)</p>
                      <p><strong>Setup:</strong> API key required</p>
                      <p><strong>Speed:</strong> Near real-time</p>
                    </div>
                    <a
                      href="https://platform.openai.com/docs/guides/speech-to-text"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-[1.02]"
                      style={{ background: '#2A3C24', color: '#FFF5EB' }}
                    >
                      Get API Key &rarr;
                    </a>
                  </div>

                  <div
                    className="p-5 rounded-xl"
                    style={{ background: '#FFF5EB', border: '1px solid rgba(203,173,140,0.3)' }}
                  >
                    <h4 className="text-lg font-medium mb-2" style={{ color: '#2A3C24' }}>Whisper Local (whisper.cpp)</h4>
                    <p className="text-sm mb-3" style={{ color: '#546E40' }}>
                      Free, private, runs on your Mac. Requires initial setup.
                    </p>
                    <div className="space-y-1 text-sm" style={{ color: '#97A97C' }}>
                      <p><strong>Cost:</strong> Free</p>
                      <p><strong>Setup:</strong> brew install whisper-cpp</p>
                      <p><strong>Speed:</strong> Depends on model size</p>
                    </div>
                    <a
                      href="https://github.com/ggerganov/whisper.cpp"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-[1.02]"
                      style={{ background: '#97A97C', color: '#FFF5EB' }}
                    >
                      View on GitHub &rarr;
                    </a>
                  </div>

                  <div
                    className="p-5 rounded-xl"
                    style={{ background: '#FFF5EB', border: '1px solid rgba(203,173,140,0.3)' }}
                  >
                    <h4 className="text-lg font-medium mb-2" style={{ color: '#2A3C24' }}>Otter.ai</h4>
                    <p className="text-sm mb-3" style={{ color: '#546E40' }}>
                      Good for meetings and longer recordings. Has free tier.
                    </p>
                    <div className="space-y-1 text-sm" style={{ color: '#97A97C' }}>
                      <p><strong>Cost:</strong> Free (300 min/month) or Pro ($8.33/month)</p>
                      <p><strong>Setup:</strong> Create account, upload file</p>
                      <p><strong>Speed:</strong> ~1 min per minute of audio</p>
                    </div>
                    <a
                      href="https://otter.ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-[1.02]"
                      style={{ background: '#97A97C', color: '#FFF5EB' }}
                    >
                      Try Otter.ai &rarr;
                    </a>
                  </div>

                  <div
                    className="p-5 rounded-xl"
                    style={{ background: '#FFF5EB', border: '1px solid rgba(203,173,140,0.3)' }}
                  >
                    <h4 className="text-lg font-medium mb-2" style={{ color: '#2A3C24' }}>MacWhisper (Desktop App)</h4>
                    <p className="text-sm mb-3" style={{ color: '#546E40' }}>
                      Native Mac app using Whisper. One-time purchase, runs locally.
                    </p>
                    <div className="space-y-1 text-sm" style={{ color: '#97A97C' }}>
                      <p><strong>Cost:</strong> $29 one-time (Pro version)</p>
                      <p><strong>Setup:</strong> Download from App Store</p>
                      <p><strong>Speed:</strong> Fast on Apple Silicon</p>
                    </div>
                    <a
                      href="https://goodsnooze.gumroad.com/l/macwhisper"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-[1.02]"
                      style={{ background: '#97A97C', color: '#FFF5EB' }}
                    >
                      Get MacWhisper &rarr;
                    </a>
                  </div>
                </div>
              </div>

              {/* Integration with TASKS.md */}
              <div
                className="p-6 rounded-xl"
                style={{ background: '#FFF5EB', border: '1px solid rgba(203,173,140,0.3)' }}
              >
                <h3 className="text-lg mb-4" style={{ fontFamily: 'var(--font-instrument)', color: '#2A3C24' }}>
                  Adding to TASKS.md
                </h3>
                <p className="text-sm mb-4" style={{ color: '#546E40' }}>
                  When you click "Copy as TASKS.md format" on any prompt, it generates markdown you can paste directly into your task file:
                </p>
                <pre
                  className="p-4 rounded-lg text-sm overflow-x-auto"
                  style={{ background: '#2A3C24', color: '#F7E5DA' }}
                >
{`- [ ] [P2] Add running schedule page with Pfitz 18/70 plan
  - Project: Jenn's Site
  - Category: feature
  - Tags: running, schedule, page
  - Description: Show planned vs actual runs for Boston training
  - Created: 1/2/2026`}
                </pre>
                <p className="text-sm mt-4" style={{ color: '#97A97C' }}>
                  Location: <code style={{ background: '#EDE5D8', padding: '2px 6px', borderRadius: '4px' }}>/docs/TASKS.md</code>
                </p>
              </div>

              {/* Tips */}
              <div>
                <h3 className="text-lg mb-4" style={{ fontFamily: 'var(--font-instrument)', color: '#2A3C24' }}>
                  Recording Tips for Better Transcription
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { title: 'Be Specific', tip: 'Say the project name clearly: "For Jenn\'s Site, I need..."' },
                    { title: 'State Priority', tip: 'Include priority words: "urgent", "high priority", "when you have time"' },
                    { title: 'Context Helps', tip: 'Mention related pages or features: "On the running page, similar to how the health page works..."' },
                    { title: 'Keep it Short', tip: 'One idea per memo. Easier to parse and track.' },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl"
                      style={{ background: '#FFF5EB', border: '1px solid rgba(203,173,140,0.3)' }}
                    >
                      <h4 className="font-medium mb-1" style={{ color: '#2A3C24' }}>{item.title}</h4>
                      <p className="text-sm" style={{ color: '#546E40' }}>{item.tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Parser Modal */}
        {showParser && parsingMemo && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(42,60,36,0.8)' }}
            onClick={() => setShowParser(false)}
          >
            <div
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 animate-in"
              style={{ background: '#FFF5EB' }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl mb-6" style={{ fontFamily: 'var(--font-instrument)', color: '#2A3C24' }}>
                Parse Voice Memo
              </h2>

              {/* Original Text */}
              <div className="mb-6">
                <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: '#CBAD8C' }}>
                  Original Transcription
                </label>
                <div
                  className="p-3 rounded-lg text-sm max-h-32 overflow-y-auto"
                  style={{ background: '#EDE5D8', color: '#546E40' }}
                >
                  {parsingMemo.rawText}
                </div>
              </div>

              {/* Parsed Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: '#CBAD8C' }}>
                    Title
                  </label>
                  <input
                    type="text"
                    value={parsedTitle}
                    onChange={(e) => setParsedTitle(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg text-sm"
                    style={{ background: '#FAF3E8', color: '#2A3C24', border: '1px solid rgba(151,169,124,0.3)' }}
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: '#CBAD8C' }}>
                    Description
                  </label>
                  <textarea
                    value={parsedDescription}
                    onChange={(e) => setParsedDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg text-sm resize-none"
                    style={{ background: '#FAF3E8', color: '#2A3C24', border: '1px solid rgba(151,169,124,0.3)' }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: '#CBAD8C' }}>
                      Project
                    </label>
                    <select
                      value={parsedProject}
                      onChange={(e) => setParsedProject(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm"
                      style={{ background: '#FAF3E8', color: '#2A3C24', border: '1px solid rgba(151,169,124,0.3)' }}
                    >
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: '#CBAD8C' }}>
                      Category
                    </label>
                    <select
                      value={parsedCategory}
                      onChange={(e) => setParsedCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm"
                      style={{ background: '#FAF3E8', color: '#2A3C24', border: '1px solid rgba(151,169,124,0.3)' }}
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: '#CBAD8C' }}>
                      Priority
                    </label>
                    <select
                      value={parsedPriority}
                      onChange={(e) => setParsedPriority(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm"
                      style={{ background: '#FAF3E8', color: '#2A3C24', border: '1px solid rgba(151,169,124,0.3)' }}
                    >
                      {priorities.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: '#CBAD8C' }}>
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={parsedTags}
                    onChange={(e) => setParsedTags(e.target.value)}
                    placeholder="page, component, style..."
                    className="w-full px-4 py-2 rounded-lg text-sm"
                    style={{ background: '#FAF3E8', color: '#2A3C24', border: '1px solid rgba(151,169,124,0.3)' }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 mt-6 pt-4" style={{ borderTop: '1px solid rgba(203,173,140,0.3)' }}>
                <button
                  onClick={() => setShowParser(false)}
                  className="px-4 py-2 rounded-full text-sm transition-all"
                  style={{ background: '#EDE5D8', color: '#546E40' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePrompt}
                  disabled={!parsedTitle.trim()}
                  className="flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all hover:scale-[1.02]"
                  style={{
                    background: parsedTitle.trim() ? 'linear-gradient(135deg, #97A97C 0%, #546E40 100%)' : '#EDE5D8',
                    color: parsedTitle.trim() ? '#FFF5EB' : '#CBAD8C',
                    cursor: parsedTitle.trim() ? 'pointer' : 'not-allowed'
                  }}
                >
                  {Icons.plus}
                  Add to Queue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 pt-8" style={{ borderTop: '1px solid rgba(203,173,140,0.3)' }}>
          <div className="flex justify-between items-center">
            <Link
              href="/io/sandbox"
              className="text-xs transition-colors hover:opacity-70"
              style={{ color: '#546E40' }}
            >
              &larr; Back to Sandbox
            </Link>
            <span className="text-xs" style={{ color: '#CBAD8C' }}>
              Voice Recorder: Amazon B0DZWQ9WWJ
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
