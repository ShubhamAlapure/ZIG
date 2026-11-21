import React, { useState, useRef, useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { FieldIcon } from './FieldIcon';
import { useReducedMotion } from './useReducedMotion';

export interface ClayInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon?: 'mail' | 'lock' | 'user' | 'phone';
  isValid?: boolean;
  error?: string;
  hint?: string;
  variant?: 'daylight' | 'gallery';
  showPasswordToggle?: boolean;
}

/**
 * ClayInput
 * Glassmorphic, fuzzy, modern and playful form field:
 * - Frosted glass translucent body (backdrop-filter: blur(14px))
 * - Specular glass highlight bevel & fuzzy luminous ambient glow
 * - Dynamic cursor-reactive specular glint on hover
 * - Orbiting gold border beam on focus
 * - Spring-based floating elastic label
 * - Reactive animated icons (flap opens, padlock shackle pops, eye blinks)
 * - Typing spark pulses across the perimeter
 * - Elastic jelly-wobble shake on error
 */
export const ClayInput: React.FC<ClayInputProps> = ({
  id: explicitId,
  label,
  value,
  onChange,
  type = 'text',
  icon,
  isValid,
  error,
  hint,
  showPasswordToggle = false,
  required,
  placeholder,
  disabled,
  onFocus,
  onBlur,
  ...rest
}) => {
  const generatedId = useId();
  const id = explicitId || generatedId;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const typingTimer = useRef<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const isReduced = useReducedMotion();

  const hasValue = value.length > 0;
  const isLabelFloated = isFocused || hasValue;
  const actualType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type;

  // Elastic Jelly Wobble Shake on error
  useEffect(() => {
    if (!error || isReduced || !containerRef.current) return;

    gsap.fromTo(
      containerRef.current,
      { x: 0 },
      {
        x: (i) => (i % 2 === 0 ? -9 : 9),
        duration: 0.08,
        repeat: 5,
        yoyo: true,
        ease: 'power2.inOut',
        onComplete: () => {
          gsap.set(containerRef.current, { x: 0 });
        },
      }
    );
  }, [error, isReduced]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);

    if (!isReduced) {
      setIsTyping(true);
      if (typingTimer.current) clearTimeout(typingTimer.current);
      typingTimer.current = window.setTimeout(() => setIsTyping(false), 280);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isReduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <div ref={containerRef} className="w-full text-left space-y-1 relative select-none group">
      {/* ── 1. Fuzzy Ambient Luminous Aura Backlight ── */}
      <div
        className="absolute -inset-1.5 rounded-2xl pointer-events-none transition-all duration-300 -z-10"
        style={{
          background: error
            ? 'radial-gradient(circle at center, rgba(239, 68, 68, 0.4) 0%, transparent 75%)'
            : isFocused
            ? 'radial-gradient(circle at center, rgba(229, 169, 28, 0.5) 0%, rgba(197, 160, 89, 0.2) 50%, transparent 80%)'
            : isValid
            ? 'radial-gradient(circle at center, rgba(16, 185, 129, 0.35) 0%, transparent 70%)'
            : 'radial-gradient(circle at center, rgba(197, 160, 89, 0.14) 0%, transparent 70%)',
          filter: 'blur(12px)',
          opacity: isFocused ? 1 : error ? 0.95 : isValid ? 0.85 : 0.45,
          transform: isFocused ? 'scale(1.04)' : 'scale(1)',
        }}
        aria-hidden="true"
      />

      {/* ── 2. Glassmorphic Frosted Input Well Container ── */}
      <motion.div
        onMouseMove={handleMouseMove}
        whileHover={isReduced ? {} : { y: -2, scale: 1.01 }}
        whileTap={isReduced ? {} : { scale: 0.985 }}
        animate={
          isReduced
            ? {}
            : isFocused
            ? { scale: [1, 1.018, 1] }
            : { scale: 1, y: 0 }
        }
        transition={{ type: 'spring', stiffness: 450, damping: 22 }}
        className={`glassmorphic-input-shell relative flex items-center rounded-2xl px-3.5 transition-all duration-200 overflow-hidden ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        style={{
          height: '52px',
          background:
            'linear-gradient(135deg, rgba(255, 255, 255, 0.78) 0%, rgba(254, 251, 246, 0.55) 100%)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: error
            ? '1.5px solid #EF4444'
            : isFocused
            ? '1.5px solid #E5A91C'
            : isValid
            ? '1.5px solid #10B981'
            : '1px solid rgba(255, 255, 255, 0.85)',
          boxShadow: error
            ? '0 0 0 3px rgba(239, 68, 68, 0.22), 0 0 25px rgba(239, 68, 68, 0.2), inset 0 1.5px 1px rgba(255, 255, 255, 0.9)'
            : isFocused
            ? '0 0 0 3.5px rgba(229, 169, 28, 0.3), 0 0 28px rgba(229, 169, 28, 0.35), 0 8px 24px -2px rgba(197, 160, 89, 0.2), inset 0 1.5px 1px rgba(255, 255, 255, 0.95), inset 0 -1.5px 2px rgba(197, 160, 89, 0.12)'
            : isValid
            ? '0 0 0 2.5px rgba(16, 185, 129, 0.22), 0 0 18px rgba(16, 185, 129, 0.18), inset 0 1.5px 1px rgba(255, 255, 255, 0.9)'
            : '0 4px 18px -2px rgba(24, 18, 12, 0.06), 0 1px 3px rgba(197, 160, 89, 0.1), inset 0 1.5px 1.5px rgba(255, 255, 255, 0.95), inset 0 -1.5px 2px rgba(197, 160, 89, 0.08)',
        }}
      >
        {/* Dynamic Holographic Specular Glint (Tracks Cursor Over Glass) */}
        {!isReduced && (
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl opacity-40 mix-blend-overlay transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle 120px at ${mousePos.x}% ${mousePos.y}%, rgba(255, 255, 255, 0.9) 0%, rgba(229, 169, 28, 0.15) 50%, transparent 80%)`,
            }}
          />
        )}

        {/* Dynamic Orbiting Gold Border Beam when Focused */}
        {isFocused && !isReduced && (
          <span
            className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden"
            aria-hidden="true"
          >
            <span
              className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] pointer-events-none opacity-45"
              style={{
                background:
                  'conic-gradient(from 0deg, transparent 0deg 280deg, #E5A91C 330deg, #FFFFFF 360deg)',
                animation: 'border-beam-spin 2.6s linear infinite',
              }}
            />
          </span>
        )}

        {/* Dynamic Typing Neon Light Spark */}
        {isTyping && !isReduced && (
          <motion.span
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: [0, 1, 1.4], opacity: [0, 1, 0] }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#E5A91C] to-transparent pointer-events-none"
            style={{ boxShadow: '0 0 12px #E5A91C' }}
          />
        )}

        {/* Playful Left Edge Accent Pill */}
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 rounded-r-full bg-[#E5A91C]"
          initial={{ height: 0 }}
          animate={isFocused ? { height: '55%' } : { height: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          style={{ boxShadow: '0 0 8px #E5A91C' }}
        />

        {/* Reactive Interactive Icon with Spring Bounce */}
        {icon && (
          <motion.div
            animate={isFocused && !isReduced ? { scale: [1, 1.22, 1], rotate: [0, -6, 0] } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.28, ease: 'backOut' }}
            className="flex-shrink-0 mr-3 text-base pointer-events-none"
          >
            <FieldIcon
              type={icon === 'lock' ? (showPassword ? 'lock-open' : 'lock') : icon}
              active={isFocused}
            />
          </motion.div>
        )}

        {/* Input & Bouncy Floating Label */}
        <div className="relative flex-1 h-full flex items-center">
          <motion.label
            htmlFor={id}
            initial={false}
            animate={
              isLabelFloated
                ? { y: -13, scale: 0.76, color: error ? '#DC2626' : isFocused ? '#9E7A32' : '#7D705C' }
                : { y: 0, scale: 1, color: '#7D705C' }
            }
            transition={{ type: 'spring', stiffness: 450, damping: 24 }}
            className="absolute left-0 pointer-events-none origin-left font-medium select-none"
            style={{
              fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
              letterSpacing: isLabelFloated ? '0.04em' : 'normal',
              fontWeight: isLabelFloated ? 700 : 500,
              textShadow: isFocused ? '0 0 8px rgba(229,169,28,0.35)' : 'none',
            }}
          >
            {label}
            {required && <span className="text-[#C5A059] ml-0.5">*</span>}
          </motion.label>

          <input
            {...rest}
            id={id}
            type={actualType}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            required={required}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            placeholder={isFocused ? placeholder : ''}
            className="w-full bg-transparent border-none outline-none text-[13.5px] font-semibold text-[#14110E] tracking-wide"
            style={{
              paddingTop: isLabelFloated ? '14px' : '0px',
              fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
            }}
          />
        </div>

        {/* Password Eye Toggle with Playful Tap */}
        {showPasswordToggle && (
          <motion.button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            whileTap={{ scale: 0.88, rotate: showPassword ? -15 : 15 }}
            whileHover={{ scale: 1.1 }}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="flex-shrink-0 ml-2 p-1.5 rounded-xl hover:bg-amber-500/10 transition-colors cursor-pointer text-[#7D705C] hover:text-[#C5A059] outline-none"
          >
            <FieldIcon type={showPassword ? 'eye-off' : 'eye'} active={showPassword} />
          </motion.button>
        )}

        {/* Valid State Animated Checkmark Pop */}
        <AnimatePresence>
          {isValid && !error && (
            <motion.div
              initial={{ scale: 0, rotate: -45, opacity: 0 }}
              animate={{ scale: [0, 1.3, 1], rotate: 0, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'backOut' }}
              className="flex-shrink-0 ml-2 text-emerald-600 pointer-events-none"
              style={{ filter: 'drop-shadow(0 0 6px rgba(16,185,129,0.5))' }}
              aria-hidden="true"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Slide-in Error Badge with Bounce */}
      <AnimatePresence>
        {error && (
          <motion.div
            id={errorId}
            role="alert"
            aria-live="polite"
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            className="flex items-center gap-1.5 text-[11.5px] font-semibold text-red-600 px-1 pt-0.5"
          >
            <span aria-hidden="true">⚠</span>
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtitle / Hint Message */}
      {hint && !error && (
        <p
          id={hintId}
          className="text-[11px] font-medium text-[#7D705C] px-1 transition-colors duration-200"
        >
          {hint}
        </p>
      )}

      <style>{`
        @keyframes border-beam-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ClayInput;
