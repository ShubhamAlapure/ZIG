import React, { useRef, useEffect, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useActor, solveTwoBoneIK, solveLookAtIK, curlFingers } from './useActor'

const ADULT_SCALE = 1.76

// ── Palette Color Swatches ───────────────────────────────────────────────────
const OIL_COLORS = [
  '#C0392B', // Venetian Crimson
  '#D4AC0D', // Golden Ochre
  '#2980B9', // Cobalt Blue
  '#27AE60', // Viridian Green
  '#BA4A00', // Burnt Sienna
  '#8E44AD', // Deep Violet
  '#FDFEFE', // Titanium White
  '#2C3E50', // Prussian Blue
]

// ── 1. Classical Studio Tripod Easel Component ─────────────────────────────
function StudioEasel({
  position = [0, 0, 0] as [number, number, number],
  rotationY = 0,
  canvasWidth = 1.15,
  canvasHeight = 0.88,
  canvasTexture,
  canvasRef,
}: {
  position?: [number, number, number]
  rotationY?: number
  canvasWidth?: number
  canvasHeight?: number
  canvasTexture?: THREE.CanvasTexture
  canvasRef?: React.RefObject<THREE.Mesh | null>
}) {
  const beechWood = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#6E472A',
        roughness: 0.65,
        metalness: 0.05,
      }),
    []
  )

  const darkWood = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#4A2E1B',
        roughness: 0.7,
        metalness: 0.05,
      }),
    []
  )

  const brassKnobs = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#D4AF37',
        roughness: 0.25,
        metalness: 0.85,
      }),
    []
  )

  const tiltAngle = -0.12 // Gentle backward tilt for natural painting angle

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* ── Rear Tripod Leg (Struts back to floor) ── */}
      <mesh position={[0, 0.95, -0.38]} rotation={[-0.36, 0, 0]} castShadow>
        <boxGeometry args={[0.045, 2.15, 0.045]} />
        <primitive object={darkWood} attach="material" />
      </mesh>

      {/* ── Main Tilted Front Mast & A-Frame Assembly ── */}
      <group rotation={[tiltAngle, 0, 0]}>
        {/* Central Vertical Mast */}
        <mesh position={[0, 1.25, 0]} castShadow>
          <boxGeometry args={[0.06, 2.45, 0.045]} />
          <primitive object={beechWood} attach="material" />
        </mesh>

        {/* Left A-Frame Leg */}
        <mesh position={[-0.34, 1.1, 0]} rotation={[0, 0, -0.16]} castShadow>
          <boxGeometry args={[0.045, 2.3, 0.045]} />
          <primitive object={beechWood} attach="material" />
        </mesh>

        {/* Right A-Frame Leg */}
        <mesh position={[0.34, 1.1, 0]} rotation={[0, 0, 0.16]} castShadow>
          <boxGeometry args={[0.045, 2.3, 0.045]} />
          <primitive object={beechWood} attach="material" />
        </mesh>

        {/* Lower Cross Brace */}
        <mesh position={[0, 0.38, 0]} castShadow>
          <boxGeometry args={[0.82, 0.045, 0.04]} />
          <primitive object={darkWood} attach="material" />
        </mesh>

        {/* Mid Cross Brace */}
        <mesh position={[0, 0.82, 0]} castShadow>
          <boxGeometry args={[0.62, 0.04, 0.04]} />
          <primitive object={darkWood} attach="material" />
        </mesh>

        {/* Adjustable Shelf Support with Palette & Brush Well */}
        <group position={[0, 0.88, 0.055]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[canvasWidth + 0.22, 0.065, 0.14]} />
            <primitive object={darkWood} attach="material" />
          </mesh>
          {/* Front Retaining Lip */}
          <mesh position={[0, 0.04, 0.06]} castShadow>
            <boxGeometry args={[canvasWidth + 0.22, 0.035, 0.02]} />
            <primitive object={darkWood} attach="material" />
          </mesh>
          {/* Brass Adjustment Knobs */}
          {[-0.25, 0.25].map((kx, i) => (
            <mesh key={i} position={[kx, -0.04, -0.05]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.018, 0.018, 0.03, 12]} />
              <primitive object={brassKnobs} attach="material" />
            </mesh>
          ))}
        </group>

        {/* ── Stretched Canvas Board ── */}
        <group position={[0, 0.92 + canvasHeight / 2, 0.065]}>
          {/* Wooden Stretcher Frame Backing */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[canvasWidth, canvasHeight, 0.035]} />
            <meshStandardMaterial color="#E6DFD4" roughness={0.9} />
          </mesh>

          {/* Masterpiece Canvas Painting Surface */}
          <mesh ref={canvasRef as any} position={[0, 0, 0.02]}>
            <planeGeometry args={[canvasWidth - 0.04, canvasHeight - 0.04]} />
            {canvasTexture ? (
              <meshStandardMaterial map={canvasTexture} roughness={0.65} metalness={0.05} />
            ) : (
              <meshStandardMaterial color="#FAF5EB" roughness={0.8} />
            )}
          </mesh>
        </group>

        {/* Top Clamp Mast Block */}
        <mesh position={[0, 0.94 + canvasHeight, 0.065]} castShadow>
          <boxGeometry args={[0.22, 0.05, 0.1]} />
          <primitive object={darkWood} attach="material" />
        </mesh>
      </group>
    </group>
  )
}

