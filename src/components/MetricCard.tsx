import { useAnimatedValue } from '../hooks/useAnimatedValue';

const colorMap: Record<string, string> = {
  cyan: 'text-cyan-400',
  violet: 'text-violet-400',
  rose: 'text-rose-400',
  emerald: 'text-emerald-400',
  amber: 'text-amber-400',
};

interface Props {
  label: string;
  value: number;
  unit: string;
  previousValue?: number;
  color?: string;
  decimals?: number;
}

export function MetricCard({ label, value, unit, previousValue, color = 'cyan', decimals = 0 }: Props) {
  const animatedValue = useAnimatedValue(value);
  const delta = previousValue != null ? value - previousValue : null;
  const improved = delta != null && delta < 0;
  const degraded = delta != null && delta > 0;

  return (
    <div className="glass-card p-3 flex flex-col gap-1">
      <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
        {label}
      </span>
      <div className="flex items-baseline gap-1.5">
        <span className={`text-2xl font-bold ${colorMap[color] || 'text-cyan-400'}`}>
          {decimals > 0 ? animatedValue.toFixed(decimals) : Math.round(animatedValue)}
        </span>
        <span className="text-xs text-slate-400">{unit}</span>
        {delta != null && delta !== 0 && (
          <span
            className={`text-xs font-medium ml-auto ${
              improved ? 'text-emerald-400' : degraded ? 'text-rose-400' : 'text-slate-400'
            }`}
          >
            {improved ? '↓' : '↑'} {Math.abs(Math.round(delta))}{unit}
          </span>
        )}
      </div>
    </div>
  );
}
