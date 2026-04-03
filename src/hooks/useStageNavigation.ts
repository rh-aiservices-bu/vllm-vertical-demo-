import { useState, useCallback, useEffect, useRef } from 'react';
import { stages } from '../data/stages';

const DEFAULT_INTERVAL = 20;

export function useStageNavigation() {
  const totalStages = stages.length;

  const getInitialStage = () => {
    const hash = window.location.hash;
    const match = hash.match(/^#stage-(\d+)$/);
    if (match) {
      const n = parseInt(match[1], 10);
      if (n >= 1 && n <= totalStages) return n;
    }
    return 1;
  };

  const [currentStage, setCurrentStage] = useState(getInitialStage);
  const [direction, setDirection] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [intervalSec, setIntervalSec] = useState(DEFAULT_INTERVAL);
  const timerRef = useRef<ReturnType<typeof setInterval>>(0 as unknown as ReturnType<typeof setInterval>);

  const goToStage = useCallback(
    (n: number) => {
      if (n < 1 || n > totalStages || n === currentStage) return;
      setAutoplay(false);
      setDirection(n > currentStage ? 1 : -1);
      setCurrentStage(n);
      window.location.hash = `stage-${n}`;
    },
    [currentStage, totalStages]
  );

  const nextStage = useCallback(() => { setAutoplay(false); goToStage(currentStage + 1); }, [currentStage, goToStage]);
  const prevStage = useCallback(() => { setAutoplay(false); goToStage(currentStage - 1); }, [currentStage, goToStage]);

  const toggleAutoplay = useCallback(() => setAutoplay(prev => !prev), []);

  // Autoplay timer — restarts when interval changes
  useEffect(() => {
    if (!autoplay) {
      clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setCurrentStage(prev => {
        const next = prev < totalStages ? prev + 1 : 1;
        setDirection(next > prev ? 1 : -1);
        window.location.hash = `stage-${next}`;
        return next;
      });
    }, intervalSec * 1000);
    return () => clearInterval(timerRef.current);
  }, [autoplay, totalStages, intervalSec]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextStage();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevStage();
      }
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= totalStages) {
        goToStage(num);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [nextStage, prevStage, goToStage, totalStages]);

  return {
    currentStage, direction, goToStage, nextStage, prevStage, totalStages,
    autoplay, toggleAutoplay, intervalSec, setIntervalSec,
  };
}
