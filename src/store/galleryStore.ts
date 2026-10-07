import { create } from 'zustand'
import type { ArtworkData } from '../data/museumCollection'

interface GalleryStore {
  // Artwork inspection
  inspectingArtwork: ArtworkData | null
  inspectArtwork: (artwork: ArtworkData) => void
  closeInspection: () => void

  // Audio ambience
  audioEnabled: boolean
  toggleAudio: () => void

  // UI state
  showRegistrationPanel: boolean
  toggleRegistrationPanel: () => void
  registrationSubmitted: boolean
  setRegistrationSubmitted: (v: boolean) => void

  // Status notification overlay
  statusBadge: string | null
  setStatusBadge: (s: string | null) => void

  // Pointer lock state
  isPointerLocked: boolean
  setIsPointerLocked: (v: boolean) => void
}

export const useGalleryStore = create<GalleryStore>((set) => ({
  inspectingArtwork: null,
  inspectArtwork: (artwork) =>
    set({
      inspectingArtwork: artwork,
      statusBadge: `Inspecting: "${artwork.title}" by ${artwork.artist} (${artwork.year})`,
    }),
  closeInspection: () =>
    set({
      inspectingArtwork: null,
      statusBadge: null,
    }),

  audioEnabled: false,
  toggleAudio: () => set((s) => ({ audioEnabled: !s.audioEnabled })),

  showRegistrationPanel: false,
  toggleRegistrationPanel: () =>
    set((s) => ({ showRegistrationPanel: !s.showRegistrationPanel })),
  registrationSubmitted: false,
  setRegistrationSubmitted: (v) => set({ registrationSubmitted: v }),

  statusBadge: null,
  setStatusBadge: (s) => set({ statusBadge: s }),

  isPointerLocked: false,
  setIsPointerLocked: (v) => set({ isPointerLocked: v }),
}))
