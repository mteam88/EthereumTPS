"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

type Props = {
  metric: "GPS" | "TPS" | "GLPB";
  onMetricChange: (m: Props["metric"]) => void;
  yoyPercent: number;
  onYoyChange: (v: number) => void;
  gasPerTx: number;
  onGasPerTxChange: (v: number) => void;
  showSolana: boolean;
  onShowSolanaChange: (v: boolean) => void;
  useLogScale: boolean;
  onUseLogScaleChange: (v: boolean) => void;
};

export function Controls({
  metric,
  onMetricChange,
  yoyPercent,
  onYoyChange,
  gasPerTx,
  onGasPerTxChange,
  showSolana,
  onShowSolanaChange,
  useLogScale,
  onUseLogScaleChange,
}: Props) {
  const gasId = useId();
  const yoyId = useId();
  const yoyMultiplierText = (1 + yoyPercent / 100).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });

  return (
    <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <div className="rounded-lg border p-3">
        <div className="text-xs mb-2 font-medium">Metric</div>
        <div className="inline-flex rounded-md shadow-sm" role="group">
          {(["GPS", "TPS", "GLPB"] as const).map((m) => (
            <button
              key={m}
              type="button"
              className={cn(
                "px-3 py-1.5 text-sm border",
                "first:rounded-l-md last:rounded-r-md -ml-px first:ml-0",
                metric === m
                  ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                  : "bg-white dark:bg-gray-800"
              )}
              onClick={() => onMetricChange(m)}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg border p-3">
        <label htmlFor={yoyId} className="text-xs mb-2 font-medium block">
          YoY gas limit increase: {yoyPercent}% ({yoyMultiplierText}x)
        </label>
        <input
          id={yoyId}
          type="range"
          min={0}
          max={500}
          step={5}
          value={yoyPercent}
          onChange={(e) => onYoyChange(Number(e.target.value))}
          onInput={(e) =>
            onYoyChange(Number((e.target as HTMLInputElement).value))
          }
          className="w-full"
        />
      </div>

      <div className="rounded-lg border p-3">
        <label htmlFor={gasId} className="text-xs mb-2 font-medium block">
          Gas per transaction
        </label>
        <input
          id={gasId}
          type="number"
          inputMode="numeric"
          min={1}
          value={gasPerTx}
          onChange={(e) => onGasPerTxChange(Number(e.target.value))}
          className="w-full rounded-md border bg-transparent px-3 py-2 text-sm"
        />
      </div>

      <div className="rounded-lg border p-3 flex items-center justify-between">
        <div className="text-sm">Show Solana 3k TPS</div>
        <button
          type="button"
          aria-pressed={showSolana}
          onClick={() => onShowSolanaChange(!showSolana)}
          className={cn(
            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
            showSolana ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-700"
          )}
        >
          <span
            className={cn(
              "inline-block h-5 w-5 transform rounded-full bg-white transition-transform",
              showSolana ? "translate-x-5" : "translate-x-1"
            )}
          />
        </button>
      </div>

      <div className="rounded-lg border p-3 flex items-center justify-between">
        <div className="text-sm">Y-axis log scale</div>
        <button
          type="button"
          aria-pressed={useLogScale}
          onClick={() => onUseLogScaleChange(!useLogScale)}
          className={cn(
            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
            useLogScale ? "bg-indigo-500" : "bg-gray-300 dark:bg-gray-700"
          )}
        >
          <span
            className={cn(
              "inline-block h-5 w-5 transform rounded-full bg-white transition-transform",
              useLogScale ? "translate-x-5" : "translate-x-1"
            )}
          />
        </button>
      </div>
    </div>
  );
}