// ── 2. Artist Supply Stool / Brush Table ──────────────────────────────────────
function ArtistSupplyTable({ position = [0, 0, 0] as [number, number, number] }) {
  const woodMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#4E311D',
        roughness: 0.6,
        metalness: 0.05,
      }),
    []
  )
  const glassMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#A9DFBF',
        roughness: 0.15,
        transmission: 0.85,
        thickness: 0.3,
      }),
    []
  )
  const ragMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#D5D8DC',
        roughness: 0.95,
      }),
    []
  )

  return (
    <group position={position}>
      {/* Small Three-Legged Wooden Table */}
      <mesh position={[0, 0.48, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.28, 0.28, 0.04, 20]} />
        <primitive object={woodMat} attach="material" />
      </mesh>
      {/* 3 Legs */}
      {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, i) => (
        <mesh
          key={i}
          position={[Math.cos(angle) * 0.2, 0.24, Math.sin(angle) * 0.2]}
          rotation={[0.08 * Math.sin(angle), 0, -0.08 * Math.cos(angle)]}
          castShadow
        >
          <cylinderGeometry args={[0.02, 0.025, 0.48, 12]} />
          <primitive object={woodMat} attach="material" />
        </mesh>
      ))}

      {/* Turpentine Jar with extra brushes */}
      <mesh position={[0.08, 0.56, 0.06]} castShadow>
        <cylinderGeometry args={[0.045, 0.04, 0.12, 16]} />
        <primitive object={glassMat} attach="material" />
      </mesh>
      {/* Paintbrush Handles sticking out of jar */}
      {[-0.15, 0.1, 0.25].map((rot, i) => (
        <mesh
          key={i}
          position={[0.08 + 0.015 * i, 0.67, 0.06 + 0.01 * i]}
          rotation={[0.2, 0, rot]}
          castShadow
        >
          <cylinderGeometry args={[0.004, 0.006, 0.22, 8]} />
          <meshStandardMaterial color="#873600" roughness={0.6} />
        </mesh>
      ))}

      {/* Paint tubes on table */}
      {OIL_COLORS.slice(0, 4).map((c, i) => (
        <mesh
          key={i}
          position={[-0.1 + 0.06 * i, 0.51, -0.05 + 0.03 * (i % 2)]}
          rotation={[0, 0.3 * i, Math.PI / 2]}
          castShadow
        >
          <cylinderGeometry args={[0.012, 0.014, 0.06, 8]} />
          <meshStandardMaterial color={c} metalness={0.5} roughness={0.3} />
        </mesh>
      ))}

      {/* Painter Cloth / Rag */}
      <mesh position={[-0.08, 0.51, 0.1]} rotation={[0, 0.4, 0]}>
        <boxGeometry args={[0.12, 0.015, 0.1]} />
        <primitive object={ragMat} attach="material" />
      </mesh>
    </group>
  )
}

