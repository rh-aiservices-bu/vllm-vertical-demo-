import { motion } from 'framer-motion';
import { RequestParticle } from '../../animations/RequestParticle';
import { UserGroup } from '../../animations/UserGroup';
import { scaleIn } from '../../animations/variants';

export function IntelligentScheduler() {
  const scorers = [
    { label: 'Prefix Cache', weight: 3, color: '#22d3ee' },
    { label: 'Queue Depth', weight: 2, color: '#fbbf24' },
    { label: 'Active Reqs', weight: 2, color: '#a78bfa' },
  ];

  const replicas = [
    { x: 380, y: 30, label: 'Replica 1', score: 0.92, warm: true },
    { x: 380, y: 110, label: 'Replica 2', score: 0.45, warm: false },
    { x: 380, y: 190, label: 'Replica 3', score: 0.88, warm: true },
    { x: 380, y: 270, label: 'Replica 4', score: 0.78, warm: true },
  ];

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

      {/* User icons — same user count, smarter routing */}
      <UserGroup x={2} y={55} count={30} columns={3} label="Users" color="#a78bfa" iconSize={10} />
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
          stroke={r.warm ? '#8b5cf6' : '#334155'}
          strokeWidth={r.warm ? 1.5 : 0.5}
          strokeDasharray={r.warm ? '0' : '4 2'}
          opacity={r.warm ? 0.6 : 0.3}
        />
      ))}

      {/* Smart routing particles — go to warm replicas */}
      {replicas.filter(r => r.warm).map((r, i) => (
        <RequestParticle
          key={`p${i}`}
          startX={305}
          startY={190}
          endX={r.x}
          endY={r.y + 30}
          delay={i * 0.7}
          duration={0.8}
          color="#8b5cf6"
        />
      ))}

      {/* Replicas */}
      {replicas.map((r, i) => (
        <motion.g key={`rep${i}`} variants={scaleIn}>
          <rect
            x={r.x} y={r.y} width="190" height="60" rx="8"
            fill="#0f172a"
            stroke={r.warm ? '#8b5cf6' : '#334155'}
            strokeWidth={r.warm ? 1.5 : 1}
          />
          <text x={r.x + 10} y={r.y + 20} fill={r.warm ? '#a78bfa' : '#64748b'} fontSize="10" fontWeight="600">
            {r.label}
          </text>
          {/* Score badge */}
          <rect x={r.x + 120} y={r.y + 6} width="58" height="18" rx="4" fill={r.warm ? '#8b5cf6' : '#334155'} opacity="0.2" />
          <text x={r.x + 149} y={r.y + 19} textAnchor="middle" fill={r.warm ? '#a78bfa' : '#64748b'} fontSize="9">
            Score: {r.score}
          </text>

          {/* Cache bar */}
          <text x={r.x + 10} y={r.y + 38} fill="#64748b" fontSize="8">Prefix Cache</text>
          <rect x={r.x + 78} y={r.y + 30} width="100" height="8" rx="2" fill="#0f172a" stroke="#334155" />
          <motion.rect
            x={r.x + 79} y={r.y + 31} height="6" rx="1.5"
            fill={r.warm ? '#22d3ee' : '#334155'}
            initial={{ width: 0 }}
            animate={{ width: r.warm ? 70 : 10 }}
            transition={{ duration: 1.2, delay: i * 0.15 }}
          />
          <text x={r.x + 10} y={r.y + 53} fill={r.warm ? '#34d399' : '#fb7185'} fontSize="8">
            {r.warm ? '✓ Cache HIT — no prefill needed' : '○ Low affinity'}
          </text>
        </motion.g>
      ))}

      {/* Responses */}
      {replicas.filter(r => r.warm).map((r, i) => (
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
