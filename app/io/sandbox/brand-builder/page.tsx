"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import IOAuthGate from "@/components/IOAuthGate";

// Types
interface ColorSwatch {
  hex: string;
  name: string;
  pantone?: string;
}

interface BrandConfig {
  palette: ColorSwatch[];
  headingFont: string;
  bodyFont: string;
  cornerRadius: string;
  shadowStyle: string;
  spacing: string;
}

// Pantone-inspired color library organized by family
const colorLibrary: Record<string, ColorSwatch[]> = {
  "Forest & Earth": [
    { hex: "#2A3C24", name: "Hunter Green", pantone: "19-0315" },
    { hex: "#3B412D", name: "Deep Forest", pantone: "19-0417" },
    { hex: "#4A5D23", name: "Olive Drab", pantone: "18-0527" },
    { hex: "#546E40", name: "Olive", pantone: "18-0130" },
    { hex: "#5E7D4C", name: "Pesto", pantone: "18-0125" },
    { hex: "#6B8E23", name: "Olive Green", pantone: "17-0535" },
    { hex: "#8B7355", name: "Cinnamon", pantone: "17-1327" },
    { hex: "#A67C52", name: "Caramel", pantone: "16-1334" },
    { hex: "#8B6914", name: "Bronze", pantone: "17-1048" },
    { hex: "#5C4033", name: "Chocolate", pantone: "19-1218" },
  ],
  "Sage & Moss": [
    { hex: "#97A97C", name: "Sage", pantone: "15-6316" },
    { hex: "#9CAF88", name: "Laurel Green", pantone: "15-6317" },
    { hex: "#A3B18A", name: "Sage Green", pantone: "15-6315" },
    { hex: "#B2C5A8", name: "Celadon", pantone: "14-6312" },
    { hex: "#C4D4B5", name: "Fern", pantone: "13-0210" },
    { hex: "#8A9A5B", name: "Moss", pantone: "16-0430" },
    { hex: "#7B8B6F", name: "Artichoke", pantone: "16-6318" },
    { hex: "#6B7F5E", name: "Vineyard", pantone: "17-6319" },
    { hex: "#52653E", name: "Olive Moss", pantone: "18-0324" },
    { hex: "#4A5B3E", name: "Thyme", pantone: "18-0316" },
  ],
  "Warm Neutrals": [
    { hex: "#FFF5EB", name: "Ivory", pantone: "11-0507" },
    { hex: "#FAF3E8", name: "Cream", pantone: "11-0105" },
    { hex: "#F7E5DA", name: "Blush", pantone: "12-1006" },
    { hex: "#EFE4D6", name: "Oat", pantone: "12-0910" },
    { hex: "#E8D5C4", name: "Champagne", pantone: "13-1015" },
    { hex: "#D4C5B5", name: "Sand", pantone: "14-1118" },
    { hex: "#CBAD8C", name: "Tan", pantone: "15-1220" },
    { hex: "#C4A77D", name: "Camel", pantone: "15-1225" },
    { hex: "#B8A590", name: "Taupe", pantone: "16-1318" },
    { hex: "#A89985", name: "Stone", pantone: "16-1412" },
  ],
  "Gold & Amber": [
    { hex: "#FABF34", name: "Gold", pantone: "14-0848" },
    { hex: "#FFD700", name: "Golden Yellow", pantone: "13-0850" },
    { hex: "#FFCB69", name: "Amber", pantone: "13-0940" },
    { hex: "#FFE082", name: "Light Gold", pantone: "12-0736" },
    { hex: "#F4C430", name: "Saffron", pantone: "14-0846" },
    { hex: "#E8B923", name: "Honey", pantone: "15-0953" },
    { hex: "#D4A853", name: "Brass", pantone: "15-0942" },
    { hex: "#C9A227", name: "Harvest Gold", pantone: "16-0952" },
    { hex: "#B8860B", name: "Dark Gold", pantone: "16-0947" },
    { hex: "#A67B5B", name: "Copper", pantone: "17-1336" },
  ],
  "Cool Neutrals": [
    { hex: "#FFFFFF", name: "White", pantone: "11-0601" },
    { hex: "#F8F8F8", name: "Snow", pantone: "11-4201" },
    { hex: "#F0F0F0", name: "Platinum", pantone: "11-4301" },
    { hex: "#E0E0E0", name: "Silver", pantone: "14-4102" },
    { hex: "#C0C0C0", name: "Gray", pantone: "15-4101" },
    { hex: "#A0A0A0", name: "Cloudy", pantone: "16-4402" },
    { hex: "#808080", name: "Charcoal Gray", pantone: "17-4402" },
    { hex: "#606060", name: "Steel", pantone: "18-4006" },
    { hex: "#404040", name: "Slate", pantone: "19-3906" },
    { hex: "#1A1A1A", name: "Jet Black", pantone: "19-0303" },
  ],
  "Terracotta & Rust": [
    { hex: "#E07850", name: "Terracotta", pantone: "16-1435" },
    { hex: "#C76B4A", name: "Burnt Sienna", pantone: "17-1436" },
    { hex: "#D2691E", name: "Rust", pantone: "17-1347" },
    { hex: "#CD853F", name: "Peru", pantone: "16-1439" },
    { hex: "#B5651D", name: "Clay", pantone: "17-1340" },
    { hex: "#A0522D", name: "Sienna", pantone: "18-1345" },
    { hex: "#8B4513", name: "Saddle", pantone: "18-1140" },
    { hex: "#E2725B", name: "Coral", pantone: "16-1546" },
    { hex: "#F08080", name: "Light Coral", pantone: "15-1530" },
    { hex: "#CC7357", name: "Dusty Coral", pantone: "16-1526" },
  ],
  "Ocean & Sky": [
    { hex: "#0D1B2A", name: "Deep Navy", pantone: "19-4028" },
    { hex: "#1B3A4B", name: "Dark Teal", pantone: "19-4526" },
    { hex: "#2D6A7F", name: "Ocean", pantone: "18-4728" },
    { hex: "#4A90A4", name: "Teal", pantone: "17-4427" },
    { hex: "#5DADE2", name: "Sky Blue", pantone: "15-4421" },
    { hex: "#87CEEB", name: "Light Sky", pantone: "14-4318" },
    { hex: "#B0E0E6", name: "Powder Blue", pantone: "13-4411" },
    { hex: "#E0F4F7", name: "Ice Blue", pantone: "12-4609" },
    { hex: "#6B8FA3", name: "Dusty Blue", pantone: "16-4114" },
    { hex: "#4682B4", name: "Steel Blue", pantone: "17-4023" },
  ],
  "Lime & Citrus": [
    { hex: "#D4ED39", name: "Lime", pantone: "13-0550" },
    { hex: "#ADFF2F", name: "Green Yellow", pantone: "13-0645" },
    { hex: "#9ACD32", name: "Yellow Green", pantone: "14-0445" },
    { hex: "#7CB518", name: "Apple Green", pantone: "15-0545" },
    { hex: "#6ABE30", name: "Grass", pantone: "15-0548" },
    { hex: "#FFE66D", name: "Lemon", pantone: "12-0752" },
    { hex: "#FFF44F", name: "Canary", pantone: "12-0643" },
    { hex: "#F0E68C", name: "Khaki", pantone: "13-0725" },
    { hex: "#FAFAD2", name: "Light Goldenrod", pantone: "11-0616" },
    { hex: "#EEE8AA", name: "Pale Goldenrod", pantone: "12-0722" },
  ],
};

