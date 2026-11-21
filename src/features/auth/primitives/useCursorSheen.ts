import { useRef, useCallback } from 'react';
import { useMotionValue, useSpring, MotionValue } from 'framer-motion';
import { useReducedMotion } from './useReducedMotion';

export interface CursorSheenState {
  ref: React.RefObject<HTMLDivElement>;
  rotX: MotionValue<number>;
  rotY: MotionValue<number>;
  sheenX: MotionValue<number>;
  sheenY: MotionValue<number>;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave: () => void;
}

/**
 * useCursorSheen
 * Provides 3D parallax tilt (max 4 degrees) and holographic radial sheen tracking
 * smoothed via spring dynamics. Honors prefers-reduced-motion.
 */
export function useCursorSheen(maxTiltDegrees: number = 4): CursorSheenState {
  const ref = useRef<HTMLDivElement>(null);
  const isReduced = useReducedMotion();

  const rawRotX = useMotionValue(0);
  const rawRotY = useMotionValue(0);
  const rawSheenX = useMotionValue(50);
  const rawSheenY = useMotionValue(50);

  // Smooth springs for fluid, non-jittery motion
  const rotX = useSpring(rawRotX, { stiffness: 180, damping: 22, mass: 0.6 });
  const rotY = useSpring(rawRotY, { stiffness: 180, damping: 22, mass: 0.6 });
  const sheenX = useSpring(rawSheenX, { stiffness: 220, damping: 28 });
  const sheenY = useSpring(rawSheenY, { stiffness: 220, damping: 28 });

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isReduced || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      const normX = (clientX / rect.width) * 2 - 1; // -1 to 1
      const normY = (clientY / rect.height) * 2 - 1; // -1 to 1

      // 3D parallax tilt (clamped to maxTiltDegrees)
      rawRotY.set(normX * maxTiltDegrees);
      rawRotX.set(-normY * maxTiltDegrees);

      // Percentage position for holographic specular gradient
      rawSheenX.set((clientX / rect.width) * 100);
      rawSheenY.set((clientY / rect.height) * 100);
    },
    [isReduced, maxTiltDegrees, rawRotX, rawRotY, rawSheenX, rawSheenY]
  );

  const onMouseLeave = useCallback(() => {
    rawRotX.set(0);
    rawRotY.set(0);
    rawSheenX.set(50);
    rawSheenY.set(50);
  }, [rawRotX, rawRotY, rawSheenX, rawSheenY]);

  return {
    ref,
    rotX,
    rotY,
    sheenX,
    sheenY,
    onMouseMove,
    onMouseLeave,
  };
}

