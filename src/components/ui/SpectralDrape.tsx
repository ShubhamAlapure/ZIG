import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export interface SpectralDrapeProps {
  mood?: 'park' | 'museum';
  className?: string;
  isFocused?: boolean;
  intensity?: number;
}

export const SpectralDrape: React.FC<SpectralDrapeProps> = ({
  mood = 'park',
  className = '',
  isFocused = false,
  intensity = 1.0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animId: number;
    let renderer: THREE.WebGLRenderer | null = null;
    let geometry: THREE.BufferGeometry | null = null;
    let material: THREE.ShaderMaterial | null = null;

    // Track normalised cursor/touch position (NDC: -1 to 1)
    const mouse = new THREE.Vector2(9999, 9999);
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        mouse.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        mouse.y = -((e.touches[0].clientY / window.innerHeight) * 2 - 1);
      }
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchMove, { passive: true });

    try {
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;
      const aspect = width / height;
      const isPortrait = aspect < 1.0;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 100);
      // In portrait/mobile, position camera centered behind the bottom 60% form panel so the full golden curtain is visible
      if (isPortrait) {
        camera.position.set(0, -2.4, 16.5);
        camera.lookAt(0, -2.4, 0);
      } else {
        camera.position.set(0, 0, 15);
        camera.lookAt(0, 0, 0);
      }

      renderer = new THREE.WebGLRenderer({
        alpha: false,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height);
      renderer.setClearColor(0xfcfbf8, 1);

      const canvas = renderer.domElement;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.position = 'absolute';
      canvas.style.inset = '0';
      canvas.style.display = 'block';
      container.appendChild(canvas);

      const isMobile = window.innerWidth < 768;
      const cols = isMobile ? (mood === 'museum' ? 76 : 68) : mood === 'museum' ? 92 : 80;
      const rows = isMobile ? (mood === 'museum' ? 58 : 52) : mood === 'museum' ? 68 : 58;
      const totalPoints = cols * rows;

      const positions = new Float32Array(totalPoints * 3);
      const alphas = new Float32Array(totalPoints);

      const spanX = isPortrait ? 26 : 24;
      const spanY = isPortrait ? 22 : 18;

      let idx = 0;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const u = i / (cols - 1);
          const v = j / (rows - 1);
          const x = (u - 0.5) * spanX;
          const y = (v - 0.5) * spanY + (isPortrait ? -2.4 : 0);

          positions[idx * 3] = x;
          positions[idx * 3 + 1] = y;
          positions[idx * 3 + 2] = 0;

          const edgeDist = Math.min(u, 1 - u, v, 1 - v) * 3.5;
          alphas[idx] = Math.min(0.95, Math.max(0.35, edgeDist));
          idx++;
        }
      }

      geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));

      const brandGold = new THREE.Color(mood === 'park' ? '#D4A70E' : '#C59B27');
      const baseSpeed = mood === 'park' ? 0.65 : 0.50;
      const baseAmplitude = mood === 'park' ? 1.25 : 1.50;
      const baseDotSize = (mood === 'park' ? 5.8 : 6.4) * Math.min(window.devicePixelRatio || 1, 2);

      const uniforms = {
        uTime:          { value: 0 },
        uSpeed:         { value: baseSpeed },
        uAmplitude:     { value: baseAmplitude },
        uColor:         { value: brandGold },
        uDotSize:       { value: baseDotSize },
        uIntensity:     { value: intensity },
        uFocus:         { value: isFocused ? 1.0 : 0.0 },
        uMouse:         { value: new THREE.Vector2(9999, 9999) },
        uMouseRadius:   { value: 3.2 },   // world-space radius of cursor ripple
        uMouseStrength: { value: 0.30 },  // gentle displacement — "a bit, not much"
      };

      const vertexShader = `
        uniform float uTime;
        uniform float uSpeed;
        uniform float uAmplitude;
        uniform float uDotSize;
        uniform float uFocus;
        uniform vec2  uMouse;
        uniform float uMouseRadius;
        uniform float uMouseStrength;
        attribute float alpha;
        varying float vAlpha;
        varying float vMouseProx;

        void main() {
          vAlpha = alpha;
          vec3 pos = position;

          // 3D undulating Spectral Drape curtain folds
          float t = uTime * uSpeed;
          float w1 = sin(pos.x * 0.48 + t * 0.85) * cos(pos.y * 0.42 + t * 0.65);
          float w2 = sin(pos.x * 0.95 - pos.y * 0.75 + t * 1.15) * 0.45;
          float w3 = cos(pos.x * 0.28 + pos.y * 0.62 + t * 0.45) * 0.85;
          float ripple = sin((pos.x * 0.65 + pos.y * 0.65) + t * 1.3) * 0.35;
          pos.z = (w1 + w2 + w3 + ripple) * uAmplitude * (1.0 + uFocus * 0.15);
          pos.x += sin(pos.y * 0.35 + t * 0.35) * 0.35;

          // Convert NDC mouse to rough world-space (fov 50, z=0 plane, camera at z=15)
          // half-height at z=0 ≈ tan(25°) * 15 ≈ 6.99, half-width = aspect * that
          vec2 worldMouse = uMouse * vec2(12.0, 9.0);
          vec2 diff = pos.xy - worldMouse;
          float dist = length(diff);
          float falloff = 1.0 - smoothstep(0.0, uMouseRadius, dist);
          vMouseProx = falloff;

          // Subtle outward nudge — dots part gently for the cursor
          if (dist > 0.001) {
            pos.xy += normalize(diff) * falloff * uMouseStrength;
          }

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          float depthFactor = (18.0 / -mvPosition.z);
          // Dots near cursor grow ever so slightly
          gl_PointSize = uDotSize * depthFactor * (1.0 + uFocus * 0.15) * (1.0 + falloff * 0.20);
        }
      `;

      const fragmentShader = `
        uniform vec3  uColor;
        uniform float uIntensity;
        uniform float uFocus;
        varying float vAlpha;
        varying float vMouseProx;

        void main() {
          vec2 coord = gl_PointCoord - vec2(0.5);
          float dist = length(coord);
          if (dist > 0.5) discard;

          float core = smoothstep(0.42, 0.05, dist);
          float halo = smoothstep(0.50, 0.12, dist) * 0.55;
          float alpha = (core * 0.92 + halo * 0.45) * vAlpha * uIntensity;

          // Dots near cursor brighten toward vivid gold
          vec3 brightGold = vec3(1.0, 0.82, 0.10);
          vec3 baseColor = mix(uColor, vec3(0.68, 0.50, 0.12), (1.0 - core) * 0.30);
          vec3 finalColor = mix(baseColor, brightGold, vMouseProx * 0.55);

          alpha = min(alpha * (1.0 + vMouseProx * 0.45), 1.0);
          gl_FragColor = vec4(finalColor, alpha);
        }
      `;

      material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending,
      });

      const pointsMesh = new THREE.Points(geometry, material);
      scene.add(pointsMesh);

      let lastTime = performance.now();
      let isPaused = false;

      // Smoothly lerp displayed mouse to actual mouse for a soft trailing feel
      const smoothMouse = new THREE.Vector2(9999, 9999);

      const animate = (now: number) => {
        animId = requestAnimationFrame(animate);
        if (isPaused) return;

        const delta = (now - lastTime) * 0.001;
        lastTime = now;

        // Soft mouse follow (lag makes it feel organic)
        smoothMouse.x += (mouse.x - smoothMouse.x) * 0.07;
        smoothMouse.y += (mouse.y - smoothMouse.y) * 0.07;
        uniforms.uMouse.value.copy(smoothMouse);

        const targetFocus = isFocused ? 1.0 : 0.0;
        uniforms.uFocus.value += (targetFocus - uniforms.uFocus.value) * 0.08;

        uniforms.uTime.value += delta;
        pointsMesh.rotation.z = Math.sin(uniforms.uTime.value * 0.06) * 0.025;

        renderer?.render(scene, camera);
      };

      animId = requestAnimationFrame(animate);

      const handleVisibility = () => {
        isPaused = document.visibilityState === 'hidden';
        if (!isPaused) lastTime = performance.now();
      };
      document.addEventListener('visibilitychange', handleVisibility);

      const handleResize = () => {
        if (!container || !renderer) return;
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        const asp = w / h;
        camera.aspect = asp;
        if (asp < 1.0) {
          camera.position.set(0, -2.4, 16.5);
          camera.lookAt(0, -2.4, 0);
        } else {
          camera.position.set(0, 0, 15);
          camera.lookAt(0, 0, 0);
        }
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', handleResize);

      return () => {
        cancelAnimationFrame(animId);
        document.removeEventListener('visibilitychange', handleVisibility);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchstart', handleTouchMove);
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
        geometry?.dispose();
        material?.dispose();
        renderer?.dispose();
      };
    } catch (e) {
      console.error('WebGL Spectral Drape initialization error:', e);
    }
  }, [mood, intensity, isFocused]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none bg-[#FCFBF8] ${className}`}
      aria-hidden="true"
    />
  );
};

export default SpectralDrape;
