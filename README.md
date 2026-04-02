# vLLM to LLM-D: Vertical to Horizontal Scaling Demo

An interactive, animated demo that walks through the journey of scaling LLM inference from a single vLLM instance to a fully disaggregated LLM-D deployment.

## Stages

The demo progresses through 7 stages, each with animated architecture diagrams, live performance metrics, and growing user icons that visualize increasing scale:

**Vertical Scaling (Stages 1-4)**

1. **Single vLLM Instance** - KV Cache and Continuous Batching serving a small user base
2. **Quantized Model (INT8)** - Reduced precision for faster inference as users grow
3. **Speculative Decoding** - Draft model acceleration pushing single-instance performance further
4. **Vertical Scaling Limits** - System saturates under heavy user load, tail latencies explode

**Horizontal Scaling (Stages 5-7)**

5. **Horizontal Scaling (4 Replicas)** - Scale-out behind a load balancer, but round-robin routing causes cold-cache misses
6. **LLM-D Intelligent Scheduling** - KV cache-aware routing collapses tail latency with prefix-cache, queue, and active-request scorers
7. **Prefill / Decode Disaggregation** - Dedicated prefill and decode node pools for massive heterogeneous workload support

## Running

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Navigation

- **Arrow keys** or **spacebar** to move between stages
- **Number keys 1-7** to jump directly to a stage
- **Click** the timeline nodes or Previous/Next buttons

## Tech Stack

- React + TypeScript + Vite
- Framer Motion (animations)
- Recharts (performance graphs)
- Tailwind CSS v4
