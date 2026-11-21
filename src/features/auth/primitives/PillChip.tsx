import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import gsap from 'gsap';

export interface PillChipProps {
  label: string;
  selected: boolean;
  onToggle: () => void;
  icon?: string | React.ReactNode;
  subtitle?: string;
  variant?: 'pill' | 'card';
  role?: 'radio' | 'checkbox';
  className?: string;
}

export const PillChip: React.FC<PillChipProps> = ({
  label,
  selected,
  onToggle,
  icon,
  subtitle,
  variant = 'pill',
  role = 'checkbox',
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    onToggle();
    // GSAP tactile pop
    if (ref.current) {
      gsap.timeline()
        .to(ref.current, { scale: 0.88, duration: 0.08, ease: 'power2.in' })
        .to(ref.current, { scale: 1.08, duration: 0.14, ease: 'back.out(3.5)' })
        .to(ref.current, { scale: 1, duration: 0.22, ease: 'elastic.out(1, 0.45)' });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); handleClick(); }
  };

  // ── Card Variant (Collector / Artist role) ───────────────────────────────
  if (variant === 'card') {
    return (
      <div ref={ref} style={{ willChange: 'transform' }}>
        <motion.div
          role={role}
          aria-checked={selected}
          tabIndex={0}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          animate={{ scale: selected ? 1.02 : 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 26 }}
          className={`
            relative p-2.5 sm:p-3.5 rounded-[12px] sm:rounded-[13px] cursor-pointer select-none
            outline-none flex items-center gap-2 sm:gap-3 overflow-hidden
            focus-visible:ring-2 focus-visible:ring-[#D4A70E] focus-visible:ring-offset-1
            transition-shadow duration-200
            ${selected
              ? 'text-[#0A0803] shadow-[0_4px_18px_rgba(229,169,28,0.30)]'
              : 'bg-white/85 border border-[rgba(200,165,100,0.30)] text-[#1A140E] hover:bg-white hover:border-[#C5A059]/60 shadow-sm'
            }
            ${className}
          `}
        >
          {/* Animated fill background */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ opacity: selected ? 1 : 0 }}
            transition={{ duration: 0.25 }}
            style={{ background: 'linear-gradient(135deg, #FFE96B 0%, #F5C518 45%, #E0A010 100%)' }}
          />

          {icon && (
            <motion.div
              className="text-xl flex-shrink-0 relative z-10"
              animate={{ scale: selected ? 1.15 : 1, rotate: selected ? [0, -10, 10, 0] : 0 }}
              transition={{ duration: 0.35 }}
              aria-hidden="true"
            >
              {icon}
            </motion.div>
          )}

          <div className="flex-1 min-w-0 relative z-10">
            <p
              className={`font-semibold text-xs sm:text-[13px] tracking-wide leading-tight ${
                selected ? 'text-[#0A0803]' : 'text-[#1A140E]'
              }`}
              style={{ fontFamily: "'Cinzel', 'Plus Jakarta Sans', serif" }}
            >
              {label}
            </p>
            {subtitle && (
              <p className={`text-[11px] mt-0.5 truncate ${selected ? 'text-[#2A1800] font-medium' : 'text-[#7A6A55]'}`}>
                {subtitle}
              </p>
            )}
          </div>

          <AnimatePresence>
            {selected && (
              <motion.div
                key="check"
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 600, damping: 22 }}
                className="w-5 h-5 rounded-full bg-[#0A0803] text-[#F5C518] flex items-center justify-center flex-shrink-0 relative z-10"
              >
                <Check className="w-3 h-3 stroke-[3]" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  // ── Pill Variant (Art specialties) ───────────────────────────────────────
  return (
    <div ref={ref} className="inline-flex" style={{ willChange: 'transform' }}>
      <motion.button
        type="button"
        role={role}
        aria-checked={selected}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        animate={{ scale: selected ? 1.05 : 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 26 }}
        className={`
          relative px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide
          cursor-pointer select-none flex items-center gap-1.5 overflow-hidden
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A70E]
          transition-shadow duration-200
          ${selected
            ? 'text-[#0A0803] shadow-[0_2px_10px_rgba(229,169,28,0.28)]'
            : 'bg-white/85 border border-[rgba(200,165,100,0.28)] text-[#3E3224] hover:bg-white hover:border-[#C5A059]/55'
          }
          ${className}
        `}
      >
        {/* Animated fill */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: selected ? 1 : 0 }}
          transition={{ duration: 0.22 }}
          style={{ background: 'linear-gradient(90deg, #F5C518 0%, #E5A91C 100%)' }}
        />

        <span className="relative z-10 flex items-center gap-1.5">
          <AnimatePresence>
            {selected && (
              <motion.span
                key="chk"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 'auto', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <Check className="w-3 h-3 stroke-[3] text-[#0A0803]" />
              </motion.span>
            )}
          </AnimatePresence>
          {label}
        </span>
      </motion.button>
    </div>
  );
};

export default PillChip;
