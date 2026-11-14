import * as THREE from 'three';
import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useActor } from '../useActor';
import { WorldContextType } from '../ParkActors';
import { KITE_LOOPS } from '../parkConstants';
import {
  solveTwoBoneIK,
  solveLookAtIK,
  curlFingers,
  dampAngle,
  randomRange,
  UP_AXIS,
} from '../actorIKHelpers';

// Number of points in the kite string line
const STRING_SEGMENTS = 16;
// Number of points in the ribbon tail
const TAIL_SEGMENTS = 12;

function createKiteDiamondGeometry() {
  const geom = new THREE.BufferGeometry();
  // 4 triangular facets forming the diamond sail:
  // Top: (0, 0.44, 0), Right: (0.36, 0.08, -0.04), Bottom: (0, -0.62, 0), Left: (-0.36, 0.08, -0.04), Center: (0, 0.08, 0.03)
  const positions = new Float32Array([
    // Triangle 0 (Top-Right): 0, 4, 1
    0, 0.44, 0,
    0, 0.08, 0.03,
    0.36, 0.08, -0.04,

    // Triangle 1 (Bottom-Right): 4, 2, 1
    0, 0.08, 0.03,
    0, -0.62, 0,
    0.36, 0.08, -0.04,

    // Triangle 2 (Bottom-Left): 4, 3, 2
    0, 0.08, 0.03,
    -0.36, 0.08, -0.04,
    0, -0.62, 0,

    // Triangle 3 (Top-Left): 0, 3, 4
    0, 0.44, 0,
    -0.36, 0.08, -0.04,
    0, 0.08, 0.03,
  ]);
  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geom.computeVertexNormals();

  // Multi-material grouping for two-tone diamond
  geom.addGroup(0, 3, 0);
  geom.addGroup(3, 3, 1);
  geom.addGroup(6, 3, 0);
  geom.addGroup(9, 3, 1);
  return geom;
}

interface BowtieProps {
  color: string;
}

