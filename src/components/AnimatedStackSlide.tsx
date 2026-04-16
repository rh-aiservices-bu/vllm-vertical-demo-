import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FullFlow, requests, TOTAL_STEPS,
  userApps, backends, c,
} from './diagrams/FullFlow';

const STEP_MS = 1500;

function getNarrative(step: number, req: typeof requests[0], dark: boolean) {
  const app = userApps[req.user];
  const backend = backends[req.instance];
  switch (step) {
    case 0: return { pct: 2, color: c('#64748b', dark), text: `Waiting for next request...` };
    case 1: return { pct: 2, color: c('#22d3ee', dark), text: `${app} sends request — ${req.modelLabel}` };
    case 2: return { pct: 13, color: c('#ef4444', dark), text: `Request enters MaaS Gateway` };
    case 3: return { pct: 19, color: c('#ef4444', dark), text: `Checking policies...` };
    case 4: {
      if (backend.type === 'external') {
        const ext = backend.externalModels?.[req.pod];
        return { pct: 38, color: c(ext?.color ?? backend.color, dark), text: `Routing to ${ext?.model ?? 'external'} (${ext?.provider ?? ''})` };
      }
      if (backend.type === 'vllm') return { pct: 38, color: c(backend.color, dark), text: `Routing to vLLM for ${backend.model}` };
      return { pct: 38, color: c(backend.color, dark), text: `Routing to llm-d for ${backend.model}` };
    }
    case 5: {
      if (backend.type === 'external') {
        const ext = backend.externalModels?.[req.pod];
        return { pct: 44, color: c(ext?.color ?? backend.color, dark), text: `Forwarding to ${ext?.provider ?? ''} API...` };
      }
      if (backend.type === 'vllm') return { pct: 44, color: c('#22d3ee', dark), text: `Direct routing to vLLM instance` };
      return { pct: 44, color: c(backend.color, dark), text: `Running scheduler plugins...` };
    }
    case 6: {
      if (backend.type === 'external') {
        const ext = backend.externalModels?.[req.pod];
        return { pct: 60, color: c(ext?.color ?? backend.color, dark), text: `Response from ${ext?.model ?? 'external'}` };
      }
      if (backend.type === 'vllm') return { pct: 60, color: c('#22d3ee', dark), text: `Running on vLLM — ${backend.hw!.label}` };
      return { pct: 60, color: c('#22d3ee', dark), text: `Assigned to vLLM Pod ${req.pod + 1} on ${backend.hw!.label}` };
    }
    default: return { pct: 50, color: c('#64748b', dark), text: '' };
  }
}

interface Props {
  darkMode: boolean;
}

export function AnimatedStackSlide({ darkMode: dark }: Props) {
  const [step, setStep] = useState(0);
  const [reqIdx, setReqIdx] = useState(0);
  const req = requests[reqIdx];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep(prev => {
        if (prev >= TOTAL_STEPS - 1) {
          setReqIdx(ri => (ri + 1) % requests.length);
          return 0;
        }
        return prev + 1;
      });
    }, STEP_MS);
    return () => clearInterval(timer);
  }, []);

  const narrative = getNarrative(step, req, dark);

  return (
    <div>
      <div className="text-center mb-4">
        <h2 className={`text-2xl font-bold ${dark ? 'text-slate-100' : 'text-slate-900'}`}>
          Enterprise GenAI Inference
        </h2>
        <p className={`text-sm mt-1 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
          End-to-end request flow through the OpenShift AI stack
        </p>
      </div>
      <div className="flex gap-6 items-stretch">
        {/* Diagram */}
        <div className={`flex-1 p-6 min-w-0 rounded-xl border ${dark ? 'glass-card' : 'bg-white border-slate-200'}`}>
          <FullFlow step={step} req={req} dark={dark} />
        </div>

        {/* Narrative panel */}
        <div className="w-72 shrink-0 relative">
          <div className={`h-full relative overflow-hidden rounded-xl border ${dark ? 'glass-card' : 'bg-white border-slate-200'}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${reqIdx}-${step}`}
                className="absolute left-0 right-0 px-4"
                style={{ top: `${narrative.pct}%` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div
                  className="rounded-lg px-4 py-3 border"
                  style={{
                    backgroundColor: `${narrative.color}${dark ? '10' : '15'}`,
                    borderColor: `${narrative.color}${dark ? '30' : '40'}`,
                  }}
                >
                  <p className="text-sm font-medium" style={{ color: narrative.color }}>
                    {narrative.text}
                  </p>
                  <p className={`text-[10px] mt-1 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
                    Step {step + 1} of {TOTAL_STEPS} — Request #{reqIdx + 1}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
