import { motion } from 'framer-motion';
import { stages } from '../data/stages';

interface PageDef {
  id: number;
  label: string;
  group: 'intro' | 'vertical' | 'horizontal' | 'outro';
}

const pages: PageDef[] = [
  { id: 0, label: 'Overview', group: 'intro' },
  ...stages.map(s => ({
    id: s.id,
    label: s.title.length > 16 ? s.title.slice(0, 16) + '…' : s.title,
    group: s.category === 'vertical' ? 'vertical' as const : 'horizontal' as const,
  })),
  { id: 8, label: 'Model Catalog', group: 'outro' },
];

const groupColor = (group: string, d: boolean) => {
  switch (group) {
    case 'intro': return d ? '#94a3b8' : '#64748b';
    case 'vertical': return '#22d3ee';
    case 'horizontal': return '#a78bfa';
    case 'outro': return d ? '#94a3b8' : '#64748b';
    default: return '#94a3b8';
  }
};

interface Props {
  currentPage: number;
  goToPage: (n: number) => void;
  darkMode: boolean;
}

export function StageTimeline({ currentPage, goToPage, darkMode: d }: Props) {
  return (
    <div className="w-full px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto mb-2">
        <span className={`text-xs font-medium tracking-wider uppercase ${d ? 'text-slate-500' : 'text-slate-400'}`}>Overview</span>
        <span className={`text-xs font-medium tracking-wider uppercase ${d ? 'text-cyan-400' : 'text-cyan-500'}`}>Vertical Scaling</span>
        <span className={`text-xs font-medium tracking-wider uppercase ${d ? 'text-violet-400' : 'text-violet-500'}`}>Horizontal Scaling</span>
        <span className={`text-xs font-medium tracking-wider uppercase ${d ? 'text-slate-500' : 'text-slate-400'}`}>Platform</span>
      </div>
      <div className="relative max-w-7xl mx-auto" style={{ height: 32 }}>
        {/* Background line */}
        <div className={`absolute top-1/2 left-4 right-4 h-0.5 -translate-y-1/2 ${d ? 'bg-slate-700' : 'bg-slate-300'}`} />

        {/* Active line overlay */}
        {currentPage > 0 && (
          <div
            className="absolute top-1/2 left-4 h-0.5 -translate-y-1/2 transition-all duration-500"
            style={{
              width: `${(currentPage / (pages.length - 1)) * 100}%`,
              background: `linear-gradient(to right, #94a3b8, #22d3ee 10%, #22d3ee 40%, #a78bfa 55%, #a78bfa 85%, #94a3b8)`,
            }}
          />
        )}

        {/* Nodes */}
        <div className="relative flex justify-between items-center h-full px-0">
          {pages.map((page) => {
            const isActive = page.id === currentPage;
            const isPast = page.id < currentPage;
            const color = groupColor(page.group, d);

            const nodeActive = `border-2 text-slate-950`; // color applied via style
            const nodePast = d
              ? 'border-2 opacity-80'
              : 'border-2 opacity-90';
            const nodeInactive = d
              ? 'bg-slate-800 border-slate-600 text-slate-400 border-2'
              : 'bg-white border-slate-300 text-slate-500 border-2';

            const labelActive = d ? 'text-slate-200' : 'text-slate-700';
            const labelPast = d ? 'text-slate-400' : 'text-slate-500';
            const labelInactive = d ? 'text-slate-600' : 'text-slate-400';

            return (
              <button
                key={page.id}
                onClick={() => goToPage(page.id)}
                className="relative flex flex-col items-center cursor-pointer z-10"
              >
                <motion.div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold transition-colors duration-300 ${
                    isActive ? nodeActive : isPast ? nodePast : nodeInactive
                  }`}
                  style={
                    isActive
                      ? { backgroundColor: color, borderColor: color }
                      : isPast
                        ? { backgroundColor: `${color}30`, borderColor: color, color }
                        : undefined
                  }
                  animate={isActive ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                  transition={isActive ? { repeat: Infinity, duration: 2 } : {}}
                >
                  {page.id === 0 ? '⬟' : page.id <= 7 ? page.id : '◉'}
                </motion.div>
                <span
                  className={`absolute top-9 text-[9px] whitespace-nowrap font-medium transition-colors ${
                    isActive ? labelActive : isPast ? labelPast : labelInactive
                  }`}
                >
                  {page.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
