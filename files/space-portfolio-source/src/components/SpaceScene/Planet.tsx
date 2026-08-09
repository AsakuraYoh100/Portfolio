import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScene } from '../../context/SceneContext';

const atmosphereVertex = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmosphereFragment = /* glsl */ `
  varying vec3 vNormal;
  uniform vec3 uColor;
  uniform float uIntensity;
  void main() {
    float rim = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
    gl_FragColor = vec4(uColor, rim * uIntensity);
  }
`;

export function Planet({ position = [10, -6, -18] as [number, number, number] }) {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const atmosphereMat = useRef<THREE.ShaderMaterial>(null);
  const { reducedMotion, getAmplitude } = useScene();

  const surfaceMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#2b3a6b',
        roughness: 0.85,
        metalness: 0.1,
        emissive: new THREE.Color('#0c1030'),
        emissiveIntensity: 0.5,
      }),
    []
  );

  useFrame((_, delta) => {
    if (mesh.current && !reducedMotion) {
      mesh.current.rotation.y += delta * 0.045;
    }
    if (atmosphereMat.current) {
      const amp = getAmplitude();
      atmosphereMat.current.uniforms.uIntensity.value = 1.1 + amp * 0.6;
    }
  });

  return (
    <group ref={group} position={position}>
      <mesh ref={mesh}>
        <sphereGeometry args={[6, 48, 48]} />
        <primitive object={surfaceMaterial} attach="material" />
      </mesh>
      {/* subtle cloud-like detail layer */}
      <mesh rotation={[0.4, 0.8, 0]}>
        <sphereGeometry args={[6.06, 32, 32]} />
        <meshStandardMaterial
          color="#7dc4ff"
          transparent
          opacity={0.06}
          roughness={1}
          depthWrite={false}
        />
      </mesh>
      {/* atmosphere rim glow */}
      <mesh scale={1.14}>
        <sphereGeometry args={[6, 48, 48]} />
        <shaderMaterial
          ref={atmosphereMat}
          args={[
            {
              vertexShader: atmosphereVertex,
              fragmentShader: atmosphereFragment,
              uniforms: {
                uColor: { value: new THREE.Color('#66c8ff') },
                uIntensity: { value: 1.1 },
              },
              transparent: true,
              blending: THREE.AdditiveBlending,
              side: THREE.BackSide,
              depthWrite: false,
            },
          ]}
        />
      </mesh>
      {/* key light so the planet reads as a physical object */}
      <pointLight position={[-15, 8, 10]} intensity={40} color="#9db8ff" distance={60} />
    </group>
  );
}
