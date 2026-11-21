import React, { useEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

interface SparkleParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

export interface SparklesProps {
  count?: number;
  variant?: 'daylight' | 'gallery';
  className?: string;
}

/**
 * Sparkles
 * Renders subtle floating particle motes and faint retro-arcade gold glints.
 * Automatically halts when tab is hidden or when reduced motion is preferred.
 */
export const Sparkles: React.FC<SparklesProps> = ({
  count = 14,
  variant = 'daylight',
  className = '',
}) => {
  const isReduced = useReducedMotion();
  const [particles, setParticles] = useState<SparkleParticle[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  // Pause when document is hidden to conserve GPU/CPU
  useEffect(() => {
    const handleVisibility = () => {
      setIsVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  useEffect(() => {
    if (isReduced) {
      setParticles([]);
      return;
    }

    const generated: SparkleParticle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 2,
      duration: Math.random() * 6 + 4,
      delay: Math.random() * 3,
      opacity: Math.random() * 0.45 + 0.2,
    }));
    setParticles(generated);
  }, [count, isReduced]);

  if (isReduced || !isVisible || particles.length === 0) return null;

  const isGallery = variant === 'gallery';
  const glowColor = isGallery ? 'rgba(245, 197, 66, 0.7)' : 'rgba(197, 160, 89, 0.55)';

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: isGallery
              ? 'radial-gradient(circle, #FFE49E 0%, #E5A91C 70%, transparent 100%)'
              : 'radial-gradient(circle, #FFF5D6 0%, #C5A059 70%, transparent 100%)',
            boxShadow: `0 0 ${p.size * 2}px ${glowColor}`,
            animation: `sparkle-float ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
            opacity: p.opacity,
          }}
        />
      ))}
      <style>{`
        @keyframes sparkle-float {
          0% {
            transform: translateY(0) scale(0.85);
            opacity: 0.15;
          }
          50% {
            transform: translateY(-14px) translateX(6px) scale(1.2);
            opacity: 0.75;
          }
          100% {
            transform: translateY(-28px) translateX(-4px) scale(0.85);
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
};

