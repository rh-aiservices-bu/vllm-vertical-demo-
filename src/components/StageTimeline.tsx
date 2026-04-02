import { motion } from 'framer-motion';
import { stages } from '../data/stages';

interface Props {
  currentStage: number;
  goToStage: (n: number) => void;
}

export function StageTimeline({ currentStage, goToStage }: Props) {
  return (
    <div className="w-full px-4 py-3">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-4 text-xs font-medium mb-2 w-full">
          <span className="text-cyan-400 tracking-wider uppercase">Vertical Scaling</span>
          <div className="flex-1" />
          <span className="text-violet-400 tracking-wider uppercase">Horizontal Scaling</span>
        </div>
      </div>
      <div className="flex items-center max-w-6xl mx-auto">
        {stages.map((stage, i) => {
          const isActive = stage.id === currentStage;
          const isPast = stage.id < currentStage;
          const isVertical = stage.category === 'vertical';
          const showDivider = i > 0 && stages[i - 1].category !== stage.category;

          const nodeActive = isVertical
            ? 'bg-cyan-400 border-cyan-400 text-slate-950'
            : 'bg-violet-400 border-violet-400 text-slate-950';
          const nodePast = isVertical
            ? 'bg-cyan-400/20 border-cyan-400 text-cyan-400'
            : 'bg-violet-400/20 border-violet-400 text-violet-400';
          const nodeInactive = 'bg-slate-800 border-slate-600 text-slate-400';

          const labelActive = isVertical ? 'text-cyan-400' : 'text-violet-400';
          const lineActive = isVertical ? 'bg-cyan-400' : 'bg-violet-400';

          return (
            <div key={stage.id} className="flex items-center flex-1">
              {i > 0 && (
                <div className="flex items-center flex-1">
                  {showDivider && <div className="w-px h-6 bg-slate-600 mx-1" />}
                  <div
                    className={`h-0.5 flex-1 transition-colors duration-300 ${
                      isPast || isActive ? lineActive : 'bg-slate-700'
                    }`}
                  />
                </div>
              )}
              <button
                onClick={() => goToStage(stage.id)}
                className="relative flex flex-col items-center group cursor-pointer"
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
                    isActive ? labelActive : isPast ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {stage.title.length > 18 ? stage.title.slice(0, 18) + '…' : stage.title}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
