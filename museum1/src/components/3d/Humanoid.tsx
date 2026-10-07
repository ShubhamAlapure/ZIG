import { forwardRef, useImperativeHandle, useRef } from 'react'
import * as THREE from 'three'

export interface PoseData {
  bodyBob?: number
  hipSway?: number
  headYaw?: number
  headPitch?: number
  shoulderL?: [number, number, number] // [pitch, yaw, roll]
  shoulderR?: [number, number, number]
  elbowL?: number
  elbowR?: number
  thighL?: [number, number, number]
  thighR?: [number, number, number]
  kneeL?: number
  kneeR?: number
}

export interface HumanoidHandle {
  setPose: (pose: PoseData) => void
  group: THREE.Group | null
}

export interface HumanoidProps {
  hairStyle?: 'short' | 'long' | 'bun' | 'ponytail' | 'curly' | 'beret'
  hairColor?: string
  shirtColor?: string
  pantsColor?: string
  skinColor?: string
  shoeColor?: string
  accessory?: 'glasses' | 'sunglasses' | 'bag' | 'scarf' | 'watch' | 'none'
  scale?: number
  gender?: 'male' | 'female' | 'neutral'
  position?: [number, number, number]
  rotation?: [number, number, number]
  onClick?: () => void
  onPointerEnter?: () => void
  onPointerLeave?: () => void
}

