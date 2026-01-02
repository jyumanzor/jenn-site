'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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

const buildOptions = [
  { id: 'colors', label: 'Colors', description: 'Primary, secondary, accent colors' },
  { id: 'spacing', label: 'Spacing', description: 'Padding, margins, gaps' },
  { id: 'text', label: 'Typography', description: 'Font sizes, weights, line heights' },
  { id: 'visual', label: 'Visual Style', description: 'Borders, shadows, effects' },
  { id: 'layout', label: 'Layout', description: 'Grid, container widths' },
];

// Design aesthetics/feels
const designFeels = [
  { id: 'minimalist', name: 'Minimalist', description: 'Clean, lots of white space, simple', colors: ['#FFFFFF', '#F5F5F5', '#1A1A1A', '#666666', '#000000'] },
  { id: 'editorial', name: 'Editorial', description: 'Magazine-style, sophisticated typography', colors: ['#FFF5EB', '#3B412D', '#97A97C', '#CBAD8C', '#FABF34'] },
  { id: 'bold', name: 'Bold & Playful', description: 'Vibrant, energetic, high contrast', colors: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#1A1A2E'] },
  { id: 'corporate', name: 'Corporate', description: 'Professional, trustworthy, blue tones', colors: ['#0A2540', '#635BFF', '#00D4FF', '#F6F9FC', '#425466'] },
  { id: 'organic', name: 'Organic', description: 'Natural, earthy, warm and grounded', colors: ['#2D4739', '#8B7355', '#D4C5B5', '#F5F1EB', '#A67C52'] },
  { id: 'luxurious', name: 'Luxurious', description: 'Refined, elegant, deep rich tones', colors: ['#1A1A1A', '#C9A227', '#E8E4DD', '#4A4A4A', '#F5F5F0'] },
  { id: 'brutalist', name: 'Brutalist', description: 'Raw, bold typography, stark contrast', colors: ['#000000', '#FFFFFF', '#FF0000', '#0000FF', '#FFFF00'] },
  { id: 'warm', name: 'Warm & Cozy', description: 'Inviting, soft, warm neutrals', colors: ['#F7F3EE', '#E8D5C4', '#C4A77D', '#8B6914', '#5C4033'] },
  { id: 'modern', name: 'Modern Tech', description: 'Sleek, dark mode friendly, neon accents', colors: ['#0D0D0D', '#1E1E1E', '#00FF88', '#6366F1', '#F8FAFC'] },
];

// Font pairings
const fontPairings = [
  { id: 'editorial-serif', name: 'Editorial Serif', heading: 'Playfair Display', body: 'Source Sans Pro', style: 'Elegant, magazine-style' },
  { id: 'modern-geo', name: 'Modern Geometric', heading: 'Poppins', body: 'Inter', style: 'Clean, contemporary' },
  { id: 'classic-duo', name: 'Classic Duo', heading: 'Merriweather', body: 'Open Sans', style: 'Readable, traditional' },
  { id: 'bold-statement', name: 'Bold Statement', heading: 'Bebas Neue', body: 'Roboto', style: 'Impactful, strong' },
  { id: 'humanist', name: 'Humanist', heading: 'Nunito', body: 'Lato', style: 'Friendly, approachable' },
  { id: 'tech-mono', name: 'Tech Mono', heading: 'Space Grotesk', body: 'JetBrains Mono', style: 'Developer, technical' },
  { id: 'elegant-thin', name: 'Elegant Thin', heading: 'Cormorant Garamond', body: 'Raleway', style: 'Luxurious, refined' },
  { id: 'swiss', name: 'Swiss Style', heading: 'Helvetica Neue', body: 'Helvetica Neue', style: 'Neutral, timeless' },
];

// Design rules
const designRules = [
  { id: '60-30-10', name: '60-30-10 Rule', description: '60% dominant color, 30% secondary, 10% accent', example: 'Background 60%, Text/UI 30%, CTA 10%' },
  { id: 'contrast', name: 'WCAG Contrast', description: 'Text must have 4.5:1 contrast ratio for accessibility', example: 'Dark text on light bg or vice versa' },
  { id: 'spacing-scale', name: 'Spacing Scale', description: 'Use consistent multipliers (4px, 8px, 16px, 24px, 32px)', example: '4px base × 1, 2, 4, 6, 8' },
  { id: 'type-scale', name: 'Type Scale', description: 'Use a modular scale (1.25x, 1.333x, or 1.5x)', example: '16px → 20px → 25px → 31px' },
  { id: 'visual-hierarchy', name: 'Visual Hierarchy', description: 'Guide the eye with size, weight, and color', example: 'H1 bold > H2 medium > body regular' },
  { id: 'consistency', name: 'Consistency', description: 'Same elements should look the same everywhere', example: 'All buttons same style, all links same color' },
  { id: 'proximity', name: 'Proximity', description: 'Related items should be grouped together', example: 'Form labels close to inputs' },
  { id: 'alignment', name: 'Alignment', description: 'Align elements to create visual order', example: 'Left-align text, grid-align cards' },
];

// Design signatures
const designSignatures = [
  { id: 'corners', name: 'Corner Style', options: ['Sharp (0px)', 'Subtle (4px)', 'Rounded (8px)', 'Soft (16px)', 'Pill (9999px)'] },
  { id: 'shadows', name: 'Shadow Style', options: ['None', 'Subtle/Soft', 'Medium Lift', 'Dramatic', 'Hard/Offset'] },
  { id: 'borders', name: 'Border Treatment', options: ['None', 'Hairline (1px)', 'Medium (2px)', 'Bold (3px+)', 'Double'] },
  { id: 'animations', name: 'Motion Style', options: ['None', 'Subtle (150ms)', 'Smooth (300ms)', 'Bouncy', 'Dramatic (500ms+)'] },
  { id: 'density', name: 'Density', options: ['Compact', 'Comfortable', 'Spacious', 'Airy'] },
  { id: 'texture', name: 'Texture', options: ['Flat/Clean', 'Subtle Grain', 'Gradient', 'Glassmorphism', 'Neumorphism'] },
];

// Color hierarchy roles
const colorRoles = [
  { id: 'primary', name: 'Primary', description: 'Main brand color, CTAs, key actions', percentage: '10-20%' },
  { id: 'secondary', name: 'Secondary', description: 'Supporting elements, secondary buttons', percentage: '20-30%' },
  { id: 'background', name: 'Background', description: 'Page/section backgrounds', percentage: '50-60%' },
  { id: 'text', name: 'Text', description: 'Body copy, headings', percentage: 'As needed' },
  { id: 'accent', name: 'Accent', description: 'Highlights, notifications, emphasis', percentage: '5-10%' },
  { id: 'border', name: 'Border', description: 'Dividers, input borders, cards', percentage: 'As needed' },
];

// Sample favorite palettes
const favoritePalettes: SavedPalette[] = [
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
    id: 'ocean-depths',
    name: 'Ocean Depths',
    colors: [
      { hex: '#0D1B2A', name: 'Deep Navy' },
      { hex: '#1B3A4B', name: 'Dark Teal' },
      { hex: '#2D6A7F', name: 'Ocean' },
      { hex: '#87CEEB', name: 'Sky Blue' },
      { hex: '#F0F8FF', name: 'Alice Blue' },
    ],
    createdAt: '2024-01-01',
    includes: { colors: true, spacing: false, text: false, visual: false, layout: false },
  },
];