// ── 3. Live Active Painting Artist (IK Controlled Painter) ──────────────────
function LivePainterActor({
  canvasRef,
  brushTipColor,
  onStroke,
}: {
  canvasRef: React.RefObject<THREE.Mesh | null>
  brushTipColor: string
  onStroke: (u: number, v: number, color: string) => void
}) {
  const actor = useActor('artist', {
    tints: { shirt: '#F4ECE1' }, // Natural linen smock dress
  })
  const groupRef = useRef<THREE.Group>(null!)

  // Palette & Paintbrush attachments
  const paletteMeshRef = useRef<THREE.Group>(null)
  const brushMeshRef = useRef<THREE.Group>(null)

  useEffect(() => {
    actor.play('Stand', { fade: 0.4, loop: true })
  }, [actor])

  // Attach props to bone hierarchy
  useEffect(() => {
    if (actor.bones.hand_l && paletteMeshRef.current) {
      actor.bones.hand_l.add(paletteMeshRef.current)
    }
    if (actor.bones.hand_r && brushMeshRef.current) {
      actor.bones.hand_r.add(brushMeshRef.current)
    }
  }, [actor])

  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime
    const bones = actor.bones

    // Natural painting motion cycle (period of 14s)
    const cycle = time % 14.0
    const canvas = canvasRef.current

    if (canvas && bones.upperarm_r && bones.lowerarm_r && bones.hand_r) {
      const canvasWorldPos = canvas.getWorldPosition(new THREE.Vector3())
      const shoulderPos = bones.upperarm_r.getWorldPosition(new THREE.Vector3())

      if (cycle < 10.5) {
        // Active Painting Mode: fluid natural brush strokes on the canvas surface
        const strokeT = time * 1.8
        const u = 0.5 + Math.sin(strokeT * 2.2) * 0.32 + Math.cos(strokeT * 0.9) * 0.12
        const v = 0.5 + Math.cos(strokeT * 1.6) * 0.28 + Math.sin(strokeT * 0.7) * 0.1

        // Canvas local to world coordinates
        const strokeLocal = new THREE.Vector3((u - 0.5) * 1.1, (0.5 - v) * 0.84, 0.03)
        const reachTarget = canvas.localToWorld(strokeLocal)

        // Pole target for elbow
        const rightVec = new THREE.Vector3(-1, 0, 0).applyQuaternion(actor.root.quaternion)
        const polePos = shoulderPos
          .clone()
          .add(new THREE.Vector3(0, -0.4, 0))
          .addScaledVector(rightVec, 0.35)

        solveTwoBoneIK(bones.upperarm_r, bones.lowerarm_r, bones.hand_r, reachTarget, polePos, 0.95)
        curlFingers(bones, 'r', 0.65)

        // Inform canvas texture of continuous stroke
        onStroke(u, v, brushTipColor)

        // Gaze squarely focuses on brush tip contact
        if (bones.neck_01 && bones.Head) {
          solveLookAtIK(bones.neck_01, bones.Head, reachTarget, 0.9, 0.9, 0.5)
        }
      } else if (cycle < 12.0) {
        // Dip Brush into Palette Mode: look down at palette in left hand
        if (bones.hand_l && bones.neck_01 && bones.Head) {
          const paletteWorld = bones.hand_l.getWorldPosition(new THREE.Vector3())
          const reachTarget = paletteWorld.clone().add(new THREE.Vector3(0, 0.05, 0))
          const polePos = shoulderPos.clone().add(new THREE.Vector3(0, -0.3, 0.2))
          solveTwoBoneIK(bones.upperarm_r, bones.lowerarm_r, bones.hand_r, reachTarget, polePos, 0.75)
          solveLookAtIK(bones.neck_01, bones.Head, paletteWorld, 0.85, 0.8, 0.6)
        }
      } else {
        // Step Back / Admire Stroke Mode: examine canvas with thoughtful head tilt
        if (bones.neck_01 && bones.Head) {
          const admirePos = canvasWorldPos.clone().add(new THREE.Vector3(0, 0.1, 0))
          solveLookAtIK(bones.neck_01, bones.Head, admirePos, 0.75, 0.7, 0.4)
        }
      }
    }
  })

  return (
    <group ref={groupRef} scale={ADULT_SCALE}>
      <primitive object={actor.root} />

      {/* ── Left Hand Artist Wooden Palette ── */}
      <group
        ref={paletteMeshRef}
        position={[0.05, 0.08, 0.02]}
        rotation={[-Math.PI / 2 + 0.3, 0.2, 0.1]}
      >
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.18, 0.18, 0.01, 20]} />
          <meshStandardMaterial color="#D4A373" roughness={0.6} />
        </mesh>
        {/* Thumb Hole */}
        <mesh position={[-0.09, 0.001, -0.04]}>
          <cylinderGeometry args={[0.03, 0.03, 0.012, 12]} />
          <meshStandardMaterial color="#4A2E1B" roughness={0.8} />
        </mesh>
        {/* Paint Blobs */}
        {OIL_COLORS.map((col, idx) => {
          const ang = -1.6 + (idx / (OIL_COLORS.length - 1)) * 2.8
          const bx = Math.cos(ang) * 0.13
          const bz = Math.sin(ang) * 0.11
          return (
            <mesh key={idx} position={[bx, 0.008, bz]} castShadow>
              <sphereGeometry args={[0.018, 8, 8, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
              <meshStandardMaterial color={col} roughness={0.3} metalness={0.1} />
            </mesh>
          )
        })}
      </group>

      {/* ── Right Hand Fine Wooden Paintbrush ── */}
      <group
        ref={brushMeshRef}
        position={[0.02, 0.08, 0.01]}
        rotation={[Math.PI / 2 + 0.2, 0, 0]}
      >
        {/* Wooden Handle */}
        <mesh castShadow>
          <cylinderGeometry args={[0.004, 0.007, 0.28, 8]} />
          <meshStandardMaterial color="#6E472A" roughness={0.6} />
        </mesh>
        {/* Metal Ferrule */}
        <mesh position={[0, 0.14, 0]}>
          <cylinderGeometry args={[0.007, 0.007, 0.03, 8]} />
          <meshStandardMaterial color="#E5E7EB" metalness={0.9} roughness={0.15} />
        </mesh>
        {/* Bristle Tip with Active Paint Tint */}
        <mesh position={[0, 0.165, 0]}>
          <coneGeometry args={[0.007, 0.025, 8]} />
          <meshStandardMaterial color={brushTipColor} roughness={0.4} />
        </mesh>
      </group>
    </group>
  )
}

