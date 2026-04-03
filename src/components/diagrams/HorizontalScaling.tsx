import { motion } from 'framer-motion';
import { RequestParticle } from '../../animations/RequestParticle';
import { WorkloadPanel } from '../../animations/WorkloadPanel';
import { scaleIn } from '../../animations/variants';

export function HorizontalScaling() {
  const replicas = [
    { x: 340, y: 50, label: 'Replica 1', cacheHit: true },
    { x: 340, y: 130, label: 'Replica 2', cacheHit: false },
    { x: 340, y: 210, label: 'Replica 3', cacheHit: true },
    { x: 340, y: 290, label: 'Replica 4', cacheHit: false },
  ];

  return (
    <motion.svg
      viewBox="0 0 600 380"
      className="w-full h-full"
      initial="hidden"
      animate="visible"
    >
      <defs>
        <radialGradient id="glow5" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="600" height="380" fill="url(#glow5)" />

      {/* Multiple LOB workloads at scale */}
      <WorkloadPanel
        x={2} y={40}
        users={16} agents={8}
        labels={[
          { text: 'RAG Chatbot', color: '#a78bfa' },
          { text: 'Coding Assist', color: '#fbbf24' },
          { text: 'Summarization', color: '#22d3ee' },
        ]}
        userColor="#a78bfa" agentColor="#fbbf24"
        columns={4} iconSize={9}
      />
      {[0, 1, 2, 3].map((i) => (
        <RequestParticle
          key={i}
          startX={70}
          startY={175 + i * 15}
          endX={140}
          endY={190}
          delay={i * 0.4}
          duration={0.8}
        />
      ))}

      {/* Load Balancer */}
      <motion.g variants={scaleIn}>
        <rect
          x="145" y="145" width="120" height="90" rx="10"
          fill="#0f172a" stroke="#94a3b8" strokeWidth="2"
        />
        <text x="205" y="175" textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="600">
          Load Balancer
        </text>
        <text x="205" y="192" textAnchor="middle" fill="#64748b" fontSize="9">
          Round-Robin
        </text>
        <motion.text
          x="205" y="225"
          textAnchor="middle"
          fill="#fbbf24"
          fontSize="9"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ⚠ Cache-unaware
        </motion.text>
      </motion.g>

      {/* Connection lines from LB to replicas */}
      {replicas.map((r, i) => (
        <motion.line
          key={`line${i}`}
          x1="265" y1="190"
          x2={r.x} y2={r.y + 30}
          stroke="#475569" strokeWidth="1" strokeDasharray="4 2"
          animate={{ strokeDashoffset: [8, 0] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      ))}

      {/* Request particles from LB to replicas (round-robin) */}
      {replicas.map((r, i) => (
        <RequestParticle
          key={`p${i}`}
          startX={265}
          startY={190}
          endX={r.x}
          endY={r.y + 30}
          delay={i * 0.8}
          duration={1}
          color={r.cacheHit ? '#22d3ee' : '#fb7185'}
        />
      ))}

      {/* Replicas */}
      {replicas.map((r, i) => (
        <motion.g key={`rep${i}`} variants={scaleIn}>
          <rect
            x={r.x} y={r.y} width="200" height="60" rx="8"
            fill="#0f172a" stroke={r.cacheHit ? '#22d3ee' : '#475569'} strokeWidth="1.5"
          />
          <text x={r.x + 12} y={r.y + 22} fill={r.cacheHit ? '#22d3ee' : '#94a3b8'} fontSize="11" fontWeight="600">
            {r.label}
          </text>
          <text x={r.x + 12} y={r.y + 38} fill="#64748b" fontSize="9">
            gpt-oss-20b (INT8)
          </text>

          {/* KV Cache indicator */}
          <rect x={r.x + 120} y={r.y + 10} width="68" height="40" rx="4" fill="#1e293b" stroke="#334155" />
          <text x={r.x + 124} y={r.y + 24} fill="#94a3b8" fontSize="8">KV Cache</text>
          <rect x={r.x + 124} y={r.y + 30} width="60" height="8" rx="2" fill="#1e293b" stroke="#334155" />
          <motion.rect
            x={r.x + 125}
            y={r.y + 31}
            height="6"
            rx="1.5"
            fill={r.cacheHit ? '#22d3ee' : '#475569'}
            initial={{ width: 0 }}
            animate={{ width: r.cacheHit ? 40 : 12 }}
            transition={{ duration: 1, delay: i * 0.2 }}
          />
          {!r.cacheHit && (
            <motion.text
              x={r.x + 154}
              y={r.y + 54}
              textAnchor="middle"
              fill="#fb7185"
              fontSize="8"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              COLD ❄
            </motion.text>
          )}
          {r.cacheHit && (
            <text x={r.x + 154} y={r.y + 54} textAnchor="middle" fill="#22d3ee" fontSize="8">
              WARM ✓
            </text>
          )}
        </motion.g>
      ))}

      {/* Response flows */}
      {replicas.map((r, i) => (
        <RequestParticle
          key={`resp${i}`}
          startX={r.x + 200}
          startY={r.y + 30}
          endX={590}
          endY={r.y + 30}
          delay={i * 0.8 + 1.2}
          duration={0.6}
          color="#34d399"
          size={3}
        />
      ))}

      {/* Summary callout */}
      <motion.g variants={scaleIn}>
        <rect x="145" y="340" width="310" height="30" rx="6" fill="#1e293b" stroke="#fbbf24" strokeWidth="1" />
        <text x="300" y="360" textAnchor="middle" fill="#fbbf24" fontSize="10">
          p99 TTFT: 650ms — Some users hit cold caches, causing tail latency spikes
        </text>
      </motion.g>
    </motion.svg>
  );
}
