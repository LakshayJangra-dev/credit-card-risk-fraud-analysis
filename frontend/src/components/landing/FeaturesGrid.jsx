import React from "react";
import { Zap, Cpu, ShieldCheck } from "lucide-react";

export default function FeaturesGrid() {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto border-t border-[#1E2633]">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Engineered for Modern Credit & Fraud Risk Engine
        </h2>
        <p className="mt-4 text-[#8A93A6] text-base">
          Unified machine learning algorithms, velocity guardrails, and automated scorecards designed for real-time fintech execution.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-card glass-card-hover p-7 group">
          <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
            <Zap className="w-6 h-6 text-[#A78BFA]" />
          </div>
          <h3 className="font-display text-xl font-semibold text-white mb-2">Real-Time Anomaly Scoring</h3>
          <p className="text-[#8A93A6] text-sm leading-relaxed">
            Detect high-velocity transactions, international anomalies, and merchant category risks in milliseconds.
          </p>
        </div>

        <div className="glass-card glass-card-hover p-7 group">
          <div className="w-12 h-12 rounded-xl bg-[#FF6B4A]/10 border border-[#FF6B4A]/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
            <Cpu className="w-6 h-6 text-[#FF8F70]" />
          </div>
          <h3 className="font-display text-xl font-semibold text-white mb-2">ML Credit Scorecard (300-850)</h3>
          <p className="text-[#8A93A6] text-sm leading-relaxed">
            XGBoost and Gradient Boosted models calculate accurate Probability of Default (PD) mapped to credit risk tiers.
          </p>
        </div>

        <div className="glass-card glass-card-hover p-7 group">
          <div className="w-12 h-12 rounded-xl bg-[#3FB37F]/10 border border-[#3FB37F]/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-6 h-6 text-[#3FB37F]" />
          </div>
          <h3 className="font-display text-xl font-semibold text-white mb-2">JWT Secured REST APIs</h3>
          <p className="text-[#8A93A6] text-sm leading-relaxed">
            Standard Bearer tokens, SQLite user isolation, and instant session state restore in client applications.
          </p>
        </div>
      </div>
    </section>
  );
}