function RibbonBowtie({ color }: BowtieProps) {
  return (
    <group>
      <mesh position={[-0.038, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.03, 0.065, 5]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      <mesh position={[0.038, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.03, 0.065, 5]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
    </group>
  );
}

interface KiteRigProps {
  colorA: string;
  colorB: string;
  bowColors: string[];
  kiteGroupRef: React.RefObject<THREE.Group | null>;
  tailLineRef: React.RefObject<THREE.Line | null>;
  stringLineRef: React.RefObject<THREE.Line | null>;
  bowRefs: React.MutableRefObject<(THREE.Group | null)[]>;
}

function KiteRig({
  colorA,
  colorB,
  bowColors,
  kiteGroupRef,
  tailLineRef,
  stringLineRef,
  bowRefs,
}: KiteRigProps) {
  const diamondGeo = useMemo(() => createKiteDiamondGeometry(), []);
  const diamondMats = useMemo(
    () => [
      new THREE.MeshStandardMaterial({ color: colorA, side: THREE.DoubleSide, roughness: 0.45 }),
      new THREE.MeshStandardMaterial({ color: colorB, side: THREE.DoubleSide, roughness: 0.45 }),
    ],
    [colorA, colorB]
  );

  const sparMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#3d2b1f', roughness: 0.7 }), []);
  const stringMat = useMemo(
    () => new THREE.LineBasicMaterial({ color: '#f7f4ea', transparent: true, opacity: 0.85 }),
    []
  );
  const tailMat = useMemo(
    () => new THREE.LineBasicMaterial({ color: '#ffea00', transparent: true, opacity: 0.9, linewidth: 2 }),
    []
  );

  const stringGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array((STRING_SEGMENTS + 1) * 3);
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  const tailGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array((TAIL_SEGMENTS + 1) * 3);
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  const stringLine = useMemo(() => new THREE.Line(stringGeo, stringMat), [stringGeo, stringMat]);
  const tailLine = useMemo(() => new THREE.Line(tailGeo, tailMat), [tailGeo, tailMat]);

  return (
    <>
      {/* 3D Flying Kite Object in the Sky */}
      <group ref={kiteGroupRef as any}>
        {/* Diamond Sail */}
        <mesh geometry={diamondGeo} material={diamondMats} castShadow />

        {/* Vertical Spine Spar */}
        <mesh position={[0, -0.09, 0]} material={sparMat}>
          <cylinderGeometry args={[0.005, 0.005, 1.06, 6]} />
        </mesh>

        {/* Horizontal Cross Spar */}
        <mesh position={[0, 0.08, -0.03]} rotation-z={Math.PI / 2} material={sparMat}>
          <cylinderGeometry args={[0.005, 0.005, 0.72, 6]} />
        </mesh>

        {/* Bridle tow point indicator */}
        <mesh position={[0, -0.04, 0.2]}>
          <sphereGeometry args={[0.014, 8, 8]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.7} />
        </mesh>
      </group>

      {/* Trailing Ribbon Tail Line */}
      <primitive ref={tailLineRef} object={tailLine} />

      {/* Decorative Bowties along the Tail */}
      {bowColors.map((color, i) => (
        <group
          key={i}
          ref={el => {
            bowRefs.current[i] = el;
          }}
        >
          <RibbonBowtie color={color} />
        </group>
      ))}

      {/* Flying Line String connecting Child's hand to the Kite */}
      <primitive ref={stringLineRef} object={stringLine} />
    </>
  );
}

function createStringSpoolMesh() {
  const group = new THREE.Group();
  group.position.set(0, 0.03, 0.08);
  group.rotation.set(Math.PI / 2, 0, 0);

  // Wooden core rod
  const rod = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.012, 0.12, 10),
    new THREE.MeshStandardMaterial({ color: '#a77a4e', roughness: 0.75 })
  );
  rod.castShadow = true;

  // String coil wrapped in center
  const coil = new THREE.Mesh(
    new THREE.CylinderGeometry(0.032, 0.032, 0.065, 12),
    new THREE.MeshStandardMaterial({ color: '#ede8d0', roughness: 0.65 })
  );

  // Side flanges
  const flangeMat = new THREE.MeshStandardMaterial({ color: '#8a5f36', roughness: 0.7 });
  const f1 = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.012, 12), flangeMat);
  f1.position.y = -0.04;
  const f2 = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.012, 12), flangeMat);
  f2.position.y = 0.04;

  group.add(rod, coil, f1, f2);
  return group;
}

