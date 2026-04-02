import { motion } from 'framer-motion';
import type { StageDefinition } from '../types';
import { fadeInUp, staggerContainer } from '../animations/variants';

interface Props {
  stage: StageDefinition;
}

export function ExplanationPanel({ stage }: Props) {
  const isHorizontal = stage.category === 'horizontal';

  return (
    <motion.div
      className="glass-card p-5"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      key={stage.id}
    >
      <motion.p className="text-sm text-slate-300 leading-relaxed mb-4" variants={fadeInUp}>
        {stage.description}
      </motion.p>
      <motion.ul className="space-y-2" variants={staggerContainer} initial="hidden" animate="visible">
        {stage.bullets.map((bullet, i) => (
          <motion.li
            key={i}
            className="flex items-start gap-2 text-sm"
            variants={fadeInUp}
          >
            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
              isHorizontal ? 'bg-violet-400' : 'bg-cyan-400'
            }`} />
            <span className="text-slate-300">{bullet}</span>
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
}
