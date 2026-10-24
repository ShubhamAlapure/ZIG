import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

export const ArtworkOfTheDay: React.FC = () => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle 3D tilt
    const tiltX = ((y - centerY) / centerY) * -5;
    const tiltY = ((x - centerX) / centerX) * 5;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.18s ease-out',
      }}
      className="w-full bg-[#FAF7F0] border border-[#D98E04]/25 hover:border-[#D98E04]/50 rounded-2xl p-2.5 sm:p-3 shadow-xs hover:shadow-md transition-all duration-300 flex items-center gap-3 select-none text-left cursor-default group"
    >
      {/* Artwork Thumbnail */}
      <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden flex-shrink-0 border border-[#D98E04]/30 shadow-xs">
        <img
          src="/artwork_1.jpg"
          alt="Girl with a Pearl Earring"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            // Graceful fallback to stylish golden gradient artwork frame if image asset is unavailable
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Artwork Curatorial Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#B37400]">
          <Sparkles className="w-3 h-3 text-[#D98E04]" />
          <span>Masterpiece of the Day</span>
        </div>
        <h4
          className="text-xs sm:text-[13px] font-bold text-[#1E1A14] truncate mt-0.5"
          style={{ fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif" }}
        >
          Girl with a Pearl Earring
        </h4>
        <p className="text-[11px] text-[#7A6C58] truncate">
          Johannes Vermeer · c. 1665
        </p>
      </div>

      {/* Gallery Tag */}
      <div className="hidden xs:block flex-shrink-0">
        <span className="text-[9.5px] font-semibold text-[#8C7B65] bg-white px-2 py-1 rounded-full border border-[#E6DFCE]">
          Oil on Canvas
        </span>
      </div>
    </div>
  );
};

export default ArtworkOfTheDay;
