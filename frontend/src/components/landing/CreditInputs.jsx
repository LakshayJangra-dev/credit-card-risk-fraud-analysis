import React from "react";

export default function CreditInputs({ inputs, setInputs }) {
  return (
    <>
      <div>
        <label className="block text-xs font-medium text-[#8A93A6] mb-1">Annual Income ($)</label>
        <input
          type="number"
          placeholder="e.g. 85000"
          value={inputs.annual_income}
          onChange={(e) => setInputs({ ...inputs, annual_income: e.target.value })}
          className="w-full input-dark px-3.5 py-2.5"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-[#8A93A6] mb-1">Late Payments (Past 2 Years)</label>
        <input
          type="number"
          placeholder="e.g. 0"
          value={inputs.num_late_payments_2y}
          onChange={(e) => setInputs({ ...inputs, num_late_payments_2y: e.target.value })}
          className="w-full input-dark px-3.5 py-2.5"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-[#8A93A6] mb-1">Debt to Income Ratio</label>
        <input
          type="number"
          step="0.01"
          placeholder="e.g. 0.15"
          value={inputs.debt_to_income}
          onChange={(e) => setInputs({ ...inputs, debt_to_income: e.target.value })}
          className="w-full input-dark px-3.5 py-2.5"
        />
      </div>
    </>
  );
}
