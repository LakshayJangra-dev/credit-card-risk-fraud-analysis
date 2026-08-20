import React from "react";

const GOOD_DECISIONS = new Set(["APPROVE", "ALLOW"]);
const WARN_DECISIONS = new Set(["REVIEW", "STEP_UP_AUTH"]);

export function decisionTone(decision) {
  if (GOOD_DECISIONS.has(decision)) return "good";
  if (WARN_DECISIONS.has(decision)) return "warn";
  return "bad";
}

const TONE_CLASSES = {
  good: "bg-[#3FB37F]/15 text-[#3FB37F] border-[#3FB37F]/35",
  warn: "bg-[#E8A33D]/15 text-[#E8A33D] border-[#E8A33D]/35",
  bad: "bg-[#E5484D]/15 text-[#E5484D] border-[#E5484D]/35",
};

export function DecisionBadge({ decision }) {
  const tone = decisionTone(decision);
  return (
    <div className={`font-display font-bold text-[15px] px-5 py-2 rounded-full border mb-1.5 tracking-wide ${TONE_CLASSES[tone]}`}>
      {decision}
    </div>
  );
}

export function FactorsList({ factors }) {
  if (!factors || factors.length === 0) return null;
  const maxAbs = Math.max(...factors.map((f) => Math.abs(f.impact)), 0.001);

  return (
    <div className="w-full text-left">
      <h3 className="font-display text-[12px] font-semibold text-[#8A93A6] uppercase tracking-wide mb-2.5">
        Top Contributing Factors
      </h3>
      <div className="flex flex-col gap-2">
        {factors.map((f) => {
          const pct = Math.min((Math.abs(f.impact) / maxAbs) * 50, 50);
          const up = f.direction === "increases_risk";
          return (
            <div key={f.feature} className="flex items-center gap-2.5 text-[12px]">
              <div className="flex-none w-[150px] text-[#E7EAF0] font-medium truncate">{f.label}</div>
              <div className="flex-1 h-[7px] bg-[#1B222B] rounded-full relative overflow-hidden">
                <div
                  className="absolute top-0 bottom-0 rounded-full"
                  style={{
                    width: `${pct}%`,
                    background: up ? "#E5484D" : "#3FB37F",
                    [up ? "left" : "right"]: "50%",
                  }}
                />
              </div>
              <div className="flex-none w-[54px] text-right font-mono text-[11px] text-[#8A93A6]">
                {f.impact > 0 ? "+" : ""}
                {f.impact}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