export function KiteActors({ world }: { world: WorldContextType }) {
  // Child 1: Kite flyer with ruby & gold kite
  const child1 = useActor('runner_a', { tints: { 't-shirt': '#e63946', pants: '#1d3557', bob: '#3d2618' } });
  // Child 2: Kite flyer with sapphire & amber kite
  const child2 = useActor('runner_b', { tints: { 't-shirt': '#06d6a0', shorts: '#118ab2', short: '#1a1a1a' } });
  // Child 3: Tag-along friend running & cheering
  const child3 = useActor('swinger', { tints: { sweater: '#f77f00', shorts: '#d62828', braid: '#4a3525' } });

  // References for Kite 1
  const kite1Group = useRef<THREE.Group>(null);
  const tail1Line = useRef<THREE.Line>(null);
  const string1Line = useRef<THREE.Line>(null);
  const bow1Refs = useRef<(THREE.Group | null)[]>([]);

  // References for Kite 2
  const kite2Group = useRef<THREE.Group>(null);
  const tail2Line = useRef<THREE.Line>(null);
  const string2Line = useRef<THREE.Line>(null);
  const bow2Refs = useRef<(THREE.Group | null)[]>([]);

  // Smooth spline curves for meadow locomotion
  const splineA = useMemo(
    () => new THREE.CatmullRomCurve3(KITE_LOOPS.loopA.map(p => new THREE.Vector3(...p)), true, 'centripetal'),
    []
  );
  const lenA = useMemo(() => splineA.getLength(), [splineA]);

  const splineB = useMemo(
    () => new THREE.CatmullRomCurve3(KITE_LOOPS.loopB.map(p => new THREE.Vector3(...p)), true, 'centripetal'),
    []
  );
  const lenB = useMemo(() => splineB.getLength(), [splineB]);

  const splineC = useMemo(
    () => new THREE.CatmullRomCurve3(KITE_LOOPS.loopC.map(p => new THREE.Vector3(...p)), true, 'centripetal'),
    []
  );
  const lenC = useMemo(() => splineC.getLength(), [splineC]);

  // Simulation state
  const state = useRef({
    // Locomotion states for the 3 kids
    c1: { d: 0, speed: 1.4, targetSpeed: 1.4, heading: 0, clip: 'Jog_Fwd_Loop', pauseTimer: 0 },
    c2: { d: 5.2, speed: 1.3, targetSpeed: 1.3, heading: 0, clip: 'Jog_Fwd_Loop', pauseTimer: 2.5 },
    c3: { d: 2.1, speed: 1.5, targetSpeed: 1.5, heading: 0, clip: 'Jog_Fwd_Loop', pauseTimer: 0 },
    // Kite 1 simulated position and tail physics
    k1Pos: new THREE.Vector3(-4.5, 8.2, 4.2),
    tail1Points: Array.from({ length: TAIL_SEGMENTS + 1 }, () => new THREE.Vector3(-4.5, 8.2, 4.2)),
    // Kite 2 simulated position and tail physics
    k2Pos: new THREE.Vector3(-5.2, 9.4, 5.0),
    tail2Points: Array.from({ length: TAIL_SEGMENTS + 1 }, () => new THREE.Vector3(-5.2, 9.4, 5.0)),
  });

  useEffect(() => {
    // Child scaling to youthful proportions
    child1.root.scale.setScalar(0.86);
    child2.root.scale.setScalar(0.84);
    child3.root.scale.setScalar(0.82);

    child1.play('Jog_Fwd_Loop', { fade: 0 });
    child2.play('Jog_Fwd_Loop', { fade: 0, from: 0.8 });
    child3.play('Jog_Fwd_Loop', { fade: 0, from: 1.5 });

    const spool1 = createStringSpoolMesh();
    const spool2 = createStringSpoolMesh();
    if (child1.bones.hand_r) child1.bones.hand_r.add(spool1);
    if (child2.bones.hand_r) child2.bones.hand_r.add(spool2);

    return () => {
      spool1.removeFromParent();
      spool2.removeFromParent();
    };
  }, [child1, child2, child3]);

  useFrame(({ clock }, delta) => {
    const s = state.current;
    const t = clock.getElapsedTime();

    // -------------------------------------------------------------
    // 1. UPDATE CHILD 1 (Kite 1 Flyer)
    // -------------------------------------------------------------
    if (s.c1.pauseTimer > 0) {
      s.c1.pauseTimer -= delta;
      s.c1.targetSpeed = 0;
      if (s.c1.clip !== 'Stand') {
        child1.play('Stand', { fade: 0.4 });
        s.c1.clip = 'Stand';
      }
    } else {
      if (Math.random() < 0.003) {
        s.c1.pauseTimer = randomRange(1.5, 3.0);
      }
      s.c1.targetSpeed = 1.6 + 0.35 * Math.sin(0.4 * t);
      const targetClip = s.c1.speed > 1.1 ? 'Jog_Fwd_Loop' : 'Walk_Loop';
      if (s.c1.clip !== targetClip) {
        child1.play(targetClip, { fade: 0.35 });
        s.c1.clip = targetClip;
      }
    }
    s.c1.speed = THREE.MathUtils.damp(s.c1.speed, s.c1.targetSpeed, 2.5, delta);
    s.c1.d = (s.c1.d + s.c1.speed * delta) % lenA;

    const tNormA = s.c1.d / lenA;
    const ptA = splineA.getPointAt(tNormA);
    const tanA = splineA.getTangentAt(tNormA);
    const targetHeadingA = Math.atan2(tanA.x, tanA.z);
    s.c1.heading = dampAngle(s.c1.heading, targetHeadingA, 4, delta);

    child1.root.position.copy(ptA);
    child1.root.quaternion.setFromAxisAngle(UP_AXIS, s.c1.heading);
    if (s.c1.clip !== 'Stand') {
      child1.setSpeed(THREE.MathUtils.clamp(s.c1.speed / 1.7, 0.7, 1.3));
    }

    // -------------------------------------------------------------
    // 2. UPDATE CHILD 2 (Kite 2 Flyer)
    // -------------------------------------------------------------
    if (s.c2.pauseTimer > 0) {
      s.c2.pauseTimer -= delta;
      s.c2.targetSpeed = 0;
      if (s.c2.clip !== 'Stand') {
        child2.play('Stand', { fade: 0.4 });
        s.c2.clip = 'Stand';
      }
    } else {
      if (Math.random() < 0.003) {
        s.c2.pauseTimer = randomRange(1.8, 3.5);
      }
      s.c2.targetSpeed = 1.45 + 0.3 * Math.cos(0.5 * t + 1.2);
      const targetClip = s.c2.speed > 1.1 ? 'Jog_Fwd_Loop' : 'Walk_Loop';
      if (s.c2.clip !== targetClip) {
        child2.play(targetClip, { fade: 0.35 });
        s.c2.clip = targetClip;
      }
    }
    s.c2.speed = THREE.MathUtils.damp(s.c2.speed, s.c2.targetSpeed, 2.5, delta);
    s.c2.d = (s.c2.d + s.c2.speed * delta) % lenB;

    const tNormB = s.c2.d / lenB;
    const ptB = splineB.getPointAt(tNormB);
    const tanB = splineB.getTangentAt(tNormB);
    const targetHeadingB = Math.atan2(tanB.x, tanB.z);
    s.c2.heading = dampAngle(s.c2.heading, targetHeadingB, 4, delta);

    child2.root.position.copy(ptB);
    child2.root.quaternion.setFromAxisAngle(UP_AXIS, s.c2.heading);
    if (s.c2.clip !== 'Stand') {
      child2.setSpeed(THREE.MathUtils.clamp(s.c2.speed / 1.6, 0.7, 1.3));
    }

    // -------------------------------------------------------------
    // 3. UPDATE CHILD 3 (Cheering Friend)
    // -------------------------------------------------------------
    s.c3.targetSpeed = 1.7 + 0.4 * Math.sin(0.7 * t);
    s.c3.speed = THREE.MathUtils.damp(s.c3.speed, s.c3.targetSpeed, 3, delta);
    s.c3.d = (s.c3.d + s.c3.speed * delta) % lenC;

    const tNormC = s.c3.d / lenC;
    const ptC = splineC.getPointAt(tNormC);
    const tanC = splineC.getTangentAt(tNormC);
    const targetHeadingC = Math.atan2(tanC.x, tanC.z);
    s.c3.heading = dampAngle(s.c3.heading, targetHeadingC, 4.5, delta);

    child3.root.position.copy(ptC);
    child3.root.quaternion.setFromAxisAngle(UP_AXIS, s.c3.heading);
    child3.setSpeed(THREE.MathUtils.clamp(s.c3.speed / 1.8, 0.75, 1.35));

    // -------------------------------------------------------------
    // 4. KITE 1 FLIGHT SIMULATION & IK
    // -------------------------------------------------------------
    // Wind parameters: general wind blows towards (+X: 0.8, +Z: 0.35)
    const gust1 = Math.sin(0.6 * t) * 0.45 + Math.cos(1.4 * t) * 0.25;
    const swayX1 = Math.sin(1.1 * t) * 0.95 + gust1 * 0.5;
    const swayY1 = Math.sin(1.8 * t) * 0.45 + gust1 * 0.4;
    const swayZ1 = Math.cos(0.9 * t) * 0.7 + gust1 * 0.3;

    // Kite 1 target position high in the sky downwind of Child 1
    const targetK1 = new THREE.Vector3(
      ptA.x + 2.8 + swayX1,
      8.0 + swayY1,
      ptA.z + 1.6 + swayZ1
    );
    s.k1Pos.lerp(targetK1, 1 - Math.exp(-4 * delta));

    if (kite1Group.current) {
      kite1Group.current.position.copy(s.k1Pos);
      // Aerodynamic banking into sway, pitching back against the wind
      const bank1 = -Math.cos(1.1 * t) * 0.38;
      const pitch1 = -0.68 + Math.sin(1.8 * t) * 0.1;
      const yaw1 = Math.atan2(0.8, 0.35) + Math.sin(0.8 * t) * 0.15;
      kite1Group.current.rotation.set(pitch1, yaw1, bank1, 'YXZ');
    }

    // Arm IK for Child 1 (holding kite line spool aloft)
    const b1 = child1.bones;
    let hand1Pos = ptA.clone().add(new THREE.Vector3(0, 1.1, 0));
    if (b1.upperarm_r && b1.lowerarm_r && b1.hand_r) {
      const shoulder = b1.upperarm_r.getWorldPosition(new THREE.Vector3());
      const fwd = new THREE.Vector3(Math.sin(s.c1.heading), 0, Math.cos(s.c1.heading));
      const right = new THREE.Vector3(Math.cos(s.c1.heading), 0, -Math.sin(s.c1.heading));
      const targetHand = shoulder.clone().addScaledVector(fwd, 0.3).addScaledVector(UP_AXIS, 0.32).addScaledVector(right, 0.12);
      const pole = shoulder.clone().addScaledVector(UP_AXIS, 0.15).addScaledVector(right, 0.35);
      solveTwoBoneIK(b1.upperarm_r, b1.lowerarm_r, b1.hand_r, targetHand, pole, 0.95);
      curlFingers(b1, 'r', 0.85);
      hand1Pos = b1.hand_r.getWorldPosition(new THREE.Vector3());
    }

    // Child 1 looks up at Kite 1
    if (b1.neck_01 && b1.Head) {
      solveLookAtIK(b1.neck_01, b1.Head, s.k1Pos, 0.88, 1.3, 0.95);
    }

    // -------------------------------------------------------------
    // 5. KITE 2 FLIGHT SIMULATION & IK
    // -------------------------------------------------------------
    const gust2 = Math.cos(0.55 * t + 1.8) * 0.5 + Math.sin(1.3 * t + 0.6) * 0.28;
    const swayX2 = Math.sin(1.25 * t + 1.5) * 1.05 + gust2 * 0.55;
    const swayY2 = Math.sin(1.9 * t + 0.8) * 0.5 + gust2 * 0.45;
    const swayZ2 = Math.cos(1.05 * t + 2.1) * 0.75 + gust2 * 0.35;

    // Kite 2 target position in the sky downwind of Child 2
    const targetK2 = new THREE.Vector3(
      ptB.x + 3.4 + swayX2,
      9.2 + swayY2,
      ptB.z + 2.1 + swayZ2
    );
    s.k2Pos.lerp(targetK2, 1 - Math.exp(-3.8 * delta));

    if (kite2Group.current) {
      kite2Group.current.position.copy(s.k2Pos);
      const bank2 = -Math.cos(1.25 * t + 1.5) * 0.4;
      const pitch2 = -0.72 + Math.sin(1.9 * t + 0.8) * 0.12;
      const yaw2 = Math.atan2(0.8, 0.35) + Math.sin(0.9 * t + 1.2) * 0.18;
      kite2Group.current.rotation.set(pitch2, yaw2, bank2, 'YXZ');
    }

    // Arm IK for Child 2
    const b2 = child2.bones;
    let hand2Pos = ptB.clone().add(new THREE.Vector3(0, 1.1, 0));
    if (b2.upperarm_r && b2.lowerarm_r && b2.hand_r) {
      const shoulder = b2.upperarm_r.getWorldPosition(new THREE.Vector3());
      const fwd = new THREE.Vector3(Math.sin(s.c2.heading), 0, Math.cos(s.c2.heading));
      const right = new THREE.Vector3(Math.cos(s.c2.heading), 0, -Math.sin(s.c2.heading));
      const targetHand = shoulder.clone().addScaledVector(fwd, 0.32).addScaledVector(UP_AXIS, 0.34).addScaledVector(right, 0.14);
      const pole = shoulder.clone().addScaledVector(UP_AXIS, 0.15).addScaledVector(right, 0.35);
      solveTwoBoneIK(b2.upperarm_r, b2.lowerarm_r, b2.hand_r, targetHand, pole, 0.95);
      curlFingers(b2, 'r', 0.85);
      hand2Pos = b2.hand_r.getWorldPosition(new THREE.Vector3());
    }

    // Child 2 looks up at Kite 2
    if (b2.neck_01 && b2.Head) {
      solveLookAtIK(b2.neck_01, b2.Head, s.k2Pos, 0.88, 1.3, 0.95);
    }

    // Child 3 watches the kites overhead
    const b3 = child3.bones;
    if (b3.neck_01 && b3.Head) {
      const lookTarget = THREE.MathUtils.euclideanModulo(t, 8) < 4 ? s.k1Pos : s.k2Pos;
      solveLookAtIK(b3.neck_01, b3.Head, lookTarget, 0.82, 1.2, 0.9);
    }

    // -------------------------------------------------------------
    // 6. KITE 1 STRING & TAIL GEOMETRY
    // -------------------------------------------------------------
    const kite1TowRing = s.k1Pos.clone().add(new THREE.Vector3(0, -0.04, 0.2));
    if (string1Line.current) {
      const posAttr = string1Line.current.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i <= STRING_SEGMENTS; i++) {
        const alpha = i / STRING_SEGMENTS;
        const p = hand1Pos.clone().lerp(kite1TowRing, alpha);
        // Catenary bow and wind curvature
        const sag = Math.sin(alpha * Math.PI) * (0.3 + 0.12 * gust1);
        p.y -= sag;
        p.x += sag * 0.15;
        p.z += sag * 0.08;
        posAttr.setXYZ(i, p.x, p.y, p.z);
      }
      posAttr.needsUpdate = true;
    }

    // Kite 1 Tail Ribbon and Bowties
    const tail1Tip = s.k1Pos.clone().add(new THREE.Vector3(0, -0.58, 0));
    s.tail1Points[0].copy(tail1Tip);
    const dragDir1 = new THREE.Vector3(-0.45, -0.85, -0.22).normalize();
    for (let i = 1; i <= TAIL_SEGMENTS; i++) {
      const wave = Math.sin(6 * t - i * 0.6) * 0.065;
      const desired = s.tail1Points[i - 1].clone().addScaledVector(dragDir1, 0.24);
      desired.x += wave;
      desired.z += wave * 0.5;
      s.tail1Points[i].lerp(desired, 1 - Math.exp(-16 * delta));
    }
    if (tail1Line.current) {
      const posAttr = tail1Line.current.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i <= TAIL_SEGMENTS; i++) {
        const p = s.tail1Points[i];
        posAttr.setXYZ(i, p.x, p.y, p.z);
      }
      posAttr.needsUpdate = true;
    }
    // Update Kite 1 Bowties
    const bowIndices = [2, 5, 8, 11];
    bowIndices.forEach((segIdx, bIdx) => {
      const bow = bow1Refs.current[bIdx];
      if (bow) {
        bow.position.copy(s.tail1Points[segIdx]);
        const nextPt = s.tail1Points[Math.min(segIdx + 1, TAIL_SEGMENTS)];
        const dir = nextPt.clone().sub(s.tail1Points[segIdx]).normalize();
        bow.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), dir);
      }
    });

    // -------------------------------------------------------------
    // 7. KITE 2 STRING & TAIL GEOMETRY
    // -------------------------------------------------------------
    const kite2TowRing = s.k2Pos.clone().add(new THREE.Vector3(0, -0.04, 0.2));
    if (string2Line.current) {
      const posAttr = string2Line.current.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i <= STRING_SEGMENTS; i++) {
        const alpha = i / STRING_SEGMENTS;
        const p = hand2Pos.clone().lerp(kite2TowRing, alpha);
        const sag = Math.sin(alpha * Math.PI) * (0.34 + 0.14 * gust2);
        p.y -= sag;
        p.x += sag * 0.16;
        p.z += sag * 0.09;
        posAttr.setXYZ(i, p.x, p.y, p.z);
      }
      posAttr.needsUpdate = true;
    }

    // Kite 2 Tail Ribbon and Bowties
    const tail2Tip = s.k2Pos.clone().add(new THREE.Vector3(0, -0.58, 0));
    s.tail2Points[0].copy(tail2Tip);
    const dragDir2 = new THREE.Vector3(-0.42, -0.88, -0.2).normalize();
    for (let i = 1; i <= TAIL_SEGMENTS; i++) {
      const wave = Math.sin(6.2 * t - i * 0.58 + 1.2) * 0.07;
      const desired = s.tail2Points[i - 1].clone().addScaledVector(dragDir2, 0.26);
      desired.x += wave;
      desired.z += wave * 0.5;
      s.tail2Points[i].lerp(desired, 1 - Math.exp(-16 * delta));
    }
    if (tail2Line.current) {
      const posAttr = tail2Line.current.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i <= TAIL_SEGMENTS; i++) {
        const p = s.tail2Points[i];
        posAttr.setXYZ(i, p.x, p.y, p.z);
      }
      posAttr.needsUpdate = true;
    }
    // Update Kite 2 Bowties
    bowIndices.forEach((segIdx, bIdx) => {
      const bow = bow2Refs.current[bIdx];
      if (bow) {
        bow.position.copy(s.tail2Points[segIdx]);
        const nextPt = s.tail2Points[Math.min(segIdx + 1, TAIL_SEGMENTS)];
        const dir = nextPt.clone().sub(s.tail2Points[segIdx]).normalize();
        bow.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), dir);
      }
    });

    // -------------------------------------------------------------
    // 8. WORLD CONTEXT & CAMERA HOVER TOOLTIP
    // -------------------------------------------------------------
    world.set('kite_a', s.k1Pos);
    world.set('kite_b', s.k2Pos);
    const groupCenter = ptA.clone().add(ptB).add(ptC).divideScalar(3).setY(0.6);
    world.group('kites', groupCenter, 2.9, 'Children flying kites in the meadow');
  });

  return (
    <>
      {/* Child 1 */}
      <primitive object={child1.root} />

      {/* Child 2 */}
      <primitive object={child2.root} />

      {/* Child 3 */}
      <primitive object={child3.root} />

      {/* Kite 1 (Ruby Red & Gold) */}
      <KiteRig
        colorA="#e63946"
        colorB="#ffd166"
        bowColors={['#f77f00', '#06d6a0', '#118ab2', '#e63946']}
        kiteGroupRef={kite1Group}
        tailLineRef={tail1Line}
        stringLineRef={string1Line}
        bowRefs={bow1Refs}
      />

      {/* Kite 2 (Sapphire Blue & Citrus Amber) */}
      <KiteRig
        colorA="#0077b6"
        colorB="#f77f00"
        bowColors={['#ffd166', '#e63946', '#06d6a0', '#7209b7']}
        kiteGroupRef={kite2Group}
        tailLineRef={tail2Line}
        stringLineRef={string2Line}
        bowRefs={bow2Refs}
      />
    </>
  );
}
