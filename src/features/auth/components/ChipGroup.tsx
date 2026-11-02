import React from 'react';
import { motion } from 'framer-motion';

export interface ChipGroupProps {
  options: string[];
  selected: string[];
  onToggle: (val: string) => void;
  label: string;
  error?: string;
}

/**
 * ChipGroup — pill-shaped art-type selector with spring stagger entrance.
 *
 * - Unselected: glass background, amber border on hover.
 * - Selected: gold border, amber bg tint, scale 1.05 pop.
 * - Each chip is keyboard accessible with aria-pressed.
 */
export const ChipGroup: React.FC<ChipGroupProps> = ({
  options,
  selected,
  onToggle,
  label,
  error,
}) => {
  return (
    <div>
      <p
        className="text-[10.5px] font-bold uppercase tracking-[0.06em] mb-2"
        style={{ color: 'var(--auth-ink-muted)' }}
        id="chip-group-label"
      >
        {label}
      </p>

      <div
        className="flex flex-wrap gap-1.5"
        role="group"
        aria-labelledby="chip-group-label"
      >
        {options.map((option, idx) => {
          const isSelected = selected.includes(option);

          return (
            <motion.button
              key={option}
              type="button"
              role="checkbox"
              aria-checked={isSelected}
              onClick={() => onToggle(option)}
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: idx * 0.04,
                type: 'spring',
                stiffness: 380,
                damping: 28,
              }}
              whileTap={{ scale: 0.94 }}
              className="relative px-3 py-1.5 rounded-full text-[11.5px] font-semibold cursor-pointer select-none outline-none"
              style={{
                background: isSelected
                  ? 'rgba(229,169,28,0.12)'
                  : 'rgba(255,255,255,0.70)',
                backdropFilter: 'blur(8px)',
                border: isSelected
                  ? '1.5px solid var(--auth-gold-amber)'
                  : '1px solid rgba(229,169,28,0.22)',
                color: isSelected ? 'var(--auth-ink)' : 'var(--auth-ink-muted)',
                boxShadow: isSelected
                  ? '0 3px 10px -2px rgba(217,142,4,0.22)'
                  : '0 1px 4px -1px rgba(23,20,18,0.06)',
                transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                transition: 'border-color 0.2s ease, background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease',
                minHeight: '36px',
              }}
            >
              {isSelected && (
                <motion.span
                  className="mr-1 inline-block"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 22 }}
                  aria-hidden="true"
                >
                  ✓
                </motion.span>
              )}
              {option}
            </motion.button>
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

export default ChipGroup;
