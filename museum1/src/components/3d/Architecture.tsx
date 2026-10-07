import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ── Central Intertwined Bronze Loop Sculpture ───────────────────────────────
export function Sculpture({ position = [0, 0, 0] as [number, number, number] }) {
  const loop1Ref = useRef<THREE.Mesh>(null!)
  const loop2Ref = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (loop1Ref.current) {
      loop1Ref.current.rotation.y = t * 0.12
      loop1Ref.current.rotation.z = Math.sin(t * 0.15) * 0.04
    }
    if (loop2Ref.current) {
      loop2Ref.current.rotation.y = -t * 0.12 + 0.8
      loop2Ref.current.rotation.x = Math.cos(t * 0.15) * 0.04
    }
  })

  return (
    <group position={position}>
      {/* Polished Marble Pedestal with Gold Brass Trim */}
      <mesh position={[0, 0.45, 0]} receiveShadow castShadow>
        <boxGeometry args={[3.4, 0.9, 2.0]} />
        <meshStandardMaterial color="#3E455B" roughness={0.2} metalness={0.2} />
      </mesh>
      {/* Top Brass Trim */}
      <mesh position={[0, 0.92, 0]} receiveShadow castShadow>
        <boxGeometry args={[3.5, 0.05, 2.1]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.2} metalness={0.85} />
      </mesh>

      {/* Dual Intertwined Bronze Mobius Loops */}
      <group position={[0, 1.95, 0]}>
        <mesh ref={loop1Ref} castShadow position={[-0.45, 0, 0]}>
          <torusGeometry args={[0.8, 0.19, 32, 100]} />
          <meshStandardMaterial color="#FACC15" roughness={0.18} metalness={0.9} />
        </mesh>
        <mesh ref={loop2Ref} castShadow position={[0.45, 0.1, 0]} rotation={[0.4, 0.6, 0.8]}>
          <torusGeometry args={[0.8, 0.19, 32, 100]} />
          <meshStandardMaterial color="#EAB308" roughness={0.18} metalness={0.9} />
        </mesh>
      </group>

      {/* Direct Overhead Spotlight */}
      <spotLight
        position={[0, 8.0, 0]}
        target-position={[0, 1.95, 0]}
        intensity={20}
        angle={0.5}
        penumbra={0.4}
        color="#FFF5E4"
        castShadow
      />
    </group>
  )
}

// ── Secondary Prism Crystal Sculpture (South Pavilion) ───────────────────
export function GlassPrismSculpture({ position = [0, 0, 10] as [number, number, number] }) {
  const crystalRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    if (crystalRef.current) {
      crystalRef.current.rotation.y = clock.elapsedTime * 0.2
    }
  })

  return (
    <group position={position}>
      <mesh position={[0, 0.4, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.2, 1.4, 0.8, 8]} />
        <meshStandardMaterial color="#282E3F" roughness={0.3} metalness={0.4} />
      </mesh>
      <mesh ref={crystalRef} position={[0, 1.6, 0]} castShadow>
        <octahedronGeometry args={[0.7, 0]} />
        <meshPhysicalMaterial
          color="#38BDF8"
          roughness={0.1}
          transmission={0.9}
          thickness={0.5}
          ior={1.6}
        />
      </mesh>
    </group>
  )
}

