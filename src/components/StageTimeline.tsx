import { motion } from 'framer-motion';
import { stages } from '../data/stages';

interface Props {
  currentStage: number;
  goToStage: (n: number) => void;
  darkMode: boolean;
}

export function StageTimeline({ currentStage, goToStage, darkMode: d }: Props) {
  const dividerIndex = stages.findIndex((s, i) => i > 0 && stages[i - 1].category !== s.category);

  return (
    <div className="w-full px-4 py-3">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-4 text-xs font-medium mb-2 w-full">
          <span className={`tracking-wider uppercase ${d ? 'text-cyan-400' : 'text-cyan-500'}`}>Vertical Scaling</span>
          <div className="flex-1" />
          <span className={`tracking-wider uppercase ${d ? 'text-violet-400' : 'text-violet-500'}`}>Horizontal Scaling</span>
        </div>
      </div>
      <div className="relative max-w-6xl mx-auto" style={{ height: 32 }}>
        {/* Background line spanning full width */}
        <div
          className={`absolute top-1/2 left-4 right-4 h-0.5 -translate-y-1/2 ${d ? 'bg-slate-700' : 'bg-slate-300'}`}
        />

        {/* Active/past line overlay — from first node to current node */}
        {currentStage > 1 && (
          <div
            className="absolute top-1/2 left-4 h-0.5 -translate-y-1/2 transition-all duration-500"
            style={{
              width: `${((currentStage - 1) / (stages.length - 1)) * 100}%`,
              background: currentStage <= 4
                ? '#22d3ee'
                : 'linear-gradient(to right, #22d3ee, #22d3ee 57%, #a78bfa 57%, #a78bfa)',
            }}
          />
        )}

        {/* Category divider */}
        {dividerIndex > 0 && (
          <div
            className={`absolute top-0 bottom-0 w-px ${d ? 'bg-slate-600' : 'bg-slate-300'}`}
            style={{ left: `${((dividerIndex - 0.5) / (stages.length - 1)) * 100}%` }}
          />
        )}

        {/* Nodes */}
        <div className="relative flex justify-between items-center h-full px-0">
          {stages.map((stage) => {
            const isActive = stage.id === currentStage;
            const isPast = stage.id < currentStage;
            const isVertical = stage.category === 'vertical';

            const nodeActive = isVertical
              ? 'bg-cyan-400 border-cyan-400 text-slate-950'
              : 'bg-violet-400 border-violet-400 text-slate-950';
            const nodePast = isVertical
              ? (d ? 'bg-cyan-400/20 border-cyan-400 text-cyan-400' : 'bg-cyan-100 border-cyan-500 text-cyan-700')
              : (d ? 'bg-violet-400/20 border-violet-400 text-violet-400' : 'bg-violet-100 border-violet-500 text-violet-700');
            const nodeInactive = d
              ? 'bg-slate-800 border-slate-600 text-slate-400'
              : 'bg-white border-slate-300 text-slate-500';

            const labelActive = isVertical
              ? (d ? 'text-cyan-400' : 'text-cyan-600')
              : (d ? 'text-violet-400' : 'text-violet-600');
            const labelPast = d ? 'text-slate-300' : 'text-slate-600';
            const labelInactive = d ? 'text-slate-500' : 'text-slate-400';

            return (
              <button
                key={stage.id}
                onClick={() => goToStage(stage.id)}
                className="relative flex flex-col items-center cursor-pointer z-10"
              >
                <motion.div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-colors duration-300 ${
                    isActive ? nodeActive : isPast ? nodePast : nodeInactive
                  }`}
                  animate={isActive ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                  transition={isActive ? { repeat: Infinity, duration: 2 } : {}}
                >
                  {stage.id}
                </motion.div>
                <span
                  className={`absolute top-10 text-[10px] whitespace-nowrap font-medium transition-colors ${
                    isActive ? labelActive : isPast ? labelPast : labelInactive
                  }`}
                >
                  {stage.title.length > 18 ? stage.title.slice(0, 18) + '…' : stage.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
