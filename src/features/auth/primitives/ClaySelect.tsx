import React, { useState, useRef, useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { useReducedMotion } from './useReducedMotion';

export interface ClaySelectOption {
  value: string;
  label: string;
  badge?: string;
}

export interface ClaySelectProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: (ClaySelectOption | string)[];
  placeholder?: string;
  theme?: 'daylight' | 'gallery';
  className?: string;
  error?: string;
}

/**
 * ClaySelect
 * Frosted glass tactile dropdown select with spring unfolding:
 * - Frosted glass surface (backdrop-filter: blur(14px))
 * - Rotating gold chevron
 * - Soft diffuse ambient halo
 * - Spring staggered options list
 */
export const ClaySelect: React.FC<ClaySelectProps> = ({
  id: explicitId,
  label,
  value,
  onChange,
  options,
  placeholder = 'Select an option…',
  className = '',
  error,
}) => {
  const generatedId = useId();
  const id = explicitId || generatedId;
  const isReduced = useReducedMotion();

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const normalizedOptions: ClaySelectOption[] = options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else if (e.key === 'ArrowDown' && isOpen) {
      e.preventDefault();
      const currIdx = normalizedOptions.findIndex((o) => o.value === value);
      const nextIdx = Math.min(currIdx + 1, normalizedOptions.length - 1);
      onChange(normalizedOptions[nextIdx].value);
    } else if (e.key === 'ArrowUp' && isOpen) {
      e.preventDefault();
      const currIdx = normalizedOptions.findIndex((o) => o.value === value);
      const prevIdx = Math.max(currIdx - 1, 0);
      onChange(normalizedOptions[prevIdx].value);
    }
  };

  return (
    <div ref={containerRef} className={`clay-select-root relative w-full text-left space-y-1 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-[11px] font-bold uppercase tracking-wider text-[#7D705C] pl-1"
          style={{ fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif" }}
        >
          {label}
        </label>
      )}

      {/* Main Select Button with Frosted Glassmorphism */}
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        style={{
          background:
            'linear-gradient(135deg, rgba(255, 255, 255, 0.78) 0%, rgba(254, 251, 246, 0.55) 100%)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          boxShadow: isOpen
            ? '0 0 0 3px rgba(229, 169, 28, 0.35), 0 0 24px rgba(229, 169, 28, 0.3), inset 0 1.5px 1px rgba(255, 255, 255, 0.95)'
            : '0 4px 14px -2px rgba(24, 18, 12, 0.05), inset 0 1.5px 1px rgba(255, 255, 255, 0.95), inset 0 -1.5px 2px rgba(197, 160, 89, 0.08)',
          border: error
            ? '1.5px solid #EF4444'
            : isOpen
            ? '1.5px solid #E5A91C'
            : '1px solid rgba(255, 255, 255, 0.9)',
        }}
        className="w-full h-[52px] px-3.5 rounded-2xl flex items-center justify-between text-xs font-semibold cursor-pointer outline-none focus-visible:ring-3 focus-visible:ring-[#E5A91C] transition-all duration-200"
      >
        <span
          className="truncate"
          style={{
            color: selectedOption ? '#14110E' : '#8C7D6B',
          }}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-2 text-[#C5A059] flex-shrink-0"
        >
          <ChevronDown size={16} />
        </motion.span>
      </button>

      {/* Floating Options Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: 'rgba(255, 255, 255, 0.94)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.95)',
              boxShadow: '0 16px 36px -4px rgba(24, 18, 12, 0.16), 0 0 20px rgba(229,169,28,0.22)',
            }}
            className="absolute left-0 right-0 top-full mt-1.5 z-50 max-h-56 overflow-y-auto rounded-2xl p-1.5 custom-scrollbar"
          >
            {normalizedOptions.map((opt, idx) => {
              const isSelected = opt.value === value;
              return (
                <motion.div
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: isReduced ? 0 : idx * 0.015 }}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-medium cursor-pointer flex items-center justify-between transition-colors duration-150 ${
                    isSelected
                      ? 'bg-[#C5A059]/20 font-bold text-[#9E7A32]'
                      : 'text-[#14110E] hover:bg-amber-500/10'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && <Check size={14} className="text-[#C5A059]" />}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClaySelect;
