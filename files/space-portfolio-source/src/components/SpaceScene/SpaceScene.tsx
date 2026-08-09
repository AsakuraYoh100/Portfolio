import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { StarField } from './StarField';
import { Galaxy } from './Galaxy';
import { Planet } from './Planet';
import { CameraRig } from './CameraRig';
import { useScene } from '../../context/SceneContext';

export function SpaceScene() {
  const { reducedMotion } = useScene();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="space-scene" aria-hidden="true">
      <Canvas
        dpr={[1, isMobile ? 1.3 : 2]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        camera={{ fov: 55, near: 0.1, far: 400, position: [0, 0, 42] }}
      >
        <color attach="background" args={['#05060f']} />
        <fog attach="fog" args={['#05060f', 40, 160]} />
        <ambientLight intensity={0.35} />
        <Suspense fallback={null}>
          <StarField count={isMobile ? 1400 : 3500} />
          <Galaxy count={isMobile ? 3200 : 9000} />
          <Planet />
          <CameraRig />
        </Suspense>
      </Canvas>
      {!reducedMotion && <div className="space-vignette" />}
    </div>
  );
}
