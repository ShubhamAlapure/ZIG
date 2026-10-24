import React from 'react';
import { Check } from 'lucide-react';

export interface RoleCardsProps {
  selectedRole: 'collector' | 'artist' | '';
  onSelectRole: (role: 'collector' | 'artist') => void;
  disabled?: boolean;
}

export const RoleCards: React.FC<RoleCardsProps> = ({
  selectedRole,
  onSelectRole,
  disabled = false,
}) => {
  return (
    <div
      role="radiogroup"
      aria-label="Select your role in the gallery"
      className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full"
    >
      {/* Collector Card */}
      <div
        role="radio"
        aria-checked={selectedRole === 'collector'}
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && onSelectRole('collector')}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            !disabled && onSelectRole('collector');
          }
        }}
        className={`relative p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer select-none text-left flex flex-col justify-between ${
          selectedRole === 'collector'
            ? 'bg-white border-[#D98E04] ring-2 ring-[#D98E04]/25 shadow-md -translate-y-0.5'
            : selectedRole === 'artist'
            ? 'bg-[#FAF7F0]/60 border-[#E2D8C3] opacity-65 hover:opacity-90 hover:bg-white'
            : 'bg-[#FAF7F0] border-[#E2D8C3] hover:border-[#D98E04]/60 hover:bg-white'
        } ${disabled ? 'pointer-events-none opacity-50' : ''}`}
      >
        <div className="flex items-start justify-between">
          {/* Curatorial Masterpiece Frame Icon */}
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-200 ${
              selectedRole === 'collector'
                ? 'bg-amber-100/80 text-[#B37400]'
                : 'bg-[#ECE5D6] text-[#7A6C58]'
            }`}
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </div>

          {/* Active selection dot */}
          <div
            className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
              selectedRole === 'collector'
                ? 'bg-[#D98E04] border-[#B37400] text-white shadow-xs'
                : 'border-[#D1C4AC] bg-white'
            }`}
          >
            {selectedRole === 'collector' && <Check className="w-3 h-3 stroke-[3]" />}
          </div>
        </div>

        <div className="mt-3">
          <h4
            className="text-xs sm:text-sm font-bold text-[#1E1A14]"
            style={{ fontFamily: "'Cinzel', Georgia, serif" }}
          >
            Collector / Patron
          </h4>
          <p className="text-[11px] text-[#7A6C58] mt-0.5 leading-snug">
            Curate private vaults, discover originals &amp; attend master previews.
          </p>
        </div>
      </div>

      {/* Artist Card */}
      <div
        role="radio"
        aria-checked={selectedRole === 'artist'}
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && onSelectRole('artist')}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            !disabled && onSelectRole('artist');
          }
        }}
        className={`relative p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer select-none text-left flex flex-col justify-between ${
          selectedRole === 'artist'
            ? 'bg-white border-[#D98E04] ring-2 ring-[#D98E04]/25 shadow-md -translate-y-0.5'
            : selectedRole === 'collector'
            ? 'bg-[#FAF7F0]/60 border-[#E2D8C3] opacity-65 hover:opacity-90 hover:bg-white'
            : 'bg-[#FAF7F0] border-[#E2D8C3] hover:border-[#D98E04]/60 hover:bg-white'
        } ${disabled ? 'pointer-events-none opacity-50' : ''}`}
      >
        <div className="flex items-start justify-between">
          {/* Artist Palette / Easel Icon */}
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-200 ${
              selectedRole === 'artist'
                ? 'bg-amber-100/80 text-[#B37400]'
                : 'bg-[#ECE5D6] text-[#7A6C58]'
            }`}
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
              <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
              <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
              <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
            </svg>
          </div>

          {/* Active selection dot */}
          <div
            className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
              selectedRole === 'artist'
                ? 'bg-[#D98E04] border-[#B37400] text-white shadow-xs'
                : 'border-[#D1C4AC] bg-white'
            }`}
          >
            {selectedRole === 'artist' && <Check className="w-3 h-3 stroke-[3]" />}
          </div>
        </div>

        <div className="mt-3">
          <h4
            className="text-xs sm:text-sm font-bold text-[#1E1A14]"
            style={{ fontFamily: "'Cinzel', Georgia, serif" }}
          >
            Fine Artist / Creator
          </h4>
          <p className="text-[11px] text-[#7A6C58] mt-0.5 leading-snug">
            Showcase works in the 3D Master Hall, publish collections &amp; connect with patrons.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleCards;
