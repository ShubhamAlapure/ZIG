import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

export type CompanionState = 'waving' | 'pointing' | 'clapping' | 'celebrating';

export interface GuideCompanionProps {
  state?: CompanionState;
  customMessage?: string;
}

export const GuideCompanion: React.FC<GuideCompanionProps> = ({
  state = 'waving',
  customMessage,
}) => {
  const [clickQuip, setClickQuip] = useState<string | null>(null);

  const defaultMessages: Record<CompanionState, string> = {
    waving: 'Bonjour! Welcome to the fine art portal.',
    pointing: 'Fill this in to unlock the next gallery room.',
    clapping: 'Superb stroke! Almost at the Master Hall.',
    celebrating: 'Magnifique! Welcome into the gallery!',
  };

  const message = customMessage || clickQuip || defaultMessages[state];

  const handleCompanionClick = () => {
    const quips = [
      'Art washes away from the soul the dust of everyday life.',
      'Every artist was first an amateur. — Emerson',
      'The painter is waiting for you in the Master Hall!',
      'Gilding your credentials with pure gold!',
    ];
    const randomQuip = quips[Math.floor(Math.random() * quips.length)];
    setClickQuip(randomQuip);
    setTimeout(() => setClickQuip(null), 3500);
  };

  return (
    <aside
      aria-label="Interactive Art Guide Companion"
      className="hidden sm:flex absolute right-4 bottom-4 z-30 pointer-events-none items-end gap-2.5 select-none"
    >
      {/* Speech Bubble */}
      <div
        className="pointer-events-auto max-w-[170px] bg-white border border-[#D98E04]/30 rounded-2xl p-2.5 shadow-md text-left text-[11px] font-semibold text-[#1E1A14] leading-tight relative animate-fadeIn"
      >
        <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-[#B37400] font-bold mb-0.5">
          <Sparkles className="w-2.5 h-2.5" />
          <span>Curator Guide</span>
        </div>
        <p className="text-[#3D3327]">{message}</p>

        {/* Speech triangle */}
        <div className="absolute -right-1.5 bottom-3 w-3 h-3 bg-white border-t border-r border-[#D98E04]/30 rotate-45" />
      </div>

      {/* Painter Character SVG */}
      <button
        type="button"
        onClick={handleCompanionClick}
        title="Pierre, your Museum Art Guide (click for inspiration)"
        aria-label="Pierre, your Museum Art Guide (click for inspiration)"
        className="pointer-events-auto relative w-12 h-14 cursor-pointer transition-transform hover:scale-110 active:scale-95 animate-companion-bob focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D98E04] rounded-full"
      >
        <svg
          viewBox="0 0 64 72"
          className="w-full h-full drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Beret (French Artist Hat in Velvet Wine/Gold) */}
          <ellipse cx="32" cy="18" rx="19" ry="8" fill="#8B1E2F" />
          <path d="M22 17 C22 9, 42 9, 42 17 Z" fill="#A82B3E" />
          <circle cx="32" cy="9" r="2" fill="#D98E04" />

          {/* Face */}
          <circle cx="32" cy="27" r="13" fill="#FCE9D6" />

          {/* Eyes (Friendly blinking eyes) */}
          <circle cx="28" cy="25" r="1.8" fill="#2E2318" />
          <circle cx="36" cy="25" r="1.8" fill="#2E2318" />
          <circle cx="28.5" cy="24.5" r="0.6" fill="#FFFFFF" />
          <circle cx="36.5" cy="24.5" r="0.6" fill="#FFFFFF" />

          {/* Curled Artist Mustache */}
          <path
            d="M26 31 C28 32, 31 31, 32 30 C33 31, 36 32, 38 31 C39 30, 40 32, 38 33 C34 34, 30 34, 26 31 Z"
            fill="#5A4330"
          />

          {/* Smile */}
          <path
            d="M29 33 Q32 36 35 33"
            stroke="#5A4330"
            strokeWidth="1.2"
            strokeLinecap="round"
          />

          {/* Cheeks */}
          <ellipse cx="25" cy="28" rx="2" ry="1.2" fill="#FFA5A5" opacity="0.6" />
          <ellipse cx="39" cy="28" rx="2" ry="1.2" fill="#FFA5A5" opacity="0.6" />

          {/* Artist Smock / Scarf */}
          <path d="M26 38 L38 38 L42 43 L22 43 Z" fill="#D98E04" />
          <path
            d="M20 42 C20 40, 44 40, 44 42 L48 64 C48 68, 16 68, 16 64 Z"
            fill="#324A60"
          />

          {/* Striped artist shirt inside */}
          <rect x="27" y="43" width="10" height="2" fill="#FFFFFF" />
          <rect x="26" y="47" width="12" height="2" fill="#FFFFFF" />

          {/* Left Arm holding Wooden Palette */}
          <path d="M18 45 L12 52" stroke="#324A60" strokeWidth="4.5" strokeLinecap="round" />
          {/* Palette */}
          <ellipse cx="11" cy="54" rx="7" ry="5" fill="#D29A5C" stroke="#A66E32" strokeWidth="1" />
          <circle cx="8" cy="52" r="1.2" fill="#D98E04" />
          <circle cx="11" cy="51" r="1.2" fill="#10B981" />
          <circle cx="14" cy="53" r="1.2" fill="#EF4444" />
          <circle cx="10" cy="56" r="1.2" fill="#3B82F6" />

          {/* Right Arm with Paintbrush (Animated Wave) */}
          <g className={state === 'waving' ? 'animate-painter-wave' : ''}>
            <path d="M46 45 L53 38" stroke="#324A60" strokeWidth="4.5" strokeLinecap="round" />
            <circle cx="53" cy="37" r="2.2" fill="#FCE9D6" />
            {/* Paintbrush */}
            <line x1="53" y1="37" x2="60" y2="28" stroke="#7A5230" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M60 28 L62 25 L61 24 L59 27 Z" fill="#D98E04" />
          </g>
        </svg>
      </button>
    </aside>
  );
};

export default GuideCompanion;