// Suggested palettes for Jenn's aesthetic
const suggestedPalettes = [
  {
    name: "Editorial Forest",
    description: "Your signature look - sophisticated & grounded",
    colors: [
      { hex: "#3B412D", name: "Deep Forest" },
      { hex: "#546E40", name: "Olive" },
      { hex: "#97A97C", name: "Sage" },
      { hex: "#FFF5EB", name: "Ivory" },
      { hex: "#FABF34", name: "Gold" },
    ],
  },
  {
    name: "Warm Minimalist",
    description: "Clean with natural warmth",
    colors: [
      { hex: "#2A3C24", name: "Hunter" },
      { hex: "#CBAD8C", name: "Tan" },
      { hex: "#FAF3E8", name: "Cream" },
      { hex: "#FFF5EB", name: "Ivory" },
      { hex: "#D4A853", name: "Honey" },
    ],
  },
  {
    name: "Sage & Stone",
    description: "Soft, organic, calming",
    colors: [
      { hex: "#52653E", name: "Olive Moss" },
      { hex: "#97A97C", name: "Sage" },
      { hex: "#C4D4B5", name: "Fern" },
      { hex: "#EFE4D6", name: "Oat" },
      { hex: "#A89985", name: "Stone" },
    ],
  },
  {
    name: "Desert Gold",
    description: "Earthy with bold accents",
    colors: [
      { hex: "#5C4033", name: "Chocolate" },
      { hex: "#A67C52", name: "Caramel" },
      { hex: "#D4C5B5", name: "Sand" },
      { hex: "#FFF5EB", name: "Ivory" },
      { hex: "#FABF34", name: "Gold" },
    ],
  },
  {
    name: "Terra Verde",
    description: "Earth tones with terracotta pop",
    colors: [
      { hex: "#3B412D", name: "Deep Forest" },
      { hex: "#8B7355", name: "Cinnamon" },
      { hex: "#E8D5C4", name: "Champagne" },
      { hex: "#FFF5EB", name: "Ivory" },
      { hex: "#C76B4A", name: "Burnt Sienna" },
    ],
  },
  {
    name: "Moss & Honey",
    description: "Natural sweetness",
    colors: [
      { hex: "#4A5B3E", name: "Thyme" },
      { hex: "#8A9A5B", name: "Moss" },
      { hex: "#C4D4B5", name: "Fern" },
      { hex: "#FAF3E8", name: "Cream" },
      { hex: "#E8B923", name: "Honey" },
    ],
  },
];

