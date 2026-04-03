import { motion } from 'framer-motion';
import { WorkloadPanel } from '../../animations/WorkloadPanel';
import { scaleIn } from '../../animations/variants';

export function VerticalLimit() {
  return (
    <motion.svg
      viewBox="0 0 600 370"
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
      <rect x="0" y="0" width="600" height="370" fill="url(#glow4)" />

      {/* Business demands outgrow single instance */}
      <WorkloadPanel
        x={2} y={25}
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
          x="200" y="30" width="250" height="290" rx="12"
          fill="#0f172a"
          stroke="#fb7185"
          strokeWidth="2"
          animate={{ strokeOpacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <text x="325" y="58" textAnchor="middle" fill="#fb7185" fontSize="15" fontWeight="700">
          vLLM (SATURATED)
        </text>
        <text x="325" y="74" textAnchor="middle" fill="#94a3b8" fontSize="10">
          gpt-oss-20b (INT8) + Speculative
        </text>

        {/* KV Cache FULL */}
        <rect x="215" y="86" width="220" height="52" rx="6" fill="#1e293b" stroke="#fb7185" strokeWidth="1" />
        <text x="228" y="104" fill="#fb7185" fontSize="10" fontWeight="600">KV Cache — NEAR FULL</text>
        <rect x="228" y="112" width="190" height="14" rx="3" fill="#1e293b" stroke="#334155" />
        <motion.rect
          x="229" y="113" height="12" rx="2"
          initial={{ width: 0 }}
          animate={{ width: 180, fill: ['#fbbf24', '#fb7185', '#fbbf24'] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <text x="380" y="124" fill="#f1f5f9" fontSize="9" fontWeight="600">95%</text>

        {/* Throughput ceiling */}
        <rect x="215" y="148" width="220" height="52" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
        <text x="228" y="166" fill="#94a3b8" fontSize="10" fontWeight="500">Throughput</text>
        <rect x="228" y="174" width="190" height="14" rx="3" fill="#1e293b" stroke="#334155" />
        <motion.rect x="229" y="175" height="12" rx="2" fill="#fbbf24" width="190" />
        {/* Ceiling line */}
        <motion.line
          x1="418" y1="170" x2="418" y2="192"
          stroke="#fb7185" strokeWidth="2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <text x="325" y="186" textAnchor="middle" fill="#f1f5f9" fontSize="8">24 users/s (CEILING)</text>

        {/* Tail latency explosion */}
        <rect x="215" y="212" width="220" height="96" rx="6" fill="#1e293b" stroke="#fb7185" strokeWidth="1" />
        <text x="325" y="232" textAnchor="middle" fill="#fb7185" fontSize="10" fontWeight="600">Tail Latency Explosion</text>
        <motion.text
          x="325" y="262"
          textAnchor="middle"
          fill="#fb7185"
          fontSize="22"
          fontWeight="700"
          animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          p99 TTFT: 1.8s
        </motion.text>
        <text x="325" y="296" textAnchor="middle" fill="#fbbf24" fontSize="10">
          p95: 850ms — Unacceptable for production
        </text>
      </motion.g>

      {/* Slow trickling responses */}
      <motion.circle
        cx={455} cy={170} r={4} fill="#34d399" opacity={0.4}
        animate={{ cx: [455, 570], opacity: [0.4, 0.2] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.text x="490" y="200" fill="#94a3b8" fontSize="10" variants={scaleIn}>
        Slow responses...
      </motion.text>

      {/* Warning */}
      <motion.text
        x="520" y="340"
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
