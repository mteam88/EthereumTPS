import { addMonths } from "date-fns";

export type ProjectionPoint = {
  date: Date;
  glpb: number; // gas limit per block
};

export type MetricSeries = {
  label: string;
  data: { x: Date; y: number }[];
};

export function computeMonthlyRate(yoyPercent: number): number {
  const yoyDecimal = yoyPercent / 100;
  return Math.pow(1 + yoyDecimal, 1 / 12) - 1;
}

export function projectGlpb(
  startDate: Date,
  months: number,
  glpb0: number,
  yoyPercent: number
): ProjectionPoint[] {
  const monthlyRate = computeMonthlyRate(yoyPercent);
  const result: ProjectionPoint[] = [];
  for (let m = 0; m < months; m++) {
    const date = addMonths(startDate, m);
    const glpb = glpb0 * Math.pow(1 + monthlyRate, m);
    result.push({ date, glpb });
  }
  return result;
}

export function toGps(glpb: number, blockTimeSeconds = 12): number {
  return glpb / blockTimeSeconds;
}

export function toTps(glpb: number, gasPerTx: number, blockTimeSeconds = 12): number {
  if (gasPerTx <= 0) return 0;
  return toGps(glpb, blockTimeSeconds) / gasPerTx;
}

export function solanaReference(
  gasPerTx: number,
  metric: "GPS" | "TPS" | "GLPB",
  blockTimeSeconds = 12
): number {
  const solanaTps = 100_000; // constant
  if (metric === "TPS") return solanaTps;
  const gps = solanaTps * gasPerTx;
  if (metric === "GPS") return gps;
  return gps * blockTimeSeconds; // GLPB
}