// Font options
const fontOptions = {
  heading: [
    { name: "Instrument Serif", style: "Editorial, elegant", category: "serif" },
    { name: "Playfair Display", style: "Classic, luxurious", category: "serif" },
    { name: "Cormorant Garamond", style: "Refined, thin", category: "serif" },
    { name: "DM Serif Display", style: "Modern serif", category: "serif" },
    { name: "Fraunces", style: "Soft, quirky serif", category: "serif" },
    { name: "Space Grotesk", style: "Geometric, tech", category: "sans" },
    { name: "Poppins", style: "Friendly, modern", category: "sans" },
    { name: "Bebas Neue", style: "Bold, condensed", category: "sans" },
    { name: "Archivo Black", style: "Heavy, impactful", category: "sans" },
    { name: "Nunito", style: "Rounded, warm", category: "sans" },
  ],
  body: [
    { name: "DM Sans", style: "Clean, readable", category: "sans" },
    { name: "Inter", style: "Neutral, modern", category: "sans" },
    { name: "Lato", style: "Humanist, warm", category: "sans" },
    { name: "Source Sans Pro", style: "Professional", category: "sans" },
    { name: "Nunito Sans", style: "Friendly", category: "sans" },
    { name: "Work Sans", style: "Geometric, clean", category: "sans" },
    { name: "IBM Plex Sans", style: "Technical, precise", category: "sans" },
    { name: "JetBrains Mono", style: "Monospace, code", category: "mono" },
    { name: "Lora", style: "Readable serif", category: "serif" },
    { name: "Merriweather", style: "Traditional serif", category: "serif" },
  ],
};

// Style options
const styleOptions = {
  corners: [
    { value: "0px", label: "Sharp", preview: "rounded-none" },
    { value: "4px", label: "Subtle", preview: "rounded-sm" },
    { value: "8px", label: "Soft", preview: "rounded-lg" },
    { value: "16px", label: "Round", preview: "rounded-2xl" },
    { value: "9999px", label: "Pill", preview: "rounded-full" },
  ],
  shadows: [
    { value: "none", label: "None", css: "none" },
    { value: "subtle", label: "Subtle", css: "0 1px 3px rgba(0,0,0,0.08)" },
    { value: "soft", label: "Soft", css: "0 4px 12px rgba(0,0,0,0.1)" },
    { value: "medium", label: "Medium", css: "0 8px 24px rgba(0,0,0,0.12)" },
    { value: "dramatic", label: "Dramatic", css: "0 16px 48px rgba(0,0,0,0.2)" },
  ],
  spacing: [
    { value: "compact", label: "Compact", multiplier: 0.75 },
    { value: "comfortable", label: "Comfortable", multiplier: 1 },
    { value: "spacious", label: "Spacious", multiplier: 1.5 },
    { value: "airy", label: "Airy", multiplier: 2 },
  ],
};

// Color utilities
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

function generateShades(hex: string): string[] {
  const hsl = hexToHsl(hex);
  const shades: string[] = [];
  for (let i = 0; i <= 10; i++) {
    const lightness = 95 - i * 9;
    shades.push(hslToHex(hsl.h, hsl.s, lightness));
  }
  return shades;
}

function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#1A1A1A" : "#FFFFFF";
}

