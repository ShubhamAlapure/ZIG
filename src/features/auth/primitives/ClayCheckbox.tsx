import React, { useId } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from './useReducedMotion';

export interface ClayCheckboxProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  ariaLabel?: string;
  theme?: 'daylight' | 'gallery';
  className?: string;
  disabled?: boolean;
}

/**
 * ClayCheckbox
 * Fuzzy tactile clay toggle checkbox:
 * - Pops with spring rebound on click
 * - Draws animated SVG check
 * - Fuzzy golden aura when checked
 */
export const ClayCheckbox: React.FC<ClayCheckboxProps> = ({
  id: explicitId,
  checked,
  onChange,
  label,
  ariaLabel,
  className = '',
  disabled = false,
}) => {
  const generatedId = useId();
  const id = explicitId || generatedId;
  const isReduced = useReducedMotion();

  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div className={`clay-checkbox-container inline-flex items-center gap-2.5 select-none ${className}`}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        aria-label={ariaLabel}
        className="sr-only"
      />

      <motion.div
        role="checkbox"
        aria-checked={checked}
        tabIndex={disabled ? -1 : 0}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        whileHover={{ scale: isReduced ? 1 : 1.08 }}
        whileTap={{ scale: isReduced ? 1 : 0.9 }}
        animate={checked && !isReduced ? { scale: [0.9, 1.14, 1] } : { scale: 1 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        style={{
          background: checked
            ? 'linear-gradient(135deg, #FFF4CE 0%, #F5C542 30%, #C5A059 70%, #9E7A32 100%)'
            : '#FFFFFF',
          boxShadow: checked
            ? '0 0 12px rgba(229, 169, 28, 0.5), 0 4px 10px rgba(229, 169, 28, 0.35), inset 0 1.5px 1px rgba(255, 255, 255, 0.9)'
            : 'inset 0 2px 4px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)',
          border: checked
            ? '1px solid #E5A91C'
            : '1px solid rgba(197, 160, 89, 0.35)',
        }}
        className="w-5 h-5 rounded-lg flex items-center justify-center cursor-pointer outline-none focus-visible:ring-3 focus-visible:ring-[#E5A91C] flex-shrink-0"
      >
        {checked && (
          <svg
            className="w-3.5 h-3.5 text-[#14110E]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <motion.polyline
              points="20 6 9 17 4 12"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.2 }}
            />
          </svg>
        )}
      </motion.div>

      {label && (
        <label
          htmlFor={id}
          className="text-xs cursor-pointer select-none leading-snug font-medium text-[#4A4237]"
          style={{
            fontFamily: "'Geist', 'Plus Jakarta Sans', sans-serif",
          }}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default ClayCheckbox;
