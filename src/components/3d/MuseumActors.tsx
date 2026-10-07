import { useRef, useEffect, useState, useMemo, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useActor, solveLookAtIK } from './useActor'

// Standard realistic adult human scale (scales ~1.0m base GLTF model to 1.74m - 1.82m adult height)
const ADULT_SCALE_DEFAULT = 1.76

// ── Artwork Viewing Target Descriptor ───────────────────────────────────────
export interface ArtworkViewingTarget {
  id: string
  standPos: [number, number, number]
  bodyRotY: number // Exact Y rotation in radians for body to squarely face the artwork
  artCenter: [number, number, number] // World coordinate of the painting canvas center
  viewDistance?: number
}

// ── 1. Dynamic Painting Hopper (Autonomous Art Explorer) ────────────────────
function DynamicPaintingHopper({
  model = 'artist',
  stops,
  speed = 1.0,
  minObserveTime = 8.0,
  maxObserveTime = 16.0,
  tints,
  scale = ADULT_SCALE_DEFAULT,
  initialStopIdx = 0,
}: {
  model: string
  stops: ArtworkViewingTarget[]
  speed?: number
  minObserveTime?: number
  maxObserveTime?: number
  tints?: Record<string, string>
  scale?: number
  initialStopIdx?: number
}) {
  const actor = useActor(model, { tints })
  const groupRef = useRef<THREE.Group>(null!)

  const [stopIdx, setStopIdx] = useState(initialStopIdx)
  const currentStop = stops[stopIdx % stops.length]

  // States: 'observing' | 'turning_to_walk' | 'walking' | 'turning_to_art'
  const stateRef = useRef<'observing' | 'turning_to_walk' | 'walking' | 'turning_to_art'>('observing')
  const timerRef = useRef(minObserveTime + Math.random() * (maxObserveTime - minObserveTime))
  const targetPosRef = useRef(new THREE.Vector3(...currentStop.standPos))
  const currentArtCenterRef = useRef(new THREE.Vector3(...currentStop.artCenter))
  const targetRotYRef = useRef(currentStop.bodyRotY)
  const animOffset = useMemo(() => Math.random() * 3.0, [])

  useEffect(() => {
    actor.play('Idle_FoldArms_Loop', { fade: 0.4, loop: true, from: animOffset })
  }, [actor, animOffset])

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return
    const curPos = groupRef.current.position

    if (stateRef.current === 'observing') {
      // 1. Maintain precise viewing stance facing the artwork
      const rotDiff = targetRotYRef.current - groupRef.current.rotation.y
      let normRotDiff = Math.atan2(Math.sin(rotDiff), Math.cos(rotDiff))
      groupRef.current.rotation.y += normRotDiff * Math.min(delta * 4.0, 1.0)

      // 2. Subtle, natural gaze exploration across the painting canvas
      if (actor.bones.neck_01 && actor.bones.Head) {
        const gazeScanX = Math.sin(clock.elapsedTime * 0.45 + animOffset) * 0.45
        const gazeScanY = Math.cos(clock.elapsedTime * 0.35 + animOffset) * 0.3
        const dynamicGaze = currentArtCenterRef.current.clone().add(new THREE.Vector3(gazeScanX, gazeScanY, 0))
        solveLookAtIK(actor.bones.neck_01, actor.bones.Head, dynamicGaze, 0.85, 0.75, 0.5)
      }

      // 3. Count down observation time
      timerRef.current -= delta
      if (timerRef.current <= 0) {
        // Select next artwork stop
        const nextIdx = (stopIdx + 1) % stops.length
        setStopIdx(nextIdx)
        const nextStop = stops[nextIdx]
        targetPosRef.current.set(...nextStop.standPos)
        currentArtCenterRef.current.set(...nextStop.artCenter)
        targetRotYRef.current = nextStop.bodyRotY

        // Switch to turning towards next walking destination
        stateRef.current = 'turning_to_walk'
      }
    } else if (stateRef.current === 'turning_to_walk') {
      // Rotate body toward walking destination before stepping
      const toDest = targetPosRef.current.clone().sub(curPos)
      const walkAngle = Math.atan2(toDest.x, toDest.z)
      const diff = Math.atan2(Math.sin(walkAngle - groupRef.current.rotation.y), Math.cos(walkAngle - groupRef.current.rotation.y))

      groupRef.current.rotation.y += diff * Math.min(delta * 3.5, 1.0)

      if (Math.abs(diff) < 0.25 || toDest.length() < 0.4) {
        stateRef.current = 'walking'
        actor.play('Walk_Loop', { fade: 0.4, loop: true, timeScale: speed * 0.95 })
      }
    } else if (stateRef.current === 'walking') {
      const toDest = targetPosRef.current.clone().sub(curPos)
      const dist = toDest.length()

      if (dist < 0.35) {
        // Arrived at artwork viewing station -> decelerate and turn to face the painting
        stateRef.current = 'turning_to_art'
        actor.play('Idle_Loop', { fade: 0.45, loop: true })
      } else {
        toDest.normalize()
        const step = Math.min(dist, speed * delta * 1.05)
        curPos.addScaledVector(toDest, step)

        // Smooth steering while walking
        const walkAngle = Math.atan2(toDest.x, toDest.z)
        const diff = Math.atan2(Math.sin(walkAngle - groupRef.current.rotation.y), Math.cos(walkAngle - groupRef.current.rotation.y))
        groupRef.current.rotation.y += diff * Math.min(delta * 4.0, 1.0)
      }
    } else if (stateRef.current === 'turning_to_art') {
      // Align squarely with the artwork
      const rotDiff = Math.atan2(Math.sin(targetRotYRef.current - groupRef.current.rotation.y), Math.cos(targetRotYRef.current - groupRef.current.rotation.y))
      groupRef.current.rotation.y += rotDiff * Math.min(delta * 3.5, 1.0)

      if (Math.abs(rotDiff) < 0.1) {
        stateRef.current = 'observing'
        timerRef.current = minObserveTime + Math.random() * (maxObserveTime - minObserveTime)
        const idleChoice = Math.random() > 0.4 ? 'Idle_FoldArms_Loop' : 'Idle_Loop'
        actor.play(idleChoice, { fade: 0.45, loop: true })
      }
    }
  })

  return (
    <group ref={groupRef} position={stops[initialStopIdx % stops.length].standPos} scale={scale}>
      <primitive object={actor.root} />
    </group>
  )
}

