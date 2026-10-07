import { useRef, useMemo, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, RoundedBox, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { useGalleryStore } from '../../store/galleryStore'
import { MUSEUM_COLLECTION, type ArtworkData, type FrameStyle, type ArtworkImageKey } from '../../data/museumCollection'

// Preload all 5 reference artwork images
useTexture.preload('/artworks/ref_1.png')
useTexture.preload('/artworks/ref_2.png')
useTexture.preload('/artworks/ref_3.png')
useTexture.preload('/artworks/ref_4.png')
useTexture.preload('/artworks/ref_5.png')

// ── Physical 3D Classical Antique Frames ───────────────────────────────────
function ClassicalArtFrame({
  width,
  height,
  style,
}: {
  width: number
  height: number
  style: FrameStyle
}) {
  const { frameMat, border, depth } = useMemo(() => {
    if (style === 'rococo-gilt') {
      return {
        frameMat: new THREE.MeshStandardMaterial({
          color: '#D4AF37',
          roughness: 0.2,
          metalness: 0.85,
        }),
        border: 0.16,
        depth: 0.12,
      }
    } else if (style === 'carved-walnut') {
      return {
        frameMat: new THREE.MeshStandardMaterial({
          color: '#3B2414',
          roughness: 0.45,
          metalness: 0.1,
        }),
        border: 0.14,
        depth: 0.1,
      }
    } else if (style === 'antique-bronze') {
      return {
        frameMat: new THREE.MeshStandardMaterial({
          color: '#7D6346',
          roughness: 0.35,
          metalness: 0.75,
        }),
        border: 0.12,
        depth: 0.09,
      }
    } else if (style === 'ebony-bevel') {
      return {
        frameMat: new THREE.MeshStandardMaterial({
          color: '#1C1A1A',
          roughness: 0.3,
          metalness: 0.3,
        }),
        border: 0.12,
        depth: 0.08,
      }
    } else {
      // ornate-gold (default)
      return {
        frameMat: new THREE.MeshStandardMaterial({
          color: '#C9A94F',
          roughness: 0.25,
          metalness: 0.8,
        }),
        border: 0.14,
        depth: 0.1,
      }
    }
  }, [style])

  const innerGoldSlip = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#E8D5A0',
        roughness: 0.2,
        metalness: 0.9,
      }),
    []
  )

  return (
    <group position={[0, 0, depth / 2]}>
      {/* Outer Main Bevel Frame Bars */}
      {/* Top Bar */}
      <mesh position={[0, height / 2 + border / 2, 0]} castShadow>
        <boxGeometry args={[width + border * 2, border, depth]} />
        <primitive object={frameMat} attach="material" />
      </mesh>
      {/* Bottom Bar */}
      <mesh position={[0, -height / 2 - border / 2, 0]} castShadow>
        <boxGeometry args={[width + border * 2, border, depth]} />
        <primitive object={frameMat} attach="material" />
      </mesh>
      {/* Left Bar */}
      <mesh position={[-width / 2 - border / 2, 0, 0]} castShadow>
        <boxGeometry args={[border, height, depth]} />
        <primitive object={frameMat} attach="material" />
      </mesh>
      {/* Right Bar */}
      <mesh position={[width / 2 + border / 2, 0, 0]} castShadow>
        <boxGeometry args={[border, height, depth]} />
        <primitive object={frameMat} attach="material" />
      </mesh>

      {/* Inner Gilded Sight Edge (Slip) */}
      <mesh position={[0, height / 2 + 0.015, depth * 0.2]}>
        <boxGeometry args={[width + 0.04, 0.03, depth * 0.6]} />
        <primitive object={innerGoldSlip} attach="material" />
      </mesh>
      <mesh position={[0, -height / 2 - 0.015, depth * 0.2]}>
        <boxGeometry args={[width + 0.04, 0.03, depth * 0.6]} />
        <primitive object={innerGoldSlip} attach="material" />
      </mesh>
      <mesh position={[-width / 2 - 0.015, 0, depth * 0.2]}>
        <boxGeometry args={[0.03, height, depth * 0.6]} />
        <primitive object={innerGoldSlip} attach="material" />
      </mesh>
      <mesh position={[width / 2 + 0.015, 0, depth * 0.2]}>
        <boxGeometry args={[0.03, height, depth * 0.6]} />
        <primitive object={innerGoldSlip} attach="material" />
      </mesh>

      {/* Decorative Corner Filigrees for Rococo & Ornate frames */}
      {(style === 'rococo-gilt' || style === 'ornate-gold') && (
        <>
          {[
            [-width / 2 - border / 2, height / 2 + border / 2],
            [width / 2 + border / 2, height / 2 + border / 2],
            [-width / 2 - border / 2, -height / 2 - border / 2],
            [width / 2 + border / 2, -height / 2 - border / 2],
          ].map(([cx, cy], i) => (
            <mesh key={i} position={[cx, cy, depth * 0.55]} castShadow>
              <boxGeometry args={[border * 1.3, border * 1.3, depth * 0.35]} />
              <meshStandardMaterial color="#E8D5A0" roughness={0.15} metalness={0.9} />
            </mesh>
          ))}
        </>
      )}
    </group>
  )
}

