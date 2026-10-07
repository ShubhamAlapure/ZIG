import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGalleryStore } from '../../store/galleryStore'

// Column & Obstacle Collision Points in Master Hall
const COLUMN_POSITIONS: [number, number][] = [
  [-7.5, -20],
  [-7.5, -10],
  [-7.5, 0],
  [-7.5, 10],
  [-7.5, 20],
  [7.5, -20],
  [7.5, -10],
  [7.5, 0],
  [7.5, 10],
  [7.5, 20],
]

const PEDESTAL_POSITIONS: [number, number][] = [
  [-7.5, -5],
  [-7.5, 5],
  [7.5, -5],
  [7.5, 5],
]

const BENCH_BOXES = [
  { minX: -1.6, maxX: 1.6, minZ: -10.8, maxZ: -9.2 }, // Central bench North
  { minX: -1.6, maxX: 1.6, minZ: 9.2, maxZ: 10.8 },   // Central bench South
  { minX: -13.3, maxX: -11.7, minZ: -6.6, maxZ: -3.4 }, // West bench 1
  { minX: -13.3, maxX: -11.7, minZ: 13.4, maxZ: 16.6 }, // West bench 2
  { minX: 11.7, maxX: 13.3, minZ: -6.6, maxZ: -3.4 },  // East bench 1
  { minX: 11.7, maxX: 13.3, minZ: 13.4, maxZ: 16.6 },  // East bench 2
]

