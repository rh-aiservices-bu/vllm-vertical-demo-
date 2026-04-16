import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring' as const, stiffness: 200, damping: 20 } },
};

export const userApps = ['RAG App', 'Chatbot', 'Code Assist', 'Batch Job', 'Agent'];

export const maasPolicies = [
  { label: 'Access Control', color: '#34d399', icon: '🔒' },
  { label: 'Rate Limiting', color: '#f87171', icon: '⏱' },
  { label: 'Throttling', color: '#fbbf24', icon: '⚡' },
];

export type BackendType = 'llmd' | 'vllm' | 'external';

export interface ExternalModel {
  model: string;
  provider: string;
  color: string;
}

export interface Backend {
  type: BackendType;
  model: string;
  color: string;
  plugins?: string[];
  vllmPods?: number;
  hw?: { label: string; color: string };
  activeFeatures?: number[];
  externalModels?: ExternalModel[];
}

export const backends: Backend[] = [
  {
    type: 'llmd',
    model: 'Llama-3-70B',
    color: '#a78bfa',
    plugins: ['profile-handler', 'kv-cache-scorer', 'prefix-cache-scorer'],
    vllmPods: 2,
    hw: { label: 'NVIDIA', color: '#76b900' },
    activeFeatures: [0, 2, 3],
  },
  {
    type: 'llmd',
    model: 'Granite-20B-INT8',
    color: '#60a5fa',
    plugins: ['profile-handler', 'queue-scorer', 'kv-cache-scorer'],
    vllmPods: 2,
    hw: { label: 'AMD', color: '#ed1c24' },
    activeFeatures: [1, 2, 3],
  },
  {
    type: 'vllm',
    model: 'Mistral-7B',
    color: '#f472b6',
    vllmPods: 1,
    hw: { label: 'Intel', color: '#0071c5' },
    activeFeatures: [2, 3],
  },
  {
    type: 'external',
    model: 'External Models',
    color: '#fb923c',
    externalModels: [
      { model: 'Claude Sonnet', provider: 'Anthropic', color: '#fb923c' },
      { model: 'ChatGPT', provider: 'OpenAI', color: '#34d399' },
      { model: 'Gemini Pro', provider: 'Google', color: '#60a5fa' },
    ],
  },
];

export const vllmFeatures = [
  { label: 'Speculative Decoding', color: '#fbbf24' },
  { label: 'INT8 Quantization', color: '#34d399' },
  { label: 'Continuous Batching', color: '#22d3ee' },
  { label: 'KV Cache', color: '#60a5fa' },
];

export const requests = [
  { user: 0, instance: 0, pod: 0, modelLabel: 'model: Llama-3-70B' },
  { user: 1, instance: 2, pod: 0, modelLabel: 'model: Mistral-7B' },
  { user: 2, instance: 1, pod: 1, modelLabel: 'model: Granite-20B-INT8' },
  { user: 3, instance: 3, pod: 0, modelLabel: 'model: Claude Sonnet' },
  { user: 4, instance: 0, pod: 1, modelLabel: 'model: Llama-3-70B' },
  { user: 1, instance: 3, pod: 1, modelLabel: 'model: ChatGPT' },
  { user: 0, instance: 2, pod: 0, modelLabel: 'model: Mistral-7B' },
  { user: 2, instance: 3, pod: 2, modelLabel: 'model: Gemini Pro' },
];

// Steps: 0=idle, 1=user, 2=maas-enter, 3=maas-policies (fast cycle),
//        4=route-to-instance, 5=scheduler-plugins (llmd only), 6=select-vllm-pod / external call
export const TOTAL_STEPS = 7;

interface Props {
  step: number;
  req: typeof requests[0];
  dark: boolean;
}

// Maps pastel accent colors to darker variants for light mode readability
const lightColorMap: Record<string, string> = {
  '#22d3ee': '#0e7490', // cyan-400 → cyan-700
  '#a78bfa': '#6d28d9', // violet-400 → violet-700
  '#60a5fa': '#1d4ed8', // blue-400 → blue-700
  '#f472b6': '#be185d', // pink-400 → pink-700
  '#34d399': '#047857', // emerald-400 → emerald-700
  '#fbbf24': '#a16207', // amber-400 → amber-700
  '#f87171': '#b91c1c', // red-400 → red-700
  '#ef4444': '#b91c1c', // red-500 → red-700
  '#fb923c': '#c2410c', // orange-400 → orange-700
  '#10b981': '#047857', // emerald-500 → emerald-700
  '#76b900': '#4d7a00', // nvidia green → darker
  '#ed1c24': '#b91c1c', // amd red → darker
  '#0071c5': '#004a82', // intel blue → darker
};

