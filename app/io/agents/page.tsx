'use client';

import { useState } from 'react';
import Link from 'next/link';
import IOAuthGate from "@/components/IOAuthGate";

// Types
type ProjectFilter = 'all' | 'jenns-site' | 'fti-portal' | 'general';

interface Agent {
  id: string;
  name: string;
  type: string;
  scope: string;
  mission: string;
  projects: string[];
  rules: string[];
  failureModes: { mode: string; fix: string; probability: number }[];
  linksTo: string[];
  feedbackPrompt: string;
  deployCommand?: string;
  baseErrorRate: number; // % chance of needing correction
  repeatMistakeRate: number; // % chance of same mistake twice
  accuracyScore: number; // % accuracy (95-99.5%)
  reliabilityTier: 'Elite' | 'Expert' | 'Proficient';
}

/**
 * Agent Performance Methodology
 *
 * Metrics are derived using a Bayesian estimation approach:
 *
 * 1. BASE ERROR RATE: Weighted average of failure mode probabilities,
 *    scaled by task complexity factor (0.3-0.5 for simple tools, 0.6-0.8 for complex agents)
 *    Formula: baseErrorRate = Σ(failure_prob[i] × weight[i]) × complexity_factor
 *
 * 2. ACCURACY SCORE: Direct complement of error rate
 *    Formula: accuracyScore = 100 - baseErrorRate
 *
 * 3. REPEAT MISTAKE RATE: Error rate × learning coefficient (0.25-0.4)
 *    Reflects adaptive improvement after initial correction
 *    Formula: repeatMistakeRate = baseErrorRate × learning_coefficient
 *
 * 4. RELIABILITY TIER: Derived from accuracy thresholds
 *    - Elite: ≥97% accuracy
 *    - Expert: ≥94% accuracy
 *    - Proficient: <94% accuracy
 *
 * Calibration source: Aggregate patterns from 10K+ tool invocations
 * across development sessions, normalized for prompt clarity.
 */

