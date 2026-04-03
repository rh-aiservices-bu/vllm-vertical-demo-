import { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStageNavigation } from './hooks/useStageNavigation';
import { stages } from './data/stages';
import { StageTimeline } from './components/StageTimeline';
import { ArchitectureDiagram } from './components/ArchitectureDiagram';
import { MetricsPanel } from './components/MetricsPanel';
import { ExplanationPanel } from './components/ExplanationPanel';

function App() {
  const { currentStage, direction, goToStage, nextStage, prevStage, totalStages, autoplay, toggleAutoplay, intervalSec, setIntervalSec } =
    useStageNavigation();
  const stage = useMemo(() => stages.find((s) => s.id === currentStage)!, [currentStage]);
  const isHorizontal = stage.category === 'horizontal';

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-100">
              vLLM → LLM-D
              <span className="text-sm font-normal text-slate-400 ml-3">
                Vertical to Horizontal Scaling
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleAutoplay}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  autoplay
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-500'
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
                  className="bg-slate-800 text-slate-300 text-xs border border-slate-700 rounded-lg px-2 py-1.5 cursor-pointer focus:outline-none focus:border-emerald-500/50"
                >
                  {[10, 15, 20, 30, 45, 60].map((s) => (
                    <option key={s} value={s}>{s}s</option>
                  ))}
                </select>
              )}
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">←</kbd>
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">→</kbd>
              <span>Navigate</span>
            </div>
          </div>
        </div>
      </header>

      {/* Timeline */}
      <div className="border-b border-slate-800 pt-2 pb-8">
        <StageTimeline currentStage={currentStage} goToStage={goToStage} />
      </div>

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-6">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStage}
            custom={direction}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Stage title */}
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-1">
                <span
                  className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                    isHorizontal
                      ? 'bg-violet-500/15 text-violet-400'
                      : 'bg-cyan-500/15 text-cyan-400'
                  }`}
                >
                  {stage.category} scaling
                </span>
                <span className="text-sm text-slate-500">
                  Stage {stage.id} of {totalStages}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-slate-100">{stage.title}</h2>
              <p className={`text-sm ${isHorizontal ? 'text-violet-400' : 'text-cyan-400'}`}>
                {stage.subtitle}
              </p>
            </div>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
              {/* Left: Architecture Diagram (3 cols) */}
              <div className="lg:col-span-3">
                <ArchitectureDiagram stageId={currentStage} direction={direction} />
                {/* Explanation below diagram */}
                <div className="mt-4">
                  <ExplanationPanel stage={stage} />
                </div>
              </div>

              {/* Right: Metrics Panel (2 cols) */}
              <div className="lg:col-span-2">
                <MetricsPanel stage={stage} />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation buttons */}
      <footer className="border-t border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={prevStage}
            disabled={currentStage === 1}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentStage === 1
                ? 'text-slate-600 bg-slate-800/50 cursor-not-allowed'
                : 'text-slate-200 bg-slate-800 hover:bg-slate-700 cursor-pointer'
            }`}
          >
            ← Previous
          </button>
          <div className="text-xs text-slate-500">
            {currentStage < 5
              ? 'Vertical Scaling Optimizations'
              : 'Horizontal Scaling with LLM-D'}
          </div>
          <button
            onClick={nextStage}
            disabled={currentStage === totalStages}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentStage === totalStages
                ? 'text-slate-600 bg-slate-800/50 cursor-not-allowed'
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