// ── 4. Interested / Admiring Spectator Visitors ──────────────────────────────
function SpectatorActor({
  model = 'onlooker_a',
  position,
  bodyRotY,
  targetPos,
  idleAnim = 'Idle_FoldArms_Loop',
  tints,
}: {
  model: string
  position: [number, number, number]
  bodyRotY: number
  targetPos: [number, number, number]
  idleAnim?: string
  tints?: Record<string, string>
}) {
  const actor = useActor(model, { tints })
  const groupRef = useRef<THREE.Group>(null!)
  const targetVec = useMemo(() => new THREE.Vector3(...targetPos), [targetPos])
  const [animOffset] = useState(() => Math.random() * 3.0)

  useEffect(() => {
    actor.play(idleAnim, { fade: 0.4, loop: true, from: animOffset })
  }, [actor, idleAnim, animOffset])

  useFrame(({ clock }) => {
    if (groupRef.current && actor.bones.neck_01 && actor.bones.Head) {
      // Subtle natural gaze exploration focusing directly on the artwork & artist
      const wanderX = Math.sin(clock.elapsedTime * 0.35 + animOffset) * 0.25
      const wanderY = Math.cos(clock.elapsedTime * 0.25 + animOffset) * 0.18
      const liveGaze = targetVec.clone().add(new THREE.Vector3(wanderX, wanderY, 0))
      solveLookAtIK(actor.bones.neck_01, actor.bones.Head, liveGaze, 0.9, 0.85, 0.45)
    }
  })

  return (
    <group ref={groupRef} position={position} rotation={[0, bodyRotY, 0]} scale={ADULT_SCALE}>
      <primitive object={actor.root} />
    </group>
  )
}

