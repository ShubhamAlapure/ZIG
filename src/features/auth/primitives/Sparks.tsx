import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from './useReducedMotion';

export interface SparksProps {
  active?: boolean;
  count?: number;
}

export const Sparks: React.FC<SparksProps> = ({ active = false, count = 12 }) => {
  const isReduced = useReducedMotion();
  if (!active || isReduced) return null;

  const sparkItems = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * 360;
    const rad = (angle * Math.PI) / 180;
    const distance = 28 + (i % 3) * 12;
    const x = Math.cos(rad) * distance;
    const y = Math.sin(rad) * distance;
    const size = 3 + (i % 2) * 2;

    return { id: i, x, y, size, angle };
  });

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-30" aria-hidden="true">
      {sparkItems.map((spark) => (
        <motion.span
          key={spark.id}
          initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
          animate={{
            scale: [0, 1.4, 0],
            x: spark.x,
            y: spark.y,
            opacity: [1, 0.9, 0],
          }}
          transition={{
            duration: 0.55,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="absolute rounded-full"
          style={{
            width: spark.size,
            height: spark.size,
            backgroundColor: '#F5C518',
            boxShadow: '0 0 10px #F5C518, 0 0 20px #FFD233',
          }}
        />
      ))}
    </div>
  );
};

export default Sparks;

