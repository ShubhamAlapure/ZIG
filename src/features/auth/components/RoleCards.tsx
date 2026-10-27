import React from 'react';
import { motion } from 'framer-motion';
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
      className="grid grid-cols-2 gap-2 sm:gap-3 w-full"
    >
      {/* Collector / Patron Card */}
      <motion.div
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
        whileHover={!disabled ? { y: -2 } : undefined}
        whileTap={!disabled ? { scale: 0.985 } : undefined}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className={`relative p-2.5 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer select-none text-left flex flex-col justify-between ${
          selectedRole === 'collector'
            ? 'bg-white border-[#C5A059] ring-2 ring-[#C5A059]/25 shadow-md'
            : selectedRole === 'artist'
            ? 'bg-[#FAF8F5]/60 border-[#E8DFC8] opacity-65 hover:opacity-90 hover:bg-white'
            : 'bg-[#FAF8F5] border-[#E8DFC8] hover:border-[#C5A059]/60 hover:bg-white'
        } ${disabled ? 'pointer-events-none opacity-50' : ''}`}
      >
        <div className="flex items-start justify-between">
          {/* Curatorial Masterpiece Frame Icon */}
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-200 ${
              selectedRole === 'collector'
                ? 'bg-amber-50 text-[#9E7A32]'
                : 'bg-[#ECE5D6] text-[#7D705C]'
            }`}
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
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
                ? 'bg-[#C5A059] border-[#9E7A32] text-white shadow-xs'
                : 'border-[#D1C4AC] bg-white'
            }`}
          >
            {selectedRole === 'collector' && <Check className="w-3 h-3 stroke-[3]" />}
          </div>
        </div>

        <div className="mt-2.5">
          <h4
            className="text-xs sm:text-[13px] font-bold text-[#171412] tracking-tight"
            style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
          >
            Collector / Patron
          </h4>
          <p className="text-[11px] text-[#7D705C] mt-0.5 leading-snug">
            Curate private vaults, acquire verified originals &amp; attend previews.
          </p>
        </div>
      </motion.div>

      {/* Artist / Creator Card */}
      <motion.div
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
        whileHover={!disabled ? { y: -2 } : undefined}
        whileTap={!disabled ? { scale: 0.985 } : undefined}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className={`relative p-2.5 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer select-none text-left flex flex-col justify-between ${
          selectedRole === 'artist'
            ? 'bg-white border-[#C5A059] ring-2 ring-[#C5A059]/25 shadow-md'
            : selectedRole === 'collector'
            ? 'bg-[#FAF8F5]/60 border-[#E8DFC8] opacity-65 hover:opacity-90 hover:bg-white'
            : 'bg-[#FAF8F5] border-[#E8DFC8] hover:border-[#C5A059]/60 hover:bg-white'
        } ${disabled ? 'pointer-events-none opacity-50' : ''}`}
      >
        <div className="flex items-start justify-between">
          {/* Artist Palette / Easel Icon */}
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-200 ${
              selectedRole === 'artist'
                ? 'bg-amber-50 text-[#9E7A32]'
                : 'bg-[#ECE5D6] text-[#7D705C]'
            }`}
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
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
                ? 'bg-[#C5A059] border-[#9E7A32] text-white shadow-xs'
                : 'border-[#D1C4AC] bg-white'
            }`}
          >
            {selectedRole === 'artist' && <Check className="w-3 h-3 stroke-[3]" />}
          </div>
        </div>

        <div className="mt-2.5">
          <h4
            className="text-xs sm:text-[13px] font-bold text-[#171412] tracking-tight"
            style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
          >
            Fine Artist / Creator
          </h4>
          <p className="text-[11px] text-[#7D705C] mt-0.5 leading-snug">
            Exhibit in the 3D Master Hall, publish collections &amp; connect with collectors.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RoleCards;