// ── Single Floor Grand 360 Exhibition Architecture ────────────────────────
export function GalleryWalls() {
  const wallMat = <meshStandardMaterial color="#333A4E" roughness={0.35} metalness={0.05} />
  const pillarMat = <meshStandardMaterial color="#242938" roughness={0.3} metalness={0.1} />
  const brassTrimMat = <meshStandardMaterial color="#D4AF37" roughness={0.25} metalness={0.85} />

  return (
    <group>
      {/* ── 360-Degree Perimeter Exhibition Walls (Single Floor, Height 8.5m) ── */}

      {/* 1. NORTH WALL WITH GRAND AUDITORIUM ARCHWAY (z = -22) */}
      {/* Left North Wall Segment (x: -22 to -6.5) */}
      <mesh position={[-14.25, 4.25, -22]} receiveShadow castShadow>
        <boxGeometry args={[15.5, 8.5, 0.4]} />
        {wallMat}
      </mesh>
      <mesh position={[-14.25, 8.3, -21.75]}>
        <boxGeometry args={[15.5, 0.15, 0.1]} />
        {brassTrimMat}
      </mesh>

      {/* Right North Wall Segment (x: +6.5 to +22) */}
      <mesh position={[14.25, 4.25, -22]} receiveShadow castShadow>
        <boxGeometry args={[15.5, 8.5, 0.4]} />
        {wallMat}
      </mesh>
      <mesh position={[14.25, 8.3, -21.75]}>
        <boxGeometry args={[15.5, 0.15, 0.1]} />
        {brassTrimMat}
      </mesh>

      {/* Top Arch Lintel above Portal (y: 7.0 to 8.5, width 13m) */}
      <mesh position={[0, 7.75, -22]} receiveShadow castShadow>
        <boxGeometry args={[13.0, 1.5, 0.4]} />
        {wallMat}
      </mesh>
      <mesh position={[0, 8.3, -21.75]}>
        <boxGeometry args={[13.0, 0.15, 0.1]} />
        {brassTrimMat}
      </mesh>

      {/* 2. SOUTH WALL (z = +22) */}
      <mesh position={[0, 4.25, 22]} receiveShadow castShadow>
        <boxGeometry args={[44, 8.5, 0.4]} />
        {wallMat}
      </mesh>
      <mesh position={[0, 8.3, 21.75]}>
        <boxGeometry args={[44, 0.15, 0.1]} />
        {brassTrimMat}
      </mesh>

      {/* 3. WEST WALL (x = -22) */}
      <mesh position={[-22, 4.25, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.4, 8.5, 44]} />
        {wallMat}
      </mesh>
      <mesh position={[-21.75, 8.3, 0]}>
        <boxGeometry args={[0.1, 0.15, 44]} />
        {brassTrimMat}
      </mesh>

      {/* 4. EAST WALL (x = +22) */}
      <mesh position={[22, 4.25, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.4, 8.5, 44]} />
        {wallMat}
      </mesh>
      <mesh position={[21.75, 8.3, 0]}>
        <boxGeometry args={[0.1, 0.15, 44]} />
        {brassTrimMat}
      </mesh>

      {/* ── Architectural Corner Pillars (Unobstructed Center View) ── */}
      {[
        [-21.5, -21.5],
        [21.5, -21.5],
        [-21.5, 21.5],
        [21.5, 21.5],
      ].map(([x, z], i) => (
        <group key={i} position={[x, 4.25, z]}>
          <mesh receiveShadow castShadow>
            <boxGeometry args={[1.2, 8.5, 1.2]} />
            {pillarMat}
          </mesh>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.26, 0.12, 1.26]} />
            {brassTrimMat}
          </mesh>
        </group>
      ))}

      {/* ── Grand Ceiling & Glass Skylight Grid ── */}
      <mesh position={[0, 8.6, 0]}>
        <boxGeometry args={[44, 0.3, 44]} />
        {wallMat}
      </mesh>

      {/* Central Atrium Glass Skylight Roof Cutout */}
      <mesh position={[0, 8.55, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshPhysicalMaterial
          color="#38BDF8"
          transparent
          opacity={0.35}
          transmission={0.9}
          roughness={0.05}
        />
      </mesh>
    </group>
  )
}

// ── Stylish Gallery Benches ───────────────────────────────────────────────
export function Bench({ position = [0, 0, 0] as [number, number, number], rotation = 0 }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Leather Cushion Seat */}
      <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.14, 0.65]} />
        <meshStandardMaterial color="#1E2433" roughness={0.4} />
      </mesh>
      {/* Brass Leg Frame */}
      {[[-0.95, -0.25], [0.95, -0.25], [-0.95, 0.25], [0.95, 0.25]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.18, z]} castShadow>
          <boxGeometry args={[0.05, 0.36, 0.05]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.85} roughness={0.2} />
        </mesh>
      ))}
    </group>
  )
}
