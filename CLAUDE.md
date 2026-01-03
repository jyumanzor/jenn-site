# CLAUDE.md — Project Rules for Claude Code

> These rules are NON-NEGOTIABLE. Read and follow them on every session.

---

## COLOR CONTRAST RULES (CRITICAL)

### The Golden Rule
**NEVER place dark text on dark backgrounds or light text on light backgrounds.**

Before writing ANY color combination, mentally verify:
- Dark backgrounds (#3B412D, #2F2F2C, #546E40) → Use LIGHT text (#FFF5EB, #FAF3E8, #CBAD8C)
- Light backgrounds (#FFF5EB, #FAF3E8, #EFE4D6) → Use DARK text (#3B412D, #2F2F2C, #546E40)

### Approved Color Pairings

#### Dark Backgrounds (use these text colors)
| Background | Primary Text | Secondary Text | Accent |
|------------|--------------|----------------|--------|
| `#3B412D` (Deep Forest) | `#FFF5EB` | `#CBAD8C` | `#FABF34` |
| `#2F2F2C` (Charcoal) | `#FFF5EB` | `#97A97C` | `#FABF34` |
| `#546E40` (Olive) | `#FFF5EB` | `#FAF3E8` | `#FABF34` |

#### Light Backgrounds (use these text colors)
| Background | Primary Text | Secondary Text | Accent |
|------------|--------------|----------------|--------|
| `#FFF5EB` (Ivory) | `#3B412D` | `#546E40` | `#FABF34` |
| `#FAF3E8` (Cream) | `#3B412D` | `#546E40` | `#FABF34` |
| `#EFE4D6` (Warm Gray) | `#3B412D` | `#546E40` | `#97A97C` |

### FORBIDDEN Combinations (Never Use)
- `#3B412D` text on `#546E40` background (dark on dark)
- `#546E40` text on `#3B412D` background (dark on dark)
- `#FFF5EB` text on `#FAF3E8` background (light on light)
- `#97A97C` text on `#FFF5EB` background (too low contrast for body text)
- `#CBAD8C` as primary body text (only use for labels/secondary)

### Gold Rule (#FABF34)
Gold is ONLY for:
- Numbers and statistics
- Icons and small accents
- Hover states
- Small badges/labels

Gold is NEVER for:
- Body text
- Headers
- Large text blocks
- Backgrounds

### Contrast Checklist (Run Before Every Component)
Before finalizing any component, verify:
1. [ ] Background color identified
2. [ ] Text color has sufficient contrast (4.5:1 minimum for body, 3:1 for large text)
3. [ ] Interactive elements are distinguishable
4. [ ] Hover states maintain contrast
5. [ ] No color conveys meaning alone (add icons/text)

---

## STYLE PATTERNS

### Typography
- **Headers**: `fontFamily: 'var(--font-instrument)'` (Instrument Serif)
- **Body**: `system-ui, sans-serif`
- **Stats/Numbers**: `font-mono` with gold color `#FABF34`
- **Labels**: `text-xs uppercase tracking-wider` with `#CBAD8C` or `#97A97C`

### Borders & Backgrounds
- Light panels: `background: '#FFF5EB'`, `border: '1px solid #CBAD8C'`
- Dark panels: `background: '#3B412D'`, `border: '1px solid #546E40'`
- Rounded corners: `rounded-xl` (12px) for panels, `rounded-full` (100px) for buttons

### Interactive States
- Hover: `hover:scale-[1.02]` or `hover:translate-x-1`
- Transitions: `transition-all duration-200`
- Active tabs: `background: '#546E40'`, `color: '#FFF5EB'`
- Inactive tabs: `background: 'transparent'`, `border: '1px solid #97A97C'`

---

## COMPONENT TEMPLATES

### Stats Card (Light)
```jsx
<div className="rounded-xl p-4 text-center" style={{ background: '#FFF5EB', border: '1px solid #CBAD8C' }}>
  <span className="block text-3xl font-mono mb-1" style={{ color: '#FABF34' }}>
    {number}
  </span>
  <span className="text-xs uppercase tracking-wider" style={{ color: '#97A97C' }}>
    {label}
  </span>
</div>
```

### Dark Panel
```jsx
<div className="rounded-xl p-4" style={{ background: '#3B412D', border: '1px solid #546E40' }}>
  <h3 style={{ color: '#FFF5EB' }}>{title}</h3>
  <p style={{ color: '#CBAD8C' }}>{description}</p>
</div>
```

### Tab Button
```jsx
<button
  className="px-4 py-2 rounded-full text-sm font-medium transition-all"
  style={{
    background: isActive ? '#546E40' : 'transparent',
    color: isActive ? '#FFF5EB' : '#3B412D',
    border: isActive ? 'none' : '1px solid #97A97C',
  }}
>
  {label}
</button>
```

### Category Badge
```jsx
<span
  className="px-2 py-0.5 rounded text-xs uppercase"
  style={{ background: categoryColor, color: '#FFF5EB' }}  // Dark badge, light text
>
  {category}
</span>
```

---

## PROJECT CONTEXT

### File Structure
- Pages: `/app/` (Next.js App Router)
- Components: `/components/`
- Data: `/data/` (JSON files)
- Styles: `/app/globals.css`
- Docs: `/docs/` (read for context)

### Key Documentation
- `/docs/CREATIVE_BRIEF.md` — Design philosophy
- `/docs/USER_PREFERENCES.md` — Specific color values
- `/docs/BRAND_IDENTITY.md` — Brand guidelines
- `/docs/PROMPT_LIBRARY.md` — Reusable prompts

### IO Dashboard
- All `/io/*` pages are password-protected via `IOAuthGate`
- Password: `jenn.io`
- Sandbox tools: prompt-builder, workflow-insights, voice-memos, brand-builder, palettes

---

## BEFORE YOU CODE

1. **Read the relevant docs** if making design decisions
2. **Check color pairings** against the approved list above
3. **Use component templates** as starting points
4. **Verify contrast** before finalizing any UI

When in doubt: **Dark text on light backgrounds, light text on dark backgrounds, gold only for accents.**
