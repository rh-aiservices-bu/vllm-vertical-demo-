import { motion } from 'framer-motion';
import { RequestParticle } from '../../animations/RequestParticle';
import { UserGroup } from '../../animations/UserGroup';
import { scaleIn } from '../../animations/variants';

export function SingleInstance() {
  return (
    <motion.svg
      viewBox="0 0 600 340"
      className="w-full h-full"
      initial="hidden"
      animate="visible"
    >
      {/* Background glow */}
      <defs>
        <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
        </radialGradient>
        <filter id="shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#22d3ee" floodOpacity="0.2" />
        </filter>
      </defs>

      <rect x="0" y="0" width="600" height="340" fill="url(#glow1)" />

      {/* User icons */}
      <UserGroup x={8} y={90} count={6} columns={3} label="Users" iconSize={12} />

      {/* Particles from users to vLLM */}
      <RequestParticle startX={80} startY={140} endX={195} endY={140} delay={0} duration={1.5} />
      <RequestParticle startX={80} startY={170} endX={195} endY={170} delay={0.6} duration={1.5} />
      <RequestParticle startX={80} startY={200} endX={195} endY={200} delay={1.2} duration={1.5} />

      {/* Main vLLM box */}
      <motion.g variants={scaleIn}>
        <rect
          x="200" y="60" width="240" height="220" rx="12"
          fill="#0f172a" stroke="#22d3ee" strokeWidth="2" filter="url(#shadow)"
        />
        <text x="320" y="90" textAnchor="middle" fill="#22d3ee" fontSize="16" fontWeight="700">
          vLLM
        </text>
        <text x="320" y="108" textAnchor="middle" fill="#94a3b8" fontSize="10">
          gpt-oss-20b
        </text>

        {/* KV Cache section */}
        <rect x="220" y="120" width="200" height="50" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
        <text x="232" y="138" fill="#94a3b8" fontSize="10" fontWeight="500">KV Cache</text>
        {/* Cache fill bar */}
        <rect x="232" y="148" width="176" height="12" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="1" />
        <motion.rect
          x="233" y="149" height="10" rx="2" fill="#22d3ee"
          initial={{ width: 0 }}
          animate={{ width: 114 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        <text x="365" y="158" fill="#94a3b8" fontSize="8">65%</text>

        {/* Continuous Batching section */}
        <rect x="220" y="182" width="200" height="80" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
        <text x="232" y="200" fill="#94a3b8" fontSize="10" fontWeight="500">Continuous Batching</text>

        {/* Batch slots */}
        {[0, 1, 2, 3].map((i) => (
          <motion.rect
            key={i}
            x={232 + i * 45}
            y="210"
            width="38"
            height="38"
            rx="4"
            fill="#22d3ee"
            opacity={0.2}
            animate={{ opacity: [0.15, 0.5, 0.15] }}
            transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }}
          />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <text key={`t${i}`} x={251 + i * 45} y="233" textAnchor="middle" fill="#22d3ee" fontSize="9">
            User {i + 1}
          </text>
        ))}
      </motion.g>

      {/* Response particles */}
      <RequestParticle startX={445} startY={140} endX={560} endY={140} delay={0.8} duration={1.5} color="#34d399" />
      <RequestParticle startX={445} startY={170} endX={560} endY={170} delay={1.4} duration={1.5} color="#34d399" />
      <RequestParticle startX={445} startY={200} endX={560} endY={200} delay={2.0} duration={1.5} color="#34d399" />

      {/* Responses label */}
      <motion.text x="540" y="230" fill="#94a3b8" fontSize="11" fontWeight="500" variants={scaleIn}>
        Responses
      </motion.text>
    </motion.svg>
  );
}