export const Humanoid = forwardRef<HumanoidHandle, HumanoidProps>(function Humanoid(
  {
    hairStyle = 'short',
    hairColor = '#3D2314',
    shirtColor = '#1E392A',
    pantsColor = '#1C2541',
    skinColor = '#F5D0A9',
    shoeColor = '#222222',
    accessory = 'none',
    scale = 1.0,
    gender = 'neutral',
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    onClick,
    onPointerEnter,
    onPointerLeave,
  },
  ref
) {
  const rootGroupRef = useRef<THREE.Group>(null!)
  const pelvisRef = useRef<THREE.Group>(null!)
  const torsoRef = useRef<THREE.Group>(null!)
  const headGroupRef = useRef<THREE.Group>(null!)

  // Limbs
  const shoulderLRef = useRef<THREE.Group>(null!)
  const shoulderRRef = useRef<THREE.Group>(null!)
  const elbowLRef = useRef<THREE.Group>(null!)
  const elbowRRef = useRef<THREE.Group>(null!)

  const thighLRef = useRef<THREE.Group>(null!)
  const thighRRef = useRef<THREE.Group>(null!)
  const kneeLRef = useRef<THREE.Group>(null!)
  const kneeRRef = useRef<THREE.Group>(null!)

  useImperativeHandle(ref, () => ({
    group: rootGroupRef.current,
    setPose: (pose: PoseData) => {
      if (!pelvisRef.current) return

      // Pelvis / Torso Bob & Sway
      if (pose.bodyBob !== undefined) {
        pelvisRef.current.position.y = 0.95 + pose.bodyBob
      }
      if (pose.hipSway !== undefined) {
        pelvisRef.current.rotation.z = pose.hipSway
        if (torsoRef.current) {
          torsoRef.current.rotation.z = -pose.hipSway * 0.5
        }
      }

      // Head tracking
      if (headGroupRef.current) {
        if (pose.headYaw !== undefined) headGroupRef.current.rotation.y = pose.headYaw
        if (pose.headPitch !== undefined) headGroupRef.current.rotation.x = pose.headPitch
      }

      // Left Arm
      if (shoulderLRef.current && pose.shoulderL) {
        shoulderLRef.current.rotation.set(...pose.shoulderL)
      }
      if (elbowLRef.current && pose.elbowL !== undefined) {
        elbowLRef.current.rotation.x = pose.elbowL
      }

      // Right Arm
      if (shoulderRRef.current && pose.shoulderR) {
        shoulderRRef.current.rotation.set(...pose.shoulderR)
      }
      if (elbowRRef.current && pose.elbowR !== undefined) {
        elbowRRef.current.rotation.x = pose.elbowR
      }

      // Left Leg
      if (thighLRef.current && pose.thighL) {
        thighLRef.current.rotation.set(...pose.thighL)
      }
      if (kneeLRef.current && pose.kneeL !== undefined) {
        kneeLRef.current.rotation.x = pose.kneeL
      }

      // Right Leg
      if (thighRRef.current && pose.thighR) {
        thighRRef.current.rotation.set(...pose.thighR)
      }
      if (kneeRRef.current && pose.kneeR !== undefined) {
        kneeRRef.current.rotation.x = pose.kneeR
      }
    },
  }))

  const isFemale = gender === 'female'
  const shoulderWidth = isFemale ? 0.38 : 0.46
  const waistWidth = isFemale ? 0.26 : 0.32
  const hipWidth = isFemale ? 0.34 : 0.32

  return (
    <group
      ref={rootGroupRef}
      position={position}
      rotation={rotation as unknown as THREE.Euler}
      scale={[scale, scale, scale]}
      onClick={onClick}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      {/* Soft Ground Contact Shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.38, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} depthWrite={false} />
      </mesh>

      {/* ── PELVIS (Root of Animation Hierarchy at height ~0.95) ── */}
      <group ref={pelvisRef} position={[0, 0.95, 0]}>
        {/* Hips / Pants base */}
        <mesh castShadow position={[0, 0, 0]}>
          <boxGeometry args={[hipWidth, 0.16, 0.22]} />
          <meshStandardMaterial color={pantsColor} roughness={0.6} />
        </mesh>

        {/* Belt */}
        <mesh castShadow position={[0, 0.07, 0]}>
          <boxGeometry args={[hipWidth + 0.02, 0.04, 0.23]} />
          <meshStandardMaterial color="#1A1814" roughness={0.5} />
        </mesh>
        {/* Metallic Belt Buckle */}
        <mesh castShadow position={[0, 0.07, 0.12]}>
          <boxGeometry args={[0.06, 0.05, 0.02]} />
          <meshStandardMaterial color="#D4AF37" roughness={0.2} metalness={0.8} />
        </mesh>

        {/* ── TORSO ── */}
        <group ref={torsoRef} position={[0, 0.09, 0]}>
          {/* Main Chest / Shirt (Tapered geometry) */}
          <mesh castShadow position={[0, 0.24, 0]}>
            <cylinderGeometry args={[shoulderWidth * 0.5, waistWidth * 0.5, 0.46, 16]} />
            <meshStandardMaterial color={shirtColor} roughness={0.5} />
          </mesh>

          {/* V-Neck Collar Detail */}
          <mesh castShadow position={[0, 0.42, 0.09]} rotation={[0.3, 0, 0]}>
            <coneGeometry args={[0.08, 0.14, 3]} />
            <meshStandardMaterial color={skinColor} roughness={0.5} />
          </mesh>

          {/* ── NECK & HEAD ── */}
          <group ref={headGroupRef} position={[0, 0.5, 0]}>
            {/* Neck Cylinder */}
            <mesh castShadow position={[0, 0.05, 0]}>
              <cylinderGeometry args={[0.06, 0.07, 0.12, 12]} />
              <meshStandardMaterial color={skinColor} roughness={0.5} />
            </mesh>

            {/* Cranium Sphere */}
            <mesh castShadow position={[0, 0.22, 0]}>
              <sphereGeometry args={[0.13, 24, 24]} />
              <meshStandardMaterial color={skinColor} roughness={0.4} />
            </mesh>

            {/* Tapered Chin / Jaw Box */}
            <mesh castShadow position={[0, 0.14, 0.03]}>
              <boxGeometry args={[0.13, 0.1, 0.13]} />
              <meshStandardMaterial color={skinColor} roughness={0.4} />
            </mesh>

            {/* Nose Cone */}
            <mesh castShadow position={[0, 0.2, 0.14]} rotation={[Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.02, 0.04, 8]} />
              <meshStandardMaterial color={skinColor} roughness={0.4} />
            </mesh>

            {/* Stylized Eyes */}
            <mesh position={[-0.045, 0.22, 0.125]}>
              <sphereGeometry args={[0.016, 12, 12]} />
              <meshBasicMaterial color="#1F2937" />
            </mesh>
            <mesh position={[0.045, 0.22, 0.125]}>
              <sphereGeometry args={[0.016, 12, 12]} />
              <meshBasicMaterial color="#1F2937" />
            </mesh>

            {/* Eyebrows */}
            <mesh position={[-0.045, 0.245, 0.13]} rotation={[0, 0, -0.1]}>
              <boxGeometry args={[0.035, 0.008, 0.01]} />
              <meshStandardMaterial color={hairColor} />
            </mesh>
            <mesh position={[0.045, 0.245, 0.13]} rotation={[0, 0, 0.1]}>
              <boxGeometry args={[0.035, 0.008, 0.01]} />
              <meshStandardMaterial color={hairColor} />
            </mesh>

            {/* ── PROCEDURAL HAIR STYLES ── */}
            {hairStyle === 'short' && (
              <group position={[0, 0.26, -0.01]}>
                <mesh castShadow>
                  <sphereGeometry args={[0.138, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
                  <meshStandardMaterial color={hairColor} roughness={0.7} />
                </mesh>
              </group>
            )}

            {hairStyle === 'long' && (
              <group position={[0, 0.24, 0]}>
                {/* Hair Crown */}
                <mesh castShadow position={[0, 0.02, 0]}>
                  <sphereGeometry args={[0.142, 20, 20]} />
                  <meshStandardMaterial color={hairColor} roughness={0.7} />
                </mesh>
                {/* Flowing Locks Left */}
                <mesh castShadow position={[-0.1, -0.1, 0.02]} rotation={[0, 0, 0.2]}>
                  <cylinderGeometry args={[0.04, 0.06, 0.28, 8]} />
                  <meshStandardMaterial color={hairColor} roughness={0.7} />
                </mesh>
                {/* Flowing Locks Right */}
                <mesh castShadow position={[0.1, -0.1, 0.02]} rotation={[0, 0, -0.2]}>
                  <cylinderGeometry args={[0.04, 0.06, 0.28, 8]} />
                  <meshStandardMaterial color={hairColor} roughness={0.7} />
                </mesh>
                {/* Back Flowing Locks */}
                <mesh castShadow position={[0, -0.12, -0.08]} rotation={[0.2, 0, 0]}>
                  <boxGeometry args={[0.22, 0.32, 0.08]} />
                  <meshStandardMaterial color={hairColor} roughness={0.7} />
                </mesh>
              </group>
            )}

            {hairStyle === 'bun' && (
              <group position={[0, 0.24, 0]}>
                <mesh castShadow position={[0, 0.02, 0]}>
                  <sphereGeometry args={[0.138, 20, 20]} />
                  <meshStandardMaterial color={hairColor} roughness={0.7} />
                </mesh>
                {/* Top Bun */}
                <mesh castShadow position={[0, 0.14, -0.04]}>
                  <sphereGeometry args={[0.06, 16, 16]} />
                  <meshStandardMaterial color={hairColor} roughness={0.7} />
                </mesh>
              </group>
            )}

            {hairStyle === 'ponytail' && (
              <group position={[0, 0.24, 0]}>
                <mesh castShadow position={[0, 0.02, 0]}>
                  <sphereGeometry args={[0.138, 20, 20]} />
                  <meshStandardMaterial color={hairColor} roughness={0.7} />
                </mesh>
                {/* Ponytail Strand */}
                <mesh castShadow position={[0, 0.02, -0.16]} rotation={[-0.6, 0, 0]}>
                  <cylinderGeometry args={[0.03, 0.05, 0.25, 8]} />
                  <meshStandardMaterial color={hairColor} roughness={0.7} />
                </mesh>
              </group>
            )}

            {hairStyle === 'beret' && (
              <group position={[0, 0.25, 0]}>
                <mesh castShadow position={[0, 0.01, 0]}>
                  <sphereGeometry args={[0.136, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
                  <meshStandardMaterial color={hairColor} roughness={0.7} />
                </mesh>
                {/* Artist Beret Cap */}
                <mesh castShadow position={[0.02, 0.1, -0.01]} rotation={[0.2, 0, -0.2]}>
                  <cylinderGeometry args={[0.16, 0.12, 0.06, 20]} />
                  <meshStandardMaterial color="#8B0000" roughness={0.6} />
                </mesh>
              </group>
            )}

            {/* ── ACCESSORIES ── */}
            {accessory === 'glasses' && (
              <group position={[0, 0.22, 0.135]}>
                <mesh position={[-0.045, 0, 0]}>
                  <ringGeometry args={[0.02, 0.026, 16]} />
                  <meshStandardMaterial color="#333333" metalness={0.8} />
                </mesh>
                <mesh position={[0.045, 0, 0]}>
                  <ringGeometry args={[0.02, 0.026, 16]} />
                  <meshStandardMaterial color="#333333" metalness={0.8} />
                </mesh>
                <mesh position={[0, 0, 0]}>
                  <boxGeometry args={[0.03, 0.005, 0.005]} />
                  <meshStandardMaterial color="#333333" />
                </mesh>
              </group>
            )}

            {accessory === 'sunglasses' && (
              <group position={[0, 0.22, 0.135]}>
                <mesh position={[0, 0, 0]}>
                  <boxGeometry args={[0.13, 0.038, 0.01]} />
                  <meshStandardMaterial color="#111111" roughness={0.1} metalness={0.9} />
                </mesh>
              </group>
            )}

            {accessory === 'scarf' && (
              <mesh castShadow position={[0, -0.01, 0]}>
                <torusGeometry args={[0.08, 0.035, 12, 24]} />
                <meshStandardMaterial color="#C9A94F" roughness={0.7} />
              </mesh>
            )}
          </group>

          {/* ── LEFT ARM ── */}
          <group ref={shoulderLRef} position={[-shoulderWidth * 0.5 - 0.02, 0.42, 0]}>
            {/* Upper Arm */}
            <mesh castShadow position={[0, -0.14, 0]}>
              <cylinderGeometry args={[0.045, 0.04, 0.26, 12]} />
              <meshStandardMaterial color={shirtColor} roughness={0.5} />
            </mesh>

            {/* Left Elbow */}
            <group ref={elbowLRef} position={[0, -0.27, 0]}>
              {/* Forearm */}
              <mesh castShadow position={[0, -0.13, 0]}>
                <cylinderGeometry args={[0.038, 0.032, 0.25, 12]} />
                <meshStandardMaterial color={skinColor} roughness={0.5} />
              </mesh>
              {/* Left Hand */}
              <mesh castShadow position={[0, -0.27, 0]}>
                <sphereGeometry args={[0.038, 12, 12]} />
                <meshStandardMaterial color={skinColor} roughness={0.4} />
              </mesh>

              {accessory === 'watch' && (
                <mesh position={[0, -0.22, 0]}>
                  <cylinderGeometry args={[0.04, 0.04, 0.02, 12]} />
                  <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
                </mesh>
              )}
            </group>
          </group>

          {/* ── RIGHT ARM ── */}
          <group ref={shoulderRRef} position={[shoulderWidth * 0.5 + 0.02, 0.42, 0]}>
            {/* Upper Arm */}
            <mesh castShadow position={[0, -0.14, 0]}>
              <cylinderGeometry args={[0.045, 0.04, 0.26, 12]} />
              <meshStandardMaterial color={shirtColor} roughness={0.5} />
            </mesh>

            {/* Right Elbow */}
            <group ref={elbowRRef} position={[0, -0.27, 0]}>
              {/* Forearm */}
              <mesh castShadow position={[0, -0.13, 0]}>
                <cylinderGeometry args={[0.038, 0.032, 0.25, 12]} />
                <meshStandardMaterial color={skinColor} roughness={0.5} />
              </mesh>
              {/* Right Hand */}
              <mesh castShadow position={[0, -0.27, 0]}>
                <sphereGeometry args={[0.038, 12, 12]} />
                <meshStandardMaterial color={skinColor} roughness={0.4} />
              </mesh>
            </group>
          </group>

          {/* Messenger Bag Strap */}
          {accessory === 'bag' && (
            <group>
              <mesh position={[0, 0.24, 0]} rotation={[0, 0, 0.6]}>
                <torusGeometry args={[0.26, 0.015, 8, 32]} />
                <meshStandardMaterial color="#4A2E16" roughness={0.8} />
              </mesh>
              <mesh castShadow position={[0.22, -0.05, 0.08]} rotation={[0, 0.2, 0]}>
                <boxGeometry args={[0.18, 0.22, 0.06]} />
                <meshStandardMaterial color="#4A2E16" roughness={0.7} />
              </mesh>
            </group>
          )}
        </group>

        {/* ── LEFT LEG ── */}
        <group ref={thighLRef} position={[-hipWidth * 0.32, -0.04, 0]}>
          {/* Left Thigh */}
          <mesh castShadow position={[0, -0.2, 0]}>
            <cylinderGeometry args={[0.065, 0.052, 0.38, 12]} />
            <meshStandardMaterial color={pantsColor} roughness={0.6} />
          </mesh>

          {/* Left Knee */}
          <group ref={kneeLRef} position={[0, -0.38, 0]}>
            {/* Calf */}
            <mesh castShadow position={[0, -0.19, 0]}>
              <cylinderGeometry args={[0.05, 0.04, 0.36, 12]} />
              <meshStandardMaterial color={pantsColor} roughness={0.6} />
            </mesh>
            {/* Foot / Shoe */}
            <mesh castShadow position={[0, -0.38, 0.06]}>
              <boxGeometry args={[0.08, 0.06, 0.18]} />
              <meshStandardMaterial color={shoeColor} roughness={0.4} />
            </mesh>
          </group>
        </group>

        {/* ── RIGHT LEG ── */}
        <group ref={thighRRef} position={[hipWidth * 0.32, -0.04, 0]}>
          {/* Right Thigh */}
          <mesh castShadow position={[0, -0.2, 0]}>
            <cylinderGeometry args={[0.065, 0.052, 0.38, 12]} />
            <meshStandardMaterial color={pantsColor} roughness={0.6} />
          </mesh>

          {/* Right Knee */}
          <group ref={kneeRRef} position={[0, -0.38, 0]}>
            {/* Calf */}
            <mesh castShadow position={[0, -0.19, 0]}>
              <cylinderGeometry args={[0.05, 0.04, 0.36, 12]} />
              <meshStandardMaterial color={pantsColor} roughness={0.6} />
            </mesh>
            {/* Foot / Shoe */}
            <mesh castShadow position={[0, -0.38, 0.06]}>
              <boxGeometry args={[0.08, 0.06, 0.18]} />
              <meshStandardMaterial color={shoeColor} roughness={0.4} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  )
})
