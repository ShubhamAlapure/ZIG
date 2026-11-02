import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from './useReducedMotion';

export interface AnimatedHeadingProps {
  children: string;
  as?: 'h1' | 'h2' | 'h3';
  subtitle?: string;
  badge?: string;
  variant?: 'daylight' | 'gallery';
  className?: string;
}

/**
 * AnimatedHeading
 * Displays a luxury fine art gallery title with character luminescence stagger,
 * gold chrome sheen, and framed gallery placard aesthetic.
 * Features European museum typography ('Cormorant Garamond' & 'Cinzel').
 */
export const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({
  children,
  as: Component = 'h2',
  subtitle,
  badge,
  variant = 'daylight',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isReduced = useReducedMotion();
  const isGallery = variant === 'gallery';

  // GSAP letter-by-letter / word luminescence flicker entrance
  useEffect(() => {
    if (isReduced || !containerRef.current) return;

    const letters = containerRef.current.querySelectorAll('.heading-char');
    if (!letters.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        letters,
        {
          opacity: 0,
          y: 12,
          filter: 'blur(4px) brightness(1.8)',
          scale: 0.92,
        },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px) brightness(1)',
          scale: 1,
          duration: 0.55,
          stagger: 0.03,
          ease: 'power3.out',
          clearProps: 'filter,scale',
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [children, isReduced]);

  const words = children.split(' ');

  return (
    <div ref={containerRef} className={`text-left select-none relative z-10 ${className}`}>
      {badge && (
        <div
          className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full mb-1.5 text-[10px] font-bold tracking-[0.24em] uppercase border shadow-xs"
          style={{
            fontFamily: "'Cinzel', serif",
            background: isGallery ? 'rgba(229,169,28,0.14)' : 'rgba(197,160,89,0.15)',
            color: isGallery ? '#F5DC98' : '#9E7A32',
            borderColor: isGallery ? 'rgba(229,169,28,0.38)' : 'rgba(197,160,89,0.32)',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#E5A91C] animate-pulse" />
          <span>{badge}</span>
        </div>
      )}

      <Component
        className="font-bold tracking-tight leading-[1.08] flex flex-wrap gap-x-2"
        style={{
          fontFamily: "'Cormorant Garamond', 'Cinzel', Georgia, serif",
          fontSize: 'clamp(1.85rem, 3.2vw, 2.55rem)',
          color: isGallery ? '#FFFDF8' : '#14110E',
          textShadow: isGallery
            ? '0 0 24px rgba(229,169,28,0.3), 0 2px 4px rgba(0,0,0,0.6)'
            : '0 1px 2px rgba(255,255,255,0.9)',
        }}
      >
        {words.map((word, wIdx) => (
          <span key={wIdx} className="inline-block whitespace-nowrap">
            {word.split('').map((char, cIdx) => (
              <span key={cIdx} className="heading-char inline-block">
                {char}
              </span>
            ))}
          </span>
        ))}
      </Component>

      {/* Decorative luxury champagne gold hairline rule with center diamond jewel */}
      <div className="flex items-center gap-1.5 mt-2 mb-1.5">
        <div
          className="h-[1.5px] w-12 rounded-full"
          style={{
            background: isGallery
              ? 'linear-gradient(90deg, #F5DC98 0%, #E5A91C 60%, transparent 100%)'
              : 'linear-gradient(90deg, #C5A059 0%, #DFBE7E 60%, transparent 100%)',
            boxShadow: isGallery ? '0 0 10px rgba(229,169,28,0.5)' : 'none',
          }}
        />
        <div
          className="w-1.5 h-1.5 rotate-45 rounded-[0.5px]"
          style={{
            background: isGallery ? '#F5DC98' : '#C5A059',
            boxShadow: isGallery ? '0 0 6px rgba(229,169,28,0.7)' : 'none',
          }}
        />
      </div>

      {subtitle && (
        <p
          className="text-[13px] tracking-wide mt-1"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: 'italic',
            fontWeight: 500,
            fontSize: '14px',
            color: isGallery ? '#D4C8B5' : '#6E6254',
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default AnimatedHeading;
