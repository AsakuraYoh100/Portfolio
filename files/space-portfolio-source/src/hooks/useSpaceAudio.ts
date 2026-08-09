import { useCallback, useEffect, useRef, useState } from 'react';

const SESSION_KEY = 'space-portfolio-music-on';

/**
 * Manages the ambient music track plus a lightweight Web Audio analyser
 * so visuals can subtly react to amplitude without behaving like a
 * music visualizer. All audio only starts after a real user gesture,
 * per browser autoplay policy.
 */
export function useSpaceAudio(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataRef = useRef<Uint8Array | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);

  const [isOn, setIsOn] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0.35;
    audio.preload = 'auto';
    audioRef.current = audio;
    setReady(true);
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [src]);

  const ensureGraph = useCallback(() => {
    if (!audioRef.current) return;
    if (!ctxRef.current) {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AC();
      const source = ctx.createMediaElementSource(audioRef.current);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyser.connect(ctx.destination);
      ctxRef.current = ctx;
      sourceNodeRef.current = source;
      analyserRef.current = analyser;
      dataRef.current = new Uint8Array(analyser.frequencyBinCount);
    }
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume();
  }, []);

  const play = useCallback(async () => {
    ensureGraph();
    try {
      await audioRef.current?.play();
      setIsOn(true);
      try {
        sessionStorage.setItem(SESSION_KEY, 'true');
      } catch {
        /* ignore */
      }
    } catch (err) {
      // Autoplay blocked until a user gesture — this is expected, not a bug.
      console.warn('[audio] playback deferred until user interaction:', err);
      setIsOn(false);
    }
  }, [ensureGraph]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsOn(false);
    try {
      sessionStorage.setItem(SESSION_KEY, 'false');
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(() => {
    if (isOn) pause();
    else play();
  }, [isOn, pause, play]);

  const setVolume = useCallback((v: number) => {
    if (audioRef.current) audioRef.current.volume = Math.max(0, Math.min(1, v));
  }, []);

  /** Returns a smoothed 0..1 amplitude value for subtle visual reactions. */
  const getAmplitude = useCallback((): number => {
    const analyser = analyserRef.current;
    const data = dataRef.current;
    if (!analyser || !data || !isOn) return 0;
    analyser.getByteFrequencyData(data as Uint8Array<ArrayBuffer>);
    let sum = 0;
    for (let i = 0; i < data.length; i++) sum += data[i];
    return sum / data.length / 255;
  }, [isOn]);

  return { isOn, ready, play, pause, toggle, setVolume, getAmplitude };
}
