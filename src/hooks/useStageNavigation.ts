import { useState, useCallback, useEffect, useRef } from 'react';

const DEFAULT_INTERVAL = 20;
const TOTAL_PAGES = 9; // 0=intro, 1-7=stages, 8=model-catalog

export function useStageNavigation() {
  const getInitialPage = () => {
    const hash = window.location.hash;
    const match = hash.match(/^#page-(\d+)$/);
    if (match) {
      const n = parseInt(match[1], 10);
      if (n >= 0 && n < TOTAL_PAGES) return n;
    }
    return 0;
  };

  const [currentPage, setCurrentPage] = useState(getInitialPage);
  const [direction, setDirection] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [intervalSec, setIntervalSec] = useState(DEFAULT_INTERVAL);
  const timerRef = useRef<ReturnType<typeof setInterval>>(0 as unknown as ReturnType<typeof setInterval>);

  const goToPage = useCallback(
    (n: number) => {
      if (n < 0 || n >= TOTAL_PAGES || n === currentPage) return;
      setAutoplay(false);
      setDirection(n > currentPage ? 1 : -1);
      setCurrentPage(n);
      window.location.hash = `page-${n}`;
    },
    [currentPage]
  );

  const nextPage = useCallback(() => { setAutoplay(false); goToPage(currentPage + 1); }, [currentPage, goToPage]);
  const prevPage = useCallback(() => { setAutoplay(false); goToPage(currentPage - 1); }, [currentPage, goToPage]);

  const toggleAutoplay = useCallback(() => setAutoplay(prev => !prev), []);

  // Autoplay timer — loops back to 0 after last page
  useEffect(() => {
    if (!autoplay) {
      clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setCurrentPage(prev => {
        const next = prev < TOTAL_PAGES - 1 ? prev + 1 : 0;
        setDirection(next > prev ? 1 : -1);
        window.location.hash = `page-${next}`;
        return next;
      });
    }, intervalSec * 1000);
    return () => clearInterval(timerRef.current);
  }, [autoplay, intervalSec]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextPage();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevPage();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [nextPage, prevPage]);

  // Derived: which stage (1-7) is active, or null if on an image page
  const currentStage = currentPage >= 1 && currentPage <= 7 ? currentPage : null;

  return {
    currentPage, currentStage, direction,
    goToPage, nextPage, prevPage,
    totalPages: TOTAL_PAGES,
    autoplay, toggleAutoplay, intervalSec, setIntervalSec,
  };
}
