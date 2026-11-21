import React, { useState, useEffect } from 'react';
import { ExperienceHero } from './components/ExperienceHero';
import { ArtworkSelector } from './components/ArtworkSelector';
import { WallPhotoUploader } from './components/WallPhotoUploader';
import { WallEditor } from './components/WallEditor';
import { ArtworkTransformControls } from './components/ArtworkTransformControls';
import { FrameSelector } from './components/FrameSelector';
import { BeforeAfterSlider } from './components/BeforeAfterSlider';
import { ExportPreview } from './components/ExportPreview';
import { QRHandoff } from './components/QRHandoff';
import { ARExperience } from './components/ARExperience';
import { useArtworkSelection } from './hooks/useArtworkSelection';
import { useWallPhoto } from './hooks/useWallPhoto';
import { useArtworkTransform } from './hooks/useArtworkTransform';
import { useARSupport } from './hooks/useARSupport';
import {
  Download,
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
  Layers,
  Image as ImageIcon,
  Camera,
} from 'lucide-react';
import './styles/virtual-art-preview.css';

interface VirtualArtPreviewPageProps {
  onReturnToMuseum?: () => void;
}

export const VirtualArtPreviewPage: React.FC<VirtualArtPreviewPageProps> = ({
  onReturnToMuseum,
}) => {
  // Check initial mode from URL search param
  const [activeMode, setActiveMode] = useState<'photo' | 'ar'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('mode') === 'ar' ? 'ar' : 'photo';
    }
    return 'photo';
  });

  // Navigation back to museum
  const handleReturn = () => {
    if (onReturnToMuseum) {
      onReturnToMuseum();
    } else if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  // 1. Artwork Selection State & Hooks
  const {
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
  } = useArtworkSelection();

  // 2. Wall Photo State & Hooks
  const {
    wallImage,
    isUploading,
    uploadError,
    isDragOver,
    selectedPresetId,
    handleFileUpload,
    handleSelectPreset,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    removePhoto,
  } = useWallPhoto();

  // 3. Artwork Transformation & Realistic Compositing Hooks
  const {
    transform,
    updatePosition,
    setScale,
    setRotation,
    setPerspectiveTilt,
    setCornerPin,
    togglePerspectiveMode,
    updateShadows,
    updateLighting,
    resetTransform,
    standardCssTransform,
  } = useArtworkTransform(selectedArtwork?.aspectRatio || 1.0);

  // 4. AR Support & Handoff Hook
  const {
    compatStatus,
    isChecking,
    qrCodeDataUrl,
    handoffUrl,
    isCopied,
    copyHandoffLink,
    isARActive,
    setIsARActive,
  } = useARSupport(selectedArtwork, selectedFrame);

  // 5. Comparison Mode State
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false);
  const [sliderPosPercent, setSliderPosPercent] = useState<number>(50);
  const [isPeekingOriginal, setIsPeekingOriginal] = useState<boolean>(false);

  // 6. Export Preview Modal State
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Active tab on mobile/tablet right-side panel
  const [activeControlTab, setActiveControlTab] = useState<'photo' | 'framing' | 'adjust'>('framing');

  // Launch live AR
  const handleLaunchAR = () => {
    setIsARActive(true);
  };

  // Exit live AR
  const handleExitAR = () => {
    setIsARActive(false);
  };

  // If live AR is running full-screen on mobile or desktop webcam test
  if (isARActive && selectedArtwork) {
    return (
      <ARExperience
        artwork={selectedArtwork}
        selectedFrame={selectedFrame}
        onSelectFrame={setSelectedFrame}
        onExitAR={handleExitAR}
      />
    );
  }

  return (
    <div className="vap-root min-h-screen w-full flex flex-col bg-[#0D0A08] text-[#F5F0E8] overflow-hidden">
      {/* ── Top Gallery Navigation Header ── */}
      <ExperienceHero
        activeMode={activeMode}
        onModeChange={(mode) => {
          setActiveMode(mode);
          if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.set('mode', mode);
            window.history.replaceState({}, '', url.toString());
          }
        }}
        onReturnToMuseum={handleReturn}
      />

      {/* ── MODE B: VIEW IN AR ── */}
      {activeMode === 'ar' ? (
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          {/* Left: Artwork Selection Column */}
          <aside className="w-full lg:w-80 h-64 lg:h-full flex-shrink-0 z-10 border-b lg:border-b-0 lg:border-r border-[#C9A94F]/20">
            <ArtworkSelector
              artworks={filteredArtworks}
              selectedArtwork={selectedArtwork}
              onSelectArtwork={selectArtwork}
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </aside>

          {/* Right: AR Handoff or Mobile Direct Launch View */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-10 flex items-center justify-center bg-radial-at-c from-[#181410] to-[#0D0A08] vap-scrollbar">
            {compatStatus?.isMobile ? (
              /* Mobile Detected: Immediate AR Launch */
              <div className="max-w-md w-full vap-glass p-8 rounded-3xl border border-[#C9A94F]/40 shadow-2xl text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-[#C9A94F]/15 border border-[#C9A94F]/30 text-[#C9A94F] flex items-center justify-center mx-auto shadow-lg">
                  <Camera size={32} />
                </div>
                <div>
                  <h2
                    className="text-2xl text-[#F5F0E8] font-medium"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                  >
                    Bring Art Into Your Space
                  </h2>
                  <p className="text-xs text-[#F5F0E8]/70 mt-2 leading-relaxed">
                    Activate your device camera to detect a physical wall and preview &ldquo;{selectedArtwork.title}&rdquo; at calibrated 1:1 real-world scale ({selectedArtwork.widthCm} × {selectedArtwork.heightCm} cm).
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#14110E] border border-[#C9A94F]/20 flex items-center gap-3 text-left text-xs">
                  <img
                    src={selectedArtwork.imageUrl}
                    alt={selectedArtwork.title}
                    className="w-12 h-14 object-cover rounded border border-[#C9A94F]/30"
                  />
                  <div>
                    <p className="text-[#F5F0E8] font-medium truncate max-w-[200px]">
                      {selectedArtwork.title}
                    </p>
                    <p className="text-[11px] text-[#C9A94F]">
                      {selectedArtwork.artist} ({selectedArtwork.year})
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLaunchAR}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#C9A94F] to-[#E8D5A0] text-[#0D0A08] font-bold text-sm tracking-wide transition-all shadow-[0_6px_24px_rgba(201,169,79,0.4)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  Activate Live AR Mode
                </button>
              </div>
            ) : (
              /* Desktop Detected: QR Code Handoff Card */
              <QRHandoff
                qrCodeDataUrl={qrCodeDataUrl}
                handoffUrl={handoffUrl}
                isCopied={isCopied}
                onCopyLink={copyHandoffLink}
                selectedArtwork={selectedArtwork}
                selectedFrame={selectedFrame}
                onLaunchDesktopWebcamAR={handleLaunchAR}
              />
            )}
          </div>
        </main>
      ) : (
        /* ── MODE A: UPLOAD MY WALL (Customer Photo Mode) ── */
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          {/* Left Column: Artwork Selector */}
          <aside className="w-full lg:w-72 xl:w-80 h-56 lg:h-full flex-shrink-0 z-10 border-b lg:border-b-0 lg:border-r border-[#C9A94F]/20">
            <ArtworkSelector
              artworks={filteredArtworks}
              selectedArtwork={selectedArtwork}
              onSelectArtwork={selectArtwork}
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </aside>

          {/* Central Area: Interactive Wall Editor */}
          <section className="flex-1 h-[55vh] lg:h-full relative overflow-hidden bg-[#0A0807]">
            {wallImage ? (
              <WallEditor
                wallImage={wallImage}
                selectedArtwork={selectedArtwork}
                selectedFrame={selectedFrame}
                frameOption={currentFrameOption}
                hasMat={hasMat}
                transform={transform}
                standardCssTransform={standardCssTransform}
                onUpdatePosition={updatePosition}
                onSetScale={setScale}
                onSetRotation={setRotation}
                onSetCornerPin={setCornerPin}
                isCompareMode={isCompareMode}
                sliderPosPercent={sliderPosPercent}
                onSliderPosChange={setSliderPosPercent}
                isPeekingOriginal={isPeekingOriginal}
              />
            ) : (
              /* Empty Wall Prompt */
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-[#F5F0E8]/70">
                <ImageIcon size={48} className="text-[#C9A94F]/40 mb-3" />
                <h3
                  className="text-xl font-medium text-[#F5F0E8]"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Upload Your Wall Photograph
                </h3>
                <p className="text-xs text-[#F5F0E8]/60 max-w-sm mt-1">
                  Upload a photo of your living room, office, or bedroom wall to start previewing artwork.
                </p>
              </div>
            )}

            {/* Floating Comparison Controls on Top Right of Editor */}
            {wallImage && (
              <div className="absolute top-4 right-4 z-30">
                <BeforeAfterSlider
                  wallImageUrl={wallImage.url}
                  isCompareMode={isCompareMode}
                  onToggleCompareMode={() => setIsCompareMode(!isCompareMode)}
                  sliderPosPercent={sliderPosPercent}
                  onSliderPosChange={setSliderPosPercent}
                  isPeekingOriginal={isPeekingOriginal}
                  onSetPeekingOriginal={setIsPeekingOriginal}
                />
              </div>
            )}
          </section>

          {/* Right Column: Customization Controls, Framing, & Export */}
          <aside className="w-full lg:w-80 xl:w-96 h-auto lg:h-full flex-shrink-0 z-20 border-t lg:border-t-0 lg:border-l border-[#C9A94F]/20 bg-[#14110E] flex flex-col justify-between overflow-y-auto vap-scrollbar">
            <div className="p-4 sm:p-5 space-y-5">
              {/* Tabs switcher for mobile/tablet */}
              <div className="flex rounded-lg bg-[#0D0A08] p-1 border border-[#C9A94F]/20 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveControlTab('framing')}
                  className={`flex-1 py-1.5 rounded-md font-medium transition-all ${
                    activeControlTab === 'framing'
                      ? 'bg-[#C9A94F] text-[#0D0A08] font-bold shadow'
                      : 'text-[#F5F0E8]/70 hover:text-white'
                  }`}
                >
                  Frame &amp; Style
                </button>
                <button
                  type="button"
                  onClick={() => setActiveControlTab('adjust')}
                  className={`flex-1 py-1.5 rounded-md font-medium transition-all ${
                    activeControlTab === 'adjust'
                      ? 'bg-[#C9A94F] text-[#0D0A08] font-bold shadow'
                      : 'text-[#F5F0E8]/70 hover:text-white'
                  }`}
                >
                  Wall Placement
                </button>
                <button
                  type="button"
                  onClick={() => setActiveControlTab('photo')}
                  className={`flex-1 py-1.5 rounded-md font-medium transition-all ${
                    activeControlTab === 'photo'
                      ? 'bg-[#C9A94F] text-[#0D0A08] font-bold shadow'
                      : 'text-[#F5F0E8]/70 hover:text-white'
                  }`}
                >
                  Wall Photo
                </button>
              </div>

              {/* Tab 1: Framing & Mat */}
              {activeControlTab === 'framing' && (
                <FrameSelector
                  selectedFrame={selectedFrame}
                  onSelectFrame={setSelectedFrame}
                  hasMat={hasMat}
                  onToggleMat={setHasMat}
                />
              )}

              {/* Tab 2: Position, Scale, Rotation, Shadows, Perspective */}
              {activeControlTab === 'adjust' && (
                <ArtworkTransformControls
                  transform={transform}
                  selectedArtwork={selectedArtwork}
                  onScaleChange={setScale}
                  onRotationChange={setRotation}
                  onPerspectiveTiltChange={setPerspectiveTilt}
                  onTogglePerspectiveMode={togglePerspectiveMode}
                  onUpdateShadows={updateShadows}
                  onUpdateLighting={updateLighting}
                  onReset={resetTransform}
                />
              )}

              {/* Tab 3: Wall Photo Upload & Presets */}
              {activeControlTab === 'photo' && (
                <WallPhotoUploader
                  wallImage={wallImage}
                  onFileUpload={handleFileUpload}
                  onSelectPreset={handleSelectPreset}
                  onRemovePhoto={removePhoto}
                  isDragOver={isDragOver}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  uploadError={uploadError}
                  selectedPresetId={selectedPresetId}
                />
              )}
            </div>

            {/* Bottom Primary Actions Bar */}
            <div className="p-4 sm:p-5 border-t border-[#C9A94F]/20 bg-[#0D0A08]/90 space-y-2.5">
              <button
                type="button"
                onClick={() => setIsExportModalOpen(true)}
                disabled={!wallImage}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#C9A94F] to-[#E8D5A0] text-[#0D0A08] font-bold text-xs uppercase tracking-wider transition-all shadow-[0_4px_20px_rgba(201,169,79,0.35)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                <Download size={15} />
                <span>Download High-Res Preview</span>
              </button>

              <div className="flex items-center justify-between text-[11px] text-[#F5F0E8]/60 px-1">
                <span>Format: 300 DPI Composition</span>
                <button
                  type="button"
                  onClick={resetTransform}
                  className="hover:text-[#C9A94F] underline cursor-pointer"
                >
                  Start Over
                </button>
              </div>
            </div>
          </aside>
        </main>
      )}

      {/* ── Export Composition Modal ── */}
      {wallImage && selectedArtwork && (
        <ExportPreview
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          wallImage={wallImage}
          selectedArtwork={selectedArtwork}
          selectedFrame={selectedFrame}
          hasMat={hasMat}
          transform={transform}
        />
      )}
    </div>
  );
};

export default VirtualArtPreviewPage;
