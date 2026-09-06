import React, { useState } from "react";
import { Activity, Sliders } from "lucide-react";
import CreditInputs from "./CreditInputs";
import FraudInputs from "./FraudInputs";
import SimulatorOutput from "./SimulatorOutput";

export default function RiskSimulator() {
  const [demoType, setDemoType] = useState("credit"); // 'credit' | 'fraud'
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoResult, setDemoResult] = useState(null);

  const [creditInputs, setCreditInputs] = useState({
    annual_income: "",
    num_late_payments_2y: "",
    debt_to_income: "",
  });

  const [fraudInputs, setFraudInputs] = useState({
    amount: "",
    distance_from_home: "",
    velocity_1h: "",
  });

  const runLiveDemo = async () => {
    setDemoLoading(true);
    setDemoResult(null);

    try {
      if (demoType === "credit") {
        const income = Number(creditInputs.annual_income) || 85000;
        const latePayments = Number(creditInputs.num_late_payments_2y) || 0;
        const dti = Number(creditInputs.debt_to_income) || 0.14;

        const pd = Math.max(
          0.01,
          Math.min(
            0.95,
            latePayments * 0.15 + dti * 0.4 - (income > 100000 ? 0.05 : 0) + 0.04
          )
        );
        const score = Math.round(850 - pd * 550);
        let tier = "Excellent";
        let recommendation = "APPROVE";
        let tierColor = "text-[#3FB37F]";
        let badgeBg = "bg-[#3FB37F]/10 border-[#3FB37F]/30 text-[#3FB37F]";

        if (score < 580) {
          tier = "Very Poor";
          recommendation = "REJECT";
          tierColor = "text-[#FF6B4A]";
          badgeBg = "bg-[#FF6B4A]/10 border-[#FF6B4A]/30 text-[#FF6B4A]";
        } else if (score < 670) {
          tier = "Fair";
          recommendation = "REVIEW";
          tierColor = "text-[#E8A33D]";
          badgeBg = "bg-[#E8A33D]/10 border-[#E8A33D]/30 text-[#E8A33D]";
        } else if (score < 740) {
          tier = "Good";
          recommendation = "APPROVE";
          tierColor = "text-[#4C8BF5]";
          badgeBg = "bg-[#4C8BF5]/10 border-[#4C8BF5]/30 text-[#4C8BF5]";
        }

        setDemoResult({
          type: "credit",
          score,
          tier,
          tierColor,
          badgeBg,
          pd_percentage: (pd * 100).toFixed(1),
          recommendation,
          inputs_used: { income, latePayments, dti },
        });
      } else {
        const amount = Number(fraudInputs.amount) || 1250;
        const dist = Number(fraudInputs.distance_from_home) || 450;
        const velocity = Number(fraudInputs.velocity_1h) || 4;

        const riskScore = Math.min(
          0.99,
          (amount > 1000 ? 0.45 : 0.1) + (dist > 200 ? 0.35 : 0.05) + (velocity > 3 ? 0.2 : 0)
        );

        let decision = "APPROVED";
        let badgeBg = "bg-[#3FB37F]/10 border-[#3FB37F]/30 text-[#3FB37F]";
        if (riskScore > 0.6) {
          decision = "FLAGGED_HIGH_RISK";
          badgeBg = "bg-[#FF6B4A]/10 border-[#FF6B4A]/30 text-[#FF6B4A]";
        } else if (riskScore > 0.35) {
          decision = "REQUIRES_2FA";
          badgeBg = "bg-[#E8A33D]/10 border-[#E8A33D]/30 text-[#E8A33D]";
        }

        setDemoResult({
          type: "fraud",
          risk_score: (riskScore * 100).toFixed(0),
          risk_decimal: riskScore.toFixed(2),
          decision,
          badgeBg,
          is_anomaly: dist > 300,
          velocity_warning: velocity > 3,
          inputs_used: { amount, dist, velocity },
        });
      }
    } catch {
      setDemoResult({ error: "Failed to evaluate demo model." });
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-[#11161F] border border-[#262E39] rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="badge-purple">
              Interactive AI Engine Simulator
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-2">
              Test the Risk Engine Live
            </h2>
          </div>

          {/* Toggle demo model */}
          <div className="flex bg-[#0A0D12] p-1 rounded-xl border border-[#262E39]">
            <button
              onClick={() => {
                setDemoType("credit");
                setDemoResult(null);
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                demoType === "credit" ? "bg-[#8B5CF6] text-white shadow-md" : "text-[#8A93A6] hover:text-white"
              }`}
            >
              Credit Scoring
            </button>
            <button
              onClick={() => {
                setDemoType("fraud");
                setDemoResult(null);
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                demoType === "fraud" ? "bg-[#FF6B4A] text-white shadow-md" : "text-[#8A93A6] hover:text-white"
              }`}
            >
              Fraud Detection
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Controls */}
          <div className="space-y-4">
            {demoType === "credit" ? (
              <CreditInputs inputs={creditInputs} setInputs={setCreditInputs} />
            ) : (
              <FraudInputs inputs={fraudInputs} setInputs={setFraudInputs} />
            )}

            <button
              onClick={runLiveDemo}
              disabled={demoLoading}
              className="w-full mt-4 btn-gradient-purple py-3 flex items-center justify-center gap-2"
            >
              {demoLoading ? (
                <>
                  <Activity className="w-4 h-4 animate-spin" /> Evaluating ML Model...
                </>
              ) : (
                <>
                  <Sliders className="w-4 h-4" /> Evaluate {demoType === "credit" ? "Credit Score" : "Fraud Risk"}
                </>
              )}
            </button>
          </div>

          {/* Formatted Output UI Card */}
          <SimulatorOutput demoResult={demoResult} />
        </div>
      </div>
    </div>
  );
}
