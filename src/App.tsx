import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/app/store';
import { ParkLoginView } from './components/ParkLoginView';
import { MuseumView } from './components/MuseumView';
import { AnimatePresence, motion } from 'framer-motion';

export const App: React.FC = () => {
  const { isAuthenticated } = useAppStore();
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Trigger brief luxury golden ambient veil on view switch
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 500);
    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  return (
    <div className="w-full h-full min-h-screen bg-[#0D0A08] text-[#F5F0E8] overflow-hidden relative">
      {/* ── Luxury Golden Archway Light Veil between Views ── */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            key="golden-veil"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 0.24, scaleX: 1 }}
            exit={{ opacity: 0, scaleX: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 pointer-events-none origin-center"
            style={{
              background:
                'radial-gradient(circle at center, rgba(197, 160, 89, 0.35) 0%, rgba(184, 144, 71, 0.15) 45%, transparent 75%)',
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Seamless Instant 0ms View Switching (Both 3D scenes preloaded in memory) ── */}
      {/* 1. Museum View (Join Us & 3D Master Hall) */}
      <div
        className={`absolute inset-0 w-full h-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isAuthenticated
            ? 'opacity-100 pointer-events-auto z-20 translate-x-0 scale-100 filter-none'
            : 'opacity-0 pointer-events-none z-0 translate-x-6 scale-[0.985] blur-xs'
        }`}
        aria-hidden={!isAuthenticated}
      >
        <MuseumView isActive={isAuthenticated} />
      </div>

      {/* 2. Park Login View (Sign In & 3D Park) */}
      <div
        className={`absolute inset-0 w-full h-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          !isAuthenticated
            ? 'opacity-100 pointer-events-auto z-20 translate-x-0 scale-100 filter-none'
            : 'opacity-0 pointer-events-none z-0 -translate-x-6 scale-[0.985] blur-xs'
        }`}
        aria-hidden={isAuthenticated}
      >
        <ParkLoginView isActive={!isAuthenticated} />
      </div>
    </div>
  );
};

export default App;