// Color name suggestions based on hue
function suggestColorName(hex: string, index: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2 / 255;

  // Check for neutrals first
  if (max - min < 30) {
    if (l < 0.2) return 'Charcoal';
    if (l < 0.4) return 'Slate';
    if (l < 0.6) return 'Gray';
    if (l < 0.8) return 'Silver';
    return 'White';
  }

  // Calculate hue
  let h = 0;
  const d = max - min;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h = Math.round(h * 60);
  if (h < 0) h += 360;

  // Map hue to color name
  const colorNames: Record<string, [number, number]> = {
    'Rose': [350, 360],
    'Red': [0, 15],
    'Coral': [15, 30],
    'Orange': [30, 45],
    'Amber': [45, 60],
    'Gold': [60, 75],
    'Lime': [75, 90],
    'Chartreuse': [90, 105],
    'Green': [105, 135],
    'Emerald': [135, 165],
    'Teal': [165, 180],
    'Cyan': [180, 195],
    'Sky': [195, 210],
    'Blue': [210, 240],
    'Indigo': [240, 270],
    'Violet': [270, 285],
    'Purple': [285, 315],
    'Magenta': [315, 330],
    'Pink': [330, 350],
  };

  for (const [name, [start, end]] of Object.entries(colorNames)) {
    if (h >= start && h < end) {
      if (l < 0.3) return `Dark ${name}`;
      if (l > 0.7) return `Light ${name}`;
      return name;
    }
  }

  return `Color ${index + 1}`;
}

// Quantize color to reduce similar colors
function quantizeColor(r: number, g: number, b: number, levels: number = 32): string {
  const step = 256 / levels;
  const qr = Math.round(Math.round(r / step) * step);
  const qg = Math.round(Math.round(g / step) * step);
  const qb = Math.round(Math.round(b / step) * step);
  return `${Math.min(255, qr)},${Math.min(255, qg)},${Math.min(255, qb)}`;
}

// Calculate color distance
function colorDistance(c1: number[], c2: number[]): number {
  return Math.sqrt(
    Math.pow(c1[0] - c2[0], 2) +
    Math.pow(c1[1] - c2[1], 2) +
    Math.pow(c1[2] - c2[2], 2)
  );
}

