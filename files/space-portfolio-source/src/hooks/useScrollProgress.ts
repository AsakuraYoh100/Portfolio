import { useEffect, useRef, useState } from 'react';

export const SECTION_IDS = [
  'home',
  'about',
  'skills',
  'projects',
  'experience',
  'contact',
] as const;
export type SectionId = (typeof SECTION_IDS)[number];

/**
 * Tracks overall scroll progress (0..1 across the document) plus which
 * section is currently most visible. Drives both the nav highlight and
 * the camera rig's position along its waypoint path.
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const raf = useRef<number | null>(null);

  useEffect(() => {
    function measure() {
      const doc = document.documentElement;
      const scrollTop = window.scrollY;
      const max = doc.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, scrollTop / max)) : 0);

      let closest: SectionId = 'home';
      let closestDist = Infinity;
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top - window.innerHeight * 0.35);
        if (dist < closestDist) {
          closestDist = dist;
          closest = id;
        }
      }
      setActiveSection(closest);
    }

    function onScroll() {
      if (raf.current) return;
      raf.current = requestAnimationFrame(() => {
        measure();
        raf.current = null;
      });
    }

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return { progress, activeSection };
}
