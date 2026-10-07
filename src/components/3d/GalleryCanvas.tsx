import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, AdaptiveEvents } from '@react-three/drei'
import * as THREE from 'three'

import { PaintingGallery } from './Paintings'
import { MuseumArchitecture } from './ClassicalArchitecture'
import { ClassicalMuseumFloor, FloatingDustMotes } from './FloorAndDust'
import { CameraController } from './CameraController'
import { AudioAmbience } from './AudioAmbience'
import { GalleryVisitorsEnsemble } from './Characters'
import { LiveArtScene } from './LiveArtScene'

// ── Master Museum Lighting Design (Cinematic Historic European Atmosphere) ──
function MuseumLighting() {
  return (
    <>
      {/* Warm Ambient Gallery Glow */}
      <ambientLight intensity={2.6} color="#FFF8F0" />

      {/* Main Overhead Skylight Soft Beam into Central Rotunda */}
      <directionalLight
        position={[6, 22, 8]}
        intensity={3.2}
        color="#FFF6EB"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={120}
        shadow-camera-left={-45}
        shadow-camera-right={45}
        shadow-camera-top={45}
        shadow-camera-bottom={-45}
        shadow-bias={-0.0002}
      />

      {/* East Portrait Wing Warm Lighting */}
      <pointLight position={[30, 7.2, 0]} intensity={14} distance={28} color="#FFEACC" />

      {/* West Landscape Wing Soft Daylight */}
      <pointLight position={[-30, 7.2, 0]} intensity={14} distance={28} color="#E8F2FF" />

      {/* South Renaissance Salon Golden Glow */}
      <pointLight position={[0, 7.2, 30]} intensity={14} distance={28} color="#FFF2DB" />

      {/* North Hall of Masters Warm Gilded Illumination */}
      <directionalLight
        position={[0, 18, -28]}
        intensity={3.4}
        color="#FFF4E5"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={80}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
        shadow-bias={-0.0002}
      />
      <pointLight position={[0, 7.2, -31]} intensity={16} distance={30} color="#FFE8C7" />

      {/* Floor & Ceiling Subtle Bounce */}
      <hemisphereLight args={['#F5EEDB', '#2C1D13', 1.6]} />
    </>
  )
}

function GrandHistoricMuseumScene() {
  return (
    <>
      {/* Warm Sophisticated Historic European Background & Fog */}
      <color attach="background" args={['#16120E']} />
      <fog attach="fog" args={['#16120E', 60, 160]} />

      <MuseumLighting />
      <CameraController />
      <AudioAmbience />

      {/* Aged Herringbone Parquet & Marble Inlay Floors */}
      <ClassicalMuseumFloor />

      {/* Classical European Architecture (Rotunda, Portals, Columns, Wainscoting, Benches) */}
      <MuseumArchitecture />

      {/* 50+ Curated Historic Masterpiece Paintings with Picture Lamps & Gilded Frames */}
      <PaintingGallery />

      {/* Realistic Human Visitors / Museum Actors Ensemble */}
      <GalleryVisitorsEnsemble />

      {/* Live Impressionist Painting Studio Scene */}
      <LiveArtScene />

      {/* Floating Sunbeam Dust Motes */}
      <FloatingDustMotes count={400} />
    </>
  )
}

export function GalleryCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 1.7, 2.0], fov: 55, near: 0.1, far: 280 }}
      shadows={{ type: THREE.PCFShadowMap }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      className="w-full h-full"
    >
      <AdaptiveDpr pixelated={false} />
      <AdaptiveEvents />
      <GrandHistoricMuseumScene />
    </Canvas>
  )
}
