import { AnimatePresence, motion } from 'framer-motion';
import { SingleInstance } from './diagrams/SingleInstance';
import { QuantizedModel } from './diagrams/QuantizedModel';
import { SpeculativeDecoding } from './diagrams/SpeculativeDecoding';
import { VerticalLimit } from './diagrams/VerticalLimit';
import { HorizontalScaling } from './diagrams/HorizontalScaling';
import { IntelligentScheduler } from './diagrams/IntelligentScheduler';
import { PrefillDecodeDisagg } from './diagrams/PrefillDecodeDisagg';

const diagrams: Record<number, React.FC> = {
  1: SingleInstance,
  2: QuantizedModel,
  3: SpeculativeDecoding,
  4: VerticalLimit,
  5: HorizontalScaling,
  6: IntelligentScheduler,
  7: PrefillDecodeDisagg,
};

interface Props {
  stageId: number;
  direction: number;
}

export function ArchitectureDiagram({ stageId, direction }: Props) {
  const Diagram = diagrams[stageId] || SingleInstance;

  return (
    <div className="glass-card p-4 overflow-hidden" style={{ minHeight: 300 }}>
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={stageId}
          custom={direction}
          initial={{ opacity: 0, x: direction > 0 ? 60 : -60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction > 0 ? -60 : 60 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <Diagram />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
