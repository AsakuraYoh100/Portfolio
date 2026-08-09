import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getParticleTexture } from '../../utils/particleTexture';

function generateStars(count: number, radius: number) {
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    // distribute on a large shell around the origin, biased outward
    const r = radius * (0.55 + Math.random() * 0.45);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi) - radius * 0.3;
    sizes[i] = Math.random();
  }
  return { positions, sizes };
}

export function StarField({ count = 3500, radius = 220 }: { count?: number; radius?: number }) {
  const near = useRef<THREE.Points>(null);
  const far = useRef<THREE.Points>(null);

  const nearData = useMemo(() => generateStars(Math.floor(count * 0.3), radius * 0.6), [count, radius]);
  const farData = useMemo(() => generateStars(Math.floor(count * 0.7), radius), [count, radius]);

  useFrame((_, delta) => {
    if (near.current) near.current.rotation.y += delta * 0.006;
    if (far.current) far.current.rotation.y += delta * 0.002;
  });

  return (
    <>
      <points ref={far}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[farData.positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.9}
          map={getParticleTexture()}
          color="#ffffff"
          transparent
          opacity={0.6}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <points ref={near}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nearData.positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={1.7}
          map={getParticleTexture()}
          color="#cfe3ff"
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
}
