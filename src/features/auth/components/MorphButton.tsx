import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

type ButtonStatus = 'idle' | 'loading' | 'success' | 'error';

export interface MorphButtonProps {
  type?: 'submit' | 'button';
  status?: ButtonStatus;
  /** Legacy prop — treated same as status */
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  loadingText?: string;
  className?: string;
  triggerConfettiOnSuccess?: boolean;
}

/**
 * MorphButton — Gilded Glass Atelier primary action button.
 *
 * States: idle → loading → success → error
 * - idle:    Gold gradient pill, shine sweep on hover, squish on press.
 * - loading: Orbiting dots, pill stays full-width.
 * - success: Green check draws in, brief gold flash.
 * - error:   Red pulse + CSS shake.
 *
 * Magnetic cursor follow via Framer Motion springs (skipped when prefers-reduced-motion).
 *
 * Also exported as UiverseSubmitButton for backward compatibility.
 */
export const MorphButton: React.FC<MorphButtonProps> = ({
  type = 'submit',
  status = 'idle',
  loading = false,
  disabled = false,
  onClick,
  children,
  icon,
  loadingText = 'Authenticating…',
  className = '',
  triggerConfettiOnSuccess = true,
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hasConfetti, setHasConfetti] = useState(false);

  // Resolve effective status
  const effectiveStatus: ButtonStatus = loading ? 'loading' : status;
  const isLoading = effectiveStatus === 'loading';
  const isSuccess = effectiveStatus === 'success';
  const isError = effectiveStatus === 'error';

  // Reduce motion check
  const prefersReduced =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  // Magnetic X/Y motion values
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 280, damping: 28 });
  const springY = useSpring(rawY, { stiffness: 280, damping: 28 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (prefersReduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rawX.set(((e.clientX - cx) / rect.width) * 12);
    rawY.set(((e.clientY - cy) / rect.height) * 8);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rawX.set(0);
    rawY.set(0);
  };

  // Confetti on success
  useEffect(() => {
    if (isSuccess && triggerConfettiOnSuccess && !hasConfetti) {
      setHasConfetti(true);
      try {
        confetti({
          particleCount: 50,
          spread: 55,
          origin: { y: 0.6, x: 0.3 },
          colors: ['#D98E04', '#F2CB5C', '#E5A91C', '#FAF8F5', '#171412'],
          ticks: 180,
          gravity: 1.1,
          scalar: 0.85,
        });
      } catch {
        // safe fallback in test environments
      }
    } else if (!isSuccess) {
      setHasConfetti(false);
    }
  }, [isSuccess, triggerConfettiOnSuccess, hasConfetti]);

  // Background gradient per state
  const bgGradient = isSuccess
    ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
    : isError
    ? 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)'
    : 'linear-gradient(135deg, #F2CB5C 0%, #D98E04 60%, #B87103 100%)';

  const textColor = isSuccess || isError ? '#FFFFFF' : '#171412';

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      aria-live="polite"
      layout
      style={{
        x: prefersReduced ? 0 : springX,
        y: prefersReduced ? 0 : springY,
        background: bgGradient,
        color: textColor,
        border: '1px solid rgba(255,255,255,0.55)',
        boxShadow: isSuccess
          ? '0 6px 20px -4px rgba(5,150,105,0.45)'
          : isError
          ? '0 6px 20px -4px rgba(220,38,38,0.45)'
          : '0 6px 22px -4px rgba(217,142,4,0.45), 0 2px 8px rgba(0,0,0,0.08)',
      }}
      className={[
        'relative w-full h-[52px] flex items-center justify-center gap-2',
        'rounded-full px-6 overflow-hidden cursor-pointer select-none',
        'font-bold text-[13.5px] tracking-[0.08em] uppercase',
        'font-[Outfit,_Plus_Jakarta_Sans,_sans-serif]',
        isError ? 'animate-shake' : '',
        disabled || isLoading ? 'opacity-70 cursor-not-allowed pointer-events-none' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Shine sweep overlay — only in idle state */}
      {!prefersReduced && (
        <span
          className={`auth-morph-shine ${isHovered && !isLoading && !isSuccess && !isError ? 'auth-morph-shine-active' : ''}`}
          aria-hidden="true"
        />
      )}

      {/* Inset highlight edge */}
      <span
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7)' }}
        aria-hidden="true"
      />

      {/* Content — AnimatePresence for state swaps */}
      <AnimatePresence mode="wait" initial={false}>
        {isLoading ? (
          <motion.span
            key="loading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2.5"
          >
            {/* Orbiting dots */}
            <OrbitingDots />
            <span>{loadingText}</span>
          </motion.span>
        ) : isSuccess ? (
          <motion.span
            key="success"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2"
          >
            {/* SVG check draws in */}
            <svg
              className="w-5 h-5"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              style={{
                strokeDasharray: 30,
                strokeDashoffset: 0,
                animation: 'auth-check-draw 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
              }}
            >
              <polyline points="4,10 8,14 16,6" />
            </svg>
            <span>Access Granted</span>
          </motion.span>
        ) : isError ? (
          <motion.span
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <svg
              className="w-4.5 h-4.5"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="10" cy="10" r="8" />
              <line x1="10" y1="6" x2="10" y2="11" />
              <line x1="10" y1="14" x2="10" y2="14.5" />
            </svg>
            <span>Try Again</span>
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 relative z-10"
          >
            {icon}
            <span>{children}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

/** Three orbiting dots loader */
const OrbitingDots: React.FC = () => (
  <span className="flex items-center gap-1" aria-hidden="true">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-1.5 h-1.5 rounded-full"
        style={{
          background: 'currentColor',
          animation: `auth-orb-pulse 1s ease-in-out ${i * 0.18}s infinite`,
          display: 'inline-block',
        }}
      />
    ))}
  </span>
);

/** Backward-compatible alias */
export const UiverseSubmitButton = MorphButton;

export default MorphButton;
