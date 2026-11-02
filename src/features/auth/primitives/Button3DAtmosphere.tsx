import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useReducedMotion } from './useReducedMotion';

export interface Button3DAtmosphereProps {
  status?: 'idle' | 'loading' | 'success' | 'error';
  isHovered?: boolean;
}

/**
 * Button3DAtmosphere
 * Dedicated Three.js interactive 3D golden particle aura for the submit button.
 * - Golden stardust & diamond-dust motes orbit the pill shape in 3D perspective
 * - Particles spring toward cursor when hovering
 * - Accelerates into a celestial vortex during 'loading'
 * - Bursts outward during 'success'
 * - Automatically disposes resources on unmount
 */
export const Button3DAtmosphere: React.FC<Button3DAtmosphereProps> = ({
  status = 'idle',
  isHovered = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isReduced = useReducedMotion();
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, active: false });

  useEffect(() => {
    if (isReduced || !containerRef.current) return;

    const container = containerRef.current;
    let width = container.clientWidth || 320;
    let height = container.clientHeight || 64;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'low-power',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // 2. Procedural Glow Sprite Texture
    const spriteCanvas = document.createElement('canvas');
    spriteCanvas.width = 32;
    spriteCanvas.height = 32;
    const ctx = spriteCanvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.25, 'rgba(255, 235, 165, 0.95)');
      grad.addColorStop(0.6, 'rgba(229, 169, 28, 0.45)');
      grad.addColorStop(1, 'rgba(229, 169, 28, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);
    }
    const particleTexture = new THREE.CanvasTexture(spriteCanvas);

    // 3. Golden Stardust Particles
    const PARTICLE_COUNT = 48;
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);

    const orbitAngles: number[] = [];
    const orbitRadiiX: number[] = [];
    const orbitRadiiY: number[] = [];
    const orbitSpeeds: number[] = [];
    const baseZ: number[] = [];

    const colorPalette = [
      new THREE.Color('#FFFFFF'), // Diamond spark
      new THREE.Color('#FBE6A2'), // Champagne
      new THREE.Color('#E5A91C'), // Imperial Gold
      new THREE.Color('#DFBE7E'), // Satin Gold
      new THREE.Color('#FFAA00'), // Amber
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
      const rx = 4.2 + (Math.random() - 0.5) * 1.6;
      const ry = 0.95 + (Math.random() - 0.5) * 0.5;

      positions[i * 3] = Math.cos(angle) * rx;
      positions[i * 3 + 1] = Math.sin(angle) * ry;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1.5;

      const col = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      sizes[i] = 0.35 + Math.random() * 0.45;

      orbitAngles.push(angle);
      orbitRadiiX.push(rx);
      orbitRadiiY.push(ry);
      orbitSpeeds.push(0.015 + Math.random() * 0.02);
      baseZ.push(positions[i * 3 + 2]);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.55,
      map: particleTexture,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    // 4. Mouse movement tracking
    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = nx * 3.5;
      mouseRef.current.targetY = ny * 1.2;
      mouseRef.current.active = true;
    };

    const handlePointerLeave = () => {
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
      mouseRef.current.active = false;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    container.addEventListener('pointerleave', handlePointerLeave);

    // 5. Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (document.hidden) return;

      const delta = clock.getDelta();
      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      // Smooth mouse spring interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.1;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.1;

      const isCurrentLoading = status === 'loading';
      const isCurrentSuccess = status === 'success';
      const speedMultiplier = isCurrentLoading ? 4.5 : isHovered ? 2.2 : 1.0;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        orbitAngles[i] += orbitSpeeds[i] * speedMultiplier;
        const angle = orbitAngles[i];

        if (isCurrentLoading) {
          // Tight celestial vortex around center
          const tightR = 1.1 + Math.sin(angle * 3 + clock.getElapsedTime() * 4) * 0.3;
          posArray[i * 3] = Math.cos(angle) * tightR;
          posArray[i * 3 + 1] = Math.sin(angle) * tightR * 0.6;
          posArray[i * 3 + 2] = Math.sin(angle * 2) * 1.2;
        } else if (isCurrentSuccess) {
          // Burst outwards
          posArray[i * 3] *= 1.04;
          posArray[i * 3 + 1] *= 1.04;
          posArray[i * 3 + 2] += 0.05;
        } else {
          // Normal elegant orbit with cursor pull
          const rx = orbitRadiiX[i] * (isHovered ? 1.12 : 1.0);
          const ry = orbitRadiiY[i] * (isHovered ? 1.2 : 1.0);

          let targetX = Math.cos(angle) * rx;
          let targetY = Math.sin(angle) * ry;
          let targetZ = baseZ[i] + Math.sin(clock.getElapsedTime() * 2 + i) * 0.3;

          // Pull toward cursor if active
          if (mouseRef.current.active) {
            targetX += mouseRef.current.x * 0.45;
            targetY += mouseRef.current.y * 0.45;
          }

          posArray[i * 3] += (targetX - posArray[i * 3]) * 0.08;
          posArray[i * 3 + 1] += (targetY - posArray[i * 3 + 1]) * 0.08;
          posArray[i * 3 + 2] += (targetZ - posArray[i * 3 + 2]) * 0.08;
        }
      }

      posAttr.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    // 6. Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);

      geometry.dispose();
      material.dispose();
      particleTexture.dispose();
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isReduced, status, isHovered]);

  if (isReduced) return null;

  return (
    <div
      ref={containerRef}
      className="absolute -inset-x-8 -inset-y-4 pointer-events-none z-0 overflow-visible"
      aria-hidden="true"
    />
  );
};

export default Button3DAtmosphere;

