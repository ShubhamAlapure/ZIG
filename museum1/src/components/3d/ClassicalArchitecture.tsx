import { useMemo } from 'react'
import * as THREE from 'three'

// ── Classical Fluted Column with Corinthian Capital ─────────────────────────
export function ClassicalColumn({
  position = [0, 0, 0] as [number, number, number],
  height = 8.6,
  radius = 0.45,
}: {
  position: [number, number, number]
  height?: number
  radius?: number
}) {
  const marbleStoneMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#E4DDD2',
        roughness: 0.35,
        metalness: 0.08,
      }),
    []
  )

  const goldTrimMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#D4AF37',
        roughness: 0.25,
        metalness: 0.85,
      }),
    []
  )

  return (
    <group position={position}>
      {/* Square Plinth Base */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[radius * 2.8, 0.5, radius * 2.8]} />
        <primitive object={marbleStoneMat} attach="material" />
      </mesh>
      {/* Molded Base Ring */}
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius * 1.25, radius * 1.35, 0.2, 24]} />
        <primitive object={marbleStoneMat} attach="material" />
      </mesh>

      {/* Main Fluted Shaft */}
      <mesh position={[0, height / 2 + 0.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius * 0.92, radius, height - 1.2, 24]} />
        <primitive object={marbleStoneMat} attach="material" />
      </mesh>

      {/* Column Astragal Ring */}
      <mesh position={[0, height - 0.7, 0]}>
        <cylinderGeometry args={[radius * 1.05, radius * 1.05, 0.08, 24]} />
        <primitive object={goldTrimMat} attach="material" />
      </mesh>

      {/* Capital Acanthus Bell */}
      <mesh position={[0, height - 0.35, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius * 1.4, radius * 0.95, 0.6, 16]} />
        <primitive object={marbleStoneMat} attach="material" />
      </mesh>

      {/* Abacus Block */}
      <mesh position={[0, height - 0.04, 0]} castShadow receiveShadow>
        <boxGeometry args={[radius * 2.6, 0.08, radius * 2.6]} />
        <primitive object={marbleStoneMat} attach="material" />
      </mesh>
    </group>
  )
}

// ── Classical Wall Pilaster ────────────────────────────────────────────────
export function WallPilaster({
  position = [0, 0, 0] as [number, number, number],
  rotation = 0,
  height = 8.6,
}: {
  position: [number, number, number]
  rotation?: number
  height?: number
}) {
  const marbleStoneMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#DFD7CA',
        roughness: 0.35,
        metalness: 0.08,
      }),
    []
  )
  const goldTrimMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#D4AF37',
        roughness: 0.25,
        metalness: 0.85,
      }),
    []
  )

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Plinth */}
      <mesh position={[0, 0.4, 0.15]} castShadow>
        <boxGeometry args={[0.9, 0.8, 0.3]} />
        <primitive object={marbleStoneMat} attach="material" />
      </mesh>
      {/* Shaft */}
      <mesh position={[0, height / 2 + 0.2, 0.1]} castShadow>
        <boxGeometry args={[0.7, height - 1.2, 0.2]} />
        <primitive object={marbleStoneMat} attach="material" />
      </mesh>
      {/* Gold Inlay Flute */}
      <mesh position={[0, height / 2 + 0.2, 0.21]}>
        <boxGeometry args={[0.35, height - 1.6, 0.02]} />
        <primitive object={goldTrimMat} attach="material" />
      </mesh>
      {/* Capital */}
      <mesh position={[0, height - 0.3, 0.15]} castShadow>
        <boxGeometry args={[1.0, 0.5, 0.3]} />
        <primitive object={marbleStoneMat} attach="material" />
      </mesh>
    </group>
  )
}

// ── Antique Grand Crystal & Brass Chandelier ───────────────────────────────
export function CrystalChandelier({
  position = [0, 7.5, 0] as [number, number, number],
}: {
  position: [number, number, number]
}) {
  const brassMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#D4AF37',
        metalness: 0.9,
        roughness: 0.18,
      }),
    []
  )

  return (
    <group position={position}>
      {/* Ceiling Chain & Canopy */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1.2, 8]} />
        <primitive object={brassMat} attach="material" />
      </mesh>
      <mesh position={[0, 1.15, 0]}>
        <coneGeometry args={[0.35, 0.18, 16]} />
        <primitive object={brassMat} attach="material" />
      </mesh>

      {/* Tier 1 Brass Tier Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.5, 0.05, 16, 32]} />
        <primitive object={brassMat} attach="material" />
      </mesh>

      {/* Tier 2 Upper Ring */}
      <mesh position={[0, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.9, 0.04, 16, 24]} />
        <primitive object={brassMat} attach="material" />
      </mesh>

      {/* Candle Lights around Ring */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * Math.PI * 2) / 8
        const x = Math.cos(angle) * 1.5
        const z = Math.sin(angle) * 1.5
        return (
          <group key={i} position={[x, 0.15, z]}>
            <mesh>
              <cylinderGeometry args={[0.02, 0.02, 0.22, 8]} />
              <meshStandardMaterial color="#FDF6E2" />
            </mesh>
            <mesh position={[0, 0.15, 0]}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshBasicMaterial color="#FFE8A3" />
            </mesh>
          </group>
        )
      })}

      {/* Central Radiating Warm Pointlight (no castShadow for performance) */}
      <pointLight position={[0, -0.2, 0]} intensity={18} distance={30} color="#FFF5E0" />
    </group>
  )
}

