import React from 'react';
import { QrCode, Smartphone, Copy, Check, Sparkles, Video, ExternalLink } from 'lucide-react';
import { VirtualArtwork, FrameStyleId } from '../services/artworkService';

interface QRHandoffProps {
  qrCodeDataUrl: string;
  handoffUrl: string;
  isCopied: boolean;
  onCopyLink: () => void;
  selectedArtwork: VirtualArtwork;
  selectedFrame: FrameStyleId;
  onLaunchDesktopWebcamAR: () => void;
}

export const QRHandoff: React.FC<QRHandoffProps> = ({
  qrCodeDataUrl,
  handoffUrl,
  isCopied,
  onCopyLink,
  selectedArtwork,
  selectedFrame,
  onLaunchDesktopWebcamAR,
}) => {
  return (
    <div className="max-w-xl mx-auto my-auto p-6 sm:p-8 vap-glass rounded-3xl border border-[#C9A94F]/30 shadow-2xl text-center space-y-6">
      {/* Eyebrow and Title */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A94F]/10 border border-[#C9A94F]/25 text-[#C9A94F] text-xs font-medium mb-3">
          <Smartphone size={14} />
          <span>Mobile Augmented Reality Handoff</span>
        </div>
        <h2
          className="text-2xl sm:text-3xl text-[#F5F0E8] font-medium"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          Preview on Your Physical Wall
        </h2>
        <p className="text-xs sm:text-sm text-[#F5F0E8]/70 max-w-md mx-auto mt-2 leading-relaxed">
          Point your iPhone or Android camera at the QR code below to launch the live AR wall experience at 1:1 real-world scale.
        </p>
      </div>

      {/* QR Code Container */}
      <div className="relative inline-block p-4 rounded-2xl bg-[#F5F0E8] shadow-[0_12px_36px_rgba(0,0,0,0.6)] border-4 border-[#C9A94F]">
        {qrCodeDataUrl ? (
          <img
            src={qrCodeDataUrl}
            alt="AR Handoff QR Code"
            className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-lg"
          />
        ) : (
          <div className="w-56 h-56 flex items-center justify-center text-xs text-black/50">
            Generating Secure AR Pass…
          </div>
        )}
      </div>

      {/* Artwork Selected Badge */}
      <div className="flex items-center justify-center gap-3 p-3 rounded-xl bg-[#14110E] border border-[#C9A94F]/20 text-xs max-w-sm mx-auto">
        <img
          src={selectedArtwork.imageUrl}
          alt={selectedArtwork.title}
          className="w-10 h-12 object-cover rounded border border-[#C9A94F]/30"
        />
        <div className="text-left">
          <p className="text-[#F5F0E8] font-medium truncate max-w-[200px]">
            {selectedArtwork.title}
          </p>
          <p className="text-[11px] text-[#C9A94F]">
            Real scale: {selectedArtwork.widthCm} × {selectedArtwork.heightCm} cm
          </p>
        </div>
      </div>

      {/* Copy Link & Fallback Action */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={onCopyLink}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#181410] hover:bg-[#221B14] border border-[#C9A94F]/35 text-xs text-[#F5F0E8] transition-all cursor-pointer shadow-md"
        >
          {isCopied ? (
            <>
              <Check size={14} className="text-emerald-400" />
              <span className="text-emerald-400 font-medium">Link Copied to Clipboard</span>
            </>
          ) : (
            <>
              <Copy size={14} className="text-[#C9A94F]" />
              <span>Copy Direct Mobile Link</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onLaunchDesktopWebcamAR}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#C9A94F] to-[#E8D5A0] text-[#0D0A08] font-semibold text-xs transition-all shadow-[0_4px_16px_rgba(201,169,79,0.3)] hover:scale-105 cursor-pointer"
        >
          <Video size={14} />
          <span>Test Camera Mode on Desktop</span>
        </button>
      </div>
    </div>
  );
};