export default function BrandBuilder() {
  // Active view
  const [activeView, setActiveView] = useState<"library" | "build" | "preview">("build");

  // Brand configuration
  const [palette, setPalette] = useState<ColorSwatch[]>([]);
  const [headingFont, setHeadingFont] = useState("Instrument Serif");
  const [bodyFont, setBodyFont] = useState("DM Sans");
  const [cornerRadius, setCornerRadius] = useState("8px");
  const [shadowStyle, setShadowStyle] = useState("soft");
  const [spacing, setSpacing] = useState("comfortable");

  // UI state
  const [selectedFamily, setSelectedFamily] = useState<string>("Forest & Earth");
  const [shadeColor, setShadeColor] = useState<string | null>(null);
  const [shades, setShades] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [savedBrands, setSavedBrands] = useState<{ name: string; config: BrandConfig }[]>([]);
  const [brandName, setBrandName] = useState("");

  // Load saved brands
  useEffect(() => {
    const saved = localStorage.getItem("jenn-saved-brands");
    if (saved) setSavedBrands(JSON.parse(saved));
  }, []);

  // Update shades when color selected
  useEffect(() => {
    if (shadeColor) {
      setShades(generateShades(shadeColor));
    }
  }, [shadeColor]);

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  const addToPalette = (color: ColorSwatch) => {
    if (palette.length < 6 && !palette.some(c => c.hex === color.hex)) {
      setPalette([...palette, color]);
    }
  };

  const removeFromPalette = (index: number) => {
    setPalette(palette.filter((_, i) => i !== index));
  };

  const loadSuggestedPalette = (colors: ColorSwatch[]) => {
    setPalette(colors);
  };

  const saveBrand = () => {
    if (!brandName || palette.length === 0) return;
    const config: BrandConfig = {
      palette,
      headingFont,
      bodyFont,
      cornerRadius,
      shadowStyle,
      spacing,
    };
    const updated = [...savedBrands, { name: brandName, config }];
    setSavedBrands(updated);
    localStorage.setItem("jenn-saved-brands", JSON.stringify(updated));
    setBrandName("");
  };

  const loadBrand = (config: BrandConfig) => {
    setPalette(config.palette);
    setHeadingFont(config.headingFont);
    setBodyFont(config.bodyFont);
    setCornerRadius(config.cornerRadius);
    setShadowStyle(config.shadowStyle);
    setSpacing(config.spacing);
  };

  const getShadowCSS = () => {
    return styleOptions.shadows.find(s => s.value === shadowStyle)?.css || "none";
  };

  const getSpacingMultiplier = () => {
    return styleOptions.spacing.find(s => s.value === spacing)?.multiplier || 1;
  };

  // Generate CSS output
  const generateCSS = () => {
    let css = `:root {\n`;
    css += `  /* Colors */\n`;
    palette.forEach((c, i) => {
      const role = i === 0 ? "primary" : i === 1 ? "secondary" : i === palette.length - 1 ? "accent" : `color-${i + 1}`;
      css += `  --${role}: ${c.hex};\n`;
    });
    css += `\n  /* Typography */\n`;
    css += `  --font-heading: "${headingFont}", serif;\n`;
    css += `  --font-body: "${bodyFont}", sans-serif;\n`;
    css += `\n  /* Style */\n`;
    css += `  --border-radius: ${cornerRadius};\n`;
    css += `  --shadow: ${getShadowCSS()};\n`;
    const mult = getSpacingMultiplier();
    css += `  --spacing-sm: ${0.5 * mult}rem;\n`;
    css += `  --spacing-md: ${1 * mult}rem;\n`;
    css += `  --spacing-lg: ${1.5 * mult}rem;\n`;
    css += `  --spacing-xl: ${2 * mult}rem;\n`;
    css += `}\n`;
    return css;
  };

  return (
    <IOAuthGate>
      <div className="min-h-screen" style={{ background: "#0F0F0F" }}>
        {/* Header */}
        <header className="border-b px-6 py-4" style={{ borderColor: "#2a2a2a", background: "#171717" }}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/io/sandbox" className="text-xs transition-colors hover:opacity-70" style={{ color: "#97A97C" }}>
                ← Sandbox
              </Link>
              <h1 className="text-xl italic" style={{ color: "#FFF5EB", fontFamily: "var(--font-instrument)" }}>
                Brand Generator
              </h1>
            </div>

            {/* View Toggle */}
            <div className="flex gap-1 p-1 rounded-lg" style={{ background: "#252525" }}>
              {[
                { id: "library", label: "Color Library" },
                { id: "build", label: "Build Brand" },
                { id: "preview", label: "Preview" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id as typeof activeView)}
                  className="px-4 py-2 rounded-md text-sm font-medium transition-all"
                  style={{
                    background: activeView === tab.id ? "#546E40" : "transparent",
                    color: activeView === tab.id ? "#FFF5EB" : "#808080",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Current Palette Bar */}
          <div className="mb-6 p-4 rounded-xl flex items-center gap-4" style={{ background: "#1A1A1A", border: "1px solid #2a2a2a" }}>
            <span className="text-xs uppercase tracking-wider" style={{ color: "#808080" }}>Your Palette:</span>
            <div className="flex gap-2 flex-1">
              {palette.length === 0 ? (
                <span className="text-xs" style={{ color: "#555" }}>Click colors below to add them</span>
              ) : (
                palette.map((color, i) => (
                  <div key={i} className="group relative">
                    <div
                      className="w-10 h-10 rounded-lg cursor-pointer transition-transform hover:scale-110"
                      style={{ background: color.hex }}
                      onClick={() => setShadeColor(color.hex)}
                      title={`${color.name} - Click for shades`}
                    />
                    <button
                      onClick={() => removeFromPalette(i)}
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: "#ff4444", color: "#fff" }}
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>
            {palette.length > 0 && (
              <button
                onClick={() => setPalette([])}
                className="text-xs px-3 py-1.5 rounded transition-colors"
                style={{ background: "#2a2a2a", color: "#808080" }}
              >
                Clear
              </button>
            )}
          </div>

          {/* === COLOR LIBRARY VIEW === */}
          {activeView === "library" && (
            <div className="grid grid-cols-12 gap-6">
              {/* Color Families */}
              <div className="col-span-3">
                <div className="rounded-xl p-4 sticky top-6" style={{ background: "#1A1A1A" }}>
                  <h3 className="text-xs uppercase tracking-wider mb-4" style={{ color: "#CBAD8C" }}>
                    Color Families
                  </h3>
                  <div className="space-y-1">
                    {Object.keys(colorLibrary).map((family) => (
                      <button
                        key={family}
                        onClick={() => setSelectedFamily(family)}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all"
                        style={{
                          background: selectedFamily === family ? "#546E40" : "transparent",
                          color: selectedFamily === family ? "#FFF5EB" : "#97A97C",
                        }}
                      >
                        {family}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Colors Grid */}
              <div className="col-span-6">
                <div className="rounded-xl p-5" style={{ background: "#1A1A1A" }}>
                  <h3 className="text-sm font-medium mb-4" style={{ color: "#FFF5EB" }}>
                    {selectedFamily}
                  </h3>
                  <div className="grid grid-cols-5 gap-3">
                    {colorLibrary[selectedFamily]?.map((color, i) => (
                      <button
                        key={i}
                        onClick={() => addToPalette(color)}
                        className="group text-left transition-transform hover:scale-105"
                        disabled={palette.some(c => c.hex === color.hex)}
                      >
                        <div
                          className="aspect-square rounded-lg mb-2 relative"
                          style={{
                            background: color.hex,
                            opacity: palette.some(c => c.hex === color.hex) ? 0.4 : 1,
                          }}
                        >
                          {palette.some(c => c.hex === color.hex) && (
                            <span className="absolute inset-0 flex items-center justify-center text-lg">✓</span>
                          )}
                        </div>
                        <p className="text-xs font-medium truncate" style={{ color: "#FFF5EB" }}>
                          {color.name}
                        </p>
                        <p className="text-[10px] font-mono" style={{ color: "#666" }}>
                          {color.pantone}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Shade Explorer */}
              <div className="col-span-3">
                <div className="rounded-xl p-4 sticky top-6" style={{ background: "#1A1A1A" }}>
                  <h3 className="text-xs uppercase tracking-wider mb-4" style={{ color: "#CBAD8C" }}>
                    Shade Explorer
                  </h3>
                  {shadeColor ? (
                    <>
                      <div className="flex gap-2 items-center mb-4">
                        <div className="w-8 h-8 rounded" style={{ background: shadeColor }} />
                        <span className="text-xs font-mono" style={{ color: "#FFF5EB" }}>{shadeColor}</span>
                      </div>
                      <div className="space-y-1">
                        {shades.map((shade, i) => (
                          <button
                            key={i}
                            onClick={() => copyToClipboard(shade, `shade-${i}`)}
                            className="w-full h-6 rounded flex items-center justify-between px-2 transition-all hover:scale-x-105"
                            style={{ background: shade }}
                          >
                            <span className="text-[9px] font-mono" style={{ color: getContrastColor(shade) }}>
                              {copied === `shade-${i}` ? "Copied!" : shade}
                            </span>
                            <span className="text-[9px]" style={{ color: getContrastColor(shade) }}>
                              {95 - i * 9}%
                            </span>
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => addToPalette({ hex: shadeColor, name: "Custom" })}
                        className="w-full mt-4 py-2 rounded-lg text-xs font-medium transition-colors"
                        style={{ background: "#546E40", color: "#FFF5EB" }}
                      >
                        Add to Palette
                      </button>
                    </>
                  ) : (
                    <p className="text-xs text-center py-8" style={{ color: "#555" }}>
                      Click a color to see its shades
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* === BUILD BRAND VIEW === */}
          {activeView === "build" && (
            <div className="grid grid-cols-12 gap-6">
              {/* Left: Suggested Palettes */}
              <div className="col-span-4 space-y-6">
                <div className="rounded-xl p-5" style={{ background: "#1A1A1A" }}>
                  <h3 className="text-xs uppercase tracking-wider mb-4" style={{ color: "#CBAD8C" }}>
                    Suggested for You
                  </h3>
                  <div className="space-y-3">
                    {suggestedPalettes.map((pal, i) => (
                      <button
                        key={i}
                        onClick={() => loadSuggestedPalette(pal.colors)}
                        className="w-full p-3 rounded-lg text-left transition-all hover:scale-[1.02]"
                        style={{ background: "#252525" }}
                      >
                        <div className="flex gap-1 rounded overflow-hidden mb-2">
                          {pal.colors.map((c, j) => (
                            <div key={j} className="flex-1 h-8" style={{ background: c.hex }} />
                          ))}
                        </div>
                        <p className="text-sm font-medium" style={{ color: "#FFF5EB" }}>{pal.name}</p>
                        <p className="text-xs" style={{ color: "#808080" }}>{pal.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Saved Brands */}
                {savedBrands.length > 0 && (
                  <div className="rounded-xl p-5" style={{ background: "#1A1A1A" }}>
                    <h3 className="text-xs uppercase tracking-wider mb-4" style={{ color: "#CBAD8C" }}>
                      Saved Brands
                    </h3>
                    <div className="space-y-2">
                      {savedBrands.map((brand, i) => (
                        <button
                          key={i}
                          onClick={() => loadBrand(brand.config)}
                          className="w-full p-3 rounded-lg text-left transition-all hover:scale-[1.02]"
                          style={{ background: "#252525" }}
                        >
                          <div className="flex gap-1 rounded overflow-hidden mb-2">
                            {brand.config.palette.map((c, j) => (
                              <div key={j} className="flex-1 h-4" style={{ background: c.hex }} />
                            ))}
                          </div>
                          <p className="text-sm" style={{ color: "#FFF5EB" }}>{brand.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Middle: Typography & Style */}
              <div className="col-span-4 space-y-6">
                {/* Typography */}
                <div className="rounded-xl p-5" style={{ background: "#1A1A1A" }}>
                  <h3 className="text-xs uppercase tracking-wider mb-4" style={{ color: "#CBAD8C" }}>
                    Typography
                  </h3>

                  <div className="mb-4">
                    <label className="text-xs block mb-2" style={{ color: "#808080" }}>Heading Font</label>
                    <div className="grid grid-cols-2 gap-2">
                      {fontOptions.heading.map((font) => (
                        <button
                          key={font.name}
                          onClick={() => setHeadingFont(font.name)}
                          className="p-2 rounded-lg text-left transition-all"
                          style={{
                            background: headingFont === font.name ? "#546E40" : "#252525",
                            border: headingFont === font.name ? "1px solid #97A97C" : "1px solid transparent",
                          }}
                        >
                          <p className="text-sm truncate" style={{ color: "#FFF5EB", fontFamily: font.name }}>{font.name}</p>
                          <p className="text-[10px]" style={{ color: "#808080" }}>{font.style}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs block mb-2" style={{ color: "#808080" }}>Body Font</label>
                    <div className="grid grid-cols-2 gap-2">
                      {fontOptions.body.map((font) => (
                        <button
                          key={font.name}
                          onClick={() => setBodyFont(font.name)}
                          className="p-2 rounded-lg text-left transition-all"
                          style={{
                            background: bodyFont === font.name ? "#546E40" : "#252525",
                            border: bodyFont === font.name ? "1px solid #97A97C" : "1px solid transparent",
                          }}
                        >
                          <p className="text-sm truncate" style={{ color: "#FFF5EB", fontFamily: font.name }}>{font.name}</p>
                          <p className="text-[10px]" style={{ color: "#808080" }}>{font.style}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Corners & Shadows */}
                <div className="rounded-xl p-5" style={{ background: "#1A1A1A" }}>
                  <h3 className="text-xs uppercase tracking-wider mb-4" style={{ color: "#CBAD8C" }}>
                    Style
                  </h3>

                  <div className="mb-4">
                    <label className="text-xs block mb-2" style={{ color: "#808080" }}>Corners</label>
                    <div className="flex gap-2">
                      {styleOptions.corners.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setCornerRadius(opt.value)}
                          className="flex-1 py-2 text-xs transition-all"
                          style={{
                            background: cornerRadius === opt.value ? "#546E40" : "#252525",
                            color: cornerRadius === opt.value ? "#FFF5EB" : "#808080",
                            borderRadius: opt.value === "9999px" ? "9999px" : opt.value,
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="text-xs block mb-2" style={{ color: "#808080" }}>Shadows</label>
                    <div className="flex gap-2">
                      {styleOptions.shadows.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setShadowStyle(opt.value)}
                          className="flex-1 py-2 rounded-lg text-xs transition-all"
                          style={{
                            background: shadowStyle === opt.value ? "#546E40" : "#252525",
                            color: shadowStyle === opt.value ? "#FFF5EB" : "#808080",
                            boxShadow: opt.css,
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs block mb-2" style={{ color: "#808080" }}>Spacing</label>
                    <div className="flex gap-2">
                      {styleOptions.spacing.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setSpacing(opt.value)}
                          className="flex-1 py-2 rounded-lg text-xs transition-all"
                          style={{
                            background: spacing === opt.value ? "#546E40" : "#252525",
                            color: spacing === opt.value ? "#FFF5EB" : "#808080",
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Save & Export */}
              <div className="col-span-4 space-y-6">
                {/* Mini Preview */}
                <div className="rounded-xl overflow-hidden" style={{ background: palette[palette.length - 2]?.hex || "#FFF5EB" }}>
                  <div className="p-6" style={{ fontFamily: bodyFont }}>
                    <h2
                      className="text-2xl mb-2"
                      style={{ fontFamily: headingFont, color: palette[0]?.hex || "#1A1A1A" }}
                    >
                      Preview Heading
                    </h2>
                    <p className="text-sm mb-4" style={{ color: palette[1]?.hex || "#666" }}>
                      This is how your body text will look with the selected typography and colors.
                    </p>
                    <button
                      className="px-4 py-2 text-sm font-medium"
                      style={{
                        background: palette[palette.length - 1]?.hex || "#FABF34",
                        color: getContrastColor(palette[palette.length - 1]?.hex || "#FABF34"),
                        borderRadius: cornerRadius,
                        boxShadow: getShadowCSS(),
                      }}
                    >
                      Action Button
                    </button>
                  </div>
                </div>

                {/* Save Brand */}
                <div className="rounded-xl p-5" style={{ background: "#1A1A1A" }}>
                  <h3 className="text-xs uppercase tracking-wider mb-4" style={{ color: "#CBAD8C" }}>
                    Save Brand
                  </h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      placeholder="Brand name..."
                      className="flex-1 px-3 py-2 rounded-lg text-sm"
                      style={{ background: "#252525", color: "#FFF5EB", border: "1px solid #3a3a3a" }}
                    />
                    <button
                      onClick={saveBrand}
                      disabled={!brandName || palette.length === 0}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
                      style={{ background: "#FABF34", color: "#1A1A1A" }}
                    >
                      Save
                    </button>
                  </div>
                </div>

                {/* CSS Output */}
                <div className="rounded-xl p-5" style={{ background: "#1A1A1A" }}>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs uppercase tracking-wider" style={{ color: "#CBAD8C" }}>
                      CSS Output
                    </h3>
                    <button
                      onClick={() => copyToClipboard(generateCSS(), "css")}
                      className="text-xs px-3 py-1 rounded transition-colors"
                      style={{ background: "#252525", color: copied === "css" ? "#FABF34" : "#808080" }}
                    >
                      {copied === "css" ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <pre
                    className="p-3 rounded-lg text-xs overflow-x-auto max-h-48"
                    style={{ background: "#0F0F0F", color: "#97A97C" }}
                  >
                    {generateCSS()}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* === PREVIEW VIEW === */}
          {activeView === "preview" && (
            <div className="space-y-6">
              {/* Full Preview */}
              <div
                className="rounded-2xl overflow-hidden"
                style={{ background: palette[palette.length - 2]?.hex || "#FFF5EB" }}
              >
                {/* Nav Preview */}
                <nav
                  className="px-8 py-4 flex items-center justify-between"
                  style={{
                    background: palette[0]?.hex || "#3B412D",
                    fontFamily: bodyFont,
                  }}
                >
                  <span style={{ color: palette[palette.length - 2]?.hex || "#FFF5EB", fontFamily: headingFont }} className="text-lg">
                    Brand Name
                  </span>
                  <div className="flex gap-6">
                    {["Home", "About", "Work", "Contact"].map((item) => (
                      <span key={item} className="text-sm" style={{ color: palette[2]?.hex || "#97A97C" }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </nav>

                {/* Hero Preview */}
                <div className="px-8 py-16 text-center" style={{ fontFamily: bodyFont }}>
                  <h1
                    className="text-5xl mb-4"
                    style={{ fontFamily: headingFont, color: palette[0]?.hex || "#1A1A1A" }}
                  >
                    Welcome to Your Brand
                  </h1>
                  <p
                    className="text-lg mb-8 max-w-xl mx-auto"
                    style={{ color: palette[1]?.hex || "#666" }}
                  >
                    This is how your brand will look with the typography, colors, and styling you've selected.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <button
                      className="px-6 py-3 text-sm font-medium transition-transform hover:scale-105"
                      style={{
                        background: palette[palette.length - 1]?.hex || "#FABF34",
                        color: getContrastColor(palette[palette.length - 1]?.hex || "#FABF34"),
                        borderRadius: cornerRadius,
                        boxShadow: getShadowCSS(),
                      }}
                    >
                      Primary Action
                    </button>
                    <button
                      className="px-6 py-3 text-sm font-medium transition-transform hover:scale-105"
                      style={{
                        background: "transparent",
                        color: palette[0]?.hex || "#1A1A1A",
                        borderRadius: cornerRadius,
                        border: `2px solid ${palette[1]?.hex || "#666"}`,
                      }}
                    >
                      Secondary
                    </button>
                  </div>
                </div>

                {/* Cards Preview */}
                <div className="px-8 pb-16">
                  <div className="grid grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="p-6"
                        style={{
                          background: palette[palette.length - 3]?.hex || "#FFFFFF",
                          borderRadius: cornerRadius,
                          boxShadow: getShadowCSS(),
                        }}
                      >
                        <div
                          className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center text-xl"
                          style={{ background: palette[2]?.hex || "#97A97C" }}
                        >
                          ✦
                        </div>
                        <h3
                          className="text-lg mb-2"
                          style={{ fontFamily: headingFont, color: palette[0]?.hex || "#1A1A1A" }}
                        >
                          Feature {i}
                        </h3>
                        <p className="text-sm" style={{ color: palette[1]?.hex || "#666" }}>
                          A brief description of this feature and why it matters.
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Type Scale Preview */}
              <div className="rounded-xl p-8" style={{ background: "#1A1A1A" }}>
                <h3 className="text-xs uppercase tracking-wider mb-6" style={{ color: "#CBAD8C" }}>
                  Typography Scale
                </h3>
                <div className="space-y-4">
                  {[
                    { size: "4xl", label: "Display", px: "40px" },
                    { size: "3xl", label: "H1", px: "32px" },
                    { size: "2xl", label: "H2", px: "24px" },
                    { size: "xl", label: "H3", px: "20px" },
                    { size: "lg", label: "Lead", px: "18px" },
                    { size: "base", label: "Body", px: "16px" },
                    { size: "sm", label: "Small", px: "14px" },
                  ].map((t) => (
                    <div key={t.label} className="flex items-baseline gap-4">
                      <span className="text-xs w-16" style={{ color: "#808080" }}>{t.px}</span>
                      <span
                        className={`text-${t.size}`}
                        style={{
                          fontFamily: t.label.startsWith("H") || t.label === "Display" ? headingFont : bodyFont,
                          color: "#FFF5EB",
                        }}
                      >
                        {t.label} — {t.label.startsWith("H") || t.label === "Display" ? headingFont : bodyFont}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </IOAuthGate>
  );
}
