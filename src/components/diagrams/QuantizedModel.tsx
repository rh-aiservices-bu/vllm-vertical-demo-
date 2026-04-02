import { motion } from 'framer-motion';
import { RequestParticle } from '../../animations/RequestParticle';
import { scaleIn } from '../../animations/variants';

export function QuantizedModel() {
  return (
    <motion.svg
      viewBox="0 0 600 340"
      className="w-full h-full"
      initial="hidden"
      animate="visible"
    >
      <defs>
        <radialGradient id="glow2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="600" height="340" fill="url(#glow2)" />

      <motion.text x="30" y="170" fill="#94a3b8" fontSize="11" fontWeight="500" variants={scaleIn}>
        Requests
      </motion.text>

      {/* Faster particles */}
      <RequestParticle startX={80} startY={140} endX={195} endY={140} delay={0} duration={1.0} />
      <RequestParticle startX={80} startY={170} endX={195} endY={170} delay={0.4} duration={1.0} />
      <RequestParticle startX={80} startY={200} endX={195} endY={200} delay={0.8} duration={1.0} />

      {/* Main vLLM box */}
      <motion.g variants={scaleIn}>
        <rect
          x="200" y="60" width="240" height="220" rx="12"
          fill="#0f172a" stroke="#22d3ee" strokeWidth="2"
        />
        <text x="320" y="90" textAnchor="middle" fill="#22d3ee" fontSize="16" fontWeight="700">
          vLLM
        </text>
        <text x="320" y="108" textAnchor="middle" fill="#94a3b8" fontSize="10">
          gpt-oss-20b
        </text>

        {/* INT8 Badge */}
        <rect x="355" y="72" width="50" height="20" rx="4" fill="#34d399" opacity="0.2" />
        <text x="380" y="86" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="600">
          INT8
        </text>

        {/* Quantized weight visualization */}
        <rect x="220" y="120" width="200" height="50" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
        <text x="232" y="138" fill="#94a3b8" fontSize="10" fontWeight="500">Quantized Weights</text>
        {/* Small compressed blocks */}
        {Array.from({ length: 16 }).map((_, i) => (
          <motion.rect
            key={i}
            x={235 + (i % 8) * 22}
            y={144 + Math.floor(i / 8) * 12}
            width="18"
            height="9"
            rx="2"
            fill="#22d3ee"
            opacity={0.3}
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 0.8, delay: i * 0.05, repeat: Infinity }}
          />
        ))}

        {/* Memory savings indicator */}
        <rect x="220" y="182" width="200" height="80" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
        <text x="232" y="200" fill="#94a3b8" fontSize="10" fontWeight="500">Memory Usage</text>

        {/* FP16 bar (faded) */}
        <rect x="232" y="210" width="176" height="10" rx="3" fill="#334155" />
        <text x="235" y="218" fill="#64748b" fontSize="8">FP16</text>
        <rect x="296" y="210" width="112" height="10" rx="3" fill="#475569" opacity="0.3" />

        {/* INT8 bar */}
        <rect x="232" y="225" width="176" height="10" rx="3" fill="#334155" />
        <motion.rect
          x="232" y="225" height="10" rx="3" fill="#34d399"
          initial={{ width: 0 }}
          animate={{ width: 88 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        <text x="235" y="233" fill="#f1f5f9" fontSize="8">INT8 (~50%)</text>

        {/* Speedometer */}
        <motion.text
          x="320" y="256"
          textAnchor="middle"
          fill="#34d399"
          fontSize="12"
          fontWeight="600"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          ⚡ 1.47x Faster Inference
        </motion.text>
      </motion.g>

      {/* Response particles (faster) */}
      <RequestParticle startX={445} startY={140} endX={560} endY={140} delay={0.5} duration={1.0} color="#34d399" />
      <RequestParticle startX={445} startY={170} endX={560} endY={170} delay={0.9} duration={1.0} color="#34d399" />
      <RequestParticle startX={445} startY={200} endX={560} endY={200} delay={1.3} duration={1.0} color="#34d399" />

      <motion.text x="540" y="230" fill="#94a3b8" fontSize="11" fontWeight="500" variants={scaleIn}>
        Responses
      </motion.text>
    </motion.svg>
  );
}
