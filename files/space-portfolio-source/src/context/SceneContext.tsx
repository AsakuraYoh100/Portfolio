import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react';

interface SceneContextValue {
  /** Mutable ref, updated on mousemove — read inside useFrame, never triggers re-renders */
  mouse: React.MutableRefObject<{ x: number; y: number }>;
  scrollProgress: React.MutableRefObject<number>;
  reducedMotion: boolean;
  getAmplitude: () => number;
}

const SceneContext = createContext<SceneContextValue | null>(null);

export function SceneProvider({
  children,
  reducedMotion,
  getAmplitude,
  scrollProgressValue,
}: {
  children: ReactNode;
  reducedMotion: boolean;
  getAmplitude: () => number;
  scrollProgressValue: number;
}) {
  const mouse = useRef({ x: 0, y: 0 });
  const scrollProgress = useRef(0);
  scrollProgress.current = scrollProgressValue;

  useEffect(() => {
    if (reducedMotion) return;
    function onMove(e: MouseEvent) {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    }
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [reducedMotion]);

  return (
    <SceneContext.Provider value={{ mouse, scrollProgress, reducedMotion, getAmplitude }}>
      {children}
    </SceneContext.Provider>
  );
}

export function useScene() {
  const ctx = useContext(SceneContext);
  if (!ctx) throw new Error('useScene must be used within SceneProvider');
  return ctx;
}
