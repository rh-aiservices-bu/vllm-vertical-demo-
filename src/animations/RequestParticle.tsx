import { motion } from 'framer-motion';

interface Props {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  delay?: number;
  duration?: number;
  color?: string;
  size?: number;
}

export function RequestParticle({
  startX,
  startY,
  endX,
  endY,
  delay = 0,
  duration = 2,
  color = '#22d3ee',
  size = 5,
}: Props) {
  return (
    <motion.circle
      cx={startX}
      cy={startY}
      r={size}
      fill={color}
      opacity={0.9}
      animate={{
        cx: [startX, endX],
        cy: [startY, endY],
        opacity: [0, 0.9, 0.9, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatDelay: 0.5,
        ease: 'easeInOut',
      }}
    />
  );
}
