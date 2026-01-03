'use client';

import { useState, useEffect, useMemo } from 'react';
import workflowData from '@/data/workflow-questions.json';

// Types
interface WorkflowQuestion {
  id: string;
  question: string;
  questionType: 'technical' | 'design' | 'process';
  buildContext: string;
  category: string;
  timestamp: string;
  frequency: number;
  themeId?: string;
  tags: string[];
  resolved: boolean;
  resolution?: string;
}

interface QuestionTheme {
  id: string;
  name: string;
  description: string;
  questionIds: string[];
  category: 'technical' | 'design' | 'process' | 'mixed';
  frequency: number;
  insightSummary?: string;
  promptScaffold?: string;
}

interface Build {
  id: string;
  name: string;
  color: string;
  description: string;
  active: boolean;
}

type TabType = 'capture' | 'questions' | 'themes' | 'insights' | 'export';
type QuestionType = 'technical' | 'design' | 'process';
type SortOption = 'newest' | 'most-asked' | 'alphabetical';

// Color maps
const questionTypeColors: Record<QuestionType, string> = {
  technical: '#FABF34',
  design: '#97A97C',
  process: '#CBAD8C',
};

const questionTypeLabels: Record<QuestionType, string> = {
  technical: 'Technical Decision',
  design: 'Design/Aesthetic',
  process: 'Process/Workflow',
};

// Helper: Calculate string similarity (simple Jaccard-like)
const calculateSimilarity = (str1: string, str2: string): number => {
  const words1 = new Set(str1.toLowerCase().split(/\s+/));
  const words2 = new Set(str2.toLowerCase().split(/\s+/));
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  return intersection.size / union.size;
};