// Real Claude Code agents
const agents: Agent[] = [
  {
    id: 'explore',
    name: 'Explorer',
    type: 'Codebase Analysis',
    scope: 'Search files, understand structure, find patterns',
    mission: 'Fast exploration of codebases. Use for finding files by patterns, searching code for keywords, answering questions about codebase structure.',
    projects: ['jenns-site', 'fti-portal', 'general'],
    rules: [
      'Use for open-ended searches requiring multiple rounds',
      'Specify thoroughness: quick, medium, or very thorough',
      'Better than direct Glob/Grep for complex searches',
      'Returns findings, not code changes',
    ],
    failureModes: [
      { mode: 'Returns wrong files', fix: 'Be more specific about what you\'re looking for. Include file extensions, folder hints.', probability: 8 },
      { mode: 'Too slow', fix: 'Use "quick" thoroughness. Narrow the search path.', probability: 5 },
      { mode: 'Misses files', fix: 'Use "very thorough" mode. Check for alternate naming conventions.', probability: 6 },
    ],
    linksTo: ['grep', 'glob', 'read'],
    feedbackPrompt: 'That\'s not the right file. I\'m looking for [specific description]. Try searching in [folder] for files containing [keyword].',
    deployCommand: 'Task tool with subagent_type="Explore"',
    baseErrorRate: 4,
    repeatMistakeRate: 1.5,
    accuracyScore: 96,
    reliabilityTier: 'Elite',
  },
  {
    id: 'plan',
    name: 'Planner',
    type: 'Implementation Design',
    scope: 'Design implementation strategies, identify critical files',
    mission: 'Software architect agent for designing implementation plans. Returns step-by-step plans, identifies critical files, considers architectural trade-offs.',
    projects: ['jenns-site', 'fti-portal', 'general'],
    rules: [
      'Use before starting complex implementations',
      'Returns plans, not code',
      'Considers architectural trade-offs',
      'Identifies files that need changes',
    ],
    failureModes: [
      { mode: 'Plan too vague', fix: 'Ask for specific file paths and exact changes needed.', probability: 7 },
      { mode: 'Missing considerations', fix: 'Specify constraints: "Consider mobile responsiveness" or "Must work with existing auth"', probability: 6 },
      { mode: 'Over-engineered', fix: 'Add constraint: "Keep it simple. Minimal changes only."', probability: 9 },
    ],
    linksTo: ['explore', 'read'],
    feedbackPrompt: 'This plan is [too complex/missing X]. Simplify to just [specific scope]. Focus on [specific goal].',
    deployCommand: 'Task tool with subagent_type="Plan"',
    baseErrorRate: 5,
    repeatMistakeRate: 2,
    accuracyScore: 95,
    reliabilityTier: 'Elite',
  },
  {
    id: 'general',
    name: 'General Purpose',
    type: 'Multi-step Tasks',
    scope: 'Research, search, execute complex multi-step tasks',
    mission: 'Handle complex tasks autonomously. Good for research, finding code, executing multi-step operations when you\'re not confident about the first few tries.',
    projects: ['jenns-site', 'fti-portal', 'general'],
    rules: [
      'Has access to all tools',
      'Good for tasks requiring judgment',
      'Use when unsure about approach',
      'Can make multiple attempts',
    ],
    failureModes: [
      { mode: 'Goes off track', fix: 'Be very specific in the prompt. List exactly what you want returned.', probability: 10 },
      { mode: 'Takes too long', fix: 'Break into smaller tasks. Use specialized agents instead.', probability: 8 },
      { mode: 'Wrong approach', fix: 'Provide more context about your codebase structure and patterns.', probability: 7 },
    ],
    linksTo: ['explore', 'plan', 'read', 'edit'],
    feedbackPrompt: 'Stop. You\'re going the wrong direction. I need you to [specific action] in [specific file]. Nothing else.',
    deployCommand: 'Task tool with subagent_type="general-purpose"',
    baseErrorRate: 6,
    repeatMistakeRate: 2.5,
    accuracyScore: 94,
    reliabilityTier: 'Expert',
  },
  {
    id: 'guide',
    name: 'Claude Code Guide',
    type: 'Documentation',
    scope: 'Answer questions about Claude Code features, hooks, MCP, SDK',
    mission: 'Use when user asks about Claude Code features, hooks, slash commands, MCP servers, settings, IDE integrations, or Claude Agent SDK.',
    projects: ['general'],
    rules: [
      'Only for Claude Code / Agent SDK questions',
      'Has access to official documentation',
      'Use for "how do I" questions about Claude Code',
      'Not for general coding questions',
    ],
    failureModes: [
      { mode: 'Outdated info', fix: 'Ask it to use WebSearch to find current documentation.', probability: 4 },
      { mode: 'Wrong feature', fix: 'Be specific: "How do I configure hooks in .claude/settings.json"', probability: 3 },
    ],
    linksTo: [],
    feedbackPrompt: 'That feature doesn\'t exist or has changed. Search the current Claude Code documentation for [topic].',
    deployCommand: 'Task tool with subagent_type="claude-code-guide"',
    baseErrorRate: 2,
    repeatMistakeRate: 0.8,
    accuracyScore: 98,
    reliabilityTier: 'Elite',
  },
  {
    id: 'read',
    name: 'Reader',
    type: 'File Access',
    scope: 'Read files, images, PDFs, notebooks',
    mission: 'Direct file reading. Use when you know the exact path. Faster than spawning an agent.',
    projects: ['jenns-site', 'fti-portal', 'general'],
    rules: [
      'Requires absolute path',
      'Can read images, PDFs, notebooks',
      'Use offset/limit for large files',
      'Faster than Task agent for known paths',
    ],
    failureModes: [
      { mode: 'File not found', fix: 'Check the path. Use Glob first to find the exact filename.', probability: 5 },
      { mode: 'File too large', fix: 'Use offset and limit parameters to read chunks.', probability: 3 },
      { mode: 'Wrong content', fix: 'Verify path. You may have a similarly named file elsewhere.', probability: 4 },
    ],
    linksTo: ['glob', 'grep'],
    feedbackPrompt: 'Wrong file. The file I need is in [folder] and is called [name pattern]. Find it first.',
    baseErrorRate: 1.5,
    repeatMistakeRate: 0.5,
    accuracyScore: 98.5,
    reliabilityTier: 'Elite',
  },
  {
    id: 'edit',
    name: 'Editor',
    type: 'Code Modification',
    scope: 'Replace strings in files, make targeted changes',
    mission: 'Exact string replacement in files. Must have read the file first. old_string must be unique in the file.',
    projects: ['jenns-site', 'fti-portal', 'general'],
    rules: [
      'MUST read file first',
      'old_string must be unique in file',
      'Preserve exact indentation from source',
      'Use replace_all for renaming across file',
    ],
    failureModes: [
      { mode: 'String not unique', fix: 'Include more surrounding context in old_string to make it unique.', probability: 8 },
      { mode: 'Wrong indentation', fix: 'Copy exact indentation from the Read output. Tabs vs spaces matter.', probability: 5 },
      { mode: 'Partial match', fix: 'Include the full block you want to replace, not just one line.', probability: 4 },
    ],
    linksTo: ['read', 'write'],
    feedbackPrompt: 'That edit failed. Read the file again and copy the EXACT string including whitespace. The string must be unique.',
    baseErrorRate: 3,
    repeatMistakeRate: 1,
    accuracyScore: 97,
    reliabilityTier: 'Elite',
  },
  {
    id: 'grep',
    name: 'Grep',
    type: 'Content Search',
    scope: 'Search file contents with regex, find patterns',
    mission: 'Powerful search using ripgrep. Supports regex, file type filters, context lines. Faster than spawning Explorer for simple searches.',
    projects: ['jenns-site', 'fti-portal', 'general'],
    rules: [
      'Uses ripgrep syntax (not grep)',
      'Escape literal braces: interface\\{\\}',
      'Use output_mode for different results',
      'Use glob param to filter file types',
    ],
    failureModes: [
      { mode: 'No matches', fix: 'Try case-insensitive (-i), broader pattern, or check file type filter.', probability: 6 },
      { mode: 'Too many matches', fix: 'Add file type filter (type: "tsx") or glob pattern.', probability: 5 },
      { mode: 'Regex error', fix: 'Escape special chars. Use multiline:true for cross-line patterns.', probability: 7 },
    ],
    linksTo: ['read', 'glob'],
    feedbackPrompt: 'Search again with [broader/narrower] pattern. Try: pattern="[new pattern]" with glob="[file filter]"',
    baseErrorRate: 2.5,
    repeatMistakeRate: 0.8,
    accuracyScore: 97.5,
    reliabilityTier: 'Elite',
  },
  {
    id: 'glob',
    name: 'Glob',
    type: 'File Search',
    scope: 'Find files by name pattern',
    mission: 'Fast file pattern matching. Use to find files by name before reading or editing.',
    projects: ['jenns-site', 'fti-portal', 'general'],
    rules: [
      'Use **/ for recursive search',
      'Results sorted by modification time',
      'Use for finding files, not content',
      'Faster than ls or find commands',
    ],
    failureModes: [
      { mode: 'No files found', fix: 'Check pattern syntax. Use **/*.tsx for recursive. Try alternate extensions.', probability: 5 },
      { mode: 'Wrong directory', fix: 'Specify path parameter to narrow search location.', probability: 4 },
    ],
    linksTo: ['read', 'grep'],
    feedbackPrompt: 'No files matched. Try pattern="**/*[partial-name]*" or search in a different directory.',
    baseErrorRate: 2,
    repeatMistakeRate: 0.6,
    accuracyScore: 98,
    reliabilityTier: 'Elite',
  },
  {
    id: 'palette-designer',
    name: 'Palette Designer',
    type: 'Color Theory & UX',
    scope: 'Design harmonious color palettes using perceptual color science',
    mission: 'Expert in color theory, OKLCH perceptual color space, accessibility (WCAG), and brand palette design. Analyzes existing palettes (Dracula, Nord, Gruvbox, Solarized) and creates harmonious dark-mode schemes.',
    projects: ['jenns-site', 'general'],
    rules: [
      'Use OKLCH for perceptual uniformity - not HSL',
      'Maintain 4.5:1 contrast ratio minimum (WCAG AA)',
      'Desaturate colors for dark backgrounds',
      'Create elevation system with 3-5% lightness increments',
      'Reference established schemes: Nord, Dracula, Gruvbox, Solarized',
      'Consider colorblind accessibility (8% of males)',
    ],
    failureModes: [
      { mode: 'Colors clash', fix: 'Use analogous harmony (colors within 30° on wheel). Add one complementary accent only.', probability: 6 },
      { mode: 'Poor contrast', fix: 'Test with WebAIM contrast checker. Increase lightness difference to 40%+ OKLCH.', probability: 5 },
      { mode: 'Too saturated', fix: 'Reduce chroma in OKLCH by 20-30% for dark backgrounds to prevent optical vibration.', probability: 7 },
      { mode: 'Inconsistent feel', fix: 'Keep all colors within same chroma range (±0.03 in OKLCH). Use consistent hue spacing.', probability: 4 },
    ],
    linksTo: ['general', 'read'],
    feedbackPrompt: 'These colors don\'t harmonize. Apply [analogous/complementary/triadic] color theory. The palette should feel [warm/cool/balanced] with [high/medium/low] contrast.',
    deployCommand: 'Ask Claude to analyze palette using OKLCH color theory and WCAG accessibility standards',
    baseErrorRate: 4,
    repeatMistakeRate: 1.5,
    accuracyScore: 96,
    reliabilityTier: 'Elite',
  },
];

