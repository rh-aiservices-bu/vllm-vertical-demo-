import { motion } from 'framer-motion';

function UserIcon({ x, y, size = 14, color = '#94a3b8', delay = 0 }: {
  x: number; y: number; size?: number; color?: string; delay?: number;
}) {
  const s = size;
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay, type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Head */}
      <circle cx={x + s / 2} cy={y + s * 0.28} r={s * 0.22} fill={color} />
      {/* Body */}
      <path
        d={`M${x + s * 0.15},${y + s * 0.9} Q${x + s * 0.15},${y + s * 0.5} ${x + s / 2},${y + s * 0.5} Q${x + s * 0.85},${y + s * 0.5} ${x + s * 0.85},${y + s * 0.9}`}
        fill={color}
      />
    </motion.g>
  );
}

interface Props {
  x: number;
  y: number;
  count: number;
  color?: string;
  iconSize?: number;
  columns?: number;
  label?: string;
}

export function UserGroup({
  x,
  y,
  count,
  color = '#94a3b8',
  iconSize = 14,
  columns = 3,
  label,
}: Props) {
  const gap = iconSize + 2;
  const groupWidth = columns * gap;

  return (
    <g>
      {label && (
        <text
          x={x + groupWidth / 2}
          y={y - 6}
          textAnchor="middle"
          fill={color}
          fontSize="10"
          fontWeight="600"
        >
          {label}
        </text>
      )}
      {Array.from({ length: count }).map((_, i) => {
        const col = i % columns;
        const row = Math.floor(i / columns);
        return (
          <UserIcon
            key={i}
            x={x + col * gap}
            y={y + row * gap}
            size={iconSize}
            color={color}
            delay={i * 0.04}
          />
        );
      })}
    </g>
  );
}
