import * as THREE from 'three';

const vTempA = new THREE.Vector3();
const vTempB = new THREE.Vector3();
const vTempC = new THREE.Vector3();
const vTempD = new THREE.Vector3();
const qTempA = new THREE.Quaternion();
const qTempB = new THREE.Quaternion();

export function setBoneWorldQuat(bone: THREE.Object3D, worldQuat: THREE.Quaternion) {
  bone.parent!.getWorldQuaternion(qTempB);
  bone.quaternion.copy(qTempB.invert().multiply(worldQuat));
  bone.updateMatrixWorld(true);
}

export function solveTwoBoneIK(
  rootBone: THREE.Object3D,
  midBone: THREE.Object3D,
  endBone: THREE.Object3D,
  targetPos: THREE.Vector3,
  poleTarget: THREE.Vector3,
  weight = 1
) {
  if (weight <= 0.001) return;
  rootBone.updateMatrixWorld(true);
  const pA = rootBone.getWorldPosition(vTempA);
  const pB = midBone.getWorldPosition(vTempB);
  const pC = endBone.getWorldPosition(vTempC);

  const lenA = pA.distanceTo(pB);
  const lenB = pB.distanceTo(pC);
  const target = vTempD.copy(targetPos);
  const dist = THREE.MathUtils.clamp(pA.distanceTo(target), 0.01, (lenA + lenB) * 0.999);

  const curAngleA = Math.acos(THREE.MathUtils.clamp(pC.clone().sub(pA).normalize().dot(pB.clone().sub(pA).normalize()), -1, 1));
  const curAngleB = Math.acos(THREE.MathUtils.clamp(pA.clone().sub(pB).normalize().dot(pC.clone().sub(pB).normalize()), -1, 1));
  const targetAngleA = Math.acos(THREE.MathUtils.clamp((lenB * lenB - lenA * lenA - dist * dist) / (-2 * lenA * dist), -1, 1));
  const targetAngleB = Math.acos(THREE.MathUtils.clamp((dist * dist - lenA * lenA - lenB * lenB) / (-2 * lenA * lenB), -1, 1));

  let planeNorm = pC.clone().sub(pA).cross(pB.clone().sub(pA));
  if (planeNorm.lengthSq() < 1e-8) {
    planeNorm.copy(poleTarget.clone().sub(pA).cross(target.clone().sub(pA)));
  }
  planeNorm.normalize();

  const rotA = rootBone.getWorldQuaternion(new THREE.Quaternion());
  const rotB = midBone.getWorldQuaternion(new THREE.Quaternion());
  const deltaA = new THREE.Quaternion().setFromAxisAngle(planeNorm, targetAngleA - curAngleA);
  const deltaB = new THREE.Quaternion().setFromAxisAngle(planeNorm, targetAngleB - curAngleB);

  const blendQuat = (q: THREE.Quaternion) => (weight < 1 ? q.slerp(new THREE.Quaternion(), 1 - weight) : q);
  setBoneWorldQuat(rootBone, blendQuat(deltaA).multiply(rotA));
  setBoneWorldQuat(midBone, blendQuat(deltaB).multiply(rotB));

  const curEndDir = endBone.getWorldPosition(new THREE.Vector3()).sub(pA);
  const targetEndDir = target.clone().sub(pA);
  const aimQuat = qTempA.setFromUnitVectors(curEndDir.clone().normalize(), targetEndDir.clone().normalize());
  if (weight < 1) aimQuat.slerp(new THREE.Quaternion(), 1 - weight);
  setBoneWorldQuat(rootBone, aimQuat.multiply(rootBone.getWorldQuaternion(new THREE.Quaternion())));

  const midPos = midBone.getWorldPosition(new THREE.Vector3());
  const endDir = endBone.getWorldPosition(new THREE.Vector3()).sub(pA).normalize();
  const projMid = midPos.clone().sub(pA).projectOnPlane(endDir);
  const projPole = poleTarget.clone().sub(pA).projectOnPlane(endDir);

  if (projMid.lengthSq() > 1e-8 && projPole.lengthSq() > 1e-8) {
    const twistQuat = new THREE.Quaternion().setFromUnitVectors(projMid.normalize(), projPole.normalize());
    if (weight < 1) twistQuat.slerp(new THREE.Quaternion(), 1 - weight);
    setBoneWorldQuat(rootBone, twistQuat.multiply(rootBone.getWorldQuaternion(new THREE.Quaternion())));
  }
}

