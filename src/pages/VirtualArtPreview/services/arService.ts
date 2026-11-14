import * as THREE from 'three';
import { VirtualArtwork, FrameStyleId } from './artworkService';
import { cmToMeters } from '../utils/dimensionUtils';

export interface ARCompatibilityStatus {
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  hasWebXR: boolean;
  hasWebAR: boolean;
  hasCamera: boolean;
  supportLevel: 'webxr-hit-test' | 'mobile-camera-reticle' | 'desktop-handoff' | 'unsupported';
  message: string;
}

export class ARService {
  /**
   * Evaluates the client's AR capabilities
   */
  public static async checkCompatibility(): Promise<ARCompatibilityStatus> {
    const userAgent = navigator.userAgent || '';
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
    const isAndroid = /Android/i.test(userAgent);
    const isMobile =
      isIOS ||
      isAndroid ||
      /Mobi|Tablet|iPad|iPhone|Android/i.test(navigator.userAgent) ||
      (window.matchMedia && window.matchMedia('(max-width: 800px)').matches);

    let hasCamera = false;
    try {
      if (typeof navigator.mediaDevices?.getUserMedia === 'function') {
        hasCamera = true;
      }
    } catch {
      hasCamera = false;
    }

    let hasWebXR = false;
    let hasWebAR = false;

    if ('xr' in navigator && (navigator as any).xr) {
      hasWebXR = true;
      try {
        hasWebAR = await (navigator as any).xr.isSessionSupported('immersive-ar');
      } catch {
        hasWebAR = false;
      }
    }

    let supportLevel: ARCompatibilityStatus['supportLevel'] = 'unsupported';
    let message = '';

    if (!isMobile) {
      supportLevel = 'desktop-handoff';
      message = 'Desktop detected. Scan QR code with your mobile device to preview art on your real wall.';
    } else if (hasWebAR) {
      supportLevel = 'webxr-hit-test';
      message = 'WebXR AR with surface hit testing is supported on your device.';
    } else if (hasCamera) {
      supportLevel = 'mobile-camera-reticle';
      message = 'Interactive mobile camera wall placement mode available.';
    } else {
      supportLevel = 'unsupported';
      message = 'Camera or AR capabilities not detected on this browser.';
    }

    return {
      isMobile,
      isIOS,
      isAndroid,
      hasWebXR,
      hasWebAR,
      hasCamera,
      supportLevel,
      message,
    };
  }

  /**
   * Generates a 3D Framed Artwork Three.js Mesh scaled to real-world meters
   */
  public static createArtwork3DMesh(
    artwork: VirtualArtwork,
    frameStyle: FrameStyleId,
    scaleFactor = 1.0
  ): THREE.Group {
    const group = new THREE.Group();
    group.name = `artwork-${artwork.id}`;

    // Dimensions in meters (1 cm = 0.01 m)
    const baseW = cmToMeters(artwork.widthCm) * scaleFactor;
    const baseH = cmToMeters(artwork.heightCm) * scaleFactor;
    const baseD = cmToMeters(artwork.depthCm || 3.5) * scaleFactor;

    // Frame border width
    const frameBorder = frameStyle === 'none' ? 0.015 : 0.06 * scaleFactor;
    const totalW = baseW + frameBorder * 2;
    const totalH = baseH + frameBorder * 2;
    const totalD = baseD + (frameStyle === 'none' ? 0.01 : 0.03 * scaleFactor);

    // 1. Frame Mesh
    let frameColor = 0x222222;
    let frameRoughness = 0.4;
    let frameMetalness = 0.1;

    if (frameStyle === 'ornate-gold') {
      frameColor = 0xc9a94f;
      frameRoughness = 0.25;
      frameMetalness = 0.85;
    } else if (frameStyle === 'carved-walnut') {
      frameColor = 0x3d2716;
      frameRoughness = 0.7;
      frameMetalness = 0.05;
    } else if (frameStyle === 'natural-oak') {
      frameColor = 0xc2a379;
      frameRoughness = 0.6;
      frameMetalness = 0.05;
    } else if (frameStyle === 'white-minimal') {
      frameColor = 0xf0eeea;
      frameRoughness = 0.35;
      frameMetalness = 0.05;
    } else if (frameStyle === 'classic-black') {
      frameColor = 0x141414;
      frameRoughness = 0.3;
      frameMetalness = 0.1;
    } else {
      // Frameless canvas wrap
      frameColor = 0x1a1816;
      frameRoughness = 0.8;
      frameMetalness = 0.0;
    }

    const frameGeo = new THREE.BoxGeometry(totalW, totalH, totalD);
    const frameMat = new THREE.MeshStandardMaterial({
      color: frameColor,
      roughness: frameRoughness,
      metalness: frameMetalness,
    });
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    frameMesh.position.set(0, 0, -totalD / 2);
    frameMesh.castShadow = true;
    frameMesh.receiveShadow = false;
    group.add(frameMesh);

    // 2. Artwork Canvas Face
    const textureLoader = new THREE.TextureLoader();
    const artTexture = textureLoader.load(artwork.imageUrl);
    artTexture.colorSpace = THREE.SRGBColorSpace;

    const canvasGeo = new THREE.PlaneGeometry(baseW, baseH);
    const canvasMat = new THREE.MeshStandardMaterial({
      map: artTexture,
      roughness: 0.4,
      metalness: 0.05,
    });
    const canvasMesh = new THREE.Mesh(canvasGeo, canvasMat);
    canvasMesh.position.set(0, 0, 0.001); // slightly in front of frame
    group.add(canvasMesh);

    // 3. Ambient Wall Drop Shadow Quad
    const shadowGeo = new THREE.PlaneGeometry(totalW * 1.15, totalH * 1.15);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.position.set(0, -0.02 * totalH, -totalD - 0.002);
    group.add(shadowMesh);

    return group;
  }

  /**
   * Cleanly disposes Three.js Object3D resources to prevent memory leaks
   */
  public static disposeGroup(group: THREE.Group): void {
    group.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => {
            if ((m as any).map) (m as any).map.dispose();
            m.dispose();
          });
        } else if (mesh.material) {
          if ((mesh.material as any).map) (mesh.material as any).map.dispose();
          mesh.material.dispose();
        }
      }
    });
  }
}
