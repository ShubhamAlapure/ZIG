import { useEffect } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';
import { useReducedMotion } from './useReducedMotion';

export function useCursorGlow() {
  const isReduced = useReducedMotion();
  const rawX = useMotionValue(-500);
  const rawY = useMotionValue(-500);

  const glowX = useSpring(rawX, { stiffness: 140, damping: 20 });
  const glowY = useSpring(rawY, { stiffness: 140, damping: 20 });

  useEffect(() => {
    if (isReduced) return;

    const handleMouseMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        rawX.set(e.touches[0].clientX);
        rawY.set(e.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchMove);
    };
  }, [isReduced, rawX, rawY]);

  return { glowX, glowY, isReduced };
}

export default useCursorGlow;

