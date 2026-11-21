import { useState, useEffect, useCallback } from 'react';
import {
  WallImageInfo,
  WALL_PRESETS,
  validateWallImage,
  loadImageDimensions,
  formatBytes,
  createProceduralWallCanvas,
} from '../utils/imageProcessing';

export function useWallPhoto() {
  const [wallImage, setWallImage] = useState<WallImageInfo | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('minimalist-living');

  // Load default procedural preset so user immediately has an interior wall ready
  useEffect(() => {
    try {
      const dataUrl = createProceduralWallCanvas('minimalist-living');
      setWallImage({
        url: dataUrl,
        name: 'Modern Minimalist Wall (Sample)',
        width: 1920,
        height: 1080,
        fileSize: 1800000,
        formattedSize: '1.8 MB',
        isPreset: true,
      });
    } catch (e) {
      console.warn('Failed to generate initial wall canvas preset', e);
    }
  }, []);

  const handleSelectPreset = useCallback((presetId: string) => {
    setSelectedPresetId(presetId);
    setUploadError(null);
    try {
      const dataUrl = createProceduralWallCanvas(presetId);
      const preset = WALL_PRESETS.find((p) => p.id === presetId);
      setWallImage({
        url: dataUrl,
        name: `${preset?.name || 'Curated Wall'} (Sample)`,
        width: 1920,
        height: 1080,
        fileSize: 1800000,
        formattedSize: '1.8 MB',
        isPreset: true,
      });
    } catch (err) {
      setUploadError('Failed to load selected room preset.');
    }
  }, []);

  const handleFileUpload = useCallback(async (file: File) => {
    setUploadError(null);
    const validation = validateWallImage(file);
    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid image file.');
      return;
    }

    setIsUploading(true);
    try {
      const objectUrl = URL.createObjectURL(file);
      const dims = await loadImageDimensions(objectUrl);

      setWallImage({
        url: objectUrl,
        name: file.name,
        width: dims.width,
        height: dims.height,
        fileSize: file.size,
        formattedSize: formatBytes(file.size),
        isPreset: false,
      });
      setSelectedPresetId('');
    } catch (err) {
      setUploadError('Failed to read image dimensions. Please try another image.');
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFileUpload(e.dataTransfer.files[0]);
      }
    },
    [handleFileUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const removePhoto = useCallback(() => {
    if (wallImage && !wallImage.isPreset && wallImage.url.startsWith('blob:')) {
      URL.revokeObjectURL(wallImage.url);
    }
    setWallImage(null);
    setSelectedPresetId('');
  }, [wallImage]);

  return {
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
  };
}
