'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ColorSwatch {
  hex: string;
  name: string;
}

interface SavedPalette {
  id: string;
  name: string;
  colors: ColorSwatch[];
  sourceImage?: string;
  createdAt: string;
  includes: {
    colors: boolean;
    spacing: boolean;
    text: boolean;
    visual: boolean;
    layout: boolean;
  };
}

// Curated favorite palettes
const curatedPalettes: SavedPalette[] = [
  {
    id: 'jenn-editorial',
    name: 'Jenn Editorial',
    colors: [
      { hex: '#3B412D', name: 'Deep Forest' },
      { hex: '#546E40', name: 'Olive' },
      { hex: '#97A97C', name: 'Sage' },
      { hex: '#FFF5EB', name: 'Ivory' },
      { hex: '#FABF34', name: 'Gold' },
    ],
    createdAt: '2024-01-01',
    includes: { colors: true, spacing: true, text: true, visual: true, layout: true },
  },
  {
    id: 'warm-neutrals',
    name: 'Warm Neutrals',
    colors: [
      { hex: '#2F2F2C', name: 'Charcoal' },
      { hex: '#CBAD8C', name: 'Tan' },
      { hex: '#FAF3E8', name: 'Cream' },
      { hex: '#FFF5EB', name: 'Ivory' },
      { hex: '#D4A853', name: 'Honey' },
    ],
    createdAt: '2024-01-01',
    includes: { colors: true, spacing: false, text: false, visual: false, layout: false },
  },
  {
    id: 'forest-gold',
    name: 'Forest & Gold',
    colors: [
      { hex: '#1F2A1D', name: 'Dark Forest' },
      { hex: '#3B412D', name: 'Forest' },
      { hex: '#FABF34', name: 'Gold' },
      { hex: '#FFE082', name: 'Light Gold' },
      { hex: '#FFF5EB', name: 'Ivory' },
    ],
    createdAt: '2024-01-01',
    includes: { colors: true, spacing: false, text: false, visual: false, layout: false },
  },
  {
    id: 'graza-inspired',
    name: 'Graza Inspired',
    colors: [
      { hex: '#C8E050', name: 'Lime' },
      { hex: '#2D5A47', name: 'Deep Green' },
      { hex: '#FAF3E8', name: 'Cream' },
      { hex: '#F5B041', name: 'Amber' },
      { hex: '#3D3D3D', name: 'Charcoal' },
    ],
    createdAt: '2024-01-01',
    includes: { colors: true, spacing: false, text: false, visual: false, layout: false },
  },
  {
    id: 'ochre-earth',
    name: 'Ochre Earth',
    colors: [
      { hex: '#CC7722', name: 'Ochre' },
      { hex: '#B4654A', name: 'Rust' },
      { hex: '#C4745A', name: 'Terracotta' },
      { hex: '#E07B39', name: 'Tangerine' },
      { hex: '#FFF5EB', name: 'Ivory' },
    ],
    createdAt: '2024-01-01',
    includes: { colors: true, spacing: false, text: false, visual: false, layout: false },
  },
  {
    id: 'sage-cream',
    name: 'Sage & Cream',
    colors: [
      { hex: '#97A97C', name: 'Sage' },
      { hex: '#A8B98D', name: 'Light Sage' },
      { hex: '#B8C9A0', name: 'Pale Sage' },
      { hex: '#EDE5D8', name: 'Sand' },
      { hex: '#FAF3E8', name: 'Cream' },
    ],
    createdAt: '2024-01-01',
    includes: { colors: true, spacing: false, text: false, visual: false, layout: false },
  },
];

