"use client";

import { useMemo } from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Line } from "react-chartjs-2";
import type { ChartData, ChartDataset } from "chart.js";
import { formatFull } from "@/lib/format";

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend, Filler);

type Series = {
  label: string;
  data: { x: Date; y: number }[];
  color: string;
};

type Props = {
  series: Series[];
  yLabel: string;
  solanaSeries?: { x: Date; y: number }[]; // optional line series
};

export function MetricChart({ series, yLabel, solanaSeries }: Props) {
  const datasets = useMemo<ChartDataset<'line', { x: Date; y: number }[]>[]>(() => {
    const base: ChartDataset<'line', { x: Date; y: number }[]>[] = series.map((s) => ({
      label: s.label,
      data: s.data,
      borderColor: s.color,
      backgroundColor: s.color + "33",
      fill: false,
      tension: 0.25,
      pointRadius: 0,
      borderWidth: 2,
    }));
    if (solanaSeries) {
      base.push({
        label: "Solana (100k TPS)",
        data: solanaSeries,
        borderColor: "#10b981",
        backgroundColor: "#10b98133",
        fill: false,
        tension: 0,
        pointRadius: 0,
        borderWidth: 2,
        borderDash: [6, 6],
      } as ChartDataset<'line', { x: Date; y: number }[]>);
    }
    return base;
  }, [series, solanaSeries]);

  const options = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "nearest", intersect: false },
      scales: {
        x: {
          type: "time" as const,
          time: { unit: "month" as const },
          grid: { display: false },
        },
        y: {
          ticks: {
            callback: (v: any) => formatFull(Number(v)),
          },
          title: { display: true, text: yLabel },
        },
      },
      plugins: {
        legend: { display: true },
        tooltip: {
          callbacks: {
            label: (ctx: any) => {
              const label = ctx.dataset.label || "";
              const value = ctx.parsed.y;
              return `${label}: ${formatFull(value)}`;
            },
          },
        },
      },
    } as const;
  }, [yLabel]);

  const data = useMemo<ChartData<'line', { x: Date; y: number }[]>>(
    () => ({ datasets }),
    [datasets]
  );

  return (
    <div className="h-[420px] w-full">
      <Line data={data} options={options} redraw />
    </div>
  );
}

