import { motion } from 'framer-motion';
import { RequestParticle } from '../../animations/RequestParticle';
import { WorkloadPanel } from '../../animations/WorkloadPanel';
import { scaleIn } from '../../animations/variants';

export function SpeculativeDecoding() {
  return (
    <motion.svg
      viewBox="0 0 600 340"
      className="w-full h-full"
      initial="hidden"
      animate="visible"
    >
      <defs>
        <radialGradient id="glow3" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="600" height="340" fill="url(#glow3)" />

      {/* Workload: more users on RAG */}
      <WorkloadPanel
        x={2} y={80}
        users={12} agents={0}
        labels={[{ text: 'RAG Chatbot', color: '#22d3ee' }]}
        columns={3} iconSize={10}
      />

      <RequestParticle startX={60} startY={170} endX={135} endY={170} delay={0} duration={1.0} />

      {/* Draft Model */}
      <motion.g variants={scaleIn}>
        <rect
          x="140" y="100" width="120" height="140" rx="10"
          fill="#0f172a" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4 2"
        />
        <text x="200" y="128" textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="600">
          Draft Model
        </text>
        <text x="200" y="144" textAnchor="middle" fill="#94a3b8" fontSize="9">
          (Lightweight)
        </text>

        {/* Speculative tokens */}
        <text x="155" y="168" fill="#94a3b8" fontSize="9">Candidates:</text>
        {['T1', 'T2', 'T3', 'T4'].map((t, i) => (
          <motion.g key={t}>
            <motion.rect
              x={155 + i * 24}
              y="174"
              width="20"
              height="18"
              rx="3"
              fill="#fbbf24"
              opacity={0.2}
              animate={{ opacity: [0.1, 0.5, 0.1] }}
              transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
            />
            <text x={165 + i * 24} y="187" textAnchor="middle" fill="#fbbf24" fontSize="9">
              {t}
            </text>
          </motion.g>
        ))}

        {/* Fast generation indicator */}
        <motion.text
          x="200" y="216"
          textAnchor="middle"
          fill="#fbbf24"
          fontSize="9"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          ⚡ Fast Generation
        </motion.text>
      </motion.g>

      {/* Arrow from draft to main */}
      <motion.line
        x1="262" y1="170" x2="298" y2="170"
        stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4 2"
        animate={{ strokeDashoffset: [8, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
      />
      <polygon points="296,165 306,170 296,175" fill="#fbbf24" />

      {/* Main Model */}
      <motion.g variants={scaleIn}>
        <rect
          x="310" y="60" width="180" height="220" rx="12"
          fill="#0f172a" stroke="#22d3ee" strokeWidth="2"
        />
        <text x="400" y="90" textAnchor="middle" fill="#22d3ee" fontSize="14" fontWeight="700">
          Main Model
        </text>
        <text x="400" y="106" textAnchor="middle" fill="#94a3b8" fontSize="9">
          gpt-oss-20b (INT8)
        </text>

        {/* Verification visualization */}
        <rect x="325" y="118" width="150" height="50" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
        <text x="338" y="134" fill="#94a3b8" fontSize="9" fontWeight="500">Parallel Verify</text>
        {['T1', 'T2', 'T3', 'T4'].map((t, i) => (
          <motion.g key={`v${t}`}>
            <motion.rect
              x={335 + i * 33}
              y="140"
              width="26"
              height="18"
              rx="3"
              animate={{
                fill: i < 3 ? ['#1e293b', '#34d399', '#34d399'] : ['#1e293b', '#fb7185', '#1e293b'],
              }}
              transition={{ duration: 2, delay: 0.8 + i * 0.2, repeat: Infinity }}
            />
            <text x={348 + i * 33} y="153" textAnchor="middle" fill="#f1f5f9" fontSize="8">
              {t}
            </text>
          </motion.g>
        ))}

        {/* Accept/reject labels */}
        <motion.text
          x="400" y="182" textAnchor="middle" fill="#34d399" fontSize="9"
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 2.5, delay: 1.5, repeat: Infinity }}
        >
          ✓ 3/4 accepted — 3x speedup!
        </motion.text>

        {/* KV Cache */}
        <rect x="325" y="194" width="150" height="35" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
        <text x="338" y="210" fill="#94a3b8" fontSize="9" fontWeight="500">KV Cache</text>
        <rect x="338" y="215" width="124" height="8" rx="2" fill="#1e293b" stroke="#334155" />
        <motion.rect
          x="339" y="216" height="6" rx="1.5" fill="#22d3ee"
          initial={{ width: 0 }}
          animate={{ width: 60 }}
          transition={{ duration: 1.2 }}
        />

        {/* ITL indicator */}
        <motion.text
          x="400" y="256" textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="600"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          ITL: 11ms (↓61% from baseline)
        </motion.text>
      </motion.g>

      {/* Response */}
      <RequestParticle startX={492} startY={170} endX={570} endY={170} delay={1.0} duration={0.8} color="#34d399" />
      <motion.text x="545" y="200" fill="#94a3b8" fontSize="11" fontWeight="500" variants={scaleIn}>
        Response
      </motion.text>
    </motion.svg>
  );
}
