export interface StageMetrics {
  ttft: { p50: number; p95: number; p99: number };
  itl: { p50: number; p95: number; p99: number };
  throughput: number;
  kvCacheUtilization: number;
  prefixCacheHitRate: number;
}

export interface LoadCurvePoint {
  users: number;
  throughput: number;
  ttftP50: number;
  ttftP95: number;
  ttftP99: number;
}

export interface StageDefinition {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  category: 'vertical' | 'horizontal';
  description: string;
  bullets: string[];
  metrics: StageMetrics;
  loadCurve: LoadCurvePoint[];
}
