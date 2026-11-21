import React, { useState } from 'react';
import { Download, Sparkles, X, Check, ShieldCheck, Loader2 } from 'lucide-react';
import { ImageExportService } from '../services/imageExportService';
import { WallImageInfo } from '../utils/imageProcessing';
import { VirtualArtwork, FrameStyleId } from '../services/artworkService';
import { TransformState } from '../hooks/useArtworkTransform';
import { QuadCorners } from '../utils/perspectiveWarp';

interface ExportPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  wallImage: WallImageInfo;
  selectedArtwork: VirtualArtwork;
  selectedFrame: FrameStyleId;
  hasMat: boolean;
  transform: TransformState;
}

export const ExportPreview: React.FC<ExportPreviewProps> = ({
  isOpen,
  onClose,
  wallImage,
  selectedArtwork,
  selectedFrame,
  hasMat,
  transform,
}) => {
  const [includeWatermark, setIncludeWatermark] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setIsExporting(true);
    setIsSuccess(false);

    try {
      // Load image elements for export
      const wallImg = new Image();
      wallImg.crossOrigin = 'anonymous';
      await new Promise((resolve, reject) => {
        wallImg.onload = resolve;
        wallImg.onerror = reject;
        wallImg.src = wallImage.url;
      });

      const artImg = new Image();
      artImg.crossOrigin = 'anonymous';
      await new Promise((resolve, reject) => {
        artImg.onload = resolve;
        artImg.onerror = reject;
        artImg.src = selectedArtwork.imageUrl;
      });

      const wallW = wallImg.naturalWidth || 1920;
      const wallH = wallImg.naturalHeight || 1080;

      // Map percentage corners to actual pixel dimensions
      const pixelCorners: QuadCorners = {
        tl: { x: (transform.corners.tl.x / 100) * wallW, y: (transform.corners.tl.y / 100) * wallH },
        tr: { x: (transform.corners.tr.x / 100) * wallW, y: (transform.corners.tr.y / 100) * wallH },
        br: { x: (transform.corners.br.x / 100) * wallW, y: (transform.corners.br.y / 100) * wallH },
        bl: { x: (transform.corners.bl.x / 100) * wallW, y: (transform.corners.bl.y / 100) * wallH },
      };

      const blob = await ImageExportService.generatePreviewBlob({
        wallImage: wallImg,
        artworkImage: artImg,
        corners: pixelCorners,
        frameStyle: selectedFrame,
        hasMat,
        matWidthPercent: 0.05,
        shadowBlur: transform.shadowBlur * 2,
        shadowOpacity: transform.shadowOpacity,
        shadowOffsetX: transform.shadowOffsetX * 2,
        shadowOffsetY: transform.shadowOffsetY * 2,
        blendMode: transform.blendMode === 'multiply' ? 'multiply' : 'source-over',
        artworkBrightness: transform.artworkBrightness,
        artworkContrast: transform.artworkContrast,
        includeWatermark,
        artworkTitle: selectedArtwork.title,
        artistName: selectedArtwork.artist,
      });

      const cleanTitle = selectedArtwork.title.replace(/[^a-zA-Z0-9]/g, '_');
      ImageExportService.triggerDownload(blob, `ZIG_Wall_Preview_${cleanTitle}.png`);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1800);
    } catch (err) {
      console.error('Export failed', err);
      alert('Could not generate high-resolution export. Please ensure the image is accessible.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="vap-glass rounded-2xl max-w-md w-full p-6 border border-[#C9A94F]/35 shadow-2xl relative text-[#F5F0E8] space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#C9A94F]/20 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#C9A94F]" />
            <h3
              className="text-lg font-medium text-[#F5F0E8]"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Export Wall Composition
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-[#F5F0E8]/70 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Summary Details */}
        <div className="flex gap-3.5 p-3 rounded-xl bg-[#181410] border border-[#C9A94F]/15">
          <img
            src={selectedArtwork.imageUrl}
            alt={selectedArtwork.title}
            className="w-16 h-20 object-cover rounded-lg border border-[#C9A94F]/25 flex-shrink-0"
          />
          <div className="min-w-0 flex flex-col justify-between py-0.5">
            <div>
              <h4 className="text-sm font-medium text-[#F5F0E8] line-clamp-1">
                {selectedArtwork.title}
              </h4>
              <p className="text-xs text-[#C9A94F] line-clamp-1">
                {selectedArtwork.artist} ({selectedArtwork.year})
              </p>
            </div>
            <p className="text-[11px] text-[#F5F0E8]/60">
              Format: High-Definition PNG (300 DPI)
            </p>
          </div>
        </div>

        {/* Watermark toggle */}
        <label className="flex items-center justify-between p-2.5 rounded-lg bg-[#14110E] border border-white/5 cursor-pointer text-xs select-none">
          <span className="text-[#F5F0E8]/80">Include Museum Curatorial Inscription</span>
          <input
            type="checkbox"
            checked={includeWatermark}
            onChange={(e) => setIncludeWatermark(e.target.checked)}
            className="w-4 h-4 accent-[#C9A94F] rounded cursor-pointer"
          />
        </label>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs text-[#F5F0E8]/70 hover:text-[#F5F0E8] transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={isExporting}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A94F] to-[#E8D5A0] text-[#0D0A08] font-semibold text-xs transition-all shadow-[0_4px_20px_rgba(201,169,79,0.35)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            {isExporting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Rendering High-Res…</span>
              </>
            ) : isSuccess ? (
              <>
                <Check size={14} />
                <span>Downloaded!</span>
              </>
            ) : (
              <>
                <Download size={14} />
                <span>Download Preview</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
