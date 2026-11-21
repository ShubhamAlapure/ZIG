import * as THREE from 'three';
import React, { useMemo, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useActor, ActorHandle } from '../useActor';
import { WorldContextType } from '../ParkActors';
import { ADDITIONAL_BENCHES } from '../parkConstants';
import {
  solveTwoBoneIK,
  solveLookAtIK,
  rotateBoneTowards,
  waitMs,
  randomRange,
  randomChance,
  BENCH_FEET,
} from '../actorIKHelpers';

// =====================================================================
// BENCH GROUP 1: East Plaza Bench (3 actors: 1 sitting, 2 standing)
// =====================================================================
export function BenchGroupEast({ world }: { world: WorldContextType }) {
  const benchConf = ADDITIONAL_BENCHES[0]; // bench_east: [3.8, 0, 2.2], rot: -1.35
  const sittingActor = useActor('onlooker_b', { tints: { afro: '#1b140f', halter: '#1d3557', dress: '#1d3557' } });
  const standingActorA = useActor('thrower_a', { tints: { cargo: '#455e43', 't-shirt': '#f1faee' } });
  const standingActorB = useActor('artist', { tints: { camisole: '#c85a32', dress: '#c85a32' } });

  const state = useRef({
    activeSpeaker: 0, // 0: sitting, 1: standing A, 2: standing B
    armWeight: 1.0,
    heads: [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()],
    speakerSmooth: new THREE.Vector3(),
  });

  useEffect(() => {
    const ctrl = new AbortController();
    const { signal } = ctrl;
    const [bx, , bz] = benchConf.position;
    const bRot = benchConf.rotation;
    const fwd = new THREE.Vector3(Math.sin(bRot), 0, Math.cos(bRot));
    const right = new THREE.Vector3(Math.cos(bRot), 0, -Math.sin(bRot));

    // 1. Position sitting actor on bench
    sittingActor.root.position.set(bx, 0.07, bz).addScaledVector(fwd, 0.19);
    sittingActor.root.rotation.set(0, bRot, 0);
    sittingActor.play('Sitting_Idle_Loop', { fade: 0 });

    // 2. Position standing actor A in front of bench
    const posA = new THREE.Vector3(bx, 0, bz).addScaledVector(fwd, 1.25).addScaledVector(right, -0.35);
    standingActorA.root.position.copy(posA);
    const faceA = Math.atan2(bx - posA.x, bz - posA.z);
    standingActorA.root.rotation.set(0, faceA + 0.1, 0);
    standingActorA.play('Stand', { fade: 0, from: 0.5 });

    // 3. Position standing actor B to the side of the group
    const posB = new THREE.Vector3(bx, 0, bz).addScaledVector(fwd, 1.15).addScaledVector(right, 0.45);
    standingActorB.root.position.copy(posB);
    const faceB = Math.atan2(bx - posB.x, bz - posB.z);
    standingActorB.root.rotation.set(0, faceB - 0.15, 0);
    standingActorB.play('Idle_FoldArms_Loop', { fade: 0, from: 1.2 });

    // Turn-taking discussion director
    (async () => {
      while (true) {
        await waitMs(randomRange(4200, 7500), signal);
        const nextSpeaker = (state.current.activeSpeaker + 1 + (Math.random() < 0.5 ? 1 : 0)) % 3;
        state.current.activeSpeaker = nextSpeaker;

        // Animate speaker & listeners
        if (nextSpeaker === 0) {
          sittingActor.play('Sitting_Talking_Loop', { fade: 0.6 });
        } else {
          sittingActor.play('Sitting_Idle_Loop', { fade: 0.6 });
        }

        if (nextSpeaker === 1) {
          if (randomChance(0.4)) {
            standingActorA.play('Yes', { loop: false, fade: 0.35 }).then(() => {
              standingActorA.play('Stand', { fade: 0.4 });
            });
          } else {
            standingActorA.play('Stand', { fade: 0.5 });
          }
        } else {
          if (randomChance(0.3)) {
            standingActorA.play('Idle_FoldArms_Loop', { fade: 0.6 });
          } else {
            standingActorA.play('Stand', { fade: 0.5 });
          }
        }

        if (nextSpeaker === 2) {
          if (randomChance(0.4)) {
            standingActorB.play('Yes', { loop: false, fade: 0.35 }).then(() => {
              standingActorB.play('Stand', { fade: 0.4 });
            });
          } else {
            standingActorB.play('Stand', { fade: 0.5 });
          }
        } else {
          if (randomChance(0.35)) {
            standingActorB.play('Idle_FoldArms_Loop', { fade: 0.6 });
          } else {
            standingActorB.play('Stand', { fade: 0.5 });
          }
        }
      }
    })().catch(err => {
      if (err.name !== 'AbortError') throw err;
    });

    return () => ctrl.abort();
  }, [benchConf, sittingActor, standingActorA, standingActorB]);

  useFrame((_, delta) => {
    const s = state.current;
    const actors = [sittingActor, standingActorA, standingActorB];

    // Capture head positions
    actors.forEach((act, idx) => {
      if (act.bones.Head) {
        act.bones.Head.getWorldPosition(s.heads[idx]);
      }
    });

    // 1. SITTING ACTOR IK
    const bones0 = sittingActor.bones;
    const root0 = sittingActor.root;
    const negZ0 = new THREE.Vector3(0, 0, -1).applyQuaternion(root0.quaternion);
    if (bones0.spine_01 && bones0.spine_02) rotateBoneTowards(bones0.spine_01, bones0.spine_02, negZ0, 0.18);
    if (bones0.spine_02 && bones0.spine_03) rotateBoneTowards(bones0.spine_02, bones0.spine_03, negZ0, 0.09);

    // Bench feet placement
    BENCH_FEET.forEach(([x, y, z], idx) => {
      const side = idx === 0 ? 'l' : 'r';
      const footTarget = root0.localToWorld(new THREE.Vector3(x, y, z));
      const kneePole = root0.localToWorld(new THREE.Vector3(1.2 * x, 0.5, 1));
      if (bones0[`thigh_${side}`] && bones0[`calf_${side}`] && bones0[`foot_${side}`]) {
        solveTwoBoneIK(bones0[`thigh_${side}`], bones0[`calf_${side}`], bones0[`foot_${side}`], footTarget, kneePole, 1);
      }
    });

    // Blend arm IK: when talking, allow free upper body gestures
    const targetArmWeight = s.activeSpeaker === 0 ? 0.05 : 0.95;
    s.armWeight = THREE.MathUtils.damp(s.armWeight, targetArmWeight, 4, delta);
    if (s.armWeight > 0.05) {
      for (const side of ['l', 'r'] as const) {
        const thigh = bones0[`thigh_${side}`];
        const calf = bones0[`calf_${side}`];
        if (thigh && calf && bones0[`upperarm_${side}`] && bones0[`lowerarm_${side}`] && bones0[`hand_${side}`]) {
          const restPos = thigh.getWorldPosition(new THREE.Vector3()).lerp(calf.getWorldPosition(new THREE.Vector3()), 0.55);
          restPos.y += 0.09;
          const polePos = root0.localToWorld(new THREE.Vector3(side === 'l' ? 0.35 : -0.35, 0.55, -0.3));
          solveTwoBoneIK(bones0[`upperarm_${side}`], bones0[`lowerarm_${side}`], bones0[`hand_${side}`], restPos, polePos, s.armWeight);
        }
      }
    }

    // 2. CONVERSATION HEAD LOOK-AT IK
    const speakerHead = s.heads[s.activeSpeaker];
    s.speakerSmooth.lerp(speakerHead, 1 - Math.exp(-3.5 * delta));

    // Listeners look at the active speaker
    actors.forEach((act, idx) => {
      if (idx !== s.activeSpeaker && act.bones.neck_01 && act.bones.Head) {
        solveLookAtIK(act.bones.neck_01, act.bones.Head, s.speakerSmooth, 0.82);
      }
    });

    // Speaker looks between listeners
    const speakerActor = actors[s.activeSpeaker];
    if (speakerActor.bones.neck_01 && speakerActor.bones.Head) {
      const listenerIdx = (s.activeSpeaker + 1) % 3;
      const listenerHead = s.heads[listenerIdx];
      solveLookAtIK(speakerActor.bones.neck_01, speakerActor.bones.Head, listenerHead, 0.65);
    }

    // Update world group for hover tooltip & follow
    const p0 = sittingActor.root.position;
    const p1 = standingActorA.root.position;
    const p2 = standingActorB.root.position;
    const center = p0.clone().add(p1).add(p2).divideScalar(3).setY(0.9);
    world.group('discussion_east', center, 1.45, 'Discussion by the path');
  });

  return (
    <>
      <primitive object={sittingActor.root} />
      <primitive object={standingActorA.root} />
      <primitive object={standingActorB.root} />
    </>
  );
}

