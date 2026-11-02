import React, { useRef, useState, useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Loader2 } from 'lucide-react';
import gsap from 'gsap';
import { Sparks } from './Sparks';

export interface PillButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'ghost';
  status?: 'idle' | 'loading' | 'success' | 'error';
  disabled?: boolean;
  icon?: React.ReactNode;
  loadingText?: string;
  successText?: string;
  className?: string;
  ariaLabel?: string;
}

export const PillButton: React.FC<PillButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  status = 'idle',
  disabled = false,
  icon,
  loadingText,
  successText,
  className = '',
  ariaLabel,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isLoading = status === 'loading';
  const isSuccess = status === 'success';
  const isError = status === 'error';

  // ── Magnetic cursor (primary only) ──────────────────────────────────────
  useEffect(() => {
    if (!isPrimary || !buttonRef.current) return;
    const btn = buttonRef.current;

    const onMove = (e: MouseEvent) => {
      const r = btn.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const d = Math.hypot(dx, dy);
      if (d < 60) {
        gsap.to(btn, { x: dx * 0.12, y: dy * 0.08, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
      } else {
        gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.45)', overwrite: 'auto' });
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [isPrimary]);

  // ── Idle shine sweep (primary) ───────────────────────────────────────────
  useEffect(() => {
    if (!isPrimary || !sweepRef.current) return;
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 4, delay: 1.2 });
    tl.fromTo(
      sweepRef.current,
      { x: '-170%' },
      { x: '270%', duration: 1.1, ease: 'power1.inOut' }
    );
    return () => { tl.kill(); };
  }, [isPrimary]);

  // ── Error shake ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isError || !buttonRef.current) return;
    gsap.timeline()
      .to(buttonRef.current, { x: -7, duration: 0.055, ease: 'power2.out' })
      .to(buttonRef.current, { x: 7, duration: 0.055, ease: 'power2.inOut', repeat: 4, yoyo: true })
      .to(buttonRef.current, { x: 0, duration: 0.18, ease: 'elastic.out(1, 0.4)' });
  }, [isError]);

  return (
    <motion.button
      ref={buttonRef}
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      whileTap={!disabled ? { scale: 0.955, transition: { duration: 0.07 } } : {}}
      whileHover={!disabled && !isLoading
        ? isPrimary ? { scale: 1.018 } : isSecondary ? { scale: 1.012 } : {}
        : {}
      }
      aria-label={ariaLabel}
      className={`
        relative w-full rounded-full flex items-center justify-center
        h-[42px] sm:h-[48px] min-h-[42px] sm:min-h-[48px] px-4 sm:px-5.5
        text-xs sm:text-sm font-bold select-none overflow-hidden
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A70E] focus-visible:ring-offset-1
        cursor-pointer transition-shadow duration-200
        ${isPrimary
          ? 'bg-[#F5C518] text-[#0A0803] shadow-[0_4px_18px_rgba(245,197,24,0.28)] hover:shadow-[0_6px_26px_rgba(245,197,24,0.40)]'
          : isSecondary
            ? 'bg-white border border-[rgba(212,167,14,0.32)] text-[#281E0B] shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:border-[#C5A059]/55 hover:bg-[#FFFEF9] hover:shadow-[0_4px_14px_rgba(197,155,39,0.10)]'
            : 'bg-transparent text-[#6E6352] hover:text-[#1A1410]'
        }
        ${disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}
        ${className}
      `}
      style={{ willChange: 'transform' }}
    >
      {/* ── Primary hover sweep (fills from left) ── */}
      {isPrimary && (
        <motion.div
          animate={{ x: isHovered ? '0%' : '-106%' }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, #FFE96B 0%, #F5C518 50%, #DFA010 100%)',
            borderRadius: 'inherit',
          }}
        />
      )}

      {/* ── Secondary hover soft tint ── */}
      {isSecondary && (
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.22 }}
          className="absolute inset-0 pointer-events-none rounded-full"
          style={{ background: 'rgba(245,197,24,0.06)' }}
        />
      )}

      {/* ── Idle shine sweep ── */}
      {isPrimary && (
        <div
          ref={sweepRef}
          className="absolute inset-y-0 w-12 pointer-events-none z-10"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
            transform: 'skewX(-18deg) translateX(-170%)',
            willChange: 'transform',
          }}
        />
      )}

      {/* ── Success sparks ── */}
      <Sparks active={isSuccess} count={14} />

      {/* ── Content ── */}
      <div
        className="relative z-10 flex items-center justify-center"
        style={{
          fontFamily: "'Tenor Sans', 'Cinzel', 'Plus Jakarta Sans', sans-serif",
          fontSize: isPrimary ? '12.5px' : '12px',
          fontWeight: 700,
          letterSpacing: '0.13em',
          textTransform: 'uppercase',
          gap: '8px',
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.75, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.75, y: -6 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-2.5"
            >
              {/* Morphing dots → spinner feel */}
              <div className="flex gap-[5px] items-end">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="rounded-full bg-current"
                    animate={{
                      height: ['6px', '12px', '6px'],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 0.65,
                      repeat: Infinity,
                      delay: i * 0.13,
                      ease: 'easeInOut',
                    }}
                    style={{ width: '5px', display: 'inline-block' }}
                  />
                ))}
              </div>
              {loadingText && (
                <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'none' }}>
                  {loadingText}
                </span>
              )}
            </motion.div>

          ) : isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.4, rotate: -30 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.4 }}
              transition={{ type: 'spring', stiffness: 600, damping: 22 }}
              className="flex items-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <motion.path
                  d="M20 6L9 17L4 12"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                />
              </svg>
              <span>{successText || 'Done!'}</span>
            </motion.div>

          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16 }}
              className="flex items-center gap-2"
            >
              {icon && <span className="flex-shrink-0">{icon}</span>}
              <span className="truncate">{children}</span>
              {!icon && isPrimary && (
                <motion.span
                  className="flex-shrink-0"
                  animate={{
                    x: isHovered ? 5 : 0,
                    opacity: isHovered ? 1 : 0.55,
                  }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </motion.span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  );
};

export default PillButton;