export function c(color: string, isDark: boolean): string {
  if (isDark) return color;
  return lightColorMap[color] ?? color;
}

export function FullFlow({ step, req, dark }: Props) {
  const boxBg = dark ? '#0f172a' : '#ffffff';
  const innerBg = dark ? '#1e293b' : '#f1f5f9';
  const textMain = dark ? '#94a3b8' : '#475569';
  const textDim = dark ? '#64748b' : '#94a3b8';
  const textBright = dark ? '#e2e8f0' : '#1e293b';

  const userY = 10;
  const maasY = 60;
  const llmdY = 185;

  const isActive = (s: number) => step === s;
  const isActiveOrPast = (s: number) => step >= s;

  const targetBackend = backends[req.instance];

  // Cycle through MaaS policies once during step 3, then hold on the last
  const [policySubStep, setPolicySubStep] = useState(0);
  useEffect(() => {
    if (step !== 3) { setPolicySubStep(0); return; }
    const t = setInterval(() => {
      setPolicySubStep(prev => Math.min(prev + 1, maasPolicies.length - 1));
    }, 300);
    return () => clearInterval(t);
  }, [step]);

  // Rapidly cycle through plugins during step 5 (llmd only)
  const [pluginSubStep, setPluginSubStep] = useState(0);
  const maxPlugins = targetBackend.plugins?.length ?? 0;
  useEffect(() => {
    if (step !== 5 || maxPlugins === 0) { setPluginSubStep(0); return; }
    const t = setInterval(() => {
      setPluginSubStep(prev => (prev + 1) % maxPlugins);
    }, 300);
    return () => clearInterval(t);
  }, [step, maxPlugins]);

  // Column layout — 4 columns
  const colW = 168;
  const colGap = 8;
  const totalW = backends.length * colW + (backends.length - 1) * colGap;
  const colStartX = (740 - totalW) / 2;

  // llm-d box sizing
  const pluginH = 18;
  const pluginGap = 3;
  const llmdBoxH = 24 + 3 * (pluginH + pluginGap) + 6;

  // vLLM pod sizing
  const featureH = 18;
  const featureGap = 3;
  const podHeaderH = 20;
  const podInnerH = podHeaderH + vllmFeatures.length * (featureH + featureGap) - featureGap + 8;

  const vllmY = llmdY + llmdBoxH + 8;

  // Group box: llm-d + vLLM + hw label
  const groupPad = 6;
  const groupY = llmdY - groupPad;
  const hwLabelH = 22;
  const groupH = llmdBoxH + 8 + podInnerH + 6 + hwLabelH + groupPad * 2;

  // Standalone vLLM box — fills the combined llmd + pods area
  const vllmStandaloneH = llmdBoxH + 8 + podInnerH;

  // External model boxes — stacked vertically in the group area
  const extHeaderH = 20;
  const extCount = backends.find(b => b.type === 'external')?.externalModels?.length ?? 1;
  const extGap = 6;
  const extBoxH = (vllmStandaloneH - extHeaderH - (extCount - 1) * extGap) / extCount;

  // MaaS box sizing — vertical stack
  const maasBoxW = 200;
  const maasPolicyH = 22;
  const maasPolicyGap = 3;
  const maasInnerH = 26 + maasPolicies.length * (maasPolicyH + maasPolicyGap) + 4;
  const maasX = (740 - maasBoxW) / 2;

  return (
    <motion.svg
      viewBox="0 0 740 520"
      className="w-full h-full"
      initial="hidden"
      animate="visible"
    >
      <defs>
        <linearGradient id="flowGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={dark ? '#22d3ee' : '#0891b2'} stopOpacity={dark ? 0.08 : 0.04} />
          <stop offset="50%" stopColor={dark ? '#a78bfa' : '#7c3aed'} stopOpacity={dark ? 0.05 : 0.03} />
          <stop offset="100%" stopColor={dark ? '#34d399' : '#059669'} stopOpacity={dark ? 0.03 : 0.02} />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="740" height="520" fill="url(#flowGrad)" />

      {/* === USERS === */}
      {userApps.map((name, i) => {
        const active = isActive(1) && i === req.user;
        return (
          <motion.g key={i} variants={scaleIn}>
            <motion.rect
              x={55 + i * 130} y={userY} width="105" height="35" rx="6"
              fill={boxBg} stroke={active ? c('#22d3ee', dark) : textMain}
              animate={{ strokeWidth: active ? 2.5 : 1 }}
              transition={{ duration: 0.3 }}
            />
            <motion.rect
              x={55 + i * 130} y={userY} width="105" height="35" rx="6"
              fill={active ? c('#22d3ee', dark) : boxBg}
              animate={{ fillOpacity: active ? 0.25 : 0 }}
              transition={{ duration: 0.3 }}
            />
            <text x={107 + i * 130} y={userY + 15} textAnchor="middle" fill={active ? textBright : textMain} fontSize="9" fontWeight="600">
              {name}
            </text>
            <text x={107 + i * 130} y={userY + 28} textAnchor="middle" fill={active ? textMain : textDim} fontSize="7">
              {active ? req.modelLabel : 'user requests'}
            </text>
          </motion.g>
        );
      })}

      {/* === MAAS GATEWAY (vertical stack) === */}
      {(() => {
        const layerActive = isActiveOrPast(2) && step <= 3;
        return (
          <motion.g variants={scaleIn}>
            <motion.rect
              x={maasX} y={maasY} width={maasBoxW} height={maasInnerH} rx="10"
              fill={boxBg} stroke={c('#ef4444', dark)}
              animate={{ strokeWidth: layerActive ? 2.5 : 2, strokeOpacity: layerActive ? 1 : 0.5 }}
              transition={{ duration: 0.3 }}
            />
            <motion.rect
              x={maasX} y={maasY} width={maasBoxW} height={maasInnerH} rx="10"
              fill={c('#ef4444', dark)}
              animate={{ fillOpacity: layerActive ? 0.08 : 0 }}
              transition={{ duration: 0.3 }}
            />
            <rect x={maasX} y={maasY} width={maasBoxW} height="24" rx="10" fill={c('#ef4444', dark)} fillOpacity="0.12" />
            <text x={maasX + maasBoxW / 2} y={maasY + 16} textAnchor="middle" fill={c('#ef4444', dark)} fontSize="10" fontWeight="700">MaaS — AI Gateway</text>

            {maasPolicies.map((p, i) => {
              const pActive = isActive(3) && i === policySubStep;
              const py = maasY + 28 + i * (maasPolicyH + maasPolicyGap);
              return (
                <motion.g key={i}>
                  <motion.rect
                    x={maasX + 8} y={py} width={maasBoxW - 16} height={maasPolicyH} rx="4"
                    fill={innerBg} stroke={c(p.color, dark)}
                    animate={{ strokeWidth: pActive ? 2 : 0.5, strokeOpacity: pActive ? 1 : 0.4 }}
                    transition={{ duration: 0.15 }}
                  />
                  <motion.rect
                    x={maasX + 8} y={py} width={maasBoxW - 16} height={maasPolicyH} rx="4"
                    fill={c(p.color, dark)}
                    animate={{ fillOpacity: pActive ? 0.2 : 0.02 }}
                    transition={{ duration: 0.15 }}
                  />
                  <text x={maasX + maasBoxW / 2} y={py + 15} textAnchor="middle" fill={c(p.color, dark)} fontSize="8" fontWeight="600">{p.icon} {p.label}</text>
                </motion.g>
              );
            })}
          </motion.g>
        );
      })()}

      {/* === DOTTED GROUP OUTLINES === */}
      {backends.map((backend, ii) => {
        const x = colStartX + ii * (colW + colGap);
        const isTarget = req.instance === ii;
        const groupActive = isTarget && isActiveOrPast(4) && step <= 6;
        return (
          <motion.rect
            key={`group-${ii}`}
            x={x - groupPad} y={groupY}
            width={colW + groupPad * 2} height={groupH}
            rx="12" fill="none"
            stroke={c(backend.color, dark)}
            strokeDasharray={backend.type === 'external' ? '4 4' : '6 3'}
            animate={{ strokeOpacity: groupActive ? 0.5 : 0.15 }}
            transition={{ duration: 0.3 }}
          />
        );
      })}

      {/* === LLM-D INSTANCES (type: llmd) === */}
      {backends.map((backend, ii) => {
        if (backend.type !== 'llmd') return null;
        const x = colStartX + ii * (colW + colGap);
        const isTarget = req.instance === ii;
        const instanceActive = isTarget && isActiveOrPast(4) && step <= 6;
        const pluginStepActive = isTarget && isActive(5);

        return (
          <motion.g key={`llmd-${ii}`} variants={scaleIn}>
            <motion.rect
              x={x} y={llmdY} width={colW} height={llmdBoxH} rx="10"
              fill={boxBg} stroke={c(backend.color, dark)}
              animate={{ strokeWidth: instanceActive ? 2.5 : 1.5, strokeOpacity: instanceActive ? 1 : 0.35 }}
              transition={{ duration: 0.3 }}
            />
            <motion.rect
              x={x} y={llmdY} width={colW} height={llmdBoxH} rx="10"
              fill={c(backend.color, dark)}
              animate={{ fillOpacity: instanceActive ? 0.08 : 0 }}
              transition={{ duration: 0.3 }}
            />
            <rect x={x} y={llmdY} width={colW} height="24" rx="10" fill={c(backend.color, dark)} fillOpacity={instanceActive ? 0.2 : 0.1} />
            <text x={x + colW / 2} y={llmdY + 16} textAnchor="middle" fill={c(backend.color, dark)} fontSize="9" fontWeight="700">
              llm-d — {backend.model}
            </text>

            {backend.plugins!.map((plugin, pi) => {
              const py = llmdY + 28 + pi * (pluginH + pluginGap);
              const thisActive = pluginStepActive && pi === pluginSubStep;
              return (
                <motion.g key={pi}>
                  <motion.rect
                    x={x + 8} y={py} width={colW - 16} height={pluginH} rx="3"
                    fill={innerBg} stroke={c(backend.color, dark)}
                    animate={{ strokeWidth: thisActive ? 1.5 : 0.3, strokeOpacity: thisActive ? 1 : 0.3 }}
                    transition={{ duration: 0.15 }}
                  />
                  <motion.rect
                    x={x + 8} y={py} width={colW - 16} height={pluginH} rx="3"
                    fill={c(backend.color, dark)}
                    animate={{ fillOpacity: thisActive ? 0.25 : 0.02 }}
                    transition={{ duration: 0.15 }}
                  />
                  <text x={x + colW / 2} y={py + 12} textAnchor="middle" fill={c(backend.color, dark)} fontSize="7" fontWeight="500">{plugin}</text>
                </motion.g>
              );
            })}
          </motion.g>
        );
      })}

      {/* === VLLM PODS (for llmd and vllm types) === */}
      {backends.map((backend, ii) => {
        if (backend.type === 'external') return null;
        const colX = colStartX + ii * (colW + colGap);
        const isTarget = req.instance === ii;
        const podStepActive = isTarget && isActive(6);

        const podCount = backend.vllmPods!;
        const podGap2 = 6;
        const podW = (colW - (podCount - 1) * podGap2) / podCount;

        // For standalone vLLM, pods start where llm-d box would be
        const podsY = backend.type === 'vllm' ? llmdY : vllmY;

        return Array.from({ length: podCount }).map((_, pi) => {
          const px = colX + pi * (podW + podGap2);
          const thisPodActive = podStepActive && pi === req.pod && pi < podCount;
          // For standalone vLLM, activate on step 4+ (no scheduler step)
          const vllmDirectActive = backend.type === 'vllm' && isTarget && isActiveOrPast(4) && step <= 6;
          const podActive = thisPodActive || (vllmDirectActive && pi === req.pod);

          // For standalone vLLM, make the pod taller to fill the space
          const podH = backend.type === 'vllm' ? vllmStandaloneH : podInnerH;

          return (
            <motion.g key={`vllm-${ii}-${pi}`} variants={scaleIn}>
              <motion.rect
                x={px} y={podsY} width={podW} height={podH} rx="7"
                fill={boxBg} stroke={c('#22d3ee', dark)}
                animate={{ strokeWidth: podActive ? 2 : 0.8, strokeOpacity: podActive ? 1 : 0.25 }}
                transition={{ duration: 0.3 }}
              />
              <motion.rect
                x={px} y={podsY} width={podW} height={podH} rx="7"
                fill={c('#22d3ee', dark)}
                animate={{ fillOpacity: podActive ? 0.1 : 0 }}
                transition={{ duration: 0.3 }}
              />
              <text x={px + podW / 2} y={podsY + 13} textAnchor="middle" fill={c('#22d3ee', dark)} fontSize="7" fontWeight="600">
                {backend.type === 'vllm' ? `vLLM — ${backend.model}` : `vLLM Pod ${pi + 1}`}
              </text>

              {vllmFeatures.map((f, fi) => {
                const fy = podsY + podHeaderH + fi * (featureH + featureGap);
                const featureActive = podActive && (backend.activeFeatures ?? []).includes(fi);
                return (
                  <motion.g key={fi}>
                    <motion.rect
                      x={px + 4} y={fy} width={podW - 8} height={featureH} rx="3"
                      fill={innerBg} stroke={c(f.color, dark)}
                      animate={{
                        strokeWidth: featureActive ? 1.5 : 0.3,
                        strokeOpacity: featureActive ? 1 : 0.25,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.rect
                      x={px + 4} y={fy} width={podW - 8} height={featureH} rx="3"
                      fill={c(f.color, dark)}
                      animate={{ fillOpacity: featureActive ? 0.2 : 0.01 }}
                      transition={{ duration: 0.3 }}
                    />
                    <text x={px + podW / 2} y={fy + 12} textAnchor="middle" fill={c(f.color, dark)} fontSize="6" fontWeight="500" opacity={featureActive ? 1 : 0.7}>
                      {f.label}
                    </text>
                  </motion.g>
                );
              })}
            </motion.g>
          );
        });
      })}

      {/* === EXTERNAL API BOXES (type: external) — stacked models === */}
      {backends.map((backend, ii) => {
        if (backend.type !== 'external' || !backend.externalModels) return null;
        const x = colStartX + ii * (colW + colGap);
        const isTarget = req.instance === ii;
        const colActive = isTarget && isActiveOrPast(4) && step <= 6;

        return (
          <motion.g key={`ext-col-${ii}`}>
            {/* Column header */}
            <text
              x={x + colW / 2} y={llmdY + 12}
              textAnchor="middle" fill={colActive ? textBright : textMain}
              fontSize="9" fontWeight="700"
            >
              External Models
            </text>

            {backend.externalModels.map((ext, ei) => {
          const ey = llmdY + extHeaderH + ei * (extBoxH + extGap);
          const thisActive = isTarget && isActiveOrPast(4) && step <= 6 && req.pod === ei;

          return (
            <motion.g key={`ext-${ii}-${ei}`} variants={scaleIn}>
              <motion.rect
                x={x} y={ey} width={colW} height={extBoxH} rx="8"
                fill={boxBg} stroke={c(ext.color, dark)}
                animate={{ strokeWidth: thisActive ? 2.5 : 1, strokeOpacity: thisActive ? 1 : 0.35 }}
                transition={{ duration: 0.3 }}
              />
              <motion.rect
                x={x} y={ey} width={colW} height={extBoxH} rx="8"
                fill={c(ext.color, dark)}
                animate={{ fillOpacity: thisActive ? 0.1 : 0 }}
                transition={{ duration: 0.3 }}
              />
              <rect x={x} y={ey} width={colW} height="22" rx="8" fill={c(ext.color, dark)} fillOpacity={thisActive ? 0.2 : 0.1} />
              <text x={x + colW / 2} y={ey + 15} textAnchor="middle" fill={c(ext.color, dark)} fontSize="8" fontWeight="700">
                {ext.model}
              </text>
              <text x={x + colW / 2} y={ey + 34} textAnchor="middle" fill={textMain} fontSize="7" fontWeight="500">
                {ext.provider} API
              </text>
              <text x={x + colW / 2} y={ey + extBoxH - 8} textAnchor="middle" fontSize="11" opacity={thisActive ? 1 : 0.4}>
                ☁️
              </text>
            </motion.g>
          );
        })}
          </motion.g>
        );
      })}

      {/* === HARDWARE VENDOR LABELS (llmd and vllm types only) === */}
      {backends.map((backend, ii) => {
        if (backend.type === 'external' || !backend.hw) return null;
        const x = colStartX + ii * (colW + colGap);
        const hwLabelY = (backend.type === 'vllm' ? llmdY + vllmStandaloneH : vllmY + podInnerH) + 6;
        const isTarget = req.instance === ii;
        const active = isTarget && isActiveOrPast(4) && step <= 6;

        return (
          <motion.g key={`hw-${ii}`} variants={scaleIn}>
            <motion.rect
              x={x + 20} y={hwLabelY} width={colW - 40} height={hwLabelH} rx="4"
              fill={innerBg} stroke={c(backend.hw.color, dark)}
              animate={{ strokeWidth: active ? 1.5 : 0.5, strokeOpacity: active ? 0.8 : 0.3 }}
              transition={{ duration: 0.3 }}
            />
            <motion.rect
              x={x + 20} y={hwLabelY} width={colW - 40} height={hwLabelH} rx="4"
              fill={c(backend.hw.color, dark)}
              animate={{ fillOpacity: active ? 0.12 : 0.02 }}
              transition={{ duration: 0.3 }}
            />
            <text x={x + colW / 2} y={hwLabelY + 15} textAnchor="middle" fill={c(backend.hw.color, dark)} fontSize="8" fontWeight="600">
              {backend.hw.label}
            </text>
          </motion.g>
        );
      })}
    </motion.svg>
  );
}