// ── 2. Dedicated Masterpiece Connoisseur (Focused Painting Admirer) ─────────
function DedicatedArtworkAdmirer({
  model = 'artist',
  position,
  bodyRotY,
  artCenter,
  idleAnim = 'Idle_FoldArms_Loop',
  tints,
  scale = ADULT_SCALE_DEFAULT,
}: {
  model: string
  position: [number, number, number]
  bodyRotY: number
  artCenter: [number, number, number]
  idleAnim?: string
  tints?: Record<string, string>
  scale?: number
}) {
  const actor = useActor(model, { tints })
  const groupRef = useRef<THREE.Group>(null!)
  const artCenterVec = useMemo(() => new THREE.Vector3(...artCenter), [artCenter])
  const [animOffset] = useState(() => Math.random() * 4.0)

  useEffect(() => {
    actor.play(idleAnim, { fade: 0.5, loop: true, from: animOffset })
  }, [actor, idleAnim, animOffset])

  useFrame(({ clock }) => {
    if (groupRef.current && actor.bones.neck_01 && actor.bones.Head) {
      // Natural gaze wandering across canvas brushstrokes
      const wanderX = Math.sin(clock.elapsedTime * 0.4 + animOffset) * 0.5
      const wanderY = Math.cos(clock.elapsedTime * 0.3 + animOffset) * 0.35
      const gazePos = artCenterVec.clone().add(new THREE.Vector3(wanderX, wanderY, 0))
      solveLookAtIK(actor.bones.neck_01, actor.bones.Head, gazePos, 0.85, 0.8, 0.5)
    }
  })

  return (
    <group ref={groupRef} position={position} rotation={[0, bodyRotY, 0]} scale={scale}>
      <primitive object={actor.root} />
    </group>
  )
}

