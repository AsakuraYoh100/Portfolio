import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScene } from '../../context/SceneContext';
import { getParticleTexture } from '../../utils/particleTexture';

interface GalaxyProps {
  count?: number;
  radius?: number;
  branches?: number;
  position?: [number, number, number];
}

/**
 * A procedurally generated spiral galaxy — built from particle positions
 * along logarithmic spiral arms with a bright, hot core and cooler outer
 * dust, rather than a flat image texture.
 */
export function Galaxy({ count = 9000, radius = 34, branches = 4, position = [0, 0, -70] }: GalaxyProps) {
  const points = useRef<THREE.Points>(null);
  const { reducedMotion } = useScene();

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const coreColor = new THREE.Color('#ffffff');
    const innerColor = new THREE.Color('#8b5cf6');
    const outerColor = new THREE.Color('#3b82f6');
    const pinkColor = new THREE.Color('#f0a8ff');

    for (let i = 0; i < count; i++) {
      const r = Math.pow(Math.random(), 1.5) * radius;
      const branchAngle = ((i % branches) / branches) * Math.PI * 2;
      const spin = r * 0.32;

      const randomness = 0.35 * (1 - r / radius) + 0.15;
      const rx = (Math.random() - 0.5) * randomness * r;
      const ry = (Math.random() - 0.5) * randomness * 0.5;
      const rz = (Math.random() - 0.5) * randomness * r;

      const angle = branchAngle + spin;
      positions[i * 3 + 0] = Math.cos(angle) * r + rx;
      positions[i * 3 + 1] = ry;
      positions[i * 3 + 2] = Math.sin(angle) * r + rz;

      let mixed: THREE.Color;
      const t = r / radius;
      if (t < 0.15) mixed = coreColor.clone().lerp(innerColor, t / 0.15);
      else if (t < 0.6) mixed = innerColor.clone().lerp(outerColor, (t - 0.15) / 0.45);
      else mixed = outerColor.clone().lerp(pinkColor, Math.min(1, (t - 0.6) / 0.4) * 0.5);

      colors[i * 3 + 0] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }

    return { positions, colors };
  }, [count, radius, branches]);

  useFrame((_, delta) => {
    if (!points.current || reducedMotion) return;
    points.current.rotation.y += delta * 0.014;
  });

  return (
    <group position={position} rotation={[0.35, 0, 0.15]}>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.65}
          map={getParticleTexture()}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      {/* soft glow core */}
      <mesh>
        <sphereGeometry args={[4.5, 24, 24]} />
        <meshBasicMaterial color="#e9d8ff" transparent opacity={0.12} depthWrite={false} />
      </mesh>
    </group>
  );
}