export default function WorkflowInsightsPage() {
  // Tab state
  const [activeTab, setActiveTab] = useState<TabType>('capture');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Data state
  const [questions, setQuestions] = useState<WorkflowQuestion[]>([]);
  const [themes, setThemes] = useState<QuestionTheme[]>([]);
  const [builds] = useState<Build[]>(workflowData.builds);

  // Capture form state
  const [captureForm, setCaptureForm] = useState({
    question: '',
    questionType: 'technical' as QuestionType,
    buildContext: 'jenns-site',
    category: '',
    tags: '',
  });

  // Questions tab state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBuild, setFilterBuild] = useState<string>('all');
  const [filterType, setFilterType] = useState<QuestionType | 'all'>('all');
  const [filterResolved, setFilterResolved] = useState<'all' | 'resolved' | 'unresolved'>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  // Theme creation state
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [newTheme, setNewTheme] = useState({ name: '', description: '' });
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);

  // Export state
  const [exportSelection, setExportSelection] = useState<string[]>([]);
  const [exportTemplate, setExportTemplate] = useState<'context' | 'decision' | 'design' | 'custom'>('context');

  // Load from localStorage on mount
  useEffect(() => {
    const storedQuestions = localStorage.getItem('jenn-workflow-questions');
    const storedThemes = localStorage.getItem('jenn-workflow-themes');

    if (storedQuestions) {
      setQuestions(JSON.parse(storedQuestions));
    }
    if (storedThemes) {
      setThemes(JSON.parse(storedThemes));
    }
  }, []);

  // Save helpers
  const saveQuestions = (newQuestions: WorkflowQuestion[]) => {
    localStorage.setItem('jenn-workflow-questions', JSON.stringify(newQuestions));
    setQuestions(newQuestions);
  };

  const saveThemes = (newThemes: QuestionTheme[]) => {
    localStorage.setItem('jenn-workflow-themes', JSON.stringify(newThemes));
    setThemes(newThemes);
  };

  // Copy to clipboard
  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Add question
  const addQuestion = () => {
    if (!captureForm.question.trim()) return;

    // Check for similar existing questions
    const existingSimilar = questions.find(q =>
      calculateSimilarity(q.question, captureForm.question) > 0.8
    );

    if (existingSimilar) {
      // Increment frequency instead of creating duplicate
      const updated = questions.map(q =>
        q.id === existingSimilar.id
          ? { ...q, frequency: q.frequency + 1, timestamp: new Date().toISOString() }
          : q
      );
      saveQuestions(updated);
      setCaptureForm({ ...captureForm, question: '', category: '', tags: '' });
      return;
    }

    const newQuestion: WorkflowQuestion = {
      id: Date.now().toString(),
      question: captureForm.question.trim(),
      questionType: captureForm.questionType,
      buildContext: captureForm.buildContext,
      category: captureForm.category.trim(),
      timestamp: new Date().toISOString(),
      frequency: 1,
      tags: captureForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      resolved: false,
    };

    saveQuestions([newQuestion, ...questions]);
    setCaptureForm({ ...captureForm, question: '', category: '', tags: '' });
  };

  // Increment frequency
  const incrementFrequency = (id: string) => {
    const updated = questions.map(q =>
      q.id === id ? { ...q, frequency: q.frequency + 1 } : q
    );
    saveQuestions(updated);
  };

  // Toggle resolved
  const toggleResolved = (id: string, resolution?: string) => {
    const updated = questions.map(q =>
      q.id === id ? { ...q, resolved: !q.resolved, resolution } : q
    );
    saveQuestions(updated);
  };

  // Delete question
  const deleteQuestion = (id: string) => {
    const updated = questions.filter(q => q.id !== id);
    saveQuestions(updated);
  };

  // Create theme
  const createTheme = () => {
    if (!newTheme.name.trim() || selectedQuestionIds.length === 0) return;

    const selectedQuestions = questions.filter(q => selectedQuestionIds.includes(q.id));
    const types = new Set(selectedQuestions.map(q => q.questionType));
    const category: QuestionTheme['category'] = types.size > 1 ? 'mixed' : [...types][0] as QuestionType;

    const theme: QuestionTheme = {
      id: Date.now().toString(),
      name: newTheme.name.trim(),
      description: newTheme.description.trim(),
      questionIds: selectedQuestionIds,
      category,
      frequency: selectedQuestions.reduce((sum, q) => sum + q.frequency, 0),
    };

    saveThemes([...themes, theme]);

    // Update questions with theme ID
    const updatedQuestions = questions.map(q =>
      selectedQuestionIds.includes(q.id) ? { ...q, themeId: theme.id } : q
    );
    saveQuestions(updatedQuestions);

    setNewTheme({ name: '', description: '' });
    setSelectedQuestionIds([]);
    setShowThemeModal(false);
  };

  // Auto-suggest themes based on tags
  const suggestedThemes = useMemo(() => {
    const tagGroups: Record<string, string[]> = {};
    questions.forEach(q => {
      q.tags.forEach(tag => {
        if (!tagGroups[tag]) tagGroups[tag] = [];
        tagGroups[tag].push(q.id);
      });
    });
    return Object.entries(tagGroups)
      .filter(([, ids]) => ids.length >= 3)
      .map(([tag, ids]) => ({ tag, questionIds: ids, count: ids.length }))
      .sort((a, b) => b.count - a.count);
  }, [questions]);

  // Filtered and sorted questions
  const filteredQuestions = useMemo(() => {
    let result = [...questions];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(q =>
        q.question.toLowerCase().includes(query) ||
        q.category.toLowerCase().includes(query) ||
        q.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    // Build filter
    if (filterBuild !== 'all') {
      result = result.filter(q => q.buildContext === filterBuild);
    }

    // Type filter
    if (filterType !== 'all') {
      result = result.filter(q => q.questionType === filterType);
    }

    // Resolved filter
    if (filterResolved !== 'all') {
      result = result.filter(q =>
        filterResolved === 'resolved' ? q.resolved : !q.resolved
      );
    }

    // Sort
    switch (sortOption) {
      case 'newest':
        result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        break;
      case 'most-asked':
        result.sort((a, b) => b.frequency - a.frequency);
        break;
      case 'alphabetical':
        result.sort((a, b) => a.question.localeCompare(b.question));
        break;
    }

    return result;
  }, [questions, searchQuery, filterBuild, filterType, filterResolved, sortOption]);

  // Stats calculations
  const stats = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const questionsThisWeek = questions.filter(q => new Date(q.timestamp) > weekAgo).length;

    const buildCounts: Record<string, number> = {};
    const typeCounts: Record<string, number> = {};

    questions.forEach(q => {
      buildCounts[q.buildContext] = (buildCounts[q.buildContext] || 0) + 1;
      typeCounts[q.questionType] = (typeCounts[q.questionType] || 0) + 1;
    });

    const topBuild = Object.entries(buildCounts).sort((a, b) => b[1] - a[1])[0];
    const topType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0];
    const mostAsked = [...questions].sort((a, b) => b.frequency - a.frequency)[0];

    return {
      total: questions.length,
      thisWeek: questionsThisWeek,
      topBuild: topBuild ? topBuild[0] : '',
      topType: topType ? topType[0] : '',
      mostAsked,
      buildCounts,
      typeCounts,
    };
  }, [questions]);

  // Generate export scaffold
  const generateScaffold = () => {
    const selectedQuestions = questions.filter(q => exportSelection.includes(q.id));

    const templates = {
      context: () => {
        const buildName = builds.find(b => b.id === filterBuild)?.name || 'All Builds';
        return `# Context Dump: ${buildName}

## Questions I've Been Asking
${selectedQuestions.map(q => `- ${q.question} (asked ${q.frequency}x, ${q.questionType})`).join('\n')}

## What This Tells You
These are recurring questions and decisions I face when working on ${buildName}. Please:
- Remember patterns from my previous questions
- Provide solutions consistent with established preferences
- Flag contradictions with earlier decisions

## Build Context
${builds.filter(b => b.active).map(b => `- **${b.name}**: ${b.description}`).join('\n')}`;
      },
      decision: () => {
        const techQuestions = selectedQuestions.filter(q => q.questionType === 'technical');
        return `# Technical Decisions Log

## Decisions Made
${techQuestions.filter(q => q.resolved).map(q => `### ${q.question}
**Resolution:** ${q.resolution || 'Not documented'}
**Context:** ${q.buildContext}
`).join('\n')}

## Open Questions
${techQuestions.filter(q => !q.resolved).map(q => `- ${q.question}`).join('\n')}`;
      },
      design: () => {
        const designQuestions = selectedQuestions.filter(q => q.questionType === 'design');
        return `# Design Questions & Preferences

## Aesthetic Decisions
${designQuestions.map(q => `- **${q.question}**
  - Category: ${q.category}
  - Tags: ${q.tags.join(', ')}
  - ${q.resolved ? `Resolved: ${q.resolution}` : 'Still exploring'}`).join('\n\n')}

## Design Patterns Emerging
Based on my questions, I'm focused on: ${[...new Set(designQuestions.flatMap(q => q.tags))].join(', ')}`;
      },
      custom: () => {
        return `# Custom Export

## Selected Questions (${selectedQuestions.length})

${selectedQuestions.map(q => `### ${q.question}
- **Type:** ${questionTypeLabels[q.questionType]}
- **Build:** ${builds.find(b => b.id === q.buildContext)?.name}
- **Asked:** ${q.frequency}x
- **Status:** ${q.resolved ? 'Resolved' : 'Open'}
${q.resolution ? `- **Resolution:** ${q.resolution}` : ''}
`).join('\n')}`;
      },
    };

    return templates[exportTemplate]();
  };

  // Save to prompt library
  const saveToPromptLibrary = () => {
    const scaffold = generateScaffold();
    const storedPrompts = localStorage.getItem('jenn-prompt-library');
    const existingPrompts = storedPrompts ? JSON.parse(storedPrompts) : [];

    const newPrompt = {
      id: Date.now().toString(),
      text: scaffold,
      category: 'content',
      createdAt: new Date().toISOString(),
      useCount: 0,
      tags: ['workflow', 'insights', exportTemplate],
    };

    localStorage.setItem('jenn-prompt-library', JSON.stringify([...existingPrompts, newPrompt]));
    copyToClipboard(scaffold, 'exported');
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: 'capture', label: 'Capture' },
    { id: 'questions', label: 'Questions' },
    { id: 'themes', label: 'Themes' },
    { id: 'insights', label: 'Insights' },
    { id: 'export', label: 'Export' },
  ];

  return (
    <div className="min-h-screen bg-cream">
      <div className="container-editorial py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#97A97C' }}>
            IO / Sandbox
          </p>
          <h1 className="text-3xl md:text-4xl mb-2" style={{ color: '#3B412D', fontFamily: 'var(--font-instrument)' }}>
            <span className="italic">Workflow</span> Insights
          </h1>
          <p style={{ color: '#546E40' }}>
            Capture questions, track patterns, and generate insights across builds
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl p-4 text-center" style={{ background: '#FFF5EB', border: '1px solid #CBAD8C' }}>
            <span className="block text-3xl font-mono mb-1" style={{ color: '#FABF34' }}>
              {stats.total}
            </span>
            <span className="text-xs uppercase tracking-wider" style={{ color: '#97A97C' }}>
              Questions
            </span>
          </div>
          <div className="rounded-xl p-4 text-center" style={{ background: '#FFF5EB', border: '1px solid #CBAD8C' }}>
            <span className="block text-3xl font-mono mb-1" style={{ color: '#FABF34' }}>
              {stats.thisWeek}
            </span>
            <span className="text-xs uppercase tracking-wider" style={{ color: '#97A97C' }}>
              This Week
            </span>
          </div>
          <div className="rounded-xl p-4 text-center" style={{ background: '#FFF5EB', border: '1px solid #CBAD8C' }}>
            <span className="block text-3xl font-mono mb-1" style={{ color: '#FABF34' }}>
              {themes.length}
            </span>
            <span className="text-xs uppercase tracking-wider" style={{ color: '#97A97C' }}>
              Themes
            </span>
          </div>
          <div className="rounded-xl p-4 text-center" style={{ background: '#FFF5EB', border: '1px solid #CBAD8C' }}>
            <span className="block text-xl font-mono mb-1 truncate" style={{ color: '#FABF34' }}>
              {stats.mostAsked?.frequency || 0}x
            </span>
            <span className="text-xs uppercase tracking-wider" style={{ color: '#97A97C' }}>
              Top Frequency
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b pb-4" style={{ borderColor: '#97A97C' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                background: activeTab === tab.id ? '#546E40' : 'transparent',
                color: activeTab === tab.id ? '#FFF5EB' : '#3B412D',
                border: activeTab === tab.id ? 'none' : '1px solid #97A97C',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-in">
          {/* CAPTURE TAB */}
          {activeTab === 'capture' && (
            <div className="space-y-6">
              {/* Quick Capture Form */}
              <div className="rounded-xl p-6" style={{ background: '#3B412D', border: '1px solid #546E40' }}>
                <h3 className="text-lg mb-4" style={{ color: '#FFF5EB', fontFamily: 'var(--font-instrument)' }}>
                  <span className="italic">Quick</span> Capture
                </h3>

                <div className="space-y-4">
                  {/* Question Input */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: '#97A97C' }}>
                      Question
                    </label>
                    <textarea
                      value={captureForm.question}
                      onChange={(e) => setCaptureForm({ ...captureForm, question: e.target.value })}
                      placeholder="What question did you just ask Claude?"
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg text-sm resize-none"
                      style={{ background: '#EFE4D6', color: '#3B412D', border: '1px solid #546E40' }}
                    />
                  </div>

                  {/* Type and Build */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: '#97A97C' }}>
                        Question Type
                      </label>
                      <div className="flex gap-2">
                        {(['technical', 'design', 'process'] as QuestionType[]).map(type => (
                          <button
                            key={type}
                            onClick={() => setCaptureForm({ ...captureForm, questionType: type })}
                            className="px-3 py-2 rounded-lg text-xs capitalize flex-1"
                            style={{
                              background: captureForm.questionType === type ? questionTypeColors[type] : '#2F2F2C',
                              color: captureForm.questionType === type ? '#2F2F2C' : '#97A97C',
                            }}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: '#97A97C' }}>
                        Build Context
                      </label>
                      <select
                        value={captureForm.buildContext}
                        onChange={(e) => setCaptureForm({ ...captureForm, buildContext: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg text-sm"
                        style={{ background: '#EFE4D6', color: '#3B412D', border: '1px solid #546E40' }}
                      >
                        {builds.filter(b => b.active).map(build => (
                          <option key={build.id} value={build.id}>{build.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Category and Tags */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: '#97A97C' }}>
                        Category
                      </label>
                      <input
                        type="text"
                        value={captureForm.category}
                        onChange={(e) => setCaptureForm({ ...captureForm, category: e.target.value })}
                        placeholder="e.g., navigation, data-fetching..."
                        className="w-full px-4 py-2 rounded-lg text-sm"
                        style={{ background: '#EFE4D6', color: '#3B412D', border: '1px solid #546E40' }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: '#97A97C' }}>
                        Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        value={captureForm.tags}
                        onChange={(e) => setCaptureForm({ ...captureForm, tags: e.target.value })}
                        placeholder="react, styling, api..."
                        className="w-full px-4 py-2 rounded-lg text-sm"
                        style={{ background: '#EFE4D6', color: '#3B412D', border: '1px solid #546E40' }}
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    onClick={addQuestion}
                    disabled={!captureForm.question.trim()}
                    className="w-full px-6 py-3 rounded-full text-sm font-medium transition-all"
                    style={{
                      background: captureForm.question.trim() ? '#546E40' : '#3C422E',
                      color: captureForm.question.trim() ? '#FFF5EB' : '#97A97C',
                      cursor: captureForm.question.trim() ? 'pointer' : 'not-allowed',
                    }}
                  >
                    + Log Question
                  </button>
                </div>
              </div>

              {/* Recent Questions */}
              <div>
                <h3 className="text-sm uppercase tracking-wider mb-4" style={{ color: '#CBAD8C' }}>
                  Recent Questions
                </h3>
                <div className="space-y-2">
                  {questions.slice(0, 5).map(q => (
                    <div
                      key={q.id}
                      className="rounded-lg p-4 flex items-start gap-4"
                      style={{ background: '#FFF5EB', border: '1px solid #CBAD8C' }}
                    >
                      <span
                        className="px-2 py-0.5 rounded text-xs uppercase flex-shrink-0"
                        style={{ background: questionTypeColors[q.questionType], color: '#2F2F2C' }}
                      >
                        {q.questionType}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm mb-1" style={{ color: '#3B412D' }}>{q.question}</p>
                        <div className="flex items-center gap-2 text-xs" style={{ color: '#97A97C' }}>
                          <span>{builds.find(b => b.id === q.buildContext)?.name}</span>
                          <span>·</span>
                          <span>{q.frequency}x</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {questions.length === 0 && (
                    <div className="text-center py-8 rounded-xl" style={{ background: '#FFF5EB', border: '1px solid #CBAD8C' }}>
                      <p style={{ color: '#97A97C' }}>No questions logged yet. Start capturing!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* QUESTIONS TAB */}
          {activeTab === 'questions' && (
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex flex-wrap gap-3 mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search questions..."
                  className="flex-1 min-w-[200px] px-4 py-2 rounded-lg text-sm"
                  style={{ background: '#EFE4D6', color: '#3B412D', border: '1px solid #546E40' }}
                />
                <select
                  value={filterBuild}
                  onChange={(e) => setFilterBuild(e.target.value)}
                  className="px-3 py-2 rounded-lg text-sm"
                  style={{ background: '#EFE4D6', color: '#3B412D', border: '1px solid #546E40' }}
                >
                  <option value="all">All Builds</option>
                  {builds.filter(b => b.active).map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as QuestionType | 'all')}
                  className="px-3 py-2 rounded-lg text-sm"
                  style={{ background: '#EFE4D6', color: '#3B412D', border: '1px solid #546E40' }}
                >
                  <option value="all">All Types</option>
                  <option value="technical">Technical</option>
                  <option value="design">Design</option>
                  <option value="process">Process</option>
                </select>
                <select
                  value={filterResolved}
                  onChange={(e) => setFilterResolved(e.target.value as typeof filterResolved)}
                  className="px-3 py-2 rounded-lg text-sm"
                  style={{ background: '#EFE4D6', color: '#3B412D', border: '1px solid #546E40' }}
                >
                  <option value="all">All Status</option>
                  <option value="unresolved">Open</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              {/* Sort Options */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs" style={{ color: '#97A97C' }}>Sort:</span>
                {(['newest', 'most-asked', 'alphabetical'] as SortOption[]).map(opt => (
                  <button
                    key={opt}
                    onClick={() => setSortOption(opt)}
                    className="px-2 py-1 rounded text-xs capitalize"
                    style={{
                      background: sortOption === opt ? '#546E40' : 'transparent',
                      color: sortOption === opt ? '#FFF5EB' : '#97A97C',
                    }}
                  >
                    {opt.replace('-', ' ')}
                  </button>
                ))}
                <span className="ml-auto text-xs" style={{ color: '#97A97C' }}>
                  {filteredQuestions.length} of {questions.length}
                </span>
              </div>

              {/* Questions List */}
              <div className="space-y-2">
                {filteredQuestions.map(q => (
                  <div
                    key={q.id}
                    className="rounded-xl p-4 group transition-all hover:translate-x-1"
                    style={{
                      background: '#FFF5EB',
                      border: `1px solid ${q.resolved ? '#97A97C' : '#CBAD8C'}`,
                      opacity: q.resolved ? 0.8 : 1,
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col gap-2">
                        <span
                          className="px-2 py-0.5 rounded text-xs uppercase"
                          style={{ background: questionTypeColors[q.questionType], color: '#2F2F2C' }}
                        >
                          {q.questionType}
                        </span>
                        <button
                          onClick={() => incrementFrequency(q.id)}
                          className="px-2 py-1 rounded text-xs font-mono hover:scale-105 transition-transform"
                          style={{ background: '#3B412D', color: '#FABF34' }}
                          title="Click to increment"
                        >
                          {q.frequency}x
                        </button>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm mb-2" style={{ color: '#3B412D' }}>{q.question}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className="px-2 py-0.5 rounded text-xs"
                            style={{
                              background: builds.find(b => b.id === q.buildContext)?.color || '#3C422E',
                              color: '#FFF5EB'
                            }}
                          >
                            {builds.find(b => b.id === q.buildContext)?.name}
                          </span>
                          {q.category && (
                            <span className="px-2 py-0.5 rounded text-xs" style={{ background: '#EFE4D6', color: '#97A97C' }}>
                              {q.category}
                            </span>
                          )}
                          {q.tags.map((tag, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-full text-xs" style={{ background: '#3B412D', color: '#CBAD8C' }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                        {q.resolution && (
                          <p className="text-xs mt-2 italic" style={{ color: '#546E40' }}>
                            Resolution: {q.resolution}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => toggleResolved(q.id)}
                          className="px-2 py-1 rounded text-xs"
                          style={{ background: q.resolved ? '#97A97C' : '#3B412D', color: '#FFF5EB' }}
                        >
                          {q.resolved ? 'Reopen' : 'Resolve'}
                        </button>
                        <button
                          onClick={() => deleteQuestion(q.id)}
                          className="px-2 py-1 rounded text-xs"
                          style={{ background: '#EFE4D6', color: '#97A97C' }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredQuestions.length === 0 && (
                  <div className="text-center py-12 rounded-xl" style={{ background: '#FFF5EB', border: '1px solid #CBAD8C' }}>
                    <p style={{ color: '#97A97C' }}>
                      {questions.length === 0 ? 'No questions yet. Go to Capture to add some!' : 'No questions match your filters.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* THEMES TAB */}
          {activeTab === 'themes' && (
            <div className="space-y-6">
              {/* Create Theme Button */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg" style={{ color: '#3B412D', fontFamily: 'var(--font-instrument)' }}>
                  <span className="italic">Question</span> Themes
                </h3>
                <button
                  onClick={() => setShowThemeModal(true)}
                  className="px-4 py-2 rounded-full text-sm font-medium"
                  style={{ background: '#546E40', color: '#FFF5EB' }}
                >
                  + Create Theme
                </button>
              </div>

              {/* Auto-Suggested Themes */}
              {suggestedThemes.length > 0 && (
                <div className="rounded-xl p-4" style={{ background: '#3B412D', border: '1px solid #546E40' }}>
                  <h4 className="text-sm uppercase tracking-wider mb-3" style={{ color: '#FABF34' }}>
                    Suggested Themes
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {suggestedThemes.slice(0, 6).map(suggestion => (
                      <button
                        key={suggestion.tag}
                        onClick={() => {
                          setSelectedQuestionIds(suggestion.questionIds);
                          setNewTheme({ name: suggestion.tag, description: '' });
                          setShowThemeModal(true);
                        }}
                        className="px-3 py-2 rounded-lg text-sm flex items-center gap-2 hover:scale-105 transition-transform"
                        style={{ background: '#2F2F2C', color: '#FFF5EB' }}
                      >
                        <span>{suggestion.tag}</span>
                        <span className="font-mono text-xs" style={{ color: '#FABF34' }}>{suggestion.count}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Existing Themes */}
              <div className="grid md:grid-cols-2 gap-4">
                {themes.map(theme => {
                  const themeQuestions = questions.filter(q => theme.questionIds.includes(q.id));
                  return (
                    <div
                      key={theme.id}
                      className="rounded-xl p-4"
                      style={{ background: '#FFF5EB', border: '1px solid #CBAD8C' }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-lg" style={{ color: '#3B412D', fontFamily: 'var(--font-instrument)' }}>
                            {theme.name}
                          </h4>
                          <p className="text-xs" style={{ color: '#97A97C' }}>{theme.description}</p>
                        </div>
                        <span
                          className="px-2 py-0.5 rounded text-xs uppercase"
                          style={{
                            background: theme.category === 'mixed' ? '#3B412D' : questionTypeColors[theme.category as QuestionType],
                            color: theme.category === 'mixed' ? '#FABF34' : '#2F2F2C'
                          }}
                        >
                          {theme.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-xs" style={{ color: '#CBAD8C' }}>
                          <span className="font-mono" style={{ color: '#FABF34' }}>{themeQuestions.length}</span> questions
                        </span>
                        <span className="text-xs" style={{ color: '#CBAD8C' }}>
                          <span className="font-mono" style={{ color: '#FABF34' }}>{theme.frequency}</span> total asks
                        </span>
                      </div>
                      <div className="space-y-1">
                        {themeQuestions.slice(0, 3).map(q => (
                          <p key={q.id} className="text-xs truncate" style={{ color: '#546E40' }}>
                            • {q.question}
                          </p>
                        ))}
                        {themeQuestions.length > 3 && (
                          <p className="text-xs" style={{ color: '#97A97C' }}>
                            +{themeQuestions.length - 3} more
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {themes.length === 0 && suggestedThemes.length === 0 && (
                <div className="text-center py-12 rounded-xl" style={{ background: '#FFF5EB', border: '1px solid #CBAD8C' }}>
                  <p style={{ color: '#97A97C' }}>
                    No themes yet. Add more questions with shared tags to see suggestions.
                  </p>
                </div>
              )}

              {/* Theme Modal */}
              {showThemeModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" style={{ background: '#FFF5EB' }}>
                    <h3 className="text-xl mb-4" style={{ color: '#3B412D', fontFamily: 'var(--font-instrument)' }}>
                      Create Theme
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: '#97A97C' }}>
                          Theme Name
                        </label>
                        <input
                          type="text"
                          value={newTheme.name}
                          onChange={(e) => setNewTheme({ ...newTheme, name: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg text-sm"
                          style={{ background: '#EFE4D6', color: '#3B412D', border: '1px solid #546E40' }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: '#97A97C' }}>
                          Description
                        </label>
                        <textarea
                          value={newTheme.description}
                          onChange={(e) => setNewTheme({ ...newTheme, description: e.target.value })}
                          rows={2}
                          className="w-full px-4 py-2 rounded-lg text-sm resize-none"
                          style={{ background: '#EFE4D6', color: '#3B412D', border: '1px solid #546E40' }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: '#97A97C' }}>
                          Select Questions ({selectedQuestionIds.length} selected)
                        </label>
                        <div className="max-h-48 overflow-y-auto space-y-1 rounded-lg p-2" style={{ background: '#EFE4D6' }}>
                          {questions.map(q => (
                            <label
                              key={q.id}
                              className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-cream"
                            >
                              <input
                                type="checkbox"
                                checked={selectedQuestionIds.includes(q.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedQuestionIds([...selectedQuestionIds, q.id]);
                                  } else {
                                    setSelectedQuestionIds(selectedQuestionIds.filter(id => id !== q.id));
                                  }
                                }}
                              />
                              <span className="text-sm truncate" style={{ color: '#3B412D' }}>{q.question}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2 pt-4">
                        <button
                          onClick={() => {
                            setShowThemeModal(false);
                            setNewTheme({ name: '', description: '' });
                            setSelectedQuestionIds([]);
                          }}
                          className="flex-1 px-4 py-2 rounded-full text-sm"
                          style={{ background: '#EFE4D6', color: '#3B412D' }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={createTheme}
                          disabled={!newTheme.name.trim() || selectedQuestionIds.length === 0}
                          className="flex-1 px-4 py-2 rounded-full text-sm font-medium"
                          style={{
                            background: newTheme.name.trim() && selectedQuestionIds.length > 0 ? '#546E40' : '#CBAD8C',
                            color: '#FFF5EB',
                          }}
                        >
                          Create Theme
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* INSIGHTS TAB */}
          {activeTab === 'insights' && (
            <div className="space-y-6">
              {/* Build Breakdown */}
              <div className="rounded-xl p-4" style={{ background: '#FFF5EB', border: '1px solid #CBAD8C' }}>
                <h3 className="text-lg mb-4" style={{ color: '#3B412D', fontFamily: 'var(--font-instrument)' }}>
                  Questions by <span className="italic">Build</span>
                </h3>
                <div className="space-y-3">
                  {builds.filter(b => b.active).map(build => {
                    const count = stats.buildCounts[build.id] || 0;
                    const maxCount = Math.max(...Object.values(stats.buildCounts), 1);
                    return (
                      <div key={build.id} className="flex items-center gap-3">
                        <span className="w-32 text-sm truncate" style={{ color: '#546E40' }}>{build.name}</span>
                        <div className="flex-1 h-8 rounded-lg overflow-hidden" style={{ background: '#2F2F2C' }}>
                          <div
                            className="h-full rounded-lg transition-all duration-500 flex items-center justify-end pr-2"
                            style={{
                              width: count > 0 ? `${Math.max((count / maxCount) * 100, 8)}%` : '0%',
                              background: build.color,
                              minWidth: count > 0 ? '32px' : '0',
                            }}
                          >
                            {count > 0 && (
                              <span className="text-xs font-mono font-medium" style={{ color: '#FFF5EB' }}>
                                {count}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Type Breakdown */}
              <div className="rounded-xl p-4" style={{ background: '#FFF5EB', border: '1px solid #CBAD8C' }}>
                <h3 className="text-lg mb-4" style={{ color: '#3B412D', fontFamily: 'var(--font-instrument)' }}>
                  Questions by <span className="italic">Type</span>
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {(['technical', 'design', 'process'] as QuestionType[]).map(type => (
                    <div key={type} className="text-center p-4 rounded-lg" style={{ background: '#3B412D' }}>
                      <span className="block text-3xl font-mono mb-1" style={{ color: questionTypeColors[type] }}>
                        {stats.typeCounts[type] || 0}
                      </span>
                      <span className="text-xs uppercase tracking-wider capitalize" style={{ color: '#97A97C' }}>
                        {type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Questions */}
              <div className="rounded-xl p-4" style={{ background: '#FFF5EB', border: '1px solid #CBAD8C' }}>
                <h3 className="text-lg mb-4" style={{ color: '#3B412D', fontFamily: 'var(--font-instrument)' }}>
                  <span className="italic">Most</span> Asked
                </h3>
                <div className="space-y-2">
                  {[...questions]
                    .sort((a, b) => b.frequency - a.frequency)
                    .slice(0, 5)
                    .map((q, i) => (
                      <div
                        key={q.id}
                        className="flex items-center gap-4 p-3 rounded-lg"
                        style={{ background: i === 0 ? '#3B412D' : '#EFE4D6' }}
                      >
                        <span
                          className="w-8 h-8 flex items-center justify-center rounded-lg font-mono font-bold"
                          style={{
                            background: i === 0 ? '#FABF34' : '#3B412D',
                            color: i === 0 ? '#3B412D' : '#FABF34'
                          }}
                        >
                          {i + 1}
                        </span>
                        <p className="flex-1 text-sm truncate" style={{ color: i === 0 ? '#FFF5EB' : '#3B412D' }}>
                          {q.question}
                        </p>
                        <span
                          className="font-mono text-sm"
                          style={{ color: i === 0 ? '#FABF34' : '#97A97C' }}
                        >
                          {q.frequency}x
                        </span>
                      </div>
                    ))}
                  {questions.length === 0 && (
                    <p className="text-center py-4" style={{ color: '#97A97C' }}>
                      No questions to analyze yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* EXPORT TAB */}
          {activeTab === 'export' && (
            <div className="space-y-6">
              {/* Template Selection */}
              <div className="rounded-xl p-4" style={{ background: '#FFF5EB', border: '1px solid #CBAD8C' }}>
                <h3 className="text-lg mb-4" style={{ color: '#3B412D', fontFamily: 'var(--font-instrument)' }}>
                  Export <span className="italic">Template</span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {([
                    { id: 'context', label: 'Context Dump', desc: 'Full question history' },
                    { id: 'decision', label: 'Decision Log', desc: 'Technical decisions' },
                    { id: 'design', label: 'Design Guide', desc: 'Aesthetic questions' },
                    { id: 'custom', label: 'Custom', desc: 'Select specific items' },
                  ] as const).map(tmpl => (
                    <button
                      key={tmpl.id}
                      onClick={() => setExportTemplate(tmpl.id)}
                      className="p-3 rounded-lg text-left transition-all hover:scale-[1.02]"
                      style={{
                        background: exportTemplate === tmpl.id ? '#546E40' : '#3B412D',
                        border: exportTemplate === tmpl.id ? '2px solid #97A97C' : '1px solid transparent',
                      }}
                    >
                      <span className="block text-sm font-medium" style={{ color: '#FFF5EB' }}>
                        {tmpl.label}
                      </span>
                      <span className="text-xs" style={{ color: '#97A97C' }}>{tmpl.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Selection */}
              <div className="rounded-xl p-4" style={{ background: '#FFF5EB', border: '1px solid #CBAD8C' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg" style={{ color: '#3B412D', fontFamily: 'var(--font-instrument)' }}>
                    Select <span className="italic">Questions</span>
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setExportSelection(questions.map(q => q.id))}
                      className="px-3 py-1 rounded text-xs"
                      style={{ background: '#3B412D', color: '#FFF5EB' }}
                    >
                      Select All
                    </button>
                    <button
                      onClick={() => setExportSelection([])}
                      className="px-3 py-1 rounded text-xs"
                      style={{ background: '#EFE4D6', color: '#97A97C' }}
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto space-y-1">
                  {questions.map(q => (
                    <label
                      key={q.id}
                      className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-cream"
                      style={{ background: exportSelection.includes(q.id) ? '#EFE4D6' : 'transparent' }}
                    >
                      <input
                        type="checkbox"
                        checked={exportSelection.includes(q.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setExportSelection([...exportSelection, q.id]);
                          } else {
                            setExportSelection(exportSelection.filter(id => id !== q.id));
                          }
                        }}
                      />
                      <span
                        className="px-1.5 py-0.5 rounded text-xs"
                        style={{ background: questionTypeColors[q.questionType], color: '#2F2F2C' }}
                      >
                        {q.questionType[0].toUpperCase()}
                      </span>
                      <span className="text-sm flex-1 truncate" style={{ color: '#3B412D' }}>
                        {q.question}
                      </span>
                      <span className="text-xs font-mono" style={{ color: '#FABF34' }}>{q.frequency}x</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs mt-2" style={{ color: '#97A97C' }}>
                  {exportSelection.length} questions selected
                </p>
              </div>

              {/* Preview */}
              <div className="rounded-xl p-4" style={{ background: '#3B412D', border: '1px solid #546E40' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg" style={{ color: '#FFF5EB', fontFamily: 'var(--font-instrument)' }}>
                    <span className="italic">Preview</span>
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(generateScaffold(), 'scaffold')}
                      className="px-4 py-2 rounded-full text-sm font-medium"
                      style={{ background: '#546E40', color: '#FFF5EB' }}
                    >
                      {copiedId === 'scaffold' ? 'Copied!' : 'Copy to Clipboard'}
                    </button>
                    <button
                      onClick={saveToPromptLibrary}
                      className="px-4 py-2 rounded-full text-sm font-medium"
                      style={{ background: '#FABF34', color: '#3B412D' }}
                    >
                      {copiedId === 'exported' ? 'Saved!' : 'Save to Library'}
                    </button>
                  </div>
                </div>
                <pre
                  className="whitespace-pre-wrap text-sm font-mono p-4 rounded-lg max-h-96 overflow-y-auto"
                  style={{ background: '#2F2F2C', color: '#FFF5EB' }}
                >
                  {exportSelection.length > 0 ? generateScaffold() : 'Select questions to generate export preview...'}
                </pre>
              </div>

              {/* Info */}
              <div className="rounded-xl p-4" style={{ background: '#FFF5EB', border: '1px solid #97A97C' }}>
                <h4 className="text-sm uppercase tracking-wider mb-2" style={{ color: '#FABF34' }}>
                  Integration
                </h4>
                <p className="text-sm" style={{ color: '#546E40' }}>
                  Exported scaffolds are saved to your Prompt Library. Access them in the{' '}
                  <a href="/io/sandbox/prompt-builder" className="underline" style={{ color: '#97A97C' }}>
                    Prompt Builder
                  </a>{' '}
                  under the Library tab with tags: <code className="px-1 rounded" style={{ background: '#EFE4D6' }}>workflow, insights</code>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Back Link */}
        <div className="mt-12 pt-8" style={{ borderTop: '1px solid #CBAD8C' }}>
          <a href="/io/sandbox" className="text-sm hover:underline" style={{ color: '#97A97C' }}>
            ← Back to Sandbox
          </a>
        </div>
      </div>
    </div>
  );
}