// ── 3. Gallery Promenade Walker (Continuous Gallery Stroller) ───────────────
function GalleryPromenadeWalker({
  model = 'runner_a',
  waypoints,
  speed = 1.0,
  pauseDuration = 7.0,
  tints,
  scale = ADULT_SCALE_DEFAULT,
  startWpIdx = 0,
}: {
  model: string
  waypoints: [number, number, number][]
  speed?: number
  pauseDuration?: number
  tints?: Record<string, string>
  scale?: number
  startWpIdx?: number
}) {
  const actor = useActor(model, { tints })
  const groupRef = useRef<THREE.Group>(null!)

  const [wpIdx, setWpIdx] = useState(startWpIdx % waypoints.length)
  const isWalkingRef = useRef(true)
  const pauseTimerRef = useRef(0)
  const targetPosRef = useRef(new THREE.Vector3(...waypoints[startWpIdx % waypoints.length]))
  const animTimeOffset = useMemo(() => Math.random() * 3.0, [])

  useEffect(() => {
    actor.play('Walk_Loop', { fade: 0.35, loop: true, timeScale: speed * 0.95, from: animTimeOffset })
  }, [actor, speed, animTimeOffset])

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const curPos = groupRef.current.position

    if (isWalkingRef.current) {
      const target = targetPosRef.current
      const dir = target.clone().sub(curPos)
      const dist = dir.length()

      if (dist < 0.35) {
        // Arrived at waypoint -> pause to look around gallery
        isWalkingRef.current = false
        pauseTimerRef.current = pauseDuration + Math.random() * 4.0
        const idleClip = Math.random() > 0.5 ? 'Idle_FoldArms_Loop' : 'Idle_Loop'
        actor.play(idleClip, { fade: 0.45, loop: true })
      } else {
        dir.normalize()
        const step = Math.min(dist, speed * delta * 1.05)
        curPos.addScaledVector(dir, step)

        // Smooth steering
        const targetRot = Math.atan2(dir.x, dir.z)
        const diff = Math.atan2(Math.sin(targetRot - groupRef.current.rotation.y), Math.cos(targetRot - groupRef.current.rotation.y))
        groupRef.current.rotation.y += diff * Math.min(delta * 4.2, 1.0)
      }
    } else {
      pauseTimerRef.current -= delta
      if (pauseTimerRef.current <= 0) {
        const nextIdx = (wpIdx + 1) % waypoints.length
        setWpIdx(nextIdx)
        targetPosRef.current.set(...waypoints[nextIdx])
        isWalkingRef.current = true
        actor.play('Walk_Loop', { fade: 0.4, loop: true, timeScale: speed * 0.95 })
      }
    }
  })

  return (
    <group ref={groupRef} position={waypoints[startWpIdx % waypoints.length]} scale={scale}>
      <primitive object={actor.root} />
    </group>
  )
}

// ── 4. Co-Viewing Art Discussion Pair (Two Visitors at One Painting) ────────
function ArtCoViewingPair({
  modelA = 'artist',
  modelB = 'parent',
  posA,
  posB,
  artCenter,
  wallNormal,
  tintsA,
  tintsB,
  scaleA = ADULT_SCALE_DEFAULT,
  scaleB = ADULT_SCALE_DEFAULT,
}: {
  modelA: string
  modelB: string
  posA: [number, number, number]
  posB: [number, number, number]
  artCenter: [number, number, number]
  wallNormal: [number, number, number] // Vector pointing out from wall towards center
  tintsA?: Record<string, string>
  tintsB?: Record<string, string>
  scaleA?: number
  scaleB?: number
}) {
  const actorA = useActor(modelA, { tints: tintsA })
  const actorB = useActor(modelB, { tints: tintsB })
  const groupRefA = useRef<THREE.Group>(null!)
  const groupRefB = useRef<THREE.Group>(null!)

  const artCenterVec = useMemo(() => new THREE.Vector3(...artCenter), [artCenter])

  // Body orientation facing towards the wall / artwork
  const bodyRotY = useMemo(() => Math.atan2(-wallNormal[0], -wallNormal[2]), [wallNormal])

  useEffect(() => {
    actorA.play('Idle_FoldArms_Loop', { fade: 0.4, loop: true, from: 0.2 })
    actorB.play('Idle_Loop', { fade: 0.4, loop: true, from: 1.6 })
  }, [actorA, actorB])

  useFrame(({ clock }) => {
    // Person A looks steadily at the artwork
    if (actorA.bones.neck_01 && actorA.bones.Head) {
      const wander = Math.sin(clock.elapsedTime * 0.4) * 0.4
      const gazeA = artCenterVec.clone().add(new THREE.Vector3(wander, 0, 0))
      solveLookAtIK(actorA.bones.neck_01, actorA.bones.Head, gazeA, 0.85, 0.8, 0.5)
    }

    // Person B alternates between gazing at the artwork and glancing at Person A
    if (actorB.bones.neck_01 && actorB.bones.Head && actorA.bones.Head) {
      const lookCycle = Math.sin(clock.elapsedTime * 0.3)
      if (lookCycle > 0.3) {
        const headAPos = actorA.bones.Head.getWorldPosition(new THREE.Vector3())
        solveLookAtIK(actorB.bones.neck_01, actorB.bones.Head, headAPos, 0.65, 0.7, 0.35)
      } else {
        solveLookAtIK(actorB.bones.neck_01, actorB.bones.Head, artCenterVec, 0.8, 0.7, 0.5)
      }
    }
  })

  return (
    <group>
      {/* Person A angled towards artwork */}
      <group ref={groupRefA} position={posA} rotation={[0, bodyRotY - 0.08, 0]} scale={scaleA}>
        <primitive object={actorA.root} />
      </group>
      {/* Person B angled slightly towards artwork and Person A */}
      <group ref={groupRefB} position={posB} rotation={[0, bodyRotY + 0.18, 0]} scale={scaleB}>
        <primitive object={actorB.root} />
      </group>
    </group>
  )
}

