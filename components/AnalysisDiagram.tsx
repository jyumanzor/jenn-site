"use client";

export default function AnalysisDiagram() {
  return (
    <div className="relative w-full aspect-[4/3] bg-[#F5F3EE] rounded-lg p-8 overflow-hidden">
      {/* Faint grid background */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #C4C0B8 1px, transparent 1px),
            linear-gradient(to bottom, #C4C0B8 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />

      {/* Central Schematic Figure */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[55%]">
        {/* Outer border */}
        <div className="border border-[#C4C0B8] rounded-lg p-4 bg-white/50">
          {/* Inner nested rectangle */}
          <div className="border border-[#D4D0C8] rounded p-3">
            {/* Flow diagram: Input → Analysis → Output */}
            <div className="flex items-center justify-between gap-2">
              {/* Input box */}
              <div className="flex-1 border border-[#C4C0B8] rounded px-2 py-3 bg-white/60 text-center">
                <span className="text-[10px] text-[#8B8780] uppercase tracking-wider">Data</span>
              </div>

              {/* Arrow */}
              <svg className="w-6 h-4 text-[#C4C0B8] flex-shrink-0" viewBox="0 0 24 16" fill="none">
                <path d="M0 8h20M16 4l4 4-4 4" stroke="currentColor" strokeWidth="1"/>
              </svg>

              {/* Analysis box */}
              <div className="flex-1 border border-[#9B978E] rounded px-2 py-3 bg-[#F8F6F2] text-center">
                <span className="text-[10px] text-[#6B6860] uppercase tracking-wider">Model</span>
              </div>

              {/* Arrow */}
              <svg className="w-6 h-4 text-[#C4C0B8] flex-shrink-0" viewBox="0 0 24 16" fill="none">
                <path d="M0 8h20M16 4l4 4-4 4" stroke="currentColor" strokeWidth="1"/>
              </svg>

              {/* Output box */}
              <div className="flex-1 border border-[#C4C0B8] rounded px-2 py-3 bg-white/60 text-center">
                <span className="text-[10px] text-[#8B8780] uppercase tracking-wider">Opinion</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Connecting Lines and Callouts */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 300">
        {/* Line 1: Top-left callout to Input box */}
        <path
          d="M 85 55 L 85 95 L 115 95"
          fill="none"
          stroke="#C4C0B8"
          strokeWidth="1"
        />
        {/* Anchor point */}
        <circle cx="115" cy="95" r="2" fill="#C4C0B8"/>

        {/* Line 2: Bottom-right callout to Output box */}
        <path
          d="M 315 245 L 315 205 L 285 205"
          fill="none"
          stroke="#C4C0B8"
          strokeWidth="1"
        />
        {/* Anchor point */}
        <circle cx="285" cy="205" r="2" fill="#C4C0B8"/>

        {/* Line 3: Mid-right callout to Model box */}
        <path
          d="M 355 150 L 280 150"
          fill="none"
          stroke="#C4C0B8"
          strokeWidth="1"
        />
        {/* Anchor point */}
        <circle cx="280" cy="150" r="2" fill="#C4C0B8"/>
      </svg>

      {/* Callout 1: Top-left */}
      <div className="absolute top-4 left-4 max-w-[140px]">
        <div className="flex items-start gap-2">
          <span className="w-5 h-5 rounded-full bg-[#97A97C]/20 text-[#546E40] text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
            1
          </span>
          <p
            className="text-xs text-[#6B6860] leading-snug"
            style={{ fontFamily: 'var(--font-instrument), Georgia, serif', fontStyle: 'italic' }}
          >
            Damages theory tied to legal standard
          </p>
        </div>
      </div>

      {/* Callout 2: Bottom-right */}
      <div className="absolute bottom-4 right-4 max-w-[140px] text-right">
        <div className="flex items-start gap-2 justify-end">
          <p
            className="text-xs text-[#6B6860] leading-snug"
            style={{ fontFamily: 'var(--font-instrument), Georgia, serif', fontStyle: 'italic' }}
          >
            Daubert-ready methodology
          </p>
          <span className="w-5 h-5 rounded-full bg-[#CBAD8C]/30 text-[#8B7355] text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
            3
          </span>
        </div>
      </div>

      {/* Callout 3: Mid-right */}
      <div className="absolute top-1/2 right-3 -translate-y-1/2 max-w-[100px] text-right">
        <div className="flex items-start gap-2 justify-end">
          <p
            className="text-xs text-[#6B6860] leading-snug"
            style={{ fontFamily: 'var(--font-instrument), Georgia, serif', fontStyle: 'italic' }}
          >
            Data sources documented & reproducible
          </p>
          <span className="w-5 h-5 rounded-full bg-[#97A97C]/20 text-[#546E40] text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
            2
          </span>
        </div>
      </div>

      {/* Diagram label */}
      <div className="absolute bottom-3 left-4">
        <span className="text-[10px] text-[#A09A90] uppercase tracking-widest">
          Fig. 1—Analysis Framework
        </span>
      </div>
    </div>
  );
}