// ── Antique Leather & Walnut Museum Gallery Bench ──────────────────────────
export function MuseumBench({
  position = [0, 0, 0] as [number, number, number],
  rotation = 0,
}: {
  position: [number, number, number]
  rotation?: number
}) {
  const walnutWood = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#2E1D13',
        roughness: 0.4,
        metalness: 0.1,
      }),
    []
  )
  const velvetSeat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#52141A',
        roughness: 0.65,
        metalness: 0.08,
      }),
    []
  )
  const brassTrim = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#D4AF37',
        metalness: 0.85,
        roughness: 0.2,
      }),
    []
  )

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Velvet Tufted Cushion */}
      <mesh position={[0, 0.48, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 0.14, 0.85]} />
        <primitive object={velvetSeat} attach="material" />
      </mesh>
      {/* Walnut Sub-base Frame */}
      <mesh position={[0, 0.38, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.9, 0.08, 0.95]} />
        <primitive object={walnutWood} attach="material" />
      </mesh>
      {/* Carved Legs */}
      {[
        [-1.25, -0.34],
        [1.25, -0.34],
        [-1.25, 0.34],
        [1.25, 0.34],
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0.17, z]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.05, 0.035, 0.34, 12]} />
            <primitive object={walnutWood} attach="material" />
          </mesh>
          <mesh position={[0, -0.15, 0]}>
            <cylinderGeometry args={[0.04, 0.05, 0.04, 12]} />
            <primitive object={brassTrim} attach="material" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// ── Classical Marble Pedestal with Bronze Sculpture ─────────────────────────
export function ClassicalSculpturePedestal({
  position = [0, 0, 0] as [number, number, number],
  rotation = 0,
}: {
  position: [number, number, number]
  rotation?: number
}) {
  const marblePedestalMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#E2DBD0',
        roughness: 0.25,
        metalness: 0.1,
      }),
    []
  )
  const bronzeStatueMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#42372E',
        roughness: 0.3,
        metalness: 0.85,
      }),
    []
  )
  const brassTrim = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#D4AF37',
        metalness: 0.85,
        roughness: 0.2,
      }),
    []
  )

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Stepped Pedestal Base */}
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.3, 1.2]} />
        <primitive object={marblePedestalMat} attach="material" />
      </mesh>
      {/* Pedestal Shaft */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.9, 0.9]} />
        <primitive object={marblePedestalMat} attach="material" />
      </mesh>
      {/* Molded Plinth Top */}
      <mesh position={[0, 1.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.05, 0.1, 1.05]} />
        <primitive object={brassTrim} attach="material" />
      </mesh>

      {/* Classical Bronze Torso / Bust Figure */}
      <group position={[0, 1.85, 0]}>
        <mesh position={[0, -0.45, 0]} castShadow>
          <cylinderGeometry args={[0.25, 0.28, 0.1, 16]} />
          <primitive object={bronzeStatueMat} attach="material" />
        </mesh>
        <mesh castShadow>
          <cylinderGeometry args={[0.22, 0.18, 0.7, 16]} />
          <primitive object={bronzeStatueMat} attach="material" />
        </mesh>
        <mesh position={[0, 0.48, 0]} castShadow>
          <sphereGeometry args={[0.18, 16, 16]} />
          <primitive object={bronzeStatueMat} attach="material" />
        </mesh>
      </group>
    </group>
  )
}