// ── Antique Brass Picture Lamp ─────────────────────────────────────────────
function AntiquePictureLamp({ width, height }: { width: number; height: number }) {
  const lampY = height / 2 + 0.32
  const lampZ = 0.38

  return (
    <group position={[0, lampY, lampZ]}>
      {/* Wall Bracket & Goose Neck Rods */}
      <mesh position={[0, -0.1, -lampZ * 0.8]} castShadow>
        <boxGeometry args={[0.12, 0.15, 0.04]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[-width * 0.18, 0, -lampZ * 0.4]} rotation={[0.4, 0, 0]} castShadow>
        <cylinderGeometry args={[0.008, 0.008, lampZ * 1.1, 8]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[width * 0.18, 0, -lampZ * 0.4]} rotation={[0.4, 0, 0]} castShadow>
        <cylinderGeometry args={[0.008, 0.008, lampZ * 1.1, 8]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Brass Hood / Shade */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.04, 0.06, Math.min(width * 0.7, 1.4), 16]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Warm Downward Spotlight */}
      <spotLight
        position={[0, 0, 0]}
        target-position={[0, -height * 0.5, -lampZ]}
        intensity={16}
        angle={0.7}
        penumbra={0.6}
        color="#FFF6E5"
      />
    </group>
  )
}