export function CameraController() {
  const { camera, gl } = useThree()
  const inspectingArtwork = useGalleryStore((s) => s.inspectingArtwork)
  const closeInspection = useGalleryStore((s) => s.closeInspection)
  const setIsPointerLocked = useGalleryStore((s) => s.setIsPointerLocked)

  // FPS Camera Orientation (Yaw & Pitch in radians)
  // Initial yaw = 0 (looking towards North Wall centerpiece at z = -30)
  const yaw = useRef(0)
  const pitch = useRef(0)

  // Player Position & Movement Dynamics
  const playerPos = useRef(new THREE.Vector3(0, 1.7, 12.0)) // Standing in Master Hall looking North
  const velocity = useRef(new THREE.Vector3())
  const keys = useRef<Record<string, boolean>>({})
  const walkCycle = useRef(0)
  const isPointerLockedLocal = useRef(false)

  // Mouse navigation & Click+Drag look state
  const isDragging = useRef(false)
  const lastMousePos = useRef({ x: 0, y: 0 })
  const mouseNavInput = useRef(new THREE.Vector2(0, 0))
  const mouseNavSmoothed = useRef(new THREE.Vector2(0, 0))

  // Inspection Tweening Target
  const inspectTargetPos = useRef(new THREE.Vector3())
  const inspectTargetLook = useRef(new THREE.Vector3())
  const isTweening = useRef(false)

  // ── 1. Keyboard Listeners ────────────────────────────────────────────────
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true

      // If moving while inspecting, gracefully exit inspection
      if (
        (e.code === 'KeyW' ||
          e.code === 'KeyS' ||
          e.code === 'KeyA' ||
          e.code === 'KeyD' ||
          e.code === 'ArrowUp' ||
          e.code === 'ArrowDown' ||
          e.code === 'ArrowLeft' ||
          e.code === 'ArrowRight' ||
          e.code === 'Escape') &&
        useGalleryStore.getState().inspectingArtwork
      ) {
        closeInspection()
      }
    }

    const onKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [closeInspection])

  // ── 2. Mouse Navigation & Click+Drag Look Listeners ───────────────────────
  useEffect(() => {
    const canvas = gl.domElement

    const onPointerLockChange = () => {
      const locked = document.pointerLockElement === canvas || document.pointerLockElement === document.body
      isPointerLockedLocal.current = locked
      setIsPointerLocked(locked)
    }

    const onPointerDown = (e: PointerEvent) => {
      if (useGalleryStore.getState().inspectingArtwork) return
      if (e.button === 0) {
        // Left click initiates drag-to-look
        isDragging.current = true
        lastMousePos.current = { x: e.clientX, y: e.clientY }
        // Stop any accumulated mouse navigation while looking around
        mouseNavInput.current.set(0, 0)
      }
    }

    const onPointerUp = () => {
      isDragging.current = false
    }

    const onPointerMove = (e: PointerEvent) => {
      if (useGalleryStore.getState().inspectingArtwork) return

      // Determine movement deltas (with fallback if movementX/Y is zero or unavailable)
      const dx = e.movementX !== undefined && e.movementX !== 0 ? e.movementX : e.clientX - lastMousePos.current.x
      const dy = e.movementY !== undefined && e.movementY !== 0 ? e.movementY : e.clientY - lastMousePos.current.y
      lastMousePos.current = { x: e.clientX, y: e.clientY }

      if (isDragging.current || isPointerLockedLocal.current) {
        // ── 3. Click + Drag to look around (or pointer-locked look) ──
        const lookSensitivity = 0.0024
        yaw.current -= dx * lookSensitivity
        pitch.current -= dy * lookSensitivity

        // Clamp vertical pitch (~ -82° to +82°)
        pitch.current = Math.max(-1.42, Math.min(1.42, pitch.current))
      } else {
        // ── 2. Mouse movement for navigation (when not dragging) ──
        // Move mouse forward/up (dy < 0) → move forward (+W)
        // Move mouse back/down (dy > 0) → move backward (-S)
        // Move mouse left (dx < 0) → move left (-A)
        // Move mouse right (dx > 0) → move right (+D)
        const navSensitivity = 0.038
        const forwardDelta = -dy * navSensitivity
        const strafeDelta = dx * navSensitivity

        // Smoothly accumulate navigation input with natural bounding
        mouseNavInput.current.x = THREE.MathUtils.clamp(
          mouseNavInput.current.x + strafeDelta,
          -1.0,
          1.0
        )
        mouseNavInput.current.y = THREE.MathUtils.clamp(
          mouseNavInput.current.y + forwardDelta,
          -1.0,
          1.0
        )
      }
    }

    const onPointerLeave = () => {
      // Gracefully decay navigation when cursor leaves canvas
      mouseNavInput.current.set(0, 0)
    }

    const onWindowBlur = () => {
      isDragging.current = false
      mouseNavInput.current.set(0, 0)
    }

    document.addEventListener('pointerlockchange', onPointerLockChange)
    canvas.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
    window.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerleave', onPointerLeave)
    window.addEventListener('blur', onWindowBlur)

    return () => {
      document.removeEventListener('pointerlockchange', onPointerLockChange)
      canvas.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
      window.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('blur', onWindowBlur)
    }
  }, [gl, setIsPointerLocked])

  // ── 3. Smooth Inspection Camera Setup ────────────────────────────────────
  useEffect(() => {
    if (inspectingArtwork) {
      const artPos = new THREE.Vector3(...inspectingArtwork.position)
      const rot = new THREE.Euler(...inspectingArtwork.rotation)
      const normal = new THREE.Vector3(0, 0, 1).applyEuler(rot).normalize()

      const viewDistance = Math.max(inspectingArtwork.width, inspectingArtwork.height) * 0.95 + 1.2
      const camPos = artPos.clone().add(normal.clone().multiplyScalar(viewDistance))
      camPos.y = Math.max(artPos.y, 1.6)

      inspectTargetPos.current.copy(camPos)
      inspectTargetLook.current.copy(artPos)
      isTweening.current = true

      // Unlock mouse cursor so user can read curatorial drawer
      if (document.exitPointerLock) {
        document.exitPointerLock()
      }

      const timer = setTimeout(() => {
        isTweening.current = false
      }, 1600)
      return () => clearTimeout(timer)
    } else {
      isTweening.current = false
    }
  }, [inspectingArtwork])

  // ── 4. Main FPS Frame Update Loop ─────────────────────────────────────────
  useFrame((_, delta) => {
    // ── Mode A: Smooth Painting Inspection Glide ──
    if (inspectingArtwork) {
      camera.position.lerp(inspectTargetPos.current, 0.08)
      const lookMatrix = new THREE.Matrix4().lookAt(camera.position, inspectTargetLook.current, THREE.Object3D.DEFAULT_UP)
      const targetQuat = new THREE.Quaternion().setFromRotationMatrix(lookMatrix)
      camera.quaternion.slerp(targetQuat, 0.08)
      playerPos.current.copy(camera.position)
      return
    }

    // ── Mode B: True First-Person FPS Walking & Navigation ──
    const isSprinting = keys.current['ShiftLeft'] || keys.current['ShiftRight']
    const baseSpeed = isSprinting ? 7.2 : 4.4 // meters per second
    const frameSpeed = baseSpeed * Math.min(delta, 0.1)

    // Smoothly blend & decay mouse navigation input (natural gliding and responsive deceleration)
    mouseNavSmoothed.current.lerp(mouseNavInput.current, 0.26)
    mouseNavInput.current.multiplyScalar(0.72)
    if (mouseNavInput.current.lengthSq() < 0.0001) {
      mouseNavInput.current.set(0, 0)
    }

    // Compute Keyboard Inputs
    const keyboardForward =
      (keys.current['KeyW'] || keys.current['ArrowUp'] ? 1 : 0) -
      (keys.current['KeyS'] || keys.current['ArrowDown'] ? 1 : 0)
    const keyboardStrafe =
      (keys.current['KeyD'] || keys.current['ArrowRight'] ? 1 : 0) -
      (keys.current['KeyA'] || keys.current['ArrowLeft'] ? 1 : 0)

    // Combined Keyboard + Mouse Navigation Inputs (clamped to [-1, 1])
    const forwardInput = THREE.MathUtils.clamp(
      keyboardForward + mouseNavSmoothed.current.y,
      -1,
      1
    )
    const strafeInput = THREE.MathUtils.clamp(
      keyboardStrafe + mouseNavSmoothed.current.x,
      -1,
      1
    )

    // Direction Vectors from Yaw
    const forward = new THREE.Vector3(-Math.sin(yaw.current), 0, -Math.cos(yaw.current))
    const right = new THREE.Vector3(Math.cos(yaw.current), 0, -Math.sin(yaw.current))

    const targetVel = new THREE.Vector3()
    const inputMagnitude = Math.hypot(strafeInput, forwardInput)
    if (inputMagnitude > 0.01) {
      const moveVec = new THREE.Vector2(strafeInput, forwardInput)
      if (moveVec.length() > 1) {
        moveVec.normalize()
      }
      targetVel.addScaledVector(forward, moveVec.y * frameSpeed)
      targetVel.addScaledVector(right, moveVec.x * frameSpeed)
    }

    // Smooth Acceleration & Deceleration (No sliding, responsive stop)
    velocity.current.lerp(targetVel, 0.22)

    // Update Player Position
    const nextPos = playerPos.current.clone().add(velocity.current)

    // ── Collision Detection ──
    // 1. Outer Master Hall Perimeter Walls (36m × 60m: x in [-18, 18], z in [-30, 30])
    nextPos.x = THREE.MathUtils.clamp(nextPos.x, -16.8, 16.8)
    nextPos.z = THREE.MathUtils.clamp(nextPos.z, -28.6, 28.6)

    // 2. Classical Fluted Columns Collision (10 columns)
    const colRadius = 0.85
    for (const [cx, cz] of COLUMN_POSITIONS) {
      const dx = nextPos.x - cx
      const dz = nextPos.z - cz
      const dist = Math.hypot(dx, dz)
      if (dist < colRadius && dist > 0.001) {
        const push = (colRadius - dist) / dist
        nextPos.x += dx * push
        nextPos.z += dz * push
      }
    }

    // 3. Marble Pedestals Collision
    const pedRadius = 0.95
    for (const [px, pz] of PEDESTAL_POSITIONS) {
      const dx = nextPos.x - px
      const dz = nextPos.z - pz
      const dist = Math.hypot(dx, dz)
      if (dist < pedRadius && dist > 0.001) {
        const push = (pedRadius - dist) / dist
        nextPos.x += dx * push
        nextPos.z += dz * push
      }
    }

    // 4. Velvet Benches Collision
    for (const b of BENCH_BOXES) {
      if (nextPos.x > b.minX && nextPos.x < b.maxX && nextPos.z > b.minZ && nextPos.z < b.maxZ) {
        // Push to nearest box edge
        const dMinX = Math.abs(nextPos.x - b.minX)
        const dMaxX = Math.abs(nextPos.x - b.maxX)
        const dMinZ = Math.abs(nextPos.z - b.minZ)
        const dMaxZ = Math.abs(nextPos.z - b.maxZ)
        const minD = Math.min(dMinX, dMaxX, dMinZ, dMaxZ)
        if (minD === dMinX) nextPos.x = b.minX
        else if (minD === dMaxX) nextPos.x = b.maxX
        else if (minD === dMinZ) nextPos.z = b.minZ
        else nextPos.z = b.maxZ
      }
    }

    playerPos.current.copy(nextPos)

    // Subtle Walking Head Bob (1.7m Human eye height)
    const isMoving = velocity.current.lengthSq() > 0.00005
    if (isMoving) {
      walkCycle.current += delta * (isSprinting ? 14 : 9.5)
    }
    const headBob = isMoving ? Math.sin(walkCycle.current) * 0.022 : 0

    // Set Camera Position & Rotation (Euler YXZ)
    camera.position.set(playerPos.current.x, 1.7 + headBob, playerPos.current.z)
    const euler = new THREE.Euler(pitch.current, yaw.current, 0, 'YXZ')
    camera.quaternion.setFromEuler(euler)
  })

  return null
}
