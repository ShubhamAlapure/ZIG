import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useReducedMotion } from './useReducedMotion';

export interface Form3DAtmosphereProps {
  className?: string;
  intensity?: number;
}

/**
 * Form3DAtmosphere
 * Lightweight, playful Three.js 3D atmospheric glass scene that floats
 * refractive glass bubbles and iridescent golden spheres around the form.
 * Follows mouse pointer gently; fully disposes on unmount; pauses when document hidden.
 */
export const Form3DAtmosphere: React.FC<Form3DAtmosphereProps> = ({
  className = '',
  intensity = 1,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isReduced = useReducedMotion();

  useEffect(() => {
    if (isReduced || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 380;
    const height = container.clientHeight || 520;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'low-power',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xfff7e6, 1.2);
    scene.add(ambientLight);

    const goldPointLight = new THREE.PointLight(0xe5a91c, 2.4, 30);
    goldPointLight.position.set(0, 4, 10);
    scene.add(goldPointLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.6);
    rimLight.position.set(-8, 12, 10);
    scene.add(rimLight);

    // 3. Playful Floating Glass & Golden Orbs
    const sphereCount = Math.round(9 * intensity);
    const spheres: {
      mesh: THREE.Mesh;
      baseX: number;
      baseY: number;
      baseZ: number;
      speed: number;
      amp: number;
      rotSpeed: number;
    }[] = [];

    const geom = new THREE.SphereGeometry(1, 32, 32);

    // Glass material with translucency and golden iridescence
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.88,
      opacity: 0.8,
      transparent: true,
      roughness: 0.08,
      ior: 1.45,
      reflectivity: 0.6,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });

    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xe5a91c,
      roughness: 0.22,
      metalness: 0.85,
      transparent: true,
      opacity: 0.82,
    });

    for (let i = 0; i < sphereCount; i++) {
      const isGold = i % 3 === 0;
      const radius = 0.45 + Math.random() * 0.7;
      const mesh = new THREE.Mesh(geom, isGold ? goldMaterial : glassMaterial);
      mesh.scale.setScalar(radius);

      const baseX = (Math.random() - 0.5) * 14;
      const baseY = (Math.random() - 0.5) * 18;
      const baseZ = -2 + Math.random() * 6;

      mesh.position.set(baseX, baseY, baseZ);
      scene.add(mesh);

      spheres.push({
        mesh,
        baseX,
        baseY,
        baseZ,
        speed: 0.8 + Math.random() * 1.2,
        amp: 0.5 + Math.random() * 0.9,
        rotSpeed: (Math.random() - 0.5) * 0.02,
      });
    }

    // 4. Mouse Tracking for Interactive Drift
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetMouseX = x * 3;
      targetMouseY = -y * 3;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 5. Responsive Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 6. Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (document.hidden) return;

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse interpolation
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      goldPointLight.position.x = currentMouseX * 4;
      goldPointLight.position.y = currentMouseY * 4 + 4;

      // Float spheres playfully
      spheres.forEach((s, idx) => {
        const t = elapsedTime * s.speed + idx;
        s.mesh.position.y = s.baseY + Math.sin(t) * s.amp + currentMouseY * 0.6;
        s.mesh.position.x = s.baseX + Math.cos(t * 0.7) * (s.amp * 0.5) + currentMouseX * 0.6;
        s.mesh.rotation.y += s.rotSpeed;
        s.mesh.rotation.x += s.rotSpeed * 0.5;
      });

      renderer.render(scene, camera);
    };

    animate();

    // 7. Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      geom.dispose();
      glassMaterial.dispose();
      goldMaterial.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isReduced, intensity]);

  if (isReduced) return null;

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}
      aria-hidden="true"
    />
  );
};

export default Form3DAtmosphere;