export default function PalettesGallery() {
  const [customPalettes, setCustomPalettes] = useState<SavedPalette[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [expandedPalette, setExpandedPalette] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('jenn-custom-palettes');
    if (saved) setCustomPalettes(JSON.parse(saved));
  }, []);

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const generateCSS = (palette: SavedPalette) => {
    const vars = palette.colors.map(c => `  --${c.name.toLowerCase().replace(/\s+/g, '-')}: ${c.hex};`).join('\n');
    return `:root {\n${vars}\n}`;
  };

  const generateTailwind = (palette: SavedPalette) => {
    const colors = palette.colors.map(c => `      '${c.name.toLowerCase().replace(/\s+/g, '-')}': '${c.hex}',`).join('\n');
    return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n${colors}\n      }\n    }\n  }\n}`;
  };

  const deletePalette = (id: string) => {
    const updated = customPalettes.filter(p => p.id !== id);
    setCustomPalettes(updated);
    localStorage.setItem('jenn-custom-palettes', JSON.stringify(updated));
  };

  const allPalettes = [...curatedPalettes, ...customPalettes];

  return (
    <div className="min-h-screen" style={{ background: '#2F2F2C' }}>
      <div className="container-editorial py-8 md:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/io/sandbox" className="text-xs mb-2 block" style={{ color: '#97A97C' }}>
              ← Back to IO
            </Link>
            <h1 className="text-3xl italic" style={{ color: '#FFF5EB', fontFamily: 'var(--font-instrument)' }}>
              My Palettes
            </h1>
            <p className="text-sm mt-1" style={{ color: '#97A97C' }}>
              {allPalettes.length} palettes • {curatedPalettes.length} curated • {customPalettes.length} custom
            </p>
          </div>
          <Link
            href="/io/sandbox/brand-builder"
            className="px-4 py-2 rounded-full text-sm font-medium transition-transform hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #FABF34 0%, #D4A853 100%)',
              color: '#2F2F2C'
            }}
          >
            + Create New
          </Link>
        </div>

        {/* Palettes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allPalettes.map(palette => {
            const isCustom = customPalettes.some(p => p.id === palette.id);
            const isExpanded = expandedPalette === palette.id;

            return (
              <div
                key={palette.id}
                className="rounded-xl overflow-hidden transition-all"
                style={{ background: '#3B412D' }}
              >
                {/* Color Bar */}
                <div className="flex h-16">
                  {palette.colors.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => copyToClipboard(c.hex, `${palette.id}-${i}`)}
                      className="flex-1 transition-all hover:flex-[1.5] relative group"
                      style={{ background: c.hex }}
                    >
                      <span
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-xs font-mono transition-opacity"
                        style={{
                          background: 'rgba(0,0,0,0.5)',
                          color: '#FFF'
                        }}
                      >
                        {copied === `${palette.id}-${i}` ? '✓' : c.hex}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-base font-medium" style={{ color: '#FFF5EB' }}>
                        {palette.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        {isCustom && (
                          <span className="text-xs px-2 py-0.5 rounded" style={{ background: '#546E40', color: '#FFF5EB' }}>
                            Custom
                          </span>
                        )}
                        <span className="text-xs" style={{ color: '#97A97C' }}>
                          {palette.colors.length} colors
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setExpandedPalette(isExpanded ? null : palette.id)}
                      className="text-xs px-2 py-1 rounded transition-colors"
                      style={{ background: '#3C422E', color: '#97A97C' }}
                    >
                      {isExpanded ? 'Less' : 'More'}
                    </button>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="mt-4 pt-4" style={{ borderTop: '1px solid #3C422E' }}>
                      {/* Color Details */}
                      <div className="space-y-2 mb-4">
                        {palette.colors.map((c, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded" style={{ background: c.hex }} />
                              <span className="text-xs" style={{ color: '#FFF5EB' }}>{c.name}</span>
                            </div>
                            <button
                              onClick={() => copyToClipboard(c.hex, `detail-${palette.id}-${i}`)}
                              className="text-xs font-mono"
                              style={{ color: copied === `detail-${palette.id}-${i}` ? '#FABF34' : '#97A97C' }}
                            >
                              {copied === `detail-${palette.id}-${i}` ? 'Copied!' : c.hex}
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Export Options */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyToClipboard(generateCSS(palette), `css-${palette.id}`)}
                          className="flex-1 py-2 rounded text-xs"
                          style={{ background: '#3C422E', color: copied === `css-${palette.id}` ? '#FABF34' : '#97A97C' }}
                        >
                          {copied === `css-${palette.id}` ? 'Copied!' : 'Copy CSS'}
                        </button>
                        <button
                          onClick={() => copyToClipboard(generateTailwind(palette), `tw-${palette.id}`)}
                          className="flex-1 py-2 rounded text-xs"
                          style={{ background: '#3C422E', color: copied === `tw-${palette.id}` ? '#FABF34' : '#97A97C' }}
                        >
                          {copied === `tw-${palette.id}` ? 'Copied!' : 'Copy Tailwind'}
                        </button>
                        {isCustom && (
                          <button
                            onClick={() => deletePalette(palette.id)}
                            className="py-2 px-3 rounded text-xs"
                            style={{ background: '#3C422E', color: '#97A97C' }}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {customPalettes.length === 0 && (
          <div className="mt-8 text-center p-8 rounded-xl" style={{ background: '#3B412D' }}>
            <p className="text-lg mb-2" style={{ color: '#FFF5EB' }}>No custom palettes yet</p>
            <p className="text-sm mb-4" style={{ color: '#97A97C' }}>
              Use the Brand Builder to extract colors from images
            </p>
            <Link
              href="/io/sandbox/brand-builder"
              className="inline-block px-4 py-2 rounded-full text-sm font-medium"
              style={{ background: '#546E40', color: '#FFF5EB' }}
            >
              Create Palette
            </Link>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <Link
            href="/io/sandbox"
            className="text-xs"
            style={{ color: '#97A97C' }}
          >
            ← Back to IO
          </Link>
        </div>
      </div>
    </div>
  );
}
