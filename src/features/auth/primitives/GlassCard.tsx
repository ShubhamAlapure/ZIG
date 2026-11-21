import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useReducedMotion } from './useReducedMotion';

export interface GlassCardProps {
  children: React.ReactNode;
  variant?: 'daylight' | 'gallery';
  className?: string;
  id?: string;
  showSparkles?: boolean;
}

/**
 * GlassCard
 * Lightweight, clean container that does NOT darken or cloud the background.
 * Keeps the original page aesthetic while providing smooth subtle entrance and layout.
 */
export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  variant = 'daylight',
  className = '',
  id = 'auth-form-card',
}) => {
  const isReduced = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReduced || !cardRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
      );
    }, cardRef);

    return () => ctx.revert();
  }, [isReduced]);

  return (
    <div
      id={id}
      ref={cardRef}
      className={`relative w-full rounded-2xl select-text transition-all duration-300 ${className}`}
    >
      {/* Clean, minimal container without heavy dark backdrops */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
};

export default GlassCard;