// =====================================================================
// BENCH GROUP 2: North Meadow Bench (3 actors: 2 sitting side-by-side, 1 standing)
// =====================================================================
export function BenchGroupNorth({ world }: { world: WorldContextType }) {
  const benchConf = ADDITIONAL_BENCHES[1]; // bench_north: [-3.8, 0, 5.2], rot: 2.15
  const sittingLeft = useActor('thrower_b', { tints: { polo: '#2a9d8f', shorts: '#264653' } });
  const sittingRight = useActor('parent', { tints: { shift: '#e76f51', dress: '#e76f51' } });
  const standingActor = useActor('onlooker_a', { tints: { 't-shirt': '#4a4e69', pants: '#22223b' } });

  const state = useRef({
    activeSpeaker: 0, // 0: sitting left, 1: sitting right, 2: standing
    armWeight0: 1.0,
    armWeight1: 1.0,
    heads: [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()],
    speakerSmooth: new THREE.Vector3(),
  });

  useEffect(() => {
    const ctrl = new AbortController();
    const { signal } = ctrl;
    const [bx, , bz] = benchConf.position;
    const bRot = benchConf.rotation;
    const fwd = new THREE.Vector3(Math.sin(bRot), 0, Math.cos(bRot));
    const right = new THREE.Vector3(Math.cos(bRot), 0, -Math.sin(bRot));

    // 1. Sitting Left (offset -0.38m)
    sittingLeft.root.position.set(bx, 0.07, bz).addScaledVector(fwd, 0.19).addScaledVector(right, -0.38);
    sittingLeft.root.rotation.set(0, bRot, 0);
    sittingLeft.play('Sitting_Idle_Loop', { fade: 0 });

    // 2. Sitting Right (offset +0.38m)
    sittingRight.root.position.set(bx, 0.07, bz).addScaledVector(fwd, 0.19).addScaledVector(right, 0.38);
    sittingRight.root.rotation.set(0, bRot, 0);
    sittingRight.play('Sitting_Idle_Loop', { fade: 0, from: 0.9 });

    // 3. Standing in front facing bench
    const posStand = new THREE.Vector3(bx, 0, bz).addScaledVector(fwd, 1.25);
    standingActor.root.position.copy(posStand);
    const faceStand = Math.atan2(bx - posStand.x, bz - posStand.z);
    standingActor.root.rotation.set(0, faceStand, 0);
    standingActor.play('Stand', { fade: 0, from: 1.4 });

    // Discussion turn-taking
    (async () => {
      while (true) {
        await waitMs(randomRange(4000, 7000), signal);
        const nextSpeaker = (state.current.activeSpeaker + 1 + (Math.random() < 0.5 ? 1 : 0)) % 3;
        state.current.activeSpeaker = nextSpeaker;

        // Sitting Left
        if (nextSpeaker === 0) {
          sittingLeft.play('Sitting_Talking_Loop', { fade: 0.6 });
        } else {
          sittingLeft.play('Sitting_Idle_Loop', { fade: 0.6 });
        }

        // Sitting Right
        if (nextSpeaker === 1) {
          sittingRight.play('Sitting_Talking_Loop', { fade: 0.6 });
        } else {
          sittingRight.play('Sitting_Idle_Loop', { fade: 0.6 });
        }

        // Standing Friend
        if (nextSpeaker === 2) {
          if (randomChance(0.4)) {
            standingActor.play('Yes', { loop: false, fade: 0.35 }).then(() => {
              standingActor.play('Stand', { fade: 0.4 });
            });
          } else {
            standingActor.play('Stand', { fade: 0.5 });
          }
        } else {
          if (randomChance(0.3)) {
            standingActor.play('Idle_FoldArms_Loop', { fade: 0.6 });
          } else {
            standingActor.play('Stand', { fade: 0.5 });
          }
        }
      }
    })().catch(err => {
      if (err.name !== 'AbortError') throw err;
    });

    return () => ctrl.abort();
  }, [benchConf, sittingLeft, sittingRight, standingActor]);

  useFrame((_, delta) => {
    const s = state.current;
    const actors = [sittingLeft, sittingRight, standingActor];

    actors.forEach((act, idx) => {
      if (act.bones.Head) act.bones.Head.getWorldPosition(s.heads[idx]);
    });

    // 1. SITTING ACTOR IK (Left & Right)
    [sittingLeft, sittingRight].forEach((actor, seatIdx) => {
      const bones = actor.bones;
      const root = actor.root;
      const negZ = new THREE.Vector3(0, 0, -1).applyQuaternion(root.quaternion);

      if (bones.spine_01 && bones.spine_02) rotateBoneTowards(bones.spine_01, bones.spine_02, negZ, 0.18);
      if (bones.spine_02 && bones.spine_03) rotateBoneTowards(bones.spine_02, bones.spine_03, negZ, 0.09);

      BENCH_FEET.forEach(([x, y, z], idx) => {
        const side = idx === 0 ? 'l' : 'r';
        const footTarget = root.localToWorld(new THREE.Vector3(x, y, z));
        const kneePole = root.localToWorld(new THREE.Vector3(1.2 * x, 0.5, 1));
        if (bones[`thigh_${side}`] && bones[`calf_${side}`] && bones[`foot_${side}`]) {
          solveTwoBoneIK(bones[`thigh_${side}`], bones[`calf_${side}`], bones[`foot_${side}`], footTarget, kneePole, 1);
        }
      });

      const isSpeaker = s.activeSpeaker === seatIdx;
      const targetWeight = isSpeaker ? 0.05 : 0.95;
      if (seatIdx === 0) s.armWeight0 = THREE.MathUtils.damp(s.armWeight0, targetWeight, 4, delta);
      else s.armWeight1 = THREE.MathUtils.damp(s.armWeight1, targetWeight, 4, delta);
      const armWeight = seatIdx === 0 ? s.armWeight0 : s.armWeight1;

      if (armWeight > 0.05) {
        for (const side of ['l', 'r'] as const) {
          const thigh = bones[`thigh_${side}`];
          const calf = bones[`calf_${side}`];
          if (thigh && calf && bones[`upperarm_${side}`] && bones[`lowerarm_${side}`] && bones[`hand_${side}`]) {
            const restPos = thigh.getWorldPosition(new THREE.Vector3()).lerp(calf.getWorldPosition(new THREE.Vector3()), 0.55);
            restPos.y += 0.09;
            const polePos = root.localToWorld(new THREE.Vector3(side === 'l' ? 0.35 : -0.35, 0.55, -0.3));
            solveTwoBoneIK(bones[`upperarm_${side}`], bones[`lowerarm_${side}`], bones[`hand_${side}`], restPos, polePos, armWeight);
          }
        }
      }
    });

    // 2. CONVERSATION HEAD LOOK-AT IK
    const speakerHead = s.heads[s.activeSpeaker];
    s.speakerSmooth.lerp(speakerHead, 1 - Math.exp(-3.5 * delta));

    actors.forEach((act, idx) => {
      if (idx !== s.activeSpeaker && act.bones.neck_01 && act.bones.Head) {
        solveLookAtIK(act.bones.neck_01, act.bones.Head, s.speakerSmooth, 0.82);
      }
    });

    const p0 = sittingLeft.root.position;
    const p1 = sittingRight.root.position;
    const p2 = standingActor.root.position;
    const center = p0.clone().add(p1).add(p2).divideScalar(3).setY(0.9);
    world.group('discussion_north', center, 1.5, 'Friends chatting on the bench');
  });

  return (
    <>
      <primitive object={sittingLeft.root} />
      <primitive object={sittingRight.root} />
      <primitive object={standingActor.root} />
    </>
  );
}

