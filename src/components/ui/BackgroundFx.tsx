import React from 'react';
import { motion } from 'framer-motion';
import { SpectralDrape } from './SpectralDrape';
import { useCursorGlow } from '@/features/auth/primitives/useCursorGlow';

export interface BackgroundFxProps {
  mood?: 'park' | 'museum';
  isFocused?: boolean;
}

export const BackgroundFx: React.FC<BackgroundFxProps> = ({
  mood = 'park',
  isFocused = false,
}) => {
  const { glowX, glowY } = useCursorGlow();

  return (
    <div
      className="fixed inset-0 w-screen h-screen z-0 pointer-events-none select-none overflow-hidden"
      style={{
        backgroundColor: '#FCFBF8',
      }}
      aria-hidden="true"
    >
      {/* 1. 3D WebGL Spectral Drape of golden dots folding over white ground */}
      <div className="absolute inset-0 w-full h-full z-0">
        <SpectralDrape mood={mood} isFocused={isFocused} />
      </div>

      {/* 2. Interactive Cursor-Follow Soft Glow */}
      <motion.div
        className="absolute rounded-full pointer-events-none z-1"
        style={{
          x: glowX,
          y: glowY,
          width: 380,
          height: 380,
          marginLeft: -190,
          marginTop: -190,
          background:
            'radial-gradient(circle, rgba(229, 169, 28, 0.05) 0%, rgba(212, 175, 55, 0.01) 45%, transparent 70%)',
          filter: 'blur(24px)',
        }}
      />

      {/* 3. Soft Radial Vignette — kept very subtle so it doesn't mask form text */}
      <div
        className="absolute inset-0 z-2 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 85% 85% at 50% 50%, transparent 55%, rgba(245, 240, 230, 0.25) 100%)',
        }}
      />
    </div>
  );
};

export default BackgroundFx;
