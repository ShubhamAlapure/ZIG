import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { ARService, ARCompatibilityStatus } from '../services/arService';
import { VirtualArtwork, FrameStyleId } from '../services/artworkService';
import { ARControls } from './ARControls';
import { ARInstructions } from './ARInstructions';
import { Camera, AlertTriangle, RefreshCw, X } from 'lucide-react';

interface ARExperienceProps {
  artwork: VirtualArtwork;
  selectedFrame: FrameStyleId;
  onSelectFrame: (id: FrameStyleId) => void;
  onExitAR: () => void;
}

export const ARExperience: React.FC<ARExperienceProps> = ({
  artwork,
  selectedFrame,
  onSelectFrame,
  onExitAR,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // States
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isLoadingCamera, setIsLoadingCamera] = useState<boolean>(true);
  const [isPlaced, setIsPlaced] = useState<boolean>(false);
  const [scaleFactor, setScaleFactor] = useState<number>(1.0);
  const [showInstructions, setShowInstructions] = useState<boolean>(true);

  // Three.js internal refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameId = useRef<number | null>(null);
  const artworkMeshGroup = useRef<THREE.Group | null>(null);
  const reticleMesh = useRef<THREE.Group | null>(null);

  // Artwork position state in 3D scene (z = -2.2m for wall)
  const artworkPosition = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, -2.2));
  const isDraggingMesh = useRef<boolean>(false);
  const lastPointerPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // 1. Initialize Camera
  const startCamera = useCallback(async () => {
    setIsLoadingCamera(true);
    setCameraError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err: any) {
      console.error('Camera initialization failed', err);
      let msg = 'Could not access device camera. Please check camera permissions.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg = 'Camera permission was denied. Please allow camera access in browser settings.';
      } else if (err.name === 'NotFoundError') {
        msg = 'No video camera detected on your device.';
      }
      setCameraError(msg);
    } finally {
      setIsLoadingCamera(false);
    }
  }, []);

  // 2. Initialize Three.js Scene
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth || window.innerWidth;
    const height = containerRef.current.clientHeight || window.innerHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera (60 FOV matches smartphone camera perspective closely)
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.05, 50);
    camera.position.set(0, 0, 0);
    cameraRef.current = camera;

    // Renderer with alpha for transparent overlay
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xfff6ea, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff0db, 1.8);
    dirLight.position.set(1.5, 3.0, 1.0);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const softFillLight = new THREE.PointLight(0xffffff, 0.8, 10);
    softFillLight.position.set(-1.0, 1.0, 0.5);
    scene.add(softFillLight);

    // Wall Reticle (Visual indicator before artwork placement)
    const reticle = new THREE.Group();
    const ringGeo = new THREE.RingGeometry(0.18, 0.2, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xc9a94f,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    reticle.add(ringMesh);

    const dotGeo = new THREE.CircleGeometry(0.04, 24);
    const dotMat = new THREE.MeshBasicMaterial({ color: 0xe8d5a0, side: THREE.DoubleSide });
    const dotMesh = new THREE.Mesh(dotGeo, dotMat);
    reticle.add(dotMesh);

    reticle.position.set(0, 0, -2.2);
    scene.add(reticle);
    reticleMesh.current = reticle;

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth || window.innerWidth;
      const h = containerRef.current.clientHeight || window.innerHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let clock = new THREE.Clock();
    const renderLoop = () => {
      animFrameId.current = requestAnimationFrame(renderLoop);
      const elapsed = clock.getElapsedTime();

      // Gentle pulsing of reticle if not placed yet
      if (reticleMesh.current && !isPlaced) {
        const pulse = 1 + Math.sin(elapsed * 3) * 0.08;
        reticleMesh.current.scale.set(pulse, pulse, pulse);
      }

      renderer.render(scene, camera);
    };
    renderLoop();

    // Start Camera feed
    startCamera();

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);

      if (artworkMeshGroup.current) {
        ARService.disposeGroup(artworkMeshGroup.current);
      }

      renderer.dispose();
      scene.clear();

      if (cameraStream) {
        cameraStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // Update 3D Artwork Mesh when artwork, frame, or scale changes
  useEffect(() => {
    if (!sceneRef.current) return;

    if (artworkMeshGroup.current) {
      sceneRef.current.remove(artworkMeshGroup.current);
      ARService.disposeGroup(artworkMeshGroup.current);
      artworkMeshGroup.current = null;
    }

    if (isPlaced) {
      const mesh = ARService.createArtwork3DMesh(artwork, selectedFrame, scaleFactor);
      mesh.position.copy(artworkPosition.current);
      sceneRef.current.add(mesh);
      artworkMeshGroup.current = mesh;

      if (reticleMesh.current) {
        reticleMesh.current.visible = false;
      }
    } else {
      if (reticleMesh.current) {
        reticleMesh.current.visible = true;
      }
    }
  }, [artwork, selectedFrame, scaleFactor, isPlaced]);

  // Tap to place or drag artwork
  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button, input, .glass-panel')) return;

    if (!isPlaced) {
      // Place artwork at wall reticle position
      setIsPlaced(true);
      setShowInstructions(false);
      return;
    }

    // Drag artwork across wall plane
    isDraggingMesh.current = true;
    lastPointerPos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingMesh.current || !artworkMeshGroup.current) return;

    const dx = e.clientX - lastPointerPos.current.x;
    const dy = e.clientY - lastPointerPos.current.y;
    lastPointerPos.current = { x: e.clientX, y: e.clientY };

    // Sensitivity factor mapping screen pixels to meters at distance 2.2m
    const sensitivity = 0.0028;
    artworkPosition.current.x += dx * sensitivity;
    artworkPosition.current.y -= dy * sensitivity;
    artworkMeshGroup.current.position.copy(artworkPosition.current);
  };

  const handlePointerUp = () => {
    isDraggingMesh.current = false;
  };

  // Reposition on wall
  const handleReposition = () => {
    setIsPlaced(false);
    setShowInstructions(true);
  };

  // Capture Snapshot
  const handleTakeSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = videoRef.current.videoWidth || 1920;
    exportCanvas.height = videoRef.current.videoHeight || 1080;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    // Draw camera video
    ctx.drawImage(videoRef.current, 0, 0, exportCanvas.width, exportCanvas.height);

    // Draw Three.js WebGL canvas overlay
    ctx.drawImage(canvasRef.current, 0, 0, exportCanvas.width, exportCanvas.height);

    // Draw watermark
    ctx.font = "bold 24px 'Cinzel', serif";
    ctx.fillStyle = '#C9A94F';
    ctx.textAlign = 'right';
    ctx.fillText('ZIG ART MUSEUM · AR WALL SNAPSHOT', exportCanvas.width - 40, exportCanvas.height - 40);

    exportCanvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ZIG_AR_Snapshot_${artwork.title.replace(/\s+/g, '_')}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    }, 'image/png');
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="relative w-full h-screen bg-black overflow-hidden select-none touch-none"
    >
      {/* ── Background Live Camera Stream ── */}
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* ── Foreground Three.js 3D WebGL Canvas ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-10 pointer-events-none"
      />

      {/* ── Camera Loading Spinner ── */}
      {isLoadingCamera && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-[#0D0A08] text-[#F5F0E8] gap-3">
          <div className="w-12 h-12 border-2 border-[#C9A94F]/30 border-t-[#C9A94F] rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest text-[#E8D5A0] font-medium">
            Initializing AR Camera…
          </p>
        </div>
      )}

      {/* ── Camera Permission Denied / Error Banner ── */}
      {cameraError && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/90 text-center">
          <div className="vap-glass max-w-sm w-full p-6 rounded-2xl border border-red-500/40 space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 mx-auto flex items-center justify-center border border-red-500/30">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-base font-medium text-white mb-1">Camera Access Required</h3>
              <p className="text-xs text-white/70 leading-relaxed">{cameraError}</p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onExitAR}
                className="flex-1 py-2 rounded-xl border border-white/20 text-xs text-white hover:bg-white/10"
              >
                Return
              </button>
              <button
                type="button"
                onClick={startCamera}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#C9A94F] text-black font-semibold text-xs"
              >
                <RefreshCw size={13} />
                <span>Retry</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Live AR Instructions Overlay ── */}
      {showInstructions && !isLoadingCamera && !cameraError && (
        <ARInstructions
          step={isPlaced ? 'placed' : 'scanning'}
          onDismiss={() => setShowInstructions(false)}
        />
      )}

      {/* ── Floating Mobile AR Controls ── */}
      {!isLoadingCamera && !cameraError && (
        <ARControls
          artwork={artwork}
          selectedFrame={selectedFrame}
          onSelectFrame={onSelectFrame}
          scaleFactor={scaleFactor}
          onScaleChange={setScaleFactor}
          isPlaced={isPlaced}
          onReposition={handleReposition}
          onTakeSnapshot={handleTakeSnapshot}
          onExitAR={onExitAR}
        />
      )}
    </div>
  );
};