// ── 5. Master Complete Live Art Studio Scene ────────────────────────────────
export function LiveArtScene({
  position = [8.8, 0, 4.2] as [number, number, number],
  rotationY = -2.15,
}: {
  position?: [number, number, number]
  rotationY?: number
}) {
  const canvasRef = useRef<THREE.Mesh>(null)

  // Dynamic canvas drawing engine
  const [canvasTexture, setCanvasTexture] = useState<THREE.CanvasTexture | null>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const activeColorIdxRef = useRef(0)

  const [activeColor, setActiveColor] = useState(OIL_COLORS[0])

  useEffect(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 384
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctxRef.current = ctx

    // Gesso linen background primer
    ctx.fillStyle = '#F5EFE6'
    ctx.fillRect(0, 0, 512, 384)

    // Faint subtle linen weave texture
    ctx.strokeStyle = 'rgba(215, 200, 180, 0.25)'
    ctx.lineWidth = 1
    for (let i = 0; i < 384; i += 5) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(512, i)
      ctx.stroke()
    }

    // Initial impressionist sketch background: mountains & lake landscape
    ctx.fillStyle = '#C6DBE8' // Soft sky
    ctx.fillRect(0, 0, 512, 180)

    ctx.fillStyle = '#7E9DA8' // Distant mountain silhouette
    ctx.beginPath()
    ctx.moveTo(0, 180)
    ctx.lineTo(120, 90)
    ctx.lineTo(260, 140)
    ctx.lineTo(400, 70)
    ctx.lineTo(512, 160)
    ctx.lineTo(512, 180)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = '#4A7C59' // Forest shoreline
    ctx.beginPath()
    ctx.ellipse(256, 210, 260, 45, 0, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#5D8AA8' // Lake water reflection
    ctx.fillRect(0, 220, 512, 164)

    const tex = new THREE.CanvasTexture(canvas)
    tex.generateMipmaps = true
    tex.minFilter = THREE.LinearMipmapLinearFilter
    setCanvasTexture(tex)
  }, [])

  // Switch brush colors periodically
  useEffect(() => {
    const interval = setInterval(() => {
      activeColorIdxRef.current = (activeColorIdxRef.current + 1) % OIL_COLORS.length
      setActiveColor(OIL_COLORS[activeColorIdxRef.current])
    }, 7000)
    return () => clearInterval(interval)
  }, [])

  // Callback to paint strokes onto canvas texture
  const handleStroke = (u: number, v: number, color: string) => {
    const ctx = ctxRef.current
    if (!ctx || !canvasTexture) return

    const px = u * 512
    const py = (1 - v) * 384

    ctx.save()
    ctx.fillStyle = color
    ctx.globalAlpha = 0.8

    // Impasto dab stroke
    for (let d = 0; d < 4; d++) {
      const ox = (Math.random() - 0.5) * 14
      const oy = (Math.random() - 0.5) * 12
      ctx.beginPath()
      ctx.ellipse(px + ox, py + oy, 9, 6, Math.random() * Math.PI, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.restore()
    canvasTexture.needsUpdate = true
  }

  // World coordinates for spectators to look at
  const sceneGroupRef = useRef<THREE.Group>(null!)
  const [easelWorldPos, setEaselWorldPos] = useState<[number, number, number]>([position[0], 1.4, position[2]])

  useFrame(() => {
    if (canvasRef.current) {
      const wp = canvasRef.current.getWorldPosition(new THREE.Vector3())
      setEaselWorldPos([wp.x, wp.y, wp.z])
    }
  })

  return (
    <group ref={sceneGroupRef} position={position} rotation={[0, rotationY, 0]}>
      {/* ── 1. Classical Wooden Studio Easel with Live Painted Canvas ── */}
      <StudioEasel
        position={[0, 0, 0]}
        rotationY={0}
        canvasWidth={1.15}
        canvasHeight={0.88}
        canvasTexture={canvasTexture ?? undefined}
        canvasRef={canvasRef}
      />

      {/* ── 2. Artist Supply Table beside Easel ── */}
      <ArtistSupplyTable position={[0.75, 0, 0.2]} />

      {/* ── 3. Active Painting Girl / Female Artist ── */}
      <group position={[0.0, 0, 0.86]} rotation={[0, Math.PI, 0]}>
        <LivePainterActor
          canvasRef={canvasRef}
          brushTipColor={activeColor}
          onStroke={handleStroke}
        />
      </group>

      {/* ── 4. Two Admiring Spectator Museum Visitors ── */}
      {/* Spectator 1: Standing slightly to the side with folded arms, admiring artwork */}
      <SpectatorActor
        model="thrower_b"
        position={[-1.25, 0, 1.45]}
        bodyRotY={Math.PI - 0.55} // Facing towards the easel & girl
        targetPos={easelWorldPos}
        idleAnim="Idle_FoldArms_Loop"
        tints={{ shirt: '#24334A' }} // Elegant dark slate navy
      />

      {/* Spectator 2: Standing nearby, enjoying the live painting demonstration */}
      <SpectatorActor
        model="onlooker_b"
        position={[-0.55, 0, 1.95]}
        bodyRotY={Math.PI - 0.25} // Facing towards the easel & girl
        targetPos={easelWorldPos}
        idleAnim="Idle_Loop"
        tints={{ shirt: '#C06C46' }} // Warm museum terracotta dress
      />
    </group>
  )
}
