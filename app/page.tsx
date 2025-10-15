"use client";

import { useMemo, useState } from "react";
import { Controls } from "@/components/controls";
import { MetricChart } from "@/components/metric-chart";
import { formatCompact, Metric } from "@/lib/format";
import { projectGlpb, toGps, toTps, solanaReference } from "@/lib/projection";

export default function Page() {
  const [metric, setMetric] = useState<Metric>("GPS");
  const [yoy, setYoy] = useState<number>(200);
  const [gasPerTx, setGasPerTx] = useState<number>(21000);
  const [showSolana, setShowSolana] = useState<boolean>(false);

  const startDate = useMemo(() => new Date("2025-12-01T00:00:00Z"), []);
  const months = 72;
  const glpb0 = 60_000_000;

  const series = useMemo(() => {
    const proj = projectGlpb(startDate, months, glpb0, yoy);
    const data = proj.map(({ date, glpb }) => {
      if (metric === "GPS") return { x: date, y: toGps(glpb) };
      if (metric === "TPS") return { x: date, y: toTps(glpb, gasPerTx) };
      return { x: date, y: glpb };
    });
    return [
      {
        label: metric,
        data,
        color: "#3b82f6",
      },
    ];
  }, [metric, startDate, months, glpb0, yoy, gasPerTx]);

  const yLabel = useMemo(() => {
    if (metric === "GPS") return "Gas per second";
    if (metric === "TPS") return "Approx transactions per second";
    return "Gas limit per block";
  }, [metric]);

  const solSeries = useMemo(() => {
    if (!showSolana) return undefined;
    // horizontal series across same dates
    const proj = projectGlpb(startDate, months, glpb0, yoy);
    const refValue = solanaReference(gasPerTx, metric);
    return proj.map(({ date }) => ({ x: date, y: refValue }));
  }, [showSolana, startDate, months, glpb0, yoy, gasPerTx, metric]);

  return (
    <main className="container mx-auto max-w-5xl py-8 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Ethereum Gas Projection</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Starting Dec 2025, initial gas limit 60M, monthly compounding growth.
        </p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>
            <span className="font-medium">Gas per second (GPS):</span> gas
            capacity available each second, derived from gas limit ÷ block time.
          </p>
          <p>
            <span className="font-medium">Transactions per second (TPS):</span>{" "}
            estimated tx throughput assuming a chosen gas-per-transaction.
          </p>
          <p>
            <span className="font-medium">Gas limit per block (GLPB):</span>{" "}
            maximum gas budget allowed in a single block.
          </p>
        </div>
      </header>

      <section>
        <Controls
          metric={metric}
          onMetricChange={setMetric}
          yoyPercent={yoy}
          onYoyChange={setYoy}
          gasPerTx={gasPerTx}
          onGasPerTxChange={setGasPerTx}
          showSolana={showSolana}
          onShowSolanaChange={setShowSolana}
        />
      </section>

      <section className="rounded-lg border p-4">
        <div className="mb-2 text-sm text-gray-600 dark:text-gray-300">
          YoY growth: {yoy}% ({(1 + yoy / 100).toFixed(2)}x), Gas/tx:{" "}
          {formatCompact(gasPerTx)}
        </div>
        <MetricChart series={series} yLabel={yLabel} solanaSeries={solSeries} />
      </section>

      <footer className="text-xs text-gray-500 text-center flex flex-col items-center gap-1">
        <div>
          Block time 12s; TPS depends on gas/tx assumption. Solana overlay at
          100k TPS.
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/mteam88/EthereumTPS"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-700 dark:hover:text-gray-300"
          >
            GitHub
          </a>
          <span>•</span>
          <span>
            made with ❤️ by{" "}
            <a
              href="https://x.com/mteamisloading"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-700 dark:hover:text-gray-300"
            >
              mteam.eth
            </a>
          </span>
        </div>
      </footer>
    </main>
  );
}