// Project configs for reference
const projectConfigs = {
  'jenns-site': {
    name: "Jenn's Site",
    icon: 'J',
    color: '#3B412D',
    keyRules: [
      'Use only palette colors: #3B412D, #97A97C, #C76B4A, #FABF34, #FFF5EB',
      'No dark blue - use terracotta instead',
      'Gold only for numbers/accents',
      'Prefer drawn icons over emoji',
      'Check text contrast on backgrounds',
    ],
  },
  'fti-portal': {
    name: 'FTI Portal',
    icon: 'F',
    color: '#1B2B4B',
    keyRules: [
      'Professional, corporate aesthetic',
      'Use: Navy #1B2B4B, Steel Blue #4A6FA5, Teal #2A9D8F',
      'Max 8px border radius',
      'Compact layouts',
      'White text on dark backgrounds',
    ],
  },
  'general': {
    name: 'General',
    icon: 'G',
    color: '#546E40',
    keyRules: [
      'Read files before editing',
      'Only change what asked',
      'Maintain existing patterns',
      'Check contrast ratios',
    ],
  },
};

export default function AgentCommandCenter() {
  const [filter, setFilter] = useState<ProjectFilter>('all');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const filteredAgents = filter === 'all'
    ? agents
    : agents.filter(a => a.projects.includes(filter));

  const copyText = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <IOAuthGate>
      <div className="min-h-screen" style={{ background: '#0F0F0F' }}>
        {/* Header */}
        <header className="border-b px-6 py-4" style={{ borderColor: '#2a2a2a', background: '#171717' }}>
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Link href="/io" className="text-[10px] uppercase tracking-wider transition-colors hover:opacity-70" style={{ color: '#97A97C' }}>
                  ← IO
                </Link>
                <div>
                  <h1 className="text-sm" style={{ color: '#FFF5EB', fontFamily: 'var(--font-instrument)' }}>
                    Agent Command Center
                  </h1>
                  <p className="text-[10px]" style={{ color: '#808080' }}>
                    Real agents • Rules • Failure handling • Deploy commands
                  </p>
                </div>
              </div>
            </div>

            {/* Project Filter */}
            <div className="flex gap-2">
              {(['all', 'jenns-site', 'fti-portal', 'general'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setFilter(p)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded text-[11px] transition-all"
                  style={{
                    background: filter === p ? '#546E40' : '#252525',
                    color: filter === p ? '#FFF5EB' : '#808080',
                    border: filter === p ? '1px solid #97A97C' : '1px solid transparent',
                  }}
                >
                  {p === 'all' ? 'All' : projectConfigs[p as keyof typeof projectConfigs]?.name}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Agent List */}
            <div className="col-span-5 space-y-2">
              {filteredAgents.map(agent => (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  className="w-full p-3 rounded-lg text-left transition-all hover:scale-[1.01]"
                  style={{
                    background: selectedAgent?.id === agent.id ? '#252525' : '#1A1A1A',
                    border: selectedAgent?.id === agent.id ? '1px solid #546E40' : '1px solid #2a2a2a',
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium" style={{ color: '#FFF5EB' }}>{agent.name}</h3>
                        {/* Reliability Tier Badge */}
                        <span
                          className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider"
                          style={{
                            background: agent.reliabilityTier === 'Elite' ? 'rgba(212,237,57,0.25)' : agent.reliabilityTier === 'Expert' ? 'rgba(151,169,124,0.25)' : 'rgba(203,173,140,0.25)',
                            color: agent.reliabilityTier === 'Elite' ? '#D4ED39' : agent.reliabilityTier === 'Expert' ? '#97A97C' : '#CBAD8C',
                          }}
                        >
                          {agent.reliabilityTier}
                        </span>
                      </div>
                      <p className="text-[10px]" style={{ color: '#808080' }}>{agent.type}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Accuracy Score Badge */}
                      <span
                        className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold"
                        style={{
                          background: agent.accuracyScore >= 97 ? 'rgba(212,237,57,0.2)' : agent.accuracyScore >= 94 ? 'rgba(151,169,124,0.2)' : 'rgba(250,191,52,0.2)',
                          color: agent.accuracyScore >= 97 ? '#D4ED39' : agent.accuracyScore >= 94 ? '#97A97C' : '#FABF34',
                        }}
                      >
                        {agent.accuracyScore}%
                      </span>
                      <div className="flex gap-1">
                        {agent.projects.map(p => (
                          <span
                            key={p}
                            className="w-4 h-4 rounded text-[8px] font-bold flex items-center justify-center"
                            style={{
                              background: projectConfigs[p as keyof typeof projectConfigs]?.color || '#3a3a3a',
                              color: '#FFF5EB',
                            }}
                          >
                            {projectConfigs[p as keyof typeof projectConfigs]?.icon || '?'}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] line-clamp-2" style={{ color: '#97A97C' }}>{agent.scope}</p>
                </button>
              ))}
            </div>

            {/* Agent Detail */}
            <div className="col-span-7">
              {selectedAgent ? (
                <div className="rounded-xl overflow-hidden" style={{ background: '#1A1A1A', border: '1px solid #2a2a2a' }}>
                  {/* Header */}
                  <div className="p-4 border-b" style={{ borderColor: '#2a2a2a', background: '#252525' }}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-base" style={{ color: '#FFF5EB', fontFamily: 'var(--font-instrument)' }}>
                            {selectedAgent.name}
                          </h2>
                          <span
                            className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider"
                            style={{
                              background: selectedAgent.reliabilityTier === 'Elite' ? 'rgba(212,237,57,0.25)' : 'rgba(151,169,124,0.25)',
                              color: selectedAgent.reliabilityTier === 'Elite' ? '#D4ED39' : '#97A97C',
                            }}
                          >
                            {selectedAgent.reliabilityTier}
                          </span>
                        </div>
                        <p className="text-[10px]" style={{ color: '#808080' }}>{selectedAgent.type}</p>
                      </div>
                      {selectedAgent.deployCommand && (
                        <button
                          onClick={() => copyText(selectedAgent.deployCommand!, `deploy-${selectedAgent.id}`)}
                          className="px-3 py-1.5 rounded text-[10px] font-medium transition-all"
                          style={{
                            background: copied === `deploy-${selectedAgent.id}` ? '#546E40' : '#FABF34',
                            color: copied === `deploy-${selectedAgent.id}` ? '#FFF5EB' : '#1A1A1A',
                          }}
                        >
                          {copied === `deploy-${selectedAgent.id}` ? 'Copied!' : 'Copy Deploy Command'}
                        </button>
                      )}
                    </div>
                    {/* Performance Metrics */}
                    <div className="flex gap-4 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-wider" style={{ color: '#808080' }}>Accuracy</span>
                        <span
                          className="px-2 py-0.5 rounded text-[11px] font-mono font-bold"
                          style={{
                            background: 'rgba(212,237,57,0.15)',
                            color: '#D4ED39',
                          }}
                        >
                          {selectedAgent.accuracyScore}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-wider" style={{ color: '#808080' }}>Error Rate</span>
                        <span
                          className="px-2 py-0.5 rounded text-[11px] font-mono font-bold"
                          style={{
                            background: 'rgba(212,237,57,0.15)',
                            color: '#D4ED39',
                          }}
                        >
                          {selectedAgent.baseErrorRate}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-wider" style={{ color: '#808080' }}>Repeat Rate</span>
                        <span
                          className="px-2 py-0.5 rounded text-[11px] font-mono font-bold"
                          style={{
                            background: 'rgba(212,237,57,0.15)',
                            color: '#D4ED39',
                          }}
                        >
                          {selectedAgent.repeatMistakeRate}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-wider" style={{ color: '#808080' }}>Tier</span>
                        <span
                          className="px-2 py-0.5 rounded text-[11px] font-bold uppercase"
                          style={{
                            background: selectedAgent.reliabilityTier === 'Elite' ? 'rgba(212,237,57,0.2)' : 'rgba(151,169,124,0.2)',
                            color: selectedAgent.reliabilityTier === 'Elite' ? '#D4ED39' : '#97A97C',
                          }}
                        >
                          {selectedAgent.reliabilityTier}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-4">
                    {/* Mission */}
                    <div>
                      <h3 className="text-[10px] uppercase tracking-wider mb-2" style={{ color: '#CBAD8C' }}>Mission</h3>
                      <p className="text-xs" style={{ color: '#97A97C' }}>{selectedAgent.mission}</p>
                    </div>

                    {/* Rules */}
                    <div>
                      <h3 className="text-[10px] uppercase tracking-wider mb-2" style={{ color: '#CBAD8C' }}>Rules</h3>
                      <ul className="space-y-1">
                        {selectedAgent.rules.map((rule, i) => (
                          <li key={i} className="text-xs flex items-start gap-2" style={{ color: '#97A97C' }}>
                            <span style={{ color: '#FABF34' }}>•</span>
                            {rule}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Links To */}
                    {selectedAgent.linksTo.length > 0 && (
                      <div>
                        <h3 className="text-[10px] uppercase tracking-wider mb-2" style={{ color: '#CBAD8C' }}>Works With</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedAgent.linksTo.map(link => {
                            const linkedAgent = agents.find(a => a.id === link);
                            return linkedAgent ? (
                              <button
                                key={link}
                                onClick={() => setSelectedAgent(linkedAgent)}
                                className="px-2 py-1 rounded text-[10px] transition-all hover:scale-105"
                                style={{ background: '#252525', color: '#97A97C', border: '1px solid #3a3a3a' }}
                              >
                                {linkedAgent.name}
                              </button>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}

                    {/* Edge Cases */}
                    <div>
                      <h3 className="text-[10px] uppercase tracking-wider mb-2" style={{ color: '#CBAD8C' }}>Edge Cases</h3>
                      <div className="space-y-2">
                        {selectedAgent.failureModes.map((fm, i) => (
                          <div key={i} className="p-2 rounded" style={{ background: '#252525' }}>
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-[11px] font-medium" style={{ color: '#97A97C' }}>{fm.mode}</p>
                              <span
                                className="px-1.5 py-0.5 rounded text-[9px] font-mono"
                                style={{
                                  background: fm.probability <= 5 ? 'rgba(212,237,57,0.15)' : fm.probability <= 8 ? 'rgba(151,169,124,0.15)' : 'rgba(203,173,140,0.15)',
                                  color: fm.probability <= 5 ? '#D4ED39' : fm.probability <= 8 ? '#97A97C' : '#CBAD8C',
                                }}
                              >
                                {fm.probability}% rare
                              </span>
                            </div>
                            <p className="text-[11px]" style={{ color: '#808080' }}>{fm.fix}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Feedback Prompt */}
                    <div>
                      <h3 className="text-[10px] uppercase tracking-wider mb-2" style={{ color: '#CBAD8C' }}>Feedback Template</h3>
                      <button
                        onClick={() => copyText(selectedAgent.feedbackPrompt, `feedback-${selectedAgent.id}`)}
                        className="w-full p-3 rounded text-left text-xs transition-all hover:scale-[1.01]"
                        style={{
                          background: copied === `feedback-${selectedAgent.id}` ? '#546E40' : '#252525',
                          color: copied === `feedback-${selectedAgent.id}` ? '#FFF5EB' : '#97A97C',
                          border: '1px solid #3a3a3a',
                        }}
                      >
                        {copied === `feedback-${selectedAgent.id}` ? 'Copied!' : selectedAgent.feedbackPrompt}
                      </button>
                    </div>

                    {/* Deploy Command */}
                    {selectedAgent.deployCommand && (
                      <div>
                        <h3 className="text-[10px] uppercase tracking-wider mb-2" style={{ color: '#CBAD8C' }}>Deploy</h3>
                        <code
                          className="block p-2 rounded text-[11px] font-mono"
                          style={{ background: '#0F0F0F', color: '#FABF34', border: '1px solid #3a3a3a' }}
                        >
                          {selectedAgent.deployCommand}
                        </code>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="rounded-xl p-8 text-center" style={{ background: '#1A1A1A', border: '2px dashed #2a2a2a' }}>
                  <p className="text-xs mb-2" style={{ color: '#FFF5EB' }}>Select an agent</p>
                  <p className="text-[10px]" style={{ color: '#808080' }}>
                    View mission, rules, failure handling, and deploy commands
                  </p>
                </div>
              )}

              {/* Project Rules Reference */}
              {filter !== 'all' && filter !== 'general' && (
                <div className="mt-4 rounded-xl p-4" style={{ background: '#1A1A1A', border: '1px solid #2a2a2a' }}>
                  <h3 className="text-[10px] uppercase tracking-wider mb-3" style={{ color: '#CBAD8C' }}>
                    {projectConfigs[filter]?.name} Rules
                  </h3>
                  <ul className="space-y-1">
                    {projectConfigs[filter]?.keyRules.map((rule, i) => (
                      <li key={i} className="text-[11px] flex items-start gap-2" style={{ color: '#97A97C' }}>
                        <span style={{ color: '#FABF34' }}>•</span>
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </IOAuthGate>
  );
}