// ── Complete Unified Single Master Museum Hall Architecture ────────────────
export function MuseumArchitecture() {
  const wallPlasterMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#E6DFD4',
        roughness: 0.5,
        metalness: 0.05,
        side: THREE.DoubleSide,
      }),
    []
  )

  const wainscotWalnutMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#322015',
        roughness: 0.35,
        metalness: 0.12,
        side: THREE.DoubleSide,
      }),
    []
  )

  const goldCorniceMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#D4AF37',
        roughness: 0.25,
        metalness: 0.85,
        side: THREE.DoubleSide,
      }),
    []
  )

  const ceilingCoffersMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#DBD3C5',
        roughness: 0.55,
        metalness: 0.05,
        side: THREE.DoubleSide,
      }),
    []
  )

  return (
    <group>
      {/* ═════════════════════════════════════════════════════════════════════
          1. MASTER CEILING & COFFERED BEAMS (60m × 36m at Y = 8.8m)
          ═════════════════════════════════════════════════════════════════════ */}
      <mesh position={[0, 8.8, 0]} receiveShadow>
        <boxGeometry args={[36.4, 0.4, 60.4]} />
        <primitive object={ceilingCoffersMat} attach="material" />
      </mesh>

      {/* Master Gilded Cornice Borders along Ceiling Perimeter */}
      <mesh position={[0, 8.6, -30]}>
        <boxGeometry args={[36.2, 0.14, 0.3]} />
        <primitive object={goldCorniceMat} attach="material" />
      </mesh>
      <mesh position={[0, 8.6, 30]}>
        <boxGeometry args={[36.2, 0.14, 0.3]} />
        <primitive object={goldCorniceMat} attach="material" />
      </mesh>
      <mesh position={[-18, 8.6, 0]}>
        <boxGeometry args={[0.3, 0.14, 60.2]} />
        <primitive object={goldCorniceMat} attach="material" />
      </mesh>
      <mesh position={[18, 8.6, 0]}>
        <boxGeometry args={[0.3, 0.14, 60.2]} />
        <primitive object={goldCorniceMat} attach="material" />
      </mesh>

      {/* Longitudinal Gilded Beams over Columns */}
      <mesh position={[-7.5, 8.55, 0]}>
        <boxGeometry args={[1.2, 0.2, 60.0]} />
        <primitive object={ceilingCoffersMat} attach="material" />
      </mesh>
      <mesh position={[7.5, 8.55, 0]}>
        <boxGeometry args={[1.2, 0.2, 60.0]} />
        <primitive object={ceilingCoffersMat} attach="material" />
      </mesh>

      {/* 3 Grand Crystal Chandeliers along Central Nave */}
      <CrystalChandelier position={[0, 7.3, -18]} />
      <CrystalChandelier position={[0, 7.3, 0]} />
      <CrystalChandelier position={[0, 7.3, 18]} />

      {/* ═════════════════════════════════════════════════════════════════════
          2. NORTH MONUMENTAL WALL (z = -30, x: [-18, 18])
          ═════════════════════════════════════════════════════════════════════ */}
      <mesh position={[0, 4.3, -30]} receiveShadow castShadow>
        <boxGeometry args={[36.4, 8.6, 0.6]} />
        <primitive object={wallPlasterMat} attach="material" />
      </mesh>
      <mesh position={[0, 0.7, -29.65]}>
        <boxGeometry args={[36.4, 1.4, 0.1]} />
        <primitive object={wainscotWalnutMat} attach="material" />
      </mesh>
      <mesh position={[0, 1.42, -29.6]}>
        <boxGeometry args={[36.4, 0.06, 0.08]} />
        <primitive object={goldCorniceMat} attach="material" />
      </mesh>

      {/* North Wall Pilasters */}
      <WallPilaster position={[-12.0, 0, -29.65]} rotation={0} />
      <WallPilaster position={[-4.5, 0, -29.65]} rotation={0} />
      <WallPilaster position={[4.5, 0, -29.65]} rotation={0} />
      <WallPilaster position={[12.0, 0, -29.65]} rotation={0} />

      {/* ═════════════════════════════════════════════════════════════════════
          3. SOUTH MONUMENTAL WALL (z = +30, x: [-18, 18])
          ═════════════════════════════════════════════════════════════════════ */}
      <mesh position={[0, 4.3, 30]} receiveShadow castShadow>
        <boxGeometry args={[36.4, 8.6, 0.6]} />
        <primitive object={wallPlasterMat} attach="material" />
      </mesh>
      <mesh position={[0, 0.7, 29.65]}>
        <boxGeometry args={[36.4, 1.4, 0.1]} />
        <primitive object={wainscotWalnutMat} attach="material" />
      </mesh>
      <mesh position={[0, 1.42, 29.6]}>
        <boxGeometry args={[36.4, 0.06, 0.08]} />
        <primitive object={goldCorniceMat} attach="material" />
      </mesh>

      {/* South Wall Pilasters */}
      <WallPilaster position={[-12.0, 0, 29.65]} rotation={Math.PI} />
      <WallPilaster position={[-4.5, 0, 29.65]} rotation={Math.PI} />
      <WallPilaster position={[4.5, 0, 29.65]} rotation={Math.PI} />
      <WallPilaster position={[12.0, 0, 29.65]} rotation={Math.PI} />

      {/* ═════════════════════════════════════════════════════════════════════
          4. WEST LONGITUDINAL WALL (x = -18, z: [-30, 30])
          ═════════════════════════════════════════════════════════════════════ */}
      <mesh position={[-18, 4.3, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.6, 8.6, 60.4]} />
        <primitive object={wallPlasterMat} attach="material" />
      </mesh>
      <mesh position={[-17.65, 0.7, 0]}>
        <boxGeometry args={[0.1, 1.4, 60.4]} />
        <primitive object={wainscotWalnutMat} attach="material" />
      </mesh>
      <mesh position={[-17.6, 1.42, 0]}>
        <boxGeometry args={[0.08, 0.06, 60.4]} />
        <primitive object={goldCorniceMat} attach="material" />
      </mesh>

      {/* West Wall Pilasters dividing the 5 Curatorial Bays */}
      {[-20, -10, 0, 10, 20].map((zPos, i) => (
        <WallPilaster key={`w-pil-${i}`} position={[-17.65, 0, zPos]} rotation={Math.PI / 2} />
      ))}

      {/* ═════════════════════════════════════════════════════════════════════
          5. EAST LONGITUDINAL WALL (x = +18, z: [-30, 30])
          ═════════════════════════════════════════════════════════════════════ */}
      <mesh position={[18, 4.3, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.6, 8.6, 60.4]} />
        <primitive object={wallPlasterMat} attach="material" />
      </mesh>
      <mesh position={[17.65, 0.7, 0]}>
        <boxGeometry args={[0.1, 1.4, 60.4]} />
        <primitive object={wainscotWalnutMat} attach="material" />
      </mesh>
      <mesh position={[17.6, 1.42, 0]}>
        <boxGeometry args={[0.08, 0.06, 60.4]} />
        <primitive object={goldCorniceMat} attach="material" />
      </mesh>

      {/* East Wall Pilasters dividing the 5 Curatorial Bays */}
      {[-20, -10, 0, 10, 20].map((zPos, i) => (
        <WallPilaster key={`e-pil-${i}`} position={[17.65, 0, zPos]} rotation={-Math.PI / 2} />
      ))}

      {/* ═════════════════════════════════════════════════════════════════════
          6. DUAL COLONNADE AISLES (10 Fluted Corinthian Columns)
          ═════════════════════════════════════════════════════════════════════ */}
      {/* West Colonnade Row (x = -7.5) */}
      <ClassicalColumn position={[-7.5, 0, -20]} height={8.6} radius={0.46} />
      <ClassicalColumn position={[-7.5, 0, -10]} height={8.6} radius={0.46} />
      <ClassicalColumn position={[-7.5, 0, 0]} height={8.6} radius={0.46} />
      <ClassicalColumn position={[-7.5, 0, 10]} height={8.6} radius={0.46} />
      <ClassicalColumn position={[-7.5, 0, 20]} height={8.6} radius={0.46} />

      {/* East Colonnade Row (x = +7.5) */}
      <ClassicalColumn position={[7.5, 0, -20]} height={8.6} radius={0.46} />
      <ClassicalColumn position={[7.5, 0, -10]} height={8.6} radius={0.46} />
      <ClassicalColumn position={[7.5, 0, 0]} height={8.6} radius={0.46} />
      <ClassicalColumn position={[7.5, 0, 10]} height={8.6} radius={0.46} />
      <ClassicalColumn position={[7.5, 0, 20]} height={8.6} radius={0.46} />

      {/* ═════════════════════════════════════════════════════════════════════
          7. VELVET BENCHES & CLASSICAL MARBLE SCULPTURES
          ═════════════════════════════════════════════════════════════════════ */}
      {/* Central Nave Benches */}
      <MuseumBench position={[0, 0, -10]} rotation={0} />
      <MuseumBench position={[0, 0, 10]} rotation={0} />

      {/* Side Aisle Benches */}
      <MuseumBench position={[-12.5, 0, -5]} rotation={Math.PI / 2} />
      <MuseumBench position={[-12.5, 0, 15]} rotation={Math.PI / 2} />
      <MuseumBench position={[12.5, 0, -5]} rotation={-Math.PI / 2} />
      <MuseumBench position={[12.5, 0, 15]} rotation={-Math.PI / 2} />

      {/* Classical Bronze Sculpture Pedestals */}
      <ClassicalSculpturePedestal position={[-7.5, 0, -5]} rotation={Math.PI / 4} />
      <ClassicalSculpturePedestal position={[-7.5, 0, 5]} rotation={-Math.PI / 4} />
      <ClassicalSculpturePedestal position={[7.5, 0, -5]} rotation={-Math.PI / 4} />
      <ClassicalSculpturePedestal position={[7.5, 0, 5]} rotation={Math.PI / 4} />
    </group>
  )
}
