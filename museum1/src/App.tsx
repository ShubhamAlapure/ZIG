import { GalleryCanvas } from './components/3d/GalleryCanvas'
import { EventAdvertisingPanel } from './components/ui/EventAdvertisingPanel'
import { ArtworkModal } from './components/ui/ArtworkModal'
import {
  ControlsHUD,
  StatusBadge,
  AudioToggle,
  FPSReticle,
} from './components/ui/HUD'
import { Landmark } from 'lucide-react'

export default function App() {
  return (
    <div className="w-full h-full flex flex-col lg:flex-row overflow-hidden bg-[#0D0A08] relative select-none">
      {/* ── LEFT 70%: Complete 3D Master Hall Museum Viewport ───────────── */}
      <main
        className="relative h-full flex-shrink-0 w-full lg:w-[70%] z-0"
        aria-label="3D Master Hall Museum Viewport"
      >
        {/* Subtle Atmospheric Gallery Vignette */}
        <div className="absolute inset-0 z-10 vignette pointer-events-none" />

        {/* FPS Reticle */}
        <FPSReticle />

        {/* Full Interactive 3D WebGL Canvas */}
        <div className="w-full h-full relative z-0">
          <GalleryCanvas />
        </div>

        {/* ── HUD: Top-Left Title & Status Badge ── */}
        <div className="absolute top-5 left-5 z-20 flex flex-col gap-2 pointer-events-auto">
          <div className="flex items-center gap-2 glass-panel px-3.5 py-1.5 rounded-full border border-[#C9A94F]/30 shadow-lg backdrop-blur-xl">
            <Landmark size={13} className="text-[#C9A94F]" />
            <span
              className="text-xs text-[#F5F0E8] font-medium tracking-wide"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              The European Museum of Fine Art · Master Hall
            </span>
          </div>
          <StatusBadge />
        </div>

        {/* ── HUD: Top-Right Utilities (Environmental Footsteps & Reverb Audio) ── */}
        <div className="absolute top-5 right-5 z-20 flex items-center gap-2 pointer-events-auto">
          <AudioToggle />
        </div>

        {/* ── HUD: Bottom-Left Desktop Controls Guide ── */}
        <div className="absolute bottom-5 left-5 z-20 pointer-events-auto">
          <ControlsHUD />
        </div>

        {/* ── Painting Curatorial Inspection Modal ── */}
        <ArtworkModal />
      </main>

      {/* ── RIGHT 30%: Dedicated Museum Event & Exhibition Advertising Panel ── */}
      <div className="relative h-full w-full lg:w-[30%] flex-shrink-0 z-20">
        <EventAdvertisingPanel />
      </div>
    </div>
  )
}

