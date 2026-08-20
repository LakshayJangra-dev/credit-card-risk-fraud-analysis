import React, { useState } from "react";
import Header from "../components/Header";
import TabBar from "../components/TabBar";
import CreditForm from "../components/forms/CreditForm";
import FraudForm from "../components/forms/FraudForm";
import CombinedForm from "../components/forms/CombinedForm";
import ResultPanel from "../components/ResultPanel";
import { scoreCredit, scoreFraud, scoreCombined } from "../api/client";

export default function Dashboard() {
  const [tab, setTab] = useState("credit");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const switchTab = (t) => {
    setTab(t);
    setResult(null);
    setError("");
  };

  const runCredit = async (applicant) => {
    setLoading(true);
    setError("");
    try {
      setResult(await scoreCredit(applicant));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const runFraud = async (transaction) => {
    setLoading(true);
    setError("");
    try {
      setResult(await scoreFraud(transaction));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const runCombined = async (applicant, recentTxns) => {
    setLoading(true);
    setError("");
    try {
      setResult(await scoreCombined(applicant, recentTxns));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E1217] px-6 py-8 flex flex-col items-center">
      <div className="w-full max-w-[1080px]">
        <Header />
        <TabBar active={tab} onChange={switchTab} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-[#161B22] border border-[#262E39] rounded-[10px] p-5.5">
            {tab === "credit" && <CreditForm onRun={runCredit} loading={loading} />}
            {tab === "fraud" && <FraudForm onRun={runFraud} loading={loading} />}
            {tab === "combined" && <CombinedForm onRun={runCombined} loading={loading} />}
          </div>

          <div className="bg-[#161B22] border border-[#262E39] rounded-[10px] p-5.5 flex flex-col items-center text-center">
            <ResultPanel tab={tab} result={result} error={error} />
          </div>
        </div>

        <footer className="text-center font-mono text-[10.5px] tracking-wide text-[#8A93A6] mt-8">
          PROTOTYPE — SYNTHETIC DATA — NOT FOR PRODUCTION LENDING OR FRAUD DECISIONS
        </footer>
      </div>
    </div>
  );
}
