import { motion } from 'framer-motion';

function UserIcon({ x, y, size = 10, color = '#94a3b8', delay = 0 }: {
  x: number; y: number; size?: number; color?: string; delay?: number;
}) {
  const s = size;
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay, type: 'spring' as const, stiffness: 300, damping: 20 }}
    >
      <circle cx={x + s / 2} cy={y + s * 0.28} r={s * 0.22} fill={color} />
      <path
        d={`M${x + s * 0.15},${y + s * 0.9} Q${x + s * 0.15},${y + s * 0.5} ${x + s / 2},${y + s * 0.5} Q${x + s * 0.85},${y + s * 0.5} ${x + s * 0.85},${y + s * 0.9}`}
        fill={color}
      />
    </motion.g>
  );
}

function AgentIcon({ x, y, size = 10, color = '#fbbf24', delay = 0 }: {
  x: number; y: number; size?: number; color?: string; delay?: number;
}) {
  const s = size;
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay, type: 'spring' as const, stiffness: 300, damping: 20 }}
    >
      {/* Robot head */}
      <rect x={x + s * 0.15} y={y + s * 0.15} width={s * 0.7} height={s * 0.5} rx={s * 0.1} fill={color} />
      {/* Eyes */}
      <circle cx={x + s * 0.35} cy={y + s * 0.38} r={s * 0.07} fill="#0f172a" />
      <circle cx={x + s * 0.65} cy={y + s * 0.38} r={s * 0.07} fill="#0f172a" />
      {/* Antenna */}
      <line x1={x + s / 2} y1={y + s * 0.15} x2={x + s / 2} y2={y + s * 0.02} stroke={color} strokeWidth={s * 0.06} />
      <circle cx={x + s / 2} cy={y + s * 0.01} r={s * 0.05} fill={color} />
      {/* Body */}
      <rect x={x + s * 0.2} y={y + s * 0.68} width={s * 0.6} height={s * 0.28} rx={s * 0.06} fill={color} />
    </motion.g>
  );
}

interface WorkloadLabel {
  text: string;
  color: string;
}

interface Props {
  x: number;
  y: number;
  users: number;
  agents?: number;
  labels: WorkloadLabel[];
  userColor?: string;
  agentColor?: string;
  iconSize?: number;
  columns?: number;
  maxWidth?: number;
}

export function WorkloadPanel({
  x,
  y,
  users,
  agents = 0,
  labels,
  userColor = '#94a3b8',
  agentColor = '#fbbf24',
  iconSize = 10,
  columns = 3,
  maxWidth = 110,
}: Props) {
  const gap = iconSize + 2;

  const labelRowHeight = 16;
  const labelGap = 3;
  const labelHeight = labels.length * (labelRowHeight + labelGap);

  const iconStartY = y + labelHeight + 2;
  const totalIcons = users + agents;
  const icons: Array<{ type: 'user' | 'agent'; col: number; row: number }> = [];
  for (let i = 0; i < totalIcons; i++) {
    icons.push({
      type: i < users ? 'user' : 'agent',
      col: i % columns,
      row: Math.floor(i / columns),
    });
  }

  const iconGridWidth = columns * gap + 4;
  const labelWidth = Math.max(maxWidth, iconGridWidth);
  const panelWidth = labelWidth;

  return (
    <g>
      {/* Labels */}
      {labels.map((label, i) => (
        <motion.g
          key={label.text}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
        >
          <rect
            x={x}
            y={y + i * (labelRowHeight + labelGap)}
            width={panelWidth}
            height={labelRowHeight}
            rx={4}
            fill={label.color}
            opacity={0.15}
          />
          <text
            x={x + panelWidth / 2}
            y={y + i * (labelRowHeight + labelGap) + 11.5}
            textAnchor="middle"
            fill={label.color}
            fontSize="9"
            fontWeight="600"
          >
            {label.text}
          </text>
        </motion.g>
      ))}

      {/* Icon grid */}
      {icons.map((icon, i) => {
        const ix = x + (panelWidth - columns * gap) / 2 + icon.col * gap;
        const iy = iconStartY + icon.row * gap;
        return icon.type === 'user' ? (
          <UserIcon key={`u${i}`} x={ix} y={iy} size={iconSize} color={userColor} delay={i * 0.02} />
        ) : (
          <AgentIcon key={`a${i}`} x={ix} y={iy} size={iconSize} color={agentColor} delay={i * 0.02} />
        );
      })}
    </g>
  );
}
