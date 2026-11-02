import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ART_QUOTES = [
  { quote: 'Art washes away from the soul the dust of everyday life.', author: 'Pablo Picasso' },
  { quote: 'I dream of painting and then I paint my dream.', author: 'Vincent van Gogh' },
  { quote: 'Art is never finished, only abandoned.', author: 'Leonardo da Vinci' },
  { quote: 'Color is my day-long obsession, joy and torment.', author: 'Claude Monet' },
  { quote: "To create one's own world in any of the arts takes courage.", author: "Georgia O'Keeffe" },
  { quote: 'Every artist was first an amateur.', author: 'Ralph Waldo Emerson' },
];

export const RotatingArtQuote: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((p) => (p + 1) % ART_QUOTES.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const current = ART_QUOTES[index];

  return (
    <div className="relative flex items-start gap-2.5 px-3.5 py-2.5 rounded-[12px] my-2 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(255,252,240,0.85) 0%, rgba(255,248,220,0.65) 100%)',
        border: '1px solid rgba(212,167,14,0.22)',
        boxShadow: '0 2px 12px rgba(200,160,50,0.07), inset 0 1px 0 rgba(255,255,255,0.9)',
      }}
    >
      {/* Decorative left gold bar */}
      <motion.div
        animate={{ scaleY: [0.7, 1, 0.7] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="w-[2px] self-stretch rounded-full flex-shrink-0"
        style={{ background: 'linear-gradient(to bottom, #F5C518, #C59B27)' }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-0.5 min-w-0"
        >
          <p
            className="text-[13px] sm:text-[13.5px] text-[#22170B] font-medium leading-snug"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            "{current.quote}"
          </p>
          <span
            className="text-[10px] uppercase tracking-[0.14em] text-[#7C5E1A] font-semibold not-italic"
            style={{ fontFamily: "'Tenor Sans', sans-serif" }}
          >
            — {current.author}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* Progress dots */}
      <div className="absolute bottom-1.5 right-2.5 flex gap-1">
        {ART_QUOTES.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => setIndex(i)}
            animate={{ scale: i === index ? 1.3 : 1, opacity: i === index ? 1 : 0.35 }}
            transition={{ duration: 0.2 }}
            className="w-1 h-1 rounded-full bg-[#C59B27] cursor-pointer"
            aria-label={`Quote ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default RotatingArtQuote;
