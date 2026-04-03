import { useMemo, useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { motion } from 'framer-motion';
import type { StageDefinition } from '../types';
import { MetricCard } from './MetricCard';
import { stages } from '../data/stages';
import { fadeInUp, staggerContainer } from '../animations/variants';

interface Props {
  stage: StageDefinition;
}

export function MetricsPanel({ stage }: Props) {
  const prev = useMemo(
    () => (stage.id > 1 ? stages.find((s) => s.id === stage.id - 1)! : null),
    [stage.id]
  );

  // Progressive data reveal for chart
  const [visiblePoints, setVisiblePoints] = useState(1);
  useEffect(() => {
    setVisiblePoints(1);
    const total = stage.loadCurve.length;
    let i = 1;
    const timer = setInterval(() => {
      i++;
      setVisiblePoints(i);
      if (i >= total) clearInterval(timer);
    }, 180);
    return () => clearInterval(timer);
  }, [stage.id, stage.loadCurve.length]);

  const chartData = stage.loadCurve.slice(0, visiblePoints);
  const isHorizontal = stage.category === 'horizontal';
  const color = isHorizontal ? 'violet' : 'cyan';

  return (
    <motion.div
      className="flex flex-col gap-3"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      key={stage.id}
    >
      {/* Key Metrics Grid */}
      <motion.div className="grid grid-cols-2 gap-2" variants={fadeInUp}>
        <MetricCard
          label="TTFT p50"
          value={stage.metrics.ttft.p50}
          unit="ms"
          previousValue={prev?.metrics.ttft.p50}
          color={color}
        />
        <MetricCard
          label="TTFT p99"
          value={stage.metrics.ttft.p99}
          unit="ms"
          previousValue={prev?.metrics.ttft.p99}
          color={color}
        />
        <MetricCard
          label="ITL p50"
          value={stage.metrics.itl.p50}
          unit="ms"
          previousValue={prev?.metrics.itl.p50}
          color={color}
        />
        <MetricCard
          label="Throughput"
          value={stage.metrics.throughput}
          unit="users/s"
          previousValue={prev?.metrics.throughput}
          color={color}
        />
      </motion.div>

      {/* Cache metrics */}
      <motion.div className="grid grid-cols-2 gap-2" variants={fadeInUp}>
        <MetricCard
          label="KV Cache Util"
          value={stage.metrics.kvCacheUtilization * 100}
          unit="%"
          previousValue={prev ? prev.metrics.kvCacheUtilization * 100 : undefined}
          color={stage.metrics.kvCacheUtilization > 0.85 ? 'rose' : color}
        />
        <MetricCard
          label="Prefix Cache Hit"
          value={stage.metrics.prefixCacheHitRate * 100}
          unit="%"
          previousValue={prev ? prev.metrics.prefixCacheHitRate * 100 : undefined}
          color={color}
        />
      </motion.div>

      {/* Load Curve Chart */}
      <motion.div className="glass-card p-4" variants={fadeInUp}>
        <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
          Performance Under Load
        </h4>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 20, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="users"
              stroke="#64748b"
              fontSize={10}
            />
            <YAxis stroke="#64748b" fontSize={10} label={{ value: 'ms', position: 'insideTopLeft', offset: -2, style: { fill: '#64748b', fontSize: 9 } }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                borderRadius: 8,
                fontSize: 11,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 10, paddingTop: 4 }} />
            <Line
              type="monotone"
              dataKey="ttftP50"
              stroke="#22d3ee"
              name="TTFT p50"
              strokeWidth={2}
              dot={{ r: 3 }}
              animationDuration={300}
            />
            <Line
              type="monotone"
              dataKey="ttftP95"
              stroke="#fbbf24"
              name="TTFT p95"
              strokeWidth={2}
              dot={{ r: 3 }}
              animationDuration={300}
            />
            <Line
              type="monotone"
              dataKey="ttftP99"
              stroke="#fb7185"
              name="TTFT p99"
              strokeWidth={2}
              dot={{ r: 3 }}
              animationDuration={300}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
}
