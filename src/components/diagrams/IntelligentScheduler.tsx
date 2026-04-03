import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RequestParticle } from '../../animations/RequestParticle';
import { WorkloadPanel } from '../../animations/WorkloadPanel';
import { scaleIn } from '../../animations/variants';

function jitter(base: number, range: number) {
  return Math.max(0.10, Math.min(0.99, base + (Math.random() - 0.5) * range));
}

export function IntelligentScheduler() {
  const scorers = [
    { label: 'Prefix Cache', weight: 3, color: '#22d3ee' },
    { label: 'Queue Depth', weight: 2, color: '#fbbf24' },
    { label: 'Active Reqs', weight: 2, color: '#a78bfa' },
  ];

  const baseScores = [0.92, 0.61, 0.88, 0.78];
  const [scores, setScores] = useState(baseScores);

  const tick = useCallback(() => {
    setScores(baseScores.map((b) => jitter(b, 0.20)));
  }, []);

  useEffect(() => {
    const id = setInterval(tick, 1800);
    return () => clearInterval(id);
  }, [tick]);

  const replicas = [
    { x: 380, y: 30, label: 'Replica 1' },
    { x: 380, y: 110, label: 'Replica 2' },
    { x: 380, y: 190, label: 'Replica 3' },
    { x: 380, y: 270, label: 'Replica 4' },
  ];

  // The highest-scoring replica gets the most prominent routing
  const maxScore = Math.max(...scores);

  return (
    <motion.svg
      viewBox="0 0 620 380"
      className="w-full h-full"
      initial="hidden"
      animate="visible"
    >
      <defs>
        <radialGradient id="glow6" cx="40%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="620" height="380" fill="url(#glow6)" />

      {/* Same workloads, smarter routing */}
      <WorkloadPanel
        x={2} y={35}
        users={16} agents={8}
        labels={[
          { text: 'RAG Chatbot', color: '#a78bfa' },
          { text: 'Coding Assist', color: '#fbbf24' },
          { text: 'Summarization', color: '#22d3ee' },
        ]}
        userColor="#a78bfa" agentColor="#fbbf24"
        columns={3} iconSize={9}
      />
      {[0, 1, 2].map((i) => (
        <RequestParticle
          key={i}
          startX={55}
          startY={175 + i * 12}
          endX={100}
          endY={190}
          delay={i * 0.5}
          duration={0.6}
        />
      ))}

      {/* LLM-D Inference Scheduler */}
      <motion.g variants={scaleIn}>
        <rect
          x="105" y="60" width="200" height="260" rx="12"
          fill="#0f172a" stroke="#8b5cf6" strokeWidth="2"
        />
        <text x="205" y="86" textAnchor="middle" fill="#8b5cf6" fontSize="13" fontWeight="700">
          LLM-D Scheduler
        </text>
        <text x="205" y="102" textAnchor="middle" fill="#a78bfa" fontSize="9">
          Intelligent Inference Routing
        </text>

        {/* Scoring components */}
        {scorers.map((s, i) => (
          <motion.g key={s.label} variants={scaleIn}>
            <rect
              x="120" y={115 + i * 60} width="170" height="48" rx="6"
              fill="#1e293b" stroke="#334155" strokeWidth="1"
            />
            <text x="132" y={133 + i * 60} fill={s.color} fontSize="10" fontWeight="600">
              {s.label} Scorer
            </text>
            <text x="272" y={133 + i * 60} textAnchor="end" fill="#94a3b8" fontSize="9">
              weight: {s.weight}
            </text>
            {/* Animated score bar */}
            <rect x="132" y={140 + i * 60} width="146" height="10" rx="3" fill="#0f172a" stroke="#334155" />
            <motion.rect
              x="133" y={141 + i * 60} height="8" rx="2" fill={s.color}
              initial={{ width: 0 }}
              animate={{ width: [0, s.weight * 30 + 40, s.weight * 20 + 30, s.weight * 30 + 40] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.text
              x="205" y={155 + i * 60}
              textAnchor="middle"
              fill={s.color}
              fontSize="8"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
            >
              Evaluating...
            </motion.text>
          </motion.g>
        ))}
      </motion.g>

      {/* Connection lines from scheduler to replicas */}
      {replicas.map((r, i) => (
        <motion.line
          key={`line${i}`}
          x1="305" y1="190"
          x2={r.x} y2={r.y + 30}
          stroke="#8b5cf6"
          strokeWidth={scores[i] === maxScore ? 2 : 1}
          opacity={0.3 + scores[i] * 0.5}
          transition={{ duration: 0.6 }}
        />
      ))}

      {/* Smart routing particles — all replicas get traffic, weighted by score */}
      {replicas.map((r, i) => (
        <RequestParticle
          key={`p${i}`}
          startX={305}
          startY={190}
          endX={r.x}
          endY={r.y + 30}
          delay={i * 0.7}
          duration={0.6 + (1 - scores[i]) * 0.6}
          color="#8b5cf6"
        />
      ))}

      {/* Replicas with live scores */}
      {replicas.map((r, i) => {
        const score = scores[i];
        const isBest = score === maxScore;
        const cacheWidth = Math.round(score * 80);
        return (
          <motion.g key={`rep${i}`} variants={scaleIn}>
            <rect
              x={r.x} y={r.y} width="190" height="60" rx="8"
              fill="#0f172a"
              stroke={isBest ? '#a78bfa' : '#8b5cf6'}
              strokeWidth={isBest ? 2 : 1}
            />
            <text x={r.x + 10} y={r.y + 20} fill="#a78bfa" fontSize="10" fontWeight="600">
              {r.label}
            </text>
            {/* Animated score badge */}
            <rect x={r.x + 116} y={r.y + 6} width="62" height="18" rx="4" fill="#8b5cf6" opacity="0.2" />
            <motion.text
              x={r.x + 147}
              y={r.y + 19}
              textAnchor="middle"
              fill="#a78bfa"
              fontSize="9"
              key={`score-${i}-${score.toFixed(2)}`}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              Score: {score.toFixed(2)}
            </motion.text>

            {/* Cache bar */}
            <text x={r.x + 10} y={r.y + 38} fill="#64748b" fontSize="8">Prefix Cache</text>
            <rect x={r.x + 78} y={r.y + 30} width="100" height="8" rx="2" fill="#0f172a" stroke="#334155" />
            <motion.rect
              x={r.x + 79} y={r.y + 31} height="6" rx="1.5"
              fill="#22d3ee"
              animate={{ width: cacheWidth }}
              transition={{ duration: 0.6 }}
            />
            <text x={r.x + 10} y={r.y + 53} fill="#34d399" fontSize="8">
              {isBest ? '★ Best match — routing here' : '✓ Cache HIT — no prefill needed'}
            </text>
          </motion.g>
        );
      })}

      {/* Responses */}
      {replicas.map((r, i) => (
        <RequestParticle
          key={`resp${i}`}
          startX={r.x + 190}
          startY={r.y + 30}
          endX={610}
          endY={r.y + 30}
          delay={i * 0.7 + 1.0}
          duration={0.5}
          color="#34d399"
          size={3}
        />
      ))}

      {/* Summary */}
      <motion.g variants={scaleIn}>
        <rect x="105" y="345" width="465" height="28" rx="6" fill="#1e293b" stroke="#34d399" strokeWidth="1" />
        <text x="337" y="364" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="500">
          p99 TTFT: 260ms — 60% reduction | Prefix cache hit: 68% | Every user hits warm cache
        </text>
      </motion.g>
    </motion.svg>
  );
}