export function solveLookAtIK(
  neckBone: THREE.Object3D,
  headBone: THREE.Object3D,
  targetPos: THREE.Vector3,
  weight = 1,
  maxYaw = 1.1,
  maxPitch = 0.55
) {
  if (weight <= 0.001) return;
  headBone.updateMatrixWorld(true);
  const headPos = headBone.getWorldPosition(new THREE.Vector3());

  let actorRoot: THREE.Object3D = neckBone;
  while (actorRoot.parent && !actorRoot.userData.actorRoot) {
    actorRoot = actorRoot.parent;
  }
  const rootQuat = actorRoot.getWorldQuaternion(new THREE.Quaternion());
  const localDir = targetPos.clone().sub(headPos).normalize().applyQuaternion(rootQuat.clone().invert());
  const yaw = THREE.MathUtils.clamp(Math.atan2(localDir.x, localDir.z), -maxYaw, maxYaw) * weight;
  const pitch = THREE.MathUtils.clamp(-Math.asin(THREE.MathUtils.clamp(localDir.y, -1, 1)), -maxPitch, maxPitch) * weight;

  const euler = new THREE.Euler(pitch, yaw, 0, 'YXZ');
  const targetWorldQuat = rootQuat.clone().multiply(new THREE.Quaternion().setFromEuler(euler)).multiply(rootQuat.clone().invert());

  for (const [bone, fraction] of [
    [neckBone, 0.4],
    [headBone, 0.6],
  ] as const) {
    const blended = new THREE.Quaternion().slerp(targetWorldQuat, fraction);
    const curQ = bone.getWorldQuaternion(new THREE.Quaternion());
    setBoneWorldQuat(bone, blended.multiply(curQ));
  }
}

export function rotateBoneTowards(bone: THREE.Object3D, childBone: THREE.Object3D, axis: THREE.Vector3, angle: number) {
  if (Math.abs(angle) < 1e-4) return;
  const pA = bone.getWorldPosition(new THREE.Vector3());
  const pB = childBone.getWorldPosition(new THREE.Vector3()).sub(pA).normalize();
  const cross = new THREE.Vector3().crossVectors(pB, axis);
  if (cross.lengthSq() < 1e-8) return;
  cross.normalize();
  const q = new THREE.Quaternion().setFromAxisAngle(cross, angle);
  setBoneWorldQuat(bone, q.multiply(bone.getWorldQuaternion(new THREE.Quaternion())));
}

export const FINGER_NAMES = ['index', 'middle', 'ring', 'pinky'];
export function curlFingers(bones: Record<string, THREE.Bone>, side: 'l' | 'r', curlAmount: number) {
  if (curlAmount <= 0.001) return;
  const hand = bones[`hand_${side}`];
  const idxBone = bones[`index_01_${side}`];
  const pinkyBone = bones[`pinky_01_${side}`];
  if (!hand || !idxBone || !pinkyBone) return;

  const handPos = hand.getWorldPosition(new THREE.Vector3());
  const fwd = idxBone.getWorldPosition(new THREE.Vector3()).add(pinkyBone.getWorldPosition(new THREE.Vector3())).multiplyScalar(0.5).sub(handPos).normalize();
  const sideVec = pinkyBone.getWorldPosition(new THREE.Vector3()).sub(idxBone.getWorldPosition(new THREE.Vector3())).normalize();
  const axis = new THREE.Vector3().crossVectors(fwd, sideVec).multiplyScalar(side === 'l' ? -1 : 1).normalize();

  for (const fName of FINGER_NAMES) {
    for (let seg = 1; seg <= 3; seg++) {
      const b = bones[`${fName}_0${seg}_${side}`];
      const nextB = bones[`${fName}_0${seg + 1}_${side}`] ?? b?.children.find((c: any) => c.isBone);
      if (b && nextB) {
        rotateBoneTowards(b, nextB as THREE.Object3D, axis, curlAmount * (seg === 1 ? 1.1 : 1.3));
      }
    }
  }
  const t2 = bones[`thumb_02_${side}`];
  const t3 = bones[`thumb_03_${side}`];
  if (t2 && t3) {
    rotateBoneTowards(t2, t3, axis, 0.6 * curlAmount);
  }
}

export function dampAngle(current: number, target: number, lambda: number, delta: number) {
  let diff = target - current;
  diff = Math.atan2(Math.sin(diff), Math.cos(diff));
  return current + diff * (1 - Math.exp(-lambda * delta));
}

export function waitMs(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('aborted', 'AbortError'));
    });
  });
}

export const randomRange = (min: number, max: number) => min + Math.random() * (max - min);
export const randomChance = (prob: number) => Math.random() < prob;
export const UP_AXIS = new THREE.Vector3(0, 1, 0);

export const BENCH_FEET: [number, number, number][] = [
  [0.12, 0.01, 0.3],
  [-0.13, 0.01, 0.27],
];

