'use client';

import { useState } from 'react';
import Link from 'next/link';

const tools = [
  {
    id: 'voice-memos',
    name: 'Voice Memos',
    description: 'Transform voice recordings into actionable prompts',
    href: '/io/sandbox/voice-memos',
    isNew: true,
  },
  {
    id: 'prompt-builder',
    name: 'Prompt Builder',
    description: 'Force commands, prompt library & AI profile',
    href: '/io/sandbox/prompt-builder',
  },
  {
    id: 'brand-builder',
    name: 'Brand Builder',
    description: 'Extract palettes from images',
    href: '/io/sandbox/brand-builder',
  },
  {
    id: 'palettes',
    name: 'My Palettes',
    description: 'Saved color schemes',
    href: '/io/sandbox/palettes',
  },
];

const palette = [
  { name: 'Hunter', hex: '#2A3C24' },
  { name: 'Deep Forest', hex: '#3B412D' },
  { name: 'Olive', hex: '#546E40' },
  { name: 'Olive Moss', hex: '#52653E' },
  { name: 'Sage', hex: '#97A97C' },
  { name: 'Ivory', hex: '#FFF5EB' },
  { name: 'Cream', hex: '#FAF3E8' },
  { name: 'Blush', hex: '#F7E5DA' },
  { name: 'Gold', hex: '#FABF34' },
  { name: 'Amber', hex: '#FFCB69' },
  { name: 'Tan', hex: '#CBAD8C' },
  { name: 'Lime', hex: '#D4ED39' },
];

export default function SandboxLanding() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyColor = async (hex: string) => {
    await navigator.clipboard.writeText(hex);
    setCopied(hex);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="container-editorial pt-8 pb-16 md:pt-16 md:pb-20">
        {/* Header */}
        <div className="mb-12">
          <Link href="/io" className="text-xs mb-4 block" style={{ color: '#546E40' }}>
            &larr; Back to IO
          </Link>
          <h1
            className="text-4xl md:text-5xl mb-3"
            style={{ fontFamily: 'var(--font-instrument)', color: '#3B412D' }}
          >
            Design Sandbox
          </h1>
          <p style={{ color: '#546E40' }}>Brand building & design utilities</p>
        </div>

        {/* Tools */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs uppercase tracking-widest" style={{ color: '#CBAD8C' }}>
              Tools
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(203,173,140,0.3)' }} />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tools.map(tool => (
              <Link
                key={tool.id}
                href={tool.href}
                className="group p-6 rounded-xl transition-all hover:shadow-lg relative"
                style={{ background: '#FFF5EB', border: '1px solid rgba(203,173,140,0.3)' }}
              >
                {'isNew' in tool && tool.isNew && (
                  <span
                    className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-bold"
                    style={{ background: '#D4ED39', color: '#2A3C24' }}
                  >
                    NEW
                  </span>
                )}
                <h2
                  className="text-xl mb-2 group-hover:text-olive transition-colors"
                  style={{ fontFamily: 'var(--font-instrument)', color: '#3B412D' }}
                >
                  {tool.name}
                </h2>
                <p className="text-sm" style={{ color: '#546E40' }}>
                  {tool.description}
                </p>
                <div className="mt-4 flex items-center gap-1 text-xs" style={{ color: '#CBAD8C' }}>
                  Open
                  <svg className="w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Color Palette */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs uppercase tracking-widest" style={{ color: '#CBAD8C' }}>
              Jenn&apos;s Palette
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(203,173,140,0.3)' }} />
            <span className="text-xs" style={{ color: 'rgba(84,110,64,0.5)' }}>
              Click to copy
            </span>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
            {palette.map(color => (
              <button
                key={color.hex}
                onClick={() => copyColor(color.hex)}
                className="group text-left"
              >
                <div
                  className="aspect-square rounded-xl mb-2 transition-transform group-hover:scale-105"
                  style={{
                    background: color.hex,
                    border: ['#FFF5EB', '#FAF3E8', '#F7E5DA', '#FFCB69'].includes(color.hex)
                      ? '1px solid rgba(203,173,140,0.4)'
                      : 'none'
                  }}
                />
                <p className="text-xs font-medium" style={{ color: '#3B412D' }}>
                  {color.name}
                </p>
                <p
                  className="text-[10px] font-mono"
                  style={{ color: copied === color.hex ? '#546E40' : '#CBAD8C' }}
                >
                  {copied === color.hex ? 'Copied!' : color.hex}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* Footer */}
        <div className="mt-16 pt-8" style={{ borderTop: '1px solid rgba(203,173,140,0.3)' }}>
          <Link
            href="/"
            className="text-xs transition-colors hover:opacity-70"
            style={{ color: '#546E40' }}
          >
            &larr; Back to site
          </Link>
        </div>
      </div>
    </div>
  );
}
