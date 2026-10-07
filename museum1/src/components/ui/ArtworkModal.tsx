import { useGalleryStore } from '../../store/galleryStore'
import { X, ZoomIn } from 'lucide-react'

export function ArtworkModal() {
  const inspectingArtwork = useGalleryStore((s) => s.inspectingArtwork)
  const closeInspection = useGalleryStore((s) => s.closeInspection)

  if (!inspectingArtwork) return null

  const { title, artist, year, movement, medium, dimensions, description, provenance, imagePath } = inspectingArtwork

  return (
    <div className="absolute bottom-8 right-8 z-30 max-w-md w-full animate-in fade-in slide-in-from-bottom-6 duration-400">
      <div className="glass-panel rounded-2xl p-6 border border-[#C9A94F]/35 shadow-[0_12px_48px_rgba(0,0,0,0.7)] backdrop-blur-2xl relative text-[#F5F0E8]">
        {/* Top Header & Close Button */}
        <div className="flex items-start justify-between gap-4 border-b border-[#C9A94F]/15 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C9A94F] animate-pulse" />
            <span className="text-[10px] tracking-[0.22em] uppercase text-[#C9A94F] font-semibold">
              Curatorial Archive
            </span>
          </div>

          <button
            id="btn-close-inspection"
            onClick={closeInspection}
            className="p-1.5 rounded-full glass-light hover:bg-[#C9A94F]/20 text-[#F5F0E8]/70 hover:text-[#C9A94F] transition-all cursor-pointer"
            title="Exit Inspection (ESC)"
          >
            <X size={16} />
          </button>
        </div>

        {/* Artwork Header with Thumbnail */}
        <div className="flex gap-4 mb-3 items-start">
          <img
            src={imagePath}
            alt={title}
            className="w-16 h-20 object-cover rounded-lg border border-[#C9A94F]/30 shadow-md flex-shrink-0"
          />
          <div>
            <h2
              className="font-display text-xl text-[#F5F0E8] leading-snug font-medium mb-1"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {title}
            </h2>
            <p className="text-xs text-[#C9A94F] font-medium">
              {artist} · <span className="text-[#F5F0E8]/60">{year}</span>
            </p>
          </div>
        </div>

        {/* Movement & Metadata Badge Row */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="px-2 py-0.5 rounded-md text-[10px] glass-light border border-[#C9A94F]/20 text-[#F5F0E8]/80 font-medium">
            🏛️ {movement}
          </span>
          <span className="px-2 py-0.5 rounded-md text-[10px] glass-light border border-white/10 text-[#F5F0E8]/70">
            🎨 {medium}
          </span>
          <span className="px-2 py-0.5 rounded-md text-[10px] glass-light border border-white/10 text-[#F5F0E8]/60">
            📐 {dimensions}
          </span>
        </div>

        {/* Curatorial Description */}
        <div className="space-y-2 mb-4">
          <p className="text-xs text-[#F5F0E8]/75 leading-relaxed">
            {description}
          </p>
          <p className="text-[11px] text-[#C9A94F]/70 italic border-l-2 border-[#C9A94F]/40 pl-2 mt-2">
            Provenance: {provenance}
          </p>
        </div>

        {/* Bottom Inspection Action Hint */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10 text-[11px] text-[#F5F0E8]/50">
          <span className="flex items-center gap-1.5">
            <ZoomIn size={12} className="text-[#C9A94F]" /> Scroll to zoom in / out
          </span>
          <button
            onClick={closeInspection}
            className="text-[#C9A94F] hover:underline font-medium cursor-pointer"
          >
            Return to Gallery (ESC)
          </button>
        </div>
      </div>
    </div>
  )
}
