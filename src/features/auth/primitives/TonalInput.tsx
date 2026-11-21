import React, { useState, useRef, useId, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, Mail, Lock, User, Phone, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';

export interface TonalInputProps {
  id?: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'tel';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: 'mail' | 'lock' | 'user' | 'phone';
  showPasswordToggle?: boolean;
  isValid?: boolean;
  error?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  minLength?: number;
  className?: string;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const ICONS = {
  mail: Mail,
  lock: Lock,
  user: User,
  phone: Phone,
};

export const TonalInput: React.FC<TonalInputProps> = ({
  id: propId,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  icon,
  showPasswordToggle = false,
  isValid = false,
  error,
  hint,
  required = false,
  disabled = false,
  autoComplete,
  minLength,
  className = '',
  onFocus,
  onBlur,
}) => {
  const generatedId = useId();
  const inputId = propId || generatedId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const wellRef = useRef<HTMLDivElement>(null);
  const glintRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);
  const prevIsValid = useRef(false);
  const prevError = useRef<string | undefined>(undefined);

  const hasValue = value.length > 0;
  const isFloating = isFocused || hasValue;
  const actualType = type === 'password' && showPassword ? 'text' : type;

  const IconComponent = icon ? ICONS[icon] : null;

  // ── FOCUS: glint sweep + scale spring ──────────────────────────────────────
  useEffect(() => {
    const glint = glintRef.current;
    const well = wellRef.current;
    if (!well) return;

    if (isFocused) {
      // Border scale spring up
      gsap.fromTo(well,
        { scale: 0.997 },
        { scale: 1, duration: 0.35, ease: 'back.out(2.5)' }
      );
      // Glint across the well
      if (glint) {
        gsap.set(glint, { x: '-130%', opacity: 0 });
        gsap.to(glint, { x: '220%', opacity: 0.85, duration: 0.6, ease: 'power2.out', delay: 0.05 });
      }
    } else {
      gsap.to(well, { scale: 1, duration: 0.2, ease: 'power2.in' });
    }
  }, [isFocused]);

  // ── VALID: celebratory pop ─────────────────────────────────────────────────
  useEffect(() => {
    if (isValid && !prevIsValid.current && wellRef.current) {
      gsap.timeline()
        .to(wellRef.current, { scale: 1.02, duration: 0.13, ease: 'back.out(3)' })
        .to(wellRef.current, { scale: 1, duration: 0.22, ease: 'elastic.out(1, 0.5)' });
    }
    prevIsValid.current = isValid;
  }, [isValid]);

  // ── ERROR: jelly wobble ────────────────────────────────────────────────────
  useEffect(() => {
    if (error && error !== prevError.current && wellRef.current) {
      gsap.timeline()
        .to(wellRef.current, { x: -5, duration: 0.055, ease: 'power2.out' })
        .to(wellRef.current, { x: 5, duration: 0.055, ease: 'power2.inOut', repeat: 4, yoyo: true })
        .to(wellRef.current, { x: 0, duration: 0.14, ease: 'elastic.out(1, 0.4)' });
    }
    prevError.current = error;
  }, [error]);

  // ── KEYSTROKE: micro-pulse + ripple ───────────────────────────────────────
  const handleKeyDown = useCallback(() => {
    const well = wellRef.current;
    const ripple = rippleRef.current;
    if (well) {
      gsap.to(well, {
        scale: 1.006,
        duration: 0.05,
        yoyo: true,
        repeat: 1,
        ease: 'power1.out',
        overwrite: 'auto',
      });
    }
    // Subtle background ripple shimmer
    if (ripple) {
      gsap.fromTo(ripple,
        { opacity: 0.18, scale: 0.95 },
        { opacity: 0, scale: 1.04, duration: 0.35, ease: 'power2.out' }
      );
    }
  }, []);

  return (
    <div className={`w-full text-left relative flex flex-col gap-1 ${className}`}>

      {/* Tonal Well */}
      <motion.div
        ref={wellRef}
        layoutId={undefined}
        whileHover={!disabled ? { y: -1.5, scale: 1.004 } : {}}
        transition={{ type: 'spring', stiffness: 500, damping: 26 }}
        className={`
          relative w-full rounded-[12px] sm:rounded-[14px] flex items-center px-3.5 sm:px-4
          h-[46px] sm:h-[52px] min-h-[46px] sm:min-h-[52px]
          transition-[border-color,background-color,box-shadow] duration-200
          backdrop-blur-sm overflow-hidden
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text'}
          ${isFocused
            ? 'bg-white border-[1.5px] border-[#D4A70E] shadow-[0_0_0_3.5px_rgba(212,167,14,0.13),0_4px_22px_rgba(212,167,14,0.16)]'
            : error
              ? 'bg-[#FFF7F7] border-[1.5px] border-red-400/80 shadow-[0_0_0_3px_rgba(248,113,113,0.12)]'
              : isValid
                ? 'bg-white border-[1.5px] border-emerald-400/60 shadow-[0_2px_14px_rgba(74,222,128,0.10)]'
                : 'bg-white/85 border border-[rgba(212,167,14,0.24)] shadow-[0_2px_10px_rgba(200,160,50,0.04),inset_0_1px_0_rgba(255,255,255,0.92)] hover:border-[rgba(212,167,14,0.45)] hover:bg-white/95 hover:shadow-[0_3px_16px_rgba(197,155,39,0.10)]'
          }
        `}
        onClick={() => {
          if (!disabled) {
            document.getElementById(inputId)?.focus();
          }
        }}
        style={{ willChange: 'transform' }}
      >
        {/* Top glass sheen */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none z-10" />

        {/* Glint sweep */}
        <div
          ref={glintRef}
          className="absolute inset-y-0 w-16 pointer-events-none z-10"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.72) 50%, transparent 100%)',
            transform: 'skewX(-14deg) translateX(-130%)',
            willChange: 'transform, opacity',
          }}
        />

        {/* Keystroke ripple shimmer */}
        <div
          ref={rippleRef}
          className="absolute inset-0 pointer-events-none z-0 rounded-[14px]"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(245,197,24,0.12) 0%, transparent 75%)',
            opacity: 0,
            willChange: 'opacity, transform',
          }}
        />

        {/* Left icon */}
        {IconComponent && (
          <motion.div
            animate={{
              color: isFocused ? '#B8922A' : hasValue ? '#9E7A32' : '#C2AD94',
              scale: isFocused ? 1.12 : 1,
              rotate: isFocused ? [0, -8, 8, 0] : 0,
            }}
            transition={isFocused
              ? { duration: 0.35, ease: 'easeOut', rotate: { duration: 0.4, ease: 'easeInOut' } }
              : { duration: 0.2 }
            }
            className="mr-3 flex-shrink-0 pointer-events-none"
            aria-hidden="true"
          >
            <IconComponent className="w-[15px] h-[15px]" />
          </motion.div>
        )}

        {/* Label + Input stack */}
        <div className="relative flex-1 h-full overflow-hidden flex flex-col justify-center">
          {/* Floating Label */}
          <motion.label
            htmlFor={inputId}
            initial={false}
            animate={{
              y: isFloating ? '-135%' : '-50%',
              scale: isFloating ? 0.72 : 1,
              color: isFocused
                ? '#B8922A'
                : isFloating
                  ? '#8A7358'
                  : '#8C7760',
            }}
            transition={{ duration: 0.20, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 pointer-events-none select-none leading-none whitespace-nowrap"
            style={{
              top: '50%',
              transformOrigin: 'left center',
              fontFamily: "'Tenor Sans', 'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
              fontSize: '12px',
              letterSpacing: '0.065em',
              textTransform: 'uppercase',
            }}
          >
            {label}
            {required && (
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                className="ml-0.5 text-[#C5A059]"
              >
                *
              </motion.span>
            )}
          </motion.label>

          {/* Input */}
          <input
            id={inputId}
            type={actualType}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={(e) => { setIsFocused(true); onFocus?.(e); }}
            onBlur={(e) => { setIsFocused(false); onBlur?.(e); }}
            placeholder={isFloating ? placeholder : undefined}
            disabled={disabled}
            required={required}
            autoComplete={autoComplete}
            minLength={minLength}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            className="w-full bg-transparent border-none outline-none text-[#181410] tracking-wide placeholder:text-[#B5A28A]/50 placeholder:text-[11.5px] placeholder:italic"
            style={{
              paddingTop: isFloating ? '15px' : '0px',
              paddingBottom: isFloating ? '1px' : '0px',
              caretColor: '#D4A70E',
              fontSize: '13.5px',
              fontWeight: 500,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              transition: 'padding-top 0.18s ease, padding-bottom 0.18s ease',
            }}
          />
        </div>

        {/* Trailing area */}
        <div className="flex items-center gap-1 ml-1.5 flex-shrink-0 z-10">
          <AnimatePresence mode="wait">
            {error ? (
              <motion.div
                key="error-icon"
                initial={{ scale: 0, opacity: 0, rotate: -20 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 600, damping: 20 }}
                className="text-red-500"
                aria-hidden="true"
              >
                <AlertCircle className="w-[15px] h-[15px]" />
              </motion.div>
            ) : isValid ? (
              <motion.div
                key="valid-icon"
                initial={{ scale: 0, opacity: 0, rotate: -40 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 700, damping: 20 }}
                className="text-emerald-500"
                aria-label="Valid"
              >
                <svg className="w-[15px] h-[15px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <motion.path
                    d="M20 6L9 17L4 12"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  />
                </svg>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* Password toggle */}
          {showPasswordToggle && type === 'password' && (
            <motion.button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              whileHover={{ scale: 1.2, color: '#5C4A32' }}
              whileTap={{ scale: 0.85, rotate: 15 }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="p-1 rounded-full text-[#A89278] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C5A059] cursor-pointer"
              style={{ color: isFocused ? '#9E7A32' : '#A89278' }}
            >
              {showPassword
                ? <EyeOff className="w-[15px] h-[15px]" />
                : <Eye className="w-[15px] h-[15px]" />
              }
            </motion.button>
          )}
        </div>

        {/* Bottom focus bar — expands from center */}
        <motion.div
          initial={false}
          animate={{ scaleX: isFocused ? 1 : 0, opacity: isFocused ? 1 : 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-[#F5C518]/40 via-[#F5C518] to-[#F5C518]/40 origin-center pointer-events-none rounded-full"
        />
      </motion.div>

      {/* Inline feedback */}
      <AnimatePresence>
        {error ? (
          <motion.p
            id={errorId}
            role="alert"
            key="err"
            initial={{ opacity: 0, y: -3, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -3, height: 0 }}
            transition={{ duration: 0.18 }}
            className="text-[11.5px] font-semibold text-red-700 pl-3 flex items-center gap-1.5"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <span aria-hidden="true" className="font-bold">⚠</span>
            <span>{error}</span>
          </motion.p>
        ) : hint ? (
          <motion.p
            id={hintId}
            key="hint"
            initial={{ opacity: 0, y: -3, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -3, height: 0 }}
            transition={{ duration: 0.18 }}
            className="text-[11px] font-medium text-[#6B5A47] pl-3"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {hint}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default TonalInput;