// ── Interactive Single Museum Painting Component ───────────────────────────
function MuseumPaintingItem({
  artwork,
  texture,
}: {
  artwork: ArtworkData
  texture: THREE.Texture
}) {
  const { id, title, artist, year, width, height, position, rotation, frameStyle, hasSpotlight } = artwork

  const inspectArtwork = useGalleryStore((s) => s.inspectArtwork)
  const isInspecting = useGalleryStore((s) => s.inspectingArtwork?.id === id)

  const groupRef = useRef<THREE.Group>(null!)
  const canvasMatRef = useRef<THREE.MeshStandardMaterial>(null!)
  const isHovered = useRef(false)

  const handleInspect = (e: any) => {
    e.stopPropagation()
    inspectArtwork(artwork)
  }

  // Smooth, fast responsive damping matching park page behavior (smooth without delay)
  useFrame((_, delta) => {
    if (!groupRef.current) return
    const safeDelta = Math.min(delta, 0.05)

    if (!isInspecting) {
      const targetScale = isHovered.current ? 1.025 : 1.0
      const curScale = groupRef.current.scale.x
      const nextScale = THREE.MathUtils.damp(curScale, targetScale, 18, safeDelta)
      groupRef.current.scale.setScalar(nextScale)

      if (canvasMatRef.current) {
        const targetEmissive = isHovered.current ? 0.38 : 0.25
        canvasMatRef.current.emissiveIntensity = THREE.MathUtils.damp(
          canvasMatRef.current.emissiveIntensity,
          targetEmissive,
          18,
          safeDelta
        )
      }
    }
  })

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation as unknown as THREE.Euler}
    >
      {/* Antique Brass Picture Lamp */}
      {hasSpotlight && <AntiquePictureLamp width={width} height={height} />}

      {/* Actual Physical Painting Canvas Mesh with High Fidelity Texture */}
      <mesh castShadow receiveShadow position={[0, 0, 0.04]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          ref={canvasMatRef}
          map={texture}
          roughness={0.3}
          metalness={0.0}
          emissive="#FFFFFF"
          emissiveMap={texture}
          emissiveIntensity={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Classical Physical Carved/Gilded 3D Frame */}
      <ClassicalArtFrame width={width} height={height} style={frameStyle} />

      {/* Engraved Museum Brass Plaque */}
      <group position={[0, -height / 2 - 0.22, 0.04]}>
        <RoundedBox args={[Math.min(width * 0.75, 2.6), 0.16, 0.015]} radius={0.01} castShadow>
          <meshStandardMaterial color="#1E1914" roughness={0.4} metalness={0.4} />
        </RoundedBox>
        {/* Brass Border Rim */}
        <mesh position={[0, 0, 0.008]}>
          <planeGeometry args={[Math.min(width * 0.75, 2.6) - 0.02, 0.14]} />
          <meshStandardMaterial color="#2B2218" roughness={0.5} />
        </mesh>
        <Text
          position={[0, 0.025, 0.012]}
          fontSize={0.045}
          color="#D4AF37"
          anchorX="center"
          anchorY="middle"
          maxWidth={Math.min(width * 0.7, 2.4)}
        >
          {title}
        </Text>
        <Text
          position={[0, -0.035, 0.012]}
          fontSize={0.03}
          color="#A39682"
          anchorX="center"
          anchorY="middle"
          maxWidth={Math.min(width * 0.7, 2.4)}
        >
          {artist} · {year}
        </Text>
      </group>

      {/* Dedicated Clean Interaction Hit-Surface (prevents nested mesh flickering and stuck states) */}
      <mesh
        position={[0, -0.05, 0.07]}
        onClick={handleInspect}
        onPointerOver={(e) => {
          e.stopPropagation()
          isHovered.current = true
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          isHovered.current = false
          document.body.style.cursor = 'auto'
        }}
        onPointerCancel={() => {
          isHovered.current = false
          document.body.style.cursor = 'auto'
        }}
      >
        <planeGeometry args={[width + 0.32, height + 0.52]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  )
}

// ── Complete Paintings Gallery Collection Component ────────────────────────
function PaintingGalleryContent() {
  const textures = useTexture({
    ref_1: '/artworks/ref_1.png',
    ref_2: '/artworks/ref_2.png',
    ref_3: '/artworks/ref_3.png',
    ref_4: '/artworks/ref_4.png',
    ref_5: '/artworks/ref_5.png',
  })

  // Ensure sRGB color space for all loaded textures
  useMemo(() => {
    Object.values(textures).forEach((tex) => {
      tex.colorSpace = THREE.SRGBColorSpace
      tex.generateMipmaps = true
      tex.minFilter = THREE.LinearMipmapLinearFilter
      tex.magFilter = THREE.LinearFilter
      tex.needsUpdate = true
    })
  }, [textures])

  return (
    <group>
      {MUSEUM_COLLECTION.map((artwork) => (
        <MuseumPaintingItem
          key={artwork.id}
          artwork={artwork}
          texture={textures[artwork.imageKey]}
        />
      ))}
    </group>
  )
}

export function PaintingGallery() {
  return (
    <Suspense fallback={null}>
      <PaintingGalleryContent />
    </Suspense>
  )
}
