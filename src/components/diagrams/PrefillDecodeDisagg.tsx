import { motion } from 'framer-motion';
import { RequestParticle } from '../../animations/RequestParticle';
import { WorkloadPanel } from '../../animations/WorkloadPanel';
import { scaleIn } from '../../animations/variants';

export function PrefillDecodeDisagg() {
  return (
    <motion.svg
      viewBox="0 0 700 430"
      className="w-full h-full"
      initial="hidden"
      animate="visible"
    >
      <defs>
        <radialGradient id="glow7" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="transferGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="700" height="430" fill="url(#glow7)" />

      {/* Massive heterogeneous workloads */}
      <WorkloadPanel
        x={2} y={15}
        users={20} agents={16}
        labels={[
          { text: 'RAG Chatbot', color: '#a78bfa' },
          { text: 'Coding Assist', color: '#fbbf24' },
          { text: 'Summarization', color: '#22d3ee' },
          { text: 'Agentic Workflows', color: '#34d399' },
        ]}
        userColor="#a78bfa" agentColor="#fbbf24"
        columns={4} iconSize={8}
      />
      {[0, 1, 2, 3].map(i => (
        <RequestParticle key={i} startX={50} startY={185 + i * 10} endX={90} endY={200} delay={i * 0.3} duration={0.5} />
      ))}

      {/* llm-d Scheduler (center-left) */}
      <motion.g variants={scaleIn}>
        <rect x="95" y="120" width="100" height="160" rx="10" fill="#0f172a" stroke="#8b5cf6" strokeWidth="2" />
        <text x="145" y="148" textAnchor="middle" fill="#8b5cf6" fontSize="11" fontWeight="700">llm-d</text>
        <text x="145" y="163" textAnchor="middle" fill="#a78bfa" fontSize="8">Scheduler</text>
        <motion.text
          x="145" y="185"
          textAnchor="middle" fill="#94a3b8" fontSize="8"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Phase-aware
        </motion.text>
        <motion.text
          x="145" y="198"
          textAnchor="middle" fill="#94a3b8" fontSize="8"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, delay: 0.5, repeat: Infinity }}
        >
          routing
        </motion.text>

        {/* Route indicators */}
        <rect x="110" y="210" width="70" height="22" rx="4" fill="#22d3ee" opacity="0.1" />
        <text x="145" y="225" textAnchor="middle" fill="#22d3ee" fontSize="8">→ Prefill</text>
        <rect x="110" y="238" width="70" height="22" rx="4" fill="#a78bfa" opacity="0.1" />
        <text x="145" y="253" textAnchor="middle" fill="#a78bfa" fontSize="8">→ Decode</text>
      </motion.g>

      {/* Phase 1 Label */}
      <motion.text x="265" y="32" fill="#22d3ee" fontSize="12" fontWeight="600" variants={scaleIn}>
        Phase 1: Prefill
      </motion.text>

      {/* Prefill Nodes */}
      {[0, 1].map(i => (
        <motion.g key={`pf${i}`} variants={scaleIn}>
          <rect
            x="240" y={48 + i * 95} width="160" height="78" rx="8"
            fill="#0f172a" stroke="#22d3ee" strokeWidth="1.5"
          />
          <text x="255" y={70 + i * 95} fill="#22d3ee" fontSize="10" fontWeight="600">
            Prefill Node {i + 1}
          </text>
          <text x="255" y={84 + i * 95} fill="#64748b" fontSize="8">
            Optimized for throughput
          </text>
          {/* GPU utilization bar */}
          <text x="255" y={100 + i * 95} fill="#94a3b8" fontSize="8">GPU</text>
          <rect x="280" y={93 + i * 95} width="105" height="8" rx="2" fill="#0f172a" stroke="#334155" />
          <motion.rect
            x="281" y={94 + i * 95} height="6" rx="1.5" fill="#22d3ee"
            initial={{ width: 0 }}
            animate={{ width: [40, 90, 40] }}
            transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }}
          />
          <text x="255" y={115 + i * 95} fill="#34d399" fontSize="8">
            High batch size, max FLOPS
          </text>
        </motion.g>
      ))}

      {/* Request particles to prefill nodes */}
      {[0, 1].map(i => (
        <RequestParticle
          key={`toPf${i}`}
          startX={195} startY={200}
          endX={240} endY={87 + i * 95}
          delay={i * 0.6} duration={0.6} color="#22d3ee"
        />
      ))}

      {/* KV Cache Transfer arrows (prefill → decode) */}
      <motion.text x="415" y="195" fill="#94a3b8" fontSize="8" fontWeight="500">KV Cache</motion.text>
      <motion.text x="415" y="207" fill="#94a3b8" fontSize="8" fontWeight="500">Transfer</motion.text>
      {[0, 1].map(i => (
        <motion.g key={`transfer${i}`}>
          <motion.line
            x1="400" y1={87 + i * 95}
            x2="465" y2={i === 0 ? 110 : 230}
            stroke="url(#transferGrad)"
            strokeWidth="2"
            strokeDasharray="6 3"
            animate={{ strokeDashoffset: [18, 0] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          {/* Transfer particle */}
          <motion.circle
            r={4}
            fill="#a78bfa"
            animate={{
              cx: [400, 465],
              cy: [87 + i * 95, i === 0 ? 110 : 230],
              opacity: [0, 0.8, 0],
            }}
            transition={{ duration: 1.2, delay: i * 0.5, repeat: Infinity }}
          />
        </motion.g>
      ))}

      {/* Phase 2 Label */}
      <motion.text x="480" y="32" fill="#a78bfa" fontSize="12" fontWeight="600" variants={scaleIn}>
        Phase 2: Decode
      </motion.text>

      {/* Decode Nodes */}
      {[0, 1, 2, 3].map(i => (
        <motion.g key={`dec${i}`} variants={scaleIn}>
          <rect
            x="470" y={44 + i * 72} width="160" height="58" rx="8"
            fill="#0f172a" stroke="#a78bfa" strokeWidth="1.5"
          />
          <text x="485" y={64 + i * 72} fill="#a78bfa" fontSize="10" fontWeight="600">
            Decode Node {i + 1}
          </text>
          <text x="485" y={78 + i * 72} fill="#64748b" fontSize="8">
            Low-latency generation
          </text>
          {/* Token generation indicator */}
          <motion.g>
            {[0, 1, 2, 3, 4].map(j => (
              <motion.rect
                key={j}
                x={488 + j * 25}
                y={84 + i * 72}
                width="20"
                height="10"
                rx="2"
                fill="#a78bfa"
                opacity={0.15}
                animate={{ opacity: [0.1, 0.4, 0.1] }}
                transition={{ duration: 0.4, delay: i * 0.1 + j * 0.08, repeat: Infinity }}
              />
            ))}
          </motion.g>
        </motion.g>
      ))}

      {/* Response particles from decode nodes */}
      {[0, 1, 2, 3].map(i => (
        <RequestParticle
          key={`resp${i}`}
          startX={630} startY={73 + i * 72}
          endX={690} endY={73 + i * 72}
          delay={i * 0.4 + 1.5} duration={0.4} color="#34d399" size={3}
        />
      ))}

      {/* Multi-node label */}
      <motion.g variants={scaleIn}>
        <rect x="240" y="250" width="160" height="36" rx="6" fill="#1e293b" stroke="#22d3ee" strokeWidth="1" opacity="0.8" />
        <text x="320" y="265" textAnchor="middle" fill="#22d3ee" fontSize="9" fontWeight="500">Node Pool A (Prefill)</text>
        <text x="320" y="278" textAnchor="middle" fill="#64748b" fontSize="8">High-throughput GPUs</text>
      </motion.g>
      <motion.g variants={scaleIn}>
        <rect x="470" y="335" width="160" height="36" rx="6" fill="#1e293b" stroke="#a78bfa" strokeWidth="1" opacity="0.8" />
        <text x="550" y="350" textAnchor="middle" fill="#a78bfa" fontSize="9" fontWeight="500">Node Pool B (Decode)</text>
        <text x="550" y="363" textAnchor="middle" fill="#64748b" fontSize="8">Low-latency GPUs</text>
      </motion.g>

      {/* Summary */}
      <motion.g variants={scaleIn}>
        <rect x="65" y="392" width="570" height="26" rx="6" fill="#1e293b" stroke="#34d399" strokeWidth="1" />
        <text x="350" y="410" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="500">
          200 users/s | TTFT p99: 210ms | Independent scaling per phase | Production-ready workloads
        </text>
      </motion.g>
    </motion.svg>
  );
}
