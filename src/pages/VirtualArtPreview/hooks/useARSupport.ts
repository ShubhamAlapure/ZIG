import { useState, useEffect, useCallback } from 'react';
import QRCode from 'qrcode';
import { ARService, ARCompatibilityStatus } from '../services/arService';
import { VirtualArtwork, FrameStyleId } from '../services/artworkService';

export function useARSupport(selectedArtwork: VirtualArtwork, selectedFrame: FrameStyleId) {
  const [compatStatus, setCompatStatus] = useState<ARCompatibilityStatus | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [handoffUrl, setHandoffUrl] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isARActive, setIsARActive] = useState<boolean>(false);

  // Check device compatibility on mount
  useEffect(() => {
    let isMounted = true;
    ARService.checkCompatibility().then((res) => {
      if (isMounted) {
        setCompatStatus(res);
        setIsChecking(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Construct mobile AR handoff link and QR code
  useEffect(() => {
    if (typeof window === 'undefined' || !selectedArtwork) return;

    const baseOrigin = window.location.origin;
    const url = new URL(`${baseOrigin}/virtual-art-preview`);
    url.searchParams.set('mode', 'ar');
    url.searchParams.set('art', selectedArtwork.id);
    url.searchParams.set('frame', selectedFrame);
    const fullUrl = url.toString();
    setHandoffUrl(fullUrl);

    // Generate QR Code with high error correction and gold/charcoal palette
    QRCode.toDataURL(fullUrl, {
      width: 320,
      margin: 1.5,
      color: {
        dark: '#14120e',
        light: '#f5f0e8',
      },
      errorCorrectionLevel: 'M',
    })
      .then((dataUrl: string) => {
        setQrCodeDataUrl(dataUrl);
      })
      .catch((err: unknown) => {
        console.error('Failed to generate AR handoff QR code', err);
      });
  }, [selectedArtwork, selectedFrame]);

  const copyHandoffLink = useCallback(() => {
    if (!handoffUrl) return;
    navigator.clipboard.writeText(handoffUrl).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    });
  }, [handoffUrl]);

  return {
    compatStatus,
    isChecking,
    qrCodeDataUrl,
    handoffUrl,
    isCopied,
    copyHandoffLink,
    isARActive,
    setIsARActive,
  };
}
