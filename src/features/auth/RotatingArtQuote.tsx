import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ART_QUOTES = [
  {
    quote: 'Art washes away from the soul the dust of everyday life.',
    author: 'Pablo Picasso',
  },
  {
    quote: 'I dream of painting and then I paint my dream.',
    author: 'Vincent van Gogh',
  },
  {
    quote: 'Art is never finished, only abandoned.',
    author: 'Leonardo da Vinci',
  },
  {
    quote: 'Color is my day-long obsession, joy and torment.',
    author: 'Claude Monet',
  },
  {
    quote: "To create one's own world in any of the arts takes courage.",
    author: "Georgia O'Keeffe",
  },
  {
    quote: 'Every artist was first an amateur.',
    author: 'Ralph Waldo Emerson',
  },
];

export const RotatingArtQuote: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ART_QUOTES.length);
    }, 5500);

    return () => clearInterval(timer);
  }, []);

  const current = ART_QUOTES[index];

  return (
    <div className="relative min-h-[48px] flex items-center border-l-2 border-[#d4af37]/60 pl-3 py-0.5 my-1.5 transition-all">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="flex flex-col"
        >
          <p className="font-serif italic text-amber-950/80 text-[12px] sm:text-[12.5px] leading-snug">
            “{current.quote}”
          </p>
          <span className="text-[10px] uppercase tracking-wider text-amber-700/80 font-bold not-italic mt-0.5">
            — {current.author}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default RotatingArtQuote;
