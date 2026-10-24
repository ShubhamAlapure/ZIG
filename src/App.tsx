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
    const timer = setTimeout(() => setIsTransitioning(false), 550);
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
            animate={{ opacity: 0.22, scaleX: 1 }}
            exit={{ opacity: 0, scaleX: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 pointer-events-none origin-center"
            style={{
              background:
                'radial-gradient(circle at center, rgba(197, 160, 89, 0.35) 0%, rgba(184, 144, 71, 0.15) 45%, transparent 75%)',
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Cinematic Cross-View Animation ── */}
      <AnimatePresence mode="wait">
        {isAuthenticated ? (
          <motion.div
            key="museum-view"
            initial={{ opacity: 0, scale: 0.982, x: 24, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.012, x: -20, filter: 'blur(6px)' }}
            transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full"
          >
            <MuseumView />
          </motion.div>
        ) : (
          <motion.div
            key="login-view"
            initial={{ opacity: 0, scale: 0.982, x: -24, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.012, x: 20, filter: 'blur(6px)' }}
            transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full"
          >
            <ParkLoginView />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
