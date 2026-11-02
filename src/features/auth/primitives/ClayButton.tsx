import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import { useReducedMotion } from './useReducedMotion';
import { Button3DAtmosphere } from './Button3DAtmosphere';

export interface ClayButtonProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'onAnimationStart' | 'onDrag' | 'onDragStart' | 'onDragEnd'
  > {
  children: React.ReactNode;
  status?: 'idle' | 'loading' | 'success' | 'error';
  variant?: 'primary' | 'secondary' | 'ghost';
  theme?: 'daylight' | 'gallery';
  icon?: React.ReactNode;
  loadingText?: string;
  successText?: string;
}

/**
 * ClayButton
 * Sleek luxury kinetic gold pill button:
 * - Refined luxury proportions (h-[44px] rounded-full pill)
 * - Three.js 3D golden stardust particle aura tracking cursor
 * - High-end typography ('Cinzel' with tracked uppercase luxury lettering)
 * - Liquid gold specular sheen sweep & specular glass highlights
 * - Magnetic spring cursor pull & elastic GSAP squash/stretch tap response
 * - Morph sequence: idle pill -> 3D golden orb -> confetti burst -> error shake
 */
export const ClayButton: React.FC<ClayButtonProps> = ({
  children,
  status = 'idle',
  variant = 'primary',
  icon,
  loadingText,
  successText,
  disabled,
  onClick,
  className = '',
  ...rest
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isReduced = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  // Magnetic cursor pull
  const magX = useMotionValue(0);
  const magY = useMotionValue(0);
  const springX = useSpring(magX, { stiffness: 320, damping: 22 });
  const springY = useSpring(magY, { stiffness: 320, damping: 22 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isReduced || !buttonRef.current || status === 'loading') return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    magX.set((e.clientX - centerX) * 0.18);
    magY.set((e.clientY - centerY) * 0.18);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    magX.set(0);
    magY.set(0);
  };

  // Elastic Squish & Stretch GSAP Tap
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isReduced && buttonRef.current && status !== 'loading') {
      gsap.fromTo(
        buttonRef.current,
        { scaleX: 1.05, scaleY: 0.92 },
        {
          scaleX: 1,
          scaleY: 1,
          duration: 0.45,
          ease: 'elastic.out(1.2, 0.4)',
        }
      );
    }
    onClick?.(e);
  };

  // Error Shake & Success Confetti Burst
  useEffect(() => {
    if (status === 'error' && !isReduced && buttonRef.current) {
      gsap.fromTo(
        buttonRef.current,
        { x: 0 },
        {
          x: (i) => (i % 2 === 0 ? -7 : 7),
          duration: 0.07,
          repeat: 4,
          yoyo: true,
          ease: 'power2.inOut',
          onComplete: () => {
            gsap.set(buttonRef.current, { x: 0 });
          },
        }
      );
    }

    if (status === 'success' && !isReduced) {
      try {
        confetti({
          particleCount: 55,
          spread: 70,
          origin: { y: 0.68 },
          colors: ['#FFFDF8', '#FBE6A2', '#E5A91C', '#C5A059', '#10B981'],
          disableForReducedMotion: true,
        });
      } catch {
        // Fallback safely
      }
    }
  }, [status, isReduced]);

  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';

  return (
    <div className="relative w-full group flex items-center justify-center">
      {/* ── 1. Three.js 3D Golden Particle Stardust Aura ── */}
      {isPrimary && !isReduced && (
        <Button3DAtmosphere status={status} isHovered={isHovered} />
      )}

      {/* ── 2. Ambient Velvet Champagne Backlight Halo ── */}
      <div
        className="absolute -inset-1 rounded-full pointer-events-none transition-all duration-300 opacity-70 group-hover:opacity-100 -z-10"
        style={{
          background: isPrimary
            ? status === 'loading'
              ? 'radial-gradient(circle, rgba(229,169,28,0.8) 0%, transparent 70%)'
              : 'radial-gradient(ellipse at center, rgba(229, 169, 28, 0.5) 0%, rgba(197, 160, 89, 0.22) 50%, transparent 75%)'
            : 'radial-gradient(ellipse at center, rgba(197, 160, 89, 0.16) 0%, transparent 70%)',
          filter: 'blur(10px)',
        }}
        aria-hidden="true"
      />

      {/* ── 3. Kinetic Luxury Clay Button Core ── */}
      <motion.button
        ref={buttonRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        disabled={disabled || status === 'loading'}
        whileTap={{ scale: isReduced ? 1 : 0.96 }}
        whileHover={{ scale: isReduced ? 1 : 1.015 }}
        style={{
          x: springX,
          y: springY,
          ...(isPrimary
            ? {
                background:
                  'linear-gradient(135deg, #FFFDF8 0%, #F5E5C0 14%, #DFBE7E 38%, #C5A059 68%, #8C6A28 100%)',
                boxShadow:
                  '0 8px 22px -3px rgba(197, 160, 89, 0.45), 0 3px 8px -1px rgba(24, 18, 12, 0.1), inset 0 2px 2px 0 rgba(255, 255, 255, 0.95), inset 0 -2px 3px 0 rgba(140, 102, 30, 0.4)',
                color: '#14110E',
                border: '1px solid rgba(255, 255, 255, 0.85)',
              }
            : isSecondary
            ? {
                background:
                  'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(253, 250, 245, 0.72) 100%)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                border: '1px solid rgba(255, 255, 255, 0.95)',
                boxShadow:
                  '0 4px 14px -2px rgba(24, 18, 12, 0.05), inset 0 1.5px 1.5px 0 rgba(255, 255, 255, 0.95), inset 0 -1.5px 2px 0 rgba(197, 160, 89, 0.1)',
                color: '#14110E',
              }
            : {
                background: 'transparent',
                color: '#9E7A32',
              }),
        }}
        className={`clay-button-root relative group overflow-hidden select-none outline-none focus-visible:ring-3 focus-visible:ring-[#E5A91C] cursor-pointer flex items-center justify-center transition-all duration-300 ${
          status === 'loading'
            ? 'w-11 h-11 rounded-full mx-auto p-0'
            : 'w-full h-[44px] sm:h-[46px] rounded-full px-5 text-[12px] sm:text-[12.5px]'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        {...rest}
      >
        {/* Continuous Liquid Gold Shimmer Streak */}
        {isPrimary && status !== 'loading' && !isReduced && (
          <span
            className="absolute inset-0 pointer-events-none opacity-45 mix-blend-overlay overflow-hidden rounded-full"
            aria-hidden="true"
          >
            <span className="clay-liquid-shimmer absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white to-transparent" />
          </span>
        )}

        {/* Loading Spinner Orb with Glowing Celestial Rings */}
        {status === 'loading' && (
          <motion.div
            initial={{ rotate: 0, scale: 0.8 }}
            animate={{ rotate: 360, scale: 1 }}
            transition={{ repeat: Infinity, duration: 0.75, ease: 'linear' }}
            className="w-6 h-6 rounded-full border-2 border-white/30 border-t-white flex items-center justify-center shadow-lg relative"
            aria-label={loadingText || 'Verifying...'}
          >
            <span className="absolute inset-0 rounded-full border border-amber-200/50 animate-ping opacity-60" />
          </motion.div>
        )}

        {/* Success Burst */}
        {status === 'success' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.25, 1] }}
            transition={{ duration: 0.35, ease: 'backOut' }}
            className="flex items-center justify-center gap-2 text-emerald-900 font-bold"
            style={{ fontFamily: "'Cinzel', 'Plus Jakarta Sans', serif", letterSpacing: '0.12em' }}
          >
            <svg
              className="w-4.5 h-4.5 text-emerald-700"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {successText && <span className="uppercase text-[11px]">{successText}</span>}
          </motion.div>
        )}

        {/* Idle Luxury Button Typography & Icon */}
        {status !== 'loading' && status !== 'success' && (
          <span
            className="relative z-10 flex items-center justify-center gap-2 font-bold"
            style={{
              fontFamily: isPrimary
                ? "'Cinzel', 'Plus Jakarta Sans', serif"
                : "'Plus Jakarta Sans', sans-serif",
              letterSpacing: isPrimary ? '0.16em' : '0.02em',
              textTransform: isPrimary ? 'uppercase' : 'none',
              textShadow: isPrimary ? '0 1px 1px rgba(255,255,255,0.7)' : 'none',
            }}
          >
            {icon && (
              <span className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
                {icon}
              </span>
            )}
            <span>{children}</span>
          </span>
        )}

        <style>{`
          .clay-liquid-shimmer {
            animation: clayLiquidShimmerAnim 3.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          }
          @keyframes clayLiquidShimmerAnim {
            0% { transform: translateX(0%) skewX(-20deg); }
            45% { transform: translateX(260%) skewX(-20deg); }
            100% { transform: translateX(260%) skewX(-20deg); }
          }
        `}</style>
      </motion.button>
    </div>
  );
};

export default ClayButton;
