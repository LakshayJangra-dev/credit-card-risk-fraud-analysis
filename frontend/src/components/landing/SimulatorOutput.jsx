import React, { useState } from "react";
import { Gauge, FileJson, LayoutGrid, AlertTriangle, Zap, Sliders } from "lucide-react";

export default function SimulatorOutput({ demoResult }) {
  const [showRawJson, setShowRawJson] = useState(false);

  return (
    <div className="bg-[#0A0D12] border border-[#262E39] rounded-2xl p-6 flex flex-col justify-between shadow-inner">
      <div>
        <div className="flex items-center justify-between pb-3.5 border-b border-[#1E2633]">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-[#A78BFA]" />
            <span className="text-xs font-semibold text-white uppercase tracking-wider">Evaluation Output</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRawJson(!showRawJson)}
              className="text-[11px] text-[#8A93A6] hover:text-white flex items-center gap-1 bg-[#161C26] border border-[#262E39] px-2.5 py-1 rounded-md transition-colors"
            >
              {showRawJson ? <LayoutGrid className="w-3 h-3" /> : <FileJson className="w-3 h-3" />}
              {showRawJson ? "Visual View" : "JSON Payload"}
            </button>
            <span className="text-[11px] text-[#3FB37F] font-mono bg-[#3FB37F]/10 px-2 py-0.5 rounded border border-[#3FB37F]/30">
              200 OK
            </span>
          </div>
        </div>

        <div className="mt-5">
          {demoResult ? (
            showRawJson ? (
              <pre className="text-[#A78BFA] leading-relaxed overflow-x-auto font-mono text-xs p-3 bg-[#11161F] border border-[#1E2633] rounded-xl max-h-[260px]">
                {JSON.stringify(demoResult, null, 2)}
              </pre>
            ) : demoResult.type === "credit" ? (
              /* Rich Formatted Credit Output UI Card */
              <div className="space-y-4">
                {/* Score Gauge Header */}
                <div className="bg-[#11161F] border border-[#1E2633] rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[#8A93A6] uppercase font-mono tracking-wider">Calculated Credit Score</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className={`text-3xl font-extrabold font-display ${demoResult.tierColor}`}>
                        {demoResult.score}
                      </span>
                      <span className="text-xs text-[#8A93A6]">/ 850</span>
                    </div>
                  </div>

                  <div className={`px-3 py-1.5 rounded-lg border text-xs font-bold font-mono uppercase ${demoResult.badgeBg}`}>
                    {demoResult.tier} Tier
                  </div>
                </div>

                {/* Progress Bar Gauge */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] text-[#8A93A6]">
                    <span>300 (Poor)</span>
                    <span>Score Progress</span>
                    <span>850 (Excellent)</span>
                  </div>
                  <div className="w-full bg-[#18202C] h-2.5 rounded-full overflow-hidden p-0.5 border border-[#262E39]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#FF6B4A] via-[#E8A33D] to-[#3FB37F] transition-all duration-700"
                      style={{ width: `${Math.min(100, Math.max(10, ((demoResult.score - 300) / 550) * 100))}%` }}
                    />
                  </div>
                </div>

                {/* Metrics Breakdown Grid */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-[#11161F] border border-[#1E2633] rounded-xl p-3">
                    <span className="text-[11px] text-[#8A93A6] block">Default Probability (PD)</span>
                    <span className="text-sm font-semibold text-white font-mono">{demoResult.pd_percentage}%</span>
                  </div>
                  <div className="bg-[#11161F] border border-[#1E2633] rounded-xl p-3">
                    <span className="text-[11px] text-[#8A93A6] block">Underwriting Decision</span>
                    <span className={`text-sm font-bold font-mono ${demoResult.tierColor}`}>
                      {demoResult.recommendation}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* Rich Formatted Fraud Output UI Card */
              <div className="space-y-4">
                {/* Risk Score Header */}
                <div className="bg-[#11161F] border border-[#1E2633] rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[#8A93A6] uppercase font-mono tracking-wider">Fraud Anomaly Risk</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className={`text-3xl font-extrabold font-display ${demoResult.badgeBg.includes("FF6B4A") ? "text-[#FF6B4A]" : "text-[#3FB37F]"}`}>
                        {demoResult.risk_score}%
                      </span>
                      <span className="text-xs text-[#8A93A6]">Risk Probability</span>
                    </div>
                  </div>

                  <div className={`px-3 py-1.5 rounded-lg border text-xs font-bold font-mono uppercase ${demoResult.badgeBg}`}>
                    {demoResult.decision}
                  </div>
                </div>

                {/* Anomaly & Velocity Warning Chips */}
                <div className="grid grid-cols-2 gap-3">
                  <div className={`border rounded-xl p-3 flex items-center gap-2 ${demoResult.is_anomaly ? "bg-[#FF6B4A]/10 border-[#FF6B4A]/30 text-[#FF8F70]" : "bg-[#11161F] border-[#1E2633] text-[#8A93A6]"}`}>
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <div className="text-xs">
                      <span className="font-semibold block text-white">Distance Alert</span>
                      {demoResult.is_anomaly ? "Location Anomaly" : "Normal Distance"}
                    </div>
                  </div>

                  <div className={`border rounded-xl p-3 flex items-center gap-2 ${demoResult.velocity_warning ? "bg-[#E8A33D]/10 border-[#E8A33D]/30 text-[#E8A33D]" : "bg-[#11161F] border-[#1E2633] text-[#8A93A6]"}`}>
                    <Zap className="w-4 h-4 flex-shrink-0" />
                    <div className="text-xs">
                      <span className="font-semibold block text-white">Velocity Check</span>
                      {demoResult.velocity_warning ? "High Transaction Velocity" : "Normal Velocity"}
                    </div>
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="py-14 text-center">
              <div className="w-10 h-10 rounded-xl bg-[#161C26] border border-[#262E39] flex items-center justify-center mx-auto mb-3 text-[#8A93A6]">
                <Sliders className="w-5 h-5 text-[#A78BFA]" />
              </div>
              <p className="text-xs text-[#8A93A6]">
                Enter sample parameters and click <strong className="text-white">"Evaluate"</strong> to view real-time model scoring.
              </p>
            </div>
          )}
        </div>
      </div>

      {demoResult && (
        <div className="mt-5 pt-3 border-t border-[#1E2633] flex items-center justify-between text-xs text-[#8A93A6]">
          <span>Engine Model: <strong className="text-white">XGBoost Classifier v2.1</strong></span>
          <span className="text-[#3FB37F] font-mono">Response Time: 12ms</span>
        </div>
      )}
    </div>
  );
}
