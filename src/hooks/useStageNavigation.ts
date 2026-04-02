import { useState, useCallback, useEffect } from 'react';
import { stages } from '../data/stages';

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

  const goToStage = useCallback(
    (n: number) => {
      if (n < 1 || n > totalStages || n === currentStage) return;
      setDirection(n > currentStage ? 1 : -1);
      setCurrentStage(n);
      window.location.hash = `stage-${n}`;
    },
    [currentStage, totalStages]
  );

  const nextStage = useCallback(() => goToStage(currentStage + 1), [currentStage, goToStage]);
  const prevStage = useCallback(() => goToStage(currentStage - 1), [currentStage, goToStage]);

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

  return { currentStage, direction, goToStage, nextStage, prevStage, totalStages };
}
