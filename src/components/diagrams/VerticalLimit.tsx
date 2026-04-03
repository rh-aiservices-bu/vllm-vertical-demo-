import { motion } from 'framer-motion';
import { WorkloadPanel } from '../../animations/WorkloadPanel';
import { scaleIn } from '../../animations/variants';

export function VerticalLimit() {
  return (
    <motion.svg
      viewBox="0 0 600 340"
      className="w-full h-full"
      initial="hidden"
      animate="visible"
    >
      <defs>
        <radialGradient id="glow4" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fb7185" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#fb7185" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="600" height="340" fill="url(#glow4)" />

      {/* Business demands outgrow single instance */}
      <WorkloadPanel
        x={2} y={30}
        users={12} agents={6}
        labels={[
          { text: 'RAG Chatbot', color: '#fb7185' },
          { text: 'Coding Assist', color: '#fbbf24' },
        ]}
        userColor="#fb7185" agentColor="#fbbf24"
        columns={4} iconSize={10}
      />
      <motion.text
        x="38" y="218"
        textAnchor="middle"
        fill="#fb7185"
        fontSize="10"
        fontWeight="500"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        Waiting...
      </motion.text>

      {/* Slow flowing users */}
      {[0, 1].map((i) => (
        <motion.circle
          key={`q${i}`}
          cx={130}
          cy={150 + i * 30}
          r={4}
          fill="#fb7185"
          animate={{ cx: [130, 195], opacity: [0.6, 0.3] }}
          transition={{ duration: 3, delay: i * 1.5, repeat: Infinity }}
        />
      ))}

      {/* Main vLLM box with red pulsing border */}
      <motion.g variants={scaleIn}>
        <motion.rect
          x="200" y="40" width="240" height="260" rx="12"
          fill="#0f172a"
          stroke="#fb7185"
          strokeWidth="2"
          animate={{ strokeOpacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <text x="320" y="70" textAnchor="middle" fill="#fb7185" fontSize="16" fontWeight="700">
          vLLM (SATURATED)
        </text>
        <text x="320" y="86" textAnchor="middle" fill="#94a3b8" fontSize="10">
          gpt-oss-20b (INT8) + Speculative
        </text>

        {/* KV Cache FULL */}
        <rect x="218" y="100" width="204" height="50" rx="6" fill="#1e293b" stroke="#fb7185" strokeWidth="1" />
        <text x="232" y="118" fill="#fb7185" fontSize="10" fontWeight="600">KV Cache — NEAR FULL</text>
        <rect x="232" y="128" width="176" height="14" rx="3" fill="#1e293b" stroke="#334155" />
        <motion.rect
          x="233" y="129" height="12" rx="2"
          initial={{ width: 0 }}
          animate={{ width: 166, fill: ['#fbbf24', '#fb7185', '#fbbf24'] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <text x="370" y="140" fill="#f1f5f9" fontSize="9" fontWeight="600">95%</text>

        {/* Throughput ceiling */}
        <rect x="218" y="162" width="204" height="50" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
        <text x="232" y="180" fill="#94a3b8" fontSize="10" fontWeight="500">Throughput</text>
        <rect x="232" y="188" width="176" height="14" rx="3" fill="#1e293b" stroke="#334155" />
        <motion.rect x="233" y="189" height="12" rx="2" fill="#fbbf24" width="176" />
        {/* Ceiling line */}
        <motion.line
          x1="408" y1="184" x2="408" y2="206"
          stroke="#fb7185" strokeWidth="2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <text x="320" y="200" textAnchor="middle" fill="#f1f5f9" fontSize="8">24 users/s (CEILING)</text>

        {/* Tail latency explosion */}
        <rect x="218" y="224" width="204" height="62" rx="6" fill="#1e293b" stroke="#fb7185" strokeWidth="1" />
        <text x="232" y="242" fill="#fb7185" fontSize="10" fontWeight="600">Tail Latency Explosion</text>
        <motion.text
          x="320" y="260"
          textAnchor="middle"
          fill="#fb7185"
          fontSize="20"
          fontWeight="700"
          animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          p99 TTFT: 1.8s
        </motion.text>
        <text x="320" y="278" textAnchor="middle" fill="#fbbf24" fontSize="11">
          p95: 850ms — Unacceptable for production
        </text>
      </motion.g>

      {/* Slow trickling responses */}
      <motion.circle
        cx={445} cy={170} r={4} fill="#34d399" opacity={0.4}
        animate={{ cx: [445, 560], opacity: [0.4, 0.2] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.text x="480" y="200" fill="#94a3b8" fontSize="10" variants={scaleIn}>
        Slow responses...
      </motion.text>

      {/* Warning */}
      <motion.text
        x="520" y="310"
        textAnchor="middle"
        fill="#fb7185"
        fontSize="12"
        fontWeight="600"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        ⚠ Scale out needed
      </motion.text>
    </motion.svg>
  );
}
