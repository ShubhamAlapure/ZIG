import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ── Static Caches for Max Loading Speed ─────────────────────────────────────
let cachedParquetTexture: THREE.CanvasTexture | null = null

function getParquetTexture(): THREE.CanvasTexture {
  if (cachedParquetTexture) return cachedParquetTexture

  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')!

  // Warm aged oak wood base
  ctx.fillStyle = '#2C1D13'
  ctx.fillRect(0, 0, 512, 512)

  // Herringbone planks pattern
  const plankW = 32
  const plankH = 128

  for (let y = -128; y < 640; y += 64) {
    for (let x = -128; x < 640; x += 64) {
      const isDiag1 = (Math.floor((x + y) / 64)) % 2 === 0
      const tone = 20 + Math.floor(Math.sin(x * 0.1) * 8 + Math.cos(y * 0.1) * 8)

      ctx.fillStyle = isDiag1
        ? `rgb(${48 + tone}, ${32 + tone}, ${20 + tone})`
        : `rgb(${40 + tone}, ${26 + tone}, ${16 + tone})`
      ctx.fillRect(x, y, plankW, plankH)

      // Plank bevel seams
      ctx.strokeStyle = 'rgba(10, 6, 4, 0.4)'
      ctx.lineWidth = 1.5
      ctx.strokeRect(x, y, plankW, plankH)
    }
  }

  // Subtle varnish sheen & historical wear
  for (let i = 0; i < 800; i++) {
    ctx.fillStyle = `rgba(${Math.random() > 0.5 ? '255, 240, 200' : '0, 0, 0'}, ${Math.random() * 0.04})`
    ctx.fillRect(Math.random() * 512, Math.random() * 512, 3, 3)
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(20, 32)
  tex.colorSpace = THREE.SRGBColorSpace
  cachedParquetTexture = tex
  return tex
}

const STATIC_MARBLE_BORDER_MAT = new THREE.MeshStandardMaterial({
  color: '#DFD7CA',
  roughness: 0.25,
  metalness: 0.1,
})

// ── Historic European Herringbone Parquet & Marble Floor ───────────────────
export function ClassicalMuseumFloor() {
  const parquetTexture = useMemo(() => getParquetTexture(), [])

  const parquetMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: parquetTexture,
        roughness: 0.35,
        metalness: 0.05,
      }),
    [parquetTexture]
  )

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Main Continuous Master Hall Parquet Floor (36m × 60m) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[36.0, 60.0]} />
        <primitive object={parquetMat} attach="material" />
      </mesh>

      {/* 2. Perimeter Breccia Marble Border Band */}
      {/* North Border */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, -29.2]}>
        <planeGeometry args={[35.6, 0.8]} />
        <primitive object={STATIC_MARBLE_BORDER_MAT} attach="material" />
      </mesh>
      {/* South Border */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 29.2]}>
        <planeGeometry args={[35.6, 0.8]} />
        <primitive object={STATIC_MARBLE_BORDER_MAT} attach="material" />
      </mesh>
      {/* West Border */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-17.2, 0.003, 0]}>
        <planeGeometry args={[0.8, 59.2]} />
        <primitive object={STATIC_MARBLE_BORDER_MAT} attach="material" />
      </mesh>
      {/* East Border */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[17.2, 0.003, 0]}>
        <planeGeometry args={[0.8, 59.2]} />
        <primitive object={STATIC_MARBLE_BORDER_MAT} attach="material" />
      </mesh>

      {/* 3. Central Nave Marble Inlay Rings */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, -18]}>
        <ringGeometry args={[4.2, 4.6, 32]} />
        <primitive object={STATIC_MARBLE_BORDER_MAT} attach="material" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <ringGeometry args={[5.2, 5.7, 36]} />
        <primitive object={STATIC_MARBLE_BORDER_MAT} attach="material" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 18]}>
        <ringGeometry args={[4.2, 4.6, 32]} />
        <primitive object={STATIC_MARBLE_BORDER_MAT} attach="material" />
      </mesh>
    </group>
  )
}

// ── Sunbeam & Chandelier Floating Dust Motes ────────────────────────────────
export function FloatingDustMotes({
  count = 120,
}: {
  count?: number
}) {
  const pointsRef = useRef<THREE.Points>(null!)

  const [positions, offsets, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const off = new Float32Array(count)
    const spd = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 34
      pos[i * 3 + 1] = 0.5 + Math.random() * 7.5
      pos[i * 3 + 2] = (Math.random() - 0.5) * 58
      off[i] = Math.random() * Math.PI * 2
      spd[i] = 0.2 + Math.random() * 0.6
    }
    return [pos, off, spd]
  }, [count])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }, [positions])

  useFrame(({ clock }) => {
    if (!pointsRef.current) return
    const t = clock.elapsedTime
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const arr = posAttr.array as Float32Array

    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += Math.sin(t * speeds[i] + offsets[i]) * 0.003 + 0.001
      if (arr[i * 3 + 1] > 8.5) arr[i * 3 + 1] = 0.8
      arr[i * 3 + 0] += Math.cos(t * 0.3 + offsets[i]) * 0.002
      arr[i * 3 + 2] += Math.sin(t * 0.25 + offsets[i]) * 0.002
    }
    posAttr.needsUpdate = true
  })

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color="#FFECC2"
        size={0.05}
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}