// =====================================================================
// BENCH GROUP 3: South Playground Bench (2 actors: 1 sitting, 1 standing)
// =====================================================================
export function BenchGroupSouth({ world }: { world: WorldContextType }) {
  const benchConf = ADDITIONAL_BENCHES[2]; // bench_south: [-2.2, 0, -2.2], rot: -0.85
  const sittingActor = useActor('parent', { tints: { shift: '#386641', dress: '#386641' } });
  const standingActor = useActor('onlooker_a', { tints: { 't-shirt': '#bc4749', pants: '#333333' } });

  const state = useRef({
    activeSpeaker: 0, // 0: sitting, 1: standing
    armWeight: 1.0,
    heads: [new THREE.Vector3(), new THREE.Vector3()],
    speakerSmooth: new THREE.Vector3(),
  });

  useEffect(() => {
    const ctrl = new AbortController();
    const { signal } = ctrl;
    const [bx, , bz] = benchConf.position;
    const bRot = benchConf.rotation;
    const fwd = new THREE.Vector3(Math.sin(bRot), 0, Math.cos(bRot));
    const right = new THREE.Vector3(Math.cos(bRot), 0, -Math.sin(bRot));

    // 1. Sitting in center of bench
    sittingActor.root.position.set(bx, 0.07, bz).addScaledVector(fwd, 0.19);
    sittingActor.root.rotation.set(0, bRot, 0);
    sittingActor.play('Sitting_Idle_Loop', { fade: 0 });

    // 2. Standing nearby facing sitting companion
    const posStand = new THREE.Vector3(bx, 0, bz).addScaledVector(fwd, 1.15).addScaledVector(right, 0.35);
    standingActor.root.position.copy(posStand);
    const faceStand = Math.atan2(bx - posStand.x, bz - posStand.z);
    standingActor.root.rotation.set(0, faceStand - 0.1, 0);
    standingActor.play('Stand', { fade: 0, from: 1.1 });

    // Conversation director
    (async () => {
      while (true) {
        await waitMs(randomRange(4000, 7000), signal);
        const nextSpeaker = 1 - state.current.activeSpeaker;
        state.current.activeSpeaker = nextSpeaker;

        if (nextSpeaker === 0) {
          sittingActor.play('Sitting_Talking_Loop', { fade: 0.6 });
        } else {
          sittingActor.play('Sitting_Idle_Loop', { fade: 0.6 });
        }

        if (nextSpeaker === 1) {
          if (randomChance(0.45)) {
            standingActor.play('Yes', { loop: false, fade: 0.35 }).then(() => {
              standingActor.play('Stand', { fade: 0.4 });
            });
          } else {
            standingActor.play('Stand', { fade: 0.5 });
          }
        } else {
          if (randomChance(0.4)) {
            standingActor.play('Idle_FoldArms_Loop', { fade: 0.6 });
          } else {
            standingActor.play('Stand', { fade: 0.5 });
          }
        }
      }
    })().catch(err => {
      if (err.name !== 'AbortError') throw err;
    });

    return () => ctrl.abort();
  }, [benchConf, sittingActor, standingActor]);

  useFrame((_, delta) => {
    const s = state.current;
    if (sittingActor.bones.Head) sittingActor.bones.Head.getWorldPosition(s.heads[0]);
    if (standingActor.bones.Head) standingActor.bones.Head.getWorldPosition(s.heads[1]);

    // 1. SITTING ACTOR IK
    const bones0 = sittingActor.bones;
    const root0 = sittingActor.root;
    const negZ0 = new THREE.Vector3(0, 0, -1).applyQuaternion(root0.quaternion);
    if (bones0.spine_01 && bones0.spine_02) rotateBoneTowards(bones0.spine_01, bones0.spine_02, negZ0, 0.18);
    if (bones0.spine_02 && bones0.spine_03) rotateBoneTowards(bones0.spine_02, bones0.spine_03, negZ0, 0.09);

    BENCH_FEET.forEach(([x, y, z], idx) => {
      const side = idx === 0 ? 'l' : 'r';
      const footTarget = root0.localToWorld(new THREE.Vector3(x, y, z));
      const kneePole = root0.localToWorld(new THREE.Vector3(1.2 * x, 0.5, 1));
      if (bones0[`thigh_${side}`] && bones0[`calf_${side}`] && bones0[`foot_${side}`]) {
        solveTwoBoneIK(bones0[`thigh_${side}`], bones0[`calf_${side}`], bones0[`foot_${side}`], footTarget, kneePole, 1);
      }
    });

    const isSpeaker = s.activeSpeaker === 0;
    const targetWeight = isSpeaker ? 0.05 : 0.95;
    s.armWeight = THREE.MathUtils.damp(s.armWeight, targetWeight, 4, delta);
    if (s.armWeight > 0.05) {
      for (const side of ['l', 'r'] as const) {
        const thigh = bones0[`thigh_${side}`];
        const calf = bones0[`calf_${side}`];
        if (thigh && calf && bones0[`upperarm_${side}`] && bones0[`lowerarm_${side}`] && bones0[`hand_${side}`]) {
          const restPos = thigh.getWorldPosition(new THREE.Vector3()).lerp(calf.getWorldPosition(new THREE.Vector3()), 0.55);
          restPos.y += 0.09;
          const polePos = root0.localToWorld(new THREE.Vector3(side === 'l' ? 0.35 : -0.35, 0.55, -0.3));
          solveTwoBoneIK(bones0[`upperarm_${side}`], bones0[`lowerarm_${side}`], bones0[`hand_${side}`], restPos, polePos, s.armWeight);
        }
      }
    }

    // 2. MUTUAL LOOK-AT IK
    if (sittingActor.bones.neck_01 && sittingActor.bones.Head) {
      solveLookAtIK(sittingActor.bones.neck_01, sittingActor.bones.Head, s.heads[1], 0.8);
    }
    if (standingActor.bones.neck_01 && standingActor.bones.Head) {
      solveLookAtIK(standingActor.bones.neck_01, standingActor.bones.Head, s.heads[0], 0.85);
    }

    const p0 = sittingActor.root.position;
    const p1 = standingActor.root.position;
    const center = p0.clone().lerp(p1, 0.5).setY(0.9);
    world.group('discussion_south', center, 1.3, 'Conversation near the playground');
  });

  return (
    <>
      <primitive object={sittingActor.root} />
      <primitive object={standingActor.root} />
    </>
  );
}

// Composite component containing all bench discussion actors
export function BenchDiscussionActors({ world }: { world: WorldContextType }) {
  return (
    <>
      <BenchGroupEast world={world} />
      <BenchGroupNorth world={world} />
      <BenchGroupSouth world={world} />
    </>
  );
}

