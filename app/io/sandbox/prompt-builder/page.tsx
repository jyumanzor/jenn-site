'use client';

import { useState, useEffect, useMemo } from 'react';

// Types
interface SavedPrompt {
  id: string;
  text: string;
  category: 'design' | 'technical' | 'layout' | 'content' | 'debug';
  createdAt: string;
  useCount: number;
  tags: string[];
}

interface ForceCommand {
  id: string;
  text: string;
  isDefault: boolean;
}

interface QuickCode {
  code: string;
  meaning: string;
  expansion: string;
}

// Default data
const defaultForceCommands: ForceCommand[] = [
  { id: '1', text: 'Stop. Re-read the requirements I gave you.', isDefault: true },
  { id: '2', text: "You're not paying attention to what I'm asking.", isDefault: true },
  { id: '3', text: 'Go back to the original file and start over.', isDefault: true },
  { id: '4', text: 'DO NOT change anything else. ONLY change what I specified.', isDefault: true },
  { id: '5', text: 'Read the entire file before making changes.', isDefault: true },
  { id: '6', text: "Explain what you think I want, then I'll confirm before you proceed.", isDefault: true },
  { id: '7', text: "That's wrong. The issue is [X], not [Y].", isDefault: true },
  { id: '8', text: 'Keep the exact same structure, just change [specific thing].', isDefault: true },
];

const quickCodes: QuickCode[] = [
  { code: 'DC', meaning: 'Design/Color', expansion: 'Fix the color scheme. Use only hex codes from my palette.' },
  { code: 'TF', meaning: 'Type Fix', expansion: "Fix the TypeScript types. Don't use 'any'." },
  { code: 'RA', meaning: 'Re-read All', expansion: 'Stop. Re-read all the requirements I gave you.' },
  { code: 'KS', meaning: 'Keep Structure', expansion: 'Keep the exact same structure, only change what I specified.' },
  { code: 'NE', meaning: 'No Extras', expansion: 'DO NOT add anything I didn\'t ask for. No comments, no refactoring.' },
];

const colorPalettes = [
  { name: 'Editorial Greens', colors: ['#3B412D', '#97A97C', '#546E40'] },
  { name: 'Warm Neutrals', colors: ['#FFF5EB', '#FAF3E8', '#CBAD8C'] },
  { name: 'Full Jenn Palette', colors: ['#3B412D', '#546E40', '#97A97C', '#FFF5EB', '#FAF3E8', '#FABF34', '#CBAD8C'] },
  { name: 'Accent Colors Only', colors: ['#FABF34', '#D4A853'] },
];

const frustrationCodes = [
  { trigger: 'wrong color', code: 'DC', description: 'Color issues', expansion: 'Fix the color scheme. Use only hex codes from my palette.' },
  { trigger: 'not what I asked', code: 'RA', description: 'Re-read all', expansion: 'Stop. Re-read all the requirements I gave you.' },
  { trigger: 'changed too much', code: 'KS', description: 'Keep structure', expansion: 'Keep the exact same structure, only change what I specified.' },
  { trigger: 'added extras', code: 'NE', description: 'No extras', expansion: 'DO NOT add anything I didn\'t ask for. No comments, no refactoring.' },
  { trigger: 'types broken', code: 'TF', description: 'Type fix', expansion: 'Fix the TypeScript types. Don\'t use \'any\'.' },
];

// Category colors for the bar chart
const categoryColors: Record<string, string> = {
  design: '#97A97C',    // Sage
  technical: '#FABF34', // Gold
  layout: '#546E40',    // Olive Dark
  content: '#CBAD8C',   // Tan
  debug: '#D4A853',     // Accent Gold
};

const jennProfile = {
  coreValues: [
    'Efficiency over perfection',
    'Clear communication is respect',
    'Tools should serve, not obstruct',
    'Personal aesthetic matters',
  ],
  creativeStyle: [
    'Minimal but warm designs',
    'Editorial, magazine-like aesthetics',
    'Serif headers, clean body text',
    'Nature-inspired color palettes',
  ],
  communicationStyle: [
    'Direct communication',
    'No unnecessary pleasantries in tools',
    'Prefers functional over decorative',
    'Appreciates when AI remembers context',
  ],
  designRules: [
    'Never use lime green as a background',
    'Gold is ONLY for accents (numbers, icons)',
    'Always use Instrument Serif for headers',
    'Body text stays in system-ui/sans-serif',
    'Rounded corners: 12px for panels, 100px for buttons',
  ],
  palette: [
    { name: 'Deep Forest', hex: '#3B412D' },
    { name: 'Forest Mid', hex: '#3C422E' },
    { name: 'Olive Dark', hex: '#546E40' },
    { name: 'Sage', hex: '#97A97C' },
    { name: 'Ivory', hex: '#FFF5EB' },
    { name: 'Cream', hex: '#FAF3E8' },
    { name: 'Gold', hex: '#FABF34' },
    { name: 'Tan', hex: '#CBAD8C' },
  ],
  // From the manifestos
  lifePhilosophy: [
    'Running is the one place with no luck, no shortcuts, and no one else to blame—the result is yours alone',
    'Effort compounds. Setbacks aren\'t permanent. Legacies are built a mile at a time',
    'Ceilings exist until you break them, and then they don\'t',
    'Choose hard things on purpose',
    'It\'s not enough to feel moved by history—you have a responsibility to live differently because of it',
  ],
  workPhilosophy: [
    'How much effort you put into engaging with your team dictates how well you weather tough moments',
    'Joy, even in the thick of the mundane, becomes infectious',
    'You can succeed alone, but achievement is much more meaningful when it\'s shared',
    'Show up, keep going, push through doubt until the work holds',
    'Rituals create culture; culture creates trust',
  ],
  runningMantras: [
    'Using only your heart, mind, and soul, you are responsible for seeing how fast you can get your body to travel 26.2',
    'Running always asks for receipts. It doesn\'t care if the logic makes sense. It cares if you showed up',
    'Progress is measurable and personal—you set a time, a distance, a pace, then see if you can meet it',
    'What brings the race back into focus is the record of what I\'ve already done',
    'I run knowing that with only my heart, mind, and soul, I am responsible for how far I go',
  ],
  background: [
    'Senior Consultant, Economics at FTI Consulting (Litigation & Dispute Resolution)',
    'Marathon runner pursuing sub-3:00 (current PR: 3:09)',
    'BA in Sociology & HIPS from University of Chicago',
    'First-generation, from Dallas, based in Washington DC',
    'Languages: Spanish (native), French (professional), Hindi (proficient)',
  ],
  interests: [
    'Marathon training and running culture',
    'Editorial design and magazine aesthetics',
    'Economic analysis and damages estimation',
    'Travel photography and documentation',
    'Literature (Vonnegut, Kundera, Nietzsche)',
  ],
};

