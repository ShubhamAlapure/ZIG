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
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const current = ART_QUOTES[index];

  return (
    <div className="relative min-h-[44px] flex items-center bg-[#FAF8F5] border border-[#C5A059]/20 rounded-xl px-3 py-2 my-2 transition-all">
      <span className="text-[#C5A059] text-xs mr-2 flex-shrink-0 select-none">✦</span>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -3 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row sm:items-center sm:gap-2 text-left overflow-hidden"
        >
          <p className="text-[11.5px] text-[#4A4237] font-medium tracking-tight italic truncate">
            “{current.quote}”
          </p>
          <span className="text-[10px] uppercase tracking-wider text-[#9E7A32] font-bold not-italic flex-shrink-0">
            — {current.author}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default RotatingArtQuote;
