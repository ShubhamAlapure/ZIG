import React, { useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Trash2, RefreshCw, AlertCircle, ShieldCheck } from 'lucide-react';
import { WallImageInfo, WALL_PRESETS } from '../utils/imageProcessing';

interface WallPhotoUploaderProps {
  wallImage: WallImageInfo | null;
  onFileUpload: (file: File) => void;
  onSelectPreset: (presetId: string) => void;
  onRemovePhoto: () => void;
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  uploadError: string | null;
  selectedPresetId: string;
}

export const WallPhotoUploader: React.FC<WallPhotoUploaderProps> = ({
  wallImage,
  onFileUpload,
  onSelectPreset,
  onRemovePhoto,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  uploadError,
  selectedPresetId,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files[0]);
    }
  };

  const triggerPicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload Box / Drag & Drop Zone */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={triggerPicker}
        className={`relative rounded-xl border-2 border-dashed p-4 text-center cursor-pointer transition-all ${
          isDragOver
            ? 'border-[#C9A94F] bg-[#C9A94F]/10 scale-[1.01]'
            : 'border-[#C9A94F]/30 hover:border-[#C9A94F] bg-[#14110E]/70 hover:bg-[#1A1612]'
        }`}
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="p-2.5 rounded-full bg-[#C9A94F]/10 text-[#C9A94F] border border-[#C9A94F]/20">
            <UploadCloud size={20} />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-medium text-[#F5F0E8]">
              <span className="text-[#C9A94F] underline underline-offset-2">Click to upload</span> or drag &amp; drop your wall photo
            </p>
            <p className="text-[11px] text-[#F5F0E8]/50 mt-0.5">
              Supports high-res JPG, PNG, WEBP (up to 25MB)
            </p>
          </div>
        </div>
      </div>

      {/* Upload Error Banner */}
      {uploadError && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-950/60 border border-red-500/40 text-xs text-red-200">
          <AlertCircle size={15} className="text-red-400 flex-shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Active Photo Status Bar */}
      {wallImage && (
        <div className="flex items-center justify-between p-3 rounded-lg bg-[#181410] border border-[#C9A94F]/20 text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded border border-[#C9A94F]/30 overflow-hidden bg-black flex-shrink-0">
              <img src={wallImage.url} alt="Room thumbnail" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <p className="text-[#F5F0E8] font-medium truncate max-w-[180px] sm:max-w-[260px]">
                {wallImage.name}
              </p>
              <p className="text-[10px] text-[#C9A94F]/80">
                {wallImage.width} × {wallImage.height} px · {wallImage.formattedSize}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              type="button"
              onClick={triggerPicker}
              className="p-1.5 rounded-md hover:bg-white/10 text-[#F5F0E8]/70 hover:text-[#C9A94F] transition-all"
              title="Replace Wall Photo"
            >
              <RefreshCw size={14} />
            </button>
            <button
              type="button"
              onClick={onRemovePhoto}
              className="p-1.5 rounded-md hover:bg-red-500/20 text-[#F5F0E8]/70 hover:text-red-400 transition-all"
              title="Remove Wall Photo"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Sample Rooms / Curated Presets */}
      <div>
        <label className="text-[11px] uppercase tracking-wider text-[#C9A94F] font-semibold block mb-2">
          Or Select a Curated Interior Wall
        </label>
        <div className="grid grid-cols-3 gap-2">
          {WALL_PRESETS.map((p) => {
            const isSelected = selectedPresetId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelectPreset(p.id)}
                className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#221B14] border-[#C9A94F] ring-1 ring-[#C9A94F]'
                    : 'bg-[#181410] border-[#C9A94F]/20 hover:border-[#C9A94F]/40 hover:bg-[#1D1914]'
                }`}
              >
                <p className={`text-[11px] font-medium leading-tight truncate ${isSelected ? 'text-[#E8D5A0]' : 'text-[#F5F0E8]'}`}>
                  {p.name.replace(' (Sample)', '')}
                </p>
                <p className="text-[9px] text-[#F5F0E8]/50 capitalize mt-0.5">
                  {p.lightingTemp} light
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="flex items-center gap-2 text-[10px] text-[#F5F0E8]/50 pt-1">
        <ShieldCheck size={13} className="text-[#C9A94F]" />
        <span>Privacy Protected: Your room photos are processed locally on your device.</span>
      </div>
    </div>
  );
};