// ── 5. Velvet Bench Seated Visitor ──────────────────────────────────────────
function BenchSeatedVisitor({
  model = 'parent',
  position,
  rotationY = 0,
  anim = 'Sitting_Idle_Loop',
  tints,
  scale = ADULT_SCALE_DEFAULT,
}: {
  model: string
  position: [number, number, number]
  rotationY?: number
  anim?: string
  tints?: Record<string, string>
  scale?: number
}) {
  const actor = useActor(model, { tints })
  const groupRef = useRef<THREE.Group>(null!)
  const animOffset = useMemo(() => Math.random() * 3.0, [])

  useEffect(() => {
    actor.play(anim, { fade: 0.4, loop: true, from: animOffset })
  }, [actor, anim, animOffset])

  return (
    <group ref={groupRef} position={position} rotation={[0, rotationY, 0]} scale={scale}>
      <primitive object={actor.root} />
    </group>
  )
}

// ── Master Museum Artwork Viewing Stations Database ─────────────────────────
const WEST_WING_STOPS: ArtworkViewingTarget[] = [
  {
    id: 'art-w1-a',
    standPos: [-14.8, 0, -25.0],
    bodyRotY: -Math.PI / 2,
    artCenter: [-17.65, 4.4, -25.0],
  },
  {
    id: 'art-w2-a',
    standPos: [-14.8, 0, -15.0],
    bodyRotY: -Math.PI / 2,
    artCenter: [-17.65, 4.4, -15.0],
  },
  {
    id: 'art-w3-a',
    standPos: [-14.8, 0, -4.0],
    bodyRotY: -Math.PI / 2,
    artCenter: [-17.65, 4.4, -4.0],
  },
  {
    id: 'art-w4-a',
    standPos: [-14.8, 0, 8.0],
    bodyRotY: -Math.PI / 2,
    artCenter: [-17.65, 4.4, 8.0],
  },
  {
    id: 'art-w5-a',
    standPos: [-14.8, 0, 20.0],
    bodyRotY: -Math.PI / 2,
    artCenter: [-17.65, 4.4, 20.0],
  },
]

const EAST_WING_STOPS: ArtworkViewingTarget[] = [
  {
    id: 'art-e5-b',
    standPos: [14.8, 0, 25.0],
    bodyRotY: Math.PI / 2,
    artCenter: [17.65, 4.4, 25.0],
  },
  {
    id: 'art-e4-a',
    standPos: [14.8, 0, 8.0],
    bodyRotY: Math.PI / 2,
    artCenter: [17.65, 4.4, 8.0],
  },
  {
    id: 'art-e3-a',
    standPos: [14.8, 0, -4.0],
    bodyRotY: Math.PI / 2,
    artCenter: [17.65, 4.4, -4.0],
  },
  {
    id: 'art-e2-a',
    standPos: [14.8, 0, -15.0],
    bodyRotY: Math.PI / 2,
    artCenter: [17.65, 4.4, -15.0],
  },
  {
    id: 'art-e1-a',
    standPos: [14.8, 0, -25.0],
    bodyRotY: Math.PI / 2,
    artCenter: [17.65, 4.4, -25.0],
  },
]

