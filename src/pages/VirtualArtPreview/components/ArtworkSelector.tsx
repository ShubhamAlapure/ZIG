import React from 'react';
import { Search, Check, Sparkles, SlidersHorizontal, Info } from 'lucide-react';
import { VirtualArtwork } from '../services/artworkService';

interface ArtworkSelectorProps {
  artworks: VirtualArtwork[];
  selectedArtwork: VirtualArtwork;
  onSelectArtwork: (artwork: VirtualArtwork) => void;
  categories: string[];
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const ArtworkSelector: React.FC<ArtworkSelectorProps> = ({
  artworks,
  selectedArtwork,
  onSelectArtwork,
  categories,
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="flex flex-col h-full bg-[#14110E] border-r border-[#C9A94F]/20 text-[#F5F0E8] overflow-hidden">
      {/* Header and Search */}
      <div className="p-4 border-b border-[#C9A94F]/15 space-y-3 bg-[#0D0A08]/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={15} className="text-[#C9A94F]" />
            <h2
              className="text-lg font-medium text-[#F5F0E8] tracking-wide"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Permanent Collection
            </h2>
          </div>
          <span className="text-[11px] text-[#C9A94F]/80 px-2 py-0.5 rounded-full bg-[#C9A94F]/10 border border-[#C9A94F]/20">
            {artworks.length} Masterpieces
          </span>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C9A94F]/70" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title, artist, or style…"
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-[#1B1713] border border-[#C9A94F]/25 text-[#F5F0E8] placeholder-[#F5F0E8]/40 focus:outline-none focus:border-[#C9A94F] transition-colors"
          />
        </div>

        {/* Category filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 vap-scrollbar">
          {categories.map((cat) => {
            const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onCategoryChange(cat)}
                className={`text-[11px] px-3 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#C9A94F] text-[#0D0A08] font-semibold shadow-sm'
                    : 'bg-[#1D1A16] hover:bg-[#C9A94F]/15 text-[#F5F0E8]/70 hover:text-[#F5F0E8] border border-white/5'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Artwork Grid / List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 vap-scrollbar">
        {artworks.length === 0 ? (
          <div className="text-center py-12 px-4 text-xs text-[#F5F0E8]/50">
            No artworks match your search query. Try clearing filters.
          </div>
        ) : (
          artworks.map((art) => {
            const isSelected = selectedArtwork.id === art.id;
            return (
              <div
                key={art.id}
                onClick={() => onSelectArtwork(art)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex gap-3 group relative ${
                  isSelected
                    ? 'bg-[#1E1914] border-[#C9A94F] shadow-[0_4px_20px_rgba(201,169,79,0.18)] ring-1 ring-[#C9A94F]'
                    : 'bg-[#181410] border-[#C9A94F]/15 hover:border-[#C9A94F]/40 hover:bg-[#1C1813]'
                }`}
              >
                {/* Artwork Thumbnail */}
                <div className="relative w-16 h-20 rounded-lg overflow-hidden border border-[#C9A94F]/20 flex-shrink-0 bg-[#0D0A08]">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  {isSelected && (
                    <div className="absolute top-1 right-1 bg-[#C9A94F] text-[#0D0A08] p-0.5 rounded-full shadow-md">
                      <Check size={10} strokeWidth={3} />
                    </div>
                  )}
                </div>

                {/* Metadata */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                    <h3
                      className={`text-sm leading-snug line-clamp-1 font-medium ${
                        isSelected ? 'text-[#E8D5A0]' : 'text-[#F5F0E8]'
                      }`}
                      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                    >
                      {art.title}
                    </h3>
                    <p className="text-[11px] text-[#C9A94F]/90 font-medium truncate mt-0.5">
                      {art.artist} <span className="text-[#F5F0E8]/40">· {art.year}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-[#F5F0E8]/60 pt-1 border-t border-white/5">
                    <span className="truncate max-w-[110px]">{art.movement}</span>
                    <span className="font-mono text-[#E8D5A0] bg-[#C9A94F]/10 px-1.5 py-0.5 rounded border border-[#C9A94F]/15">
                      {art.widthCm} × {art.heightCm} cm
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Selected artwork curatorial details banner */}
      {selectedArtwork && (
        <div className="p-3 border-t border-[#C9A94F]/20 bg-[#0D0A08]/80 text-[11px]">
          <div className="flex items-center gap-1.5 text-[#C9A94F] mb-1 font-medium">
            <Info size={12} />
            <span>Artwork Specifications</span>
          </div>
          <p className="text-[#F5F0E8]/70 leading-relaxed line-clamp-2">
            {selectedArtwork.medium} · {selectedArtwork.provenance}
          </p>
        </div>
      )}
    </div>
  );
};
