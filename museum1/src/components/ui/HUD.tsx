import { useEffect, useRef } from 'react'
import {
  Volume2,
  VolumeX,
  Compass,
  MousePointer,
} from 'lucide-react'
import { useGalleryStore } from '../../store/galleryStore'

// ── Minimal First-Person Desktop Controls HUD ──────────────────────────────
export function ControlsHUD() {
  const isPointerLocked = useGalleryStore((s) => s.isPointerLocked)
  const inspectingArtwork = useGalleryStore((s) => s.inspectingArtwork)

  return (
    <div className="flex flex-col gap-2">
      {!isPointerLocked && !inspectingArtwork && (
        <div className="key-pill glass-panel text-[#F5F0E8] border border-[#C9A94F]/40 shadow-2xl py-1.5 px-3.5 animate-bounce">
          <MousePointer size={12} className="text-[#C9A94F]" />
          <span className="text-xs font-semibold text-[#F5F0E8] tracking-wide">
            Click + Drag to look · Move Mouse or WASD to walk
          </span>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <div className="key-pill glass-panel text-[#F5F0E8]/80 border border-[#C9A94F]/25 shadow-lg">
          <span className="key-badge bg-[#C9A94F]/20 text-[#C9A94F] border border-[#C9A94F]/40 font-bold">
            WASD / Mouse
          </span>
          <span className="text-[11px] font-medium tracking-wide">Walk</span>
        </div>

        <div className="key-pill glass-panel text-[#F5F0E8]/80 border border-[#C9A94F]/25 shadow-lg">
          <span className="key-badge bg-[#C9A94F]/20 text-[#C9A94F] border border-[#C9A94F]/40 font-bold">
            Drag
          </span>
          <span className="text-[11px] font-medium tracking-wide">Look</span>
        </div>

        <div className="key-pill glass-panel text-[#F5F0E8]/80 border border-[#C9A94F]/25 shadow-lg">
          <span className="key-badge bg-[#C9A94F]/20 text-[#C9A94F] border border-[#C9A94F]/40 font-bold">
            Shift
          </span>
          <span className="text-[11px] font-medium tracking-wide">Sprint</span>
        </div>

        <div className="key-pill glass-panel text-[#F5F0E8]/80 border border-[#C9A94F]/25 shadow-lg">
          <span className="key-badge bg-[#C9A94F]/20 text-[#C9A94F] border border-[#C9A94F]/40 font-bold">
            ESC
          </span>
          <span className="text-[11px] font-medium tracking-wide">Close</span>
        </div>
      </div>
    </div>
  )
}

// ── Audio Ambience Mute Toggle ─────────────────────────────────────────────
export function AudioToggle() {
  const audioEnabled = useGalleryStore((s) => s.audioEnabled)
  const toggleAudio = useGalleryStore((s) => s.toggleAudio)

  return (
    <button
      onClick={toggleAudio}
      className={`key-pill glass-panel transition-all duration-200 cursor-pointer ${
        audioEnabled
          ? 'text-[#C9A94F] border-[#C9A94F]/50 shadow-[0_0_10px_rgba(201,169,79,0.25)]'
          : 'text-[#F5F0E8]/50 hover:text-[#F5F0E8]/80 border-white/10'
      }`}
      title={audioEnabled ? 'Mute environmental footsteps & reverb' : 'Enable museum footsteps & room audio'}
    >
      {audioEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
      <span className="text-[11px]">{audioEnabled ? 'Audio On' : 'Audio Muted'}</span>
    </button>
  )
}

// ── Status Notification Badge ──────────────────────────────────────────────
export function StatusBadge() {
  const statusBadge = useGalleryStore((s) => s.statusBadge)
  const prevStatus = useRef<string | null>(null)

  useEffect(() => {
    prevStatus.current = statusBadge
  }, [statusBadge])

  if (!statusBadge) return null

  return (
    <div
      key={statusBadge}
      className="status-badge glass-panel rounded-full px-4 py-2 flex items-center gap-2.5 max-w-md shadow-xl border border-[#C9A94F]/30"
      id="status-badge"
    >
      <span
        className="w-2 h-2 rounded-full bg-[#C9A94F] flex-shrink-0"
        style={{
          boxShadow: '0 0 8px #C9A94F, 0 0 20px rgba(201,169,79,0.4)',
        }}
      />
      <span className="text-xs text-[#F5F0E8] font-medium truncate">{statusBadge}</span>
    </div>
  )
}

// ── Subtle First-Person Reticle / Crosshair ────────────────────────────────
export function FPSReticle() {
  const isPointerLocked = useGalleryStore((s) => s.isPointerLocked)
  const inspectingArtwork = useGalleryStore((s) => s.inspectingArtwork)

  if (!isPointerLocked || inspectingArtwork) return null

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
      <div className="w-1.5 h-1.5 rounded-full bg-[#C9A94F]/70 shadow-[0_0_6px_rgba(201,169,79,0.8)]" />
    </div>
  )
}
