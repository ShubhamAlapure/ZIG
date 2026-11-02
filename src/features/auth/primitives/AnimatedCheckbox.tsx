import React, { useId, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

export interface AnimatedCheckboxProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  ariaLabel?: string;
  disabled?: boolean;
  className?: string;
}

export const AnimatedCheckbox: React.FC<AnimatedCheckboxProps> = ({
  id: propId,
  checked,
  onChange,
  label,
  ariaLabel,
  disabled = false,
  className = '',
}) => {
  const generatedId = useId();
  const inputId = propId || generatedId;
  const boxRef = useRef<HTMLDivElement>(null);

  const handleChange = (next: boolean) => {
    if (disabled) return;
    onChange(next);
    // Tactile spring pop
    if (boxRef.current) {
      gsap.timeline()
        .to(boxRef.current, { scale: 0.78, duration: 0.09, ease: 'power2.in' })
        .to(boxRef.current, { scale: 1.18, duration: 0.14, ease: 'back.out(3)' })
        .to(boxRef.current, { scale: 1, duration: 0.20, ease: 'elastic.out(1, 0.5)' });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleChange(!checked);
    }
  };

  return (
    <label
      htmlFor={inputId}
      className={`inline-flex items-center gap-2.5 cursor-pointer select-none group ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      <input
        id={inputId}
        type="checkbox"
        checked={checked}
        onChange={(e) => handleChange(e.target.checked)}
        disabled={disabled}
        aria-label={ariaLabel}
        className="sr-only"
        onKeyDown={handleKeyDown}
      />

      {/* Box */}
      <div ref={boxRef} className="flex-shrink-0" style={{ willChange: 'transform' }}>
        <motion.div
          animate={checked
            ? { background: 'linear-gradient(135deg, #F5C518 0%, #D4930A 100%)', borderColor: '#C5910A' }
            : { background: 'rgba(255,255,255,0.95)', borderColor: 'rgba(158,122,50,0.8)' }
          }
          className={`
            w-[18px] h-[18px] min-w-[18px] min-h-[18px] rounded-[5px]
            border-2 flex items-center justify-center
            transition-shadow duration-200
            ${checked
              ? 'shadow-[0_2px_10px_rgba(213,147,10,0.35)]'
              : 'shadow-[0_1px_4px_rgba(0,0,0,0.07)] group-hover:border-[#C59B27] group-hover:shadow-[0_2px_8px_rgba(197,155,39,0.22)]'
            }
          `}
        >
          <AnimatePresence>
            {checked && (
              <motion.svg
                key="check"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0A0803"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3 h-3"
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.3 }}
                transition={{ duration: 0.15, ease: 'backOut' }}
              >
                <motion.path
                  d="M20 6L9 17L4 12"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                />
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Label */}
      {label && (
        <motion.span
          animate={{ color: checked ? '#7A5E20' : '#2A2015' }}
          transition={{ duration: 0.2 }}
          className="text-[12.5px] font-medium select-none leading-none"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {label}
        </motion.span>
      )}
    </label>
  );
};

export default AnimatedCheckbox;
