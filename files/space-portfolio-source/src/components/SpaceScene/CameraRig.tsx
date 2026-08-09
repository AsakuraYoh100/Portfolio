import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useScene } from '../../context/SceneContext';

interface Waypoint {
  pos: [number, number, number];
  look: [number, number, number];
}

// One waypoint per section: home → about → skills → projects → experience → contact.
// The camera drifts through these as the visitor scrolls, arriving at the
// "Transmission Center" by the time they reach Contact.
const WAYPOINTS: Waypoint[] = [
  { pos: [0, 0, 42], look: [0, 0, -70] }, // home — galaxy + planet establishing shot
  { pos: [5, 1.5, 18], look: [10, -6, -18] }, // about — drifting toward the planet
  { pos: [-9, 3, 2], look: [0, 2, -40] }, // skills — near the galaxy's arms
  { pos: [3, -2, -14], look: [0, 0, -70] }, // projects — deeper into the field
  { pos: [-5, 2.5, -30], look: [0, 0, -95] }, // experience — further still
  { pos: [0, 0.5, -48], look: [0, 0, -120] }, // contact — the transmission center
];

function lerpVec3(out: THREE.Vector3, a: [number, number, number], b: [number, number, number], t: number) {
  out.set(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t);
}

export function CameraRig() {
  const { camera } = useThree();
  const { mouse, scrollProgress, reducedMotion } = useScene();
  const targetPos = useRef(new THREE.Vector3(0, 0, 42));
  const targetLook = useRef(new THREE.Vector3(0, 0, -70));
  const currentLook = useRef(new THREE.Vector3(0, 0, -70));

  useFrame((_, delta) => {
    const segments = WAYPOINTS.length - 1;
    const p = Math.min(0.9999, scrollProgress.current) * segments;
    const idx = Math.floor(p);
    const t = p - idx;
    const a = WAYPOINTS[Math.min(idx, segments)];
    const b = WAYPOINTS[Math.min(idx + 1, segments)];

    lerpVec3(targetPos.current, a.pos, b.pos, t);
    lerpVec3(targetLook.current, a.look, b.look, t);

    // subtle mouse parallax layered on top of the scroll path
    const parallaxX = reducedMotion ? 0 : mouse.current.x * 1.6;
    const parallaxY = reducedMotion ? 0 : -mouse.current.y * 1.0;

    const damp = reducedMotion ? 1 : Math.min(1, delta * 1.6);
    camera.position.lerp(
      new THREE.Vector3(
        targetPos.current.x + parallaxX,
        targetPos.current.y + parallaxY,
        targetPos.current.z
      ),
      damp
    );
    currentLook.current.lerp(targetLook.current, damp);
    camera.lookAt(currentLook.current);
  });

  return null;
}
