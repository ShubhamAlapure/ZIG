import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

export interface SplitHeadingProps {
  children: React.ReactNode;
  badge?: string;
  subtitle?: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
}

export const SplitHeading: React.FC<SplitHeadingProps> = ({
  children,
  badge,
  subtitle,
  className = '',
  as: Component = 'h1',
}) => {
  const textContent = typeof children === 'string' ? children : '';
  const words = textContent ? textContent.split(' ') : [];
  const sparkRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  // GSAP sparkle wobble
  useEffect(() => {
    if (!sparkRef.current) return;
    gsap.to(sparkRef.current, {
      rotate: 360,
      duration: 18,
      repeat: -1,
      ease: 'none',
    });
    gsap.to(sparkRef.current, {
      scale: 1.18,
      duration: 2.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }, []);

  // Subtle cursor parallax on subtitle
  useEffect(() => {
    if (!subtitleRef.current) return;
    const el = subtitleRef.current;
    const handleMouse = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      gsap.to(el, {
        x: dx * 4,
        y: dy * 2,
        duration: 0.8,
        ease: 'power2.out',
      });
    };
    window.addEventListener('mousemove', handleMouse, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  return (
    <div className={`select-none text-left relative ${className}`}>
      {/* Decorative Top Row with optional Badge & Sparkle */}
      <div className={`flex items-center ${badge ? 'justify-between' : 'justify-end'} mb-1 sm:mb-2`}>
        {badge && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border border-[#D4A70E]/35 bg-[#FFFBF0] shadow-[0_2px_8px_rgba(212,167,14,0.12)]"
          >
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-[#D4A70E]"
            />
            <span
              className="text-[9.5px] font-bold uppercase tracking-[0.24em] text-[#9E7A32]"
              style={{ fontFamily: "'Cinzel', 'Plus Jakarta Sans', serif" }}
            >
              {badge}
            </span>
          </motion.div>
        )}

        {/* Gold Sparkle Emblem */}
        <div
          ref={sparkRef}
          className="w-6 h-6 flex items-center justify-center select-none"
          aria-hidden="true"
          style={{ willChange: 'transform' }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 1 L10.8 8.5 L18 10 L10.8 11.5 L10 19 L9.2 11.5 L2 10 L9.2 8.5 Z"
              fill="#C59B27"
              opacity="0.9"
            />
          </svg>
        </div>
      </div>

      {/* Kinetic Headline — DM Serif Display, character-level reveal */}
      <Component
        className="leading-[1.05] flex flex-wrap gap-x-3 py-0.5 overflow-hidden"
        style={{
          fontFamily: "'DM Serif Display', 'Bodoni Moda', 'Italiana', 'Playfair Display', Georgia, serif",
          fontSize: 'clamp(23px, 5.2vw, 38px)',
          fontWeight: 400,
          letterSpacing: '-0.01em',
          color: '#140F0A',
        }}
      >
        {words.length > 0
          ? words.map((word, i) => (
              <span key={i} className="inline-block overflow-hidden pb-0.5">
                <motion.span
                  initial={{ y: '110%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  transition={{
                    duration: 0.7,
                    delay: i * 0.11,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="inline-block"
                >
                  {word}
                </motion.span>
              </span>
            ))
          : children}
      </Component>

      {/* Animated golden rule under heading */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="origin-left h-[1.5px] w-12 bg-gradient-to-r from-[#D4A70E] to-[#F5C518] mt-2 mb-1 rounded-full"
      />

      {/* Subtitle: Crisp, readable editorial microcopy */}
      {subtitle && (
        <motion.p
          ref={subtitleRef}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.28 }}
          className="text-[13px] sm:text-[13.5px] text-[#5C4A33] mt-1.5 font-normal leading-normal tracking-normal"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            willChange: 'transform',
          }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};

export default SplitHeading;