export default function BrandBuilder() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Builder state
  const [imageUrl, setImageUrl] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [paletteName, setPaletteName] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<Record<string, boolean>>({
    colors: true,
    spacing: false,
    text: false,
    visual: false,
    layout: false,
  });
  const [extractedColors, setExtractedColors] = useState<ColorSwatch[]>([]);
  const [customPalettes, setCustomPalettes] = useState<SavedPalette[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [activeOutputTab, setActiveOutputTab] = useState<'css' | 'tailwind'>('css');
  const [activeSection, setActiveSection] = useState<'palette' | 'feels' | 'fonts' | 'rules' | 'signatures' | 'roles'>('palette');
  const [selectedFeel, setSelectedFeel] = useState<string | null>(null);
  const [selectedSignatures, setSelectedSignatures] = useState<Record<string, string>>({});

  useEffect(() => {
    const saved = localStorage.getItem('jenn-custom-palettes');
    if (saved) setCustomPalettes(JSON.parse(saved));
  }, []);

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        processFile(file);
      }
    }
  }, []);

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setUploadedImage(result);
      extractColorsFromImage(result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleUrlSubmit = () => {
    if (imageUrl) {
      setUploadedImage(imageUrl);
      extractColorsFromImage(imageUrl);
    }
  };

  // Advanced color extraction using Canvas API
  const extractColorsFromImage = (imageSrc: string) => {
    setIsExtracting(true);

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = canvasRef.current || document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsExtracting(false);
        return;
      }

      // Scale down for performance
      const maxSize = 150;
      const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      // Count color frequencies using quantization
      const colorCounts: Map<string, { count: number; r: number; g: number; b: number }> = new Map();

      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const a = pixels[i + 3];

        // Skip transparent pixels
        if (a < 128) continue;

        const key = quantizeColor(r, g, b, 24);
        const existing = colorCounts.get(key);

        if (existing) {
          existing.count++;
          // Average the actual colors for better accuracy
          existing.r = (existing.r * (existing.count - 1) + r) / existing.count;
          existing.g = (existing.g * (existing.count - 1) + g) / existing.count;
          existing.b = (existing.b * (existing.count - 1) + b) / existing.count;
        } else {
          colorCounts.set(key, { count: 1, r, g, b });
        }
      }

      // Sort by frequency and get top colors
      const sortedColors = Array.from(colorCounts.entries())
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 30);

      // Filter out similar colors
      const distinctColors: { r: number; g: number; b: number }[] = [];
      const minDistance = 35; // Minimum color distance

      for (const [, color] of sortedColors) {
        const rgb = [Math.round(color.r), Math.round(color.g), Math.round(color.b)];
        const isTooSimilar = distinctColors.some(
          existing => colorDistance(rgb, [existing.r, existing.g, existing.b]) < minDistance
        );

        if (!isTooSimilar) {
          distinctColors.push({ r: rgb[0], g: rgb[1], b: rgb[2] });
          if (distinctColors.length >= 8) break;
        }
      }

      // Ensure we have at least 5 colors
      if (distinctColors.length < 5) {
        for (const [, color] of sortedColors) {
          if (distinctColors.length >= 5) break;
          const rgb = { r: Math.round(color.r), g: Math.round(color.g), b: Math.round(color.b) };
          const exists = distinctColors.some(
            c => c.r === rgb.r && c.g === rgb.g && c.b === rgb.b
          );
          if (!exists) {
            distinctColors.push(rgb);
          }
        }
      }

      // Sort colors by luminance for better palette order
      distinctColors.sort((a, b) => {
        const lumA = 0.299 * a.r + 0.587 * a.g + 0.114 * a.b;
        const lumB = 0.299 * b.r + 0.587 * b.g + 0.114 * b.b;
        return lumA - lumB;
      });

      // Convert to hex and create swatches
      const colors: ColorSwatch[] = distinctColors.slice(0, 8).map((c, i) => {
        const hex = `#${c.r.toString(16).padStart(2, '0')}${c.g.toString(16).padStart(2, '0')}${c.b.toString(16).padStart(2, '0')}`.toUpperCase();
        return {
          hex,
          name: suggestColorName(hex, i),
        };
      });

      setExtractedColors(colors);
      setIsExtracting(false);
    };

    img.onerror = () => {
      setIsExtracting(false);
      // Fallback for CORS issues with external URLs
      setExtractedColors([
        { hex: '#3B412D', name: 'Primary' },
        { hex: '#546E40', name: 'Secondary' },
        { hex: '#97A97C', name: 'Tertiary' },
        { hex: '#FFF5EB', name: 'Background' },
        { hex: '#FABF34', name: 'Accent' },
      ]);
    };

    img.src = imageSrc;
  };

  const toggleOption = (id: string) => {
    setSelectedOptions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const savePalette = () => {
    if (!paletteName || extractedColors.length === 0) return;

    const newPalette: SavedPalette = {
      id: Date.now().toString(),
      name: paletteName,
      colors: extractedColors,
      sourceImage: uploadedImage || undefined,
      createdAt: new Date().toISOString(),
      includes: selectedOptions as SavedPalette['includes'],
    };

    const updated = [...customPalettes, newPalette];
    setCustomPalettes(updated);
    localStorage.setItem('jenn-custom-palettes', JSON.stringify(updated));
    setPaletteName('');
  };

  const deletePalette = (id: string) => {
    const updated = customPalettes.filter(p => p.id !== id);
    setCustomPalettes(updated);
    localStorage.setItem('jenn-custom-palettes', JSON.stringify(updated));
  };

  const loadPalette = (palette: SavedPalette) => {
    setExtractedColors(palette.colors);
    setSelectedOptions(palette.includes);
    if (palette.sourceImage) {
      setUploadedImage(palette.sourceImage);
    }
  };

  const updateColorName = (index: number, name: string) => {
    const updated = [...extractedColors];
    updated[index] = { ...updated[index], name };
    setExtractedColors(updated);
  };

  const updateColorHex = (index: number, hex: string) => {
    const updated = [...extractedColors];
    // Ensure proper hex format
    let formattedHex = hex.startsWith('#') ? hex : `#${hex}`;
    updated[index] = { ...updated[index], hex: formattedHex.toUpperCase() };
    setExtractedColors(updated);
  };

  const addColor = () => {
    if (extractedColors.length < 12) {
      setExtractedColors([...extractedColors, { hex: '#888888', name: `Color ${extractedColors.length + 1}` }]);
    }
  };

  const removeColor = (index: number) => {
    if (extractedColors.length > 1) {
      setExtractedColors(extractedColors.filter((_, i) => i !== index));
    }
  };

  // Generate CSS Variables output
  const generateCSSVariables = () => {
    let css = ':root {\n';

    if (selectedOptions.colors && extractedColors.length > 0) {
      css += '  /* Colors */\n';
      extractedColors.forEach((color, i) => {
        const varName = color.name.toLowerCase().replace(/\s+/g, '-');
        css += `  --color-${varName}: ${color.hex};\n`;
      });

      // Add semantic color mappings
      if (extractedColors.length >= 3) {
        css += '\n  /* Semantic Colors */\n';
        css += `  --color-primary: ${extractedColors[0]?.hex};\n`;
        css += `  --color-secondary: ${extractedColors[1]?.hex};\n`;
        css += `  --color-accent: ${extractedColors[extractedColors.length - 1]?.hex};\n`;
        if (extractedColors.length >= 4) {
          css += `  --color-background: ${extractedColors[extractedColors.length - 2]?.hex};\n`;
        }
      }
    }

    if (selectedOptions.spacing) {
      css += '\n  /* Spacing */\n';
      css += '  --spacing-xs: 0.25rem;\n';
      css += '  --spacing-sm: 0.5rem;\n';
      css += '  --spacing-md: 1rem;\n';
      css += '  --spacing-lg: 1.5rem;\n';
      css += '  --spacing-xl: 2rem;\n';
      css += '  --spacing-2xl: 3rem;\n';
      css += '  --spacing-3xl: 4rem;\n';
    }

    if (selectedOptions.text) {
      css += '\n  /* Typography */\n';
      css += '  --font-size-xs: 0.75rem;\n';
      css += '  --font-size-sm: 0.875rem;\n';
      css += '  --font-size-base: 1rem;\n';
      css += '  --font-size-lg: 1.125rem;\n';
      css += '  --font-size-xl: 1.25rem;\n';
      css += '  --font-size-2xl: 1.5rem;\n';
      css += '  --font-size-3xl: 2rem;\n';
      css += '  --font-size-4xl: 2.5rem;\n';
      css += '\n  --font-weight-normal: 400;\n';
      css += '  --font-weight-medium: 500;\n';
      css += '  --font-weight-semibold: 600;\n';
      css += '  --font-weight-bold: 700;\n';
      css += '\n  --line-height-tight: 1.25;\n';
      css += '  --line-height-normal: 1.5;\n';
      css += '  --line-height-relaxed: 1.75;\n';
    }

    if (selectedOptions.visual) {
      css += '\n  /* Visual Style */\n';
      css += '  --border-radius-sm: 0.25rem;\n';
      css += '  --border-radius-md: 0.5rem;\n';
      css += '  --border-radius-lg: 0.75rem;\n';
      css += '  --border-radius-xl: 1rem;\n';
      css += '  --border-radius-full: 9999px;\n';
      css += '\n  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);\n';
      css += '  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);\n';
      css += '  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);\n';
      css += '  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);\n';
    }

    if (selectedOptions.layout) {
      css += '\n  /* Layout */\n';
      css += '  --container-sm: 640px;\n';
      css += '  --container-md: 768px;\n';
      css += '  --container-lg: 1024px;\n';
      css += '  --container-xl: 1280px;\n';
      css += '  --container-2xl: 1536px;\n';
      css += '\n  --grid-cols-1: repeat(1, minmax(0, 1fr));\n';
      css += '  --grid-cols-2: repeat(2, minmax(0, 1fr));\n';
      css += '  --grid-cols-3: repeat(3, minmax(0, 1fr));\n';
      css += '  --grid-cols-4: repeat(4, minmax(0, 1fr));\n';
    }

    css += '}\n';
    return css;
  };

  // Generate Tailwind config output
  const generateTailwindConfig = () => {
    let config = `/** @type {import('tailwindcss').Config} */\nmodule.exports = {\n  theme: {\n    extend: {\n`;

    if (selectedOptions.colors && extractedColors.length > 0) {
      config += '      colors: {\n';
      config += '        brand: {\n';
      extractedColors.forEach((color) => {
        const varName = color.name.toLowerCase().replace(/\s+/g, '-');
        config += `          '${varName}': '${color.hex}',\n`;
      });
      config += '        },\n';

      // Add semantic mappings
      if (extractedColors.length >= 3) {
        config += `        primary: '${extractedColors[0]?.hex}',\n`;
        config += `        secondary: '${extractedColors[1]?.hex}',\n`;
        config += `        accent: '${extractedColors[extractedColors.length - 1]?.hex}',\n`;
      }
      config += '      },\n';
    }

    if (selectedOptions.spacing) {
      config += '      spacing: {\n';
      config += "        'xs': '0.25rem',\n";
      config += "        'sm': '0.5rem',\n";
      config += "        'md': '1rem',\n";
      config += "        'lg': '1.5rem',\n";
      config += "        'xl': '2rem',\n";
      config += "        '2xl': '3rem',\n";
      config += "        '3xl': '4rem',\n";
      config += '      },\n';
    }

    if (selectedOptions.text) {
      config += '      fontSize: {\n';
      config += "        'xs': '0.75rem',\n";
      config += "        'sm': '0.875rem',\n";
      config += "        'base': '1rem',\n";
      config += "        'lg': '1.125rem',\n";
      config += "        'xl': '1.25rem',\n";
      config += "        '2xl': '1.5rem',\n";
      config += "        '3xl': '2rem',\n";
      config += "        '4xl': '2.5rem',\n";
      config += '      },\n';
      config += '      fontWeight: {\n';
      config += "        normal: '400',\n";
      config += "        medium: '500',\n";
      config += "        semibold: '600',\n";
      config += "        bold: '700',\n";
      config += '      },\n';
      config += '      lineHeight: {\n';
      config += "        tight: '1.25',\n";
      config += "        normal: '1.5',\n";
      config += "        relaxed: '1.75',\n";
      config += '      },\n';
    }

    if (selectedOptions.visual) {
      config += '      borderRadius: {\n';
      config += "        'sm': '0.25rem',\n";
      config += "        'md': '0.5rem',\n";
      config += "        'lg': '0.75rem',\n";
      config += "        'xl': '1rem',\n";
      config += "        'full': '9999px',\n";
      config += '      },\n';
      config += '      boxShadow: {\n';
      config += "        'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',\n";
      config += "        'md': '0 4px 6px rgba(0, 0, 0, 0.1)',\n";
      config += "        'lg': '0 10px 15px rgba(0, 0, 0, 0.1)',\n";
      config += "        'xl': '0 20px 25px rgba(0, 0, 0, 0.15)',\n";
      config += '      },\n';
    }

    if (selectedOptions.layout) {
      config += '      container: {\n';
      config += '        screens: {\n';
      config += "          sm: '640px',\n";
      config += "          md: '768px',\n";
      config += "          lg: '1024px',\n";
      config += "          xl: '1280px',\n";
      config += "          '2xl': '1536px',\n";
      config += '        },\n';
      config += '      },\n';
    }

    config += '    },\n  },\n};\n';
    return config;
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyPaletteCSS = async (palette: SavedPalette) => {
    const css = palette.colors.map((c) => {
      const varName = c.name.toLowerCase().replace(/\s+/g, '-');
      return `--color-${varName}: ${c.hex};`;
    }).join('\n  ');
    await navigator.clipboard.writeText(`:root {\n  ${css}\n}`);
    setCopied(palette.id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen" style={{ background: '#1a1a1a' }}>
      {/* Hidden canvas for color extraction */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div className="flex">
        {/* Sidebar */}
        <aside
          className="w-72 min-h-screen p-4 overflow-y-auto border-r"
          style={{ background: '#1f1f1f', borderColor: '#2a2a2a' }}
        >
          <Link href="/io/sandbox" className="text-xs mb-4 block opacity-70 hover:opacity-100 transition-opacity" style={{ color: '#97A97C' }}>
            &larr; Back to Sandbox
          </Link>

          <h1 className="text-xl italic mb-6" style={{ color: '#FFF5EB', fontFamily: 'var(--font-instrument)' }}>
            Brand Builder
          </h1>

          {/* Favorite Palettes */}
          <div className="mb-6">
            <h2 className="text-xs uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: '#CBAD8C' }}>
              <span>&#9733;</span> Favorite Palettes
            </h2>
            <div className="space-y-2">
              {favoritePalettes.map(palette => (
                <button
                  key={palette.id}
                  onClick={() => loadPalette(palette)}
                  className="w-full p-3 rounded-lg text-left transition-all hover:scale-[1.02] group"
                  style={{ background: '#2a2a2a' }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium" style={{ color: '#FFF5EB' }}>
                      {palette.name}
                    </span>
                    <span
                      className="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: '#97A97C' }}
                    >
                      Load
                    </span>
                  </div>
                  <div className="flex gap-0.5 rounded overflow-hidden">
                    {palette.colors.map((c, i) => (
                      <div
                        key={i}
                        className="flex-1 h-4"
                        style={{ background: c.hex }}
                        title={`${c.name}: ${c.hex}`}
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Saved Palettes */}
          <div>
            <h2 className="text-xs uppercase tracking-wider mb-3" style={{ color: '#CBAD8C' }}>
              My Palettes ({customPalettes.length})
            </h2>

            {customPalettes.length === 0 ? (
              <p className="text-xs py-4 text-center opacity-60" style={{ color: '#97A97C' }}>
                No palettes saved yet
              </p>
            ) : (
              <div className="space-y-2">
                {customPalettes.map(palette => (
                  <div
                    key={palette.id}
                    className="p-3 rounded-lg group"
                    style={{ background: '#2a2a2a' }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <button
                          onClick={() => loadPalette(palette)}
                          className="text-xs font-medium text-left hover:underline"
                          style={{ color: '#FFF5EB' }}
                        >
                          {palette.name}
                        </button>
                        <span className="block text-xs opacity-60" style={{ color: '#97A97C' }}>
                          {new Date(palette.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => copyPaletteCSS(palette)}
                          className="text-xs px-2 py-1 rounded transition-colors"
                          style={{
                            background: '#1f1f1f',
                            color: copied === palette.id ? '#FABF34' : '#97A97C'
                          }}
                        >
                          {copied === palette.id ? 'Copied!' : 'CSS'}
                        </button>
                        <button
                          onClick={() => deletePalette(palette.id)}
                          className="opacity-0 group-hover:opacity-100 text-xs px-2 py-1 rounded transition-all"
                          style={{ background: '#1f1f1f', color: '#ff6b6b' }}
                        >
                          &times;
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-0.5 rounded overflow-hidden">
                      {palette.colors.map((c, i) => (
                        <div
                          key={i}
                          className="flex-1 h-4"
                          style={{ background: c.hex }}
                          title={`${c.name}: ${c.hex}`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            {/* Section Navigation */}
            <div className="flex gap-2 mb-6 p-1 rounded-xl overflow-x-auto" style={{ background: '#222' }}>
              {[
                { id: 'palette', label: 'Color Palette', icon: '🎨' },
                { id: 'feels', label: 'Design Feels', icon: '✨' },
                { id: 'fonts', label: 'Font Pairings', icon: 'Aa' },
                { id: 'rules', label: 'Design Rules', icon: '📐' },
                { id: 'signatures', label: 'Signatures', icon: '🖊️' },
                { id: 'roles', label: 'Color Roles', icon: '🔵' },
              ].map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as typeof activeSection)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap"
                  style={{
                    background: activeSection === section.id ? '#546E40' : 'transparent',
                    color: activeSection === section.id ? '#FFF5EB' : '#97A97C',
                  }}
                >
                  <span>{section.icon}</span>
                  <span>{section.label}</span>
                </button>
              ))}
            </div>

            {/* SECTION: Color Palette */}
            {activeSection === 'palette' && (
              <>
            {/* Image Input Section */}
            <div className="rounded-xl p-6 mb-6" style={{ background: '#222' }}>
              <h2 className="text-sm uppercase tracking-wider mb-4" style={{ color: '#CBAD8C' }}>
                Source Image
              </h2>

              {/* Drag & Drop Zone */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="w-full py-8 rounded-xl border-2 border-dashed mb-4 transition-all cursor-pointer"
                style={{
                  borderColor: isDragging ? '#FABF34' : '#3a3a3a',
                  background: isDragging ? 'rgba(250, 191, 52, 0.05)' : 'transparent',
                }}
              >
                <div className="text-center">
                  <span className="block text-3xl mb-2" style={{ filter: 'grayscale(100%)' }}>
                    {isDragging ? '&#8595;' : '&#128193;'}
                  </span>
                  <span className="text-sm" style={{ color: '#97A97C' }}>
                    {isDragging ? 'Drop your image here' : 'Drag & drop an image or click to upload'}
                  </span>
                </div>
              </div>

              {/* URL Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                  placeholder="Or paste image URL..."
                  className="flex-1 px-4 py-3 rounded-lg text-sm"
                  style={{ background: '#2a2a2a', color: '#FFF5EB', border: '1px solid #3a3a3a' }}
                />
                <button
                  onClick={handleUrlSubmit}
                  disabled={!imageUrl}
                  className="px-5 py-3 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
                  style={{ background: '#546E40', color: '#FFF5EB' }}
                >
                  Extract
                </button>
              </div>

              {/* Preview */}
              {uploadedImage && (
                <div className="mt-4 relative">
                  <img
                    src={uploadedImage}
                    alt="Source"
                    className="w-full max-h-64 object-contain rounded-lg"
                    style={{ background: '#1a1a1a' }}
                  />
                  <button
                    onClick={() => {
                      setUploadedImage(null);
                      setExtractedColors([]);
                      setImageUrl('');
                    }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors"
                    style={{ background: 'rgba(0,0,0,0.7)', color: '#FFF5EB' }}
                  >
                    &times;
                  </button>
                </div>
              )}

              {isExtracting && (
                <div className="mt-4 text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-t-transparent" style={{ borderColor: '#FABF34', borderTopColor: 'transparent' }} />
                  <p className="text-sm mt-2" style={{ color: '#97A97C' }}>Extracting colors...</p>
                </div>
              )}
            </div>

            {/* Extracted Colors */}
            {extractedColors.length > 0 && !isExtracting && (
              <div className="rounded-xl p-6 mb-6" style={{ background: '#222' }}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-sm uppercase tracking-wider" style={{ color: '#CBAD8C' }}>
                    Extracted Colors ({extractedColors.length})
                  </h2>
                  <button
                    onClick={addColor}
                    disabled={extractedColors.length >= 12}
                    className="text-xs px-3 py-1.5 rounded transition-colors disabled:opacity-50"
                    style={{ background: '#2a2a2a', color: '#97A97C' }}
                  >
                    + Add Color
                  </button>
                </div>

                {/* Color swatches grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {extractedColors.map((color, i) => (
                    <div key={i} className="rounded-lg overflow-hidden" style={{ background: '#2a2a2a' }}>
                      <div className="relative">
                        <div
                          className="h-16 w-full cursor-pointer"
                          style={{ background: color.hex }}
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'color';
                            input.value = color.hex;
                            input.addEventListener('input', (e) => {
                              updateColorHex(i, (e.target as HTMLInputElement).value);
                            });
                            input.click();
                          }}
                        />
                        {extractedColors.length > 1 && (
                          <button
                            onClick={() => removeColor(i)}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs transition-opacity opacity-0 hover:opacity-100"
                            style={{ background: 'rgba(0,0,0,0.7)', color: '#fff' }}
                          >
                            &times;
                          </button>
                        )}
                      </div>
                      <div className="p-2 space-y-1">
                        <input
                          type="text"
                          value={color.name}
                          onChange={(e) => updateColorName(i, e.target.value)}
                          className="w-full px-2 py-1 rounded text-xs"
                          style={{ background: '#1f1f1f', color: '#FFF5EB', border: 'none' }}
                        />
                        <input
                          type="text"
                          value={color.hex}
                          onChange={(e) => updateColorHex(i, e.target.value)}
                          className="w-full px-2 py-1 rounded text-xs font-mono"
                          style={{ background: '#1f1f1f', color: '#97A97C', border: 'none' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Save Palette */}
                <div className="flex gap-2 pt-4 border-t" style={{ borderColor: '#3a3a3a' }}>
                  <input
                    type="text"
                    value={paletteName}
                    onChange={(e) => setPaletteName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && savePalette()}
                    placeholder="Name your palette..."
                    className="flex-1 px-4 py-2.5 rounded-lg text-sm"
                    style={{ background: '#2a2a2a', color: '#FFF5EB', border: '1px solid #3a3a3a' }}
                  />
                  <button
                    onClick={savePalette}
                    disabled={!paletteName}
                    className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
                    style={{
                      background: 'linear-gradient(135deg, #FABF34 0%, #D4A853 100%)',
                      color: '#1a1a1a'
                    }}
                  >
                    Save Palette
                  </button>
                </div>
              </div>
            )}

            {/* Build Options */}
            {extractedColors.length > 0 && (
              <div className="rounded-xl p-6 mb-6" style={{ background: '#222' }}>
                <h2 className="text-sm uppercase tracking-wider mb-4" style={{ color: '#CBAD8C' }}>
                  What to Generate
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {buildOptions.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => toggleOption(opt.id)}
                      className="p-3 rounded-lg text-left transition-all"
                      style={{
                        background: selectedOptions[opt.id] ? '#546E40' : '#2a2a2a',
                        border: selectedOptions[opt.id] ? '1px solid #97A97C' : '1px solid transparent',
                      }}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded flex items-center justify-center text-xs"
                          style={{
                            background: selectedOptions[opt.id] ? '#FFF5EB' : '#3a3a3a',
                            color: selectedOptions[opt.id] ? '#546E40' : '#666'
                          }}
                        >
                          {selectedOptions[opt.id] ? '&#10003;' : ''}
                        </span>
                        <span className="text-sm font-medium" style={{ color: '#FFF5EB' }}>
                          {opt.label}
                        </span>
                      </span>
                      <span className="text-xs mt-1 block pl-6" style={{ color: '#97A97C' }}>
                        {opt.description}
                      </span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setShowOutput(true)}
                  className="w-full mt-4 py-3 rounded-lg text-sm font-medium transition-all"
                  style={{ background: '#546E40', color: '#FFF5EB' }}
                >
                  Generate Output
                </button>
              </div>
            )}

            {/* Output Section */}
            {showOutput && extractedColors.length > 0 && (
              <div className="rounded-xl p-6" style={{ background: '#222' }}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-sm uppercase tracking-wider" style={{ color: '#CBAD8C' }}>
                    Generated Output
                  </h2>
                  <div className="flex gap-1 rounded-lg p-1" style={{ background: '#1f1f1f' }}>
                    <button
                      onClick={() => setActiveOutputTab('css')}
                      className="px-3 py-1.5 rounded text-xs font-medium transition-colors"
                      style={{
                        background: activeOutputTab === 'css' ? '#546E40' : 'transparent',
                        color: activeOutputTab === 'css' ? '#FFF5EB' : '#97A97C'
                      }}
                    >
                      CSS Variables
                    </button>
                    <button
                      onClick={() => setActiveOutputTab('tailwind')}
                      className="px-3 py-1.5 rounded text-xs font-medium transition-colors"
                      style={{
                        background: activeOutputTab === 'tailwind' ? '#546E40' : 'transparent',
                        color: activeOutputTab === 'tailwind' ? '#FFF5EB' : '#97A97C'
                      }}
                    >
                      Tailwind Config
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <pre
                    className="p-4 rounded-lg overflow-x-auto text-xs leading-relaxed"
                    style={{ background: '#1a1a1a', color: '#97A97C' }}
                  >
                    <code>
                      {activeOutputTab === 'css' ? generateCSSVariables() : generateTailwindConfig()}
                    </code>
                  </pre>
                  <button
                    onClick={() => copyToClipboard(
                      activeOutputTab === 'css' ? generateCSSVariables() : generateTailwindConfig(),
                      'output'
                    )}
                    className="absolute top-3 right-3 px-3 py-1.5 rounded text-xs font-medium transition-colors"
                    style={{
                      background: '#2a2a2a',
                      color: copied === 'output' ? '#FABF34' : '#FFF5EB'
                    }}
                  >
                    {copied === 'output' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            )}
              </>
            )}

            {/* SECTION: Design Feels */}
            {activeSection === 'feels' && (
              <div className="rounded-xl p-6" style={{ background: '#222' }}>
                <h2 className="text-sm uppercase tracking-wider mb-2" style={{ color: '#CBAD8C' }}>
                  Design Aesthetics
                </h2>
                <p className="text-sm mb-6" style={{ color: '#97A97C' }}>
                  Choose an aesthetic direction to guide your design decisions.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {designFeels.map((feel) => (
                    <button
                      key={feel.id}
                      onClick={() => {
                        setSelectedFeel(feel.id);
                        // Load feel colors into palette
                        setExtractedColors(feel.colors.map((hex, i) => ({
                          hex,
                          name: suggestColorName(hex, i),
                        })));
                      }}
                      className="p-4 rounded-xl text-left transition-all hover:scale-[1.02]"
                      style={{
                        background: '#2a2a2a',
                        boxShadow: selectedFeel === feel.id ? '0 0 0 2px #FABF34' : 'none',
                      }}
                    >
                      {/* Color Preview */}
                      <div className="flex gap-1 rounded-lg overflow-hidden mb-3">
                        {feel.colors.map((color, i) => (
                          <div
                            key={i}
                            className="flex-1 h-12"
                            style={{ background: color }}
                          />
                        ))}
                      </div>
                      <h3 className="text-sm font-medium mb-1" style={{ color: '#FFF5EB' }}>
                        {feel.name}
                      </h3>
                      <p className="text-xs" style={{ color: '#97A97C' }}>
                        {feel.description}
                      </p>
                      {selectedFeel === feel.id && (
                        <span className="inline-block mt-2 text-xs px-2 py-1 rounded" style={{ background: '#FABF34', color: '#1a1a1a' }}>
                          Selected
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION: Font Pairings */}
            {activeSection === 'fonts' && (
              <div className="rounded-xl p-6" style={{ background: '#222' }}>
                <h2 className="text-sm uppercase tracking-wider mb-2" style={{ color: '#CBAD8C' }}>
                  Font Pairings
                </h2>
                <p className="text-sm mb-6" style={{ color: '#97A97C' }}>
                  Classic heading + body font combinations for different vibes.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fontPairings.map((pair) => (
                    <div
                      key={pair.id}
                      className="p-5 rounded-xl"
                      style={{ background: '#2a2a2a' }}
                    >
                      <div className="mb-4 pb-4 border-b" style={{ borderColor: '#3a3a3a' }}>
                        <p className="text-2xl mb-1" style={{ color: '#FFF5EB', fontFamily: pair.heading }}>
                          {pair.heading}
                        </p>
                        <p className="text-sm" style={{ color: '#97A97C', fontFamily: pair.body }}>
                          Body text in {pair.body}
                        </p>
                      </div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-sm font-medium" style={{ color: '#FFF5EB' }}>
                            {pair.name}
                          </h3>
                          <p className="text-xs" style={{ color: '#97A97C' }}>
                            {pair.style}
                          </p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(`font-family: "${pair.heading}", serif;\nfont-family: "${pair.body}", sans-serif;`, pair.id)}
                          className="text-xs px-3 py-1.5 rounded transition-colors"
                          style={{
                            background: '#1f1f1f',
                            color: copied === pair.id ? '#FABF34' : '#97A97C'
                          }}
                        >
                          {copied === pair.id ? 'Copied!' : 'Copy CSS'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION: Design Rules */}
            {activeSection === 'rules' && (
              <div className="rounded-xl p-6" style={{ background: '#222' }}>
                <h2 className="text-sm uppercase tracking-wider mb-2" style={{ color: '#CBAD8C' }}>
                  Design Rules
                </h2>
                <p className="text-sm mb-6" style={{ color: '#97A97C' }}>
                  Fundamental principles for consistent, professional design.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {designRules.map((rule) => (
                    <div
                      key={rule.id}
                      className="p-5 rounded-xl"
                      style={{ background: '#2a2a2a' }}
                    >
                      <h3 className="text-base font-medium mb-2" style={{ color: '#FFF5EB' }}>
                        {rule.name}
                      </h3>
                      <p className="text-sm mb-3" style={{ color: '#97A97C' }}>
                        {rule.description}
                      </p>
                      <div className="p-3 rounded-lg" style={{ background: '#1f1f1f' }}>
                        <p className="text-xs font-mono" style={{ color: '#FABF34' }}>
                          Example: {rule.example}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION: Design Signatures */}
            {activeSection === 'signatures' && (
              <div className="rounded-xl p-6" style={{ background: '#222' }}>
                <h2 className="text-sm uppercase tracking-wider mb-2" style={{ color: '#CBAD8C' }}>
                  Design Signatures
                </h2>
                <p className="text-sm mb-6" style={{ color: '#97A97C' }}>
                  Define your brand&apos;s visual personality through these key choices.
                </p>

                <div className="space-y-6">
                  {designSignatures.map((sig) => (
                    <div key={sig.id}>
                      <h3 className="text-sm font-medium mb-3" style={{ color: '#FFF5EB' }}>
                        {sig.name}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {sig.options.map((option) => (
                          <button
                            key={option}
                            onClick={() => setSelectedSignatures(prev => ({ ...prev, [sig.id]: option }))}
                            className="px-4 py-2 rounded-lg text-sm transition-all"
                            style={{
                              background: selectedSignatures[sig.id] === option ? '#546E40' : '#2a2a2a',
                              color: selectedSignatures[sig.id] === option ? '#FFF5EB' : '#97A97C',
                              border: selectedSignatures[sig.id] === option ? '1px solid #97A97C' : '1px solid transparent',
                            }}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                {Object.keys(selectedSignatures).length > 0 && (
                  <div className="mt-8 p-4 rounded-xl" style={{ background: '#1f1f1f' }}>
                    <h4 className="text-xs uppercase tracking-wider mb-3" style={{ color: '#CBAD8C' }}>
                      Your Design Signature
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(selectedSignatures).map(([key, value]) => (
                        <span
                          key={key}
                          className="px-3 py-1.5 rounded-full text-xs"
                          style={{ background: '#546E40', color: '#FFF5EB' }}
                        >
                          {designSignatures.find(s => s.id === key)?.name}: {value}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SECTION: Color Roles */}
            {activeSection === 'roles' && (
              <div className="rounded-xl p-6" style={{ background: '#222' }}>
                <h2 className="text-sm uppercase tracking-wider mb-2" style={{ color: '#CBAD8C' }}>
                  Color Roles
                </h2>
                <p className="text-sm mb-6" style={{ color: '#97A97C' }}>
                  Understand how different colors serve different purposes in your design.
                </p>

                <div className="space-y-3">
                  {colorRoles.map((role, i) => (
                    <div
                      key={role.id}
                      className="p-4 rounded-xl flex items-center gap-4"
                      style={{ background: '#2a2a2a' }}
                    >
                      {/* Visual indicator */}
                      <div
                        className="w-12 h-12 rounded-lg flex-shrink-0"
                        style={{
                          background: i === 0 ? '#546E40' :
                                     i === 1 ? '#97A97C' :
                                     i === 2 ? '#FFF5EB' :
                                     i === 3 ? '#3B412D' :
                                     i === 4 ? '#FABF34' :
                                     '#444',
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-sm font-medium" style={{ color: '#FFF5EB' }}>
                            {role.name}
                          </h3>
                          <span className="text-xs px-2 py-0.5 rounded" style={{ background: '#1f1f1f', color: '#CBAD8C' }}>
                            {role.percentage}
                          </span>
                        </div>
                        <p className="text-xs" style={{ color: '#97A97C' }}>
                          {role.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 60-30-10 Visual */}
                <div className="mt-8 p-4 rounded-xl" style={{ background: '#1f1f1f' }}>
                  <h4 className="text-xs uppercase tracking-wider mb-4" style={{ color: '#CBAD8C' }}>
                    60-30-10 Rule Visualized
                  </h4>
                  <div className="flex rounded-lg overflow-hidden h-16">
                    <div className="flex-[6]" style={{ background: '#FFF5EB' }} title="60% - Background" />
                    <div className="flex-[3]" style={{ background: '#3B412D' }} title="30% - Text/UI" />
                    <div className="flex-[1]" style={{ background: '#FABF34' }} title="10% - Accent" />
                  </div>
                  <div className="flex text-xs mt-2">
                    <span className="flex-[6] text-center" style={{ color: '#97A97C' }}>60% Background</span>
                    <span className="flex-[3] text-center" style={{ color: '#97A97C' }}>30% UI</span>
                    <span className="flex-[1] text-center" style={{ color: '#97A97C' }}>10%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
