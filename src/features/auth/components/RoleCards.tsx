import React from 'react';
import { motion } from 'framer-motion';

export interface RoleCardsProps {
  value: 'collector' | 'artist' | '';
  onChange: (role: 'collector' | 'artist') => void;
  error?: string;
}

interface RoleOption {
  id: 'collector' | 'artist';
  emoji: string;
  title: string;
  description: string;
}

const ROLES: RoleOption[] = [
  {
    id: 'collector',
    emoji: '🖼️',
    title: 'Art Lover / Collector',
    description: 'Discover and own fine art',
  },
  {
    id: 'artist',
    emoji: '🎨',
    title: 'Artist',
    description: 'Share your creative work',
  },
];

/**
 * RoleCards — clay-style frosted glass role selection for Sign Up.
 *
 * - Each card uses `--auth-clay-shadow` and Framer Motion `whileHover` tilt.
 * - Selected card gets a gold glow ring and slight lift.
 * - Keyboard accessible: Enter/Space selects the focused card.
 */
export const RoleCards: React.FC<RoleCardsProps> = ({ value, onChange, error }) => {
  const handleKey = (e: React.KeyboardEvent, id: 'collector' | 'artist') => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange(id);
    }
  };

  return (
    <div>
      <div
        className="grid grid-cols-2 gap-3"
        role="group"
        aria-label="Select your role"
      >
        {ROLES.map((role, idx) => {
          const isSelected = value === role.id;
          const tiltDir = idx === 0 ? -1.5 : 1.5; // left card tilts left on hover, right tilts right

          return (
            <motion.div
              key={role.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => onChange(role.id)}
              onKeyDown={(e) => handleKey(e, role.id)}
              className="relative rounded-2xl p-4 cursor-pointer select-none outline-none"
              style={{
                background: isSelected
                  ? 'linear-gradient(135deg, rgba(255,255,255,0.82) 0%, rgba(242,203,92,0.12) 100%)'
                  : 'rgba(255,255,255,0.70)',
                backdropFilter: 'blur(var(--auth-blur))',
                border: isSelected
                  ? '1.5px solid var(--auth-gold-amber)'
                  : '1px solid rgba(229,169,28,0.2)',
                boxShadow: isSelected
                  ? 'var(--auth-clay-hover), 0 0 0 3px var(--auth-gold-ring)'
                  : 'var(--auth-clay-shadow)',
                transition:
                  'border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease',
              }}
              animate={{
                y: isSelected ? -2 : 0,
              }}
              whileHover={{
                rotateY: tiltDir,
                rotateX: 2,
                y: isSelected ? -3 : -1,
              }}
              whileFocus={{
                boxShadow: isSelected
                  ? 'var(--auth-clay-hover), 0 0 0 4px var(--auth-gold-ring)'
                  : '0 0 0 3px var(--auth-gold-ring)',
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            >
              {/* Selected indicator ring */}
              {isSelected && (
                <motion.div
                  layoutId="role-selection-indicator"
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    boxShadow: '0 0 0 2px var(--auth-gold-amber)',
                    borderRadius: 'inherit',
                  }}
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}

              <div className="flex flex-col items-center text-center gap-2 relative z-10">
                {/* Emoji icon */}
                <motion.span
                  className="text-3xl leading-none"
                  animate={{ scale: isSelected ? 1.12 : 1 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 26 }}
                  aria-hidden="true"
                >
                  {role.emoji}
                </motion.span>

                {/* Title */}
                <span
                  className="text-[12.5px] font-bold leading-tight"
                  style={{ color: isSelected ? 'var(--auth-ink)' : 'var(--auth-ink-2)' }}
                >
                  {role.title}
                </span>

                {/* Description */}
                <span
                  className="text-[10.5px] font-medium leading-snug"
                  style={{ color: 'var(--auth-ink-muted)' }}
                >
                  {role.description}
                </span>
              </div>

              {/* Gold dot when selected */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full"
                  style={{ background: 'var(--auth-gold)' }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {error && (
        <p
          role="alert"
          className="flex items-center gap-1.5 mt-1.5 pl-1 text-[11.5px] font-semibold animate-fadeIn"
          style={{ color: 'var(--auth-danger)' }}
        >
          <svg
            className="w-3.5 h-3.5 flex-shrink-0"
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm0 10a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm.75-3.75a.75.75 0 0 1-1.5 0V5.25a.75.75 0 0 1 1.5 0v2z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default RoleCards;