const NORTH_WALL_STOPS: ArtworkViewingTarget[] = [
  {
    id: 'art-n-left-outer',
    standPos: [-14.5, 0, -26.8],
    bodyRotY: Math.PI,
    artCenter: [-14.5, 4.4, -29.65],
  },
  {
    id: 'art-n-left-up',
    standPos: [-7.8, 0, -26.6],
    bodyRotY: Math.PI,
    artCenter: [-7.8, 5.2, -29.65],
  },
  {
    id: 'art-n-center-hopper',
    standPos: [0.0, 0, -26.4],
    bodyRotY: Math.PI,
    artCenter: [0.0, 4.4, -29.65],
  },
  {
    id: 'art-n-right-up',
    standPos: [7.8, 0, -26.6],
    bodyRotY: Math.PI,
    artCenter: [7.8, 5.2, -29.65],
  },
  {
    id: 'art-n-right-outer',
    standPos: [14.5, 0, -26.8],
    bodyRotY: Math.PI,
    artCenter: [14.5, 4.4, -29.65],
  },
]

const SOUTH_WALL_STOPS: ArtworkViewingTarget[] = [
  {
    id: 'art-s-right-outer',
    standPos: [14.5, 0, 26.8],
    bodyRotY: 0,
    artCenter: [14.5, 4.4, 29.65],
  },
  {
    id: 'art-s-right-up',
    standPos: [7.8, 0, 26.6],
    bodyRotY: 0,
    artCenter: [7.8, 5.2, 29.65],
  },
  {
    id: 'art-s-center-hopper',
    standPos: [0.0, 0, 26.4],
    bodyRotY: 0,
    artCenter: [0.0, 4.4, 29.65],
  },
  {
    id: 'art-s-left-up',
    standPos: [-7.8, 0, 26.6],
    bodyRotY: 0,
    artCenter: [-7.8, 5.2, 29.65],
  },
  {
    id: 'art-s-left-outer',
    standPos: [-14.5, 0, 26.8],
    bodyRotY: 0,
    artCenter: [-14.5, 4.4, 29.65],
  },
]

