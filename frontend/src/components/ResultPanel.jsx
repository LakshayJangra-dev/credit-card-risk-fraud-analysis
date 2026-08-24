import React from "react";
import Gauge from "./Gauge";
import { DecisionBadge, decisionTone, FactorsList } from "./ResultDisplay";

function EligibilityViolations({ eligibility }) {
  if (!eligibility || eligibility.eligible || !eligibility.violations?.length) {
    return null;
  }

  return (
    <div className="w-full max-w-[360px] mb-5 text-left">
      <h3 className="font-display text-[12px] font-semibold text-[#E5484D] uppercase tracking-wide mb-3">
        Bank Eligibility Failed
      </h3>

      <div className="flex flex-col gap-2.5">
        {eligibility.violations.map((violation, index) => (
          <div
            key={index}
            className="bg-[#E5484D]/10 border border-[#E5484D]/30 rounded-lg p-3"
          >
            <div className="font-display font-semibold text-[12.5px] text-[#E7EAF0] mb-1">
              {formatFieldName(violation.field)}
            </div>

            <div className="font-mono text-[11px] text-[#8A93A6] space-y-1">
              <div>
                Entered:{" "}
                <span className="text-[#E5484D]">
                  {formatValue(violation.entered)}
                </span>
              </div>

              <div>
                Allowed limit:{" "}
                <span className="text-[#E7EAF0]">
                  {formatLimit(violation)}
                </span>
              </div>

              <div className="text-[#E5484D] mt-1">
                ⚠ {violation.message}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatFieldName(field) {
  const names = {
    age: "Age",
    annual_income: "Annual Income",
    employment_years: "Employment (yrs)",
    debt_to_income: "Debt-to-Income",
    loan_to_income: "Loan-to-Income",
  };

  return names[field] || field;
}

function formatValue(value) {
  if (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 1000
  ) {
    return value.toLocaleString("en-IN");
  }

  return value;
}

function formatLimit(violation) {
  const field = violation.field;
  const limit = violation.limit;

  if (
    field === "debt_to_income" ||
    field === "loan_to_income"
  ) {
    return `${(limit * 100).toFixed(0)}%`;
  }

  if (
    field === "annual_income"
  ) {
    return `₹${Number(limit).toLocaleString("en-IN")}`;
  }

  return limit;
}

export default function ResultPanel({ tab, result, error }) {
  if (error) {
    return (
      <div className="text-[#E5484D] text-[13px] font-mono px-6 py-10 text-center">
        {error}
      </div>
    );
  }

  if (!result) {
    return (
      <div className="text-[#8A93A6] text-[13px] font-mono px-6 py-16 text-center">
        Run an assessment to see the risk breakdown here.
      </div>
    );
  }

  // --------------------------------------------------
  // CREDIT
  // --------------------------------------------------

  if (tab === "credit") {
    const tone = decisionTone(result.decision);

    const isIneligible =
      result.eligibility &&
      !result.eligibility.eligible;

    return (
      <>
        <Gauge
          fraction={
            result.credit_score
              ? result.credit_score / 850
              : 0
          }
          tone={tone}
          value={result.credit_score ?? 0}
          label={
            result.credit_score
              ? `Credit Score · ${result.risk_tier} · PD ${(result.probability_of_default * 100).toFixed(2)}%`
              : `Credit Score · ${result.risk_tier}`
          }
        />

        <DecisionBadge decision={result.decision} />

        <p className="text-[12.5px] text-[#8A93A6] max-w-[320px] mb-5">
          {result.reason}
        </p>

        {isIneligible && (
          <EligibilityViolations
            eligibility={result.eligibility}
          />
        )}

        {!isIneligible && (
          <FactorsList factors={result.top_factors} />
        )}
      </>
    );
  }

  // --------------------------------------------------
  // FRAUD
  // --------------------------------------------------

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

        <p className="text-[12.5px] text-[#8A93A6] max-w-[320px] mb-5">
          {result.reason}
        </p>

        <FactorsList factors={result.top_factors} />
      </>
    );
  }

  // --------------------------------------------------
  // COMBINED
  // --------------------------------------------------

  const ca = result.credit_assessment;
  const tone = decisionTone(result.final_decision);

  const isIneligible =
    ca?.eligibility &&
    !ca.eligibility.eligible;

  return (
    <>
      <Gauge
        fraction={
          ca.credit_score
            ? ca.credit_score / 850
            : 0
        }
        tone={tone}
        value={ca.credit_score ?? 0}
        label={
          ca.credit_score
            ? `Composite Risk ${(result.composite_risk_score * 100).toFixed(1)}% · Behavioral avg ${(result.behavioral_fraud_risk.avg_recent_txn_risk * 100).toFixed(0)}%`
            : `Composite Risk · ${ca.risk_tier}`
        }
      />

      <DecisionBadge decision={result.final_decision} />

      <p className="text-[12.5px] text-[#8A93A6] max-w-[320px] mb-5">
        {isIneligible
          ? ca.reason
          : result.notes.join(" ")}
      </p>

      {isIneligible && (
        <EligibilityViolations
          eligibility={ca.eligibility}
        />
      )}

      {!isIneligible && (
        <FactorsList factors={ca.top_factors} />
      )}
    </>
  );
}