import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from './useReducedMotion';

export interface ClayChipProps {
  label: string;
  selected: boolean;
  onToggle: () => void;
  icon?: React.ReactNode;
  subtitle?: string;
  variant?: 'pill' | 'card';
  theme?: 'daylight' | 'gallery';
  role?: 'checkbox' | 'radio';
}

/**
 * ClayChip
 * Glassmorphic tactile chip and role card:
 * - Frosted glass translucent surface (backdrop-filter: blur(12px))
 * - Pops with spring rebound when selected
 * - Fills with glowing chrome-gold gradient
 * - Luminous ambient fuzzy shadow
 */
export const ClayChip: React.FC<ClayChipProps> = ({
  label,
  selected,
  onToggle,
  icon,
  subtitle,
  variant = 'pill',
  role = 'checkbox',
}) => {
  const isReduced = useReducedMotion();
  const isCard = variant === 'card';

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onToggle();
    }
  };

  return (
    <motion.button
      type="button"
      role={role}
      aria-checked={selected}
      onClick={onToggle}
      onKeyDown={handleKeyDown}
      whileHover={{ scale: isReduced ? 1 : 1.025, y: -1 }}
      whileTap={{ scale: isReduced ? 1 : 0.95 }}
      animate={selected && !isReduced ? { scale: [0.96, 1.05, 1] } : { scale: 1 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      style={{
        background: selected
          ? 'linear-gradient(135deg, #FFF4CE 0%, #F5C542 30%, #C5A059 70%, #9E7A32 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(253, 250, 245, 0.6) 100%)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: selected
          ? '0 0 18px rgba(229, 169, 28, 0.45), 0 6px 18px -2px rgba(197, 160, 89, 0.45), inset 0 2px 2px 0 rgba(255, 255, 255, 0.95), inset 0 -2px 3px 0 rgba(140, 102, 30, 0.35)'
          : '0 4px 14px -2px rgba(24, 18, 12, 0.05), inset 0 1.5px 1.5px 0 rgba(255, 255, 255, 0.95), inset 0 -1.5px 2px 0 rgba(197, 160, 89, 0.08)',
        border: selected
          ? '1.5px solid #E5A91C'
          : '1px solid rgba(255, 255, 255, 0.9)',
        color: selected ? '#14110E' : '#3D352D',
      }}
      className={`clay-chip-root relative group outline-none focus-visible:ring-3 focus-visible:ring-[#E5A91C] cursor-pointer select-none transition-all duration-200 ${
        isCard
          ? 'w-full p-3.5 rounded-2xl flex items-start gap-3 text-left'
          : 'px-3.5 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5'
      }`}
    >
      {/* Icon */}
      {icon && (
        <span
          className={`flex-shrink-0 transition-transform ${
            isCard ? 'text-2xl mt-0.5' : 'text-sm'
          } ${selected ? 'scale-110' : 'group-hover:scale-105'}`}
        >
          {icon}
        </span>
      )}

      {/* Label and Subtitle */}
      <div className={isCard ? 'flex flex-col flex-1' : ''}>
        <span
          className={`tracking-tight ${
            isCard ? 'text-sm font-bold' : 'text-xs font-semibold'
          }`}
          style={{
            fontFamily: isCard
              ? "'Plus Jakarta Sans', sans-serif"
              : "'Plus Jakarta Sans', sans-serif",
          }}
        >
          {label}
        </span>
        {isCard && subtitle && (
          <span
            className={`text-[11px] mt-0.5 leading-snug ${
              selected ? 'text-[#3D3222]' : '#7D705C'
            }`}
          >
            {subtitle}
          </span>
        )}
      </div>

      {/* Selected Indicator Dot */}
      {selected && (
        <span
          className="flex-shrink-0 w-2 h-2 rounded-full bg-[#14110E] ml-auto self-center"
          aria-hidden="true"
        />
      )}
    </motion.button>
  );
};

export default ClayChip;