// ── Complete Ensemble of 30 Realistically-Scaled, Painting-Aware Adult Visitors 
export function MuseumActorsEnsemble() {
  return (
    <Suspense fallback={null}>
      <group name="MuseumHumanVisitors">
        {/* ═══════════════════════════════════════════════════════════════════
            1. DYNAMIC ART HOPPERS (Visitors walking from painting to painting)
            ═══════════════════════════════════════════════════════════════════ */}
        {/* West Wing Art Hopper 1 (North-to-South along West paintings) */}
        <DynamicPaintingHopper
          model="runner_a"
          stops={WEST_WING_STOPS}
          speed={0.98}
          minObserveTime={9.0}
          maxObserveTime={16.0}
          initialStopIdx={0}
          tints={{ shirt: '#345C72' }}
          scale={1.76}
        />

        {/* West Wing Art Hopper 2 (South-to-North along West paintings) */}
        <DynamicPaintingHopper
          model="thrower_a"
          stops={WEST_WING_STOPS}
          speed={0.92}
          minObserveTime={8.0}
          maxObserveTime={15.0}
          initialStopIdx={3}
          tints={{ shirt: '#6A242E' }}
          scale={1.74}
        />

        {/* East Wing Art Hopper 1 (South-to-North along East paintings) */}
        <DynamicPaintingHopper
          model="runner_b"
          stops={EAST_WING_STOPS}
          speed={0.95}
          minObserveTime={9.0}
          maxObserveTime={16.0}
          initialStopIdx={0}
          tints={{ shirt: '#EAE6DF' }}
          scale={1.78}
        />

        {/* East Wing Art Hopper 2 (North-to-South along East paintings) */}
        <DynamicPaintingHopper
          model="swinger"
          stops={EAST_WING_STOPS}
          speed={0.88}
          minObserveTime={8.5}
          maxObserveTime={14.0}
          initialStopIdx={3}
          tints={{ shirt: '#3D5A45' }}
          scale={1.72}
        />

        {/* North Wall Masterpiece Hopper 1 */}
        <DynamicPaintingHopper
          model="onlooker_a"
          stops={NORTH_WALL_STOPS}
          speed={0.94}
          minObserveTime={10.0}
          maxObserveTime={18.0}
          initialStopIdx={1}
          tints={{ shirt: '#B5653C' }}
          scale={1.75}
        />

        {/* North Wall Masterpiece Hopper 2 */}
        <DynamicPaintingHopper
          model="thrower_b"
          stops={NORTH_WALL_STOPS}
          speed={0.90}
          minObserveTime={8.5}
          maxObserveTime={15.0}
          initialStopIdx={4}
          tints={{ shirt: '#C2B29D' }}
          scale={1.79}
        />

        {/* South Salon Masterpiece Hopper 1 */}
        <DynamicPaintingHopper
          model="onlooker_b"
          stops={SOUTH_WALL_STOPS}
          speed={0.91}
          minObserveTime={9.5}
          maxObserveTime={17.0}
          initialStopIdx={1}
          tints={{ shirt: '#545E67' }}
          scale={1.78}
        />

        {/* South Salon Masterpiece Hopper 2 */}
        <DynamicPaintingHopper
          model="artist"
          stops={SOUTH_WALL_STOPS}
          speed={0.89}
          minObserveTime={10.0}
          maxObserveTime={16.0}
          initialStopIdx={3}
          tints={{ shirt: '#1E2B3E' }}
          scale={1.76}
        />

        {/* ═══════════════════════════════════════════════════════════════════
            2. DEDICATED MASTERPIECE OBSERVERS (Gazing directly at artworks)
            ═══════════════════════════════════════════════════════════════════ */}
        {/* North-West Monumental Portrait Observer */}
        <DedicatedArtworkAdmirer
          model="thrower_b"
          position={[-7.8, 0, -26.5]}
          bodyRotY={Math.PI} // Facing -Z (North wall)
          artCenter={[-7.8, 5.5, -29.65]}
          idleAnim="Idle_FoldArms_Loop"
          tints={{ shirt: '#5C4033' }}
          scale={1.78}
        />

        {/* North-East Botanical Cartoon Observer */}
        <DedicatedArtworkAdmirer
          model="artist"
          position={[7.8, 0, -26.5]}
          bodyRotY={Math.PI} // Facing -Z (North wall)
          artCenter={[7.8, 5.5, -29.65]}
          idleAnim="Idle_Loop"
          tints={{ shirt: '#4A6956' }}
          scale={1.77}
        />

        {/* North Outer West Wall Observer */}
        <DedicatedArtworkAdmirer
          model="parent"
          position={[-14.5, 0, -26.8]}
          bodyRotY={Math.PI}
          artCenter={[-14.5, 4.4, -29.65]}
          idleAnim="Idle_FoldArms_Loop"
          tints={{ shirt: '#782833' }}
          scale={1.75}
        />

        {/* South Wall Monumental Center Masterpiece Observer */}
        <DedicatedArtworkAdmirer
          model="parent"
          position={[0.0, 0, 26.5]}
          bodyRotY={0} // Facing +Z (South wall)
          artCenter={[0.0, 4.4, 29.65]}
          idleAnim="Idle_FoldArms_Loop"
          tints={{ shirt: '#4A708B' }}
          scale={1.80}
        />

        {/* South-West Portrait Observer */}
        <DedicatedArtworkAdmirer
          model="swinger"
          position={[-7.8, 0, 26.6]}
          bodyRotY={0}
          artCenter={[-7.8, 5.2, 29.65]}
          idleAnim="Idle_Loop"
          tints={{ shirt: '#CEBEA5' }}
          scale={1.73}
        />

        {/* South-East Masterpiece Observer */}
        <DedicatedArtworkAdmirer
          model="runner_b"
          position={[7.8, 0, 26.6]}
          bodyRotY={0}
          artCenter={[7.8, 5.2, 29.65]}
          idleAnim="Idle_FoldArms_Loop"
          tints={{ shirt: '#A85A32' }}
          scale={1.76}
        />

        {/* West Wall Impressionist Seascape Observer */}
        <DedicatedArtworkAdmirer
          model="runner_a"
          position={[-14.8, 0, -15.0]}
          bodyRotY={-Math.PI / 2} // Facing -X (West wall)
          artCenter={[-17.65, 4.4, -15.0]}
          idleAnim="Idle_FoldArms_Loop"
          tints={{ shirt: '#F2EFEB' }}
          scale={1.75}
        />

        {/* West Wall Classical Study Observer */}
        <DedicatedArtworkAdmirer
          model="onlooker_a"
          position={[-14.8, 0, 8.0]}
          bodyRotY={-Math.PI / 2}
          artCenter={[-17.65, 4.4, 8.0]}
          idleAnim="Idle_Loop"
          tints={{ shirt: '#24334A' }}
          scale={1.74}
        />

        {/* East Wall Classical Portrait Observer */}
        <DedicatedArtworkAdmirer
          model="thrower_a"
          position={[14.8, 0, -15.0]}
          bodyRotY={Math.PI / 2} // Facing +X (East wall)
          artCenter={[17.65, 4.4, -15.0]}
          idleAnim="Idle_Loop"
          tints={{ shirt: '#6B7280' }}
          scale={1.75}
        />

        {/* East Wall Botanical Study Observer */}
        <DedicatedArtworkAdmirer
          model="onlooker_b"
          position={[14.8, 0, 8.0]}
          bodyRotY={Math.PI / 2}
          artCenter={[17.65, 4.4, 8.0]}
          idleAnim="Idle_FoldArms_Loop"
          tints={{ shirt: '#634832' }}
          scale={1.77}
        />

        {/* ═══════════════════════════════════════════════════════════════════
            3. CO-VIEWING ART DISCUSSION DUOS (Pairs observing artworks)
            ═══════════════════════════════════════════════════════════════════ */}
        {/* Pair discussing the North Center Masterpiece (art-n-center) */}
        <ArtCoViewingPair
          modelA="artist"
          modelB="parent"
          posA={[-0.8, 0, -26.2]}
          posB={[0.9, 0, -26.3]}
          artCenter={[0.0, 4.4, -29.65]}
          wallNormal={[0, 0, 1]}
          tintsA={{ shirt: '#6E2C3F' }}
          tintsB={{ shirt: '#BFA98F' }}
          scaleA={1.77}
          scaleB={1.80}
        />

        {/* Pair discussing the West Wall Monumental Study (art-w1-a) */}
        <ArtCoViewingPair
          modelA="thrower_b"
          modelB="swinger"
          posA={[-14.8, 0, -24.3]}
          posB={[-14.8, 0, -25.7]}
          artCenter={[-17.65, 4.4, -25.0]}
          wallNormal={[1, 0, 0]}
          tintsA={{ shirt: '#364F3C' }}
          tintsB={{ shirt: '#E5E7EB' }}
          scaleA={1.78}
          scaleB={1.73}
        />

        {/* Pair discussing East Wall Classical Masterpiece (art-e2-a) */}
        <ArtCoViewingPair
          modelA="onlooker_b"
          modelB="runner_a"
          posA={[14.8, 0, -14.3]}
          posB={[14.8, 0, -15.7]}
          artCenter={[17.65, 4.4, -15.0]}
          wallNormal={[-1, 0, 0]}
          tintsA={{ shirt: '#C06C46' }}
          tintsB={{ shirt: '#1B263B' }}
          scaleA={1.77}
          scaleB={1.75}
        />

        {/* ═══════════════════════════════════════════════════════════════════
            4. GALLERY PROMENADE WALKERS (Continuous Strollers across aisles)
            ═══════════════════════════════════════════════════════════════════ */}
        {/* Central Nave Grand Promenade Walker (South to North) */}
        <GalleryPromenadeWalker
          model="runner_b"
          waypoints={[
            [2.8, 0, 20.0],
            [2.8, 0, 8.0],
            [2.8, 0, -6.0],
            [2.8, 0, -20.0],
            [1.5, 0, -20.0],
            [1.5, 0, -6.0],
            [1.5, 0, 8.0],
            [1.5, 0, 20.0],
          ]}
          speed={0.94}
          pauseDuration={6.0}
          tints={{ shirt: '#5F6B73' }}
          scale={1.76}
          startWpIdx={0}
        />

        {/* Central Nave Stroller (North to South) */}
        <GalleryPromenadeWalker
          model="onlooker_a"
          waypoints={[
            [-2.8, 0, -20.0],
            [-2.8, 0, -6.0],
            [-2.8, 0, 8.0],
            [-2.8, 0, 20.0],
            [-1.5, 0, 20.0],
            [-1.5, 0, 8.0],
            [-1.5, 0, -6.0],
            [-1.5, 0, -20.0],
          ]}
          speed={0.92}
          pauseDuration={7.5}
          tints={{ shirt: '#722F37' }}
          scale={1.75}
          startWpIdx={2}
        />

        {/* West Colonnade Aisle Promenade Stroller */}
        <GalleryPromenadeWalker
          model="thrower_a"
          waypoints={[
            [-12.0, 0, -22.0],
            [-12.0, 0, -10.0],
            [-12.0, 0, 4.0],
            [-12.0, 0, 18.0],
            [-12.0, 0, 4.0],
            [-12.0, 0, -10.0],
          ]}
          speed={0.90}
          pauseDuration={6.5}
          tints={{ shirt: '#3A6B88' }}
          scale={1.76}
          startWpIdx={1}
        />

        {/* East Colonnade Aisle Promenade Stroller */}
        <GalleryPromenadeWalker
          model="runner_a"
          waypoints={[
            [12.0, 0, 18.0],
            [12.0, 0, 4.0],
            [12.0, 0, -10.0],
            [12.0, 0, -22.0],
            [12.0, 0, -10.0],
            [12.0, 0, 4.0],
          ]}
          speed={0.93}
          pauseDuration={7.0}
          tints={{ shirt: '#6F4E37' }}
          scale={1.77}
          startWpIdx={3}
        />

        {/* Cross-Gallery Diagonal Explorer (Rotunda & Side Colonnades) */}
        <GalleryPromenadeWalker
          model="swinger"
          waypoints={[
            [0.0, 0, 0.0],
            [-12.0, 0, -6.0],
            [-12.0, 0, 6.0],
            [0.0, 0, 14.0],
            [12.0, 0, 6.0],
            [12.0, 0, -6.0],
            [0.0, 0, -14.0],
          ]}
          speed={0.89}
          pauseDuration={5.5}
          tints={{ shirt: '#2E523E' }}
          scale={1.73}
          startWpIdx={1}
        />

        {/* ═══════════════════════════════════════════════════════════════════
            5. VELVET BENCH SEATED VISITORS
            ═══════════════════════════════════════════════════════════════════ */}
        {/* North Nave Velvet Bench Visitor (Watching Nave art-hoppers) */}
        <BenchSeatedVisitor
          model="parent"
          position={[0.0, 0.08, -10.0]}
          rotationY={0} // Facing South into the grand hall
          anim="Sitting_Idle_Loop"
          tints={{ shirt: '#DCD6CD' }}
          scale={1.78}
        />

        {/* South Nave Velvet Bench Visitor (Watching South Salon) */}
        <BenchSeatedVisitor
          model="swinger"
          position={[0.0, 0.08, 10.0]}
          rotationY={Math.PI} // Facing North towards rotunda
          anim="Sitting_Talking_Loop"
          tints={{ shirt: '#9E5330' }}
          scale={1.72}
        />

        {/* West Side Aisle Velvet Bench Visitor (Resting in portrait wing) */}
        <BenchSeatedVisitor
          model="onlooker_b"
          position={[-12.5, 0.08, 15.0]}
          rotationY={Math.PI / 2} // Facing East across aisle
          anim="Sitting_Idle_Loop"
          tints={{ shirt: '#182535' }}
          scale={1.76}
        />

        {/* East Side Aisle Velvet Bench Visitor (Resting in landscape wing) */}
        <BenchSeatedVisitor
          model="artist"
          position={[12.5, 0.08, -5.0]}
          rotationY={-Math.PI / 2} // Facing West across aisle
          anim="Sitting_Idle_Loop"
          tints={{ shirt: '#B8A088' }}
          scale={1.77}
        />
      </group>
    </Suspense>
  )
}
