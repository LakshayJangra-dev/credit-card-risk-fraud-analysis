import React from "react";
import Gauge from "./Gauge";
import { DecisionBadge, decisionTone, FactorsList } from "./ResultDisplay";

export default function ResultPanel({ tab, result, error }) {
  if (error) {
    return (
      <div className="text-[#E5484D] text-[13px] font-mono px-6 py-10 text-center">{error}</div>
    );
  }

  if (!result) {
    return (
      <div className="text-[#8A93A6] text-[13px] font-mono px-6 py-16 text-center">
        Run an assessment to see the risk breakdown here.
      </div>
    );
  }

  if (tab === "credit") {
    const tone = decisionTone(result.decision);
    return (
      <>
        <Gauge fraction={result.credit_score / 850} tone={tone} value={result.credit_score} label={`Credit Score · ${result.risk_tier} · PD ${(result.probability_of_default * 100).toFixed(2)}%`} />
        <DecisionBadge decision={result.decision} />
        <p className="text-[12.5px] text-[#8A93A6] max-w-[320px] mb-5">{result.reason}</p>
        <FactorsList factors={result.top_factors} />
      </>
    );
  }

  if (tab === "fraud") {
    const tone = decisionTone(result.decision);
    return (
      <>
        <Gauge
          fraction={result.blended_score}
          tone={tone}
          value={(result.blended_score * 100).toFixed(0)}
          label={`Fraud Score · supervised ${(result.supervised_score * 100).toFixed(0)}% · anomaly ${(result.anomaly_score * 100).toFixed(0)}%`}
        />
        <DecisionBadge decision={result.decision} />
        <p className="text-[12.5px] text-[#8A93A6] max-w-[320px] mb-5">{result.reason}</p>
        <FactorsList factors={result.top_factors} />
      </>
    );
  }

  // combined
  const ca = result.credit_assessment;
  const tone = decisionTone(result.final_decision);
  return (
    <>
      <Gauge
        fraction={ca.credit_score / 850}
        tone={tone}
        value={ca.credit_score}
        label={`Composite Risk ${(result.composite_risk_score * 100).toFixed(1)}% · Behavioral avg ${(result.behavioral_fraud_risk.avg_recent_txn_risk * 100).toFixed(0)}%`}
      />
      <DecisionBadge decision={result.final_decision} />
      <p className="text-[12.5px] text-[#8A93A6] max-w-[320px] mb-5">{result.notes.join(" ")}</p>
      <FactorsList factors={ca.top_factors} />
    </>
  );
}