type TabType = 'commands' | 'builder' | 'library' | 'patterns' | 'profile' | 'brand' | 'palettes';
type PromptType = 'design' | 'voice' | 'technical' | 'layout' | 'restructuring' | 'new-idea';
type Category = 'design' | 'technical' | 'layout' | 'content' | 'debug';
type SortOption = 'newest' | 'most-used' | 'alphabetical';

export default function SandboxPage() {
  const [activeTab, setActiveTab] = useState<TabType>('commands');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Force Commands state
  const [forceCommands, setForceCommands] = useState<ForceCommand[]>(defaultForceCommands);
  const [newCommand, setNewCommand] = useState('');

  // Prompt Builder state
  const [promptType, setPromptType] = useState<PromptType>('design');
  const [keywords, setKeywords] = useState('');
  const [styleRef, setStyleRef] = useState('');
  const [audience, setAudience] = useState('');
  const [selectedPalette, setSelectedPalette] = useState('Full Jenn Palette');
  const [additionalContext, setAdditionalContext] = useState('');

  // Library state
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [newPromptText, setNewPromptText] = useState('');
  const [newPromptCategory, setNewPromptCategory] = useState<Category>('design');
  const [newPromptTags, setNewPromptTags] = useState('');

  // Feedback state
  const [savedFeedback, setSavedFeedback] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const storedCommands = localStorage.getItem('jenn-force-commands');
    const storedPrompts = localStorage.getItem('jenn-prompt-library');

    if (storedCommands) {
      const customCommands = JSON.parse(storedCommands);
      setForceCommands([...defaultForceCommands, ...customCommands]);
    }
    if (storedPrompts) {
      setSavedPrompts(JSON.parse(storedPrompts));
    }
  }, []);

  // Generate prompt
  const generatedPrompt = useMemo(() => {
    const parts: string[] = [];
    const typeLabel = promptType.charAt(0).toUpperCase() + promptType.slice(1).replace('-', ' ');

    parts.push(`# ${typeLabel} Prompt`);
    parts.push('');

    const typeIntros: Record<PromptType, string> = {
      'design': 'I need help with a design task. Please follow my specific aesthetic preferences and design rules.',
      'voice': 'I need help establishing or refining voice and tone. Please match my communication style preferences.',
      'technical': 'I need technical implementation help. Please provide clean, well-typed code.',
      'layout': 'I need help with layout and structure. Please follow my design system specifications.',
      'restructuring': 'I need help restructuring existing content or code. Please maintain the core intent while improving organization.',
      'new-idea': 'I have a new idea I want to explore. Please help me develop it while respecting my established preferences.',
    };
    parts.push(`> ${typeIntros[promptType]}`);
    parts.push('');

    parts.push('## Details');
    parts.push('');

    if (keywords) {
      parts.push(`**Key Words/Concepts:** ${keywords}`);
      parts.push('');
    }

    if (styleRef) {
      parts.push(`**Style Reference:** ${styleRef}`);
      parts.push('');
    }

    if (audience) {
      parts.push(`**Target Audience:** ${audience}`);
      parts.push('');
    }

    const palette = colorPalettes.find(p => p.name === selectedPalette);
    if (palette) {
      parts.push('## Color Palette');
      parts.push('');
      parts.push(`**${palette.name}**`);
      parts.push('');
      parts.push('| Color | Hex Code |');
      parts.push('|-------|----------|');
      palette.colors.forEach(hex => {
        const colorInfo = jennProfile.palette.find(c => c.hex === hex);
        const name = colorInfo ? colorInfo.name : 'Custom';
        parts.push(`| ${name} | \`${hex}\` |`);
      });
      parts.push('');
    }

    if (additionalContext) {
      parts.push('## Additional Context');
      parts.push('');
      parts.push(additionalContext);
      parts.push('');
    }

    if (['design', 'layout'].includes(promptType)) {
      parts.push('---');
      parts.push('');
      parts.push('## Jenn\'s Design Rules (MUST FOLLOW)');
      parts.push('');
      parts.push('**Colors:**');
      parts.push('- NEVER use lime green as a background');
      parts.push('- Gold (`#FABF34`) is ONLY for accents (numbers, icons, highlights)');
      parts.push('');
      parts.push('**Typography:**');
      parts.push('- Headers: `Instrument Serif` (italic for emphasis)');
      parts.push('- Body text: `system-ui` / sans-serif');
      parts.push('');
      parts.push('**Border Radius:**');
      parts.push('- Panels/cards: `12px`');
      parts.push('- Buttons: `100px` (pill shape)');
      parts.push('');
      parts.push('**General:**');
      parts.push('- Minimal but warm aesthetic');
      parts.push('- Editorial, magazine-like feel');
      parts.push('- Nature-inspired color choices');
      parts.push('');
    }

    if (promptType === 'voice') {
      parts.push('---');
      parts.push('');
      parts.push('## Voice & Tone Guidelines');
      parts.push('');
      parts.push('- Direct communication, no unnecessary pleasantries');
      parts.push('- Functional over decorative language');
      parts.push('- Clear and efficient, but not cold');
      parts.push('- Professional but personable');
      parts.push('');
    }

    if (promptType === 'technical') {
      parts.push('---');
      parts.push('');
      parts.push('## Technical Preferences');
      parts.push('');
      parts.push('- Use TypeScript with proper types (avoid `any`)');
      parts.push('- Prefer functional components with hooks');
      parts.push('- Keep code clean and well-organized');
      parts.push('- No unnecessary comments or refactoring beyond the ask');
      parts.push('');
    }

    return parts.join('\n');
  }, [promptType, keywords, styleRef, audience, selectedPalette, additionalContext]);

  // Filtered and sorted prompts
  const filteredPrompts = useMemo(() => {
    const filtered = savedPrompts.filter(p => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = p.text.toLowerCase().includes(searchLower) ||
        p.tags.some(t => t.toLowerCase().includes(searchLower));
      const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    const sorted = [...filtered];
    switch (sortOption) {
      case 'newest':
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'most-used':
        sorted.sort((a, b) => b.useCount - a.useCount);
        break;
      case 'alphabetical':
        sorted.sort((a, b) => a.text.localeCompare(b.text));
        break;
    }
    return sorted;
  }, [savedPrompts, searchQuery, categoryFilter, sortOption]);

  // Usage stats
  const usageStats = useMemo(() => {
    const stats: Record<Category, number> = { design: 0, technical: 0, layout: 0, content: 0, debug: 0 };
    savedPrompts.forEach(p => {
      stats[p.category] = (stats[p.category] || 0) + 1;
    });
    return stats;
  }, [savedPrompts]);

  const maxStat = Math.max(...Object.values(usageStats), 1);

  // Save to localStorage
  const saveCommands = (commands: ForceCommand[]) => {
    const customCommands = commands.filter(c => !c.isDefault);
    localStorage.setItem('jenn-force-commands', JSON.stringify(customCommands));
  };

  const savePrompts = (prompts: SavedPrompt[]) => {
    localStorage.setItem('jenn-prompt-library', JSON.stringify(prompts));
  };

  // Copy to clipboard
  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Add custom command
  const addCommand = () => {
    if (!newCommand.trim()) return;
    const newCmd: ForceCommand = {
      id: Date.now().toString(),
      text: newCommand.trim(),
      isDefault: false,
    };
    const updated = [...forceCommands, newCmd];
    setForceCommands(updated);
    saveCommands(updated);
    setNewCommand('');
  };

  // Delete command
  const deleteCommand = (id: string) => {
    const updated = forceCommands.filter(c => c.id !== id);
    setForceCommands(updated);
    saveCommands(updated);
  };

  const saveToLibrary = () => {
    // Map prompt types to categories
    const categoryMap: Record<PromptType, Category> = {
      'design': 'design',
      'voice': 'content',
      'technical': 'technical',
      'layout': 'layout',
      'restructuring': 'debug',
      'new-idea': 'design',
    };

    const newPrompt: SavedPrompt = {
      id: Date.now().toString(),
      text: generatedPrompt,
      category: categoryMap[promptType],
      createdAt: new Date().toISOString(),
      useCount: 0,
      tags: keywords.split(',').map(t => t.trim()).filter(Boolean),
    };
    const updated = [...savedPrompts, newPrompt];
    setSavedPrompts(updated);
    savePrompts(updated);

    // Show saved feedback
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  // Add manual prompt
  const addManualPrompt = () => {
    if (!newPromptText.trim()) return;
    const parsedTags = newPromptTags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);
    const newPrompt: SavedPrompt = {
      id: Date.now().toString(),
      text: newPromptText.trim(),
      category: newPromptCategory,
      createdAt: new Date().toISOString(),
      useCount: 0,
      tags: parsedTags,
    };
    const updated = [...savedPrompts, newPrompt];
    setSavedPrompts(updated);
    savePrompts(updated);
    setNewPromptText('');
    setNewPromptTags('');
  };

  // Copy prompt and increment use count
  const copyPromptAndIncrement = async (prompt: SavedPrompt) => {
    await navigator.clipboard.writeText(prompt.text);
    setCopiedId(prompt.id);
    setTimeout(() => setCopiedId(null), 2000);

    // Increment use count
    const updated = savedPrompts.map(p =>
      p.id === prompt.id ? { ...p, useCount: p.useCount + 1 } : p
    );
    setSavedPrompts(updated);
    savePrompts(updated);
  };

  // Delete prompt
  const deletePrompt = (id: string) => {
    const updated = savedPrompts.filter(p => p.id !== id);
    setSavedPrompts(updated);
    savePrompts(updated);
  };

  // Copy full profile
  const copyFullProfile = async () => {
    const profileText = `# Jenn's AI Profile

## Background
${jennProfile.background.map(b => `- ${b}`).join('\n')}

## Life Philosophy
${jennProfile.lifePhilosophy.map((p, i) => `${i + 1}. ${p}`).join('\n')}

## Running Mantras
${jennProfile.runningMantras.map(m => `> "${m}"`).join('\n')}

## Work Philosophy
${jennProfile.workPhilosophy.map(w => `- ${w}`).join('\n')}

## Core Values
${jennProfile.coreValues.map(v => `- ${v}`).join('\n')}

## Creative Style
${jennProfile.creativeStyle.map(s => `- ${s}`).join('\n')}

## Communication Style
${jennProfile.communicationStyle.map(s => `- ${s}`).join('\n')}

## Design Rules
${jennProfile.designRules.map((r, i) => `${i + 1}. ${r}`).join('\n')}

## Interests
${jennProfile.interests.map(i => `- ${i}`).join('\n')}

## Color Palette
${jennProfile.palette.map(c => `- ${c.name}: ${c.hex}`).join('\n')}`;

    await navigator.clipboard.writeText(profileText);
    setCopiedId('profile');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: 'commands', label: 'Force Commands' },
    { id: 'builder', label: 'Prompt Builder' },
    { id: 'library', label: 'Library' },
    { id: 'patterns', label: 'Patterns' },
    { id: 'profile', label: 'AI Understanding' },
    { id: 'brand', label: 'Brand Builder' },
    { id: 'palettes', label: 'Palettes' },
  ];

  return (
    <div className="min-h-screen bg-cream">
      <div className="container-editorial py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl mb-2" style={{ color: '#3B412D', fontFamily: 'var(--font-instrument)' }}>
            <span className="italic">Jenn&apos;s</span> Prompt Builder
          </h1>
          <p style={{ color: '#546E40' }}>Tools for wrangling AI when it&apos;s being difficult</p>
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
          {/* Force Commands */}
          {activeTab === 'commands' && (
            <div className="space-y-6">
              {/* Header with stats */}
              <div className="flex items-center justify-between">
                <p className="text-sm" style={{ color: '#CBAD8C' }}>
                  Quick commands for when Claude is being really stupid
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2 py-1 rounded" style={{ background: '#EFE4D6', color: '#97A97C' }}>
                    <span style={{ color: '#FABF34', fontFamily: 'monospace' }}>{forceCommands.filter(c => c.isDefault).length}</span> default
                  </span>
                  <span className="text-xs px-2 py-1 rounded" style={{ background: '#EFE4D6', color: '#97A97C' }}>
                    <span style={{ color: '#FABF34', fontFamily: 'monospace' }}>{forceCommands.filter(c => !c.isDefault).length}</span> custom
                  </span>
                </div>
              </div>

              {/* Quick Codes */}
              <div className="rounded-xl p-4" style={{ background: '#FFF5EB', border: '1px solid #97A97C' }}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg" style={{ color: '#3B412D' }}>Quick Codes</h3>
                  <span className="text-xs" style={{ color: '#97A97C' }}>2-letter shortcuts</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {quickCodes.map(qc => (
                    <button
                      key={qc.code}
                      onClick={() => copyToClipboard(qc.expansion, qc.code)}
                      className="relative p-3 rounded-lg text-left transition-all hover:scale-[1.02] group"
                      style={{
                        background: copiedId === qc.code ? '#546E40' : '#3C422E',
                        border: copiedId === qc.code ? '1px solid #97A97C' : '1px solid transparent'
                      }}
                      title={qc.expansion}
                    >
                      <span className="block text-xl font-mono font-bold" style={{ color: '#FABF34' }}>{qc.code}</span>
                      <span className="text-xs block mb-1" style={{ color: '#CBAD8C' }}>{qc.meaning}</span>
                      <span
                        className="text-xs line-clamp-2 opacity-60 group-hover:opacity-100 transition-opacity"
                        style={{ color: '#3B412D' }}
                      >
                        {qc.expansion}
                      </span>
                      {copiedId === qc.code && (
                        <span
                          className="absolute top-2 right-2 text-xs px-1.5 py-0.5 rounded"
                          style={{ background: '#97A97C', color: '#2F2F2C' }}
                        >
                          Copied!
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Default Commands */}
              <div>
                <h3 className="text-sm uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: '#CBAD8C' }}>
                  <span>Default Commands</span>
                  <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: '#EFE4D6', color: '#97A97C' }}>protected</span>
                </h3>
                <div className="space-y-2">
                  {forceCommands.filter(cmd => cmd.isDefault).map((cmd, index) => (
                    <div
                      key={cmd.id}
                      onClick={() => copyToClipboard(cmd.text, cmd.id)}
                      className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:translate-x-1"
                      style={{
                        background: copiedId === cmd.id ? '#546E40' : '#3B412D',
                        border: copiedId === cmd.id ? '1px solid #97A97C' : '1px solid transparent'
                      }}
                    >
                      <span
                        className="text-sm font-mono w-6 text-center flex-shrink-0"
                        style={{ color: '#FABF34' }}
                      >
                        {index + 1}
                      </span>
                      <span className="flex-1 text-sm" style={{ color: '#3B412D' }}>
                        {cmd.text}
                      </span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {copiedId === cmd.id && (
                          <span
                            className="text-xs px-2 py-1 rounded"
                            style={{ background: '#97A97C', color: '#2F2F2C' }}
                          >
                            Copied!
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Commands */}
              <div>
                <h3 className="text-sm uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: '#CBAD8C' }}>
                  <span>Custom Commands</span>
                  <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: '#546E40', color: '#FFF5EB' }}>editable</span>
                </h3>
                {forceCommands.filter(cmd => !cmd.isDefault).length === 0 ? (
                  <div
                    className="text-center py-6 rounded-lg"
                    style={{ background: '#3B412D', border: '1px dashed #3C422E' }}
                  >
                    <p className="text-sm" style={{ color: '#97A97C' }}>No custom commands yet</p>
                    <p className="text-xs mt-1" style={{ color: '#546E40' }}>Add your own below</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {forceCommands.filter(cmd => !cmd.isDefault).map(cmd => (
                      <div
                        key={cmd.id}
                        className="flex items-center gap-3 p-3 rounded-lg group transition-all"
                        style={{
                          background: copiedId === cmd.id ? '#546E40' : '#3B412D',
                          border: '1px solid #546E40'
                        }}
                      >
                        <button
                          onClick={() => copyToClipboard(cmd.text, cmd.id)}
                          className="flex-1 text-left text-sm"
                          style={{ color: '#3B412D' }}
                        >
                          {cmd.text}
                        </button>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {copiedId === cmd.id ? (
                            <span
                              className="text-xs px-2 py-1 rounded"
                              style={{ background: '#97A97C', color: '#2F2F2C' }}
                            >
                              Copied!
                            </span>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteCommand(cmd.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 px-2 py-1 rounded text-xs transition-all hover:bg-red-900/30"
                              style={{ color: '#CBAD8C', background: '#EFE4D6' }}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Custom Command */}
              <div className="rounded-xl p-4" style={{ background: '#3B412D', border: '1px solid #CBAD8C' }}>
                <h3 className="text-sm uppercase tracking-wider mb-3" style={{ color: '#CBAD8C' }}>
                  Add Custom Command
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCommand}
                    onChange={(e) => setNewCommand(e.target.value)}
                    placeholder="Type a new command phrase..."
                    className="flex-1 px-4 py-3 rounded-lg text-sm"
                    style={{
                      background: '#EFE4D6',
                      color: '#FFF5EB',
                      border: '1px solid #546E40',
                      outline: 'none'
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newCommand.trim()) {
                        addCommand();
                      }
                    }}
                  />
                  <button
                    onClick={addCommand}
                    disabled={!newCommand.trim()}
                    className="px-6 py-3 rounded-lg text-sm font-medium transition-all hover:scale-[1.02]"
                    style={{
                      background: newCommand.trim() ? '#546E40' : '#3C422E',
                      color: '#FFF5EB',
                      opacity: newCommand.trim() ? 1 : 0.5,
                      cursor: newCommand.trim() ? 'pointer' : 'not-allowed'
                    }}
                  >
                    + Add
                  </button>
                </div>
                <p className="text-xs mt-2" style={{ color: '#97A97C' }}>
                  Press Enter to add quickly. Custom commands are saved to your browser.
                </p>
              </div>
            </div>
          )}

          {/* Prompt Builder */}
          {activeTab === 'builder' && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: '#CBAD8C' }}>
                    Prompt Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(['design', 'voice', 'technical', 'layout', 'restructuring', 'new-idea'] as PromptType[]).map(type => (
                      <button
                        key={type}
                        onClick={() => setPromptType(type)}
                        className="px-3 py-1.5 rounded-full text-sm capitalize"
                        style={{
                          background: promptType === type ? '#546E40' : '#3C422E',
                          color: promptType === type ? '#FFF5EB' : '#97A97C',
                        }}
                      >
                        {type.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: '#CBAD8C' }}>
                    Key Words/Concepts
                  </label>
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="warm, editorial, minimal..."
                    className="w-full px-4 py-2 rounded-lg text-sm"
                    style={{ background: '#EFE4D6', color: '#3B412D', border: '1px solid #546E40' }}
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: '#CBAD8C' }}>
                    Style Reference
                  </label>
                  <input
                    type="text"
                    value={styleRef}
                    onChange={(e) => setStyleRef(e.target.value)}
                    placeholder="Graza, Kinfolk, etc..."
                    className="w-full px-4 py-2 rounded-lg text-sm"
                    style={{ background: '#EFE4D6', color: '#3B412D', border: '1px solid #546E40' }}
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: '#CBAD8C' }}>
                    Audience
                  </label>
                  <input
                    type="text"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    placeholder="Personal use, portfolio visitors..."
                    className="w-full px-4 py-2 rounded-lg text-sm"
                    style={{ background: '#EFE4D6', color: '#3B412D', border: '1px solid #546E40' }}
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: '#CBAD8C' }}>
                    Color Palette
                  </label>
                  <select
                    value={selectedPalette}
                    onChange={(e) => setSelectedPalette(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg text-sm"
                    style={{ background: '#EFE4D6', color: '#3B412D', border: '1px solid #546E40' }}
                  >
                    {colorPalettes.map(p => (
                      <option key={p.name} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                  <div className="flex gap-1 mt-2">
                    {colorPalettes.find(p => p.name === selectedPalette)?.colors.map((c, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded"
                        style={{ background: c }}
                        title={c}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: '#CBAD8C' }}>
                    Additional Context
                  </label>
                  <textarea
                    value={additionalContext}
                    onChange={(e) => setAdditionalContext(e.target.value)}
                    placeholder="Any other details..."
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg text-sm resize-none"
                    style={{ background: '#EFE4D6', color: '#3B412D', border: '1px solid #546E40' }}
                  />
                </div>
              </div>

              {/* Output */}
              <div className="rounded-xl p-4" style={{ background: '#FFF5EB', border: '1px solid #CBAD8C' }}>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg" style={{ color: '#3B412D' }}>Generated Prompt</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(generatedPrompt, 'generated')}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium"
                      style={{ background: '#546E40', color: '#FFF5EB' }}
                    >
                      {copiedId === 'generated' ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={saveToLibrary}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                      style={{
                        background: savedFeedback ? '#546E40' : '#3C422E',
                        color: savedFeedback ? '#FFF5EB' : '#97A97C',
                      }}
                    >
                      {savedFeedback ? 'Saved!' : 'Save to Library'}
                    </button>
                  </div>
                </div>
                <pre
                  className="whitespace-pre-wrap text-sm font-sans"
                  style={{ color: '#3B412D' }}
                >
                  {generatedPrompt}
                </pre>
              </div>
            </div>
          )}

          {/* Library */}
          {activeTab === 'library' && (
            <div className="space-y-4">
              {/* Search & Filter */}
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search prompts..."
                  className="flex-1 px-4 py-2 rounded-lg text-sm"
                  style={{ background: '#EFE4D6', color: '#3B412D', border: '1px solid #546E40' }}
                />
                <div className="flex gap-2">
                  {(['all', 'design', 'technical', 'layout', 'content', 'debug'] as const).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className="px-3 py-1.5 rounded-full text-xs capitalize"
                      style={{
                        background: categoryFilter === cat ? '#546E40' : '#3C422E',
                        color: categoryFilter === cat ? '#FFF5EB' : '#97A97C',
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Saved Prompts */}
              {/* Sort Options */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs" style={{ color: '#97A97C' }}>Sort by:</span>
                {(['newest', 'most-used', 'alphabetical'] as SortOption[]).map(opt => (
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
              </div>

              <div className="space-y-2">
                {savedPrompts.length === 0 ? (
                  <div className="text-center py-12 rounded-xl" style={{ background: '#FFF5EB', border: '1px solid #CBAD8C' }}>
                    <div className="mb-4" style={{ color: '#546E40' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="text-lg mb-2" style={{ color: '#3B412D' }}>No prompts saved yet</h3>
                    <p className="text-sm" style={{ color: '#97A97C' }}>
                      Use the Prompt Builder or add prompts manually below
                    </p>
                  </div>
                ) : filteredPrompts.length === 0 ? (
                  <div className="text-center py-8 rounded-xl" style={{ background: '#FFF5EB', border: '1px solid #CBAD8C' }}>
                    <p style={{ color: '#97A97C' }}>
                      No prompts match your search or filter
                    </p>
                  </div>
                ) : (
                  filteredPrompts.map(prompt => (
                    <div
                      key={prompt.id}
                      className="p-4 rounded-lg group"
                      style={{ background: '#FFF5EB', border: '1px solid #CBAD8C' }}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span
                              className="px-2 py-0.5 rounded text-xs uppercase"
                              style={{ background: categoryColors[prompt.category] || '#3C422E', color: '#FFF5EB' }}
                            >
                              {prompt.category}
                            </span>
                            <span className="text-xs" style={{ color: '#97A97C' }}>
                              {new Date(prompt.createdAt).toLocaleDateString()}
                            </span>
                            {prompt.useCount > 0 && (
                              <span className="text-xs font-mono" style={{ color: '#FABF34' }}>
                                Used {prompt.useCount}x
                              </span>
                            )}
                          </div>
                          <p className="text-sm line-clamp-3 mb-2" style={{ color: '#3B412D' }}>
                            {prompt.text}
                          </p>
                          {prompt.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {prompt.tags.map((tag, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 rounded-full text-xs"
                                  style={{ background: '#EFE4D6', color: '#97A97C' }}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => copyPromptAndIncrement(prompt)}
                            className="px-3 py-1.5 rounded-lg text-xs"
                            style={{ background: '#546E40', color: '#FFF5EB' }}
                          >
                            {copiedId === prompt.id ? 'Copied!' : 'Copy'}
                          </button>
                          <button
                            onClick={() => deletePrompt(prompt.id)}
                            className="opacity-0 group-hover:opacity-100 px-2 py-1.5 rounded-lg text-xs transition-opacity"
                            style={{ background: '#EFE4D6', color: '#97A97C' }}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Prompt count */}
              {savedPrompts.length > 0 && (
                <div className="text-xs text-center" style={{ color: '#97A97C' }}>
                  Showing {filteredPrompts.length} of {savedPrompts.length} prompts
                </div>
              )}

              {/* Add Manual Prompt */}
              <div className="rounded-xl p-4 mt-6" style={{ background: '#FFF5EB', border: '1px solid #CBAD8C' }}>
                <h3 className="text-sm uppercase tracking-wider mb-4" style={{ color: '#CBAD8C' }}>Add Prompt Manually</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: '#97A97C' }}>
                      Prompt Text
                    </label>
                    <textarea
                      value={newPromptText}
                      onChange={(e) => setNewPromptText(e.target.value)}
                      placeholder="Enter your prompt text..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg text-sm resize-none"
                      style={{ background: '#EFE4D6', color: '#3B412D', border: '1px solid #546E40' }}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: '#97A97C' }}>
                        Category
                      </label>
                      <select
                        value={newPromptCategory}
                        onChange={(e) => setNewPromptCategory(e.target.value as Category)}
                        className="w-full px-3 py-2 rounded-lg text-sm"
                        style={{ background: '#EFE4D6', color: '#3B412D', border: '1px solid #546E40' }}
                      >
                        {(['design', 'technical', 'layout', 'content', 'debug'] as Category[]).map(cat => (
                          <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: '#97A97C' }}>
                        Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        value={newPromptTags}
                        onChange={(e) => setNewPromptTags(e.target.value)}
                        placeholder="react, styling, animation..."
                        className="w-full px-3 py-2 rounded-lg text-sm"
                        style={{ background: '#EFE4D6', color: '#3B412D', border: '1px solid #546E40' }}
                      />
                    </div>
                  </div>
                  <button
                    onClick={addManualPrompt}
                    disabled={!newPromptText.trim()}
                    className="w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
                    style={{
                      background: newPromptText.trim() ? '#546E40' : '#3C422E',
                      color: newPromptText.trim() ? '#FFF5EB' : '#97A97C',
                      cursor: newPromptText.trim() ? 'pointer' : 'not-allowed',
                    }}
                  >
                    Add to Library
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Patterns */}
          {activeTab === 'patterns' && (
            <div className="space-y-6">
              {/* Quick Insights */}
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-xl p-4 text-center" style={{ background: '#FFF5EB', border: '1px solid #CBAD8C' }}>
                  <span className="block text-3xl font-mono mb-1" style={{ color: '#FABF34' }}>
                    {savedPrompts.length}
                  </span>
                  <span className="text-xs uppercase tracking-wider" style={{ color: '#97A97C' }}>
                    Total Prompts
                  </span>
                </div>
                <div className="rounded-xl p-4 text-center" style={{ background: '#FFF5EB', border: '1px solid #CBAD8C' }}>
                  <span className="block text-2xl font-mono mb-1 capitalize" style={{ color: '#FABF34' }}>
                    {savedPrompts.length > 0
                      ? (Object.entries(usageStats) as [Category, number][]).reduce(
                          (max, [cat, count]) => (count > max.count ? { cat, count } : max),
                          { cat: 'none' as string, count: 0 }
                        ).cat
                      : '-'}
                  </span>
                  <span className="text-xs uppercase tracking-wider" style={{ color: '#97A97C' }}>
                    Most Used
                  </span>
                </div>
                <div className="rounded-xl p-4 text-center" style={{ background: '#FFF5EB', border: '1px solid #CBAD8C' }}>
                  <span className="block text-3xl font-mono mb-1" style={{ color: '#FABF34' }}>
                    {savedPrompts.length > 0
                      ? Math.round(savedPrompts.reduce((sum, p) => sum + p.text.length, 0) / savedPrompts.length)
                      : 0}
                  </span>
                  <span className="text-xs uppercase tracking-wider" style={{ color: '#97A97C' }}>
                    Avg Length
                  </span>
                </div>
              </div>

              {/* Usage Stats Bar Chart */}
              <div className="rounded-xl p-4" style={{ background: '#FFF5EB', border: '1px solid #CBAD8C' }}>
                <h3 className="text-lg mb-4" style={{ color: '#3B412D' }}>Prompt Usage by Category</h3>
                <div className="space-y-3">
                  {(Object.entries(usageStats) as [Category, number][]).map(([cat, count]) => (
                    <div key={cat} className="flex items-center gap-3">
                      <span className="w-20 text-xs uppercase" style={{ color: '#CBAD8C' }}>{cat}</span>
                      <div className="flex-1 h-8 rounded-lg overflow-hidden" style={{ background: '#2F2F2C' }}>
                        <div
                          className="h-full rounded-lg transition-all duration-500 flex items-center justify-end pr-2"
                          style={{
                            width: count > 0 ? `${Math.max((count / maxStat) * 100, 8)}%` : '0%',
                            background: categoryColors[cat] || '#546E40',
                            minWidth: count > 0 ? '32px' : '0',
                          }}
                        >
                          {count > 0 && (
                            <span className="text-xs font-mono font-medium" style={{ color: '#2F2F2C' }}>
                              {count}
                            </span>
                          )}
                        </div>
                      </div>
                      {count === 0 && (
                        <span className="w-8 text-right font-mono text-xs" style={{ color: '#546E40' }}>0</span>
                      )}
                    </div>
                  ))}
                </div>
                {/* Legend */}
                <div className="flex flex-wrap gap-3 mt-4 pt-4" style={{ borderTop: '1px solid #3C422E' }}>
                  {(Object.entries(categoryColors) as [string, string][]).map(([cat, color]) => (
                    <div key={cat} className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded" style={{ background: color }} />
                      <span className="text-xs capitalize" style={{ color: '#97A97C' }}>{cat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Frustration Codes Mapping Table */}
              <div className="rounded-xl p-4" style={{ background: '#FFF5EB', border: '1px solid #CBAD8C' }}>
                <h3 className="text-lg mb-2" style={{ color: '#3B412D' }}>Frustration Codes Mapping</h3>
                <p className="text-sm mb-4" style={{ color: '#97A97C' }}>
                  Click any row to copy the quick code expansion
                </p>

                {/* Table Header */}
                <div
                  className="grid gap-4 px-4 py-2 rounded-t-lg text-xs uppercase tracking-wider"
                  style={{
                    gridTemplateColumns: '1fr 60px 1fr',
                    background: '#2F2F2C',
                    color: '#CBAD8C'
                  }}
                >
                  <span>Trigger Phrase</span>
                  <span className="text-center">Code</span>
                  <span>Description</span>
                </div>

                {/* Table Rows */}
                <div className="space-y-1 mt-1">
                  {frustrationCodes.map(fc => (
                    <button
                      key={fc.code}
                      onClick={() => copyToClipboard(fc.expansion, `frustration-${fc.code}`)}
                      className="w-full grid gap-4 px-4 py-3 rounded-lg text-left transition-all hover:scale-[1.01] group"
                      style={{
                        gridTemplateColumns: '1fr 60px 1fr',
                        background: copiedId === `frustration-${fc.code}` ? '#546E40' : '#3C422E',
                      }}
                    >
                      <span className="text-sm" style={{ color: '#3B412D' }}>
                        &ldquo;{fc.trigger}&rdquo;
                      </span>
                      <span
                        className="text-center font-mono font-bold text-sm"
                        style={{ color: copiedId === `frustration-${fc.code}` ? '#FFF5EB' : '#FABF34' }}
                      >
                        {fc.code}
                      </span>
                      <div className="flex items-center justify-between">
                        <span className="text-sm" style={{ color: '#97A97C' }}>{fc.description}</span>
                        <span
                          className="text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{
                            background: '#2F2F2C',
                            color: copiedId === `frustration-${fc.code}` ? '#FABF34' : '#97A97C'
                          }}
                        >
                          {copiedId === `frustration-${fc.code}` ? 'Copied!' : 'Click to copy'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* AI Understanding Profile */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4" style={{ borderBottom: '1px solid #3C422E' }}>
                <div>
                  <h2
                    className="text-2xl md:text-3xl italic"
                    style={{ color: '#3B412D', fontFamily: 'var(--font-instrument)' }}
                  >
                    Jenn&apos;s AI Profile
                  </h2>
                  <p className="text-sm mt-1" style={{ color: '#97A97C' }}>
                    Share this with AI to help it understand your preferences
                  </p>
                </div>
                <button
                  onClick={copyFullProfile}
                  className="px-6 py-2.5 text-sm font-medium transition-all hover:opacity-90"
                  style={{
                    background: '#546E40',
                    color: '#FFF5EB',
                    borderRadius: '100px'
                  }}
                >
                  {copiedId === 'profile' ? 'Copied to Clipboard!' : 'Copy Full Profile'}
                </button>
              </div>

              {/* Background Section - Full Width */}
              <div
                className="p-5"
                style={{
                  background: '#FFF5EB',
                  borderRadius: '12px',
                  border: '1px solid #CBAD8C'
                }}
              >
                <h3
                  className="text-lg mb-4 italic"
                  style={{ color: '#3B412D', fontFamily: 'var(--font-instrument)' }}
                >
                  Background
                </h3>
                <div className="flex flex-wrap gap-2">
                  {jennProfile.background.map((item, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-full text-sm"
                      style={{ background: '#3B412D', color: '#FFF5EB' }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Life Philosophy - Full Width Feature */}
              <div
                className="p-6"
                style={{
                  background: 'linear-gradient(135deg, #3B412D 0%, #546E40 100%)',
                  borderRadius: '12px',
                  border: '1px solid #97A97C'
                }}
              >
                <h3
                  className="text-xl mb-5 italic"
                  style={{ color: '#FFF5EB', fontFamily: 'var(--font-instrument)' }}
                >
                  Life Philosophy
                </h3>
                <div className="space-y-4">
                  {jennProfile.lifePhilosophy.map((p, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <span
                        className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-lg font-mono font-bold rounded-full"
                        style={{ background: 'rgba(250,191,52,0.2)', color: '#FABF34' }}
                      >
                        {i + 1}
                      </span>
                      <p className="text-sm leading-relaxed pt-1" style={{ color: '#FFF5EB' }}>
                        {p}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Running Mantras */}
              <div
                className="p-5"
                style={{
                  background: '#FFF5EB',
                  borderRadius: '12px',
                  border: '2px solid #FABF34'
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span style={{ color: '#FABF34', fontSize: '1.5rem' }}>&#127939;</span>
                  <h3
                    className="text-lg italic"
                    style={{ color: '#3B412D', fontFamily: 'var(--font-instrument)' }}
                  >
                    Running Mantras
                  </h3>
                </div>
                <div className="space-y-3">
                  {jennProfile.runningMantras.map((m, i) => (
                    <blockquote
                      key={i}
                      className="text-sm italic pl-4 border-l-2"
                      style={{ color: '#546E40', borderColor: '#FABF34' }}
                    >
                      &ldquo;{m}&rdquo;
                    </blockquote>
                  ))}
                </div>
              </div>

              {/* Profile Cards Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Work Philosophy */}
                <div
                  className="p-5"
                  style={{
                    background: '#FFF5EB',
                    borderRadius: '12px',
                    border: '1px solid #CBAD8C'
                  }}
                >
                  <h3
                    className="text-lg mb-4 italic"
                    style={{ color: '#3B412D', fontFamily: 'var(--font-instrument)' }}
                  >
                    Work Philosophy
                  </h3>
                  <ul className="space-y-3">
                    {jennProfile.workPhilosophy.map((w, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm" style={{ color: '#546E40' }}>
                        <span
                          className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-xs font-medium"
                          style={{ color: '#FABF34' }}
                        >
                          &#10004;
                        </span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Core Values */}
                <div
                  className="p-5"
                  style={{
                    background: '#FFF5EB',
                    borderRadius: '12px',
                    border: '1px solid #CBAD8C'
                  }}
                >
                  <h3
                    className="text-lg mb-4 italic"
                    style={{ color: '#3B412D', fontFamily: 'var(--font-instrument)' }}
                  >
                    Core Values
                  </h3>
                  <ul className="space-y-3">
                    {jennProfile.coreValues.map((v, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm" style={{ color: '#546E40' }}>
                        <span
                          className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-xs font-medium"
                          style={{ color: '#FABF34' }}
                        >
                          *
                        </span>
                        <span>{v}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Creative Style */}
                <div
                  className="p-5"
                  style={{
                    background: '#FFF5EB',
                    borderRadius: '12px',
                    border: '1px solid #CBAD8C'
                  }}
                >
                  <h3
                    className="text-lg mb-4 italic"
                    style={{ color: '#3B412D', fontFamily: 'var(--font-instrument)' }}
                  >
                    Creative Style
                  </h3>
                  <ul className="space-y-3">
                    {jennProfile.creativeStyle.map((s, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm" style={{ color: '#546E40' }}>
                        <span
                          className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-xs font-medium"
                          style={{ color: '#FABF34' }}
                        >
                          *
                        </span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Communication Style */}
                <div
                  className="p-5"
                  style={{
                    background: '#FFF5EB',
                    borderRadius: '12px',
                    border: '1px solid #CBAD8C'
                  }}
                >
                  <h3
                    className="text-lg mb-4 italic"
                    style={{ color: '#3B412D', fontFamily: 'var(--font-instrument)' }}
                  >
                    Communication Style
                  </h3>
                  <ul className="space-y-3">
                    {jennProfile.communicationStyle.map((s, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm" style={{ color: '#546E40' }}>
                        <span
                          className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-xs font-medium"
                          style={{ color: '#FABF34' }}
                        >
                          *
                        </span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Design Rules - Full Width */}
              <div
                className="p-5"
                style={{
                  background: '#FFF5EB',
                  borderRadius: '12px',
                  border: '1px solid #CBAD8C'
                }}
              >
                <h3
                  className="text-lg mb-4 italic"
                  style={{ color: '#3B412D', fontFamily: 'var(--font-instrument)' }}
                >
                  Design Rules
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {jennProfile.designRules.map((r, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm p-3 rounded-lg" style={{ background: '#3B412D' }}>
                      <span
                        className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-xs font-mono font-bold rounded"
                        style={{ background: '#FABF34', color: '#3B412D' }}
                      >
                        {i + 1}
                      </span>
                      <span style={{ color: '#FFF5EB' }}>{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div
                className="p-5"
                style={{
                  background: '#FFF5EB',
                  borderRadius: '12px',
                  border: '1px solid #CBAD8C'
                }}
              >
                <h3
                  className="text-lg mb-4 italic"
                  style={{ color: '#3B412D', fontFamily: 'var(--font-instrument)' }}
                >
                  Interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {jennProfile.interests.map((item, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 rounded-full text-sm"
                      style={{ background: '#97A97C', color: '#FFF5EB' }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Color Palette - Full Width */}
              <div
                className="p-5"
                style={{
                  background: '#FFF5EB',
                  borderRadius: '12px',
                  border: '1px solid #CBAD8C'
                }}
              >
                <div className="flex items-center justify-between mb-5">
                  <h3
                    className="text-lg italic"
                    style={{ color: '#3B412D', fontFamily: 'var(--font-instrument)' }}
                  >
                    Color Palette
                  </h3>
                  <span className="text-xs" style={{ color: '#97A97C' }}>
                    Click any swatch to copy hex
                  </span>
                </div>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                  {jennProfile.palette.map(color => (
                    <button
                      key={color.hex}
                      onClick={() => copyToClipboard(color.hex, color.hex)}
                      className="text-center group cursor-pointer"
                    >
                      <div
                        className="w-full aspect-square mb-3 transition-all group-hover:scale-105 group-hover:shadow-lg"
                        style={{
                          background: color.hex,
                          borderRadius: '12px',
                          border: color.hex === '#FFF5EB' || color.hex === '#FAF3E8'
                            ? '1px solid #CBAD8C'
                            : 'none',
                          boxShadow: copiedId === color.hex ? '0 0 0 2px #FABF34' : 'none'
                        }}
                      />
                      <span
                        className="text-xs block mb-0.5 truncate"
                        style={{ color: '#546E40' }}
                      >
                        {color.name}
                      </span>
                      <span
                        className="text-xs font-mono block transition-colors"
                        style={{ color: copiedId === color.hex ? '#FABF34' : '#97A97C' }}
                      >
                        {copiedId === color.hex ? 'Copied!' : color.hex}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Brand Builder Tab */}
          {activeTab === 'brand' && (
            <div className="space-y-6">
              <div className="rounded-xl p-6" style={{ background: '#FFF5EB', border: '1px solid #CBAD8C' }}>
                <h3 className="text-lg mb-4" style={{ color: '#3B412D', fontFamily: 'var(--font-instrument)' }}>
                  Brand Builder
                </h3>
                <p className="text-sm mb-4" style={{ color: '#546E40' }}>
                  Create color palettes & brand identities from images
                </p>
                <a
                  href="/io/sandbox/brand-builder"
                  className="inline-block px-6 py-3 rounded-full text-sm font-medium transition-transform hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #FABF34 0%, #CC7722 100%)', color: '#2F2F2C' }}
                >
                  Open Brand Builder →
                </a>
              </div>
            </div>
          )}

          {/* Palettes Tab */}
          {activeTab === 'palettes' && (
            <div className="space-y-6">
              <div className="rounded-xl p-6" style={{ background: '#FFF5EB', border: '1px solid #CBAD8C' }}>
                <h3 className="text-lg mb-4" style={{ color: '#3B412D', fontFamily: 'var(--font-instrument)' }}>
                  My Palettes
                </h3>
                <p className="text-sm mb-4" style={{ color: '#546E40' }}>
                  Gallery of saved color palettes & brand schemes
                </p>
                <a
                  href="/io/sandbox/palettes"
                  className="inline-block px-6 py-3 rounded-full text-sm font-medium transition-transform hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #97A97C 0%, #546E40 100%)', color: '#FFF5EB' }}
                >
                  Open Palettes →
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
