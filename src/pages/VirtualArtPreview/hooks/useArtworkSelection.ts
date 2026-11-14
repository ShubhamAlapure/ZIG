import { useState, useMemo, useEffect } from 'react';
import {
  ArtworkService,
  VirtualArtwork,
  FrameStyleId,
  AVAILABLE_FRAMES,
  FrameOption,
} from '../services/artworkService';

export function useArtworkSelection(initialArtworkId?: string) {
  const allArtworks = useMemo(() => ArtworkService.getAllArtworks(), []);
  const categories = useMemo(() => ArtworkService.getCategories(), []);

  // Determine initial artwork from URL or prop or default to ref_1
  const [selectedArtwork, setSelectedArtwork] = useState<VirtualArtwork>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const artParam = params.get('art') || initialArtworkId;
      if (artParam) {
        const found = ArtworkService.getArtworkById(artParam);
        if (found) return found;
      }
    }
    return allArtworks[0];
  });

  const [selectedFrame, setSelectedFrame] = useState<FrameStyleId>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const frameParam = params.get('frame') as FrameStyleId;
      if (frameParam && AVAILABLE_FRAMES.some((f) => f.id === frameParam)) {
        return frameParam;
      }
    }
    return selectedArtwork?.defaultFrame || 'ornate-gold';
  });

  const [hasMat, setHasMat] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Filtered artwork list
  const filteredArtworks = useMemo(() => {
    return ArtworkService.filterArtworks(searchQuery, activeCategory);
  }, [searchQuery, activeCategory]);

  // When selectedArtwork changes, update frame if not custom
  const selectArtwork = (art: VirtualArtwork) => {
    setSelectedArtwork(art);
    setSelectedFrame(art.defaultFrame);
  };

  const currentFrameOption: FrameOption = useMemo(() => {
    return (
      AVAILABLE_FRAMES.find((f) => f.id === selectedFrame) || AVAILABLE_FRAMES[0]
    );
  }, [selectedFrame]);

  // Sync state to URL for easy bookmarking and QR mobile handoff
  useEffect(() => {
    if (typeof window !== 'undefined' && selectedArtwork) {
      const url = new URL(window.location.href);
      url.searchParams.set('art', selectedArtwork.id);
      url.searchParams.set('frame', selectedFrame);
      window.history.replaceState({}, '', url.toString());
    }
  }, [selectedArtwork, selectedFrame]);

  return {
    allArtworks,
    filteredArtworks,
    categories,
    selectedArtwork,
    selectArtwork,
    selectedFrame,
    setSelectedFrame,
    hasMat,
    setHasMat,
    currentFrameOption,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
  };
}
