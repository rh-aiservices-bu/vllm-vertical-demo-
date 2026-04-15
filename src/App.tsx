import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStageNavigation } from './hooks/useStageNavigation';
import { stages } from './data/stages';
import { StageTimeline } from './components/StageTimeline';
import { ArchitectureDiagram } from './components/ArchitectureDiagram';
import { MetricsPanel } from './components/MetricsPanel';
import { ExplanationPanel } from './components/ExplanationPanel';
import { ImageSlide } from './components/ImageSlide';
import { AnimatedStackSlide } from './components/AnimatedStackSlide';

const BASE = import.meta.env.BASE_URL;

const imageSlides = [
  { page: 8, src: `${BASE}maas.png`, title: 'Model as a Service', subtitle: 'Control access and consumption to both self-hosted and proprietary models' },
  { page: 9, src: `${BASE}model-catalog.png`, title: 'Model Catalog', subtitle: 'Validated models with performance and compatibility verified by Red Hat' },
];

function App() {
  const { currentPage, currentStage, direction, goToPage, nextPage, prevPage, totalPages, autoplay, toggleAutoplay, intervalSec, setIntervalSec } =
    useStageNavigation();

  const stage = useMemo(
    () => (currentStage ? stages.find((s) => s.id === currentStage)! : null),
    [currentStage]
  );
  const isHorizontal = stage?.category === 'horizontal';
  const [darkMode, setDarkMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const d = darkMode;

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const imageSlide = imageSlides.find(s => s.page === currentPage);
  const isImagePage = !!imageSlide;
  const isStagePage = !!stage;

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${d ? 'bg-slate-950' : 'bg-white'}`}>
      {/* Header */}
      <header className={`border-b px-6 py-4 ${d ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className={`text-xl font-bold ${d ? 'text-slate-100' : 'text-slate-900'}`}>
              vLLM → llm-d
              <span className={`text-sm font-normal ml-3 ${d ? 'text-slate-400' : 'text-slate-500'}`}>
                Vertical to Horizontal Scaling
              </span>
            </h1>
          </div>
          <div className={`flex items-center gap-4 text-xs ${d ? 'text-slate-500' : 'text-slate-400'}`}>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleAutoplay}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  autoplay
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : d
                      ? 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-500'
                      : 'bg-slate-100 text-slate-500 border border-slate-300 hover:border-slate-400'
                }`}
              >
                {autoplay ? (
                  <>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><rect x="1" y="1" width="3" height="8" rx="0.5" /><rect x="6" y="1" width="3" height="8" rx="0.5" /></svg>
                    Autoplay
                  </>
                ) : (
                  <>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><polygon points="2,1 9,5 2,9" /></svg>
                    Autoplay
                  </>
                )}
              </button>
              {autoplay && (
                <select
                  value={intervalSec}
                  onChange={(e) => setIntervalSec(Number(e.target.value))}
                  className={`text-xs rounded-lg px-2 py-1.5 cursor-pointer focus:outline-none ${
                    d
                      ? 'bg-slate-800 text-slate-300 border border-slate-700 focus:border-emerald-500/50'
                      : 'bg-slate-100 text-slate-600 border border-slate-300 focus:border-emerald-500/50'
                  }`}
                >
                  {[10, 15, 20, 30, 45, 60].map((s) => (
                    <option key={s} value={s}>{s}s</option>
                  ))}
                </select>
              )}
            </div>
            <button
              onClick={() => setDarkMode(v => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                d
                  ? 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-500'
                  : 'bg-slate-100 text-slate-600 border border-slate-300 hover:border-slate-400'
              }`}
            >
              {d ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
              {d ? 'Light' : 'Dark'}
            </button>
            <button
              onClick={toggleFullscreen}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                d
                  ? 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-500'
                  : 'bg-slate-100 text-slate-600 border border-slate-300 hover:border-slate-400'
              }`}
            >
              {isFullscreen ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 14 4 20 10 20"/><polyline points="20 10 20 4 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
              )}
              {isFullscreen ? 'Exit' : 'Fullscreen'}
            </button>
          </div>
        </div>
      </header>

      {/* Timeline */}
      <div className={`border-b pt-2 pb-8 ${d ? 'border-slate-800' : 'border-slate-200'}`}>
        <StageTimeline currentPage={currentPage} goToPage={goToPage} darkMode={d} />
      </div>

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-6">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentPage}
            custom={direction}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Animated stack diagram (page 0) */}
            {currentPage === 0 && (
              <AnimatedStackSlide darkMode={d} />
            )}

            {/* Image slides (outro pages) */}
            {isImagePage && (
              <ImageSlide
                src={imageSlide.src}
                title={imageSlide.title}
                subtitle={imageSlide.subtitle}
                darkMode={d}
              />
            )}

            {/* Stage pages (1-7) */}
            {isStagePage && stage && (
              <>
                {/* Stage title */}
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-1">
                    <span
                      className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                        isHorizontal
                          ? (d ? 'bg-violet-500/15 text-violet-400' : 'bg-violet-500/10 text-violet-600')
                          : d
                            ? 'bg-cyan-500/15 text-cyan-400'
                            : 'bg-cyan-600/10 text-cyan-700'
                      }`}
                    >
                      {stage.category} scaling
                    </span>
                    <span className={`text-sm ${d ? 'text-slate-500' : 'text-slate-400'}`}>
                      Stage {stage.id} of 7
                    </span>
                  </div>
                  <h2 className={`text-2xl font-bold ${d ? 'text-slate-100' : 'text-slate-900'}`}>{stage.title}</h2>
                  <p className={`text-sm ${isHorizontal ? (d ? 'text-violet-400' : 'text-violet-600') : (d ? 'text-cyan-400' : 'text-cyan-700')}`}>
                    {stage.subtitle}
                  </p>
                  <p className={`text-sm mt-1 italic ${d ? 'text-slate-400' : 'text-slate-500'}`}>
                    {stage.story}
                  </p>
                </div>

                {/* Two-column layout */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                  <div className="lg:col-span-3">
                    <ArchitectureDiagram stageId={stage.id} direction={direction} />
                    <div className="mt-4">
                      <ExplanationPanel stage={stage} />
                    </div>
                  </div>
                  <div className="lg:col-span-2">
                    <MetricsPanel stage={stage} />
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation buttons */}
      <footer className={`border-t px-6 py-4 ${d ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentPage === 0
                ? d ? 'text-slate-600 bg-slate-800/50 cursor-not-allowed' : 'text-slate-400 bg-slate-100 cursor-not-allowed'
                : d ? 'text-slate-200 bg-slate-800 hover:bg-slate-700 cursor-pointer' : 'text-slate-700 bg-slate-100 hover:bg-slate-200 cursor-pointer'
            }`}
          >
            ← Previous
          </button>
          <div className={`text-xs ${d ? 'text-slate-500' : 'text-slate-400'}`}>
            {currentPage === 0
              ? 'Enterprise GenAI Overview'
              : currentPage <= 4
                ? 'Vertical Scaling Optimizations'
                : currentPage <= 7
                  ? 'Horizontal Scaling with llm-d'
                  : 'Platform Capabilities'}
          </div>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages - 1}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentPage === totalPages - 1
                ? d ? 'text-slate-600 bg-slate-800/50 cursor-not-allowed' : 'text-slate-400 bg-slate-100 cursor-not-allowed'
                : isHorizontal
                  ? 'text-white bg-violet-600 hover:bg-violet-500 cursor-pointer'
                  : 'text-white bg-cyan-600 hover:bg-cyan-500 cursor-pointer'
            }`}
          >
            Next →
          </button>
        </div>
      </footer>
    </div>
  );
}

export default App;
